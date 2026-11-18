import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the difference between training a model and using a trained model',
    'Describe what a model file contains and why it can be copied and reused',
    'Identify which stage a project needs time, data, and money for',
  ],
  bigIdea: 'Building an AI model happens in two stages. Training is the slow, expensive stage where the model adjusts itself to fit data, and inference, or using the model, is the fast stage where it makes predictions on new inputs. Most of the cost in a product comes from running the model, not from training it once.',
  whyItMatters: 'A startup wants to add a feature that reads receipts. If the team thinks every user action will retrain the model, it will plan for huge computing bills and long waits. Knowing that training happens once or rarely, and inference happens every time someone uses the feature, lets the team plan the budget, the speed, and the hardware correctly.',
  goalSections: [
    {
      heading: 'Training: learning from examples',
      paragraphs: [
        'Training is the process of showing a model many examples and adjusting its internal settings until its answers match the right answers as closely as possible. Each example nudges the settings a little. After enough examples, the settings capture patterns that let the model handle inputs it has never seen.',
        'Training needs data, time, and computing power. A small model on a laptop might train in minutes on a simple table of numbers. A large language model can take weeks on hundreds of specialized chips. The cost is paid once for that version of the model, and then the result is saved.',
        'Training also has to be checked. If a model does well on the examples it learned from but badly on new ones, it has memorized rather than learned. That is why good projects keep some data aside and test on it only after training is finished.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          # A tiny "training" loop: learn the rule y = 2 * x
          examples = [(1, 2), (2, 4), (3, 6)]
          weight = 0.0
          for _ in range(50):
              for x, y in examples:
                  error = weight * x - y
                  weight -= 0.01 * error * x
          print("learned weight:", round(weight, 2))
        `,
        output: 'learned weight: 2.0',
      },
    },
    {
      heading: 'Inference: using the trained model',
      paragraphs: [
        'Inference is what happens when the trained model receives a new input and produces an output. The settings are fixed at that point. Nothing is learned from the new input, so inference is usually much faster and cheaper than training.',
        'Inference costs add up because they repeat. A feature used by a million people, each doing ten actions a day, makes ten million inference calls a day. Teams measure the time each call takes, the memory it needs, and the price per call, because those numbers decide whether the product is affordable.',
        'Some systems run inference on the user\'s device, and others send the input to a server. A phone can run a small model without a network connection, but a large model usually needs a server with more memory. The choice affects speed, privacy, and cost.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          saved_weight = 2.0
          for x in [4, 5, 10]:
              print("input", x, "-> prediction", saved_weight * x)
        `,
        output: 'input 4 -> prediction 8.0\ninput 5 -> prediction 10.0\ninput 10 -> prediction 20.0',
      },
    },
    {
      heading: 'What a model file holds',
      paragraphs: [
        'After training, the model is saved as a file. That file holds the learned settings, sometimes called weights, and the structure that tells the software how to use them. Anyone with the file and the right software can run the model, which is why models can be shared, copied, and downloaded.',
        'A saved model is not the same as the data it was trained on. The file does not normally contain the original examples, but it can still reflect them. A model file should be treated as valuable, and its license and source should be checked before it is used in a product.',
        'Keeping track of which model file is in use matters. When a team updates a model, it should record the version, the data it was trained on, and the date. Without that record, a change in results cannot be explained later.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          model file: model.bin
          learned settings (weights): 2.0, -0.7, 1.3, and many more
          structure: 2 inputs, 3 hidden units, 1 output
          version: 1.4.0, trained on the March data set on 2026-03-02
          not inside: the original training examples
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Training once, then predicting many times',
    intro: 'The program below trains a simple rule once, saves the learned number, and then uses it many times without changing it. Notice that the prediction step never updates the weight. Run it, then change the number of predictions and see that the training cost stays the same.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        examples = [(1, 2), (2, 4), (3, 6)]
        weight = 0.0
        for _ in range(50):
            for x, y in examples:
                weight -= 0.01 * (weight * x - y) * x
        saved_weight = round(weight, 2)

        new_inputs = [4, 5, 10]
        predictions = [saved_weight * x for x in new_inputs]
        print("saved weight:", saved_weight)
        print("predictions:", predictions)
      `,
      output: 'saved weight: 2.0\npredictions: [8.0, 10.0, 20.0]',
    },
    steps: [
      { code: 'for _ in range(50): ...', explanation: 'Training is the slow loop. It runs once, and it changes the weight as it goes.' },
      { code: 'saved_weight = round(weight, 2)', explanation: 'The learned setting is saved as a fixed value. This is the part a model file would hold.' },
      { code: 'predictions = [saved_weight * x for x in new_inputs]', explanation: 'Inference. The saved weight is only read, never changed, so this step is quick and repeatable.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the loop count in the training example from 50 to 5, and predict whether the learned weight will be close to 2.0. Run it to check.',
      'List three AI features you use. For each, decide whether the model runs on your device or on a server, and write one reason.',
      'Write down the questions a team should answer before it saves a new model version, such as the data it used and the date it was trained.',
    ],
  },
  mistakes: [
    { mistake: 'Assuming every user action retrains the model.', fix: 'Most products train rarely and run inference on every request. Plan the budget around inference.' },
    { mistake: 'Judging a model only on the examples it learned from.', fix: 'Keep some data aside and test on it after training, so you see how the model handles new inputs.' },
    { mistake: 'Saving model files without a record of their version and data.', fix: 'Record the version, the training data, and the date with every saved model.' },
  ],
  quiz: [
    {
      question: 'Which stage changes the model\'s settings?',
      options: [
        { text: 'Training', explanation: 'Yes. Training adjusts the settings from examples.' },
        { text: 'Inference', explanation: 'Inference uses fixed settings to make predictions and does not change them.' },
        { text: 'Saving the file', explanation: 'Saving records the settings but does not change them.' },
        { text: 'Showing the output', explanation: 'Displaying a result does not change the model.' },
      ],
      answer: 0,
    },
    {
      question: 'Why does inference often cost more over time than training?',
      options: [
        { text: 'Because it runs on every request, and the calls add up', explanation: 'Yes. Training happens rarely, but inference repeats for every user action.' },
        { text: 'Because inference is always slower', explanation: 'Inference is usually faster per call. The total cost grows because it repeats.' },
        { text: 'Because the model forgets what it learned', explanation: 'A saved model keeps its settings during inference.' },
        { text: 'Because training is free', explanation: 'Training is often expensive. It is simply done less often.' },
      ],
      answer: 0,
    },
    {
      question: 'What does a model file usually hold?',
      options: [
        { text: 'The learned settings and the structure needed to use them', explanation: 'Yes. Those two parts are what a saved model needs to make predictions.' },
        { text: 'Every training example in full', explanation: 'A model file usually does not store the original examples, although it can reflect them.' },
        { text: 'A live connection to the internet', explanation: 'A model file is saved data. It does not keep a connection open.' },
        { text: 'A record of every user who has ever used it', explanation: 'A model file holds the model, not a history of users.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Training is the slow stage that learns settings from examples, and inference is the fast stage that uses those fixed settings, so most of a product\'s running cost comes from inference.',
  resources: [
    { title: 'Machine Learning Crash Course: Training and Loss', provider: 'Google', description: 'A free course introduction to how models learn from examples by reducing error.', url: 'https://developers.google.com/machine-learning/crash-course/' },
    { title: 'Model serving basics', provider: 'Hugging Face', description: 'How trained models are saved, shared, and run for predictions.', url: 'https://huggingface.co/docs' },
  ],
}

export default lesson
