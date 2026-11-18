import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why an AI system can be wrong while sounding confident',
    'Name the common kinds of AI mistakes: wrong facts, biased results, and failures on unusual inputs',
    'Choose checks that catch mistakes before they reach a person who depends on the answer',
  ],
  bigIdea: 'AI systems produce the most likely output given their training, not a verified truth. That is why they can state a wrong fact in the same calm tone as a right one, and why they can fail on inputs unlike anything in their training. Good use means knowing where the system is weak and checking its answers where the stakes are high.',
  whyItMatters: 'A student asks an AI assistant for the source of a quote, and the assistant gives a convincing author, title, and page number. The book does not contain the quote. A teacher who trusts the citation without checking can pass a false claim to a class. Knowing why this happens is the first step to using AI safely in study and work.',
  goalSections: [
    {
      heading: 'Confident is not the same as correct',
      paragraphs: [
        'A language model is trained to continue text in a way that fits what it has read. When it answers a question, it picks words that are likely to follow. Likely and true often overlap, but they are not the same thing. A plausible answer can be wrong, and the model does not feel doubt the way a person does.',
        'This failure is often called a hallucination. The model invents a name, a number, a date, or a source that sounds right. The invented detail is written with the same fluency as a correct one, so the reader has to check it against something outside the model.',
        'The lesson is not that AI is useless. It is that the output is a draft to be verified. Treat any specific fact, number, quote, or citation as unconfirmed until you have found it in a source you trust.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          known_sources = {"Dune": "Frank Herbert", "Emma": "Jane Austen"}
          claims = [("Dune", "Frank Herbert"), ("Emma", "Charles Dickens")]
          for book, author in claims:
              status = "matches" if known_sources.get(book) == author else "does not match"
              print(book, "claim", status, "the source")
        `,
        output: 'Dune claim matches the source\nEmma claim does not match the source',
      },
    },
    {
      heading: 'Bias and unfamiliar inputs',
      paragraphs: [
        'A model learns from its training data, so it inherits the gaps and skews in that data. If most of the training examples describe one group, the model may do well for that group and poorly for others. The mistake is not random. It follows the pattern of what was missing.',
        'Models also fail on inputs that look different from their training. A face recognizer trained on bright photos may struggle in dim light. A text model may misread slang, a new product name, or a dialect it saw rarely. The model usually gives no warning that it is outside its experience.',
        'Ask who the system was tested on, and whether those people or situations look like the people and situations you will serve. A system that works well on average can still fail badly for a small group that matters.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          training_photos = {"bright daylight": 900, "dim indoor": 40}
          total = sum(training_photos.values())
          for lighting, count in training_photos.items():
              share = count / total * 100
              print(lighting, round(share, 1), "% of training data")
        `,
        output: 'bright daylight 95.7 % of training data\ndim indoor 4.3 % of training data',
      },
    },
    {
      heading: 'Checks that catch mistakes',
      paragraphs: [
        'The most reliable check is a comparison against a source you trust. For facts, that means a book, a dataset, an official record, or a person with expertise. For calculations, it means running the numbers again by hand or with a tool that does not use AI.',
        'For systems that make decisions, keep a human review step where the cost of a mistake is high. Log the inputs and outputs so that errors can be found later. Test on a set of cases that includes unusual examples, not only the easy ones.',
        'Set a clear threshold for when a person must check the result. A spelling suggestion can be accepted quickly. A medical, legal, or financial answer needs a review before anyone acts on it.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Fact check: find the passage in a book or record you trust, and read it yourself.
          Math check: redo the calculation by hand, or with a tool that does not use AI.
          Decision check: a person reviews any output that affects money, health, or someone's rights.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a claim against a source',
    intro: 'The program below compares claims from an AI answer with a list of sources you trust. A claim that does not match is not proof the AI is wrong, but it tells you where to look first. Run it, then add a claim of your own and predict the result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        trusted = {"Emma": "Jane Austen", "Dune": "Frank Herbert"}
        ai_claims = {"Emma": "Jane Austen", "Dune": "Frank Herbert", "Hamlet": "Mark Twain"}

        for title, claimed in ai_claims.items():
            if title not in trusted:
                print(title, "- no trusted source yet, check manually")
            elif trusted[title] == claimed:
                print(title, "- confirmed")
            else:
                print(title, "- contradicts a trusted source")
      `,
      output: 'Emma - confirmed\nDune - confirmed\nHamlet - no trusted source yet, check manually',
    },
    steps: [
      { code: 'trusted = {...}', explanation: 'The sources you trust. In real work, these would be books, records, or experts.' },
      { code: 'if title not in trusted:', explanation: 'A claim with no source is not confirmed. The program says so instead of guessing.' },
      { code: 'elif trusted[title] == claimed:', explanation: 'A claim that matches a trusted source is confirmed, but only for that one fact.' },
      { code: 'else:', explanation: 'A claim that conflicts with a trusted source is flagged for correction.' },
    ],
  },
  tryIt: {
    instructions: [
      'Ask an AI assistant for three specific facts on a topic you know well. Check each against a source, and record which were correct.',
      'Think of one AI tool you use. Write down a situation where its mistake would matter, and the check you would use.',
      'Write a one-paragraph rule for your team or family about when AI answers must be verified before they are used.',
    ],
  },
  mistakes: [
    { mistake: 'Trusting a citation because it has the right format.', fix: 'Find the source yourself and read the passage. Formats can be invented.' },
    { mistake: 'Believing a system that scored well on average is fair for everyone.', fix: 'Test on the groups and situations that matter, and look at results separately for each.' },
    { mistake: 'Using AI output directly in high-stakes decisions.', fix: 'Add a human review step, and set the threshold for review before the work starts.' },
  ],
  quiz: [
    {
      question: 'Why can an AI system state a false fact in a confident tone?',
      options: [
        { text: 'It always knows when it is lying', explanation: 'A model does not check its own claims against the world, so it cannot know this.' },
        { text: 'It produces likely words, and likely does not always mean true', explanation: 'Yes. The output is shaped by training patterns, so a fluent wrong answer is possible.' },
        { text: 'It was trained only on fiction', explanation: 'Training data varies by system, but fiction alone does not explain this failure.' },
        { text: 'It cannot write sentences that sound confident', explanation: 'Fluent sentences are exactly what these systems produce well.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the second claim?',
      code: { language: 'python', runnable: true, code: code`
        known = {"Dune": "Frank Herbert"}
        claim = ("Dune", "Dan Brown")
        print(claim[0], "matches" if known.get(claim[0]) == claim[1] else "does not match")
      ` },
      options: [
        { text: 'Dune matches', explanation: 'The claimed author is not the author in the known source.' },
        { text: 'Dune does not match', explanation: 'Yes. The known author is Frank Herbert, not Dan Brown.' },
        { text: 'Dan Brown', explanation: 'The program prints the title and the match result, not the author.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why should a system that works well on average still be tested on specific groups?',
      options: [
        { text: 'Because averages can hide failures for groups that are rare in the data', explanation: 'Yes. A small group can fail badly while the overall score still looks good.' },
        { text: 'Because averages are always wrong', explanation: 'Averages are useful. They just do not show every group.' },
        { text: 'Because groups must be tested in alphabetical order', explanation: 'Order does not matter. The point is to measure each group separately.' },
        { text: 'Because testing only the average is against the law everywhere', explanation: 'Laws vary, but the reason for group testing is accuracy and fairness, not a general legal rule.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'AI output is a likely answer, not a verified one, so check specific facts against trusted sources, test on the cases that matter, and add human review where mistakes are costly.',
  resources: [
    { title: 'AI Risk Management Framework', provider: 'NIST', description: 'A free framework for identifying and managing risks in AI systems, including reliability and bias.', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
    { title: 'Responsible AI practices', provider: 'Google', description: 'Practical guidance on testing AI systems for failures and unfair outcomes.', url: 'https://ai.google/responsibility/responsible-ai-practices/' },
  ],
}

export default lesson
