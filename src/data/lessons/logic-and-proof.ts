import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Build a truth table for and, or, and not, and read what it shows',
    'Tell a claim from its converse, and see why they can differ',
    'Write a short proof by contradiction and a direct proof',
  ],
  bigIdea: 'Mathematics runs on statements that are either true or false, and on rules for combining them. A proof is a chain of statements, each one following from earlier ones or from accepted facts, that ends at the claim you wanted to establish. A counterexample is enough to show that a general claim is false.',
  whyItMatters: 'A website says that every user who pays also has an account. A support agent checks one paying user who has no account, and the claim is false. The agent does not need to check every user to know that. Logic tells you when a single case settles a question, and when a claim needs a proof that covers every case. Knowing which kind of question you have saves time and prevents overconfident conclusions. A single case that breaks the rule is more convincing than a long argument that hides a gap.',
  goalSections: [
    {
      heading: 'Truth tables for and, or, and not',
      paragraphs: [
        'A truth table lists every combination of true and false inputs and the result of a statement for each one. For and, the result is true only when both parts are true. For or, the result is true when at least one part is true. For not, the result flips the value. Read the table row by row, and name each row in words before you trust the final column.',
        'Truth tables work for any statement with a fixed number of parts. Two inputs give four rows, and three inputs give eight. Building the table is slow but certain, which makes it a good check on a claim you are unsure about. Keep the table small by naming the parts with letters, and write the result column last, so the whole table fits on one line of notes.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'truth_table.py',
        code: code`
          for p in (True, False):
              for q in (True, False):
                  print(p, q, p and q, p or q)
        `,
        output: 'True True True True\nTrue False False True\nFalse True False True\nFalse False False False',
      },
    },
    {
      heading: 'A claim and its converse',
      paragraphs: [
        'The converse of "if A then B" is "if B then A." The two can have different truth values. "If a number is 4, it is even" is true, but its converse, "if a number is even, it is 4," is false, because 6 is even.',
        'When you read a claim, name its parts first. Then check whether the claim goes in one direction only. Many mistakes in arguments come from assuming a converse is automatically true. Ask whether the claim would still hold if the parts were swapped, and if you cannot say why, test it with an example.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Claim:      if a number is 4, then it is even     true
          Converse:   if a number is even, then it is 4     false (6 is even but not 4)
          Counter:    the number 6 shows the converse fails
        `,
      },
    },
    {
      heading: 'Proofs by contradiction and by direct argument',
      paragraphs: [
        'A direct proof starts from what you know and moves step by step to the claim. A proof by contradiction assumes the claim is false and shows that this leads to something impossible. Both are valid, and the choice depends on which path is clearer. Most textbook proofs by contradiction could be rewritten directly, so choose the one that a reader can follow with the least effort.',
        'Write each step with its reason next to it. A step with no reason is the most common place for an error to hide, so ask of every line which earlier fact or rule it uses.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Claim: the square root of 2 is not a fraction.
          Assume it is p/q in lowest terms.
          Then 2 q^2 = p^2, so p is even. Write p = 2k.
          Then q^2 = 2 k^2, so q is even too.
          Both are even, which contradicts lowest terms. So the claim holds.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a claim with a truth table',
    intro: 'This table checks the statement "not (p and q)" against "(not p) or (not q)." If the two columns always match, the statements are equivalent. Run it, and compare the last two columns in every row.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'de_morgan.py',
      code: code`
        for p in (True, False):
            for q in (True, False):
                left = not (p and q)
                right = (not p) or (not q)
                print(p, q, left, right, left == right)
      `,
      output: 'True True False False True\nTrue False True True True\nFalse True True True True\nFalse False True True True',
    },
    steps: [
      { code: 'for p in (True, False):', explanation: 'Runs the check for every value of the first input.' },
      { code: 'left = not (p and q)', explanation: 'The first statement. It is false only when both inputs are true.' },
      { code: 'right = (not p) or (not q)', explanation: 'The second statement, written differently. It is also false only when both inputs are true.' },
      { code: 'print(p, q, left, right, left == right)', explanation: 'Prints a row for each case. The last column is True in every row, so the statements always agree. This pattern is De Morgan\'s law.' },
    ],
  },
  tryIt: {
    instructions: [
      'Build a truth table for "p or not q" with two inputs, and predict each row before you run it.',
      'Write the converse of "if it rains, the ground is wet," and give a case that shows the converse can fail.',
      'Prove that the sum of two even numbers is even, with a direct argument, and write the reason next to each step.',
    ],
  },
  mistakes: [
    { mistake: 'Believing a converse is true because the original claim is true.', fix: 'Write the converse explicitly and test it with a specific case.' },
    { mistake: 'Using one example to prove a general claim.', fix: 'One example can disprove a general claim. Proving it true needs an argument that covers every case.' },
    { mistake: 'Writing proof steps without a reason.', fix: 'Attach a reason to each line: a definition, an earlier step, or an accepted rule.' },
  ],
  quiz: [
    {
      question: 'What is the result of "p and q" when p is True and q is False?',
      options: [
        { text: 'False', explanation: 'Yes. and requires both parts to be true, and q is false.' },
        { text: 'True', explanation: 'and is true only when both parts are true.' },
        { text: 'It cannot be decided', explanation: 'A truth table gives a definite value for every combination of inputs.' },
        { text: 'Both True and False', explanation: 'A statement has one truth value for each combination of inputs.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for one row of the table, with p True and q False?',
      code: { language: 'python', runnable: true, code: code`
        p = True
        q = False
        print(p, q, p or q)
      ` },
      options: [
        { text: 'True False True', explanation: 'Yes. In the second row, p is True and q is False, so or is True.' },
        { text: 'True False False', explanation: 'That is the result for and. This program uses or.' },
        { text: 'False True True', explanation: 'That is the third row, not the second.' },
        { text: 'An error', explanation: 'The loops and the print are valid, so the code runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'The claim "if n is a multiple of 4, then n is even" is true. Which statement is its converse?',
      options: [
        { text: 'If n is even, then n is a multiple of 4', explanation: 'Yes. Swapping the two parts gives the converse, which is false because 6 is even but not a multiple of 4.' },
        { text: 'If n is not a multiple of 4, then n is odd', explanation: 'That is the inverse, not the converse.' },
        { text: 'If n is odd, then n is not a multiple of 4', explanation: 'That is the contrapositive of the original claim, not its converse.' },
        { text: 'n is a multiple of 4', explanation: 'That is not an if-then statement, so it is not a converse.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A truth table settles a claim about a fixed number of inputs, a counterexample disproves a general claim, and a proof must cover every case with a reason for each step.',
  resources: [
    { title: 'Mathematical proof', provider: 'Wikipedia', description: 'What a proof is, and the common methods used to establish one.', url: 'https://en.wikipedia.org/wiki/Mathematical_proof' },
    { title: 'Mathematical Reasoning', provider: 'Khan Academy', description: 'Practice logic, truth values, and writing arguments with clear steps.', url: 'https://www.khanacademy.org/math/geometry' },
  ],
}

export default lesson
