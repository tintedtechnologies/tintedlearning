import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Turn a vague goal into a clear input and output',
    'Set a simple baseline and a success measure before anyone builds a model',
    'List the limits, such as speed, cost and privacy, that decide what a good solution looks like',
  ],
  bigIdea: "Most failed AI projects fail before any model is built, because nobody pinned down exactly what goes in, what should come out, and how to tell if it worked. Framing a problem means writing those three things down, plus the limits the solution must live within.",
  whyItMatters: "A manager says, \"Use AI to reduce customer churn.\" Six months later the team has a clever model that predicts who will cancel, but nobody can act on it, because the predictions arrive the day after customers have already left. Thirty minutes spent framing the problem at the start, including when the prediction is needed, would have saved those six months.",
  goalSections: [
    {
      heading: 'From a vague goal to an input and an output',
      paragraphs: [
        "Goals usually arrive vague: improve support, reduce churn, use AI for hiring. A model cannot work with a goal. It needs an input, the information available at the moment of the decision, and an output, the specific thing it should produce.",
        "Start from the decision a person will make. Then ask what that person needs to know, and what they will have in front of them when they need it. The answer to the first question is the output. The second is the input.",
        "Be strict about timing. Only information that exists at decision time can be an input. A model that predicts cancellations using \"number of complaints last month\" works. One that uses \"reason given for canceling\" is cheating, because that is only known after the customer has gone.",
      ],
      example: {
        language: 'text',
        code: code`
          Vague goal:  "Use AI to reduce churn"

          Decision:    which customers should get a call from the retention team this week?
          Input:       account age, logins in the last 30 days, open complaints, plan type
          Output:      a score from 0 to 1 for how likely each customer is to cancel
                       in the next 30 days
        `,
      },
    },
    {
      heading: 'A baseline and a measure of success',
      paragraphs: [
        "A baseline is the simplest reasonable way to do the task without a fancy model. It might be a single rule, or just what people do today. You need it because a model's score means nothing on its own. Eighty percent sounds good until you learn that a one-line rule gets seventy-nine.",
        "Then decide how you will measure success, and write it down before you build. Connect it to the decision: if the retention team can only make 200 calls a week, measure how many of the top 200 customers flagged actually would have canceled.",
        "Also agree on what result would mean stop. If the model cannot beat the baseline by a useful margin, the honest answer is to keep the baseline.",
      ],
      example: {
        language: 'text',
        code: code`
          Baseline rule:  call customers with no login in the last 14 days
                          -> of the 200 called, 52 were truly about to cancel

          Model:          call the 200 customers with the highest scores
                          -> of the 200 called, 81 were truly about to cancel

          Success test, agreed in advance: beat the baseline by at least 20
        `,
      },
    },
    {
      heading: 'The limits that shape the solution',
      paragraphs: [
        "Every real problem comes with limits, called constraints. Common ones are speed (a card payment check must answer in under a second), cost (a free app cannot pay for an expensive model on every tap), privacy (medical records may not leave the hospital), and fairness (a loan model must not treat applicants differently by race).",
        "Constraints change what counts as a good solution. The most accurate model is the wrong choice if it takes five seconds and the checkout page times out after one. Write the constraints next to the input and output so everyone judges the solution against the same rules.",
      ],
      example: {
        language: 'text',
        code: code`
          Constraint          Example limit                  What it rules out
          Speed               answer within 300 ms           a slow, very large model
          Cost                under $0.001 per prediction    a paid AI service on every request
          Privacy             data stays in the EU           a provider that stores data in the US
          Fairness            similar approval rates by age  using age as an input
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Framing a request from a library',
    intro: "A city library asks: \"Can AI help us with overdue books?\" Here is a complete framing, written on one page before anyone touches data.",
    example: {
      language: 'text',
      code: code`
        Decision:    which borrowers get a reminder text 2 days before the due date?
        Input:       past late returns, number of books out, days since last visit
        Output:      yes or no: likely to return late
        Baseline:    text everyone who returned a book late in the past year
        Success:     cut late returns by 15% versus the baseline, over 2 months
        Constraints: no personal data sent outside the library's systems
                     at most 300 texts a day, which is the budget
        Stop if:     the model cannot beat the baseline
      `,
    },
    steps: [
      { code: 'Decision: which borrowers get a reminder text', explanation: "The vague wish about overdue books becomes one concrete action that someone takes every day. Everything else follows from this line." },
      { code: 'Input: past late returns, books out, days since last visit', explanation: "Each of these is known before the due date, so the model can use them at the moment the reminder decision is made." },
      { code: 'Output: yes or no: likely to return late', explanation: "A simple label is enough, because the action is simply to send a text or not." },
      { code: 'Baseline: text everyone who was late last year', explanation: "A sensible rule the library could run tomorrow with no AI. The model has to beat it to be worth building." },
      { code: 'Success: cut late returns by 15% versus the baseline', explanation: "The measure is tied to the real goal, fewer late books, and is set before the work starts, so nobody can move the goalposts afterwards." },
      { code: 'Constraints: no personal data outside, at most 300 texts', explanation: "These rule out sending borrower records to an outside AI service, and they mean the model only needs to pick its 300 most likely late returns." },
    ],
  },
  mistakes: [
    { mistake: 'Starting with "which model should we use?" instead of "what decision are we improving?"', fix: 'Write the decision, input and output on one page before you pick any tool.' },
    { mistake: 'Using inputs that are only known after the event.', fix: 'For each input, ask: would I have this at the exact moment the prediction is needed?' },
    { mistake: 'Skipping the baseline.', fix: 'Always score a simple rule first. If the model barely beats it, the rule may be the better choice.' },
  ],
  quiz: [
    {
      question: 'A taxi company wants to predict ride demand for each area one hour ahead. Which input should it NOT use?',
      options: [
        { text: 'The number of rides in that area over the past hour', explanation: 'This is known at prediction time and is a strong clue about the next hour.' },
        { text: 'Whether it is currently raining', explanation: 'The current weather is known when the prediction is made, so it is a fair input.' },
        { text: 'The actual number of rides booked during the hour being predicted', explanation: 'That number does not exist yet when the prediction is needed. Using it makes the model look perfect in testing and useless in real life.' },
        { text: 'Whether a concert is scheduled nearby', explanation: 'Event schedules are published in advance, so this is available in time.' },
      ],
      answer: 2,
    },
    {
      question: 'A new model correctly sorts 85% of support emails. What do you need before calling that a success?',
      options: [
        { text: 'A bigger model, to push the score above 90%', explanation: 'You cannot know whether 85% is good or bad yet. Making it bigger skips the real question.' },
        { text: 'The score of a simple baseline on the same emails', explanation: 'If a keyword rule already gets 84%, the model adds little. A baseline gives the number meaning.' },
        { text: 'A demo for the leadership team', explanation: 'A demo shows that it runs, not that it beats the simple alternatives.' },
        { text: 'Nothing, since 85% is a high score', explanation: 'Whether 85% is high depends on what simpler methods already achieve.' },
      ],
      answer: 1,
    },
    {
      question: 'A shop wants AI product recommendations on its checkout page, which must load in under half a second. Model A is slightly more accurate but takes 2 seconds. Model B takes 0.1 seconds. Which should it choose?',
      options: [
        { text: 'Model A, because accuracy is what matters most', explanation: 'A recommendation that arrives after the page has loaded is never seen, so its accuracy is worth nothing.' },
        { text: 'Model B, because it meets the speed limit and is only slightly less accurate', explanation: 'A solution has to fit the constraints first. Among those that do, pick the most accurate.' },
        { text: 'Both, showing whichever finishes first', explanation: 'Model A would almost never finish first, so this costs more and adds nothing.' },
        { text: 'Neither, since recommendations are not worth slowing a page down', explanation: 'Model B does not slow the page down, so there is no reason to give up on recommendations.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Before building anything, write down the decision, the input, the output, a baseline to beat, how success will be measured and the limits the solution must respect.',
  resources: [
    { title: 'Introduction to ML problem framing', provider: 'Google for Developers', description: 'A short course on turning a goal into a machine learning problem.', url: 'https://developers.google.com/machine-learning/problem-framing' },
    { title: 'Rules of machine learning', provider: 'Google for Developers', description: 'Practical advice, including why to start with simple rules.', url: 'https://developers.google.com/machine-learning/guides/rules-of-ml' },
  ],
  underTheHood: {
    heading: 'Data leakage, the most common framing bug',
    paragraphs: [
      "Data leakage is when information that would not be available at prediction time sneaks into the training data. The model learns to rely on it, scores brilliantly in testing, then collapses in real use.",
      "Leakage is often subtle. A hospital model predicting pneumonia once learned that patients who received a certain antibiotic were sick. The antibiotic was given because doctors already suspected pneumonia, so the model was reading the doctors' decision, not the patient's condition. In a churn model, a field like \"account status: closing\" leaks the answer outright.",
      "The defense is a timeline check. For every input column, write down when that value becomes known. Anything recorded after the moment the decision is made has to be removed, however predictive it looks.",
    ],
  },
}

export default lesson
