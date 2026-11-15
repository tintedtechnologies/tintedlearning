import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Probability and Statistics for AI from the Math section, and the Python lessons on functions and files. This lesson starts the one study question that the Research section follows from start to finish.',
  goals: [
    'Turn a vague question into one you can test with data',
    'Name the groups you will compare and the outcome you will measure',
    'Write a prediction down before you look at any data',
  ],
  bigIdea: "A research question is useful only when data can answer it. To make one testable, name the groups you compare, the outcome you measure and the result that would show you were wrong. Writing your prediction before you look at the data keeps the test honest.",
  whyItMatters: "Asking whether short study sessions help can mean a dozen different things. Two people who answer it differently may both be right about their own versions of the question. Without a sharp question, you can collect data for weeks and still not know whether it supports anything you believe.",
  goalSections: [
    {
      heading: 'From vague to testable',
      paragraphs: [
        "A vague question uses words that cannot be counted, such as \"better\", \"help\" or \"work\". A testable question names a comparison, a measurement and a time. The test is simple: could two people look at the same data and agree on the answer?",
        "Our study question starts vague: do short daily study sessions lead to better quiz scores than one long weekly session? Each part needs a definition before any data can answer it. What counts as short, what counts as a quiz score and when is the score taken.",
        "A quick check: ask a classmate to explain how they would answer your question with data. If they must ask what a word means, the question is still vague, so sharpen that word before you go on. Most vague questions become clear after one or two rounds of this.",
      ],
      example: {
        language: 'text',
        code: code`
          Vague                                   Testable
          Does studying often help?               Do learners who study 15 minutes a day score higher
                                                  on a 100-point quiz after 4 weeks than learners who
                                                  study 105 minutes once a week?
          Is practice better than reading?        Do learners who practice problems score higher on
                                                  the same test than learners who only reread notes?
        `,
      },
    },
    {
      heading: 'Name the groups and the measure',
      paragraphs: [
        "Each group in the comparison needs a definition that someone else could follow. \"Daily\" means 15 minutes on each of 28 days. \"Weekly\" means 105 minutes in one session on a fixed day. Both groups get the same total time, so a difference in scores cannot come only from more study.",
        "The measure needs the same care. A quiz score out of 100, taken at the end of the four weeks, can be checked by anyone. A feeling of confidence, reported when the learner remembers, is much harder to compare fairly. A short written definition of each term, reviewed by someone outside the project, catches most of these gaps early.",
      ],
      example: {
        language: 'text',
        code: code`
          Part           Our definition
          group A        daily: 15 minutes, every day for 4 weeks
          group B        weekly: 105 minutes in one session, once a week for 4 weeks
          outcome        quiz_score, out of 100, taken on the same day for everyone
          comparison     the difference between the two group averages
        `,
      },
    },
    {
      heading: 'Predict before you look',
      paragraphs: [
        "Write your prediction before you open the data. Say which group you expect to do better, by roughly how much, and what result would prove you wrong. This is not a formality. Once you have seen the numbers, it is easy to remember a prediction that fits them and forget one that did not. Writing the prediction also shows you what you believe right now, which is worth knowing before the study starts.",
        "A prediction that could be wrong is worth more than one that cannot. \"Daily learners will score higher\" can be shown false. \"Learning depends on many things\" cannot, so it teaches you nothing from this study.",
      ],
      example: {
        language: 'text',
        code: code`
          Prediction, written before any data was collected
            direction    daily learners score higher than weekly learners
            size         a difference of at least 5 points between the means
            wrong if     the daily mean is equal to or lower than the weekly mean
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Writing the plan for our study question',
    intro: "The script below writes the study plan down as data. Before any data exists, it fixes the question, the groups, the outcome and the result that would count against the prediction. Running it prints the plan so the whole team reads the same version.",
    example: {
      language: 'python',
      filename: 'plan.py',
      code: code`
        question = "Do short daily study sessions lead to better quiz scores than one long weekly session?"

        plan = {
            "groups": "daily: 15 minutes a day; weekly: 105 minutes once a week",
            "outcome": "quiz_score, out of 100, after 4 weeks",
            "comparison": "difference between the two group means",
            "prediction": "the daily group scores higher on average",
            "wrong_if": "the daily mean is equal to or lower than the weekly mean",
        }

        print(question)
        for part, text in plan.items():
            print(f"{part}: {text}")
      `,
      output: "Do short daily study sessions lead to better quiz scores than one long weekly session?\ngroups: daily: 15 minutes a day; weekly: 105 minutes once a week\noutcome: quiz_score, out of 100, after 4 weeks\ncomparison: difference between the two group means\nprediction: the daily group scores higher on average\nwrong_if: the daily mean is equal to or lower than the weekly mean",
    },
    steps: [
      { code: 'question = "Do short daily study sessions lead to better quiz scores than one long weekly session?"', explanation: "The question is kept as one string at the top, so every later step refers to the same wording." },
      { code: '"groups": "daily: 15 minutes a day; weekly: 105 minutes once a week"', explanation: "Both groups get 105 minutes in total. Equal study time means the comparison is about how the time is spread, not how much of it there is." },
      { code: '"wrong_if": "the daily mean is equal to or lower than the weekly mean"', explanation: "The result that would prove the prediction wrong is written down now, before the data arrives, so nobody can move the goalposts later." },
      { code: 'print(f"{part}: {text}")', explanation: "Printing the plan gives the team one shared version to check against when the results are written up." },
    ],
  },
  tryIt: {
    instructions: [
      'Write your own study question about a habit you care about, such as reading before bed or practicing at lunch. Make it testable by naming the two groups, the outcome and the time it is measured.',
      'Write your prediction in a file called `prediction.txt`, with the direction, the size you expect and the result that would prove you wrong. Save it with the date, and do not change it later.',
      'Copy `plan.py`, replace its text with your own question and run it. Check that every part of your plan has a definition someone else could follow.',
    ],
  },
  mistakes: [
    { mistake: 'Deciding what to measure after seeing the data.', fix: 'Write the outcome and the comparison down before collecting anything, and keep the written version.' },
    { mistake: 'Asking a question that no data could answer.', fix: 'Replace words such as "better" or "help" with a score, a comparison and a time.' },
    { mistake: 'Changing the question partway through the study.', fix: 'If the question must change, start a new study and say so, rather than quietly reusing the old data.' },
    { mistake: 'Comparing groups that differ in more than the one thing you care about.', fix: 'Keep everything else equal, such as total study time, and name anything you could not control.' },
  ],
  quiz: [
    {
      question: 'Which of these questions can data answer?',
      options: [
        { text: 'Are study sessions good?', explanation: '"Good" is not measured, so two people could never check the answer the same way.' },
        { text: 'Is learning fun?', explanation: 'Fun has no agreed measure, so this question cannot be tested as written.' },
        { text: 'What is the best way to study?', explanation: 'The best way depends on a goal that has not been defined yet.' },
        { text: 'Does a 15-minute daily session give higher quiz scores than a 105-minute weekly session, measured after four weeks?', explanation: 'It names the groups, the outcome and the time, so data can support or contradict it.' },
      ],
      answer: 3,
    },
    {
      question: 'A team writes its prediction after looking at the scores. Why is that a problem?',
      options: [
        { text: 'It is fine, since the team knows the data best', explanation: 'Knowing the data is useful, but it also shapes which prediction feels right.' },
        { text: 'It makes the study slower', explanation: 'Speed is not the issue. The issue is that the prediction may just describe the data.' },
        { text: 'The prediction may be shaped by what the data already shows, so it cannot test anything', explanation: 'A prediction written after the results cannot be wrong, so it cannot be a real test.' },
        { text: 'Predictions must be made by a computer', explanation: 'A person can write a prediction. The timing is what matters.' },
      ],
      answer: 2,
    },
    {
      question: 'Both groups get 105 minutes of study in total, but one group studies daily. Why keep the total equal?',
      options: [
        { text: 'So the groups have the same number of learners', explanation: 'Group size is a separate question, handled by the design.' },
        { text: 'So a difference in scores cannot be explained just by how much time was spent studying', explanation: 'Equal total time removes the amount of study as an explanation, so any difference points to how it was spread.' },
        { text: 'So the study takes the same number of days', explanation: 'The days are not the same in both groups, so this is not the reason.' },
        { text: 'So each learner reads the same notes', explanation: 'Reading the same notes is a different control, and it is not what total time controls.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'A research question becomes useful when you name the groups, the measure and the result that would prove your prediction wrong, and you write all of it down before the data arrives.',
  resources: [
    { title: 'The Turing Way: Project design', provider: 'The Turing Way', description: 'A free guide to planning research so that its questions, data and methods can be checked.', url: 'https://the-turing-way.netlify.app/' },
  ],
  underTheHood: {
    heading: 'Why a written prediction protects the result',
    paragraphs: [
      "Researchers call the choices made after seeing data forking paths. Each choice, such as which outcome to report, which learners to drop or which comparison to show, is a fork. A study that takes many forks and reports the one that looks best can find a result in almost any data, even when nothing real is there.",
      "Writing the question, the groups and the prediction first closes most of those forks. Some fields go further and register the plan publicly before collecting data, so readers can see what was planned and what was changed later. Pick a sensible place to publish, such as a shared document with a date on it, even if no journal requires one. The step is small, and it makes the final claim much easier to trust.",
      "A written prediction also helps the researcher. When the result is different from what was expected, the gap is information. It shows which assumption was wrong, and that is often the most useful thing a study can teach.",
    ],
  },
}

export default lesson
