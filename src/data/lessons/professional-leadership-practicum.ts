import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'All of the earlier lessons in Technical Leadership & Communication. This practicum brings them together on the Riverside Community College scenario, and it works best after you have written at least one artifact from each part of the section.',
  goals: [
    'Produce the full Riverside package: discovery notes, stakeholder map, proposal, plan, decision record and status update',
    'Review each artifact against a rubric that names what good looks like, and revise where it falls short',
    'Explain the package in a short walkthrough that a sponsor could follow without you in the room',
  ],
  bigIdea: "A professional leader's work shows up as a set of artifacts that fit together: what was learned, who was involved, what is proposed, how it will be delivered, what was decided and what is happening now. Each artifact should agree with the others. A rubric makes the quality of each one visible, so the review is about the work rather than about impressions.",
  whyItMatters: "Most leaders are judged on the package they present, not on the one good meeting they had. If the discovery notes say the college wants a faster search, the proposal promises a dashboard and the plan has no time for it, the sponsor will notice the gap. A coherent package is the evidence that the team understood the problem and can be trusted with the next one.",
  goalSections: [
    {
      heading: 'Build the package as one story',
      paragraphs: [
        "The six artifacts tell one story in order. The discovery notes record what the team learned from the college. The stakeholder map shows who must be heard. The proposal states the recommended approach and its scope. The plan shows the milestones and ranges. The decision record captures the choices that were made. The status update shows where the project stands today.",
        "Check the story at the joins. Each proposal item should appear in the plan, and each decision should match the scope. When a join breaks, fix the earlier artifact rather than explaining the mismatch away.",
      ],
      example: {
        language: 'text',
        code: code`
          Artifact           Must agree with
          discovery notes    the problem named in the proposal
          stakeholder map    the people named as deciders in the decision record
          proposal           the scope and the milestones in the plan
          plan               the risks and the ranges in the status update
          decision record    the scope in the proposal
          status update      the milestones and the decisions made so far
        `,
      },
    },
    {
      heading: 'Review each artifact against a rubric',
      paragraphs: [
        "A rubric is a short list of criteria, each with a description of what good looks like. For this practicum, each artifact is scored from one to three on the same criteria: it names the outcome, it is checkable, it states its assumptions, and it could be understood by its audience in one reading.",
        "Score honestly, then revise the lowest score first. A rubric is most useful when it points to one change, such as adding a source to a requirement, rather than to a general feeling that the work is weak. Keep the score sheet with the artifact, so the next reviewer can see what was checked and when.",
      ],
      example: {
        language: 'text',
        code: code`
          Criterion                          1 (needs work)     2 (adequate)       3 (strong)
          names the outcome                  no outcome         outcome vague     outcome in the sponsor's words
          checkable                          no test            some tests        every claim has a test or a number
          states assumptions                 none listed        some listed       assumptions with owners
          understood in one reading          needs a guide      needs a re-read   stands alone
        `,
      },
    },
    {
      heading: 'Walk the sponsor through it',
      paragraphs: [
        "A walkthrough is a short presentation of the package to the sponsor, about fifteen minutes long. Start with the decision that is needed, then show how each artifact supports it. Finish by naming the risk you are watching and the next step with its date. Keep the walkthrough to the decision, the evidence and the risk, and leave the detail for the appendix.",
        "A good walkthrough leaves room for the sponsor to challenge the package. Note each challenge, and say which artifact will change. A package that changes after challenge is a stronger package, not a weaker one. Send the revised package within two working days, so the sponsor sees that the challenge changed something.",
      ],
      example: {
        language: 'text',
        code: code`
          Walkthrough outline (15 minutes)
            1. The decision needed: approve the pilot, with sample notes until the review (1 min)
            2. What we learned in discovery, and who we heard from (3 min)
            3. The proposal and its scope, with the acceptance criteria (4 min)
            4. The plan, the ranges and the top risk (3 min)
            5. The status update and the next step (2 min)
            6. Questions and changes, with the artifact that will change (2 min)
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Scoring one status update against the rubric',
    intro: "A learner has drafted the status update for the Riverside pilot. The review below scores it against the four criteria and names the one change that will raise its lowest score. Use the same approach on each of your six artifacts.",
    example: {
      language: 'text',
      code: code`
        Draft status update, week 5 (first version)
          "Good progress this week. The team is working hard on the search and the security
           review. We expect to be ready soon."

        Review
          names the outcome           1  no milestone, no date, no owner
          checkable                   1  "good progress" and "soon" cannot be tested
          states assumptions          1  none listed
          understood in one reading   2  readable, but says nothing the dean can act on

        Revised first line (the change that matters most)
          "Notes search: 17 of 20 test questions pass, with the three misses due week 6.
           Security sign-off: estimated 2 to 5 weeks, owner IT manager. Decision needed:
           approve a second security session this week."
      `,
    },
    steps: [
      { code: '"Good progress this week."', explanation: "A phrase that sounds like information but cannot be checked. Anyone reading it would have to ask what progress means, which is the first sign a status update needs work." },
      { code: 'names the outcome           1  no milestone, no date, no owner', explanation: "The lowest score is on the outcome, so that is the change to make first. The revision names the milestones, numbers and owners." },
      { code: 'Revised first line', explanation: "The revision puts the decision and the numbers in the first lines, which is the rule from the executive writing lesson applied to a real artifact." },
      { code: 'approve a second security session this week', explanation: "The update ends with a decision the sponsor can make. A status update that does not ask for anything wastes the sponsor's time." },
    ],
  },
  tryIt: {
    instructions: [
      'Produce the six Riverside artifacts, or the equivalent for a project you know: discovery notes, stakeholder map, proposal, plan, decision record and status update. Keep each to one page, except the discovery notes.',
      'Score each artifact against the four rubric criteria, and write the one change that would raise its lowest score. Make that change before you move on.',
      'Record a fifteen-minute walkthrough of the package, or deliver it to a colleague. Note every challenge and the artifact each one changes, then send the revised package with a short summary of the changes.',
    ],
  },
  mistakes: [
    { mistake: 'Writing six artifacts that contradict each other.', fix: 'Check the joins between artifacts, and fix the earlier one when a join breaks.' },
    { mistake: 'Scoring the package on how polished it looks.', fix: 'Score each artifact against the criteria: outcome, checkability, assumptions and clarity in one reading.' },
    { mistake: 'Presenting the package as final, with no room for challenge.', fix: 'Name the challenges you expect, and show which artifacts you would change if they came up.' },
  ],
  quiz: [
    {
      question: 'The proposal promises a teacher dashboard, but the plan has no milestone for it. What is the most important fix?',
      options: [
        { text: 'Remove the dashboard from the proposal, since the plan is already full', explanation: 'That may be right, but it should be a decision made and recorded, not a silent edit to fit the plan.' },
        { text: 'Leave both as they are and explain the gap in the walkthrough', explanation: 'Explaining a broken join out loud does not repair it, and the sponsor will see the contradiction.' },
        { text: 'Make the proposal and the plan agree, by adding the dashboard to the plan with its ranges or by removing it from the scope with a decision record', explanation: 'The join is fixed in the artifacts, and the choice is recorded where the sponsor can see it.' },
        { text: 'Add the dashboard to the plan without changing the scope', explanation: 'That creates a second contradiction, because the scope still says something different.' },
      ],
      answer: 2,
    },
    {
      question: 'During the walkthrough, the sponsor challenges the security milestone. What is the strongest response?',
      options: [
        { text: 'Defend the milestone, because the team has already planned it', explanation: 'Defending without listening misses the chance to improve the package.' },
        { text: 'Note the challenge, say which artifact will change and when the revised version will be sent', explanation: 'A challenge that changes the package makes it stronger, and the sponsor sees it being taken seriously.' },
        { text: 'Say the challenge is out of scope for the walkthrough', explanation: 'Refusing the challenge makes the package look fragile.' },
        { text: 'Agree and change everything in the package that night', explanation: 'Changing everything without a reason creates new contradictions, and it hides the artifact that actually needs work.' },
      ],
      answer: 1,
    },
    {
      question: 'A status update says "good progress" and "soon". Which rubric criterion does it fail most clearly?',
      options: [
        { text: 'Names the outcome, and checkable, since neither phrase can be tested', explanation: 'Both phrases describe a feeling, so the outcome and the test are missing, which is the core of the failure.' },
        { text: 'Stands alone, because it is too short', explanation: 'Length is not the problem. The phrases are too vague to test, whatever the length.' },
        { text: 'States assumptions, because it has no footnotes', explanation: 'Footnotes do not fix vague claims, and the failure is about checkability first.' },
        { text: 'Has too many numbers', explanation: 'The update has no numbers at all, so this is the reverse of the problem.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Produce the Riverside package as one story whose artifacts agree at every join, review each against a rubric and walk the sponsor through it so every challenge changes the package for the better.',
  resources: [
    { title: 'Reflective practice', provider: 'Wikipedia', description: 'Learning from experience by examining what happened and why.', url: 'https://en.wikipedia.org/wiki/Reflective_practice' },
    { title: 'The Service Manual', provider: 'UK Government Digital Service', description: 'Public-sector guidance on assessing a service against clear criteria before it goes live.', url: 'https://www.gov.uk/service-manual' },
  ],
  underTheHood: {
    heading: 'Why a rubric makes review fair',
    paragraphs: [
      "Reviewers tend to score work by impression, and impressions are shaped by the reviewer's mood, the order of what they read and how confident the writing sounds. A rubric replaces impression with criteria that another reviewer could apply and reach a similar score, which is what makes the review fair.",
      "Good rubrics describe the levels in concrete terms. A criterion that says \"clear\" is hard to use. A criterion that says \"a stranger could say what the decision is after one reading\" can be checked. The more precise the description, the more the score tells the author what to change.",
      "Practice with a rubric also changes the writer's habits. After scoring several drafts, a leader begins to check the criteria while writing, so the first draft is closer to the final one. The rubric becomes a way of thinking, not only a way of grading.",
    ],
  },
}

export default lesson
