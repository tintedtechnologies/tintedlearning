import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Work out the output of a single artificial neuron by hand',
    'Describe how neurons connect in layers to form a network',
    'Explain how training adjusts weights after a wrong answer',
  ],
  bigIdea: "A neural network is a model built from many tiny calculators called neurons. Each neuron multiplies its inputs by numbers called weights, adds them up and passes the result on. Training means adjusting those weights a little at a time, until the network's answers match the examples it learns from.",
  whyItMatters: "Chatbots, image generators and voice assistants all run on neural networks. When a news story says a model has billions of parameters, it means billions of weights like the three you will work with in this lesson. Once you have followed a few of them by hand, the big claims stop sounding like magic. You will know what the model actually is, a huge set of numbers tuned by examples, and why it can be confidently wrong.",
  goalSections: [
    {
      heading: 'One neuron, by hand',
      paragraphs: [
        "Imagine a neuron that guesses whether a student will pass tomorrow's quiz. It gets two inputs: hours studied and how many times they picked up their phone while studying.",
        "Each input has a weight. A positive weight pushes the answer toward yes, a negative weight pushes it toward no, and a bigger number pushes harder. The neuron multiplies each input by its weight and adds the results. Then it adds one more number, the bias, which acts as a starting nudge before any input is counted.",
        "Finally the neuron passes that total through a simple rule called an activation function. Here the rule is: if the total is above 0, answer pass, otherwise answer fail. That is the whole neuron: multiply, add, apply a rule.",
      ],
      example: {
        language: 'text',
        code: code`
          Inputs:   hours studied = 2      phone pickups = 5
          Weights:  0.8                    -0.3
          Bias:     0.5

          Total = 2 x 0.8  +  5 x (-0.3)  +  0.5
                = 1.6      -  1.5         +  0.5
                = 0.6

          Rule: 0.6 is above 0, so the answer is pass
        `,
      },
    },
    {
      heading: 'From neurons to layers',
      paragraphs: [
        "One neuron can only draw one simple dividing line between yes and no. Real problems need more, so neurons are arranged in layers. The input layer is just the raw numbers. Each neuron in the next layer, a hidden layer, takes every input and computes its own weighted total. The output layer takes the hidden layer's results and produces the final answer.",
        "Layers let a network build up ideas in stages. In a network that recognizes photos, early layers tend to respond to edges, middle layers to shapes such as eyes and wheels, and later layers to whole objects. Nobody programs those stages. They emerge from training.",
        "Every connection has its own weight, and every neuron after the input layer has its own bias. Together these are the network's parameters. A small network has a handful. A large language model has billions, but each one does the same job as the weights you met above. If you took the Math lesson Matrices and Linear Algebra, a whole layer's arithmetic is one matrix multiplication.",
      ],
      example: {
        language: 'text',
        code: code`
          Input layer        Hidden layer         Output layer
          2 numbers    ->    3 neurons      ->    1 neuron

          Weights:   2 inputs x 3 neurons = 6     3 x 1 = 3
          Biases:    one per hidden neuron = 3    1
          Parameters in total: 6 + 3 + 3 + 1 = 13
        `,
      },
    },
    {
      heading: 'Learning from mistakes',
      paragraphs: [
        "A new network starts with random weights, so its first guesses are poor. Training fixes that with a loop: show it an example, let it guess, compare the guess with the right answer, then nudge each weight in the direction that would have made the guess less wrong.",
        "The size of each nudge is set by the learning rate. Too large and the weights jump past good values. Too small and training takes forever. The example below uses 0.1 and the simplest possible rule: when the guess is too high, lower each weight by 0.1 times its input, and lower the bias by 0.1. This early rule is called the perceptron rule.",
        "Notice the trade-off at the end. The fixed neuron now says fail for the first student too, the one who studied 2 hours and had 5 phone pickups, and who was guessed as pass before. That is why training cycles through thousands of different examples, many times, so that a change helping one example does not quietly break others. Large networks choose each nudge with calculus, using gradients, which the Math lesson Calculus and Rates of Change explains.",
      ],
      example: {
        language: 'text',
        code: code`
          Example: studied 1 hour, 1 phone pickup, actually failed

          Round  Weights        Bias  Total  Guess
          1      0.8,  -0.3     0.5    1.0   pass  (wrong, so nudge down)
          2      0.7,  -0.4     0.4    0.7   pass  (wrong)
          3      0.6,  -0.5     0.3    0.4   pass  (wrong)
          4      0.5,  -0.6     0.2    0.1   pass  (wrong)
          5      0.4,  -0.7     0.1   -0.2   fail  (right, so stop)
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'One prediction through a small network',
    intro: "Here is a full network with 2 inputs, 3 hidden neurons and 1 output, already trained. To keep it readable, each hidden neuron has an easy meaning. The activation function here is the most common one, called ReLU, short for rectified linear unit: any negative total becomes 0, and anything else passes through unchanged.",
    example: {
      language: 'text',
      code: code`
        Inputs: hours studied = 2, phone pickups = 4

        Hidden neuron A (effort):       2 x 1.0  + 4 x 0.0  - 1.0  =  1.0  -> 1.0
        Hidden neuron B (distraction):  2 x 0.0  + 4 x 0.5  - 1.5  =  0.5  -> 0.5
        Hidden neuron C (no effort):    2 x -0.5 + 4 x -0.5 + 1.0  = -2.0  -> 0

        Output neuron:  1.0 x 1.5  +  0.5 x -2.0  +  0 x 1.0  +  0.2  =  0.7
        0.7 is above 0, so the network predicts: pass
      `,
    },
    steps: [
      { code: 'Inputs: hours studied = 2, phone pickups = 4', explanation: "The network only ever sees numbers. Words, pixels and sounds are all turned into numbers before a network can work with them." },
      { code: 'Hidden neuron A (effort)', explanation: "A gives hours studied a weight of 1.0 and ignores phone pickups with a weight of 0. Its bias of -1.0 means it only fires once a student has studied for more than an hour." },
      { code: 'Hidden neuron B (distraction)', explanation: "B looks only at phone pickups. With 4 pickups and a bias of -1.5, its total is 0.5, so it reports a little distraction." },
      { code: 'Hidden neuron C (no effort)', explanation: "C's total is negative, so ReLU turns it into 0. A zero means this neuron stays silent, and its weight in the next layer has no effect on this prediction." },
      { code: 'Output neuron', explanation: "The output neuron weighs the three hidden results. Effort counts for the answer with 1.5 and distraction counts against it with -2.0. Adding the bias of 0.2 gives 0.7." },
      { code: 'predicts: pass', explanation: "The result is positive, so the answer is pass. In a real trained network, hidden neurons rarely have meanings as tidy as effort and distraction, but the arithmetic is exactly this, repeated across many more neurons." },
    ],
  },
  tryIt: {
    instructions: [
      'Take a pen and paper or a calculator. Use the neuron from the first section: weights 0.8 for hours and -0.3 for phone pickups, and a bias of 0.5.',
      'Work out the total and the answer, pass or fail, for three study sessions: 3 hours with 2 pickups, half an hour with 4 pickups, and 1 hour with no pickups.',
      'Change the bias to -1 and work out all three again. Write down which answer changed, and why a lower bias makes the neuron stricter.',
    ],
    evidencePrompt: {
      label: 'Your totals',
      placeholder: 'For example: With a bias of 0.5 the totals were ... With a bias of -1 the answer for ... changed to fail because ...',
    },
  },
  mistakes: [
    { mistake: 'Picturing artificial neurons as tiny brain cells that think.', fix: 'Each one only multiplies, adds and applies a simple rule. The idea was inspired by the brain, but the working parts are plain arithmetic.' },
    { mistake: 'Expecting every hidden neuron to have a clear human meaning.', fix: 'The worked example chose readable meanings on purpose. In trained networks, most neurons respond to mixtures of patterns with no tidy name.' },
    { mistake: 'Assuming more parameters always means a better model.', fix: 'Size helps only with enough good examples. A huge network trained on poor data learns poor patterns, and states them confidently.' },
    { mistake: 'Believing a trained network looks up the examples it learned from.', fix: 'After training, only the weights remain. The network computes each answer from them, which is how it handles new cases and also how it gets familiar ones wrong.' },
  ],
  quiz: [
    {
      question: 'A neuron has weights 0.5 and -1.0 and a bias of 1. Its inputs are 4 and 2. What is its total before the activation function?',
      options: [
        { text: '0', explanation: 'That is 4 x 0.5 + 2 x -1.0 without the bias. The bias is always added.' },
        { text: '1', explanation: '4 x 0.5 = 2, plus 2 x -1.0 = -2, plus the bias of 1 gives 1.' },
        { text: '5', explanation: 'That treats -1.0 as +1.0. A negative weight subtracts.' },
        { text: '-1', explanation: 'That subtracts the bias instead of adding it.' },
      ],
      answer: 1,
    },
    {
      question: 'A network has 3 inputs, one hidden layer of 4 neurons and 1 output neuron. Every input connects to every hidden neuron. How many weights does it have, not counting biases?',
      options: [
        { text: '8', explanation: 'That adds up the neurons: 3 + 4 + 1. Weights belong to connections, not neurons.' },
        { text: '12', explanation: 'That counts only the connections into the hidden layer. The 4 connections into the output count too.' },
        { text: '21', explanation: 'That includes the 5 biases, which the question leaves out.' },
        { text: '16', explanation: '3 x 4 = 12 connections into the hidden layer, plus 4 x 1 = 4 into the output.' },
      ],
      answer: 3,
    },
    {
      question: 'During training, a network guesses pass for a student who actually failed. What happens next?',
      options: [
        { text: 'Each weight is nudged slightly in the direction that would have made pass less likely', explanation: 'Training corrects mistakes with many small weight changes, repeated over many examples.' },
        { text: 'A programmer finds the faulty weight and edits it by hand', explanation: 'Networks have far too many weights for that. The training loop adjusts them automatically.' },
        { text: 'The example is deleted because the network could not handle it', explanation: 'Mistakes are exactly what the network learns from. Removing them would teach it nothing.' },
        { text: 'The network saves this student so it can answer fail if it sees them again', explanation: 'Networks keep only weights, not a list of past examples.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A neural network is layers of neurons that multiply, add and apply a simple rule, and training is the slow process of nudging their weights until the answers match the examples.',
  resources: [
    { title: 'Neural networks', provider: '3Blue1Brown', description: 'A visual video series that builds a network for reading handwritten digits.', url: 'https://www.3blue1brown.com/topics/neural-networks' },
    { title: 'TensorFlow Playground', provider: 'TensorFlow', description: 'Train a small network in your browser and watch its layers and weights change.', url: 'https://playground.tensorflow.org/' },
    { title: 'Neural networks', provider: 'Google Machine Learning Crash Course', description: 'A short course module on layers, activation functions and training.', url: 'https://developers.google.com/machine-learning/crash-course/neural-networks' },
  ],
  underTheHood: {
    heading: 'Why every neuron needs a bend',
    paragraphs: [
      "Suppose you remove the activation function and let each neuron pass its total straight through. Take two layers with one neuron each. The first doubles its input, so it outputs 2 x input. The second triples that, so it outputs 3 x 2 x input, which is just 6 x input. One neuron with a weight of 6 does exactly the same job.",
      "This is true however many layers you stack: plain weighted sums of weighted sums always collapse into a single weighted sum. On a graph, that is always a straight line or a flat surface, and most real patterns are not straight.",
      "An activation function adds a bend. ReLU, for example, keeps positive totals and turns negative ones into 0, which puts a corner in the line. Each neuron adds its own corner in its own place. Combine enough of them and the network can trace curves of almost any shape, which is why depth and activation functions only work together.",
    ],
  },
}

export default lesson
