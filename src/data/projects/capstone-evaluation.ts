import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'capstone-evaluation',
  whatYouBuild: "A test set and scoring script for the Brightway handbook assistant from the knowledge-assistant project. It runs two versions of the assistant over the same questions, scores each answer for correctness and for saying \"I don't know\" when it should, and prints a report on what improved and what got worse.",
  diagram: code`
    test_set.json: questions, expected section, and whether the answer should be "I don't know"
      -> run version A over every question
      -> run version B over every question
      -> score each answer: correct section? correct refusal?
      -> compare: pass rate for each version, and the questions that changed
      -> report.md: what improved, what got worse, and what to fix next
  `,
  lessons: ['evaluating-ai-responses', 'ai-observability', 'hallucinations', 'data-and-evaluation', 'probability-and-statistics'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'The knowledge-assistant project, finished, or its sample functions', 'A simple text editor for the report'],
  time: 'about 5 hours',
  requirements: [
    'A test set with at least 12 questions, of which some should be refused',
    'A scoring rule that is written down and applied the same way to every answer',
    'A comparison of two versions on the same questions, with both pass rates',
    'A report that lists each question whose result changed, and why',
    'A note on the difference in results that is too small to trust',
  ],
  milestones: [
    {
      title: 'Write the test set',
      goal: 'Create questions with the section each one should cite, and mark the questions the handbook cannot answer.',
      hints: [
        'Write questions the way a real employee would ask them, including some with different words.',
        'Add at least four questions that should be refused, such as questions about things the handbook never mentions.',
        'Write each expected answer as a section id, so scoring is a simple comparison.',
      ],
      code: {
        language: 'python',
        filename: 'test_set.py',
        code: code`
          TEST_SET = [
              {"question": "How many days of paid leave do I get?", "expected": 1},
              {"question": "When do I have to submit expenses?", "expected": 2},
              {"question": "Can I work from home?", "expected": 3},
              {"question": "Can I bring my dog to the office?", "expected": None},
          ]

          if __name__ == "__main__":
              answerable = [t for t in TEST_SET if t["expected"] is not None]
              print(len(TEST_SET), "questions,", len(answerable), "answerable")
        `,
        output: '4 questions, 3 answerable',
      },
      checkpoint: 'The test set has the questions you planned, with a clear expected result for each one.',
    },
    {
      title: 'Define the scoring rule',
      goal: 'Write one scoring function that gives every answer a result of pass or fail, using the same rule for all versions.',
      hints: [
        'A correct answer cites the expected section id. A refusal is correct only when the expected value is None.',
        'Write the rule before you run any version, so you cannot adjust it to fit the results.',
        'Keep the rule in one function, and test it with a few answers you already know the result of.',
      ],
      code: {
        language: 'python',
        filename: 'scoring.py',
        code: code`
          NOT_FOUND = "I don't know in the handbook."

          def score(answer_text, cited_id, expected):
              if expected is None:
                  return answer_text == NOT_FOUND
              return cited_id == expected

          if __name__ == "__main__":
              print(score("See section [1]...", 1, 1))
              print(score(NOT_FOUND, None, None))
              print(score("See section [2]...", 2, 1))
        `,
        output: 'True\nTrue\nFalse',
      },
      checkpoint: 'The three test cases give True, True and False, as the rule says.',
    },
    {
      title: 'Run two versions on the same questions',
      goal: 'Run version A and version B over the whole test set, and record each answer with its citation.',
      hints: [
        'Version A can be the keyword search from the knowledge-assistant project. Version B can have a different threshold or a different word list.',
        'Use the same test set for both, and never change it between runs.',
        'Save every answer, so you can read the failures later instead of only the totals.',
      ],
      code: {
        language: 'python',
        filename: 'compare.py',
        code: code`
          from test_set import TEST_SET
          from scoring import score

          def version_a(question):
              return ("I don't know in the handbook.", None)

          def version_b(question):
              if "leave" in question.lower() or "paid" in question.lower():
                  return ("See section [1]", 1)
              return ("I don't know in the handbook.", None)

          def run(version):
              return [score(*version(t["question"]), t["expected"]) for t in TEST_SET]

          if __name__ == "__main__":
              print("A:", sum(run(version_a)), "of", len(TEST_SET))
              print("B:", sum(run(version_b)), "of", len(TEST_SET))
        `,
        output: 'A: 1 of 4\nB: 2 of 4',
      },
      checkpoint: 'Both versions run over all questions, and each version prints its pass count.',
    },
    {
      title: 'Read the changes, not only the totals',
      goal: 'List the questions whose result changed between the two versions, and say why each one changed.',
      hints: [
        'A change in the total can hide a question that got better and another that got worse. Compare question by question.',
        'For each changed question, look at the saved answer, not only the pass or fail.',
        'Write the reason in plain words, such as "the new word list matched leave".',
      ],
      code: {
        language: 'python',
        filename: 'changes.py',
        code: code`
          from test_set import TEST_SET
          from scoring import score
          from compare import version_a, version_b

          for t in TEST_SET:
              a = score(*version_a(t["question"]), t["expected"])
              b = score(*version_b(t["question"]), t["expected"])
              if a != b:
                  print("changed:", t["question"], "A:", a, "B:", b)
        `,
        output: 'changed: How many days of paid leave do I get? A: False B: True',
      },
      checkpoint: 'The report lists the changed question, and the version that handled it better.',
    },
    {
      title: 'Write the report and judge the size of the change',
      goal: 'Write a short report with both pass rates, the changed questions and a note on whether the difference is large enough to trust with this few questions.',
      hints: [
        'With only a dozen questions, a difference of one or two is noise. Say so in the report.',
        'Name the next fix you would test, such as a better threshold or more questions.',
        'Keep the report next to the test set, so the next version can be compared with it.',
      ],
      checkpoint: 'report.md states both pass rates, lists every changed question, and says whether the difference is meaningful.',
    },
  ],
  finishedMeans: [
    'The test set has at least 12 questions, including refusals, and it is saved in a file',
    'The scoring rule is written down before any version is run',
    'Both versions run on the same questions, and the report lists each changed question',
    'The report judges whether the difference is large enough to trust',
    'The project runs from a fresh clone with the test set included',
  ],
  readmeTemplate: code`
    # [Project name]: evaluating the handbook assistant

    [One sentence: what was compared and on how many questions.]

    ## Run it
    [The command that runs both versions and prints the report.]

    ## Test set
    [How many questions, how many refusals, and how they were written.]

    ## Scoring rule
    [The rule, exactly as written in the code.]

    ## Results
    [Both pass rates, and each changed question.]

    ## Is the difference real?
    [Your honest judgment, with the size of the test set.]
  `,
  portfolioText: "Describe this as an evaluation of an AI assistant, with a test set, a rule written before the results and a comparison of two versions. Explain one question that changed and what it taught you. Employers value people who can tell whether an AI change helped, and who say when the evidence is too thin.",
  stretchGoals: [
    'Grow the test set to at least 50 questions, and compare the results again',
    'Add a second scoring rule that checks whether each answer uses only the cited text',
    'Track the pass rate over several versions in a chart',
  ],
}

export default plan
