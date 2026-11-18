import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Plan a small study from a testable question through measures, groups, ethics, and analysis',
    'Check the plan against the common threats: bias, small samples, and results chosen after the fact',
    'Write a short report that states the answer, the evidence, and the limits',
  ],
  bigIdea: 'A research plan is strong when each part connects to the question. The question names what to compare, the measures capture that comparison, the groups are chosen fairly, the ethics protect the people involved, and the analysis is decided before the data arrives. This checkpoint brings the research section together in one small study you plan and report.',
  whyItMatters: 'Many studies fail without anyone lying. The question changes after the data is seen, one group is easier to reach than another, and the result is reported with more confidence than the sample supports. A plan written in advance, checked against these threats, makes the study honest and makes its result worth trusting.',
  goalSections: [
    {
      heading: 'Plan the study in order',
      paragraphs: [
        'Start with a question you can test, written with the groups and the measure. "Do students who use the reading app for four weeks score higher on a comprehension test than students who do not?" names the groups, the measure, and the comparison. Write your prediction before looking at any data.',
        'Choose the measure and check its validity and reliability, as covered in the measuring lesson. Decide how groups will be formed, whether by random assignment, by a natural comparison, or by matching, and say what each choice can and cannot show.',
        'Write the ethics plan with the consent summary, the data you will collect, the minimum group size for reporting, and the retention limit, as covered in the ethics lesson. Get any approval your context requires before data collection starts.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          plan = {
              "testable question": True,
              "prediction written": True,
              "validated measure": True,
              "group selection explained": True,
              "consent summary": False,
              "analysis decided": False,
          }
          open_items = [item for item, done in plan.items() if not done]
          print("ready to collect" if not open_items else "finish before collecting: " + ", ".join(open_items))
        `,
        output: 'finish before collecting: consent summary, analysis decided',
      },
    },
    {
      heading: 'Check the common threats',
      paragraphs: [
        'Selection bias happens when the groups differ in ways that affect the result. If the app is used by students who already read more, a difference in scores may come from them, not the app. Name the difference, and say whether you can adjust for it or must report it as a limit.',
        'Small samples produce unstable results. A difference of ten points between two groups of four students can appear by chance. Decide the sample size before collecting, and report the uncertainty, not only the average. A wider range is an honest result, and it is better than a precise number from too few people.',
        'Results chosen after the fact are a serious threat. If you try many analyses and report the one that looks best, the result is likely to be a coincidence. Write the main analysis in the plan, and label any additional analysis as exploratory.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          threats = {
              "groups differ before the study": "name it, then adjust or report as a limit",
              "sample too small to be stable": "decide the sample size in advance",
              "analysis chosen after the data": "fix the main analysis in the plan",
          }
          for threat, response in threats.items():
              print(threat, "->", response)
        `,
        output: 'groups differ before the study -> name it, then adjust or report as a limit\nsample too small to be stable -> decide the sample size in advance\nanalysis chosen after the data -> fix the main analysis in the plan',
      },
    },
    {
      heading: 'Write the report',
      paragraphs: [
        'Open with the answer to the question, in one or two sentences, including the size of the difference and how certain you are. A reader should know the finding before the method.',
        'Give the evidence next: the groups, the measure, the result, and the uncertainty. Show the numbers that support the answer, and say which ones are exploratory.',
        'End with the limits. State the threats you could not remove, the groups you did not include, and what a larger study would need to check. A report that names its limits is more useful to the next researcher than one that claims certainty. Share the plan publicly before collecting data when you can, so others can see what was decided in advance.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          checks = [
              ("prediction written before data", True),
              ("sample size decided in advance", True),
              ("main analysis fixed in the plan", False),
              ("limits section written", True),
          ]
          missing = [name for name, done in checks if not done]
          print("report checks passed:", len(checks) - len(missing), "of", len(checks))
          for name in missing:
              print("fix:", name)
        `,
        output: 'report checks passed: 3 of 4\nfix: main analysis fixed in the plan',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a study plan before data collection',
    intro: 'The program above checks a study plan against the items that must be finished before any data is collected. Items left open are the ones that would make the result hard to trust later. Run it, then mark the consent summary as finished and predict the output.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        plan = {
            "testable question": True,
            "prediction written": True,
            "validated measure": True,
            "consent summary": True,
            "analysis decided": False,
        }
        open_items = [item for item, done in plan.items() if not done]
        print("open items:", len(open_items))
        print("collect data:", "no" if open_items else "yes")
      `,
      output: 'open items: 1\ncollect data: no',
    },
    steps: [
      { code: 'open_items = [item for item, done in plan.items() if not done]', explanation: 'Lists every item in the plan that is not finished yet.' },
      { code: 'print("open items:", len(open_items))', explanation: 'Shows how much remains, so the plan can be tracked to completion.' },
      { code: 'print("collect data:", "no" if open_items else "yes")', explanation: 'Makes the rule explicit: no data is collected while the plan has open items.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a testable question for a topic you care about, with the groups, the measure, and the prediction, all before looking at any data.',
      'Change "analysis decided" in the seItInAction example to True and predict the output. Run it to check.',
      'Write the limits section for your plan: two threats you could not remove and what a larger study would need.',
    ],
  },
  mistakes: [
    { mistake: 'Choosing the analysis after seeing the results.', fix: 'Write the main analysis in the plan before collecting data, and label anything else as exploratory.' },
    { mistake: 'Reporting a difference from a very small sample as a finding.', fix: 'Decide the sample size in advance and report the uncertainty.' },
    { mistake: 'Writing a report with no limits section.', fix: 'Name the threats you could not remove, and what the next study would need.' },
  ],
  quiz: [
    {
      question: 'Why write the main analysis in the plan before collecting data?',
      options: [
        { text: 'So the result is not chosen from many analyses because one looked best', explanation: 'Yes. Fixing the analysis in advance prevents result-chasing.' },
        { text: 'So the data can be stored in a different format', explanation: 'Storage format is unrelated to the analysis plan.' },
        { text: 'So the study ends sooner', explanation: 'The timing of the study is not the reason.' },
        { text: 'So participants can read the analysis', explanation: 'Participants are not the reason for fixing the analysis in advance.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the open items count?',
      code: { language: 'python', runnable: true, code: code`
        plan = {"question": True, "analysis": False, "consent": False}
        print(len([k for k, v in plan.items() if not v]))
      ` },
      options: [
        { text: '1', explanation: 'Two items are False, so two are open.' },
        { text: '2', explanation: 'Yes. The analysis and consent items are open.' },
        { text: '3', explanation: 'The question item is True, so it is not open.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What belongs in a good report\'s opening?',
      options: [
        { text: 'The answer to the question, with the size of the difference and how certain it is', explanation: 'Yes. Readers need the finding and its certainty first.' },
        { text: 'The history of the researcher', explanation: 'Background is less important than the finding.' },
        { text: 'A list of every analysis tried', explanation: 'Listing every analysis invites the reader to doubt the result.' },
        { text: 'A thank you to everyone who was asked', explanation: 'Thanks are good practice but do not open the report with the answer.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Plan a small study from a testable question to valid measures, fair groups, ethical safeguards, and a fixed analysis, check it against bias, small samples, and results chosen after the fact, and report the answer, the evidence, and the limits.',
  resources: [
    { title: 'Research design guidance', provider: 'Open Science Framework', description: 'Practical resources for planning studies, preregistration, and transparent reporting.', url: 'https://www.cos.io/initiatives/prereg' },
    { title: 'Reporting guidelines', provider: 'EQUATOR Network', description: 'A library of reporting guidelines for different kinds of research studies.', url: 'https://www.equator-network.org/' },
  ],
}

export default lesson
