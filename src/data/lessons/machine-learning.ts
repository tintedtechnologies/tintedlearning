import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how machine learning differs from writing rules by hand',
    'Match a problem to supervised, unsupervised or reinforcement learning',
    'Place machine learning and deep learning inside the wider field of AI',
  ],
  bigIdea: "Machine learning is a way of building software where you show the computer examples and let it work out the rules, instead of writing the rules yourself. There are three main styles, depending on what the examples look like. Almost all of today's AI, including chatbots, is built this way.",
  whyItMatters: "Picture a small online shop that wants to warn customers when an order looks fraudulent. The owner tries writing rules: block orders over $500, block new accounts, block overseas cards. Within a week, honest customers are blocked and fraudsters have learned to buy $499 orders. Machine learning exists for problems like this, where the patterns are too many, too subtle or change too fast for a person to write down.",
  goalSections: [
    {
      heading: 'Rules written by people versus rules learned from data',
      paragraphs: [
        "In traditional programming, a person writes the rules, the computer applies them to data, and answers come out. This works well when the rules are clear and stable, like calculating sales tax.",
        "Machine learning flips this around. You give the computer data plus the answers you want, and it produces the rules. Those learned rules are the model. You then use the model on new data to get new answers.",
        "Machine learning is worth the effort when writing the rules by hand is impossible or keeps breaking. Nobody can write a rule that recognizes every handwritten 7, but a model can learn one from 60,000 examples.",
      ],
      example: {
        language: 'text',
        code: code`
          Traditional programming:
            rules + data         -> answers
            "tax = price x 0.08" + $50 -> $4.00

          Machine learning:
            data + answers       -> rules (the model)
            10,000 past orders, each marked fraud or OK -> fraud model
            then: model + new order -> "82% likely fraud"
        `,
      },
    },
    {
      heading: 'Three styles of machine learning',
      paragraphs: [
        "Supervised learning uses examples that come with the right answer attached, like emails marked spam or not spam, or houses with their sale prices. The model learns to predict the answer for new cases. Most business uses of machine learning are supervised.",
        "Unsupervised learning uses examples with no answers at all. The model looks for structure by itself, such as groups of customers who shop in similar ways. You find out what the groups mean afterwards.",
        "Reinforcement learning has no fixed examples. A program tries actions, gets a reward or a penalty, and gradually learns which actions lead to more reward. It is used for games, robots, and to fine-tune chatbots using human ratings.",
        "To pick the style, look at what you have. Answers attached means supervised. No answers means unsupervised. A score you can only get by trying things means reinforcement learning.",
      ],
      example: {
        language: 'text',
        code: code`
          Problem                                  What you have             Style
          Predict a house's sale price             past sales with prices    supervised
          Find groups of similar shoppers          purchases, no labels      unsupervised
          Teach a robot arm to stack boxes         a reward when it works    reinforcement
        `,
      },
    },
    {
      heading: 'Where machine learning fits in AI',
      paragraphs: [
        "Think of three circles, one inside the other. The biggest is AI: any software that does tasks we normally link to human thinking. Early AI was mostly hand-written rules, such as chess programs that followed expert strategies.",
        "Inside AI sits machine learning: AI that learns its rules from data. Inside machine learning sits deep learning, which uses a particular kind of model called a neural network with many layers. Deep learning is what made modern speech recognition, image recognition and chatbots possible, because it can learn from raw pixels, sound and text.",
        "So every deep learning system is machine learning, and every machine learning system is AI, but not the other way round.",
      ],
      example: {
        language: 'text',
        code: code`
          AI
          +-- rule-based systems (a chess program following expert rules)
          +-- machine learning (learns rules from data)
                +-- simpler models (a fraud score from order details)
                +-- deep learning (many-layered neural networks)
                      +-- image recognition, speech-to-text, chatbots
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Choosing the style for a real support team',
    intro: "A company receives 2,000 customer emails a day and wants AI to help. Here is how a team would decide which kind of machine learning fits each idea.",
    example: {
      language: 'text',
      code: code`
        Idea 1: send each email to billing, technical or sales
          Data: 30,000 old emails, each already filed by staff
          -> supervised learning

        Idea 2: discover what new topics customers complain about
          Data: this month's emails, not sorted in any way
          -> unsupervised learning

        Idea 3: a reply bot that learns from thumbs up or down ratings
          Data: a rating after each reply
          -> reinforcement learning
      `,
    },
    steps: [
      { code: 'Idea 1: send each email to billing, technical or sales', explanation: "The output is one label from a fixed list of three, so this is a supervised task if labeled examples exist." },
      { code: 'Data: 30,000 old emails, each already filed by staff', explanation: "Staff filing emails over the years created the right answers for free. That history is what makes supervised learning possible here." },
      { code: 'Idea 2: discover what new topics customers complain about', explanation: "Nobody knows the topics in advance, so there are no labels. An unsupervised model can group similar emails, and a person then reads each group to name it." },
      { code: 'Idea 3: a reply bot that learns from ratings', explanation: "There is no single right reply to copy. The bot only gets a score after it acts, which is the shape of a reinforcement learning problem." },
    ],
  },
  mistakes: [
    { mistake: 'Using machine learning when a simple rule would do.', fix: 'Try writing the rule first. If a few clear lines of logic solve it, like calculating a shipping fee, you do not need a model.' },
    { mistake: 'Planning supervised learning without having any labeled examples.', fix: 'Check early whether right answers exist or can be created. Labeling thousands of examples by hand is often the biggest cost of a project.' },
    { mistake: 'Using AI, machine learning and deep learning as if they mean the same thing.', fix: 'Use the circles: deep learning is a kind of machine learning, which is a kind of AI.' },
  ],
  quiz: [
    {
      question: 'A gym has five years of member records, each marked "canceled" or "stayed". It wants to predict which current members are likely to cancel. Which style fits?',
      options: [
        { text: 'Unsupervised learning, because it is about finding patterns in members', explanation: 'All machine learning finds patterns. The deciding fact is that past records already have the answer attached.' },
        { text: 'Reinforcement learning, because the gym wants a reward of fewer cancellations', explanation: 'Reinforcement learning is for learning actions by trial and reward. Here the gym just wants a prediction for each member.' },
        { text: 'Supervised learning, because past records come with the answer attached', explanation: 'Each record says whether the member canceled, so the model can learn from examples with known answers.' },
        { text: 'No machine learning, because a person could guess', explanation: 'A person could guess for a few members, but not spot subtle patterns across thousands of records.' },
      ],
      answer: 2,
    },
    {
      question: 'Which statement about AI, machine learning and deep learning is true?',
      options: [
        { text: 'Every machine learning system uses deep learning', explanation: 'Many machine learning models are simple and use no neural network at all.' },
        { text: 'Every deep learning system is a form of machine learning', explanation: 'Deep learning is the inner circle: a kind of machine learning that uses many-layered neural networks.' },
        { text: 'AI and machine learning are two names for the same thing', explanation: 'AI also includes rule-based systems that never learn from data.' },
        { text: 'Deep learning is older than machine learning', explanation: 'Deep learning is a branch of machine learning. It took off in the 2010s, once there was enough data and computing power to train large neural networks.' },
      ],
      answer: 1,
    },
    {
      question: 'A city wants to set parking fines: $40 for an expired meter, $100 for blocking a fire hydrant. Should it use machine learning?',
      options: [
        { text: 'No, the rules are clear and fixed, so ordinary code is simpler and easier to check', explanation: 'When the rules can be written down in a few lines, machine learning only adds cost and uncertainty.' },
        { text: 'Yes, supervised learning on past fines', explanation: 'A model would only learn to copy rules that are already known, and might get some wrong.' },
        { text: 'Yes, unsupervised learning to group types of offence', explanation: 'The types of offence are already defined in law, so there is nothing to discover.' },
        { text: 'Yes, because modern systems should always use AI', explanation: 'Using AI is a choice with costs. It earns its place only when hand-written rules fail.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Machine learning builds software by learning rules from examples, and the kind of examples you have (with answers, without answers, or only a reward) decides which style you use.',
  resources: [
    { title: 'Machine learning crash course', provider: 'Google for Developers', description: 'Free lessons and exercises on supervised learning and how models are trained.', url: 'https://developers.google.com/machine-learning/crash-course' },
    { title: 'Elements of AI', provider: 'University of Helsinki', description: 'Chapters on machine learning, neural networks and their limits.', url: 'https://www.elementsofai.com/' },
  ],
  underTheHood: {
    heading: 'How unsupervised learning finds groups',
    paragraphs: [
      "A common unsupervised method is called k-means. You choose how many groups you want, say 3. The method places 3 starting points at random among your data, such as customers described by how often they shop and how much they spend.",
      "Then it repeats two steps. First, every customer joins the group of whichever point is closest to them. Second, each point moves to the middle of the customers in its group. The points shift less and less each round until they stop moving.",
      "The result is 3 groups of similar customers, but the method never says what they mean. A person has to look and notice, for example, that one group is frequent small spenders and another is rare big spenders. The method also always returns exactly the number of groups you asked for, even if the data does not naturally split that way.",
    ],
  },
}

export default lesson
