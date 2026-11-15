import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'build-for-a-real-client',
  whatYouBuild: "A small solution built for a real person or group: a nonprofit, a small business, a teacher, or your own workplace. You run discovery, write a one-page scope that the client signs, build and deliver a small solution, and write a case study the client has approved.",
  diagram: code`
    A real client (nonprofit, small business, teacher or your workplace)
      -> discovery: three conversations, with evidence written down
      -> one-page scope: in, out, assumptions and acceptance criteria, signed by the client
      -> build a small solution in short, checked steps
      -> deliver, watch the client use it, and record what they said
      -> case study: the problem, the decision, what went wrong, the result
    Rule throughout: no personal data about anyone, and nothing published without written consent
  `,
  lessons: ['customer-discovery-and-conversations', 'stakeholder-mapping-and-requirements', 'scope-of-work-and-proposals', 'solution-demos-and-storytelling', 'technical-communication', 'professional-leadership-practicum'],
  tools: ['Whatever the solution needs: a spreadsheet, a web page, a script or a document', 'A simple way to record conversations with notes, with the client\'s consent', 'A written agreement, even a one-page email both sides confirm', 'A place to publish the case study, once the client approves it'],
  time: 'about 30 hours over four to six weeks',
  requirements: [
    'The client agrees in writing to the project, its purpose and the case study before work starts',
    'Discovery is based on at least three conversations, with notes that separate opinions from evidence',
    'A one-page scope is signed by the client, with acceptance criteria the client can check',
    'The solution is delivered, and the client uses it at least once',
    'The case study is approved by the client, and contains no personal data without written consent',
  ],
  milestones: [
    {
      title: 'Find a client and agree the ground rules',
      goal: 'Find a real person or group with a problem you can help with, and agree in writing what you will do, what you will not do, and what you may publish.',
      hints: [
        'Start with a problem that a small solution could help with in four weeks. A nonprofit, a teacher or a local business often has one.',
        'Agree the case study terms now, including what names and details the client allows you to publish.',
      ],
      checkpoint: 'You have a short written agreement with the client, covering the purpose, the time, what you may publish and what data you will not collect.',
    },
    {
      title: 'Run discovery',
      goal: 'Hold at least three conversations about the real problem, and write down the evidence each one gives you.',
      hints: [
        'Ask about the last time the problem happened, not what the client would like in the future.',
        'Write each statement as an opinion, a wish or evidence, using the discovery lesson.',
      ],
      checkpoint: 'You have three sets of notes, and a list of the evidence that supports the problem you will solve.',
    },
    {
      title: 'Write a one-page scope and get it signed',
      goal: 'Write what will be built, what will not, the assumptions, and how the client will check each deliverable. The client signs it before you build.',
      hints: [
        'Write the out-of-scope list first. It prevents most arguments later.',
        'Make each acceptance criterion something the client can check with a yes or no.',
      ],
      checkpoint: 'The scope is one page, has at least three checkable acceptance criteria, and the client has confirmed it in writing.',
    },
    {
      title: 'Build and deliver a small solution',
      goal: 'Build the smallest version that meets the criteria, check it against them, and deliver it to the client to use.',
      hints: [
        'Build in short steps, and show the client each step, so their feedback comes early.',
        'Check each acceptance criterion yourself before you deliver, and write down the result.',
      ],
      checkpoint: 'The client has used the solution, and you have written down each acceptance criterion as met or not met.',
    },
    {
      title: 'Write the case study with the client',
      goal: 'Write a case study of about 500 words that the client reads and approves before you publish it.',
      hints: [
        'Cover the problem, the decision you made, what went wrong, and the result the client saw.',
        'Remove any personal detail the client did not approve, and ask the client to confirm the final text.',
      ],
      checkpoint: 'The client has approved the case study in writing, and it contains no personal data they did not approve.',
    },
  ],
  finishedMeans: [
    'The client has signed the scope and approved the case study in writing',
    'The solution meets each acceptance criterion, and the client used it',
    'The case study contains no personal data without written consent',
    'Discovery notes separate opinions from evidence, and are kept private',
    'The project folder contains the scope, the criteria results and the case study',
  ],
  readmeTemplate: code`
    # [Project name]: [client type and problem, without personal details]

    [One paragraph: the problem, who it affected, and what you delivered.]

    ## The agreement
    [What was agreed, and what may be published.]

    ## Scope and results
    [The scope, and the result for each acceptance criterion.]

    ## What the client said
    [Quotes the client approved for publication.]

    ## Case study
    [A link to the approved case study.]
  `,
  writeUpPrompts: [
    'The client problem, in the client\'s words, and why a small solution was the right size.',
    'One decision about scope, such as what you left out and why, and what the client said about it.',
    'One thing that went wrong, and how you dealt with it with the client.',
    'The result the client saw, and what you would do differently next time.',
  ],
  demoGuidance: 'Record the solution being used by the client, with their consent. Keep it under 60 seconds, and do not show personal details on screen. Free tools include the screen recorder built into macOS and Windows, OBS Studio, and ScreenToGif on Windows. Save it as demo.gif and link it from the case study.',
  interviewGuidance: "Describe the client's problem first, then the scope decision that protected the work. For example: 'I wrote the out-of-scope list first, and the client signed it, so when they asked for a new report we could agree a second phase instead of a surprise.' Employers look for this kind of client judgment.",
  stretchGoals: [
    'Hand the solution over to the client\'s team, and write the instructions they use without you',
    'Measure the result over a month, and add the numbers to the case study with the client\'s consent',
    'Turn the scope and case study into a template that another learner can use',
  ],
}

export default plan
