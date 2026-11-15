import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Spot common data problems before a model is trained',
    'Split data into training, validation and test sets and say what each one is for',
    'Choose a success measure that matches the cost of each kind of mistake',
  ],
  bigIdea: "A model is only as good as the data it learns from, and you only know how good it is if you test it on data it has never seen. The way you score it must match what a mistake really costs. A model can score 99% and still be useless.",
  whyItMatters: "A team builds a model to spot fraudulent card payments and proudly reports 99% accuracy. Then someone notices that only 1 in 100 payments is fraud, so a model that says \"not fraud\" every single time also scores 99%, while catching zero fraud. Choosing the right data and the right score is what separates a model that works from one that only looks like it works.",
  goalSections: [
    {
      heading: 'Checking the data first',
      paragraphs: [
        "Before training, look at the data itself. Three problems cause most trouble. Wrong labels, where the recorded answer is incorrect, teach the model wrong answers. Duplicates, where the same example appears many times, make the model overvalue those cases. Gaps, where a whole kind of case is missing, leave the model guessing when that case shows up.",
        "A quick check catches a lot: count how many examples each answer has, read twenty random examples yourself, and ask who or what is missing. If 95% of your customer reviews are in English, the model will struggle with Spanish ones.",
      ],
      example: {
        language: 'text',
        code: code`
          Review                                 Label      Problem
          "Arrived broken, want a refund"        positive   wrong label
          "Great value, would buy again"         positive   fine
          "Great value, would buy again"         positive   duplicate
          "Llegó tarde y frío"                   negative   rare language,
                                                            only 12 like it
        `,
      },
    },
    {
      heading: 'Training, validation and test sets',
      paragraphs: [
        "If you test a student using the exact questions they practiced, a high score proves nothing. Models are the same. So you split your labeled data into three parts before you start.",
        "The training set, usually around 70% of the data, is what the model learns from. The validation set, around 15%, is used while you are still building, to compare versions and choose settings. The test set, the last 15%, is locked away and used once at the very end to get an honest score.",
        "The test set must stay untouched. If you keep tweaking the model until the test score looks good, you have quietly trained on it, and the score is no longer honest.",
      ],
      example: {
        language: 'text',
        code: code`
          10,000 labeled reviews
            7,000  training     the model learns from these
            1,500  validation   compare versions while building
            1,500  test         score once at the end, then report
        `,
      },
    },
    {
      heading: 'Picking a score that matches the cost of mistakes',
      paragraphs: [
        "Accuracy is the share of all guesses that were right. It is easy to understand but misleading when one answer is rare, as in the fraud case above.",
        "Two other scores help. Precision asks: of the cases the model flagged, how many were real? Recall asks: of all the real cases, how many did the model catch? A model that flags almost nothing can have high precision and terrible recall.",
        "Choose by asking which mistake hurts more. Missing a cancer on a scan is far worse than a false alarm that leads to a second test, so recall matters most. Wrongly blocking a customer's card is costly too, so a fraud team watches precision as well.",
      ],
      example: {
        language: 'text',
        code: code`
          1,000 payments, 10 of them are fraud. The model flags 8 payments.
          Of those 8, 6 really are fraud.

          Precision = 6 / 8  = 75%   (flagged payments that were fraud)
          Recall    = 6 / 10 = 60%   (fraud that got caught)
          Accuracy  = 994 / 1,000 = 99.4%  (looks great, hides the 4 missed)
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Scoring a model that screens job applications',
    intro: "A hiring tool reads 500 test applications and marks each one \"interview\" or \"reject\". Recruiters had already decided that 50 of them deserved an interview. Here is how you would evaluate the tool.",
    example: {
      language: 'text',
      code: code`
        Test set: 500 applications, 50 truly worth interviewing
        Model says "interview" for 40 applications
        Of those 40, 30 were truly worth interviewing

        Precision = 30 / 40 = 75%
        Recall    = 30 / 50 = 60%
        Missed    = 50 - 30 = 20 good candidates rejected
      `,
    },
    steps: [
      { code: 'Test set: 500 applications, 50 truly worth interviewing', explanation: "These applications were never used in training, and their right answers came from people. That is what makes the score honest." },
      { code: 'Model says "interview" for 40', explanation: "This is what the model actually did. Comparing it with the recruiters' answers is the whole point of testing." },
      { code: 'Precision = 30 / 40 = 75%', explanation: "Three out of four people it put forward were good choices. Recruiters would waste some time on the other 10, which is annoying but cheap." },
      { code: 'Recall = 30 / 50 = 60%', explanation: "It found only 60% of the good candidates. For hiring, this is the number that should worry you." },
      { code: 'Missed = 20 good candidates rejected', explanation: "These 20 people never get a chance, and nobody would notice without this test. Next you would look at who they are, in case the model is unfair to one group." },
    ],
  },
  mistakes: [
    { mistake: 'Reporting accuracy when one answer is much rarer than the other.', fix: 'Count how often each answer occurs first. If one is rare, report precision and recall instead.' },
    { mistake: 'Testing on data the model has already seen.', fix: 'Split the data before training and keep the test set locked until the end.' },
    { mistake: 'Training on data that is easy to collect instead of data that looks like real use.', fix: 'Compare your data with the situations the model will face, including the less common users and cases.' },
  ],
  quiz: [
    {
      question: 'You train a model on 8,000 examples and it scores 98% on those same 8,000. What does that tell you about real-world performance?',
      options: [
        { text: 'It will be about 98% accurate in real use', explanation: 'Scoring on seen examples is like marking a student on questions they practiced. It does not show how it handles new cases.' },
        { text: 'Very little, because it must be tested on examples it never saw', explanation: 'Only a held-out test set gives an honest estimate of how the model handles new cases.' },
        { text: 'It will be better than 98%, since real data is easier', explanation: 'Real data is usually messier than training data, not easier.' },
        { text: 'The model is broken, since nothing scores that high', explanation: 'A high score on training data is common. It is just not evidence about new data.' },
      ],
      answer: 1,
    },
    {
      question: 'A model screens X-rays for a serious disease. Missing a sick patient is much worse than a false alarm that leads to a second test. Which score matters most?',
      options: [
        { text: 'Accuracy', explanation: 'If the disease is rare, a model that says "healthy" every time scores high accuracy while missing every sick patient.' },
        { text: 'Precision', explanation: 'Precision protects against false alarms, which are the cheaper mistake here.' },
        { text: 'Recall', explanation: 'Recall measures how many sick patients the model catches, which is the mistake you most want to avoid.' },
        { text: 'The size of the training set', explanation: 'Size matters for learning, but it is not a measure of how well the model performs.' },
      ],
      answer: 2,
    },
    {
      question: 'Your team checks the test score after every change and keeps the changes that raise it. After 40 rounds the test score is excellent. What is the problem?',
      options: [
        { text: 'The team has tuned to the test set, so the score is no longer an honest estimate', explanation: 'Choosing changes by test score slowly fits the model to those specific examples. Use the validation set for tuning.' },
        { text: 'Forty rounds is too few to be confident', explanation: 'The number of rounds is not the issue. Using the test set to make choices is.' },
        { text: 'There is no problem, as long as the score went up', explanation: 'The score went up partly because the choices were made to fit those exact test examples.' },
        { text: 'The training set should have been used for scoring instead', explanation: 'Scoring on training data is even less honest than scoring on a reused test set.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Check your data, test only on examples the model has never seen, and score it in a way that reflects which mistakes actually hurt.',
  resources: [
    { title: 'Classification: accuracy, precision and recall', provider: 'Google for Developers', description: 'Interactive explanation of the scores used in this lesson.', url: 'https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall' },
    { title: 'Model evaluation', provider: 'scikit-learn', description: 'Reference for every common score, with Python code.', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
  ],
  underTheHood: {
    heading: 'The confusion matrix',
    paragraphs: [
      "Every score in this lesson comes from one small table called a confusion matrix. For a yes or no task, each test example lands in one of four boxes. True positive: the model said yes and the answer was yes. False positive: it said yes, but the answer was no. False negative: it said no, but the answer was yes. True negative: it said no and the answer was no.",
      "Precision is true positives divided by everything the model said yes to. Recall is true positives divided by everything that really was yes. Accuracy is the two true boxes divided by the total.",
      "Looking at the four raw counts is often more useful than any single score, because you can see exactly which kind of mistake the model makes and how often. Then you can ask what each box costs in money, time or harm to people.",
    ],
  },
}

export default lesson
