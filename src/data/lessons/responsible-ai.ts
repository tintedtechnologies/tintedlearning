import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Decide what is safe to share with an AI tool and what to keep out',
    'Spot bias in AI output and limit its effect on decisions about people',
    'Choose when to disclose AI help, and when not to use AI at all',
  ],
  bigIdea: "Using AI responsibly means thinking about everyone a task touches: you, the people whose information you share, the people affected by the result and the people who read it. Four habits cover most situations: protect private information, watch for unfair patterns, be honest about when AI helped, and recognize the jobs where AI should not be used.",
  whyItMatters: "In 2023, employees at Samsung pasted confidential source code and internal meeting notes into a public chatbot while asking it for help. Soon after, the company restricted staff use of such tools. Nobody meant any harm. They were trying to work faster and did not stop to ask where the text was going, or who else might be affected.",
  goalSections: [
    {
      heading: 'What to share and what to keep out',
      paragraphs: [
        "Whatever you type into an online AI tool goes to the provider's computers. Depending on the provider, your settings and your plan, it may be stored, read by staff checking for misuse, or used to train future models. Read the data settings once, and turn off training on your chats if you can.",
        "A simple traffic light helps. Green, fine to share: public information, your own non-sensitive work and made-up examples. Amber, share only what the task needs: your own personal details. Red, keep out: other people's personal information, passwords and keys, health, money and ID numbers, and confidential school or work material, unless your organization has approved the tool.",
        "Often you can keep the useful part and drop the risky part. Replace names with roles, real numbers with similar made-up ones, and company names with \"a client\".",
      ],
      example: {
        language: 'text',
        code: code`
          Before (red):  Summarize this complaint from Dana Ruiz, account 88123,
                         who says her card was charged twice on March 3.
          After (green): Summarize this complaint from a customer who says
                         their card was charged twice last week.
        `,
      },
    },
    {
      heading: 'Watching for bias',
      paragraphs: [
        "Models learn from text written by people, and that text carries people's stereotypes and imbalances. So output can lean the same way: assuming a nurse is a woman and an engineer a man, writing warmer reference letters for some names than others, or showing only one kind of person when asked for images of a doctor.",
        "Bias matters most when AI output feeds into decisions about people, such as hiring, grading, lending, housing and healthcare. In several places, laws already restrict fully automated decisions in these areas.",
        "A quick test is to swap one detail, such as a name, gender or age, keep everything else identical and compare the outputs. Keep a person responsible for any decision about a person, and use AI for drafts and suggestions, never for the final verdict.",
      ],
      example: {
        language: 'text',
        code: code`
          Swap test, run in two fresh chats:
            "Write a one-line reference for Emily, a student who completed
             every assignment and led a study group."
            "Write a one-line reference for Jamal, a student who completed
             every assignment and led a study group."

          Compare: Are the strengths the same? Is one warmer or more specific?
        `,
      },
    },
    {
      heading: 'Disclosure, and when not to use AI',
      paragraphs: [
        "Schools and employers increasingly have written AI policies, and those come first. Where there is no rule, a short honest note is a good default, such as \"I used an AI tool to check grammar.\" Never pass off AI-generated work as your own where that is not allowed, and never present an AI image as a real photo.",
        "Some jobs are better done without AI. When the point is your own learning, doing the exercise is the learning. When accuracy is vital and you cannot check the answer, AI adds risk. In urgent medical, legal or safety situations, contact a professional or emergency services directly. And for personal messages, such as an apology or a condolence, your own words matter more than polished ones.",
      ],
      example: {
        language: 'text',
        code: code`
          Good fit                       Use with care            Don't use AI
          explain a concept you're stuck  draft a work email       write the exercise you're graded on
          brainstorm project names       summarize a contract     decide who gets a job
          check your grammar             feedback on a resume     an emergency, instead of calling for help
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Getting help with a delicate email',
    intro: "A tutor needs to reply to a student who missed an essay deadline because of a hospital stay. They want AI help with the wording. Here is how they go about it, step by step. The reply is a typical one.",
    example: {
      language: 'text',
      code: code`
        First idea (never sent):
          Write a reply to Priya Shah, student ID 20417, who was in the hospital
          with appendicitis and missed the essay deadline.

        Prompt actually sent:
          Write a short, kind reply to a student who missed an essay deadline
          for a medical reason. Offer a one-week extension. Under 100 words.

        A typical reply:
          "...I hope you're feeling better. Please take all the time you need..."

        Tutor's check:  "all the time you need" contradicts a one-week extension
        Tutor's edit:   "...You now have one extra week, until Friday the 14th."
        Sent from the tutor's own email, with the student's name added back in.
      `,
    },
    steps: [
      { code: 'First idea (never sent)', explanation: "It contains a full name, a student ID and a diagnosis: three pieces of red information about someone else. None of them would improve the wording of the reply." },
      { code: 'Prompt actually sent', explanation: "The task is identical, but the student cannot be identified. The model needs only the situation, the offer and the length." },
      { code: '"Please take all the time you need..."', explanation: "A kind phrase, and a wrong one. Taken literally, it promises an unlimited extension, which is not what the tutor is offering." },
      { code: 'Tutor\'s check', explanation: "The tutor reads the reply as the student would. Checking that the promise matches the real offer is part of owning the message." },
      { code: 'Tutor\'s edit', explanation: "A precise date replaces the vague phrase. The tutor adds the student's name back in their own email client, so it never passes through the AI tool." },
      { code: 'Sent from the tutor\'s own email', explanation: "The school's policy allows AI help with drafting staff messages, so no note is needed. The tutor still read, corrected and stands behind every word." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a real task you would like AI help with. List every piece of information you would include and mark each one green, amber or red.',
      'Rewrite your request without the red items, and check it still gives the AI what it needs.',
      'If your task involves people, run the swap test in two fresh chats and compare. Finally, write the one-sentence disclosure you would use, or note the policy that applies to you.',
    ],
    evidencePrompt: {
      label: 'Your plan',
      placeholder: 'For example: I removed my coworker\'s name and the client\'s company. The swap test gave the same strengths for both names. My workplace policy says to note AI help in the document footer.',
    },
  },
  mistakes: [
    { mistake: 'Pasting other people\'s personal information into a public AI tool.', fix: 'Replace names, IDs and details with roles or made-up values, or use a tool your organization approved for that data.' },
    { mistake: 'Letting AI make a decision about a person without human review.', fix: 'Use AI for drafts and suggestions. A person reviews each case and is responsible for the decision.' },
    { mistake: 'Using AI to do the exercise you are meant to learn from.', fix: 'Ask it to explain, give a hint or quiz you instead, and write the answer yourself.' },
    { mistake: 'Hiding AI help where disclosure is required.', fix: 'Check your school or workplace policy. When there is none, add a short, honest note about how you used it.' },
  ],
  quiz: [
    {
      question: 'Which of these is safest to paste into a public AI chatbot?',
      options: [
        { text: 'A customer\'s name and order history', explanation: 'This is someone else\'s personal information. Remove or replace it first.' },
        { text: 'Your company\'s unreleased product plan', explanation: 'Confidential work material should only go into a tool your organization has approved.' },
        { text: 'A paragraph from a public encyclopedia article you want simplified', explanation: 'It is already public and contains no private details.' },
        { text: 'A colleague\'s performance review', explanation: 'Reviews are private information about another person.' },
      ],
      answer: 2,
    },
    {
      question: 'An AI tool ranks job applicants. Two nearly identical resumes get very different scores, and only the names differ. What should you do?',
      options: [
        { text: 'Trust the scores, because software is objective', explanation: 'Models learn from human-written data and can repeat its unfairness.' },
        { text: 'Remove names and assume the problem is solved', explanation: 'Other details, such as schools or addresses, can carry the same bias. The tool needs proper review.' },
        { text: 'Run it again until the scores match', explanation: 'Rerunning hides the problem rather than fixing it.' },
        { text: 'Stop relying on its ranking, report the result, and keep a person reviewing every candidate', explanation: 'The swap test revealed bias. Decisions about people need human responsibility.' },
      ],
      answer: 3,
    },
    {
      question: 'Your Python exercise is to write a loop that totals study minutes. Which use of AI is most likely to hurt your learning?',
      options: [
        { text: 'Asking it to write the loop, then pasting it in without trying first', explanation: 'Writing the loop is the skill the exercise builds. Skipping it skips the learning.' },
        { text: 'Asking it to explain an error message after you tried', explanation: 'Getting unstuck after a real attempt supports learning.' },
        { text: 'Asking it for a similar practice problem', explanation: 'Extra practice helps you learn.' },
        { text: 'Asking it to quiz you on how loops work', explanation: 'Being quizzed makes you recall and apply the idea yourself.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Before using AI, ask what you are sharing, who the result could treat unfairly, whether you should say AI helped, and whether this is a job AI should be doing at all.',
  resources: [
    { title: 'Ethics of AI', provider: 'University of Helsinki', description: 'A free online course on fairness, transparency and responsibility in AI.', url: 'https://ethics-of-ai.mooc.fi/' },
    { title: 'AI Risk Management Framework', provider: 'NIST', description: 'The US government\'s voluntary framework for managing AI risks in organizations.', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
    { title: 'Recommendation on the Ethics of AI', provider: 'UNESCO', description: 'A global agreement on values and principles for AI, adopted by UNESCO member states.', url: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics' },
  ],
  underTheHood: {
    heading: 'Where bias in a model comes from',
    paragraphs: [
      "Bias enters a model at several points. The training text over-represents some languages, countries and groups, because they write more online. Historical data records past decisions, so a model trained on old hiring choices learns old hiring patterns. And the people who rate answers during training bring their own judgments about what a good answer is.",
      "Removing it entirely is harder than it sounds, because fairness has more than one definition, and they can conflict. Should a hiring tool be equally accurate for every group? Should it recommend the same share of candidates from each group? When groups differ in the underlying data, it is often impossible to meet both at once.",
      "That is why fairness cannot be checked once for a whole model. It has to be checked for a specific use, with a decision about which definition matters there, made by people who understand the situation and are accountable for it. Swap tests and human review are the everyday versions of that work.",
    ],
  },
}

export default lesson
