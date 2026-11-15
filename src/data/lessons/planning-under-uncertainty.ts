import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Commercial Negotiation and Procurement and Scope of Work and Proposals from this section. The scenario is the Riverside pilot, with a two-person delivery team and a fixed scope that the dean has approved in principle.',
  goals: [
    'Plan in milestones with dates the team can defend, instead of one date for the whole project',
    'Show estimates as ranges, and say which assumption drives each end of the range',
    'Keep a risk list that is reviewed every week, with an owner and a response for each risk',
  ],
  bigIdea: "Plans for uncertain work should expect change. Break the work into milestones that each produce something checkable, give estimates as ranges, and keep a risk list with owners and responses that is reviewed regularly. A single date hides the uncertainty, and a range with named drivers shows it so the sponsor can decide what to do.",
  whyItMatters: "The dean has been told the pilot will be ready on 1 March. Nobody knows yet how long the security review will take, and the delivery team has never built a notes search for this college. A single date will be missed, and the first news of the delay will damage trust. A range with a risk list gives the dean the truth early enough to plan around it.",
  goalSections: [
    {
      heading: 'Plan in milestones that can be checked',
      paragraphs: [
        "A milestone is a point where something specific is finished and can be checked. \"Search works\" is not a milestone, because nobody can say when it is done. \"Twenty test questions return cited answers\" is one, because the IT manager can run the test and say whether it passed.",
        "Keep milestones close enough together that a slip shows up within a few weeks. A plan with one milestone at the end hides every problem until it is too late to fix. Two-week milestones are a common starting point for a team of two, adjusted as the team learns its pace.",
      ],
      example: {
        language: 'text',
        code: code`
          Milestone                                      Check                         Target
          1  notes indexed for the 200 pilot students     index rebuilt, counts match   week 2
          2  twenty test questions answered with citations 18 of 20 pass                  week 4
          3  IT manager signs the security review         written sign-off              week 6
          4  pilot opens to students                      first 20 students onboarded   week 7
        `,
      },
    },
    {
      heading: 'Estimate with ranges and drivers',
      paragraphs: [
        "Give every estimate as a range, with the assumption that drives each end. A milestone that takes two to five weeks is more useful than one that takes three, because the range shows what could make it longer. The driver tells the team where to look for a shorter path or an early warning.",
        "Re-estimate when you learn something. A range that narrows after a milestone is a sign the team is learning, and a range that never changes is a sign it is not checking its assumptions. Share the narrowing with the sponsor, so trust grows with each update.",
      ],
      example: {
        language: 'text',
        code: code`
          Milestone 3, security sign-off
            estimate:  2 to 5 weeks
            low end:   the IT manager reviews the plan in the first week
            high end:  a second review round is needed after the penetration test
            driver:    how quickly the external tester can book
        `,
      },
    },
    {
      heading: 'Keep a risk list that people use',
      paragraphs: [
        "A risk is something that might happen and would change the plan. Write each one with a likelihood, an impact, an owner and a response. A risk with no owner is a worry that nobody will act on, and a risk with no response is a hope.",
        "Review the list every week, in the same meeting as the milestones. Close risks that have passed, add new ones as they appear and move any risk that has grown into the sponsor's view. A list that is updated weekly becomes the team's early warning system. Bring the top three risks to every sponsor update, so the sponsor sees them before they become problems.",
      ],
      example: {
        language: 'text',
        code: code`
          Risk                                  Likelihood  Impact  Owner     Response
          security review takes longer          medium      high    IT manager book the tester now; agree review dates
          model provider changes its prices     low         medium  delivery  review costs monthly; add a price alert
          students do not log in during term    medium      medium  dean      short onboarding session in week 1
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The Riverside pilot plan, reviewed in week five',
    intro: "The delivery team reviews the pilot plan with the dean in week five. The summary shows the milestones, the ranges and the top risk, with the decision the dean needs to make. The notes after it explain why the update builds trust.",
    example: {
      language: 'text',
      code: code`
        Pilot status, week 5

        Milestones
          1 notes indexed: done in week 2
          2 test questions: 17 of 20 passed; the three misses are being fixed, due week 6
          3 security sign-off: estimated 2 to 5 weeks from now; the IT manager has the plan
          4 pilot opens: estimated week 8 to week 11

        Biggest driver of the range: the security sign-off.
        Decision needed from the dean: approve a second security session this week, which
        moves the low end of the range to week 8 if the review completes in one round.

        Top risk: security review takes longer. Owner: IT manager. Response: tester booked
        for week 7, with a review slot held.
      `,
    },
    steps: [
      { code: '2 test questions: 17 of 20 passed; the three misses are being fixed, due week 6', explanation: "Progress is reported against a checkable milestone, with the actual number. The sponsor can see the team is close, and what is still open." },
      { code: 'security sign-off: estimated 2 to 5 weeks from now', explanation: "The range is shown beside the milestone that drives most of the uncertainty. The sponsor sees where the risk is, without a false single date." },
      { code: 'Decision needed from the dean: approve a second security session this week', explanation: "The update ends with a decision the sponsor can make, and what it changes. A plan that asks for a decision moves the work forward." },
      { code: 'Top risk: security review takes longer. Owner: IT manager.', explanation: "The top risk has an owner and a response, so the sponsor knows who is acting and what they are doing about it." },
    ],
  },
  tryIt: {
    instructions: [
      'Break a project you know into four milestones, each with a check that someone else could run. Write the target week for each one.',
      'Choose the milestone with the widest estimate range. Write its low and high figures, and name the driver behind each end.',
      'Build a risk list with at least three risks, each with a likelihood, an impact, an owner and a response, and review it against the milestones.',
    ],
  },
  mistakes: [
    { mistake: 'Giving one date for the whole project.', fix: 'Give a range for each milestone, and name the driver that moves each end.' },
    { mistake: 'Writing milestones that cannot be checked, such as "search works".', fix: 'Write a check with a number or a test that someone else can run.' },
    { mistake: 'Keeping a risk list nobody reads.', fix: 'Review the list every week with the milestones, and give each risk an owner and a response.' },
  ],
  quiz: [
    {
      question: 'The dean asks when the pilot will open. The security sign-off is still unknown. What is the best answer?',
      options: [
        { text: 'Week 8, and we will keep that date whatever happens', explanation: 'A fixed date that ignores a known uncertainty is the surprise the dean is trying to avoid.' },
        { text: 'Between week 8 and week 11, with the security sign-off as the main driver, and a review date we will report weekly', explanation: 'A range with its driver and a weekly update gives the dean a truthful picture they can plan around.' },
        { text: 'We cannot say until the project is over', explanation: 'Refusing an estimate leaves the dean with no basis for planning, which is worse than an honest range.' },
        { text: 'Whenever the IT manager is free', explanation: 'That answer hands the schedule to one person and gives the dean no way to plan.' },
      ],
      answer: 1,
    },
    {
      question: 'Which milestone can the team check on a specific day?',
      options: [
        { text: 'The search is almost ready', explanation: 'Almost ready cannot be checked, so the team will argue about when it is done.' },
        { text: 'The team is making good progress', explanation: 'Good progress is a judgment, not a milestone.' },
        { text: 'Twenty test questions return a cited answer for at least 18 of them, checked by the IT manager', explanation: 'It gives a number, a test and a checker, so the milestone is either met or not.' },
        { text: 'The system is nearly secure', explanation: 'Nearly secure is not a checkable state, and it does not say what must be true.' },
      ],
      answer: 2,
    },
    {
      question: 'A risk has been on the list for six weeks with no owner and no response. What should the team do?',
      options: [
        { text: 'Leave it, since it has not happened yet', explanation: 'A risk does not need to happen to be acted on, and the risk is still growing unmanaged.' },
        { text: 'Remove it from the list, to keep the list short', explanation: 'Removing a live risk hides it and makes the plan look safer than it is.' },
        { text: 'Ask the dean to take ownership of it', explanation: 'The sponsor may need to know, but ownership belongs with the person who can act on the risk.' },
        { text: 'Assign an owner and a response this week, and raise it with the sponsor if the impact is high', explanation: 'An owner and a response turn a worry into managed work, and the sponsor sees anything serious.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Plan in checkable milestones, give each estimate as a range with its driver named and keep a weekly risk list with owners and responses, so the sponsor sees the uncertainty early enough to plan for it.',
  resources: [
    { title: 'Service manual: managing a digital service', provider: 'UK Government Digital Service', description: 'Public-sector guidance on planning, reviewing and managing risk across a digital service.', url: 'https://www.gov.uk/service-manual' },
  ],
  underTheHood: {
    heading: 'Why ranges beat single estimates',
    paragraphs: [
      "People tend to give estimates that are too narrow. A single date feels like a commitment, so the estimator picks the most likely outcome and forgets the tail of bad cases. Researchers have documented this over-confidence for decades, and the planning fallacy is the name often given to the habit of underestimating how long work will take.",
      "A range corrects for this by forcing the estimator to name the high end. Asking for the high end and the reason it could happen usually produces a wider and more honest picture. Ask the estimator to say what would have to go wrong for the high end to hold. The driver then tells the team where the uncertainty comes from, which is more useful than the number alone.",
      "Ranges also change how sponsors react. When a single date slips, the slip feels like a broken promise. When the actual result lands inside a range that was shown in advance, the result is an update rather than a failure, and the sponsor keeps trusting the plan.",
    ],
  },
}

export default lesson
