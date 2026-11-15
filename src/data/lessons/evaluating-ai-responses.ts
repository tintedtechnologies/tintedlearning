import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Judge a single AI answer with four checks: correct, complete, sourced and safe',
    'Build a small test set of inputs with the results you expect',
    'Score two versions of a prompt on the same test set and choose between them',
  ],
  bigIdea: "Evaluating an AI response means deciding on purpose whether it is good enough to use, instead of going by how polished it sounds. For a single answer, four checks catch most problems: is it correct, complete, sourced and safe? For anything you will use again and again, such as a prompt inside an app, you score it on a small, fixed set of test inputs, so you can tell whether a change made it better or worse.",
  whyItMatters: "You tweak Study Tracker's weekly summary prompt to sound friendlier. The three replies you look at seem great, so you ship it. A week later a learner reports that their summary claimed over 200 minutes when they logged 165. The friendlier wording had nudged the model to round up generously. A five-case test, run before and after the change, would have caught it in two minutes.",
  goalSections: [
    {
      heading: 'Four checks for one answer',
      paragraphs: [
        "Correct: are the facts, numbers, names and code actually right? Check the risky parts against a trusted source, or run the code. Complete: does it answer every part of the question and follow every instruction, such as a word limit or a requested format?",
        "Sourced: can you trace where each claim came from, such as your own document or a link you opened yourself? Safe: is it free of harmful advice, private information and unfair assumptions about people, and suitable for whoever will read it?",
        "Not every check matters for every task. A birthday poem needs no sources. A medical or money question needs all four. Decide which checks matter before reading the answer, so a confident tone does not make the decision for you.",
      ],
      example: {
        language: 'text',
        code: code`
          Question: How many minutes of biology did I study this week,
                    and which day was the longest?
          Notes:    Mon biology 30, Wed biology 45, Fri biology 20
          Answer:   "You studied 95 minutes of biology this week."

          Correct   yes: 30 + 45 + 20 = 95
          Complete  no: it never says which day was longest (Wednesday)
          Sourced   yes: it comes from the notes provided
          Safe      yes
        `,
      },
    },
    {
      heading: 'A small test set',
      paragraphs: [
        "A test set is a list of realistic inputs, each with what a good result must be. Write the expected results before you look at any outputs, so you are not grading on a curve. Ten to twenty cases is plenty to start.",
        "Expected results can be exact, such as \"algebra | 40\", or a few rules, such as \"states the total correctly, names the top subject, under 50 words\". Rules work better for free-form text, where many wordings are fine.",
        "Cover typical inputs, edge cases such as an empty week or a very long one, unusual phrasing, and cases where the right answer is to decline or say \"I don't know\". Keep the set in a file, and every time a real user hits a problem, add it as a new case.",
      ],
      example: {
        language: 'text',
        code: code`
          Weekly summary test set
          Input                          A good summary must...
          algebra 120, biology 45        say 165 minutes, name algebra, be under 50 words
          python 30                      say 30 minutes, name python
          no sessions                    suggest a 15-minute session, give no praise
          8 subjects, 10 minutes each    say 80 minutes, stay under 50 words
          history 600                    say 600 minutes or 10 hours, name history
        `,
      },
    },
    {
      heading: 'Comparing two versions',
      paragraphs: [
        "To compare two prompts, run both on every case in the test set and mark each rule pass or fail. Use a fresh conversation for each run, so earlier cases do not influence later ones.",
        "Then read the failures, not just the totals. One invented number can matter more than three slightly long replies. A version that scores higher but introduces a serious new failure is not better.",
        "For qualities that are hard to check with rules, such as tone, teams sometimes ask a second model to grade the replies. That can save time, but grade a sample yourself first and confirm the model grader agrees with you before trusting it.",
      ],
      example: {
        language: 'text',
        code: code`
                                 Version A        Version B
          Rule checks passed     10 of 11         9 of 11
          Failures               one reply too    two wrong
                                 long             totals
          Most serious failure   minor            invented numbers
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Testing a friendlier summary prompt',
    intro: "Here is the comparison from Why it matters, run on the five-case test set above. Version A is the prompt from Prompt Engineering. Version B adds \"Be warm and celebrate the learner's effort.\" The replies were typical ones.",
    example: {
      language: 'text',
      code: code`
        Case                         Version A                  Version B (friendlier)
        1. algebra 120, biology 45   pass                       fail: "over 200 minutes"
        2. python 30                 pass                       pass
        3. no sessions               pass                       pass
        4. 8 subjects x 10 minutes   fail: 63 words             pass
        5. history 600               pass                       fail: "nearly 12 hours"

        Cases passed                 4 of 5                     3 of 5

        Version C: A's rules + B's warm opening + "keep to 50 words, even with
                   many subjects"
        Cases passed                 5 of 5, three runs each
      `,
    },
    steps: [
      { code: 'Version B adds "Be warm and celebrate the learner\'s effort."', explanation: "One sentence changed. It is easy to assume a small wording change only affects tone, which is exactly why it needs testing." },
      { code: '1. ... fail: "over 200 minutes"', explanation: "Asked to celebrate, the model inflated the total. The rule \"say 165 minutes\" catches it instantly. Reading the reply alone, it sounded lovely." },
      { code: '5. ... fail: "nearly 12 hours"', explanation: "The same failure on a different input. Two wrong totals in five cases is a pattern, not bad luck." },
      { code: '4. ... fail: 63 words', explanation: "Version A has its own weakness: with many subjects, it runs long. The test set shows both versions' problems side by side." },
      { code: 'Version C', explanation: "Often the answer is neither A nor B but a mix: keep what each does well, and add a rule for the failure you found." },
      { code: '5 of 5, three runs each', explanation: "Replies vary between runs, so each case was run three times and had to pass every time. Under the hood explains why one run is not enough." },
    ],
  },
  tryIt: {
    instructions: [
      'Take the weekly summary prompt from Prompt Engineering, or your own. Write a test set of 5 cases with the rules a good reply must meet, before running anything.',
      'Write a second version of the prompt with one change, such as a different tone or format.',
      'Run both versions on all 5 cases, each in a fresh chat, and mark every rule pass or fail. Read the failures and decide which version to keep, or write a third that combines them.',
    ],
    evidencePrompt: {
      label: 'Your results',
      placeholder: 'For example: Version A passed 4 of 5 and Version B passed 5 of 5, but B invented a daily average in case 2, so I kept A and added B\'s format.',
    },
  },
  mistakes: [
    { mistake: 'Judging an answer by how confident or polished it sounds.', fix: 'Decide which checks matter, then check correctness, completeness, sources and safety on purpose.' },
    { mistake: 'Testing only on the examples you used while writing the prompt.', fix: 'Write new and tricky cases, including edge cases, and set the expected results before seeing any outputs.' },
    { mistake: 'Looking only at the total score.', fix: 'Read every failure. One invented number can matter more than several minor slips.' },
    { mistake: 'Running each case once when replies vary.', fix: 'Run important cases several times in fresh chats, and treat any failure as real.' },
  ],
  quiz: [
    {
      question: 'Asked "How many minutes of biology did I study this week, and on which day the most?", an AI replies "You studied 95 minutes of biology." The number is right. Which check does it fail?',
      options: [
        { text: 'Correct', explanation: 'The number it gave is right, so it passes this check.' },
        { text: 'Complete', explanation: 'The question had two parts, and the answer skipped the second one.' },
        { text: 'Sourced', explanation: 'The total comes from the learner\'s own notes, so it can be traced.' },
        { text: 'Safe', explanation: 'Nothing in the answer is harmful or private.' },
      ],
      answer: 1,
    },
    {
      question: 'After a prompt change, your app passes 8 of 10 test cases, up from 7. What should you do before switching to the new version?',
      options: [
        { text: 'Switch straight away, because 8 is higher than 7', explanation: 'A higher score can hide a new, more serious failure.' },
        { text: 'Rerun only the cases that failed before', explanation: 'A change can break cases that used to pass, so all of them need rerunning.' },
        { text: 'Read the failures of both versions and check whether any new failure is serious', explanation: 'Totals do not show severity. Reading the failures does.' },
        { text: 'Ask the model which version it prefers', explanation: 'The model\'s opinion is not evidence about your test cases.' },
      ],
      answer: 2,
    },
    {
      question: 'Your test set for Study Tracker\'s assistant has six typical questions. Which new case adds the most value?',
      options: [
        { text: '"How much did I study on Sunday?" for a Sunday with no sessions, expecting it to say there were none', explanation: 'An edge case where the right answer is "none" tests whether the model invents data, a high-risk failure.' },
        { text: 'Another typical question, the same as the first but with a different subject', explanation: 'It mostly repeats what the set already covers.' },
        { text: 'A question with no expected result written down', explanation: 'Without an expected result, there is nothing to score it against.' },
        { text: 'The question you used while writing the prompt', explanation: 'It almost certainly passes already, so it tells you little.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Judge single answers by whether they are correct, complete, sourced and safe, and judge prompts by running them on a fixed test set and reading every failure before you change what users see.',
  resources: [
    { title: 'Your AI Product Needs Evals', provider: 'Hamel Husain', description: 'A practical essay on building test sets and reading failures for real AI products.', url: 'https://hamel.dev/blog/posts/evals/' },
    { title: 'Define success criteria and build evaluations', provider: 'Claude Docs', description: 'One provider\'s guide to writing test cases and grading model output.', url: 'https://docs.claude.com/en/docs/test-and-evaluate/develop-tests' },
    { title: 'LLM evaluation guidebook', provider: 'Hugging Face', description: 'A free guide to how language models and their outputs are evaluated.', url: 'https://github.com/huggingface/evaluation-guidebook' },
  ],
  underTheHood: {
    heading: 'Why you run each case more than once',
    paragraphs: [
      "Because replies vary between runs, a single pass tells you less than it seems. Suppose a prompt fails a particular case one time in five. A single run passes 80% of the time, so you will most likely see a pass and move on.",
      "Run the case three times and the chance that all three pass is 0.8 x 0.8 x 0.8, about 51%. So you have roughly an even chance of spotting the problem. Run it ten times and the chance of ten straight passes drops to 0.8 multiplied by itself ten times, about 11%, so you would catch the failure about 89% of the time.",
      "That is why serious evaluations report pass rates, such as 9 of 10, rather than a single pass or fail, and why the most important cases get the most runs. Lowering the temperature reduces variation, but test at the same temperature your app will use, or the results will not match what users see.",
    ],
  },
}

export default lesson
