import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the difference between validity and reliability, with an everyday example of each',
    'Write survey questions that are clear, neutral, and answerable in one way',
    'Check reliability with repeated measures, and say what a low value tells you',
  ],
  bigIdea: 'A measure is useful only if it captures the thing you care about (validity) and gives consistent results when nothing has changed (reliability). Before collecting data, decide what each measure stands for, write questions that people read and answer the same way, and check that the answers are stable. Many research failures come from measuring something related to the question rather than the question itself.',
  whyItMatters: 'A school wants to know whether a new reading program improves understanding. It measures students by how many books they finish in a month. Students who finish more books may already be good readers, and the program may do nothing for understanding at all. The data is clean and the chart looks convincing, but it answers a different question.',
  goalSections: [
    {
      heading: 'Validity: measuring the right thing',
      paragraphs: [
        'Validity asks whether a measure captures the concept it is supposed to capture. A thermometer is valid for temperature, but a sticker on a window is not valid for temperature, even if it changes color. The question is always what the measure stands for, and whether that is what you need to know.',
        'Many concepts cannot be measured directly. Understanding, wellbeing, and confidence must be inferred from something observable, such as a test answer, a self-report, or a behavior. Each proxy can miss part of the concept, so state the gap and check whether the proxy tracks the real idea.',
        'Check validity by asking whether the measure would change if the concept changed. If the reading program really improved understanding, students should score higher on questions that test understanding, not only on the number of books read.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Concept:  understanding of a text
          Proxy 1:  books finished per month           (may track reading habit, not understanding)
          Proxy 2:  answers to questions about passages  (closer to understanding)
          Check:    do students who understand more score higher on Proxy 2 after the program?
        `,
      },
    },
    {
      heading: 'Reliability: consistent results',
      paragraphs: [
        'Reliability asks whether the measure gives the same result when the thing being measured has not changed. A scale that shows different weights for the same bag is unreliable. A survey that gives very different answers to the same question a week apart may be unreliable too.',
        'Test-retest reliability repeats the measure with the same people after a short gap, when nothing relevant has changed. A high correlation between the two rounds suggests the measure is stable. Internal consistency checks whether several questions about one idea agree with each other.',
        'A low reliability score is a warning, not a verdict. It may mean the questions are unclear, the scoring is inconsistent, or the concept is changing from day to day. Fix the cause before trusting any result from that measure.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          week1 = [70, 82, 64, 91, 77]
          week2 = [72, 80, 66, 90, 75]
          n = len(week1)
          mean1, mean2 = sum(week1) / n, sum(week2) / n
          cov = sum((a - mean1) * (b - mean2) for a, b in zip(week1, week2))
          var1 = sum((a - mean1) ** 2 for a in week1)
          var2 = sum((b - mean2) ** 2 for b in week2)
          r = cov / (var1 * var2) ** 0.5
          print("test-retest correlation:", round(r, 2))
        `,
        output: 'test-retest correlation: 0.99',
      },
    },
    {
      heading: 'Writing questions people answer the same way',
      paragraphs: [
        'Ask one thing per question. "Was the program fun and useful?" asks two things, and a student who found it fun but not useful cannot answer honestly. Split it into two questions.',
        'Avoid leading questions. "How much did the excellent new program help you?" pushes people toward agreement. "How much did the program help you?" with a neutral scale gives an honest answer.',
        'Pilot the questions with a few people before the full study. Ask them to say in their own words what each question means. Where their version differs from yours, rewrite the question. Keep a note of each change and the reason, so the final questionnaire can be explained.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Unclear: "Was the program fun and useful?"
          Split:   "Was the program fun?"  and  "Was the program useful?"
          Leading: "How much did the excellent new program help you?"
          Neutral: "How much did the program help you?" with a scale from "not at all" to "a great deal"
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking whether a measure is stable',
    intro: 'The program above compares two rounds of the same measure with the same students and reports the correlation. A value near 1 suggests a stable measure. Run it, then change one week-two score by a large amount and predict how the correlation changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        round_one = [70, 82, 64, 91, 77]
        round_two = [72, 80, 66, 90, 75]
        n = len(round_one)
        m1, m2 = sum(round_one) / n, sum(round_two) / n
        cov = sum((a - m1) * (b - m2) for a, b in zip(round_one, round_two))
        v1 = sum((a - m1) ** 2 for a in round_one)
        v2 = sum((b - m2) ** 2 for b in round_two)
        r = cov / (v1 * v2) ** 0.5
        verdict = "stable enough to use" if r >= 0.8 else "check the questions before using"
        print("correlation:", round(r, 2), "-", verdict)
      `,
      output: 'correlation: 0.99 - stable enough to use',
    },
    steps: [
      { code: 'cov = sum((a - m1) * (b - m2) ...)', explanation: 'Measures how the two rounds move together around their averages.' },
      { code: 'r = cov / (v1 * v2) ** 0.5', explanation: 'Scales that movement to a value from minus one to one, so the size can be compared.' },
      { code: 'verdict = "stable enough to use" if r >= 0.8 ...', explanation: 'Applies a threshold chosen in advance. The threshold is a judgment, and it should be stated in the report.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write one concept you want to measure in your own study, and two proxies for it. Say what each proxy misses.',
      'Change one value in round_two of the seeItInAction example to 40, and predict whether the verdict changes. Run it to check.',
      'Rewrite a survey question you have written so that it asks one thing and uses a neutral wording.',
    ],
  },
  mistakes: [
    { mistake: 'Measuring a convenient proxy and claiming it measures the real concept.', fix: 'State the gap between the proxy and the concept, and test whether the proxy tracks the concept.' },
    { mistake: 'Writing questions with two ideas in one.', fix: 'Ask one thing per question, and split double questions.' },
    { mistake: 'Trusting a measure without checking its stability.', fix: 'Repeat the measure on the same people when nothing has changed, and check the agreement.' },
  ],
  quiz: [
    {
      question: 'What does validity ask?',
      options: [
        { text: 'Whether the measure captures the concept it is supposed to capture', explanation: 'Yes. Validity is about measuring the right thing.' },
        { text: 'Whether the same result appears on repeated measurement', explanation: 'That is reliability, a different property.' },
        { text: 'Whether the data is stored safely', explanation: 'Storage is a privacy concern, not validity.' },
        { text: 'Whether the sample is large enough', explanation: 'Sample size is a separate design question.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a perfect match between two rounds?',
      code: { language: 'python', runnable: true, code: code`
        a = [1, 2, 3]
        b = [2, 4, 6]
        ma, mb = sum(a) / 3, sum(b) / 3
        cov = sum((x - ma) * (y - mb) for x, y in zip(a, b))
        va = sum((x - ma) ** 2 for x in a)
        vb = sum((y - mb) ** 2 for y in b)
        print(round(cov / (va * vb) ** 0.5, 2))
      ` },
      options: [
        { text: '0.5', explanation: 'The two rounds move together perfectly here, so the value is not one half.' },
        { text: '1.0', explanation: 'Yes. The second round is exactly twice the first, so the correlation is 1.' },
        { text: '-1.0', explanation: 'A negative value would mean the rounds move in opposite directions.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why pilot survey questions with a few people before the full study?',
      options: [
        { text: 'To check that people read each question the way the researcher intends', explanation: 'Yes. Pilots reveal wording that people understand differently.' },
        { text: 'To make the survey longer', explanation: 'Piloting aims to improve questions, not to lengthen them.' },
        { text: 'To avoid asking any questions', explanation: 'Piloting is about making questions clearer.' },
        { text: 'To pay participants more', explanation: 'Payment is not the purpose of a pilot.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Good measures capture the concept they claim to measure and give stable results when nothing has changed, so check what each proxy misses, write one-idea neutral questions, and test stability before trusting the numbers.',
  resources: [
    { title: 'Reliability and validity', provider: 'Research Methods Knowledge Base', description: 'A clear explanation of validity and reliability, with types and examples.', url: 'https://conjointly.com/kb/reliability-and-validity/' },
    { title: 'Survey design guidance', provider: 'Pew Research Center', description: 'Practical advice on writing neutral, clear survey questions and testing them.', url: 'https://www.pewresearch.org/methods/' },
  ],
}

export default lesson
