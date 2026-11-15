import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Planning and Execution Under Uncertainty from this section, which covers milestones, ranges and the risk list. The scenario is the Riverside pilot, where the dean, the IT manager and the student representative each want features added to a small delivery team\'s plan.',
  goals: [
    'Score each candidate feature on value, effort and evidence, using the same scale for all of them',
    'Choose what to build first, what to defer and what to stop, and say why in one sentence each',
    'Say no to a request in a way that keeps the conversation open and points to when it could return',
  ],
  bigIdea: "Prioritization means choosing what to do first, what to defer and what to stop. Score each option on the same few criteria, such as value, effort and how much evidence supports the value. The score does not make the decision, but it makes the trade-off visible, so the choice can be discussed rather than fought over.",
  whyItMatters: "The Riverside pilot has more requests than the team can build in one term. If the team builds whatever the loudest stakeholder asks for, the pilot may ship a teacher dashboard that nobody uses while the notes search, which students need most, is late. A simple, shared method keeps the team focused on the work that changes outcomes.",
  goalSections: [
    {
      heading: 'Score every option the same way',
      paragraphs: [
        "Pick three or four criteria and use the same scale for every option, usually from 1 to 5. Value asks how much the outcome matters to the college. Effort asks how much time the team needs. Evidence asks how well the team knows that the value is real, from trial data, a survey or a stated policy.",
        "Scoring is a conversation starter, not a verdict. Agree on the scale before anyone scores, so the discussion is about the numbers and not about the scale. A feature that scores low on evidence should be tested before the team invests in it, and a feature that scores high on value and low on effort is usually the first to build. Write the reason for each score next to it, so anyone can challenge the number.",
      ],
      example: {
        language: 'text',
        code: code`
          Feature                  Value  Effort  Evidence  Note
          notes search               5      3        5      trial showed the time lost
          exam countdown             2      2        1      nobody asked for it yet
          teacher dashboard          3      4        1      no teacher has been interviewed
          study reminders            4      2        3      the student representative asked twice
          mobile app                 4      5        2      expensive; the pilot uses a web page
        `,
      },
    },
    {
      heading: 'Decide what to build, defer and stop',
      paragraphs: [
        "Turn the scores into three decisions. Build now the options with high value and a manageable effort. Defer the options that need more evidence before the team commits. Stop the options that score low on value and have no evidence, and say so, so the work is not kept alive by habit.",
        "Use the decision to order the work, not to shrink the list forever. A deferred feature with a clear trigger, such as a second term of use, is a plan. A deferred feature with no trigger is a polite way of saying no.",
      ],
      example: {
        language: 'text',
        code: code`
          Build now:   notes search, study reminders (high value, moderate effort)
          Defer:       mobile app (valuable, but expensive; revisit after the pilot results)
          Test first:  teacher dashboard (needs interviews before any build)
          Stop:        exam countdown for now (low value, no request behind it)
        `,
      },
    },
    {
      heading: 'Say no with a route back',
      paragraphs: [
        "Most no answers fail because they sound final. A better no names the reason, says what would change the answer and gives a date for the next look. \"Not this term, because the notes search needs the time. We will review the dashboard after eight weeks of pilot data.\" The stakeholder knows what to bring back.",
        "Name the trade-off aloud. When the team adds a feature, something else moves. Saying which feature moves, and to when, keeps the sponsor in charge of the choice rather than surprised by it.",
      ],
      example: {
        language: 'text',
        code: code`
          Request:    "Can the dashboard be in the first release?"
          Answer:     "Not in this release. Building it now would move the notes search past the
                       March date. We will interview two teachers in week 4 and bring the dashboard
                       back with evidence in the week 8 review."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Prioritizing the Riverside backlog',
    intro: "The delivery team scores five requests from the dean, the IT manager and the student representative, then shares the decision with the sponsor. The table and the summary below show the scores and the choices. The notes explain how the team kept the trade-offs visible.",
    example: {
      language: 'text',
      code: code`
        Scores (value, ease, evidence; ease is 6 minus effort, so easier work scores higher)
          notes search           value 5  effort 3  evidence 5   total 13   build now
          study reminders        value 4  effort 4  evidence 3   total 11   build now
          mobile app             value 4  effort 1  evidence 2   total  7   defer
          teacher dashboard      value 3  effort 2  evidence 1   total  6   test first
          exam countdown         value 2  ease 4   evidence 1   total  7   stop for now

        Summary for the dean: the first release does two things well, and the other three
        are either waiting for evidence or waiting for the pilot results.
      `,
    },
    steps: [
      { code: 'Scores (value, ease, evidence; ease is 6 minus effort', explanation: "Ease is effort turned around, so a higher total always means a better option. Two options can share a total. The rule, not the total, separates defer from stop: the mobile app has real value, and the exam countdown does not." },
      { code: 'notes search           value 5  effort 3  evidence 5   total 13   build now', explanation: "The highest score, with strong evidence from the trial. The total is a guide for the discussion, and the team still checks the result against the milestones." },
      { code: 'teacher dashboard      value 3  effort 2  evidence 1   total  6   test first', explanation: "A low evidence score sends the feature to research rather than to the build. The team interviews teachers before it commits any effort." },
      { code: 'Summary for the dean: the first release does two things well', explanation: "The summary puts the decision in the sponsor's terms. Two things are built well, and the others have a stated reason and a next step." },
    ],
  },
  tryIt: {
    instructions: [
      'List five options for a project you know. Score each one from 1 to 5 on value, effort and evidence, and write one reason beside each score.',
      'Turn the scores into build, defer, test-first and stop decisions. For each deferred or stopped option, write the trigger that would bring it back, or write that it is stopped.',
      'Write a no for the lowest-scoring option, with the reason, the trigger and a date for the next look.',
    ],
  },
  mistakes: [
    { mistake: 'Scoring options on different scales, or without reasons.', fix: 'Use the same scale for every option, and write a short reason beside each score.' },
    { mistake: 'Deferring a feature with no trigger, which is a polite no.', fix: 'Write the trigger and a date, so the deferred work has a route back.' },
    { mistake: 'Adding a feature without saying what moves.', fix: 'Name the trade-off aloud, and tell the sponsor which work moves and to when.' },
  ],
  quiz: [
    {
      question: 'The mobile app scores high on value but low on evidence, and the team has no interviews about it. What should the team do?',
      options: [
        { text: 'Build it first, since value is the most important criterion', explanation: 'A high value score with no evidence is a guess, and building on a guess is expensive.' },
        { text: 'Test the need with users before committing to the build, and record the trigger for a later decision', explanation: 'Low evidence sends the feature to research, and the trigger gives it a route back.' },
        { text: 'Delete it, since it has no evidence', explanation: 'Deleting it removes a possibly valuable feature without learning whether it is needed.' },
        { text: 'Add it to every release, so no one is disappointed', explanation: 'Adding every request to every release is how a small team loses focus.' },
      ],
      answer: 1,
    },
    {
      question: 'The dean asks for the teacher dashboard in the first release. What is the best reply?',
      options: [
        { text: 'No, and we will not discuss it again', explanation: 'A final no without a reason or a route back damages the relationship.' },
        { text: 'Yes, and we will move the notes search later', explanation: 'Moving the highest-scoring work to make room for a low-evidence feature gets the trade-off backward.' },
        { text: 'Not in this release, because building it would move the notes search past March. We will interview teachers in week four and bring it back with evidence in week eight', explanation: 'It names the reason, the cost, the trigger and the date, so the dean can plan.' },
        { text: 'We will think about it and see what happens', explanation: 'An undated maybe leaves the dean with nothing to decide or to plan around.' },
      ],
      answer: 2,
    },
    {
      question: 'Two features score the same total. One has strong evidence and one has weak evidence. How should the team choose?',
      options: [
        { text: 'Pick the one with weak evidence, since it is more exciting', explanation: 'Excitement is not a criterion, and weak evidence is a reason to test first.' },
        { text: 'Flip a coin, since the totals are equal', explanation: 'A coin flip ignores the evidence the team has already collected, which is the difference between the two.' },
        { text: 'Build both, regardless of effort', explanation: 'Ignoring effort is the criterion the team cannot afford to skip.' },
        { text: 'Pick the one with strong evidence, and make sure the trade-off is written and visible to the sponsor', explanation: 'Strong evidence is a better basis for a build, and the written trade-off keeps the sponsor informed.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Score every option on the same criteria, turn the scores into build, defer, test-first and stop decisions and say no with a reason, a trigger and a date so the sponsor can see what moves.',
  resources: [
    { title: 'Prioritization frameworks', provider: 'UK Government Digital Service', description: 'Public-sector guidance on ordering digital service work by user need, value and risk.', url: 'https://www.gov.uk/service-manual' },
  ],
  underTheHood: {
    heading: 'Why simple scores work better than none',
    paragraphs: [
      "Scoring models are often criticized for being too simple. Their real value is that they make the reasoning explicit. When a team writes a number and a reason, the reason can be challenged, and a challenge that changes a score is progress. Without a score, the same disagreement stays hidden inside a meeting and returns later.",
      "Product teams often use a variant that multiplies impact, confidence and effort, sometimes called ICE. Impact is the value, confidence is the evidence and effort is the cost. The multiplication gives more weight to evidence and makes a weak case harder to justify, which is the behavior the team wants.",
      "Whatever model you use, the order of the questions matters. Ask what outcome the feature changes before you score it. A team that starts with the features and scores them first tends to protect its favorites, and a team that starts with the outcome finds the options that deserve the time.",
    ],
  },
}

export default lesson
