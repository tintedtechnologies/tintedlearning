import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Everything earlier in this Security section, Docker and Cloud Engineering (where Study Tracker runs as a service). The tabletop exercise runs on your own copy of Study Tracker and uses made-up learners.',
  goals: [
    'Run a pre-release security checklist that checks configuration in code, not from memory',
    'Set up monitoring for signals that are specific to AI features, such as refusals, flags, tool writes and cost',
    'Follow the first hour of an incident: contain the problem, keep the evidence, then fix and review',
  ],
  bigIdea: "A secure AI feature is one you can release, watch and recover. Before release, configuration checks confirm it is safe, and while it runs, monitoring looks for the signals attacks leave behind. When something goes wrong, a written plan tells the team what to do in the first hour, so they contain the damage before they explain it.",
  whyItMatters: "Study Tracker will eventually run for a whole university. Someone will misconfigure a setting, a key will leak, or a learner will find a way to make the assistant misbehave. A team that has checked its configuration, watches the right signals and has practiced one incident responds in minutes. A team without those things spends the first day finding out what happened.",
  goalSections: [
    {
      heading: 'Run the checklist before release',
      paragraphs: [
        "A checklist turns the earlier lessons into yes-or-no questions. Is debug mode off? Are keys read from the environment, not from code? Is the input limit set? Are prompts kept out of the logs? Is there a step limit for every agent? Answer each one with a check the program runs, so the answer does not depend on who remembers what.",
        "Keep the checklist in the repository and run it in continuous integration, so a release cannot ship with a failing check. Review the checklist after every incident, and add a new check for whatever went wrong. A check that a person must remember to run will eventually be skipped on the day it matters most.",
      ],
      example: {
        language: 'text',
        code: code`
          Check                          Why it matters
          debug mode is off              stack traces and internal details stay private
          keys come from the environment no key appears in code or in a commit
          input and budget limits set    protects the shared budget
          prompts are not logged         personal data stays out of the logs
          agent step limit set           loops stop
          no wildcard origins            only the web app can call the API from a browser
        `,
      },
    },
    {
      heading: 'Monitor for signals specific to AI',
      paragraphs: [
        "Ordinary monitoring checks whether the app is up and fast. AI features need more. Watch for the signals that attacks and misuse leave behind: refusals and flags per account, write tools called more often than usual, a sudden jump in tokens, and failed sign-ins. Each one is a question for a human to look at.",
        "Set alerts on rates, not single events. One refused request is normal. Three hundred in ten minutes from one account is a pattern worth a page. Send alerts to someone who can act on them, and record who received each one. Test the alerts too: trigger a harmless test event and check that the right person receives it, because an alert nobody gets is the same as no alert.",
      ],
      example: {
        language: 'text',
        code: code`
          Signal                                        Alert when
          refused or flagged requests per account       sudden rise for one account
          write tool calls per hour                     above the usual level for the day
          tokens used per hour                          above the budget pace
          failed sign-ins                               many from one address
          errors from the model provider                repeated failures in a few minutes
        `,
      },
    },
    {
      heading: 'The first hour of an incident',
      paragraphs: [
        "The first hour is about containment, not explanation. Stop the damage first: turn off the affected AI feature with a switch that does not need a deploy, pause the account, and rotate any key that may have leaked. Each action should be written down with the time it was taken.",
        "Keep the evidence while you work. Save the logs for the affected period before any cleanup deletes them, and do not edit them. Then assess what was touched, who may be affected and what must be reported. Fix the cause only after the damage is stopped and the evidence is safe.",
      ],
      example: {
        language: 'text',
        code: code`
          Time        Action
          0 to 10 min  switch off the assistant's write tools, note the time
          10 to 20 min pause the flagged account, save the logs for the window
          20 to 40 min rotate the model key, check its usage since the leak
          40 to 60 min list who was affected, decide what must be reported
          after      fix the cause, test it, write a blameless review
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A pre-release checklist that runs in code',
    intro: "The script below checks the configuration Study Tracker would ship with. Each check is a question with a yes or no answer, and the script prints the result of every one. Run it before each release, and treat any FAIL as a blocker.",
    example: {
      language: 'python',
      filename: 'release_check.py',
      code: code`
        CONFIG = {
            "debug": False,
            "log_prompts": False,
            "max_input_chars": 2000,
            "daily_token_limit": 50000,
            "allow_origins": ["https://study.example.com"],
            "agent_step_limit": 5,
        }

        CHECKS = [
            ("debug is off", lambda c: c["debug"] is False),
            ("prompts are not logged", lambda c: c["log_prompts"] is False),
            ("input limit is set", lambda c: c["max_input_chars"] <= 5000),
            ("budget is set", lambda c: c["daily_token_limit"] > 0),
            ("agent step limit is set", lambda c: 1 <= c["agent_step_limit"] <= 10),
            ("no wildcard origins", lambda c: "*" not in c["allow_origins"]),
        ]

        failed = [name for name, check in CHECKS if not check(CONFIG)]
        for name, check in CHECKS:
            print("ok" if check(CONFIG) else "FAIL", name)
        print(len(failed), "checks failed")
      `,
      output: "ok debug is off\nok prompts are not logged\nok input limit is set\nok budget is set\nok agent step limit is set\nok no wildcard origins\n0 checks failed",
    },
    steps: [
      { code: '"debug": False,', explanation: "Each setting is written down in one place, so the checklist reads the same configuration the release will use." },
      { code: '("prompts are not logged", lambda c: c["log_prompts"] is False)', explanation: "Each check is a small function that returns True or False. Writing them as data means adding a check is one new line." },
      { code: 'failed = [name for name, check in CHECKS if not check(CONFIG)]', explanation: "Collects every failing check, so the team sees all the problems at once, not one per run." },
      { code: 'print(len(failed), "checks failed")', explanation: "The final line is the release decision. Zero means the configuration passed. Anything else blocks the release until it is fixed." },
    ],
  },
  tryIt: {
    instructions: [
      'Turn the checklist table above into `release_check.py` for your Study Tracker, with one check per row. Read each setting from the configuration module, not from a copied value.',
      'Add a switch in `config.py` that turns off the assistant\'s write tools without a redeploy, and test that a request which would have written a session is refused while the switch is on.',
      'Run a tabletop exercise: write the scenario "a provider key appears in a public log" on one page, then fill in the first-hour table for it. Name the owner of each step and the time limit. Keep the page with your project.',
    ],
  },
  mistakes: [
    { mistake: 'Shipping debug mode or wildcard origins because they were convenient during testing.', fix: 'Run the release check in continuous integration, and block the release on any failure.' },
    { mistake: 'Watching only uptime and speed.', fix: 'Add alerts for AI-specific signals, such as refusals, write tool calls and token use per account.' },
    { mistake: 'Deleting logs during cleanup before anyone has read them.', fix: 'Save the logs for the affected window first, and leave the original copies unedited.' },
    { mistake: 'Writing the incident plan but never practicing it.', fix: 'Run a tabletop exercise each quarter, and update the plan with what it revealed.' },
  ],
  quiz: [
    {
      question: 'The release check shows that the app logs full prompts, including notes. What is the right action?',
      options: [
        { text: 'Release, since logs help with debugging', explanation: 'Personal data in logs is a real risk, and the check exists to stop exactly this.' },
        { text: 'Turn off full prompt logging, or restrict and expire it, then run the check again', explanation: 'Fixing the setting and re-running the check blocks the release until the risk is gone.' },
        { text: 'Log prompts only on Fridays', explanation: 'Limiting the days does not remove the personal data from the logs.' },
        { text: 'Delete the logs after the release', explanation: 'The risk exists while the logs are written, not only afterwards.' },
      ],
      answer: 1,
    },
    {
      question: 'Monitoring shows 300 refused write attempts from one account in ten minutes. What is the first step?',
      options: [
        { text: 'Wait to see whether it continues tomorrow', explanation: 'Waiting lets the attempts continue while the team decides what to do.' },
        { text: 'Turn the logs off to save space', explanation: 'Turning off the logs removes the evidence you need for the review.' },
        { text: 'Contain it: pause that account\'s AI writes, and keep the logs for the window', explanation: 'Containment stops the activity at once, and the logs make the review possible.' },
        { text: 'Publish the account name in the release notes', explanation: 'Publishing it is not containment, and it may expose someone who is not at fault.' },
      ],
      answer: 2,
    },
    {
      question: 'In a tabletop exercise, a provider key appears in a public log. Which first hour sequence is right?',
      options: [
        { text: 'Write the post-mortem, then revoke the key', explanation: 'Writing first leaves the key working while the team writes.' },
        { text: 'Ask the vendor for a discount', explanation: 'A discount request does nothing to stop someone using the key.' },
        { text: 'Delete the repository, which removes the key', explanation: 'The key is still valid after the repository is deleted, and the evidence goes with it.' },
        { text: 'Revoke the key now, then check its recent usage and write down the timeline', explanation: 'Revoking stops further use, and the usage check shows whether it was already misused.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Check the release configuration in code, watch for the signals that AI attacks leave behind, and when something goes wrong, contain it, keep the evidence and only then fix and review.',
  resources: [
    { title: 'NIST Cybersecurity Framework', provider: 'National Institute of Standards and Technology', description: 'A widely used structure for planning how to identify, protect, detect, respond to and recover from security events.', url: 'https://www.nist.gov/cyberframework' },
    { title: 'OWASP Top 10 for Large Language Model Applications', provider: 'OWASP GenAI Security Project', description: 'The risks to plan for when you deploy an AI application.', url: 'https://genai.owasp.org/llm-top-10/' },
  ],
  underTheHood: {
    heading: 'Why containment comes before diagnosis',
    paragraphs: [
      "Incident responders usually divide the work into containment, eradication and recovery. Containment limits the damage. Eradication removes the cause. Recovery returns the service to normal and checks that it stays that way. The order matters, because each step depends on the one before it.",
      "The reason containment comes first is simple. While the cause is unknown, the attack keeps working. A team that spends an hour finding the root cause while a leaked key is still valid has spent that hour giving the attacker free access.",
      "Blameless reviews fit the same logic. After the incident, the team writes down the timeline, what was known at each point and what the plan would do differently next time. Focusing on the system rather than on a person makes people report problems early, which shortens the next incident.",
    ],
  },
}

export default lesson
