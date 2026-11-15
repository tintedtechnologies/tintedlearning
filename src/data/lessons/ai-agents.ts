import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiEmbed, appPlanner, assistant, configEmbed, db, extract, notesStore, planner, rag, schemas, testPlanner } from './study-tracker'

const plannerFiles = { 'config.py': configEmbed, 'ai.py': aiEmbed, 'db.py': db, 'planner.py': planner }

const lesson: StructuredLesson = {
  assumes: 'Tool Calling, with `ai.py`\'s `chat()` and the tool-calling loop in `assistant.py`. The model you use must support tools.',
  goals: [
    'Describe the agent loop: plan, act, check and decide',
    'Build an agent whose work is checked by your code and which stops within a step limit',
    'Keep a person in charge by asking for approval before any action takes effect',
  ],
  bigIdea: "An AI agent is a model running in a loop: it plans, uses tools to act, checks the results and decides whether it is done, repeating until the goal is met or a limit is reached. That lets it handle tasks with several steps that a single prompt cannot. Because it acts with less supervision, it needs firm limits, and a person's approval before anything important happens.",
  whyItMatters: "A good study week depends on things the model cannot guess: what you have studied, which subjects are behind and how much time you have. One prompt produces a generic plan. An agent can look up your totals, draft a plan, have your code check it against your rules, fix what fails and hand you a finished plan. But an agent that quietly rewrote your schedule, or looped all night calling a paid model, would be worse than no agent. This lesson builds both the engine and the brakes.",
  goalSections: [
    {
      heading: 'The agent loop',
      paragraphs: [
        "Every agent repeats four steps. Plan: the model reads the goal, the tools and everything so far, and decides what to do next. Act: it calls a tool, and your code runs it. Check: the results come back, including any problems your code found. Decide: it is done, it tries again, or a limit stops it.",
        "This is the loop from Tool Calling with one difference: the model is working toward a goal over several steps, and may need to correct itself along the way.",
        "Not every multi-step task needs an agent. When you know the steps in advance, such as \"search notes, then answer\", ordinary code that calls the model at fixed points is simpler, cheaper and more predictable. That is called a workflow. Use an agent when the next step depends on what the last one found.",
      ],
      example: {
        language: 'text',
        code: code`
          Goal: plan my study week
          Step 1  plan:   look at what has been studied first
                  act:    get_totals -> {"algebra": 120, "biology": 30}
          Step 2  plan:   biology is behind, so give it more time
                  act:    submit_plan (biology twice on Nov 15, algebra Nov 17)
                  check:  problem: "more than one session on the same day"
          Step 3  decide: fix it and resubmit
                  act:    submit_plan (biology Nov 15 and 16, algebra Nov 17)
                  check:  no problems -> done, shown to the learner
        `,
      },
    },
    {
      heading: 'Checks and limits in code',
      paragraphs: [
        "The planner never just announces that it is finished. It must call `submit_plan`, and your code checks the submission. Pydantic enforces the shape and at most 90 minutes per session. A small function, `plan_problems()`, enforces rules that span the whole plan: one session per day, all within next week.",
        "Problems go back to the model as the tool's result, so it can fix them, which is the check step working. The rules live in code, so they hold however the model behaves. The system prompt mentions them only to help the model get it right first time.",
        "A step limit, `MAX_STEPS = 6`, caps the loop. Every step is a model call that costs time and possibly money, and a confused model can repeat the same mistake forever. When the limit is reached, the agent stops with a clear error. The planner's tools are also limited: one reads totals, and the other only submits a plan for checking. Neither can save anything.",
      ],
      example: {
        language: 'python',
        files: plannerFiles,
        code: code`
          import json
          from datetime import date

          from planner import check_submission

          start, end = date(2026, 3, 7), date(2026, 3, 13)
          too_long = {"sessions": [{"subject": "algebra", "minutes": 120, "planned_on": "2026-03-07"}]}
          same_day = {"sessions": [
              {"subject": "algebra", "minutes": 60, "planned_on": "2026-03-07"},
              {"subject": "biology", "minutes": 45, "planned_on": "2026-03-07"},
          ]}
          print(check_submission(json.dumps(too_long), start, end)[1])
          print(check_submission(json.dumps(same_day), start, end)[1])
        `,
        output: "['sessions.0.minutes: Input should be less than or equal to 90']\n['more than one session on the same day']",
      },
    },
    {
      heading: 'Approval before action',
      paragraphs: [
        "The agent proposes and the learner decides. `POST /plans/draft` runs the agent and returns the plan without saving it. The app shows the plan, the learner can change it, and only `POST /plans/approve` saves it. This is often called keeping a human in the loop.",
        "The approval endpoint checks the plan again with the same rules. The plan now comes from the learner's app rather than the agent, and input from any client is checked, however it was made.",
        "Match the approval to the risk. Reading totals needs none. Saving a study plan needs one click. Anything permanent, public or costly, such as deleting data, sending a message or spending money, should always show exactly what will happen and wait for a clear yes.",
      ],
      example: {
        language: 'text',
        code: code`
          POST /plans/draft
            200 {"sessions": [{"subject": "biology", "minutes": 60, "planned_on": "2026-11-15"}, ...]}
            (nothing saved)

          The learner reviews the plan, then:
          POST /plans/approve  {"sessions": [...]}
            201 {"saved": 3}

          POST /plans/approve  {"sessions": [{"subject": "x", "minutes": 30, "planned_on": "2030-01-01"}]}
            400 {"detail": ["2030-01-01 is outside 2026-11-15 to 2026-11-21"]}
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s planner.py',
    intro: "Here is the planning agent. The trace in The agent loop and the requests in Approval before action came from running it with a model connected. A real model's plan will differ, but the checks and limits behave exactly as shown.",
    example: { language: 'python', filename: 'planner.py', code: planner, runnable: false, files: plannerFiles },
    steps: [
      { code: 'minutes: int = Field(gt=0, le=MAX_MINUTES_PER_DAY)', explanation: "The 90-minute rule is enforced by the model class, so no plan breaking it can pass, whatever the prompt says." },
      { code: 'If submit_plan returns problems, fix every problem and call submit_plan again.', explanation: "The system prompt describes the loop the code expects. It helps the model, but the code does not rely on it." },
      { code: '"description": "Submit the finished plan for checking. It is shown to the learner, not saved."', explanation: "The tool's description tells the truth about what it does. The agent has no tool that saves anything." },
      { code: 'for step in range(1, MAX_STEPS + 1):', explanation: "The loop can run at most six times. A plan that takes longer is not worth the cost, and something is probably wrong." },
      { code: 'if not calls:\n    messages.append({"role": "user", "content": "Please submit the plan with submit_plan."})', explanation: "If the model writes a plan as text instead of calling the tool, the code nudges it back. Only a checked submission can end the loop." },
      { code: 'result = {"problems": problems}', explanation: "A rejected plan goes back as the tool result. In the real run, the model read \"more than one session on the same day\" and fixed it on the next step." },
      { code: 'raise AIError(f"no acceptable plan within {MAX_STEPS} steps")', explanation: "The brake. The endpoint turns this into a 503 with a friendly message, and nothing has been saved." },
      { code: 'def save_plan(plan):\n    """Save an approved plan. Only called after the learner approves it."""', explanation: "Saving is separate from planning, and only the approval endpoint calls it. The agent cannot reach it." },
    ],
  },
  tryIt: {
    instructions: [
      'Add `planner.py` and replace `app.py` with the version below. Log a few sessions first, so the agent has totals to plan around.',
      'In `/docs`, call `POST /plans/draft`. Read the log lines to follow the agent\'s steps. Then approve the plan through `POST /plans/approve`, and try approving one with a date outside next week.',
      'Add `test_planner.py` and run `python -m pytest`. The tests script the model, including one that never gets it right, to prove the step limit works.',
      'Add a rule to `plan_problems()`: at most three sessions per subject. Add a test that sends four, then open the AI agents playground and compare its approve and deny step with yours.',
    ],
    playground: 'agents',
    files: [
      { language: 'python', filename: 'app.py', code: appPlanner, runnable: false },
      { language: 'python', filename: 'test_planner.py', code: testPlanner, files: { ...plannerFiles, 'schemas.py': schemas, 'extract.py': extract, 'assistant.py': assistant, 'notes.py': notesStore, 'rag.py': rag }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Letting an agent loop with no step limit.', fix: 'Cap the number of steps and stop with a clear error, so a confused model cannot run up time and cost.' },
    { mistake: 'Giving an agent tools that make permanent changes.', fix: 'Give agents read-only tools and a way to propose. Let a person approve, and let separate code carry out the action.' },
    { mistake: 'Trusting the agent to check its own work.', fix: 'Put the rules in code and send problems back as tool results. The model fixes, and the code decides.' },
    { mistake: 'Building an agent for a task with fixed steps.', fix: 'If you know the steps in advance, write a workflow that calls the model at each one. It is cheaper and more predictable.' },
  ],
  quiz: [
    {
      question: 'With `MAX_STEPS = 6`, the model keeps submitting plans with a date outside next week. What happens?',
      options: [
        { text: 'The last plan it submitted is saved anyway', explanation: 'A plan that fails the checks is never returned, and drafting never saves.' },
        { text: 'After six steps the agent stops with an error, the endpoint returns 503 and nothing is saved', explanation: 'The step limit is the brake. Nothing was saved at any point.' },
        { text: 'The loop runs until the model gets it right', explanation: 'That is exactly what the step limit prevents.' },
        { text: 'The code fixes the dates itself', explanation: 'The code reports problems. It never quietly changes the model\'s plan.' },
      ],
      answer: 1,
    },
    {
      question: 'Which part of the planner guarantees that no planned session is longer than 90 minutes?',
      options: [
        { text: 'The system prompt, which says each session is at most 90 minutes', explanation: 'The prompt helps the model get it right, but a model can ignore it.' },
        { text: 'The model\'s training', explanation: 'The model knows nothing about Study Tracker\'s rules.' },
        { text: 'The learner, when approving', explanation: 'The learner reviews the plan, but the rule is enforced before they see it.' },
        { text: 'The `PlannedSession` model in the code, with `le=MAX_MINUTES_PER_DAY`', explanation: 'Every submission is validated against it, so no plan breaking the rule gets through.' },
      ],
      answer: 3,
    },
    {
      question: 'A learner calls `POST /plans/draft`. What is in `study.db` afterward?',
      options: [
        { text: 'Nothing new: the plan is returned for review, and only `POST /plans/approve` saves it', explanation: 'Drafting and saving are separate, so the learner decides.' },
        { text: 'The plan, saved as planned sessions', explanation: 'The agent has no tool that saves, and drafting never calls `save_plan()`.' },
        { text: 'The plan, saved as completed study sessions', explanation: 'A plan is not completed study, and nothing is saved while drafting.' },
        { text: 'Every step the agent took', explanation: 'Steps appear in the log, not the database.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'An agent loops through plan, act, check and decide, so give it limited tools, put the rules and a step limit in code, and let a person approve before anything it proposes takes effect.',
  resources: [
    { title: 'Building effective agents', provider: 'Anthropic', description: 'When to use workflows and when to use agents, with common patterns.', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
    { title: 'Thought, action, observation', provider: 'Hugging Face Agents Course', description: 'A free walk through the steps of the agent loop.', url: 'https://huggingface.co/learn/agents-course/unit1/agent-steps-and-structure' },
    { title: 'Excessive agency', provider: 'OWASP', description: 'The security risk of giving AI agents more permission than they need.', url: 'https://genai.owasp.org/llmrisk/llm062025-excessive-agency/' },
  ],
  underTheHood: {
    heading: 'Why long agent tasks fail more often',
    paragraphs: [
      "Small error rates compound. Suppose an agent gets each step right 95% of the time, which sounds reliable. For a 10-step task to succeed, all 10 steps must be right: 0.95 multiplied by itself 10 times is about 0.60, so the task fails about 4 times in 10. At 20 steps it succeeds only about 36% of the time.",
      "Worse, an early mistake becomes part of the context for every later step. An agent that misreads the totals in step 1 plans the whole week around the wrong numbers, confidently.",
      "This is why the design in this lesson works. Checks in code catch a bad step before it spreads and give the model a chance to fix it, which resets the odds. Short loops with a firm step limit keep tasks small. And a person approving the final result is one more independent check at the point where mistakes would start to matter.",
    ],
  },
}

export default lesson
