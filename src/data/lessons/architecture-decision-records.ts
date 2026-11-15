import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'the other architecture lessons, from System Design to Cost Optimization. This lesson records the decisions they produced.',
  goals: [
    'Recognize which decisions deserve a written record',
    'Write an architecture decision record with its context, options, decision and consequences',
    'Keep records useful over time by storing them with the code and superseding rather than editing them',
  ],
  bigIdea: "An architecture decision record, or ADR, is a short document that captures one important design decision: the situation, the options considered, what was chosen and why, and what follows from it. Kept next to the code, a collection of ADRs explains why the system is the way it is, long after the people who decided have moved on.",
  whyItMatters: "A year after launch, a new developer asks why Study Tracker uses simple exact vector search instead of a dedicated vector database, and proposes switching. Was it an oversight or a deliberate choice? Without a record, the team either repeats a week of research or makes a change that undermines the privacy filter the search was designed around. With a one-page ADR, the answer takes two minutes, including exactly when the decision should be revisited.",
  goalSections: [
    {
      heading: 'Which decisions to record',
      paragraphs: [
        "Record decisions that are expensive to reverse, that affect several parts of the system or several people, or that were genuinely debated. For Study Tracker, that includes the database, the monolith-or-services question, the AI provider and what data it may receive, how sign-in works and the data retention rules.",
        "Do not record choices that are cheap to undo, such as a variable name, a code formatting style or a small library update. Too many records bury the important ones.",
        "A quick test: will someone later wonder why it was done this way, and would undoing it take more than a day? If both answers are yes, write it down.",
      ],
      example: {
        language: 'text',
        code: code`
          Record                                          Skip
          Modular monolith instead of microservices       Name of a helper function
          Exact vector search filtered by student         Which test runner flag to use
          Hosted model provider; notes never trained on   Log message wording
          Single sign-on with the university's accounts   Indentation and formatting
          Detailed logs kept 30 days                      A minor library update
        `,
      },
    },
    {
      heading: 'Writing an ADR',
      paragraphs: [
        "A widely used format has five parts. A numbered title naming the decision. A status: proposed, accepted, or superseded by a later record. The context: the requirements, constraints and estimates that made a decision necessary. The decision itself, stated plainly as \"We will...\". And the consequences: what becomes easier, what becomes harder and what risks remain.",
        "Many teams add the options considered, each with its real advantages and drawbacks, and a \"Revisit when\" line naming the conditions that should reopen the question. Those two additions do the most to stop a decision being reargued later.",
        "Keep it to about a page, and write for a reader who was not in the room. Link the evidence, such as the estimates from System Design, a benchmark or a review note. Be honest about the downsides. An ADR that lists only benefits reads as a sales pitch and earns no trust.",
      ],
      example: {
        language: 'text',
        filename: 'docs/adr/template.md',
        code: code`
          # NNNN: Short title of the decision

          Status: Proposed | Accepted | Superseded by NNNN
          Date: YYYY-MM-DD

          ## Context
          What situation, requirements and constraints force a decision?

          ## Options considered
          1. Option, with its advantages and drawbacks
          2. Option, with its advantages and drawbacks

          ## Decision
          We will ...

          ## Consequences
          Good, bad and risky effects. Revisit when ...
        `,
      },
    },
    {
      heading: 'Keeping ADRs useful',
      paragraphs: [
        "Store ADRs in the repository, for example in `docs/adr/`, numbered in order, so they travel with the code, show up in searches and are reviewed in pull requests like any other change. Writing one while the decision is still being debated, with the status Proposed, is a good way to structure that debate.",
        "Once accepted, an ADR is not edited to match a new decision. When the decision changes, write a new ADR that explains the new context and choice, and change the old one's status to \"Superseded by\" the new number. The reasoning behind both stays readable, which is the whole point.",
        "Link to an ADR from the code it explains, in a short comment, and check the \"Revisit when\" conditions during planning. A small script can even pick the next number for you.",
      ],
      example: {
        language: 'python',
        code: code`
          import tempfile
          from pathlib import Path


          def next_adr_path(folder, title):
              numbers = [int(path.name[:4]) for path in folder.glob("[0-9][0-9][0-9][0-9]-*.md")]
              slug = "-".join(title.lower().split())
              return folder / f"{max(numbers, default=0) + 1:04d}-{slug}.md"


          with tempfile.TemporaryDirectory() as tmp:
              adr = Path(tmp)
              (adr / "0001-use-a-modular-monolith.md").write_text("...")
              (adr / "0002-sign-in-with-university-sso.md").write_text("...")
              print(next_adr_path(adr, "Use exact vector search").name)
        `,
        output: '0003-use-exact-vector-search.md',
      },
    },
  ],
  seeItInAction: {
    title: 'ADR 0003 for Study Tracker',
    intro: "Here is a complete ADR for the note search decision from System Design and Vector Databases. It fits on one screen, which is about the right length.",
    example: {
      language: 'text',
      filename: 'docs/adr/0003-use-exact-vector-search.md',
      code: code`
        # 0003: Use exact vector search in the main database for note search

        Status: Accepted
        Date: 2026-03-02

        ## Context
        20,000 students, about 200 note paragraphs each, 4 million in total.
        Every search must be limited to the student's own notes (privacy rule).
        Team of 2. Estimates and tests: docs/estimates.md, test_notes_store.py.

        ## Options considered
        1. Exact search over the student's own rows in the main database.
           Simple, one system to run, results always exact. Slow if one
           student ever has many thousands of paragraphs.
        2. A separate hosted vector database with an index.
           Fast at any size. Another service to secure, pay for and keep in sync,
           and the owner filter must be enforced in two places.

        ## Decision
        We will store note vectors in the main database and search each
        student's rows exactly, filtered by student ID in the query.

        ## Consequences
        + One database, one backup, one place enforcing the privacy filter.
        + No sync between two stores.
        - Search time grows with the size of one student's notes.
        Revisit when: any student passes 10,000 paragraphs, or search p95
        passes 300 ms.
      `,
    },
    steps: [
      { code: '# 0003: Use exact vector search in the main database for note search', explanation: "The title states the decision itself, so a list of ADR titles reads as a summary of the architecture." },
      { code: 'Every search must be limited to the student\'s own notes (privacy rule).', explanation: "The context records the force that shaped the decision. A future reader who changes the search must keep this rule, and now knows it exists." },
      { code: 'Estimates and tests: docs/estimates.md, test_notes_store.py.', explanation: "Links to evidence let a reader check the reasoning instead of trusting it." },
      { code: '2. A separate hosted vector database with an index.', explanation: "The rejected option is described fairly, including its real strength. That stops the next person from assuming nobody considered it." },
      { code: '- Search time grows with the size of one student\'s notes.', explanation: "The known downside is stated plainly. Honest consequences are what make the record trustworthy." },
      { code: 'Revisit when: any student passes 10,000 paragraphs, or search p95 passes 300 ms.', explanation: "Measurable triggers turn the decision's assumptions into checks. When one fires, the team writes ADR 0004 and marks this one superseded." },
    ],
  },
  tryIt: {
    instructions: [
      'Create a `docs/adr/` folder in your Study Tracker repository and add the template from this lesson.',
      'Write an ADR for one decision you made in this section, such as which model you use and where it runs, or keeping a modular monolith. Include at least two options and an honest downside.',
      'Add a "Revisit when" line with conditions you could actually measure, using the numbers you log.',
      'Commit it on a branch, open a pull request and ask someone to review it, or review it yourself a day later against the checklist in this lesson.',
    ],
    evidencePrompt: {
      label: 'Your ADR',
      placeholder: 'For example: 0001: Use a local model through Ollama for session parsing. Options: local small model, hosted medium model. Downside: slower on older laptops. Revisit when: test set accuracy drops below 98%.',
    },
  },
  mistakes: [
    { mistake: 'Writing no records, or only long after the decision.', fix: 'Write the ADR while deciding, as Proposed, and mark it Accepted when the decision is made.' },
    { mistake: 'Describing only the chosen option.', fix: 'List the real alternatives with their strengths, so readers can see the decision was a choice.' },
    { mistake: 'Editing an old ADR when the decision changes.', fix: 'Write a new ADR, and mark the old one as superseded by it, so the history of reasoning survives.' },
    { mistake: 'Writing a long essay nobody reads.', fix: 'Keep it to about a page, and link to longer evidence instead of including it.' },
  ],
  quiz: [
    {
      question: 'Which of these decisions most deserves an ADR?',
      options: [
        { text: 'Renaming `get_totals` to `totals_by_subject`', explanation: 'Cheap to change and easy to understand from the code itself.' },
        { text: 'Keeping note vectors in the main database instead of a separate hosted vector database', explanation: 'It is costly to reverse, affects privacy and operations, and someone will later ask why.' },
        { text: 'Formatting code with 4-space indentation', explanation: 'A style choice, best handled by a formatter, not an architecture record.' },
        { text: 'Choosing the name of a test file', explanation: 'Trivial and reversible in seconds.' },
      ],
      answer: 1,
    },
    {
      question: 'ADR 0003 chose exact search. A year later the team moves to an indexed vector database. What should they do with ADR 0003?',
      options: [
        { text: 'Rewrite it to describe the new design', explanation: 'That erases why the first decision made sense at the time.' },
        { text: 'Delete it, since it is no longer true', explanation: 'The history of reasoning is lost, and the same debate may happen again.' },
        { text: 'Write ADR 0009 for the new decision and mark 0003 as "Superseded by 0009"', explanation: 'Both decisions and their contexts stay readable, and the old one points to the new.' },
        { text: 'Leave it unchanged with status Accepted', explanation: 'Readers would wrongly believe exact search is still the design.' },
      ],
      answer: 2,
    },
    {
      question: 'Which consequences section is most useful to a future reader?',
      options: [
        { text: 'One database to run, but search slows if one student\'s notes grow very large. Revisit when any student passes 10,000 paragraphs.', explanation: 'It states benefits and costs honestly, with a measurable trigger for revisiting.' },
        { text: 'This is the best possible design.', explanation: 'An unsupported claim with no trade-offs gives the reader nothing to check.' },
        { text: 'Everything will be faster and cheaper.', explanation: 'Listing only benefits makes the record look like a sales pitch.' },
        { text: 'See the meeting notes.', explanation: 'The reasoning belongs in the record, not somewhere a reader may never find.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Record each expensive or debated decision in a short ADR with its context, honest options, the decision, its consequences and measurable revisit conditions, store it with the code, and supersede rather than rewrite it.',
  resources: [
    { title: 'Documenting Architecture Decisions', provider: 'Michael Nygard', description: 'The 2011 post that introduced the ADR format most teams use.', url: 'https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions' },
    { title: 'Architectural Decision Records', provider: 'adr.github.io', description: 'Templates, tools and examples collected by the ADR community.', url: 'https://adr.github.io/' },
    { title: 'MADR', provider: 'adr.github.io', description: 'A popular Markdown template that adds options and their pros and cons.', url: 'https://adr.github.io/madr/' },
    { title: 'Architecture decision records overview', provider: 'Google Cloud', description: 'How and when teams use ADRs, with an example.', url: 'https://cloud.google.com/architecture/architecture-decision-records' },
  ],
  underTheHood: {
    heading: 'Why good decisions go bad',
    paragraphs: [
      "Most architecture decisions are not wrong when they are made. They become wrong when the conditions behind them change: the team grows, prices shift, the load turns out ten times higher, or a technology that was immature becomes the standard. The code stays the same while its reasons quietly expire.",
      "That is why the context section matters more than it seems. It records the conditions the decision depended on, so a later reader can check whether they still hold, rather than guessing. A \"Revisit when\" line goes further, turning hidden assumptions into explicit triggers.",
      "Some teams automate those triggers as checks that run with the tests or the monitoring, sometimes called fitness functions. For ADR 0003, an alert when any student passes 10,000 note paragraphs, or when search p95 passes 300 ms, would announce the moment the decision needs revisiting. The ADR then becomes more than history: it watches over its own assumptions.",
    ],
  },
}

export default lesson
