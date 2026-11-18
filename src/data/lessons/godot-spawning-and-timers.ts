import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Use a `Timer` node to run an action every few seconds',
    'Create new copies of a scene in code with `instantiate()`',
    'Remove spawned objects that leave the screen, so the game stays fast',
  ],
  bigIdea: 'A `Timer` node sends a `timeout` signal after a set number of seconds. In that signal, you can create a new copy of a saved scene, such as a falling rock, and add it to the level. Objects that leave the screen should be removed, so the number of nodes stays small.',
  whyItMatters: 'Your coin game needs a steady stream of falling hazards to keep the player moving. Placing every rock by hand is slow, and a level with hundreds of old rocks will slow down. A timer that spawns rocks and removes the ones that fall off the bottom gives you an endless, steady challenge. A game that never slows down keeps the challenge fair, and a game that slows down over time feels broken.',
  goalSections: [
    {
      heading: 'Running an action on a timer',
      figures: [
        { src: "/lesson-images/godot/timer-autostart.webp", alt: "The Inspector for a Timer node, showing Wait Time, One Shot off, and Autostart on.", caption: "For the spawner, set Wait Time to 1.5 seconds, leave One Shot off so it repeats, and keep Autostart on so it starts when the level loads.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html" } },
      ],
      paragraphs: [
        'Add a `Timer` node under the level. Set its wait time in the Inspector, such as 1.5 seconds. Turn on autostart so it begins when the level loads. Connect its `timeout` signal to a spawn function, the same way you connected the coin’s signal.',
        'With one-shot off, the timer repeats until you stop it. For a single delay, such as a pause before a boss appears, turn on one-shot instead. Use the timer for timing, not for counting frames, because it measures real seconds.',
        'Choose a wait time that suits the game. Two seconds feels calm, while half a second feels frantic, so test the timing with real play, not just numbers.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Level (Node2D)
          ├── Player
          ├── Coins
          └── SpawnTimer (Timer)
                wait_time: 1.5
                autostart: on
                one_shot: off
        `,
      },
    },
    {
      heading: 'Creating copies with instantiate',
      paragraphs: [
        'Load a scene once with `preload`, which reads the file when the script is loaded. Call `instantiate()` on it to make a new copy in memory. Add the copy to the level with `add_child`, and set its position before or after adding it.',
        'Each copy is independent. If you spawn fifty rocks from the same saved scene, each one moves on its own, and changing one does not change the others. This is the same idea as placing instances in the editor, but it happens while the game runs.',
        'Spawn from a known position, such as above the top edge, so the object enters the view on purpose rather than appearing in the middle of the screen.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends Node2D

          var rock_scene: PackedScene = preload("res://scenes/rock.tscn")

          func spawn_rock() -> void:
              var rock := rock_scene.instantiate() as Node2D
              rock.position = Vector2(randf_range(40, 600), -20)
              add_child(rock)
        `,
      },
    },
    {
      heading: 'Removing objects that leave the screen',
      paragraphs: [
        'Every spawned rock is a node that Godot must update and draw. If the rock keeps falling forever, the number of nodes keeps growing. The simplest fix is to remove a rock when it passes the bottom of the screen. A `VisibleOnScreenNotifier2D` node can tell you when an object leaves the view.',
        'Remove the node with `queue_free()`, which you used for the coin. Call it when the rock leaves the screen, so the game does not slow down over a long play session.',
        'Keep the rock speed in one variable, so you can tune the difficulty in one place.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends Area2D

          func _physics_process(delta: float) -> void:
              position.y += 180 * delta
              if position.y > 700:
                  queue_free()
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A timer that spawns rocks and cleans them up',
    intro: 'The level spawns a rock every 1.5 seconds. Each rock falls down the screen and removes itself at the bottom. Together, the timer and the cleanup keep the game steady. Read the spawn function, then the rock, in order. The rocks look random, but each one follows the same rules.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        # level.gd
        extends Node2D

        var rock_scene: PackedScene = preload("res://scenes/rock.tscn")

        func _on_spawn_timer_timeout() -> void:
            var rock := rock_scene.instantiate() as Node2D
            rock.position = Vector2(randf_range(40, 600), -20)
            add_child(rock)

        # rock.gd
        extends Area2D

        func _physics_process(delta: float) -> void:
            position.y += 180 * delta
            if position.y > 700:
                queue_free()
      `,
    },
    steps: [
      { code: 'func _on_spawn_timer_timeout() -> void:', explanation: 'Godot calls this function every time the timer finishes its wait. The timer does the counting, so this function only needs to spawn.' },
      { code: 'var rock := rock_scene.instantiate() as Node2D', explanation: 'Creates a new copy of the saved rock scene in memory. Nothing is visible yet.' },
      { code: 'rock.position = Vector2(randf_range(40, 600), -20)\nadd_child(rock)', explanation: 'Places the rock above the top of the screen at a random horizontal position, then adds it to the level so it appears and starts moving.' },
      { code: 'if position.y > 700:\n    queue_free()', explanation: 'When the rock falls past the bottom, it removes itself. The number of rocks in the level stays small.' },
    ],
  },
  tryIt: {
    instructions: [
      'Create a `rock.tscn` scene with an `Area2D` root, a sprite and a collision shape. Attach the falling script above.',
      'Add a `Timer` to the level with a wait time of 1.5 seconds, connect its `timeout` signal, and spawn rocks with the function above.',
      'Run the game for one minute and print the number of children under the level once every ten seconds. Confirm the count stays steady, not growing.',
    ],
  },
  mistakes: [
    { mistake: 'Calling `load()` inside the spawn function, so the scene file is read every time a rock appears.', fix: 'Use `preload` once at the top of the script, and reuse the scene for every rock.' },
    { mistake: 'Forgetting `add_child`, so the copy is created but never appears.', fix: 'Add the new node to the scene tree after you create it.' },
    { mistake: 'Never removing spawned objects, so the game slows down over time.', fix: 'Remove each object when it leaves the screen, with `queue_free()`.' },
  ],
  quiz: [
    {
      question: 'Your timer has a wait time of 2 seconds and is set to repeat. How often does `timeout` fire?',
      options: [
        { text: 'Once, then never again', explanation: 'That is the one-shot setting. A repeating timer keeps firing.' },
        { text: 'Every 2 seconds', explanation: 'Yes. A repeating timer fires each time its wait time passes.' },
        { text: 'Every frame', explanation: 'The timer counts seconds, not frames, so it does not fire every frame.' },
        { text: 'Every 0.2 seconds', explanation: 'That would need a wait time of 0.2. The wait time here is 2 seconds.' },
      ],
      answer: 1,
    },
    {
      question: 'You spawn ten rocks from `rock.tscn`, then change the sprite of one rock in code. What happens to the other nine?',
      options: [
        { text: 'All ten change', explanation: 'Each rock is its own copy, so changing one leaves the others alone.' },
        { text: 'Only that rock changes', explanation: 'Yes. Each instance is a separate node, so only the one you change is affected.' },
        { text: 'The scene file changes', explanation: 'Changing a node at run time does not save anything to the scene file.' },
        { text: 'The game restarts', explanation: 'Changing a sprite does not restart anything.' },
      ],
      answer: 1,
    },
    {
      question: 'A rock falls past the bottom of the screen and calls `queue_free()`. What happens to the rock?',
      options: [
        { text: 'It comes back at the top', explanation: 'Only the spawn timer creates new rocks. The old one is removed.' },
        { text: 'It is removed from the game at the end of the frame', explanation: 'Yes. The node is freed safely, so the number of rocks goes down.' },
        { text: 'It becomes invisible but keeps running', explanation: 'Freeing removes the node. It does not hide it and keep it running.' },
        { text: 'The timer stops', explanation: 'Removing one rock does not stop the timer, which keeps spawning on its own schedule.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Use a timer to spawn copies of a scene with `instantiate()`, and remove each copy when it leaves the screen.',
  resources: [
    { title: 'Object pool pattern', provider: 'Wikipedia', description: 'Reusing objects instead of creating and destroying them, which keeps spawning smooth.', url: 'https://en.wikipedia.org/wiki/Object_pool_pattern' },
    { title: 'Timer node', provider: 'Godot Engine documentation', description: 'The reference for the Timer node, its wait time, and its autostart option.', url: 'https://docs.godotengine.org/en/stable/classes/class_timer.html' },
  ],
}

export default lesson
