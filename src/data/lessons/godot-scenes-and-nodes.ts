import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Build a scene from a root node and its child nodes',
    'Save a scene and place it inside another scene as an instance',
    'Change a node’s properties in the Inspector',
  ],
  bigIdea: 'A scene is a tree of nodes, and its root node sets the type of the whole scene. You build a scene by adding child nodes to the root, then you save it. A saved scene can be placed inside other scenes, so one player scene can appear in every level.',
  whyItMatters: 'Your coin game needs a player in the first level, the second level and the bonus level. If you draw the player again in each level, a fix to the player must be copied three times. If you build the player once and place it, you fix it in one file, and every level gets the change. Good scene structure also makes bugs easier to find, because each piece has one clear job.',
  goalSections: [
    {
      heading: 'Building a scene from a root node',
      paragraphs: [
        'In the Scene dock, click 2D Scene under Create Root Node, then pick the root node type. For a player that moves on a flat screen, pick `CharacterBody2D`. This node moves itself and handles collisions with walls and floors. Rename the root to `Player`, because the name appears in the scene tree and in your code.',
        'Add child nodes with the plus button. A `Sprite2D` child shows the picture, and a `CollisionShape2D` child defines the area that can be hit. Children are placed under the root, and when the root moves, the children move with it.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Player (CharacterBody2D)
          ├── Sprite2D        shows the picture
          └── CollisionShape2D    the area that collides
        `,
      },
    },
    {
      heading: 'Saving a scene and placing it as an instance',
      figures: [
        { src: "/lesson-images/godot/scene-drag-instance.webp", alt: "Dragging a scene file from the FileSystem dock onto a node in the Scene dock.", caption: "Drag a saved scene from the FileSystem dock onto a node in the Scene dock. Godot adds a copy of the scene as a child of that node.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html" } },
      ],
      paragraphs: [
        'Save the scene as `scenes/player.tscn`. The `.tscn` file stores the tree, its nodes and their properties. It does not store the game logic, which lives in scripts.',
        'Open `main.tscn`, then drag `player.tscn` from the FileSystem panel into the scene. The copy in `main.tscn` is an instance. It has a small link icon next to its name in the scene tree. Changing `player.tscn` updates every instance, while you can still change one instance on its own when you need to.',
        'Start with the root node, because everything else depends on it. If the root is wrong, the children may still look right but behave wrongly, such as a player that falls through the floor.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Main (Node2D)
          ├── Player (instance of res://scenes/player.tscn)
          ├── Coin (instance of res://scenes/coin.tscn)
          └── Coin (instance of res://scenes/coin.tscn)
        `,
      },
    },
    {
      heading: 'Changing properties in the Inspector',
      paragraphs: [
        'Select a node, then look at the Inspector on the right. It lists the node’s properties, such as position, scale, texture and the shape of a collision area. Changing a value there changes only that node in that scene. Many properties also have a default in the code you will write later.',
        'Use the Inspector to set up what does not change while the game runs, such as the size of a collision shape. Use code for values that change during play, such as the player’s speed or score. Keeping the two apart makes the game easier to tune.',
        'Keep the scene tree short where you can. A tree with a few clear levels is easier to read than a deep stack of nodes, and it is easier to explain to someone else later.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Selected: CollisionShape2D
          Shape:     RectangleShape2D
          Size:      x 32, y 48
          Disabled:  off
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Reading an instance in the scene tree',
    intro: 'Here is the main scene for the coin game after you place one player and two coins. Each coin is an instance of the same saved scene, so a change to `coin.tscn` changes both coins. Read the tree from the top down. Reading the tree is the first step when a level behaves oddly, so practice it now.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        Main (Node2D)
        ├── Player (instance of res://scenes/player.tscn)
        ├── Coin (instance of res://scenes/coin.tscn)
        └── Coin2 (instance of res://scenes/coin.tscn)
      `,
    },
    steps: [
      { code: 'Main (Node2D)', explanation: 'The root of this scene is a plain `Node2D`. It groups the level together and does nothing else.' },
      { code: 'Player (instance of res://scenes/player.tscn)', explanation: 'The player is not drawn here from scratch. Godot loads the saved player scene and places a copy of it under `Main`.' },
      { code: 'Coin (instance of res://scenes/coin.tscn)', explanation: 'The coin is also an instance. Its name is `Coin`, so you can tell it apart from the second coin.' },
      { code: 'Coin2 (instance of res://scenes/coin.tscn)', explanation: 'The second coin comes from the same file. Placing another coin costs nothing extra, and it updates when you edit `coin.tscn`.' },
    ],
  },
  tryIt: {
    instructions: [
      'Build `scenes/player.tscn` with a `CharacterBody2D` root named `Player`, a `Sprite2D` child and a `CollisionShape2D` child. Save it.',
      'Open `scenes/main.tscn`, drag `player.tscn` into it, and place two copies.',
      'Select one copy and change its position in the Inspector. Notice that the other copy does not move.',
    ],
  },
  mistakes: [
    { mistake: 'Choosing a `Node2D` root for a player that must collide with walls.', fix: 'Use `CharacterBody2D` for anything that moves and collides. A plain `Node2D` moves but does not stop at walls.' },
    { mistake: 'Copying and pasting a node instead of making an instance.', fix: 'Drag the saved scene into the level. A pasted copy is separate, so later edits to the original do not reach it.' },
    { mistake: 'Leaving the default name `Node2D` or `CharacterBody2D` on every node.', fix: 'Rename nodes to what they do, such as `Player` or `Coin`, so the scene tree and your code are easy to read.' },
  ],
  quiz: [
    {
      question: 'You built `coin.tscn` and placed five coins in a level as instances. You change the coin’s collision shape in `coin.tscn`. What happens?',
      options: [
        { text: 'Only the first coin changes', explanation: 'All instances come from the same saved file, so none is special.' },
        { text: 'All five coins change', explanation: 'Yes. Each coin is an instance of `coin.tscn`, so a change to that file updates every instance that has not been overridden.' },
        { text: 'Nothing changes until you restart Godot', explanation: 'Instances use the saved scene directly. No restart is needed.' },
        { text: 'The level is deleted', explanation: 'Changing a scene file does not delete the levels that use it.' },
      ],
      answer: 1,
    },
    {
      question: 'Your player walks into a wall and passes through it. The root node is a plain `Node2D`. Which root node fits a moving player that should stop at walls?',
      options: [
        { text: '`Sprite2D`', explanation: 'A sprite only shows a picture. It does not move itself or stop at walls.' },
        { text: '`CharacterBody2D`', explanation: 'Yes. This node moves and handles collisions with the walls and floor.' },
        { text: '`Label`', explanation: 'A label shows text. It cannot move or stop at walls.' },
        { text: '`Timer`', explanation: 'A timer counts time. It does not move or collide with anything.' },
      ],
      answer: 1,
    },
    {
      question: 'In the Inspector, you change the position of one `Coin` instance in `main.tscn`. Which statement is true?',
      options: [
        { text: 'Every coin in every level moves', explanation: 'A change to one instance stays on that instance unless you change the saved scene.' },
        { text: 'Only that instance moves, and the saved `coin.tscn` is unchanged', explanation: 'Yes. Changing one instance overrides it locally, and the saved scene keeps its original values.' },
        { text: 'The scene file is deleted', explanation: 'Changing a position does not delete any file.' },
        { text: 'The coin stops being an instance', explanation: 'It remains an instance, with one local change applied.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Build a scene once from a root node and its children, save it, and place it as an instance wherever the game needs it.',
  resources: [
    { title: 'Godot documentation: Nodes and scenes', provider: 'Godot Engine', description: 'How nodes, scenes and the scene tree work together.', url: 'https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html' },
  ],
}

export default lesson
