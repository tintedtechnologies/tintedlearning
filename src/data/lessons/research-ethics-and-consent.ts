import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain informed consent, and what a participant needs to know before agreeing',
    'Protect participants by minimizing the data collected, separating identities, and setting retention limits',
    'Identify the harms a study could cause, including harms that show up only later',
  ],
  bigIdea: 'Research uses people or data about people, so it carries duties to them. Informed consent means the participant understands what will happen, agrees freely, and can stop at any time. Good studies also collect only what they need, protect identities, plan for harm, and delete data when the purpose is finished, because ethics is part of the design rather than a form filled in at the end.',
  whyItMatters: 'A school tests a reading app and publishes a report with students\' names, scores, and the schools they attended. The report is accurate, but a parent recognizes their child, and the school loses the trust of families who had agreed to take part only for a private evaluation. Consent and anonymization decided at the start would have kept the findings and protected the children.',
  goalSections: [
    {
      heading: 'What informed consent requires',
      paragraphs: [
        'Informed consent has three parts. The participant must understand the purpose, the procedures, the risks, and what will happen to their data. They must agree without pressure, such as a grade depending on participation. And they must be able to withdraw at any time without penalty, with a clear way to do it.',
        'Write the consent in plain words, at a reading level the participant can follow. A long document that few people read does not count as understanding. Summarize the key points at the top, and give the participant time to ask questions before they sign or click agree.',
        'Children and other people who may not be able to consent for themselves need extra protection. In those cases, a parent or guardian consents, and the child is asked for their own agreement as well, in terms they can understand.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Purpose:      to see whether a reading app helps students finish practice tasks
          You will:     use the app for 4 weeks, with a short survey at the start and end
          Risks:        none expected; you can stop at any time without losing anything
          Data:         your answers and app use, kept for 2 years, then deleted
          You can:      withdraw at any time by emailing the study team
        `,
      },
    },
    {
      heading: 'Protecting identities and data',
      paragraphs: [
        'Collect only the data the question needs. A study on reading speed does not need a home address. Less data means less to protect, and less that could be leaked or misused.',
        'Separate identities from the answers. Give each participant a code, keep the list linking codes to names in a separate, restricted place, and report results only in groups large enough that no one can be picked out. Small groups can reveal individuals even when names are removed.',
        'Set a retention limit before collecting anything. Write down how long the data will be kept and why, and delete it at the end of that period. Data kept "in case we need it later" is a risk that grows every year.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          responses = [("P01", "Year 4", 71), ("P02", "Year 4", 68), ("P03", "Year 9", 90)]
          MIN_GROUP = 2
          by_year = {}
          for _, year, score in responses:
              by_year.setdefault(year, []).append(score)
          for year, scores in by_year.items():
              if len(scores) >= MIN_GROUP:
                  print(year, "average", round(sum(scores) / len(scores), 1), "from", len(scores), "students")
              else:
                  print(year, "suppressed: group too small to report safely")
        `,
        output: 'Year 4 average 69.5 from 2 students\nYear 9 suppressed: group too small to report safely',
      },
    },
    {
      heading: 'Harms that appear later',
      paragraphs: [
        'Most people think about harm during the study, such as a stressful question or a risky task. Harm can also come later, when data is leaked, when results are used to label a group unfairly, or when a participant is identified from a published chart. Plan for those harms too.',
        'Ask who could be affected by the findings, beyond the participants. A study that describes a community in a negative way can damage that community even if every participant was protected. Consider how the results will be read, and report the limits that matter.',
        'Have a plan for what happens if something goes wrong. Who is told, how quickly, and what is done for the people affected? Writing the plan before the study begins makes a quick and honest response possible.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          During the study: a question that causes stress
          Later, a leak: student scores are exposed, and a parent is contacted with a diagnosis
          Later, a label: a published chart calls one school "low performing" from four students
          Plan: who is told, within how many hours, and what support is offered
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking that a report is safe to publish',
    intro: 'The program above reports group averages only when a group is large enough. Small groups can reveal individuals, so the program suppresses them. Run it, then change the minimum group size to 1 and predict whether the Year 9 group appears.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        groups = {"Year 4": [71, 68], "Year 9": [90]}
        MIN_GROUP = 2

        for group, scores in groups.items():
            if len(scores) >= MIN_GROUP:
                print(group, round(sum(scores) / len(scores), 1))
            else:
                print(group, "not reported")
      `,
      output: 'Year 4 69.5\nYear 9 not reported',
    },
    steps: [
      { code: 'MIN_GROUP = 2', explanation: 'The smallest group that can be reported is set in one place, so the rule is visible and reviewable.' },
      { code: 'if len(scores) >= MIN_GROUP:', explanation: 'Checks the size before anything is published, not after.' },
      { code: 'print(group, "not reported")', explanation: 'Withholds results that could identify a single participant.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a consent summary for a small study you would run, with the purpose, what participants will do, the risks, the data kept, and how to withdraw. Keep it under 150 words.',
      'Change MIN_GROUP in the seeItInAction example to 1, and predict whether the Year 9 group is reported. Run it to check.',
      'List every piece of data you would collect for your study, and cross out any item the question does not need.',
    ],
  },
  mistakes: [
    { mistake: 'Writing consent in a long document that no one reads.', fix: 'Summarize the key points at the top, in plain words, and allow time for questions.' },
    { mistake: 'Publishing results for groups so small that individuals can be identified.', fix: 'Set a minimum group size before analysis, and suppress results below it.' },
    { mistake: 'Keeping data indefinitely in case it is useful later.', fix: 'Set a retention limit before collecting, and delete the data when it expires.' },
  ],
  quiz: [
    {
      question: 'Which of these is part of informed consent?',
      options: [
        { text: 'The participant can withdraw at any time without penalty', explanation: 'Yes. Withdrawal without penalty is a core part of consent.' },
        { text: 'The participant signs a long form they have not read', explanation: 'Signing without understanding does not count as informed consent.' },
        { text: 'The participant is offered a grade bonus to join', explanation: 'Incentives that pressure participation undermine free agreement.' },
        { text: 'The participant gives consent once and it never expires', explanation: 'Consent must allow withdrawal, so it is not permanent.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a group of one student?',
      code: { language: 'python', runnable: true, code: code`
        scores = [88]
        MIN_GROUP = 2
        print("reported" if len(scores) >= MIN_GROUP else "suppressed")
      ` },
      options: [
        { text: 'reported', explanation: 'A group of one is below the minimum of two, so it is not reported.' },
        { text: 'suppressed', explanation: 'Yes. One student is too few to report safely.' },
        { text: '88', explanation: 'The program prints the decision, not the score.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why is a retention limit written before data is collected?',
      options: [
        { text: 'So the data is deleted on a planned schedule instead of being kept indefinitely', explanation: 'Yes. A planned limit prevents data from piling up as a risk.' },
        { text: 'So the data can be sold later', explanation: 'Selling data is not a valid purpose and is not what a retention limit is for.' },
        { text: 'So the study runs faster', explanation: 'Retention does not change study speed.' },
        { text: 'So participants cannot ask questions', explanation: 'Retention has nothing to do with questions.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Research ethics means informed and freely given consent, collecting only what is needed, separating identities, suppressing small groups, setting retention limits, and planning for harms that appear after the study ends.',
  resources: [
    { title: 'The Belmont Report', provider: 'US Department of Health and Human Services', description: 'The foundational statement of ethical principles for research involving people: respect, beneficence, and justice.', url: 'https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/index.html' },
    { title: 'Ethical guidelines for research', provider: 'British Educational Research Association', description: 'Practical guidance on consent, confidentiality, and harm for education and social research.', url: 'https://www.bera.ac.uk/publication/ethical-guidelines-for-educational-research-2018' },
  ],
}

export default lesson
