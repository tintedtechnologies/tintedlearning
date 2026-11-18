import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Break a feature into small changes that each leave the program working',
    'Write a definition of done that a team can check',
    'Plan a batch of work against a fixed capacity, and explain what was left out',
  ],
  bigIdea: 'Work goes wrong most often when it is too big to see clearly. A feature split into small changes, each one tested and merged on its own, is easier to finish, easier to review, and easier to undo. A definition of done makes "finished" a checkable fact, and a plan that fits the capacity makes the trade-offs visible.',
  whyItMatters: 'A student adds a streak counter to Study Tracker. The branch changes the database, the API, the report, and the screen at once, and it stays open for three weeks. When the tests fail, nobody knows which change caused it. Three small changes merged over three days would have been easy to check, and any one of them could have been undone alone.',
  goalSections: [
    {
      heading: 'Breaking work into small changes',
      paragraphs: [
        'A small change is one that can be explained in a sentence, tested on its own, and left in a working state. "Store the day of each session" is a small change. "Add streaks" is a feature, and a feature is a list of small changes.',
        'Order the changes so that each one builds on the last. Start with the data, then the logic that uses it, then the screen that shows it. Each step can be merged when it is ready, and the program works at every point.',
        'Small changes make problems cheap. When a change breaks something, the cause is in a few lines, and reverting it does not lose the work of other changes. Large changes hide problems until they are expensive to find. Small steps also give the team a steady rhythm of finished work, which is easier to plan and to explain. Review the rhythm at the end of each period, and adjust the next plan from what actually finished.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Feature: streak counter
          1. Store the date of each session in the database (merge, tests pass)
          2. Add a function that counts consecutive days (merge, unit tests pass)
          3. Return the streak from the API (merge, API tests pass)
          4. Show the streak on the report screen (merge, end-to-end check)
        `,
      },
    },
    {
      heading: 'Definition of done',
      paragraphs: [
        'A definition of done lists the conditions that must all be true before a change counts as finished. For Study Tracker, it might include: the code is reviewed, the tests pass, the new behavior is documented in the README, and the change has been run in the container.',
        'Write the definition once, and use it for every change. A shared list stops the argument about whether something is done, because the answer is either yes or no for each item.',
        'Keep the definition short enough to be checked. A list of twenty items that nobody reads is worse than five items that everyone follows.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          definition_of_done = ["reviewed", "tests pass", "README updated", "runs in the container"]
          change = {"reviewed": True, "tests pass": True, "README updated": False, "runs in the container": True}

          missing = [item for item in definition_of_done if not change[item]]
          print("done" if not missing else "not done, missing: " + ", ".join(missing))
        `,
        output: 'not done, missing: README updated',
      },
    },
    {
      heading: 'Planning against capacity',
      paragraphs: [
        'Capacity is how much work the team can finish in a period. Estimate the size of each change in rough units, then add changes to the plan until the capacity is full. The estimate does not need to be exact, but it should be honest enough that the plan can be trusted.',
        'Say what was left out. A plan that lists what is in and what is out is clearer than one that promises everything. When a change is added, something else has to move, and that trade-off should be visible to everyone.',
        'Review the plan at the end of each period. If changes took longer than estimated, learn why and adjust the next estimate, rather than blaming the estimate.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          capacity = 8
          changes = [("store dates", 2), ("streak logic", 3), ("API field", 1), ("report screen", 4)]

          planned, left_out, used = [], [], 0
          for name, size in changes:
              if used + size <= capacity:
                  planned.append(name)
                  used += size
              else:
                  left_out.append(name)
          print("planned:", planned, "using", used, "of", capacity)
          print("left out:", left_out)
        `,
        output: "planned: ['store dates', 'streak logic', 'API field'] using 6 of 8\nleft out: ['report screen']",
      },
    },
  ],
  seeItInAction: {
    title: 'Choosing what fits this period',
    intro: 'The program above fills a fixed capacity with the changes in order, and lists what does not fit. It is simple on purpose, so the trade-off is easy to see. Run it, then change the capacity to 10 and predict whether the report screen is planned.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        capacity = 10
        changes = [("store dates", 2), ("streak logic", 3), ("API field", 1), ("report screen", 4)]

        used = 0
        for name, size in changes:
            if used + size <= capacity:
                used += size
                print("plan:", name)
            else:
                print("left out:", name)
        print("total size planned:", used)
      `,
      output: 'plan: store dates\nplan: streak logic\nplan: API field\nplan: report screen\ntotal size planned: 10',
    },
    steps: [
      { code: 'if used + size <= capacity:', explanation: 'A change is added only when it fits in the remaining capacity.' },
      { code: 'print("left out:", name)', explanation: 'Makes the trade-off visible. A change that does not fit is named, not silently dropped.' },
      { code: 'print("total size planned:", used)', explanation: 'Reports how full the plan is, so the team can see the capacity they chose.' },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a feature you would like in Study Tracker and break it into at least four small changes, each with a test you could write.',
      'Write a definition of done with five items for your team or for a personal project, and check one recent change against it.',
      'Change the capacity in the seeItInAction example to 6 and predict which changes are left out. Run it to check.',
    ],
  },
  mistakes: [
    { mistake: 'Keeping one branch open for weeks with many changes.', fix: 'Merge small changes often, and keep each one working on its own.' },
    { mistake: 'Calling work done without a shared definition.', fix: 'Write a short definition of done and check every change against it.' },
    { mistake: 'Promising every change in the plan without naming what is left out.', fix: 'Fill the capacity honestly and name every change that does not fit.' },
  ],
  quiz: [
    {
      question: 'Why is a small change easier to undo than a large one?',
      options: [
        { text: 'Its effect is contained, so reverting it does not remove unrelated work', explanation: 'Yes. A small change can be reverted without losing other changes.' },
        { text: 'Small changes never break anything', explanation: 'Small changes can still break things. They are easier to find and undo.' },
        { text: 'Undoing is only possible for small changes by law', explanation: 'No such rule applies. The reason is the size of the change.' },
        { text: 'Large changes cannot be stored', explanation: 'Storage is not the issue.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the missing items?',
      code: { language: 'python', runnable: true, code: code`
        dod = ["tests pass", "README updated"]
        change = {"tests pass": True, "README updated": True}
        missing = [item for item in dod if not change[item]]
        print("done" if not missing else "missing: " + ", ".join(missing))
      ` },
      options: [
        { text: 'missing: tests pass', explanation: 'The tests pass in this change, so nothing is missing.' },
        { text: 'done', explanation: 'Yes. Both items are True, so no item is missing.' },
        { text: 'missing: README updated', explanation: 'The README is marked updated here.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What is the most honest way to handle a change that does not fit the capacity?',
      options: [
        { text: 'Name it as left out, and say what would move to make room', explanation: 'Yes. The trade-off is visible, so the team can decide together.' },
        { text: 'Add it anyway and hope the estimates were too high', explanation: 'Overloading the plan hides the trade-off and usually causes rushed work.' },
        { text: 'Remove it from the list without mentioning it', explanation: 'Silently dropping work hides a decision that others need to know about.' },
        { text: 'Split it into hidden tasks', explanation: 'Hiding tasks does not change the capacity.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Split features into small changes that each work on their own, check every change against a shared definition of done, and fill the capacity honestly while naming what is left out.',
  resources: [
    { title: 'Trunk-based development', provider: 'Atlassian', description: 'An explanation of small, frequent merges and why they reduce risk.', url: 'https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development' },
    { title: 'Scrum Guide', provider: 'Scrum.org', description: 'Free guidance on definitions of done and planning work against capacity.', url: 'https://scrumguides.org/' },
  ],
}

export default lesson
