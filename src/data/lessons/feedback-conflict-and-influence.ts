import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Stakeholder Mapping and Requirements and Decision-Making and Organizational Systems from this section. The scenario is the Riverside pilot, with the two-person delivery team and the people on the college side who do not report to the team lead.',
  goals: [
    'Give feedback that describes a specific behavior, its effect and a clear next step',
    'Receive feedback without defending yourself, and ask questions that reveal what the other person sees',
    'Influence people you do not manage by sharing evidence, shared goals and small agreements',
  ],
  bigIdea: "Good feedback describes what someone did, what effect it had and what would help next time. Receiving feedback well means asking questions before you respond. Influence without authority comes from evidence, shared goals and small agreements that build trust over time, not from pressure.",
  whyItMatters: "A delivery team member who never hears that their updates are hard to act on will keep sending them. A college colleague who feels ignored will stop bringing concerns early. Small, honest feedback and steady influence keep working relationships healthy, and they prevent the everyday friction from becoming a formal dispute.",
  goalSections: [
    {
      heading: 'Give feedback that is specific and usable',
      paragraphs: [
        "Feedback has three parts: the behavior, the effect and the next step. \"Your status updates list tasks but not what is blocked\" describes the behavior. \"I could not tell whether the security review was on track\" names the effect. \"Next week, put the blocker first\" gives the next step.",
        "Keep feedback close to the moment and to the work, not to the person's character. \"You are always late\" invites defense. \"The draft arrived on Thursday, after the Wednesday deadline\" invites a plan. Ask whether the person wants feedback before you give it, when you can. Give feedback in private, unless the issue affects the whole team, because a public comment changes how the message is heard.",
      ],
      example: {
        language: 'text',
        code: code`
          Vague:      "Your updates are not great."
          Specific:   "Your last two updates listed tasks but not blockers. I could not tell
                       whether the security review was on track. Next week, could you put any
                       blocker at the top?"
        `,
      },
    },
    {
      heading: 'Receive feedback by asking first',
      paragraphs: [
        "When someone gives you feedback, your first job is to understand it. Ask what they saw, when, and what they would have wanted instead. Your reply can come after you understand, and it should thank them even when you disagree. Thank the person for the feedback even when you disagree, because people stop giving it when they feel punished for speaking up.",
        "Separate the parts you accept from the parts you do not. Accepting the part that is true is a sign of maturity, and it makes the other part easier to discuss. \"You are right that the update was late. I think the blocker was visible in the standup, and I will add it to the written update too\" is an honest reply.",
      ],
      example: {
        language: 'text',
        code: code`
          Feedback:  "The update came in after the meeting started."
          Reply:     "What would have helped you most: an earlier update, or a message before
                      the meeting? I will try the one that works for you."
        `,
      },
    },
    {
      heading: 'Influence people you do not manage',
      paragraphs: [
        "You cannot order the IT manager to change a security plan, so influence must come from elsewhere. Share evidence they care about, connect your request to a goal you both hold, and offer a small agreement they can say yes to. Small agreements build the trust that larger ones need.",
        "Expect influence to take several conversations. A first request may get a polite no, and a second one that answers the concern usually gets a yes. Keep the record of what was agreed, so both sides can see the progress. Confirm the small agreement in writing afterward, in a short message that repeats what was agreed. Check afterward whether the change happened, and say so when it did.",
      ],
      example: {
        language: 'text',
        code: code`
          Goal we share:   students can use the pilot safely by 1 March
          Evidence:        the test set passed 18 of 20 questions, and no cross-student answers
          Small ask:       review the access list with us on Thursday, for 30 minutes
          Record:          agreed Thursday review; sign-off to follow if no issues
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A feedback conversation with a delivery team member',
    intro: "The delivery lead talks with a team member whose status updates have been hard to act on. The conversation follows the three parts of feedback and ends with a question. The notes after it explain why each choice helps the team member improve.",
    example: {
      language: 'text',
      code: code`
        Lead:    "Can I give you some feedback on the status updates? Is now a good time?"
        Member:  "Sure."
        Lead:    "Your last two updates listed what you did, but not what is blocked. I could not
                  tell whether the security review was on track, and I had to ask in the standup."
        Member:  "I thought the security review was obvious from the plan."
        Lead:    "That makes sense. What would make it easier for you to flag blockers first?"
        Member:  "A template, maybe. A line at the top for blockers."
        Lead:    "Let's try that for two weeks, and I will tell you what I see at the end."
      `,
    },
    steps: [
      { code: 'Can I give you some feedback on the status updates? Is now a good time?', explanation: "The lead asks permission and timing first. The member is more able to hear feedback when they have chosen to listen." },
      { code: 'Your last two updates listed what you did, but not what is blocked.', explanation: "The behavior is named specifically, with two examples. The member knows exactly what to look at." },
      { code: 'I thought the security review was obvious from the plan.', explanation: "The lead does not argue. The member's view is recorded as information, which keeps the conversation open." },
      { code: 'What would make it easier for you to flag blockers first?', explanation: "The question puts the member in charge of the fix. The template idea came from them, so they are more likely to use it." },
    ],
  },
  tryIt: {
    instructions: [
      'Write one piece of feedback for a colleague or classmate, with the behavior, the effect and the next step. Read it aloud and check that it names a specific action, not a trait.',
      'Write a reply to a piece of feedback you received recently. Start by asking one question about what the person saw, and separate the part you accept from the part you do not.',
      'Choose one person you need to influence who does not report to you. Write the goal you share, one piece of evidence and one small agreement you could ask for this week.',
    ],
  },
  mistakes: [
    { mistake: 'Giving feedback about character, such as "you are careless".', fix: 'Describe the specific behavior, its effect and a clear next step.' },
    { mistake: 'Defending yourself before you understand the feedback.', fix: 'Ask what the person saw and what they would have wanted, then reply.' },
    { mistake: 'Trying to influence with pressure or with a demand for a large yes.', fix: 'Share evidence and a shared goal, and ask for a small agreement first.' },
  ],
  quiz: [
    {
      question: 'A team member\'s updates are hard to act on. Which feedback is most useful?',
      options: [
        { text: 'You are not very organized.', explanation: 'It describes a trait rather than a behavior, so the person has nothing specific to change.' },
        { text: 'Your last two updates listed tasks but not blockers. Next week, could you put any blocker at the top?', explanation: 'It names the behavior and gives a clear next step the person can take.' },
        { text: 'Everyone is talking about your updates.', explanation: 'It is vague and possibly unfair, and it does not say what to change.' },
        { text: 'Maybe think about how you write things.', explanation: 'It is too general to act on, and it hides the real concern.' },
      ],
      answer: 1,
    },
    {
      question: 'The IT manager says, "Your access plan is too loose." What is the best first response?',
      options: [
        { text: 'Defend the plan, since it was reviewed by the team', explanation: 'Defending the plan before understanding the concern shuts the conversation down.' },
        { text: 'Agree and rewrite the whole plan that night', explanation: 'Rewriting before you understand the concern may fix the wrong thing.' },
        { text: 'Ask which part of the access they think is loose, and what would make them comfortable', explanation: 'A question reveals the concern, and the answer tells you what to change.' },
        { text: 'Ask the dean to tell the IT manager to accept the plan', explanation: 'Pressure through a third party damages trust with the person you need to work with.' },
      ],
      answer: 2,
    },
    {
      question: 'You need the IT manager to review the access list, but they do not report to you. What is the strongest first request?',
      options: [
        { text: 'Please approve the whole launch plan by Friday.', explanation: 'A large yes before any trust exists is hard to give, and it asks for too much at once.' },
        { text: 'Everyone else has already agreed, so you should too.', explanation: 'Appeals to others create pressure, and they do not provide evidence.' },
        { text: 'Let us know if you have concerns, at some point.', explanation: 'It asks for nothing specific, so the review may never happen.' },
        { text: 'Review the access list with us for 30 minutes on Thursday, given that our test results show no cross-student answers.', explanation: 'It shares evidence, asks for a small agreement and connects to a goal you both hold.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Give feedback about specific behavior, its effect and a next step, receive it by asking questions first and influence people you do not manage through evidence, shared goals and small agreements.',
  resources: [
    { title: 'Radical Candor', provider: 'Kim Scott', description: 'A book and website on giving feedback that is both caring and direct.', url: 'https://www.radicalcandor.com/' },
  ],
  underTheHood: {
    heading: 'Why feedback depends on trust',
    paragraphs: [
      "Feedback research often finds that people hear criticism more clearly when they trust the person giving it. A specific comment from a colleague who has shown they listen is more likely to be used than the same comment from someone who is seen as critical in general. Trust is built through many small interactions, not through one good conversation.",
      "Influence works the same way. The person you need to influence will weigh your evidence against their own experience of you. If your past requests were clear and kept, your next request carries more weight. Small agreements kept on time are the most reliable way to build that record.",
      "The two skills support each other. Asking good questions when you receive feedback signals that you take other views seriously, and that signal makes others more willing to share their views with you. Over time, a team where people ask and listen becomes one where problems are raised early.",
    ],
  },
}

export default lesson
