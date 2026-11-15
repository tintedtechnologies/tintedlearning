import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiObserved, appFeedback, assistant, configEmbed, db, embedCache, extract, feedback, notesCached, observability, planner, ragStream, schemas, testFeedback } from './study-tracker'

const appFiles = { 'config.py': configEmbed, 'ai.py': aiObserved, 'db.py': db, 'embed_cache.py': embedCache, 'notes.py': notesCached, 'rag.py': ragStream, 'schemas.py': schemas, 'extract.py': extract, 'assistant.py': assistant, 'planner.py': planner, 'observability.py': observability, 'feedback.py': feedback, 'app.py': appFeedback }

const lesson: StructuredLesson = {
  assumes: 'AI Observability and Operations, with request IDs in `app.py`, and the AI features built since What is an AI API?',
  goals: [
    'Set honest expectations about what an AI feature can and cannot do',
    'Design for failure by showing sources, admitting uncertainty and keeping a way forward',
    'Let people correct the AI, and turn their feedback into improvements',
  ],
  bigIdea: "An AI feature is only as good as the experience around it. Because models are sometimes wrong, a well-designed AI product tells people what to expect, shows where answers come from, handles failure gracefully and makes mistakes easy to correct. These choices decide whether people trust the feature the right amount: neither blindly nor not at all.",
  whyItMatters: "Picture two learners. One trusts Study Tracker's planner completely and never notices it booked a session on their work day. The other sees one wrong answer from the notes assistant and never uses it again, even though it is right almost every time. Neither problem is the model's fault. Both are design problems, and both are fixed by how the feature presents itself, fails and accepts corrections.",
  goalSections: [
    {
      heading: 'Setting expectations',
      paragraphs: [
        "Describe what the feature does in specific terms. \"Ask me anything\" invites questions it cannot answer and sets it up to disappoint. \"Ask about your notes, and I'll show which note each answer came from\" tells people exactly when to use it.",
        "Say the main limit up front, in plain words, where people will see it, not in a policy page. Label AI-generated content as AI-generated, so nobody mistakes a draft for a checked record. Offer two or three example questions, which quietly teach the feature's scope.",
        "Avoid giving the feature a personality that claims more than it can do. A friendly tone is fine. A \"genius tutor who knows everything\" makes every mistake feel like a betrayal.",
      ],
      example: {
        language: 'text',
        code: code`
          Weak:    Ask me anything! I'm your AI study genius.

          Better:  Ask a question about your notes. I answer only from notes
                   you've added, and show which note each answer came from.
                   If your notes don't cover it, I'll say so.
                   Try: "How do cells get energy?"  "What did I write about fractions?"
        `,
      },
    },
    {
      heading: 'Designing for failure',
      paragraphs: [
        "Plan for the AI being wrong, unsure or unavailable, because all three will happen. Showing sources lets people check an answer in one glance. Honest uncertainty, such as \"I couldn't find that in your notes\", beats a confident guess every time.",
        "Never let an AI feature block the core of the app. If the model service is down, Study Tracker's normal form, totals and history still work, and the AI endpoints say clearly that they are unavailable.",
        "Keep consequences reversible. Drafts, approval steps and undo turn a model's mistake from damage into a two-second fix. The more permanent an action, the more clearly it should be shown and confirmed first.",
      ],
      example: {
        language: 'text',
        code: code`
          What goes wrong                   What the learner sees in Study Tracker
          Model service down                "The study assistant is unavailable" (503),
                                            while the Add session form still works
          Note not understood               "Could not read a session from that note",
                                            so the learner fills in the form instead
          Notes don't cover the question    "I couldn't find that in your notes."
          Answer stream breaks halfway      "Sorry, the answer was cut off. Please try again."
          Agent's plan breaks a rule        never shown: it is fixed or the planner gives up
        `,
      },
    },
    {
      heading: 'Letting people correct the AI',
      paragraphs: [
        "Make the AI's output editable before it counts. Study Tracker's parsed sessions arrive as a filled-in form the learner can change, and plans can be edited before approval. Correcting should take less effort than starting over.",
        "Ask for feedback where it is easy: a helpful or not helpful choice next to each answer, with an optional short reason. Store it with the request ID, so each complaint can be traced to its exact log lines.",
        "Then close the loop. Review the not helpful cases regularly, find out whether the search, the prompt or the model was at fault, fix it, and add the case to your test set from Evaluating AI Responses, so the same mistake can never quietly return. Treat reasons as personal data: people may type private details into them.",
      ],
      example: {
        language: 'text',
        code: code`
          Learner marks an answer not helpful        request_id=acefdd03, feature=notes
            -> find every log line for acefdd03       which notes were found, what scores
            -> the right note scored 0.31, below 0.35, so the search missed it
            -> fix: tune MIN_SCORE, or improve how notes are chunked
            -> add the question to the test set       the fix is now checked on every change
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Collecting feedback in Study Tracker',
    intro: "This new file stores helpful and not helpful ratings, and `app.py` gains `POST /feedback` and `GET /feedback/summary`. The summary at the end came from the tests below.",
    example: { language: 'python', filename: 'feedback.py', code: feedback, runnable: false, files: appFiles },
    steps: [
      { code: 'request_id TEXT NOT NULL,', explanation: "Each rating is linked to the request it is about. The request ID from the `X-Request-ID` header connects the rating to every log line for that answer." },
      { code: 'feature TEXT NOT NULL,', explanation: "Ratings are grouped by feature, so you can see that the planner is struggling while the notes assistant is fine." },
      { code: 'reason TEXT', explanation: "An optional short explanation. It may contain personal details, so it stays in the database and never goes into logs." },
      { code: 'feature: Literal["assistant", "notes", "parse", "planner"]', explanation: "From `FeedbackIn` in `app.py`. Only real feature names are accepted, so a typo cannot create a new, misleading category." },
      { code: 'SUM(helpful) AS helpful ... GROUP BY feature', explanation: "Helpful ratings are stored as 1 and not helpful as 0, so their sum is the number of helpful ratings." },
      { code: 'GET /feedback/summary\n{"notes": {"total": 3, "helpful": 2}, "planner": {"total": 1, "helpful": 0}}', explanation: "A weekly glance shows where to look first. Each not helpful rating leads, through its request ID, to the evidence needed to fix it." },
    ],
  },
  tryIt: {
    instructions: [
      'Write the welcome text for each of Study Tracker\'s AI features: notes, assistant, session parser and planner. Each should say what it does, its main limit and two example requests.',
      'Stop your model, or set a wrong `AI_MODEL`, and use every feature. Write down exactly what a learner would see, and fix any message that is unclear or blames the learner.',
      'Add `feedback.py` and replace `app.py` with the version below. Rate a few answers in `/docs`, using the request IDs from the response headers, then check the summary.',
      'Add `test_feedback.py` and run `python -m pytest`. Then pick one not helpful case, trace it through the logs and write down which step went wrong.',
    ],
    files: [
      { language: 'python', filename: 'app.py', code: appFeedback, runnable: false },
      { language: 'python', filename: 'test_feedback.py', code: testFeedback, files: appFiles, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Promising that the AI can do anything.', fix: 'Describe the feature\'s real job and its main limit where people will see them, with example requests.' },
    { mistake: 'Letting an AI failure break the rest of the app.', fix: 'Keep core features working without AI, and show a clear message when an AI feature is unavailable.' },
    { mistake: 'Making AI output take effect before anyone can check it.', fix: 'Show drafts, ask for approval on actions, and make changes easy to undo.' },
    { mistake: 'Collecting feedback and never acting on it.', fix: 'Review not helpful cases regularly, trace them through the logs, fix the cause and add them to your test set.' },
  ],
  quiz: [
    {
      question: 'Which welcome message best sets expectations for Study Tracker\'s notes assistant?',
      options: [
        { text: '"Ask me anything!"', explanation: 'It invites questions the assistant cannot answer from the notes, which sets it up to disappoint.' },
        { text: '"I answer only from the notes you\'ve added, and show which note each answer came from. If your notes don\'t cover it, I\'ll say so."', explanation: 'It says what the feature does, where answers come from and what happens when it cannot help.' },
        { text: '"Meet your genius study buddy who knows everything."', explanation: 'It overclaims, so every mistake will feel like a betrayal.' },
        { text: '"Powered by AI."', explanation: 'It tells people nothing about what the feature does or when to use it.' },
      ],
      answer: 1,
    },
    {
      question: 'The model service is down for an hour. What should still work in Study Tracker?',
      options: [
        { text: 'Nothing: the whole app should show a maintenance page', explanation: 'That turns an AI outage into a total outage for no reason.' },
        { text: 'The AI features, using cached answers for every question', explanation: 'Cached answers cannot cover new questions, and old ones may be stale.' },
        { text: 'Only the planner, because its plans are checked in code', explanation: 'The planner needs the model to draft plans. Code only checks them.' },
        { text: 'Logging sessions with the form, totals and history, while the AI features say clearly that they are unavailable', explanation: 'Core features never depend on the model, so an AI outage only affects AI features.' },
      ],
      answer: 3,
    },
    {
      question: 'A learner marks a notes answer as not helpful, with request ID acefdd03. What is the best next step?',
      options: [
        { text: 'Find the log lines for acefdd03, see which notes were found and their scores, fix the cause and add the question to the test set', explanation: 'The request ID leads to the evidence, and the test set stops the problem from coming back.' },
        { text: 'Switch to a larger model straight away', explanation: 'If the search missed the right note, a larger model cannot fix it.' },
        { text: 'Delete the rating, since one person\'s opinion is not reliable', explanation: 'Each rating is a lead worth checking, and patterns only appear if you keep them.' },
        { text: 'Reply to the learner that AI makes mistakes', explanation: 'True, but it fixes nothing and teaches you nothing.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Design AI features to be honest about their limits, to fail gracefully without breaking the rest of the app, to show their sources, and to make correcting them easy, then use that feedback to improve them.',
  resources: [
    { title: 'People + AI Guidebook', provider: 'Google PAIR', description: 'Practical patterns for setting expectations, explaining AI and handling errors.', url: 'https://pair.withgoogle.com/guidebook/' },
    { title: 'Guidelines for Human-AI Interaction', provider: 'Microsoft', description: 'Eighteen research-based guidelines for designing AI experiences.', url: 'https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/' },
    { title: 'AI: First New UI Paradigm in 60 Years', provider: 'Nielsen Norman Group', description: 'How asking for outcomes changes interface design, and what that means for usability.', url: 'https://www.nngroup.com/articles/ai-paradigm/' },
  ],
  underTheHood: {
    heading: 'Too much trust, and too little',
    paragraphs: [
      "Research on people working with automated systems finds two opposite mistakes. Automation bias is trusting the system too much: accepting its suggestions without checking, even when they are wrong and the person would have known better. Algorithm aversion is the reverse: after seeing a system make one mistake, people abandon it, even when it is more accurate than they are.",
      "The goal of AI product design is calibrated trust, where people rely on the feature about as much as it deserves, case by case. Design moves that trust in both directions.",
      "Showing sources and admitting uncertainty reduces over-trust, because checking becomes easy and visible gaps prompt a second look. Making mistakes cheap to fix reduces the shock of an error, which limits aversion: an edited draft feels like normal work, not a failure. Being specific about what the feature does helps most of all, because people trust a tool more sensibly when they know what it is for.",
    ],
  },
}

export default lesson
