import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Prepare a change so that a reviewer can understand and check it quickly',
    'Review someone else\'s change for correctness, tests, readability, and security',
    'Give and receive feedback in a way that improves the code and keeps the team working well',
  ],
  bigIdea: 'A code review is a second pair of eyes on a change before it reaches the main code. A good review checks whether the change is correct, tested, readable, and safe, and it does so with respect for the author. The author makes the review easy by keeping the change small and explaining it clearly.',
  whyItMatters: 'A Study Tracker change adds a delete button. It works for the author, who tests it with their own sessions. A reviewer notices that the delete does not check whose session it is, so any student could delete any record. The review took ten minutes and prevented a serious bug that no test in the project would have caught.',
  goalSections: [
    {
      heading: 'Preparing a change for review',
      paragraphs: [
        'Keep the change small. A review of two hundred lines can be checked carefully in one sitting. A review of two thousand lines is usually skimmed, and the important problems are the ones that get missed.',
        'Write a short description that says what changed, why, and how it was tested. A reviewer who understands the purpose can judge whether the change does what it should. Include a note about anything you are unsure of, so the reviewer knows where to look.',
        'Check your own change before asking for review. Read the diff as if you were the reviewer. Remove debugging output, commented-out code, and unrelated edits, because each one costs the reviewer time.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Title: Add delete button to session list
          What: a delete button on each session, calls DELETE /sessions/{id}
          Why: students asked to remove sessions logged by mistake
          Tested: unit tests for the delete function, manual check in the container
          Unsure about: whether the confirmation dialog is needed on mobile
        `,
      },
    },
    {
      heading: 'What a reviewer checks',
      paragraphs: [
        'Start with correctness. Does the change do what the description says, for normal inputs and for the edge cases? Ask what happens with an empty list, a missing value, and a value that is too large.',
        'Then check the tests. A change without a test for its new behavior is a risk, and a test that always passes is not a test at all. Ask whether a test would fail if the change were broken.',
        'Check readability and security. Can another developer understand the change in a few minutes? Does it check permission, validate input, and keep secrets out of logs? A reviewer who sees a delete without an ownership check should stop the change there.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          sessions = {1: "ada", 2: "grace"}

          def delete_session(user, session_id):
              del sessions[session_id]
              return "deleted"

          def delete_session_safely(user, session_id):
              if sessions.get(session_id) != user:
                  return "forbidden"
              del sessions[session_id]
              return "deleted"

          print(delete_session("ada", 2))
          print(delete_session_safely("ada", 1))
        `,
        output: 'deleted\ndeleted',
      },
    },
    {
      heading: 'Giving and receiving feedback',
      paragraphs: [
        'Comment on the code, not the person. "This function does not check the owner" points to a fact in the change. "You forgot this" makes the author feel judged, and it makes the next review harder.',
        'Mark the difference between a required change and a suggestion. A required change must be fixed before merging, such as a security problem. A suggestion can be taken or left, such as a different name. Saying which is which saves time for both people. A short thank you for a useful comment keeps the review friendly. Ask a reviewer to explain any comment you do not understand, rather than guessing what was meant. Keep a list of the comments you receive most often, so the next change avoids them.',
        'Receive feedback as information. The reviewer has spent time on your change, and most comments show something you can learn. Reply to each comment, either by changing the code or by explaining why not.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Weak comment: "You forgot the owner check."
          Useful comment: "This delete does not check the owner. Required: check the session owner before deleting."
          Suggestion: "A clearer name here would be session_owner. Optional."
          Reply: "Added the owner check and a test that fails without it."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Reviewing a delete with a checklist',
    intro: 'The program above checks a proposed change against a short review checklist and lists the items it fails. Real reviews use judgment too, but a checklist makes sure the basics are never skipped. Run it, then mark the ownership check as passed and predict the result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        checklist = {
            "does what the description says": True,
            "has a test that would fail if broken": False,
            "checks ownership before changing data": False,
            "no debug output or unrelated edits": True,
        }
        failed = [item for item, passed in checklist.items() if not passed]
        if failed:
            print("changes requested:")
            for item in failed:
                print("-", item)
        else:
            print("approved")
      `,
      output: 'changes requested:\n- has a test that would fail if broken\n- checks ownership before changing data',
    },
    steps: [
      { code: 'checklist = {...}', explanation: 'Each review question is written down, so none of the basics is skipped under time pressure.' },
      { code: 'failed = [item for item, passed in checklist.items() if not passed]', explanation: 'Collects the items the change does not yet meet.' },
      { code: 'print("changes requested:") ...', explanation: 'Returns the failed items as concrete requests, not a general unease.' },
    ],
  },
  tryIt: {
    instructions: [
      'Look at one of your own recent changes and write a description with what, why, how it was tested, and one unsure point.',
      'Review a change in a public project, or a change a classmate wrote. Write three comments, marking each as required or a suggestion.',
      'Change the ownership check in the first code example to use the session owner, and predict the result for a user who does not own the session.',
    ],
  },
  mistakes: [
    { mistake: 'Sending a very large change for review.', fix: 'Split it into small changes, each with its own description and tests.' },
    { mistake: 'Approving a change without checking its tests and permissions.', fix: 'Use a checklist that includes correctness, tests, readability, and security.' },
    { mistake: 'Writing comments that criticize the author.', fix: 'Comment on the code, and mark each comment as required or a suggestion.' },
  ],
  quiz: [
    {
      question: 'Why keep a change small before asking for review?',
      options: [
        { text: 'Because a small change can be checked carefully, while a large one is often skimmed', explanation: 'Yes. Reviewers miss problems in large changes when they cannot read them closely.' },
        { text: 'Because reviewers are paid per line', explanation: 'Pay is not the reason. The reason is the quality of the review.' },
        { text: 'Because reviews are not allowed for large changes', explanation: 'Large changes can be reviewed, but they are reviewed less well.' },
        { text: 'Because small changes never need tests', explanation: 'Every change needs tests. Small size makes them easier to write and check.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the second call?',
      code: { language: 'python', runnable: true, code: code`
        sessions = {1: "ada"}
        def delete_safely(user, session_id):
            if sessions.get(session_id) != user:
                return "forbidden"
            del sessions[session_id]
            return "deleted"
        print(delete_safely("grace", 1))
      ` },
      options: [
        { text: 'deleted', explanation: 'Grace does not own session 1, so the check refuses the deletion.' },
        { text: 'forbidden', explanation: 'Yes. The owner check fails for Grace, so the delete is refused.' },
        { text: 'ada', explanation: 'The program prints the result of the check, not the owner.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What makes a review comment useful?',
      options: [
        { text: 'It points to a fact in the change and says whether it is required or a suggestion', explanation: 'Yes. Specific, labeled comments are quick to act on.' },
        { text: 'It says the author should have known better', explanation: 'That comment criticizes the person and does not help the change.' },
        { text: 'It is written in capital letters to get attention', explanation: 'Tone and clarity matter more than emphasis.' },
        { text: 'It asks for every possible improvement at once', explanation: 'A long list of unlabeled requests is hard to prioritize.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Keep changes small and well described, review for correctness, tests, readability, and security, and give feedback about the code that marks each request as required or a suggestion.',
  resources: [
    { title: 'Code review developer guide', provider: 'Google', description: 'A guide to what reviewers check and how to keep reviews fast and useful.', url: 'https://google.github.io/eng-practices/review/' },
    { title: 'About pull requests', provider: 'GitHub Docs', description: 'How to open, review, and discuss changes with pull requests on GitHub.', url: 'https://docs.github.com/en/pull-requests' },
  ],
}

export default lesson
