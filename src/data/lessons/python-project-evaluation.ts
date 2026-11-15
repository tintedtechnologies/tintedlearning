import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a small set of test questions with the answers you expect',
    'Score two versions of a project on the same cases and compare them fairly',
    'Read the individual failures to decide what to fix next',
  ],
  bigIdea: "To know whether an AI project got better, you need a fixed set of example questions with known good answers, called an evaluation set. Run every version on the same set and compare the scores. Then read the cases that failed, because the score tells you how much is wrong and the failures tell you what.",
  whyItMatters: "You tweak your handbook assistant's retrieval, try three questions, and the answers look better. You ship it. A week later people report that questions about expenses now get vacation answers. Your three tries happened to miss that case. Twenty written-down cases, run before and after the change, would have shown that one thing improved while another broke.",
  goalSections: [
    {
      heading: 'Building an evaluation set',
      paragraphs: [
        "An evaluation set is a list of cases. Each case has an input, such as a question, and what a correct result looks like, such as which document should be retrieved or a fact the answer must contain.",
        "Choose cases that look like real use, not just the easy ones. Include common questions, oddly worded ones, questions with typos, and questions the system should refuse because the answer is not in the documents. Twenty to fifty careful cases beat a thousand careless ones when you are starting out.",
        "Store the cases in your project, in a Python list or a JSON file, next to the code they test.",
        "Write the set down once and keep it fixed. If the cases change every time you test, you cannot tell whether the project improved or the test got easier.",
      ],
      example: {
        language: 'python',
        code: code`
          cases = [
              {"question": "How many vacation days do I get?", "expected": "leave"},
              {"question": "When are expense claims due?", "expected": "expenses"},
              {"question": "Can I work remotely on Fridays?", "expected": "remote"},
              {"question": "Where do I park?", "expected": None},
          ]
          print(len(cases), "cases,", sum(c["expected"] is None for c in cases), "should be refused")
        `,
        output: '4 cases, 1 should be refused',
      },
    },
    {
      heading: 'Comparing versions fairly',
      paragraphs: [
        "Start by scoring the simplest version, your baseline. Then, for each change, run the new version on exactly the same cases and score it the same way. Only then can you say the change helped.",
        "Change one thing at a time. If you switch the retrieval method and rewrite the prompt together, and the score goes up, you will not know which change did it, or whether one helped while the other hurt.",
        "A single number is useful for comparing, such as the share of cases passed. But two versions with the same score can fail on completely different cases, so always look underneath it.",
      ],
      example: {
        language: 'python',
        code: code`
          baseline = {"q1": True, "q2": True, "q3": False, "q4": False}
          new_version = {"q1": True, "q2": False, "q3": True, "q4": True}

          for name, results in [("baseline", baseline), ("new", new_version)]:
              print(name, sum(results.values()), "of", len(results))

          broke = [q for q in baseline if baseline[q] and not new_version[q]]
          print("newly failing:", broke)
        `,
        output: "baseline 2 of 4\nnew 3 of 4\nnewly failing: ['q2']",
      },
    },
    {
      heading: 'Reading the failures',
      paragraphs: [
        "After every run, print each failing case with what was expected and what actually happened. Reading ten failures teaches you more than staring at a percentage.",
        "Group the failures by cause. Did retrieval pick the wrong document? Did the system answer when it should have refused? Did it refuse when the answer was there? The biggest group is usually the best next thing to fix.",
        "Fixing one failure should not mean adding that exact question to the code as a special case. That makes the score look better without improving the system, and it will still fail on the next similar question.",
      ],
      example: {
        language: 'text',
        code: code`
          FAIL  "When are expense claims due?"   expected expenses, got leave
          FAIL  "Can I claim a taxi?"            expected expenses, got None
          FAIL  "Where do I park?"               expected None,     got leave

          Pattern: questions about expenses rarely use the word "expenses"
          Next fix: improve retrieval for different wording, then rerun all cases
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Evaluating a retrieval function',
    intro: "This program evaluates the keyword retrieval from the previous lesson on five fixed cases. It prints the pass rate and every failure, with expected and actual results side by side.",
    example: {
      language: 'python',
      code: code`
        DOCS = {
            "leave": "Staff get 25 vacation days a year.",
            "expenses": "Submit expenses within 30 days with a receipt.",
            "remote": "You may work remotely up to 3 days a week.",
        }
        STOP = {"the", "is", "a", "how", "do", "i", "many", "what", "get", "can", "are", "my", "when"}

        def words(text):
            return {w.strip("?.,").lower() for w in text.split()} - STOP

        def retrieve(question):
            scores = {name: len(words(question) & words(text)) for name, text in DOCS.items()}
            best = max(scores, key=scores.get)
            return best if scores[best] > 0 else None

        cases = [
            ("How many vacation days do I get?", "leave"),
            ("When are expenses due?", "expenses"),
            ("Can I work remotely?", "remote"),
            ("Where do I submit a taxi receipt?", "expenses"),
            ("Can I claim a taxi?", "expenses"),
            ("Is there a gym discount?", None),
        ]

        passed = 0
        for question, expected in cases:
            actual = retrieve(question)
            if actual == expected:
                passed += 1
            else:
                print("FAIL", repr(question), "expected", expected, "got", actual)

        print(f"Passed {passed} of {len(cases)} ({passed / len(cases):.0%})")
      `,
      output: "FAIL 'Can I claim a taxi?' expected expenses got None\nPassed 5 of 6 (83%)",
    },
    steps: [
      { code: 'cases = [ (question, expected), ... ]', explanation: "The fixed evaluation set. It mixes easy questions, questions in different wording, and one that should be refused." },
      { code: 'actual = retrieve(question)', explanation: "Runs the real retrieval function on each case, exactly as the app would." },
      { code: 'if actual == expected:\n    passed += 1', explanation: "A case passes only if the retrieved document matches. For the gym question, the expected result is `None`, meaning correctly refused." },
      { code: 'print("FAIL", repr(question), "expected", expected, "got", actual)', explanation: "Every failure is printed in full. `repr()` shows the question with quotes, so stray spaces are visible. The taxi claim fails because it shares no words with the expenses entry, which is exactly the kind of gap an evaluation set exists to reveal." },
      { code: 'print(f"Passed {passed} of {len(cases)} ({passed / len(cases):.0%})")', explanation: "`:.0%` formats a fraction as a whole percentage. Record this number for the baseline, then compare every future change against it." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground and note the baseline score.',
      'Add the case `("How do I book time off?", "leave")`. Predict whether it passes, then run it.',
      'Fix it by adding a word to the leave document, rerun, and check that no other case started failing.',
    ],
    playground: 'python',
    starterCode: code`
      DOCS = {
          "leave": "Staff get 25 vacation days a year.",
          "expenses": "Submit expenses within 30 days with a receipt.",
          "remote": "You may work remotely up to 3 days a week.",
      }
      STOP = {"the", "is", "a", "how", "do", "i", "many", "what", "get", "can", "are", "my", "when"}

      def words(text):
          return {w.strip("?.,").lower() for w in text.split()} - STOP

      def retrieve(question):
          scores = {name: len(words(question) & words(text)) for name, text in DOCS.items()}
          best = max(scores, key=scores.get)
          return best if scores[best] > 0 else None

      cases = [
          ("How many vacation days do I get?", "leave"),
          ("When are expenses due?", "expenses"),
          ("Can I work remotely?", "remote"),
          ("Where do I submit a taxi receipt?", "expenses"),
          ("Can I claim a taxi?", "expenses"),
          ("Is there a gym discount?", None),
      ]

      passed = 0
      for question, expected in cases:
          actual = retrieve(question)
          if actual == expected:
              passed += 1
          else:
              print("FAIL", repr(question), "expected", expected, "got", actual)

      print(f"Passed {passed} of {len(cases)} ({passed / len(cases):.0%})")
    `,
  },
  mistakes: [
    { mistake: 'Judging a change by trying a few questions by hand.', fix: 'Write the cases down and run them all, before and after, every time.' },
    { mistake: 'Changing the evaluation cases between versions.', fix: 'Keep the set fixed while comparing. Add new cases as a separate, recorded step, then rescore every version.' },
    { mistake: 'Reporting only the average score.', fix: 'List what newly fails as well as what newly passes, and read each failure.' },
    { mistake: 'Adding special-case code for one failing question.', fix: 'Fix the cause that a whole group of failures shares, not the single example.' },
  ],
  quiz: [
    {
      question: 'Version A passes 18 of 20 cases. Version B also passes 18 of 20. What should you do before choosing?',
      options: [
        { text: 'Pick either, since they score the same', explanation: 'Equal scores can hide different failures. One version might fail on your most important questions.' },
        { text: 'Compare which cases each one fails', explanation: 'If A fails two minor cases and B fails two critical ones, A is the better choice despite the tie.' },
        { text: 'Pick B, since newer is usually better', explanation: 'Newer is not evidence. The cases themselves are.' },
        { text: 'Add 20 easier cases so one pulls ahead', explanation: 'That changes the test to produce a winner rather than finding out which is better.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        results = [True, False, True, True]
        print(f"{sum(results) / len(results):.0%}")
      ` },
      options: [
        { text: '3', explanation: 'That is the number of passes. The code divides by the number of cases and formats it as a percentage.' },
        { text: '0.75', explanation: 'That is the raw fraction. The `:.0%` format turns it into a percentage.' },
        { text: '75%', explanation: '`sum` counts each `True` as 1, giving 3 out of 4. `:.0%` shows 0.75 as 75%.' },
        { text: '3/4', explanation: 'Python works out the division. It does not print fractions like this.' },
      ],
      answer: 2,
      answerIsOutput: true,
    },
    {
      question: 'You change the prompt and the retrieval method at the same time, and the pass rate rises from 60% to 70%. What is the problem?',
      options: [
        { text: 'You cannot tell which change helped, or whether one of them made things worse', explanation: 'Change one thing at a time so each score difference has a single cause.' },
        { text: 'A 10-point rise is too small to matter', explanation: 'It may matter a lot. The issue is that you do not know where it came from.' },
        { text: 'Prompts should never be changed', explanation: 'Prompts are a normal thing to improve. Just change them separately from other parts.' },
        { text: 'There is no problem, since the score went up', explanation: 'One change might have added 20 points and the other taken away 10. You would keep both without knowing.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Keep a fixed set of realistic cases, score every version on all of them one change at a time, and read the failures before deciding what to do next.',
  resources: [
    { title: 'A practical guide to evaluating LLM apps', provider: 'Hamel Husain', description: 'Hands-on advice on building evaluation sets and reading failures.', url: 'https://hamel.dev/blog/posts/evals/' },
    { title: 'Model evaluation', provider: 'scikit-learn', description: 'Reference for standard scores once your cases have labels.', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
  ],
  underTheHood: {
    heading: 'How sure can you be about a small evaluation?',
    paragraphs: [
      "With 20 cases, one case is 5 percentage points. If version B beats A by one case, 85% against 80%, that could easily be luck: a slightly different set of questions might flip the result.",
      "A rough guide comes from statistics. For a pass rate near 80% measured on n cases, the uncertainty is about plus or minus 2 times the square root of (0.8 times 0.2 divided by n). With 20 cases that is about 18 points. With 200 cases it shrinks to about 6 points.",
      "So small sets are good for finding failures to fix, and not good for proving small improvements. When the difference really matters, add more cases, and check the paired picture as well: of the cases where A and B disagree, how many does each win?",
    ],
  },
}

export default lesson
