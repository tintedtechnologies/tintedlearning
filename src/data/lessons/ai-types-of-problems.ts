import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Tell apart classification, regression, and clustering problems',
    'Decide which type of problem a real question describes',
    'Recognize when a problem does not need machine learning at all',
  ],
  bigIdea: 'Most machine learning problems fall into a few families. Classification predicts a category, regression predicts a number, and clustering finds groups when no answers are given in advance. Naming the family first tells you what data you need and how to judge the result.',
  whyItMatters: 'A bank wants to know whether a card payment is fraud, how much a house will sell for, and which customers behave alike. Those are three different questions, and each needs a different kind of model and a different way to measure success. A team that mixes them up can spend months on a model that answers the wrong question.',
  goalSections: [
    {
      heading: 'Classification: which category?',
      paragraphs: [
        'A classification problem asks the model to choose one category from a fixed list. Is this email spam or not spam? Is this photo a cat, a dog, or a bird? The output is a label, and the labels are known before the model starts learning.',
        'Classification is the most common family in everyday AI. Spam filters, medical screening tools, and language detection all use it. The training data contains examples that already have the right label, so the model can learn which features point to each category.',
        'A useful check is to ask whether the answer could be written as a choice from a short list. If yes, you probably have a classification problem. The list does not have to be short, but it has to be fixed.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          emails = [
              {"words": 3, "has_link": True, "label": "spam"},
              {"words": 120, "has_link": False, "label": "not spam"},
          ]
          for email in emails:
              guess = "spam" if email["has_link"] and email["words"] < 10 else "not spam"
              print(guess, "| correct:", email["label"])
        `,
        output: 'spam | correct: spam\nnot spam | correct: not spam',
      },
    },
    {
      heading: 'Regression: how much or how many?',
      paragraphs: [
        'A regression problem asks for a number on a continuous scale. How many units will sell next month? What temperature will it be tomorrow? How long will a delivery take? The answer is not a label from a list. It can be any value within a range.',
        'Regression models learn a relationship between inputs and a number. A house price model might learn that each extra bedroom adds a certain amount, and that a longer commute lowers the price. The learned relationship then gives an estimate for a house the model has not seen.',
        'Be careful with the word "predict". Both classification and regression predict, but the output differs. If the answer is a count or an amount, think regression. If the answer is a name for a group, think classification.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          # Two past sales days: how many ice creams sold at each temperature
          temperatures = [20, 30]
          sales = [40, 80]
          slope = (sales[1] - sales[0]) / (temperatures[1] - temperatures[0])
          tomorrow = 25
          estimate = sales[0] + slope * (tomorrow - temperatures[0])
          print("estimated sales:", estimate)
        `,
        output: 'estimated sales: 60.0',
      },
    },
    {
      heading: 'Clustering, and choosing the simplest tool',
      paragraphs: [
        'Clustering starts with data that has no labels. Nobody has said which customers are "bargain hunters" or which songs are "calm". The model looks for points that sit close together and groups them, and then a person decides what each group means.',
        'Shops use clustering to find customer types, and researchers use it to find patterns in experiments. Because no correct answer is provided, the result must be checked by a person. A cluster is a hypothesis about the data, not a fact.',
        'When you cannot say what the right answers are, and you want to see structure in the data, clustering is a good first step. It often leads to a classification problem later, once the groups have names.',
        'Some problems have clear rules that a person can write down. If a discount applies to orders over fifty dollars, an if statement does the job more reliably than a model. Machine learning is useful when the rules are too complicated or too hidden to write by hand.',
        'Choosing the simpler tool is a sign of good judgment. A model adds cost, needs data, and can make mistakes that are harder to explain. Start by asking whether a few clear rules would solve the problem, and move to learning only when they would not.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          visits = {"Ana": 2, "Ben": 3, "Cy": 30, "Dee": 28}
          groups = {"regular": [], "occasional": []}
          for name, count in visits.items():
              key = "regular" if count >= 10 else "occasional"
              groups[key].append(name)
          print(groups)
        `,
        output: '{\'regular\': [\'Cy\', \'Dee\'], \'occasional\': [\'Ana\', \'Ben\']}',
      },
    },
  ],
  seeItInAction: {
    title: 'Sorting questions into problem types',
    intro: 'Read each question and decide which family it belongs to. The program below checks three answers against a short list, so you can see the difference between a label and a number. Run it, then change one question and predict the new type before you check it.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        questions = {
            "Is this transaction fraud?": "classification",
            "What will the house sell for?": "regression",
            "Which customers buy the same things?": "clustering",
        }
        for question, kind in questions.items():
            print(kind.ljust(15), question)
      `,
        output: 'classification  Is this transaction fraud?\nregression      What will the house sell for?\nclustering      Which customers buy the same things?',
    },
    steps: [
      { code: 'questions = {...}', explanation: 'Each question is paired with the problem family that fits it, so the match is written down rather than remembered.' },
      { code: 'for question, kind in questions.items():', explanation: 'Goes through the pairs one at a time, so each question gets the same treatment.' },
      { code: 'print(kind.ljust(15), question)', explanation: 'Pads the family name to a fixed width so the answers line up in columns.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write three questions from your work or your hobbies. For each one, name the problem family and explain in one sentence why.',
      'Find one question that does not need machine learning. Write the rule a person could follow instead.',
      'Take a question you labeled as clustering, and describe the label you would give each group once you see it.',
    ],
  },
  mistakes: [
    { mistake: 'Calling any prediction a classification problem.', fix: 'Ask whether the answer is a category from a fixed list or a number on a scale.' },
    { mistake: 'Using clustering when you already have labeled examples.', fix: 'If the right answers are known, a classification or regression model learns from them more directly.' },
    { mistake: 'Reaching for machine learning before trying simple rules.', fix: 'Write the rules first. Use learning only when the rules are too hard to write by hand.' },
  ],
  quiz: [
    {
      question: 'Which problem type does "Will this loan be repaid, yes or no?" describe?',
      options: [
        { text: 'Regression', explanation: 'Regression predicts a number. A yes or no answer is a category.' },
        { text: 'Clustering', explanation: 'Clustering groups data without answers. This question has a known set of answers.' },
        { text: 'Classification', explanation: 'Yes. The answer is one category from a fixed list, yes or no.' },
        { text: 'No machine learning is possible', explanation: 'Machine learning can handle this problem when there are examples to learn from.' },
      ],
      answer: 2,
    },
    {
      question: 'A café wants to know how many coffees it will sell tomorrow. What kind of problem is this?',
      options: [
        { text: 'Classification', explanation: 'The answer is a count, not a category.' },
        { text: 'Regression', explanation: 'Yes. A count on a continuous scale is a regression problem.' },
        { text: 'Clustering', explanation: 'Clustering finds groups. This asks for a number.' },
        { text: 'Reinforcement learning', explanation: 'That is a different kind of learning, about rewards over time, and this question does not describe it.' },
      ],
      answer: 1,
    },
    {
      question: 'Why is clustering checked by a person?',
      options: [
        { text: 'Because the computer cannot count', explanation: 'Counting is not the issue. The groups have no labels that prove they are right.' },
        { text: 'Because the groups it finds are hypotheses that need meaning and checking', explanation: 'Yes. Without known answers, a person decides whether the groups make sense and what they mean.' },
        { text: 'Because clustering always produces errors', explanation: 'Clustering is not always wrong. The point is that its groups need interpretation.' },
        { text: 'Because the data must be printed first', explanation: 'Printing is not part of the reason. The check is about meaning.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Classification predicts a category, regression predicts a number, and clustering finds groups without answers, and naming the family first tells you what data you need and how to judge the result.',
  resources: [
    { title: 'Machine Learning Crash Course: Framing', provider: 'Google', description: 'A free course module on framing a problem as classification, regression, or clustering.', url: 'https://developers.google.com/machine-learning/crash-course/framing/ml-terminology' },
    { title: 'Supervised and unsupervised learning', provider: 'scikit-learn', description: 'The scikit-learn guide to the main families of learning problems, with examples.', url: 'https://scikit-learn.org/stable/supervised_learning.html' },
  ],
}

export default lesson
