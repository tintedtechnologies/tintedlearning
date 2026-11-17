import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe the game loop: read input, update the game, then draw a frame',
    'Use delta time so that movement speed does not depend on how fast the computer runs',
    'Tell a scene from a node, and read a scene tree',
  ],
  bigIdea: 'A game is a loop. It reads what the player does, updates the world a little, and draws the result, dozens of times every second. A game engine such as Godot provides that loop, along with tools for drawing, physics, sound and input, so you can focus on what your game does.',
  whyItMatters: 'You want a character to cross the screen in two seconds. On a fast computer the game draws 120 frames each second, and on a slow laptop it draws 30. If the character moves a fixed amount per frame, it crosses the screen four times faster on the fast computer. Knowing the loop and the time between frames is how you make the game feel the same on both.',
  goalSections: [
    {
      heading: 'Following the game loop',
      paragraphs: [
        'Every frame, a game does three jobs in the same order. It reads input from the keyboard, mouse or controller. It updates the state of the game, such as where the player is and how many coins were collected. Then it draws the new state to the screen. Engines run this cycle for you, and you write the code that runs inside each step.',
        'In Godot, the update step is a function that Godot calls for you once per frame. You never write the loop itself. You only decide what happens inside it. Because the engine handles the loop, the same project can be exported for several kinds of computer.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'game_loop.py',
        code: code`
          for frame in range(2):
              print(f"frame {frame}: read input")
              print(f"frame {frame}: update the world")
              print(f"frame {frame}: draw the screen")
        `,
        output: 'frame 0: read input\nframe 0: update the world\nframe 0: draw the screen\nframe 1: read input\nframe 1: update the world\nframe 1: draw the screen',
      },
    },
    {
      heading: 'Using delta time to keep speed steady',
      paragraphs: [
        'Delta time, usually written as `delta`, is the number of seconds since the last frame. Godot gives it to your update function. If you multiply every movement by delta, the amount moved per second stays the same, whatever the frame rate. A speed of 120 pixels per second moves the character 2 pixels in a frame that lasts 1/60 of a second.',
        'Without delta, the code `position += 2` moves the character 2 pixels every frame. At 60 frames per second that is 120 pixels a second. At 30 frames per second it is only 60 pixels a second. The game would run at half speed on a slower machine.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'delta.py',
        code: code`
          speed = 120.0
          for fps in (30, 60):
              delta = 1 / fps
              position = 0.0
              for _ in range(fps):
                  position += speed * delta
              print(f"{fps} frames per second: moved {position:.1f} pixels")
        `,
        output: '30 frames per second: moved 120.0 pixels\n60 frames per second: moved 120.0 pixels',
      },
    },
    {
      heading: 'Scenes and nodes',
      paragraphs: [
        'A node is the smallest building block in Godot. Each node has a name, a type and its own properties. A `Sprite2D` node shows an image, a `CollisionShape2D` node defines a shape for hits, and a `Label` node shows text. A node can have child nodes below it.',
        'A scene is a saved tree of nodes. The tree is called the scene tree, and it shows parents and children from the top down. A scene can be reused: you save a `Coin` scene once, then place many coins in a level. Godot stores the scene as a file, so the same coin appears wherever you place it.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Main (Node2D)
          ├── Player (CharacterBody2D)
          │   └── Sprite2D
          └── Coin (Area2D)
              └── CollisionShape2D
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Why the same speed needs delta',
    intro: 'This script simulates one second of movement at two frame rates. Both runs should cover 120 pixels, because the speed is the same and the time is the same. Run it and check the output.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'delta.py',
      code: code`
        speed = 120.0
        for fps in (30, 60):
            delta = 1 / fps
            position = 0.0
            for _ in range(fps):
                position += speed * delta
            print(f"{fps} frames per second: moved {position:.1f} pixels")
      `,
      output: '30 frames per second: moved 120.0 pixels\n60 frames per second: moved 120.0 pixels',
    },
    steps: [
      { code: 'speed = 120.0', explanation: 'Speed is 120 pixels for each second of game time. The number has a decimal point so Python treats it as a float, which is a number that can hold fractions.' },
      { code: 'delta = 1 / fps', explanation: 'At 30 frames per second, one frame lasts 1/30 of a second. At 60 frames per second, one frame lasts 1/60 of a second.' },
      { code: 'position += speed * delta', explanation: 'Each frame moves the position by the speed times the time in that frame. The slower frame rate uses bigger steps, so the total still adds up.' },
      { code: 'for _ in range(fps):', explanation: 'Looping `fps` times simulates exactly one second, so the total distance is the speed for one second.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the first loop so it runs over `(30, 60, 144)`, then run the script again.',
      'Predict the output for 144 frames per second before you run it. Every line should still say 120.0 pixels.',
      'Change `speed` to 200.0 and predict the new totals. Then run the script to check.',
    ],
  },
  mistakes: [
    { mistake: 'Moving a fixed amount each frame, such as `position += 2`.', fix: 'Multiply by `delta` so the movement depends on time, not on how many frames happen to run.' },
    { mistake: 'Thinking a node and a scene are the same thing.', fix: 'A node is one building block. A scene is a saved tree of nodes that you can reuse and place many times.' },
    { mistake: 'Putting game logic in the wrong step, such as drawing inside the input step.', fix: 'Read input, then update the world, then let the engine draw. Keep each job in its own function.' },
  ],
  quiz: [
    {
      question: 'This script moves the character 100 pixels per second. How many pixels does it move in total?',
      code: { language: 'python', runnable: true, code: code`
        speed = 100.0
        position = 0.0
        for _ in range(4):
            position += speed * 0.25
        print(position)
      ` },
      options: [
        { text: '25.0', explanation: 'That is one frame of 0.25 seconds at 100 pixels per second, not four frames.' },
        { text: '100.0', explanation: 'Four frames of 0.25 seconds add up to one full second, which covers 100 pixels.' },
        { text: '400.0', explanation: 'That would mean each frame lasted a whole second. Each frame here lasts 0.25 seconds.' },
        { text: '1.0', explanation: 'Speed is 100 pixels per second, so the result cannot be a single pixel after a full second.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'A game runs at 60 frames per second and your character moves 120 pixels per second. Which line of code moves the character the right distance in one frame?',
      options: [
        { text: '`position += 120`', explanation: 'That moves 120 pixels every frame, which is 7200 pixels per second at 60 frames per second.' },
        { text: '`position += 120 * delta`', explanation: 'Yes. Delta is 1/60 of a second, so this moves the character 2 pixels in each frame.' },
        { text: '`position += 120 / delta`', explanation: 'Dividing by delta makes the movement larger when frames are shorter, which is the opposite of what you want.' },
        { text: '`position = 120`', explanation: 'That teleports the character to pixel 120 instead of moving it.' },
      ],
      answer: 1,
    },
    {
      question: 'Your scene tree has a `Coin` node with a `CollisionShape2D` child. What is the `CollisionShape2D`?',
      options: [
        { text: 'The parent of the coin', explanation: 'The child sits below the coin. The coin is its parent.' },
        { text: 'A separate scene file', explanation: 'It is a node that lives inside the coin scene. It is not a whole scene on its own.' },
        { text: 'The shape the coin uses to detect hits', explanation: 'Yes. A collision shape node defines the area that can be touched.' },
        { text: 'The sound the coin makes', explanation: 'Sound uses a different kind of node. A collision shape only describes where hits can happen.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'A game engine runs the same loop every frame, and multiplying movement by delta keeps the game feeling the same at any frame rate.',
  resources: [
    { title: 'Godot documentation: Introduction', provider: 'Godot Engine', description: 'The official introduction to nodes, scenes and the basic workflow.', url: 'https://docs.godotengine.org/en/stable/getting_started/introduction/index.html' },
  ],
}

export default lesson
