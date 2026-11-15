import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'capstone-evaluation',
  whatYouBuild: "A test set and scoring script for the document assistant from the knowledge-assistant project. It runs two versions of the assistant over the same questions, scores each answer for the right section and for saying \"I don't know\" when it should, and writes a report on what improved and what got worse.",
  diagram: code`
    test_set.json: questions, the section each should cite, and which should be refused
      -> run version A over every question
      -> run version B over every question
      -> score each answer: right section? right refusal?
      -> compare: pass rate for each version, and the questions that changed
      -> report.md: what improved, what got worse, and whether the difference is real
  `,
  lessons: ['evaluating-ai-responses', 'ai-observability', 'hallucinations', 'data-and-evaluation', 'probability-and-statistics'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'The document assistant from the knowledge-assistant project', 'A simple text editor for the report'],
  time: 'about 5 hours',
  requirements: [
    'A test set with at least 12 questions, some of which should be refused',
    'A scoring rule that is written down before any version is run, and applied the same way to every answer',
    'A comparison of two versions on the same questions, with both pass rates',
    'A report that lists each question whose result changed, and why',
    'A note on whether the difference is large enough to trust with this few questions',
  ],
  milestones: [
    {
      title: 'Write the test set',
      goal: 'Create questions with the section each should cite, and mark the questions that should be refused.',
      hints: [
        'Write questions the way a real reader would ask them, including some that use different words.',
        'Include at least four questions the documents cannot answer, and write each one down as "refuse".',
      ],
      checkpoint: 'The test set has at least 12 questions, with a clear expected result for each one, saved in a file.',
    },
    {
      title: 'Define the scoring rule',
      goal: 'Write one scoring function that gives each answer a pass or a fail, and use it for every version.',
      hints: [
        'Write the rule before you run any version, so you cannot change it to fit the results.',
        'A refusal passes only when the expected result is a refusal. A citation passes only when it names the expected section.',
      ],
      code: {
        language: 'python',
        filename: 'scoring.py',
        code: code`
          NOT_FOUND = "I don't know in the documents."

          def score(answer_text, cited_id, expected):
              if expected is None:
                  return answer_text == NOT_FOUND
              return cited_id == expected

          print(score("See section [1]...", 1, 1))
          print(score(NOT_FOUND, None, None))
          print(score("See section [2]...", 2, 1))
        `,
        output: 'True\nTrue\nFalse',
      },
      checkpoint: 'The three checks print True, True and False.',
    },
    {
      title: 'Run two versions on the same questions',
      goal: 'Run version A and version B over the whole test set, and save every answer with its citation.',
      hints: [
        'Make version B a real change, such as a different threshold or a different word list, so the comparison means something.',
        'Use the same test set for both versions, and do not edit the test set between runs.',
      ],
      checkpoint: 'Both versions run over all questions, and you have a pass count for each one.',
    },
    {
      title: 'Read the changes, not only the totals',
      goal: 'List the questions whose result changed between the two versions, and say why each one changed.',
      hints: [
        'A change in the total can hide one question that got better and another that got worse, so compare question by question.',
        'Read the saved answer for each changed question before you explain it.',
      ],
      checkpoint: 'The report lists every changed question, and says which version handled it better.',
    },
    {
      title: 'Write the report and judge the size of the change',
      goal: 'Write a short report with both pass rates, the changed questions, and whether the difference is large enough to trust.',
      hints: [
        'With about a dozen questions, a difference of one or two is noise. Say so in the report.',
        'Name the next fix you would test, and keep the report next to the test set, so the next version can be compared with it.',
      ],
      checkpoint: 'report.md states both pass rates, lists every changed question, and says whether the difference is meaningful.',
    },
  ],
  finishedMeans: [
    'The test set has at least 12 questions, including refusals, and it is saved in a file',
    'The scoring rule is written down before any version is run',
    'Both versions run on the same questions, and the report lists each changed question',
    'The report judges whether the difference is large enough to trust',
    'The project runs from a fresh clone, with the test set included',
  ],
  readmeTemplate: code`
    # [Project name]: evaluating the document assistant

    [One sentence: what was compared, and on how many questions.]

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
  writeUpPrompts: [
    'The problem: why an AI change needs a test before anyone trusts it.',
    'One decision you made about the scoring rule, and why you wrote it before running the versions.',
    'One question that changed, and what it taught you.',
    'Whether your difference was large enough to trust, and what would make the test stronger.',
  ],
  demoGuidance: 'Record the report being produced: the two pass rates, then one changed question and what it showed. Keep it under 60 seconds. Free tools include the screen recorder built into macOS and Windows, OBS Studio, and ScreenToGif on Windows. Save it as demo.gif and link it from the README.',
  interviewGuidance: "Describe how you judged the change, not only its result. For example: 'I wrote the scoring rule before running either version, and I said the difference was too small to trust with twelve questions.' Interviewers look for that honesty about evidence.",
  stretchGoals: [
    'Grow the test set to at least 50 questions, and compare the results again',
    'Add a second scoring rule that checks whether each answer uses only the cited text',
    'Track the pass rate over several versions in a chart',
  ],
}

export default plan
