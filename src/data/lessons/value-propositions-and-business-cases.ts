import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Stakeholder Mapping and Requirements from this section, which explains who must be heard and how to write checkable requirements. The scenario is Riverside Community College, where the dean of students must decide whether to fund a pilot.',
  goals: [
    'Connect a technical solution to an outcome the college already cares about',
    'Estimate the value of a project as a range, with every assumption written down',
    'Choose a small, honest measurement to run in the pilot, so the business case can be tested',
  ],
  bigIdea: "A value proposition connects what the solution does to an outcome the buyer already values, such as student retention or staff time. A business case estimates the value and the cost, and it shows every assumption. Ranges and named assumptions are more trustworthy than a single precise number that nobody can trace.",
  whyItMatters: "The dean must justify the pilot cost to a budget committee. A case that says the assistant will save 4,000 staff hours, with no source, invites doubt about everything else in it. A case that says the team estimates a saving of 300 to 900 hours a year, based on a named trial and two stated assumptions, can be discussed, checked and improved.",
  goalSections: [
    {
      heading: 'Start from an outcome the college values',
      paragraphs: [
        "A value proposition names the outcome first and the feature second. The college cares about student success, staff time, risk and cost. A chatbot is a feature. Fewer students leaving the course because they cannot find their notes is an outcome, and it is the one the dean can take to the committee.",
        "Test the connection with one question: if this works perfectly, what would change for the buyer that they would notice? Ask the question out loud to the buyer, and write down their answer word for word. If the answer is only that the system is faster, the value is not yet clear enough. Look for a change in the people, the money or the risk. Write the outcome in the committee's own words, so the reader recognizes their priority.",
      ],
      example: {
        language: 'text',
        code: code`
          Feature:   the assistant answers questions from a student's own notes
          Outcome:   fewer students stuck before exams, so fewer drop out of courses
          Evidence:  the trial showed students spending long periods searching notes
          Test:      track course withdrawals and tutor requests in the pilot
        `,
      },
    },
    {
      heading: 'Estimate with ranges and named assumptions',
      paragraphs: [
        "Estimate value as a range, not a single number. Write the low and high figure, and the assumptions behind each. A range shows the reader how much depends on the assumptions, and it invites them to challenge the ones they doubt.",
        "Never invent a number to make the case look stronger. If you do not know how many students struggle, say so, and make it a question the pilot will answer. An honest gap is far easier to defend than a made-up figure. Then say when the gap will close, and who will report it.",
      ],
      example: {
        language: 'text',
        code: code`
          Staff time saved per year (estimate)
            low:   300 hours    assumes 1 in 10 tutor requests is a note-finding question
            high:  900 hours    assumes 1 in 4, based on the trial sample of 40 requests
            not counted yet: effect on withdrawals, until the pilot measures it
        `,
      },
    },
    {
      heading: 'Choose a measurement the pilot can test',
      paragraphs: [
        "A business case is a set of predictions, and predictions need measurement. Choose one or two measures the pilot can collect without much effort, such as the number of tutor requests about notes or the share of students who use the assistant twice in a week.",
        "Decide in advance what result would make the case weaker. Writing that threshold first protects the team from reading success into any small improvement. Revisit the threshold with the committee before the pilot begins, so the agreement is shared. A pilot that could not have failed is not a test. Keep the measure simple enough that the team will actually collect it every week.",
      ],
      example: {
        language: 'text',
        code: code`
          Measure:       tutor requests about finding notes, per week
          Expected:      at least 20 percent fewer in the pilot group than last term
          Would weaken:  a change of less than 5 percent after eight weeks
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The Riverside business case, one page',
    intro: "The delivery team writes this summary for the dean's budget committee. It states the outcome, gives ranges with their assumptions, names what is not yet known and says what the pilot will test. The notes after it explain why each part helps the committee decide.",
    example: {
      language: 'text',
      code: code`
        Business case: Riverside study assistant pilot (summary)

        Outcome: fewer students stuck before exams, and fewer tutor hours spent on note questions.

        Cost of the pilot: a fixed amount for 200 students over one term, including model
        charges and two staff weeks for setup. The full figure is in appendix A.

        Staff time saved, per year (range):
          300 to 900 hours. Assumes 1 in 10 to 1 in 4 tutor requests is about finding notes.
          Source: tutor request log, sample of 40 requests, October.

        Not yet known: whether students who use the assistant withdraw less often.

        The pilot will test two things: tutor requests about notes, and withdrawals in the
        pilot group compared with last term. We will report both at week 8.
      `,
    },
    steps: [
      { code: 'Outcome: fewer students stuck before exams, and fewer tutor hours', explanation: "The case opens with the outcomes the committee cares about, so the cost has a purpose before it is mentioned." },
      { code: 'Staff time saved, per year (range): 300 to 900 hours', explanation: "A range, with the assumptions named beside it and the source of the sample. The committee can challenge the assumption directly." },
      { code: 'Not yet known: whether students who use the assistant withdraw less often.', explanation: "The unknown is stated plainly. This makes the rest of the case more believable, because the team has not claimed what it cannot yet show." },
      { code: 'We will report both at week 8.', explanation: "The pilot is the test of the case, with a date. The committee can see when the estimate will be checked and what will count." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a project you know and write its outcome in one sentence, using a change in people, money or risk rather than the feature.',
      'Estimate its value as a low and a high figure. Write the assumption behind each, and name where a real number could come from.',
      'Choose one measure the team could collect in a month, and write the result that would weaken the case before you collect any data.',
    ],
  },
  mistakes: [
    { mistake: 'Stating a precise value with no source or assumption.', fix: 'Give a range, and write the assumption and its source beside each figure.' },
    { mistake: 'Describing the feature as the value.', fix: 'Name the change in people, money or risk that the feature is meant to produce.' },
    { mistake: 'Choosing a measure that the pilot cannot fail.', fix: 'Decide in advance what result would weaken the case, and write it down before the pilot starts.' },
  ],
  quiz: [
    {
      question: 'Your proposal says the assistant will "save staff time." What is the strongest improvement?',
      options: [
        { text: 'Add more adjectives, such as "significant" and "substantial"', explanation: 'Adjectives make the claim sound larger without making it checkable.' },
        { text: 'Name the outcome, such as fewer tutor requests about notes, and give a range with its assumptions', explanation: 'A named outcome with a range and assumptions is something the committee can test and discuss.' },
        { text: 'Quote a single exact figure of 4,000 hours with no source', explanation: 'A precise figure without a source invites doubt about everything else in the case.' },
        { text: 'Remove the claim, since staff time is hard to estimate', explanation: 'Hard to estimate is not the same as unimportant. Ranges and assumptions make the claim usable.' },
      ],
      answer: 1,
    },
    {
      question: 'The committee asks how many students struggle to find their notes. You do not know the number. What should you say?',
      options: [
        { text: 'About half, based on what teachers say', explanation: 'Half is a number that has not been measured, and the committee will ask for its source.' },
        { text: 'Most students, since everyone struggles with notes', explanation: 'A general impression is not an estimate, and it overstates what the team knows.' },
        { text: 'It does not matter, since the feature is good on its own', explanation: 'The committee needs to know the value, and a feature alone does not justify the cost.' },
        { text: 'We do not know yet, and the pilot will measure it, with the trial sample as the first estimate', explanation: 'Saying the gap is real and naming how it will be measured is more defensible than an invented figure.' },
      ],
      answer: 3,
    },
    {
      question: 'Before the pilot starts, what should the team write down?',
      options: [
        { text: 'The result they hope to see, so the team stays motivated', explanation: 'A hoped-for result does not say what would weaken the case, so it cannot test it.' },
        { text: 'Only the results that would confirm the case', explanation: 'Writing only confirming results makes the pilot unable to fail, which is not a test.' },
        { text: 'The change that would weaken the case, written before any data is collected', explanation: 'A threshold written in advance protects the team from reading success into a small change.' },
        { text: 'The final budget, once the pilot is over', explanation: 'The budget matters, but the test of the case depends on the threshold written before the data arrives.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Connect the solution to an outcome the buyer values, estimate its value as a range with every assumption written down and choose a measurement that could show the case is weaker than expected.',
  resources: [
    { title: 'Value proposition', provider: 'Wikipedia', description: 'What a value proposition says to a customer, and why it matters.', url: 'https://en.wikipedia.org/wiki/Value_proposition' },
    { title: 'Business case', provider: 'Wikipedia', description: 'How a business case weighs costs, benefits, and risks.', url: 'https://en.wikipedia.org/wiki/Business_case' },
    { title: 'The Service Manual', provider: 'UK Government Digital Service', description: 'Public-sector guidance on setting out the costs, benefits and risks of a digital service.', url: 'https://www.gov.uk/service-manual' },
  ],
  underTheHood: {
    heading: 'Why ranges are more honest than point estimates',
    paragraphs: [
      "A point estimate, such as 600 hours, looks precise, but the precision is usually false. The figure depends on several assumptions, and each one has its own uncertainty. A range shows how far the answer could move as those assumptions change, which is the honest picture.",
      "Forecasters often report intervals for this reason. A weather forecast that says a 30 percent chance of rain tells you more than one that simply says it will rain. Business cases work the same way, because the decision depends on how bad the low case would be as well as how good the high case could be.",
      "The range also tells you which assumption to test first. If the result is very sensitive to one assumption, such as the share of tutor requests about notes, that is where the pilot should measure. A narrow range on the things that matter is worth more than a confident number on the things that do not.",
    ],
  },
}

export default lesson
