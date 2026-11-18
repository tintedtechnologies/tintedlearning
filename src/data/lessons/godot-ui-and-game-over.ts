import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Place a score label on the screen in a `CanvasLayer`, so it stays put while the camera moves',
    'Use anchors on a `Control` node so the label stays in the right place at any window size',
    'Show a game over panel and restart the level with a button',
  ],
  bigIdea: 'Menus, scores and messages are interface nodes, built from `Control` nodes that Godot lays out on the screen. A `CanvasLayer` draws them above the game world, so they do not scroll with the camera. A button can restart the scene by reloading it.',
  whyItMatters: 'Your coin game needs a score the player can always see, even when the camera follows the player across a large level. It also needs a game over message with a restart button. If you draw the score inside the level, it scrolls off the screen. If you forget the layout, the label is cut off on a small window. A missing game over screen leaves the player staring at a frozen level, which feels like a bug even when nothing is broken.',
  goalSections: [
    {
      heading: 'Keeping the score on screen with a CanvasLayer',
      paragraphs: [
        'A `CanvasLayer` is a layer that Godot draws on top of the game world, in screen space. Anything under it stays fixed on the window, even when the camera moves. Add a `CanvasLayer` to the level, then add a `Label` as its child. Name the layer `HUD`, which stands for heads-up display.',
        'The label is a `Control` node. Set its text in the Inspector to `Score: 0`, then change it from code when the score changes. Keep the label under the layer, not under the world, so it is always visible.',
        'Place the HUD in its own scene when it grows, so the level scene stays focused on the world.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Level (Node2D)
          ├── Player
          ├── Coins
          └── HUD (CanvasLayer)
              └── ScoreLabel (Label)
                    text: "Score: 0"
        `,
      },
    },
    {
      heading: 'Placing controls with anchors',
      figures: [
        { src: "/lesson-images/godot/anchor-presets.webp", alt: "The anchor preset menu in the 2D toolbar, with a grid of nine preset icons.", caption: "Select a control, then open the anchor preset menu in the 2D toolbar. Choose the top-left preset to pin the score to the top-left corner.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/tutorials/ui/size_and_anchors.html" } },
      ],
      paragraphs: [
        'Anchors decide which edges of a control stay a fixed distance from the edges of its parent. Set the top-left anchor for the score, so it stays in the top-left corner when the window is resized. Open the anchor preset menu in the 2D toolbar, which sets common anchor presets for you.',
        'Use containers such as `VBoxContainer` when you have several controls to line up. A container arranges its children in a column or row, so you do not place each one by hand. This keeps the layout tidy on a phone and on a large monitor.',
        'Keep the HUD simple. Show only the information the player needs right now, such as lives, score and time left.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          GameOver (Panel)          anchors: center
          └── VBoxContainer         arranges children in a column
              ├── Title (Label)     text: "Game over"
              └── RestartButton (Button)  text: "Play again"
        `,
      },
    },
    {
      heading: 'Restarting with a button',
      paragraphs: [
        'Connect the button’s `pressed` signal to a function, as you did with the coin. Inside the function, call `get_tree().reload_current_scene()`. This loads the level again from its saved file, so every coin and the player start in their original positions.',
        'Hide the game over panel until it is needed. Set `visible = false` when the level starts, and set it to `true` when the lives reach zero. A panel that is hidden does not respond to clicks, so the player cannot press a button they cannot see.',
        'Test the restart button early. A button that restarts the wrong scene is hard to notice until a player presses it.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends Control

          func _ready() -> void:
              visible = false
              $VBoxContainer/RestartButton.pressed.connect(_on_restart_pressed)

          func show_game_over() -> void:
              visible = true

          func _on_restart_pressed() -> void:
              get_tree().reload_current_scene()
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A game over panel that restarts the level',
    intro: 'This script belongs to the game over panel. It hides itself when the level starts, shows itself when the game ends, and restarts the level when the button is pressed. Follow the three functions in the order the game calls them. Watch the panel appear, then press the button to see the level reset.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        extends Control

        func _ready() -> void:
            visible = false
            $VBoxContainer/RestartButton.pressed.connect(_on_restart_pressed)

        func show_game_over() -> void:
            visible = true

        func _on_restart_pressed() -> void:
            get_tree().reload_current_scene()
      `,
    },
    steps: [
      { code: 'visible = false', explanation: 'When the level starts, the panel is hidden, so the player sees only the game.' },
      { code: '$VBoxContainer/RestartButton.pressed.connect(_on_restart_pressed)', explanation: 'The `$` shortcut finds the button by its path under this panel. Connecting `pressed` makes the button call the restart function.' },
      { code: 'func show_game_over() -> void:\n    visible = true', explanation: 'Another script, such as the level, calls this function when lives reach zero. The panel appears on top of the game.' },
      { code: 'get_tree().reload_current_scene()', explanation: 'Reloads the level from its file. The coins and the player return to where they started, and the score resets with the new scene.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a `CanvasLayer` named `HUD` to the level, with a `Label` named `ScoreLabel` under it. Set the anchor to the top-left corner.',
      'Build a `Panel` with a `VBoxContainer`, a title label and a `Button` labeled "Play again". Hide it when the level starts.',
      'Call `show_game_over()` when the player touches a hazard, then press the button and confirm the level restarts.',
    ],
  },
  mistakes: [
    { mistake: 'Putting the score under the moving world, so it scrolls off the screen.', fix: 'Place the label under a `CanvasLayer`, which stays fixed on the window.' },
    { mistake: 'Placing controls at fixed pixel positions, so they break on a different window size.', fix: 'Use anchors or containers, so controls stay in place as the window changes.' },
    { mistake: 'Forgetting to hide the game over panel, so it covers the game at the start.', fix: 'Set `visible = false` in `_ready()`, then show it only when the game ends.' },
  ],
  quiz: [
    {
      question: 'The camera follows the player across a large level. Where should the score label go so it stays visible in the top-left corner?',
      options: [
        { text: 'Under the Player node', explanation: 'The player moves through the world, so a label under it moves too.' },
        { text: 'Under a `CanvasLayer`', explanation: 'Yes. A canvas layer is drawn on the screen and does not scroll with the camera.' },
        { text: 'Under the Coins node', explanation: 'The coins are part of the world, so a label under them scrolls off the screen too.' },
        { text: 'In the Inspector only', explanation: 'The Inspector sets a property. It does not place the label on the screen as the game runs.' },
      ],
      answer: 1,
    },
    {
      question: 'Your restart button calls `get_tree().reload_current_scene()`. What is restored?',
      options: [
        { text: 'Only the score', explanation: 'The whole scene is reloaded, not just the score.' },
        { text: 'The level from its saved file, including the player and coins in their starting positions', explanation: 'Yes. Reloading reads the scene file again, so everything starts fresh.' },
        { text: 'Nothing, because the scene is already loaded', explanation: 'Reloading does load the scene again, so the coins and player return.' },
        { text: 'Only the game over panel', explanation: 'The panel is part of the scene, so the whole level reloads, not just the panel.' },
      ],
      answer: 1,
    },
    {
      question: 'The game over panel should appear only when lives reach zero. Which line in the `_ready()` function does that?',
      options: [
        { text: '`visible = true`', explanation: 'That would show the panel at the start, which is the opposite of what you want.' },
        { text: '`visible = false`', explanation: 'Yes. Hiding the panel at the start means it appears only when `show_game_over()` sets it to true.' },
        { text: '`get_tree().reload_current_scene()`', explanation: 'That reloads the level. It does not control whether the panel is visible.' },
        { text: '`pressed.connect(...)`', explanation: 'That connects the button. It does not hide the panel.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Keep the score in a `CanvasLayer`, lay out controls with anchors and containers, and restart the level by reloading its scene.',
  resources: [
    { title: 'Introduction to user interfaces', provider: 'Godot Engine documentation', description: 'How Control nodes, containers, and layouts build a game\'s interface.', url: 'https://docs.godotengine.org/en/stable/tutorials/ui/index.html' },
    { title: 'Size and anchors for Control nodes', provider: 'Godot Engine', description: 'The official guide to anchors, containers and how Control nodes resize with the window.', url: 'https://docs.godotengine.org/en/stable/tutorials/ui/size_and_anchors.html' },
  ],
}

export default lesson
