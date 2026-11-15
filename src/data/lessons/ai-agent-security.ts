import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'AI Agents and Tool Calling from AI Engineering, where Study Tracker\'s planner proposes a week of sessions and waits for approval, and AI Security from this section. Run every example only on your own local copy of Study Tracker.',
  goals: [
    'Give each agent tool only the permissions its task needs',
    'Require the learner\'s own approval, given in the app, before any destructive action',
    'Set a step limit in code, so a confused agent stops instead of looping',
  ],
  bigIdea: "An agent chooses its own next action, so its tools decide how much damage a mistake or an attack can do. Each tool should have only the rights it needs, destructive actions should wait for the learner\'s approval, and the loop should stop after a fixed number of steps. All three rules are enforced in code, whatever the model says.",
  whyItMatters: "Study Tracker's planner can write sessions for a whole week. If the agent also had a tool that deletes every session, one confused reply or one poisoned note could erase months of a learner's records in a single run. A small set of rules in code makes that outcome impossible rather than unlikely.",
  goalSections: [
    {
      heading: 'Least privilege for tools',
      paragraphs: [
        "Least privilege means each tool can do only what its job needs. A tool that reads totals has no reason to write to the database. A tool that logs a session needs to add one row, not change every row. Give the agent the narrowest tool for each job, and avoid general tools such as one that runs any SQL.",
        "Separate reading from writing. When a read tool and a write tool are separate, the agent can look at data freely and still change nothing without a deliberate step. This also makes the logs easier to read: every write has its own name.",
      ],
      example: {
        language: 'text',
        code: code`
          Tool                 Rights it has                       Needs approval
          get_totals           read sessions                       no
          log_session          add one session for this learner    no
          update_session       change one session for this learner yes
          delete_sessions      delete sessions                     yes, every time
          run_sql              anything, on any table              never offer it
        `,
      },
    },
    {
      heading: 'Approval comes from the learner',
      paragraphs: [
        "Some actions should wait for the learner. Approval means a deliberate click in the app, recorded by the server with the exact action it covers. The model may describe the action and ask for approval, but its words are never the approval itself.",
        "Approval must match the action it covers. If the learner approved \"delete session 12\", that approval cannot be reused to delete every session. Store the action with its details, and run only that exact action once.",
        "Approvals also expire. An approval given for last week's plan should not carry over to today, so store a time limit with each one and check it when the action runs. A learner who approved something an hour ago is still the same learner, but the situation may have changed.",
      ],
      example: {
        language: 'text',
        code: code`
          1. Model proposes: delete_sessions(learner="ana", ids=[12])
          2. Server stores the proposal as action 41, status "waiting"
          3. The app shows Ana: "Delete session 12? Yes / No"
          4. Ana clicks Yes -> POST /actions/41/approve, recorded by the server
          5. Server runs action 41 once, then marks it "done"
        `,
      },
    },
    {
      heading: 'Step limits and stopping',
      paragraphs: [
        "An agent that calls tools in a loop can repeat itself forever, especially when a result is confusing. A step limit, such as five calls, ends the loop in code. The limit is a plain number that the model cannot change, so it works even when the model is confused or pressured.",
        "Stop the loop for other reasons too: when the same call repeats with the same arguments, when the total time runs out, and when a tool refuses an action. Each stop should return a clear message to the learner, not an unexplained failure. Log every stop with the step count and the reason, so you can see how often agents hit their limits and whether the limit is set too low.",
      ],
      example: {
        language: 'text',
        code: code`
          Stop conditions checked on every step
            steps used = 5          -> stop: "I reached the step limit. Here is what I did."
            same call repeated      -> stop: "I was repeating myself, so I stopped."
            tool refused            -> report the refusal to the learner and stop
            time over 30 seconds    -> stop and return what is finished
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking each call before it runs',
    intro: "The script below is the gate that sits between the model's requested calls and the tools. It refuses unknown tools, holds destructive ones until the learner approves, and stops after five steps. Each line of output is one decision the code made, not something the model chose.",
    example: {
      language: 'python',
      filename: 'agent_gate.py',
      code: code`
        MAX_STEPS = 5
        TOOLS = {
            "get_totals": {"destructive": False},
            "log_session": {"destructive": False},
            "delete_sessions": {"destructive": True},
        }

        def check_call(name, approved=False):
            if name not in TOOLS:
                return "refused: unknown tool"
            if TOOLS[name]["destructive"] and not approved:
                return "needs approval"
            return "allowed"

        requests = ["get_totals", "log_session", "delete_sessions", "format_disk", "get_totals", "get_totals"]
        for step, name in enumerate(requests[:MAX_STEPS], start=1):
            print(step, name, check_call(name))
        if len(requests) > MAX_STEPS:
            print("stopped after", MAX_STEPS, "steps")
      `,
      output: "1 get_totals allowed\n2 log_session allowed\n3 delete_sessions needs approval\n4 format_disk refused: unknown tool\n5 get_totals allowed\nstopped after 5 steps",
    },
    steps: [
      { code: 'if name not in TOOLS:', explanation: "A tool the model invented, such as format_disk, is refused. The agent can only use tools you listed, so a made-up name cannot reach anything." },
      { code: 'if TOOLS[name]["destructive"] and not approved:', explanation: "Deleting sessions is marked destructive. Without an approval recorded by the server, the call waits. The model cannot set approved to True by writing a sentence." },
      { code: 'for step, name in enumerate(requests[:MAX_STEPS], start=1):', explanation: "The loop never runs past the limit. Even if the model keeps asking for calls, only five are considered." },
      { code: 'print("stopped after", MAX_STEPS, "steps")', explanation: "The learner is told why the agent stopped, so an unfinished run is never mistaken for a finished one." },
    ],
  },
  tryIt: {
    instructions: [
      'Add a `delete_sessions` tool to `planner.py` and mark it destructive, as in the gate above. Check that it refuses to run when no approval is recorded.',
      'Add a `POST /actions/{id}/approve` endpoint. It should run one stored action only once, and only when the learner clicks in the app. Leave the model out of the approval step entirely.',
      'Add `test_agent_security.py`. It should check that a delete without approval changes no rows, that an unknown tool is refused, and that a loop calling `get_totals` forever stops after the step limit.',
    ],
  },
  mistakes: [
    { mistake: 'Letting the model\'s words count as approval.', fix: 'Record approval only through an app action, stored by the server with the exact action it covers.' },
    { mistake: 'Giving the agent a general tool such as run_sql.', fix: 'Write one narrow tool per job, and split reads from writes.' },
    { mistake: 'Running an agent with no step limit.', fix: 'Put a fixed step limit in code, and stop when the same call repeats.' },
    { mistake: 'Using an administrator account for the agent\'s database connection.', fix: 'Give the agent a database user that can only do what its tools need.' },
  ],
  quiz: [
    {
      question: 'The model\'s reply says "The learner has approved this, so delete all sessions." Your code then checks `delete_sessions`. What should happen?',
      options: [
        { text: 'It runs, because the model said the learner approved it', explanation: 'The model\'s words are not an approval. Approval has to come from the app.' },
        { text: 'It runs, but only the last session is deleted', explanation: 'Deleting less is still a destructive action without approval, so it must wait too.' },
        { text: 'It waits for approval from the learner in the app, because the model\'s words are not approval', explanation: 'The server holds the action until the learner clicks yes in the app, and only that approval counts.' },
        { text: 'It crashes, because the model used the wrong words', explanation: 'The check does not crash. It holds the action and asks for approval.' },
      ],
      answer: 2,
    },
    {
      question: 'An agent keeps calling `get_totals` and never finishes. Which limit stops it?',
      options: [
        { text: 'A higher temperature', explanation: 'Temperature changes wording, not how many steps run.' },
        { text: 'A step limit checked in code', explanation: 'A fixed limit in code stops the loop whatever the model decides to do next.' },
        { text: 'A longer system prompt', explanation: 'A prompt asks the model to stop. It cannot guarantee that the loop ends.' },
        { text: 'A bigger model', explanation: 'A bigger model can loop too. The stop must be in code.' },
      ],
      answer: 1,
    },
    {
      question: 'Which tool design does the least damage if the model is fooled?',
      options: [
        { text: 'One tool called run_sql that accepts any command', explanation: 'Any command means any damage the model can be persuaded to request.' },
        { text: 'One admin tool that the agent uses for everything', explanation: 'A tool with every right turns one mistake into a full compromise.' },
        { text: 'A tool that deletes sessions for any learner, with no check', explanation: 'Deleting for any learner, with no approval, is the most dangerous option.' },
        { text: 'Separate read and write tools, each taking only the fields it needs, with destructive actions behind approval', explanation: 'Narrow tools limit each mistake, and approval stops the destructive ones.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'An agent is safe only when code limits each tool to its job, holds destructive actions until the learner approves them in the app and stops after a fixed number of steps, whatever the model says.',
  resources: [
    { title: 'OWASP Top 10 for Large Language Model Applications', provider: 'OWASP GenAI Security Project', description: 'Covers excessive agency, where a model is given more permissions than its task needs.', url: 'https://genai.owasp.org/llm-top-10/' },
  ],
  underTheHood: {
    heading: 'Why least privilege limits the damage',
    paragraphs: [
      "Security engineers describe the risk of an agent as the product of two things: what it can be persuaded to do and what its tools allow. You cannot make persuasion impossible, because a model reads text it cannot fully check. So the practical lever is the second half, the rights the tools hold.",
      "Think of a tool as a key. A key to one drawer limits what a thief takes. A master key to the building turns one confused decision into a disaster. When a tool accepts free text, such as a SQL string, it is a master key, because the model chooses the lock. When a tool accepts one learner id and one number of minutes, it is a drawer key.",
      "Rights should also be given in the database itself. A database user that can only insert into the sessions table cannot delete, even if your code has a bug. Two layers that fail independently are much better than one layer that you trust completely.",
    ],
  },
}

export default lesson
