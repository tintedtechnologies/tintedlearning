import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe a game as a loop of choices, feedback, and goals',
    'Write a core mechanic in one sentence that a player can understand in seconds',
    'Cut a game idea down to the smallest version that can be played and tested',
  ],
  bigIdea: 'A game is a loop: the player makes a choice, the game gives feedback, and the player works toward a goal. A strong game starts with one core mechanic, the action the player repeats most, and builds everything else around it. Designing small, testing early, and cutting what does not serve the loop is the skill that turns ideas into playable games.',
  whyItMatters: 'A student plans a game with twelve levels, three characters, a story, crafting, and multiplayer. After a month, there is no playable version. A friend suggests one rule: the player catches falling fruit with a basket. Two days later, the basket game is playable and fun, and it teaches the student more about the engine than the big plan ever would have.',
  goalSections: [
    {
      heading: 'The game loop',
      paragraphs: [
        'Every game has a loop, even a simple one. The player looks at the situation, chooses an action, sees the result, and decides again. A platformer loop is jump, land, check the gap, jump again. A puzzle loop is look, try a move, see what changes, try again. The loop is what the player does for most of the time they play.',
        'Feedback makes the loop readable. When the player acts, the game should respond clearly, with movement, sound, a score change, or a visible effect. A player who cannot tell whether an action worked will stop trying.',
        'Goals give the loop direction. A goal can be short, such as reaching the next platform, or long, such as finishing a level. The best goals are clear enough that the player knows whether they are closer to them.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Choice:   move the basket left or right
          Feedback: a caught fruit adds a point and makes a sound; a missed one costs a life
          Goal:     reach 20 points before losing three lives
          Loop:     watch the fruit, move the basket, see the result, move again
        `,
      },
    },
    {
      heading: 'One core mechanic',
      paragraphs: [
        'A core mechanic is the action the player repeats most often. In a basket game it is moving the basket. In a shooter it is aiming and firing. Write it as one sentence that a stranger could understand in seconds: "The player moves a basket to catch falling fruit." If the sentence needs several paragraphs, the mechanic is probably too complicated for a first version.',
        'Everything else supports the core mechanic. A score adds a reason to keep catching. Lives add a reason to be careful. Speed changes add a reason to keep watching. Features that do not support the loop should wait, however exciting they sound.',
        'Test the mechanic before adding anything. Play it, ask a friend to play it, and watch where they hesitate or get bored. Those moments show what to change before the wrong features are built around it.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          ideas = [
              ("levels with three characters and crafting", 5, False),
              ("catch falling fruit with a basket", 1, True),
              ("shoot enemies that move in patterns", 3, False),
          ]
          playable_first = min((item for item in ideas if item[2]), key=lambda item: item[1])
          print("build first:", playable_first[0])
        `,
        output: 'build first: catch falling fruit with a basket',
      },
    },
    {
      heading: 'Cutting to the smallest playable version',
      paragraphs: [
        'The smallest playable version has one level, one mechanic, one goal, and a way to win or lose. It is not a demo of the final game. It is a test of whether the core loop is fun and whether the engine can do the basic work.',
        'Write down what you cut and why. A list of features moved to later is a plan, not a loss. Revisit the list after playtesting, and add features only when the playable version shows a clear need for them.',
        'Set a time limit for each version. A week for the playable version keeps the scope honest, and it creates a moment to stop and decide whether the idea is worth continuing.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          versions = [("full plan", 12, 3), ("playable slice", 1, 1)]
          for name, levels, mechanics in versions:
              print(name, "levels:", levels, "mechanics:", mechanics)
        `,
        output: 'full plan levels: 12 mechanics: 3\nplayable slice levels: 1 mechanics: 1',
      },
    },
  ],
  seeItInAction: {
    title: 'Choosing what to build first',
    intro: 'The program above picks the first idea that is playable, and the smallest one among those. The planning rule is simple, but it prevents the common mistake of starting with the biggest idea. Run it, then mark the shooter as playable and predict which idea is chosen.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        ideas = {
            "twelve levels with crafting": (5, False),
            "catch falling fruit": (1, True),
            "shoot patterned enemies": (3, False),
        }
        playable = [(name, size) for name, (size, is_playable) in ideas.items() if is_playable]
        choice = min(playable, key=lambda item: item[1])
        print("build first:", choice[0])
        print("ideas waiting:", len(ideas) - 1)
      `,
      output: 'build first: catch falling fruit\nideas waiting: 2',
    },
    steps: [
      { code: 'playable = [...]', explanation: 'Keeps only the ideas that already have a playable form to test.' },
      { code: 'choice = min(playable, key=lambda item: item[1])', explanation: 'Chooses the smallest playable idea, so the first build is quick to finish and test.' },
      { code: 'print("ideas waiting:", len(ideas) - 1)', explanation: 'Keeps the other ideas visible, so they are saved for later rather than lost.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write your own game idea as one core mechanic in one sentence. If it takes more than one sentence, cut it down.',
      'Change the seeItInAction example so that the shooter is also marked playable, and predict the first choice. Run it to check.',
      'Describe the feedback that tells the player an action worked, for one action in your game.',
    ],
  },
  mistakes: [
    { mistake: 'Starting with the largest, most exciting idea.', fix: 'Build the smallest playable version of the core loop first, and test it.' },
    { mistake: 'Adding features before the core mechanic is fun.', fix: 'Test the mechanic with real players before adding anything around it.' },
    { mistake: 'Giving the player no clear feedback for their actions.', fix: 'Make every important action produce visible, audible, or score feedback.' },
  ],
  quiz: [
    {
      question: 'What is a core mechanic?',
      options: [
        { text: 'The action the player repeats most often', explanation: 'Yes. The core mechanic is the repeated action at the heart of the loop.' },
        { text: 'The story of the game', explanation: 'The story can matter, but the core mechanic is the repeated action.' },
        { text: 'The final level of the game', explanation: 'The final level is a result, not the mechanic.' },
        { text: 'The art style', explanation: 'Art supports the mechanic but is not the mechanic.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        ideas = [("big", 5, False), ("small", 1, True)]
        best = min((i for i in ideas if i[2]), key=lambda i: i[1])
        print(best[0])
      ` },
      options: [
        { text: 'big', explanation: 'The big idea is not marked playable, so it is not chosen.' },
        { text: 'small', explanation: 'Yes. Small is the only playable idea.' },
        { text: 'True', explanation: 'The program prints the name, not the playable flag.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why should a first version be the smallest playable one?',
      options: [
        { text: 'So the core loop can be tested early, before time is spent on features that may not work', explanation: 'Yes. Early testing shows whether the idea is worth building further.' },
        { text: 'Because smaller games sell better', explanation: 'Sales are not the purpose of the first version. Testing the loop is.' },
        { text: 'Because the engine cannot handle big games', explanation: 'The engine can handle big games. The reason is testing the idea early.' },
        { text: 'Because players prefer short games always', explanation: 'Length preference varies. The reason is validating the core loop.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Design a game as a loop of choices, feedback, and goals, write its core mechanic in one sentence, and build the smallest playable version first so the loop can be tested early.',
  resources: [
    { title: 'Godot Engine documentation: introduction', provider: 'Godot Engine', description: 'The official overview of the Godot engine and how its projects are organized.', url: 'https://docs.godotengine.org/en/stable/getting_started/introduction/index.html' },
    { title: 'Game Design Workshop', provider: 'Tracy Fullerton (book overview)', description: 'A widely used guide to prototyping, playtesting, and designing game loops.', url: 'https://www.routledge.com/Game-Design-Workshop-A-Playcentric-Approach-to-Creating-Innovative-Games/Fullerton/p/book/9781032607016' },
  ],
}

export default lesson
