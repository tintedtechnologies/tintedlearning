import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Research Questions and Data Collection and Cleaning from this section. The groups are the daily and weekly schedules defined earlier. All learners are placeholder codes.',
  goals: [
    'Explain why a comparison group is needed, and what it is compared against',
    'Assign learners to groups at random, with a repeatable method',
    'Name the confounders that could explain a difference, and handle the ones you can measure',
  ],
  bigIdea: "An experiment compares what happens to one group with what happens to another that differs in only the thing being tested. Random assignment makes the groups alike in ways you did not measure, so a difference in scores is more likely to come from the schedule. Anything else that could change the outcome is a confounder, and it must be measured or balanced.",
  whyItMatters: "Suppose learners pick their own schedules, and the daily learners score higher. That result could come from the schedule, or from the kind of learner who chooses a daily habit in the first place. Without a fair comparison, the study cannot tell these apart, and any claim about schedules would rest on luck.",
  goalSections: [
    {
      heading: 'A comparison group gives the result meaning',
      paragraphs: [
        "A score on its own means little. Ninety out of 100 sounds good, but it means something only next to another number. The comparison group provides that number, and the study asks how much the scores differ between the groups.",
        "In our study the comparison group is the weekly group. Both groups study for the same total time, so the only difference between them is how the time is spread. That makes the weekly group a fair control for the daily one. A study with no comparison group can still describe scores, but it cannot tell you whether the schedule made the difference.",
      ],
      example: {
        language: 'text',
        code: code`
          Group    Schedule                                   Total time
          daily    15 minutes every day, for 4 weeks          105 minutes per week
          weekly   105 minutes in one session, once a week    105 minutes per week
          The only planned difference is how the time is spread.
        `,
      },
    },
    {
      heading: 'Random assignment',
      paragraphs: [
        "Random assignment means a method that does not depend on the learner, such as a shuffled list or a random number generator. A learner who chooses their own group is not randomly assigned, and neither is a learner placed in whichever group has space first. Random assignment makes the groups alike on average, including on things you never thought to measure.",
        "Use a seed, which is a fixed starting number for the random generator. The same seed gives the same assignment every time, so someone checking the study can reproduce it. Record the seed with the plan. A learner who joins late should follow a written rule, such as joining the group they were assigned, rather than being moved.",
      ],
      example: {
        language: 'text',
        code: code`
          seed 7, 16 learners shuffled once
            first 8 after the shuffle   -> daily
            last 8                      -> weekly
          run again with seed 7         -> the same 8 learners in daily
        `,
      },
    },
    {
      heading: 'Confounders: the other things that change scores',
      paragraphs: [
        "A confounder is a factor that affects both the schedule and the score. If daily learners already knew more math before the study, the schedule and the prior knowledge are tangled together, and the study cannot separate them. Confounders are the most common reason a comparison misleads. Write the list down before the study starts, because the confounders people forget are often the ones that matter most.",
        "Handle the confounders you can measure by recording them before the study starts. A prior quiz score is an example. Check that the groups look alike on it, and if they do not, adjust for it in the analysis. Measure these early, while the learners are still deciding whether to join. The ones you cannot measure are the reason random assignment matters.",
      ],
      example: {
        language: 'text',
        code: code`
          Possible confounder          How it could mislead          What we do
          prior math score             stronger learners pick daily  record it, check the groups match
          motivation                   motivated learners study more  random assignment spreads it
          time of day studied          evening learners are tired    ask for one fixed time, record it
          phone access during quizzes  some learners look up answers randomly assigned, quiz held in class
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Assigning 16 learners to two groups fairly',
    intro: "The script below assigns 16 placeholder learners to the daily and weekly groups. It shuffles the list with a fixed seed, splits it in half and prints the result. Run it again and you get the same groups, which is what makes the assignment checkable.",
    example: {
      language: 'python',
      filename: 'assign.py',
      code: code`
        import random

        learners = [f"L{number:02d}" for number in range(1, 17)]
        rng = random.Random(7)
        shuffled = learners[:]
        rng.shuffle(shuffled)

        groups = {"daily": sorted(shuffled[:8]), "weekly": sorted(shuffled[8:])}
        for name, members in groups.items():
            print(name, len(members), members[:3])
      `,
      output: "daily 8 ['L04', 'L05', 'L06']\nweekly 8 ['L01', 'L02', 'L03']",
    },
    steps: [
      { code: 'learners = [f"L{number:02d}" for number in range(1, 17)]', explanation: "Sixteen placeholder codes. No name or personal detail appears anywhere in the study." },
      { code: 'rng = random.Random(7)', explanation: "A random generator started from the seed 7. Anyone who runs this with the same seed gets the same shuffle." },
      { code: 'rng.shuffle(shuffled)', explanation: "Puts the learners in a random order. No learner's choice or circumstance affects where they land." },
      { code: 'groups = {"daily": sorted(shuffled[:8]), "weekly": sorted(shuffled[8:])}', explanation: "The first eight after the shuffle form the daily group, and the rest form the weekly group. Sorting only makes the printed lists easier to read." },
    ],
  },
  tryIt: {
    instructions: [
      'Copy `assign.py`, change the seed to a number of your own, and run it. Check that both groups have eight learners and that no learner appears twice.',
      'Write down three confounders for your own version of the study question, such as prior knowledge or sleep. For each one, say whether you will measure it or rely on random assignment.',
      'Create a file called `design.md` that records the seed, the groups, the measure and the confounders. Save it with the plan from the research question lesson, so the design is fixed before data arrives.',
    ],
  },
  mistakes: [
    { mistake: 'Letting learners choose their own group.', fix: 'Assign groups with a random method, and record the seed used.' },
    { mistake: 'Assigning by convenience, such as the first eight names in a list.', fix: 'Use a shuffled list or a random generator, so the order of the list does not decide the group.' },
    { mistake: 'Ignoring a confounder you already measured.', fix: 'Check that the groups match on each measured confounder, and adjust for any that do not.' },
    { mistake: 'Moving learners between groups partway through the study.', fix: 'Keep each learner in the assigned group, and record any learner who drops out with the reason.' },
  ],
  quiz: [
    {
      question: 'Learners choose their own schedule, and the daily learners score higher. Why is this weak evidence about schedules?',
      options: [
        { text: 'It is strong evidence, because the learners chose it', explanation: 'A choice made by the learner can be linked to other traits that affect the score.' },
        { text: 'Daily learners were probably more motivated to begin with, and that could explain the score', explanation: 'Motivation affects both the schedule chosen and the score, so the two cannot be separated.' },
        { text: 'The quiz was too short to measure anything', explanation: 'Quiz length is a separate concern. The problem here is who chose which group.' },
        { text: 'Self-chosen groups are always the same size', explanation: 'Group size is not the issue. The problem is that the groups were not assigned fairly.' },
      ],
      answer: 1,
    },
    {
      question: 'Why use a fixed seed when assigning groups at random?',
      options: [
        { text: 'It makes the groups bigger', explanation: 'The seed controls which learner goes where, not how many learners there are.' },
        { text: 'It hides the assignment from the learners', explanation: 'Hiding the assignment is a separate issue, and the seed does not do it.' },
        { text: 'It makes the assignment repeatable, so someone else can check it', explanation: 'The same seed gives the same groups, so a reviewer can reproduce the assignment exactly.' },
        { text: 'It guarantees the scores will be higher', explanation: 'A seed has no effect on scores. It only makes the assignment reproducible.' },
      ],
      answer: 2,
    },
    {
      question: 'After random assignment, the two groups differ noticeably on prior quiz scores. What should you do?',
      options: [
        { text: 'Ignore it, since random assignment is always perfect', explanation: 'Random assignment balances groups on average, and a particular draw can still differ.' },
        { text: 'Remove the learners with the highest prior scores', explanation: 'Removing learners changes who is studied, and it hides the imbalance rather than handling it.' },
        { text: 'Re-assign learners until the groups look the same', explanation: 'Repeating the draw until it looks right undermines the randomness the design depends on.' },
        { text: 'Report the difference, and adjust for prior scores in the analysis', explanation: 'Recording and adjusting for a measured confounder keeps the result honest and visible.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Compare the groups fairly by assigning learners at random with a recorded seed, and handle the confounders you can measure while random assignment handles the ones you cannot.',
  underTheHood: {
    heading: 'Why random groups are only roughly equal',
    paragraphs: [
      "Random assignment makes the groups equal on average across many repeated studies. In any single study, the groups will still differ a little by chance. With 16 learners, one group might have a few more strong students than the other, even though the method was fair.",
      "This is why researchers report the difference between groups rather than assuming it is zero. Larger studies reduce chance differences, and the statistics in the next lesson measure how large a difference from chance could be. Adjusting for a measured confounder, such as prior scores, removes some of the remaining imbalance.",
      "A design called blocking goes one step further. Learners are first grouped by a known factor, such as prior score, and then assigned at random within each block. Each group then gets a fair share of strong and weak learners by design, which makes a chance imbalance much less likely.",
    ],
  },
}

export default lesson
