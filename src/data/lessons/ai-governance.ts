import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Every earlier lesson in the Security section, especially Threat Modeling AI Systems and Privacy and Sensitive Data. This optional final lesson writes down what the Study Tracker assistant is, so the earlier decisions stay visible.',
  goals: [
    'Write a system card that says what an AI feature is for, and what it is not for',
    'Record the data, models and tools it uses, and the owner of each decision',
    'Set a review date and the events that require the card to be updated',
  ],
  bigIdea: "A system card is a short document that records what an AI feature does, what data and models it uses, what could go wrong and who is responsible for each decision. It is the place where earlier security decisions are kept, so a new team member, an auditor or a future you can see why the system is built the way it is.",
  whyItMatters: "Six months after launch, someone asks whether the assistant can read private notes, or which provider holds the data. If the answers live only in one person's memory, the team guesses, and a guess is not a control. A card written at launch, reviewed on a date and updated when something changes, answers those questions quickly and honestly.",
  goalSections: [
    {
      heading: 'Say what the feature is for',
      paragraphs: [
        "Start with purpose and limits. A system card names the users, the job the feature does and the jobs it must not do. For Study Tracker's assistant, the job is answering questions from a learner's own notes and logging sessions they describe. It must not give advice on exams for other learners, read another learner's notes or act without approval.",
        "Writing what the feature is not for is as important as the purpose. A limit stated on paper is easier to test, and it tells a reviewer which misuse would be a real problem. Write the limits in the same words the team uses in its design documents, so the card and the code describe one system.",
      ],
      example: {
        language: 'text',
        code: code`
          Purpose:   answer questions from a learner's own study notes, with citations
          Users:     enrolled learners, signed in
          Not for:   other learners' notes, grading, medical or legal advice, sending messages
        `,
      },
    },
    {
      heading: 'Record the data, the models and the owners',
      paragraphs: [
        "List every data source the feature reads, every model it calls and every tool it can use. For each one, record where it comes from, what personal data it can contain and who decided to use it. A missing line in this list is usually the start of a privacy or supply chain problem. Ask the owner of each tool to confirm the entry, so the list is checked by the people who know the tool best.",
        "Name an owner for each decision, not a team. A person who can answer questions, approve changes and be contacted in an incident is worth more than a shared mailbox.",
      ],
      example: {
        language: 'text',
        code: code`
          Data:     learners' notes (personal data possible; emails and phone numbers redacted)
          Model:    hosted provider, chosen by the platform lead, reviewed each quarter
          Tools:    get_totals (read), log_session (write, needs the learner's request)
          Owner:    product lead for scope; IT manager for access; privacy lead for data
        `,
      },
    },
    {
      heading: 'Set a review date and the triggers for an update',
      paragraphs: [
        "A card that is never reviewed becomes a record of a system that no longer exists. Set a review date, such as every three months, and list the events that require an update before that date: a new model, a new tool, a new data source, a new user group or an incident.",
        "Each review should answer three questions: is the purpose still right, has any data or tool changed, and did any incident or test reveal a new risk? Record the answers and the date, so the history of the system is visible too.",
      ],
      example: {
        language: 'text',
        code: code`
          Review:    every 3 months, next on 15 February
          Update when: a model or provider changes, a tool is added, a new school joins,
                       an incident happens, or a privacy or security test fails
          Last review: 14 November, owner: product lead, no changes needed
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A checker for a system card',
    intro: "The script below checks that a system card has every required section and that each section has content. It is a small rule, but it stops a card from going out with a blank owner or review date. Run it on your own copy of Study Tracker, with placeholder values only.",
    example: {
      language: 'python',
      filename: 'check_card.py',
      code: code`
        REQUIRED = ["purpose", "not_for", "data", "models", "tools", "owner", "review_date"]

        def missing_fields(card):
            return [field for field in REQUIRED if not card.get(field)]

        card = {
            "purpose": "answer questions from a learner's own notes, with citations",
            "not_for": "other learners' notes, grading, sending messages",
            "data": "learners' notes, with emails and phone numbers redacted",
            "models": "hosted provider, reviewed each quarter",
            "tools": "get_totals, log_session",
            "owner": "",
            "review_date": "2027-02-15",
        }

        print("missing:", missing_fields(card))
        print("ready to publish:", not missing_fields(card))
      `,
      output: "missing: ['owner']\nready to publish: False",
    },
    steps: [
      { code: 'REQUIRED = ["purpose", "not_for", "data", "models", "tools", "owner", "review_date"]', explanation: "The fields every card must have. Each one maps to a question an auditor or a new team member would ask." },
      { code: 'if not card.get(field)', explanation: "An empty string counts as missing, so a blank owner is caught, not just a missing key." },
      { code: '"owner": "",', explanation: "The card has no owner yet, so the checker refuses to call it ready. The fix is to name a person, not to delete the field." },
      { code: 'print("ready to publish:", not missing_fields(card))', explanation: "The publish decision is made by the rule, so no one has to remember which fields matter." },
    ],
  },
  tryIt: {
    instructions: [
      'Write a system card for the Study Tracker assistant with each section from this lesson, and fill every field with a real name or a real date from your own project.',
      'Copy `check_card.py`, replace the card with yours, and run it until the output says ready to publish.',
      'Add the card to your repository, next to the code it describes. Add a note in the README that says when it was last reviewed.',
    ],
  },
  mistakes: [
    { mistake: 'Writing a card that describes the purpose but not the limits.', fix: 'Write what the feature is not for, and test that the limits hold.' },
    { mistake: 'Naming a team as the owner of a decision.', fix: 'Name one person for each decision, and a way to reach them.' },
    { mistake: 'Writing the card once and never reviewing it.', fix: 'Set a review date and the events that trigger an update, and record each review.' },
  ],
  quiz: [
    {
      question: 'The team adds a new tool that can send messages to learners. What should happen to the system card?',
      options: [
        { text: 'Nothing, since the purpose has not changed', explanation: 'A new tool is a new capability, and the card must record it and its approval.' },
        { text: 'The card is updated before the tool is released, with the tool, its owner and its limits', explanation: 'A new tool is a listed trigger, so the update happens before the change reaches learners.' },
        { text: 'The card is updated at the next quarterly review, months later', explanation: 'Waiting for the review leaves a live capability undocumented, which is the gap the card exists to close.' },
        { text: 'Only the developer who built the tool needs to know', explanation: 'The owners, the privacy lead and the IT manager need the change too, and it belongs in the record.' },
      ],
      answer: 1,
    },
    {
      question: 'Why does the checker treat an empty owner as missing?',
      options: [
        { text: 'Because empty strings are always invalid in Python', explanation: 'Python allows empty strings. The rule is about what the card says, not about the language.' },
        { text: 'Because owners must be listed alphabetically', explanation: 'Ordering is not the issue. The problem is that no one is named.' },
        { text: 'Because a blank owner means nobody can answer questions or approve changes about the feature', explanation: 'An owner is what makes the card useful in an incident, so a blank one is a real gap.' },
        { text: 'Because the checker only runs on Fridays', explanation: 'The day has no bearing on whether a field is filled in.' },
      ],
      answer: 2,
    },
    {
      question: 'A learner asks, "Can the assistant read my friend\'s notes?" Where should the answer be recorded?',
      options: [
        { text: 'Nowhere, since the answer is obvious', explanation: 'Obvious answers are the ones that get lost. Write down the limit so it can be tested.' },
        { text: 'In the marketing page only', explanation: 'Marketing is not a control. The limit belongs in the record the team works from.' },
        { text: 'In the model\'s system prompt, and nowhere else', explanation: 'A prompt is not a control, so the limit must also be recorded and enforced in code.' },
        { text: 'In the "not for" section of the system card, with a test that checks it', explanation: 'The limit is stated where reviewers look, and a test shows it holds.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'A system card records what an AI feature is for and is not for, its data, models, tools and owners, with a review date and the events that require an update.',
  resources: [
    { title: 'NIST AI Risk Management Framework', provider: 'National Institute of Standards and Technology', description: 'A voluntary framework for managing risks in AI systems, including documentation and governance.', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
    { title: 'Model Cards for Model Reporting', provider: 'Mitchell et al. (research paper)', description: 'The paper that introduced model cards as a way to report a model\'s intended use, limits and evaluation.', url: 'https://arxiv.org/abs/1810.03993' },
  ],
  underTheHood: {
    heading: 'Why documentation is a control',
    paragraphs: [
      "Governance documents are often seen as paperwork, but the best ones act as controls. Writing down the limits forces the team to decide them, and a limit that has been decided can be tested. A purpose stated on paper gives a reviewer something concrete to check the code against.",
      "Standards bodies describe the same idea. Risk frameworks ask organizations to map the system, measure the risks and manage them, with records at each stage. The record is what allows an organization to show that a decision was made, by whom and on what evidence.",
      "The cost of a card is small compared with the cost of a question nobody can answer. When a learner, a regulator or a colleague asks what the system does with data, a current card answers in minutes, and a missing card turns the question into a week of searching.",
    ],
  },
}

export default lesson
