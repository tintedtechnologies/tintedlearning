import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Statistical Inference and Experiments from this section, which explains p-values and confidence intervals. The example paper in this lesson is made up for teaching and is not a real study.',
  goals: [
    'Find the claim, the comparison and the evidence in a research paper',
    'Judge the sample, the measure and the conditions of the study',
    'Look for what the study did not test, and what its authors admit',
  ],
  bigIdea: "A research paper makes a claim and offers evidence for it. Reading one well means finding the claim first, then checking the comparison, the sample and the measure. Many readers start with the conclusion and never ask what was actually compared, and that is where most misreadings begin.",
  whyItMatters: "A headline such as \"Study sessions beat cramming\" often comes from one paper, summarized by someone who did not read the methods. A short reading routine lets you separate claims that rest on a fair comparison from claims that rest on a few learners, an easy-to-game measure or a study that could not have found anything else.",
  goalSections: [
    {
      heading: 'Find the claim and the comparison',
      paragraphs: [
        "Start with the abstract, the short summary at the top. Find the sentence that states the main result, then find the comparison behind it. A claim such as \"daily study improved scores\" is incomplete until you know improved compared with what, and by how much.",
        "Write the comparison in one line: group A, group B, outcome. Keep that line at the top of your notes, so every later check is measured against it. If you cannot write that line from the abstract, read the methods section until you can. A claim you cannot restate in this form is one you should not repeat.",
      ],
      example: {
        language: 'text',
        code: code`
          Claim:       daily study improved quiz scores
          Comparison:  daily group (15 minutes a day) vs weekly group (105 minutes once a week)
          Outcome:     quiz score at the end of four weeks
          Missing:     how many learners were in each group
        `,
      },
    },
    {
      heading: 'Judge the sample and the measure',
      paragraphs: [
        "The sample is the learners who took part. A result from 40 learners is a much weaker guide than one from 4,000, and the sample also matters for who it describes. Ask who was in it, how they were chosen, and whether they resemble the learners you care about.",
        "The measure is what counts as the outcome. A quiz that is taken at home, with notes open, measures something different from a quiz taken in class. Check when the measure was taken, by whom and under what rules, because a measure that is easy to game can show a gain that is not learning.",
      ],
      example: {
        language: 'text',
        code: code`
          Question                              Why it matters
          How many learners in each group?      small groups give unstable results
          How were they assigned?               chosen choices can hide the real cause
          Where and how was the quiz taken?     home quizzes can be looked up
          How long was the study?               four weeks says little about years of practice
        `,
      },
    },
    {
      heading: 'Look for what was not tested',
      paragraphs: [
        "Good papers list their limitations, and the limitations section is often the most informative part. Read it for what the authors could not control, what they did not measure and which learners they could not reach. Authors who name their limits are usually easier to trust than authors who do not. Each gap is a reason the claim may be weaker than the headline.",
        "Also ask what would have been tested if the study were done differently, such as a third group or a later test. A study that compared only two schedules cannot say whether a third schedule would do better, and the paper should not imply that it does.",
      ],
      example: {
        language: 'text',
        code: code`
          Found in the limitations or the design      What it means for the claim
          participants knew their schedule            expectations may affect the scores
          no follow-up test after four weeks          the gain may not last
          only one subject area was studied           the result may not carry to other subjects
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Reading a made-up abstract, step by step',
    intro: "The abstract below is invented for teaching. It is not a real study. Read it the way the lesson describes: find the claim, check the comparison, judge the sample and the measure, then look for what was not tested.",
    example: {
      language: 'text',
      code: code`
        Abstract (fictional): We randomly assigned 40 volunteers to study statistics either 15 minutes
        a day or 105 minutes once a week for four weeks. Quiz scores at the end were 12 points higher
        in the daily group (95 percent interval 6 to 18). Participants knew which schedule they had
        been given, and quizzes were taken at home. The study was funded by a company that sells
        daily study reminders.
      `,
    },
    steps: [
      { code: 'Quiz scores at the end were 12 points higher in the daily group', explanation: "The claim. Written as a comparison: daily learners against weekly learners, on quiz score, at the end of four weeks." },
      { code: '15 minutes a day or 105 minutes once a week', explanation: "The total time matches, so the comparison is about how the time was spread. That is the same design choice our study makes." },
      { code: 'We randomly assigned 40 volunteers', explanation: "Random assignment is strong, but 40 volunteers is a modest sample, and the volunteers may not match the learners you care about." },
      { code: 'Participants knew which schedule they had been given, and quizzes were taken at home', explanation: "Two weaknesses. Expectations can raise scores, and quizzes taken at home could be looked up. Neither is a fatal flaw, but both make the 12-point gap less certain." },
      { code: 'funded by a company that sells daily study reminders', explanation: "A possible conflict of interest. It does not prove the result is wrong, but it is a reason to look for other studies that test the same claim." },
    ],
  },
  tryIt: {
    instructions: [
      'Copy the fictional abstract into a file called `paper_notes.md`. Write the claim, the comparison and the outcome in one line each, as the lesson shows.',
      'Answer five questions in the same file: how many learners were in each group, how they were assigned, what the quiz measured, what was not tested and who paid for the study.',
      'Find a short real study on a learning habit, such as a university press release that links to its paper. Complete the same checklist, and write whether the claim is stronger or weaker than the headline.',
    ],
  },
  mistakes: [
    { mistake: 'Reading only the abstract and the conclusion.', fix: 'Read the methods section for the comparison, the sample and the measure before you repeat a claim.' },
    { mistake: 'Accepting a claim because the paper was published.', fix: 'Judge the evidence in the paper, since publication does not guarantee the study is correct.' },
    { mistake: 'Ignoring the sample size.', fix: 'Check how many learners were in each group, and treat a small study as a weaker guide.' },
    { mistake: 'Skipping the limitations section.', fix: 'Read it first, because the authors often name the weaknesses you would otherwise miss.' },
  ],
  quiz: [
    {
      question: 'A paper says daily learners scored higher. Which question should you ask first?',
      options: [
        { text: 'Who wrote the conclusion', explanation: 'The author matters less than the evidence, so this is not the first question.' },
        { text: 'What exactly was compared with what, and how many learners were in each group', explanation: 'A claim cannot be judged until you know the comparison and the size of each group.' },
        { text: 'How long the paper is', explanation: 'Length says nothing about whether the comparison was fair.' },
        { text: 'Whether the title is catchy', explanation: 'A catchy title is a sign to read more carefully, not evidence for the claim.' },
      ],
      answer: 1,
    },
    {
      question: 'The participants knew their schedule, and quizzes were taken at home. Why does this matter?',
      options: [
        { text: 'It makes the paper longer', explanation: 'Length is not the concern here. The issue is how the study was run.' },
        { text: 'It only matters for online studies', explanation: 'Expectations and home quizzes can affect results in any study, not only online ones.' },
        { text: 'Expectations and the chance to look up answers could push scores up, which the comparison does not rule out', explanation: 'Both features can inflate the gap, and the design does not remove them.' },
        { text: 'It proves the study is wrong', explanation: 'These are weaknesses to weigh, not proof that the result is false.' },
      ],
      answer: 2,
    },
    {
      question: 'The company that funded the study sells daily study reminders. What should a careful reader do?',
      options: [
        { text: 'Trust the paper, since it was peer reviewed', explanation: 'Peer review checks some things, but it does not remove a conflict of interest.' },
        { text: 'Ignore the funding, since money never affects results', explanation: 'Funding can shape a study in ways that are hard to see, so it should be noted.' },
        { text: 'Discard every result in the paper', explanation: 'Funding is a reason for caution, not a reason to throw out the data.' },
        { text: 'Note the possible conflict of interest, and look for other studies that test the same claim', explanation: 'Independent studies that test the same claim are the best check on a single, funded result.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Read a paper by finding its claim and comparison, judging its sample and measure, and checking what it did not test before you repeat any of its results.',
  resources: [
    { title: 'Peer review', provider: 'Wikipedia', description: 'How papers are checked before publication, and what that check does not guarantee.', url: 'https://en.wikipedia.org/wiki/Peer_review' },
    { title: 'How to Read a Paper', provider: 'S. Keshav, Stanford University', description: 'A short, practical guide to reading a research paper in three passes.', url: 'https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf' },
  ],
  underTheHood: {
    heading: 'Why peer review does not guarantee correctness',
    paragraphs: [
      "Peer review is a process in which experts read a paper before it is published. Reviewers check whether the methods are described clearly, whether the conclusions follow from the data and whether the work is important enough for the journal. They cannot repeat every calculation, and they usually see only what the authors chose to report.",
      "This means a published paper is a claim that has passed one check. Some published results later fail to replicate, which means other researchers running the same study got different results. The replication problem is well known, and many fields now encourage registered plans and shared data for exactly this reason.",
      "For a reader, the lesson is practical. Treat a single paper as one piece of evidence, and look for several studies that point the same way. Agreement across independent studies, with different samples and methods, carries far more weight than one impressive result.",
    ],
  },
}

export default lesson
