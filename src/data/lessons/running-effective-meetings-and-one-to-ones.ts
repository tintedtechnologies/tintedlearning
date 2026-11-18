import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Plan a meeting with a purpose, an agenda, and an owner for each decision',
    'Run a one-to-one that builds trust and surfaces problems early',
    'Write down decisions and actions so they are not lost after the meeting',
  ],
  bigIdea: 'Most meetings fail for one of three reasons: no clear purpose, no one owns the decision, or the outcome is never written down. A good meeting has a purpose stated in advance, an agenda that matches the time, and a short record of decisions and actions afterward. One-to-ones are a different tool: a regular, private conversation that keeps the relationship healthy and catches problems while they are small.',
  whyItMatters: 'A team meets for an hour every week. People talk, nothing is decided, and the same problem appears in every meeting for a month. When a manager finally asks what the meeting is for, nobody knows. A purpose, an agenda, and a one-line record of each decision would have ended the cycle in the first week, and the one-to-ones would have revealed the frustration sooner.',
  goalSections: [
    {
      heading: 'Planning a meeting with a purpose',
      paragraphs: [
        'Before inviting anyone, write the purpose in one sentence. "Decide the launch date for the course" is a purpose. "Discuss the project" is not, because it gives people no way to know whether they succeeded. If you cannot state a purpose, the meeting may not be needed, and a short message may do the job.',
        'Build an agenda with a time for each item and an owner. The owner introduces the topic and brings the options. A decision item should list the options and the criteria for choosing between them, so the group can decide rather than only discuss.',
        'Invite only the people who must decide or act. Each extra person adds time and reduces the chance of a clear outcome. Let the others read a summary afterward.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Purpose: decide the course launch date
          Agenda:
            10 min  options for the date (owner: Dana)
            15 min  choose using availability and risk (decision: group)
            5 min   assign the announcement (owner: Sam)
          Invited: the three people who must agree on the date
        `,
      },
    },
    {
      heading: 'Writing down decisions and actions',
      paragraphs: [
        'Record each decision in one line, with the date and the reason. A decision without a reason is hard to revisit, and people will reopen it later when the reason is forgotten. Note who disagreed, if anyone did, because that helps the group learn.',
        'Record each action with an owner and a due date. An action with no owner will be done by no one. Send the record within a day, so the people who were absent can see the outcome and the group can check progress at the next meeting.',
        'Start the next meeting by reviewing the actions. If an action was not done, ask what got in the way. Treat the answer as information about the process, not as a failure of the person.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          actions = [("send the announcement", "Sam", True), ("book the venue", "Dana", False), ("update the page", "Lee", False)]
          open_actions = [(task, owner) for task, owner, done in actions if not done]
          print("open actions:", len(open_actions))
          for task, owner in open_actions:
              print("-", task, "owner:", owner)
        `,
        output: 'open actions: 2\n- book the venue owner: Dana\n- update the page owner: Lee',
      },
    },
    {
      heading: 'The one-to-one',
      paragraphs: [
        'A one-to-one is a short, regular meeting between two people, usually every week or two, that belongs to the person who reports or is supported. Its purpose is to talk about how things are going, what is blocking them, and what they want to learn. It is not a status report.',
        'Ask open questions and listen more than you speak. "What is taking most of your time this week?" invites a real answer. "Are you on track?" invites a yes. Follow up on what the person said last time, so they see that their words are remembered and acted on.',
        'Keep notes that belong to the person, and share them when they ask. Use the one-to-one to notice patterns early, such as growing frustration or a task that keeps slipping, and to agree on one thing to try before the next meeting.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          notes = ["asked about blockers", "followed up on the last task"]
          print("points to follow up:", len(notes))
        `,
        output: 'points to follow up: 2',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking which meetings produced a decision',
    intro: 'The program below reviews a list of meetings and reports which ones have a recorded decision and an owner. Meetings without either are the ones to fix first. Run it, then add a decision to the second meeting and predict the new count.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        meetings = [
            {"name": "launch date", "decision": "1 March", "owner": "Dana"},
            {"name": "budget review", "decision": None, "owner": "Lee"},
            {"name": "weekly sync", "decision": None, "owner": None},
        ]
        needs_fix = [m["name"] for m in meetings if not m["decision"] or not m["owner"]]
        print("meetings to fix:", len(needs_fix))
        print("first to fix:", needs_fix[0])
      `,
      output: 'meetings to fix: 2\nfirst to fix: budget review',
    },
    steps: [
      { code: 'if not m["decision"] or not m["owner"]', explanation: 'A meeting needs both a recorded decision and an owner to count as useful.' },
      { code: 'print("meetings to fix:", len(needs_fix))', explanation: 'Gives a count, so improvement is measurable from one month to the next.' },
      { code: 'print("first to fix:", needs_fix[0])', explanation: 'Names the first meeting to improve, so the next step is concrete.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a one-sentence purpose for the next meeting you plan. If you cannot, decide whether the meeting is needed.',
      'Change the actions example so that "book the venue" is done, and predict the new open count. Run it to check.',
      'Plan one one-to-one. Write three open questions you will ask, and one thing you will follow up on from last time.',
    ],
  },
  mistakes: [
    { mistake: 'Holding a meeting with no stated purpose.', fix: 'Write the purpose in one sentence, and cancel the meeting if you cannot.' },
    { mistake: 'Ending without a written record of decisions and owners.', fix: 'Send a one-line record for each decision and action within a day.' },
    { mistake: 'Using one-to-ones as status reports.', fix: 'Ask about the person, their blockers, and what they want to learn, and keep the notes theirs.' },
  ],
  quiz: [
    {
      question: 'What makes a decision item in a meeting useful?',
      options: [
        { text: 'The options and the criteria for choosing between them are listed before the meeting', explanation: 'Yes. Options and criteria let the group decide, rather than only discuss.' },
        { text: 'The meeting runs as long as it takes', explanation: 'A fixed time with an agenda keeps decisions focused.' },
        { text: 'Everyone speaks for the same amount of time', explanation: 'Equal time does not produce a decision.' },
        { text: 'The item is left open until next month', explanation: 'Leaving decisions open repeats the same meeting.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the number of open actions?',
      code: { language: 'python', runnable: true, code: code`
        actions = [("a", True), ("b", False), ("c", False)]
        print(len([t for t, done in actions if not done]))
      ` },
      options: [
        { text: '1', explanation: 'Two actions are not done, so the count is 2.' },
        { text: '2', explanation: 'Yes. Actions b and c are open.' },
        { text: '3', explanation: 'Action a is done, so it is not open.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What is the main purpose of a one-to-one?',
      options: [
        { text: 'To understand how the person is doing, what blocks them, and what they want to learn', explanation: 'Yes. It is a regular, private conversation that surfaces problems early.' },
        { text: 'To check the status of each task', explanation: 'Status checks belong in team tracking. A one-to-one is about the person.' },
        { text: 'To give a performance rating', explanation: 'Ratings are a separate process with its own rules.' },
        { text: 'To replace the team meeting', explanation: 'A one-to-one complements the team meeting. It does not replace it.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Meetings need a purpose, an agenda with owners, and a written record of decisions and actions, and one-to-ones build trust by focusing on the person and catching problems while they are small.',
  resources: [
    { title: 'Meeting guide', provider: 'Atlassian', description: 'Practical guidance on planning meetings, agendas, and follow-up actions.', url: 'https://www.atlassian.com/software/confluence/resources/guides/how-to/meeting-agenda' },
    { title: 'One-on-ones', provider: 'Google re:Work', description: 'An overview of how regular one-to-one meetings work and what they are for.', url: 'https://rework.withgoogle.com/guides/managing-performance-one-on-ones/steps/introduction/' },
  ],
}

export default lesson
