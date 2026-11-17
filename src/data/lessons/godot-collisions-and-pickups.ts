import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Add a collision shape to a body or area, so Godot can detect hits',
    'Use an `Area2D` to detect when the player touches a coin',
    'Remove a coin from the game after it is collected',
  ],
  bigIdea: 'Godot detects contact with collision shapes. A `CollisionShape2D` gives a body or area a shape, and layers and masks decide which things can touch. An `Area2D` reports when another body enters its shape, which is how a coin knows the player has picked it up.',
  whyItMatters: 'Your coin game ends in a fast loop of picking up coins. If the coin does not notice the player, nothing scores. If it notices but never disappears, the player collects the same coin forever. A collision shape, one signal and one removal line handle the whole pickup. Pickups are where simple coin games often go wrong, so a short, tested pickup saves time later.',
  goalSections: [
    {
      heading: 'Giving things a collision shape',
      figures: [
        { src: "/lesson-images/godot/area2d-coin-nodes.webp", alt: "The Scene dock with an Area2D root that has a Sprite2D child and a CollisionShape2D child.", caption: "A coin scene has an Area2D root, a Sprite2D for the picture, and a CollisionShape2D for the area that detects contact.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/tutorials/physics/using_area_2d.html" } },
        { src: "/lesson-images/godot/area2d-collision-layers.webp", alt: "The Area2D Inspector with the Collision section, showing the Layer and Mask checkboxes.", caption: "In the Inspector, the Collision section holds Layer and Mask. Layer sets the layers the area sits on, and Mask sets the layers it checks for contact.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/tutorials/physics/using_area_2d.html" } },
      ],
      paragraphs: [
        'A collision shape is a region that Godot uses for contact tests. Add a `CollisionShape2D` child to a node, then choose a shape such as `RectangleShape2D` or `CircleShape2D` in the Inspector. Resize it so it covers the sprite, but not much more. A shape that is too big can detect a hit before the player visibly touches the coin.',
        'Collision layers and masks decide what can hit what. Put the player on a layer called `player`, and the coin on a layer called `pickup`. Set the coin’s mask to include `player`. Then only the player triggers the coin, and walls or enemies do not.',
        'Keep shapes simple, such as a circle or a rectangle. Simple shapes are cheap to check, and they are easy to resize in the Inspector when a sprite changes.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Coin (Area2D)
          ├── Sprite2D
          └── CollisionShape2D
                Shape: CircleShape2D (radius 12)

          Collision settings for Coin:
            Layer: pickup
            Mask:  player
        `,
      },
    },
    {
      heading: 'Detecting a pickup with Area2D',
      paragraphs: [
        'An `Area2D` does not stop other bodies. It only reports when they overlap. Use it for things you walk through, such as a coin, a checkpoint or a damage zone. A `body_entered` signal fires when a body enters the area, and the body is passed to your function.',
        'Connect the signal in the Signals tab, or in code from `_ready()`. Name the handler `_on_body_entered`, which is the name Godot suggests. Inside it, check that the body is the player before you score, because other bodies may also enter the area.',
        'Every area and body you add costs a little work for the physics engine, so use areas only where you need detection. A background tile does not need a collision shape that reports overlaps.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends Area2D

          func _ready() -> void:
              body_entered.connect(_on_body_entered)

          func _on_body_entered(body: Node2D) -> void:
              if body.is_in_group("player"):
                  print("Coin collected")
        `,
      },
    },
    {
      heading: 'Removing the coin after pickup',
      paragraphs: [
        '`queue_free()` removes a node from the scene at the end of the current frame. Call it on the coin after you score, so the coin cannot be collected twice. Godot frees the node safely, even though the signal is still running.',
        'Do not use `free()` directly inside a signal from a physics body. Calling `queue_free()` is the safe choice in Godot, because it waits until the frame is over.',
        'When a pickup behaves oddly, print the name of the body that entered before you add rules. The printed name shows which body the area actually detected.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          func _on_body_entered(body: Node2D) -> void:
              if body.is_in_group("player"):
                  print("+10 points")
                  queue_free()
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A coin that scores once and disappears',
    intro: 'This complete coin script waits for the player to enter its area, scores once, and removes itself. The player is found by its group, which is a tag you add in the Groups tab. Read the handler from top to bottom. Watch the order of the steps: the score changes before the coin is removed.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        extends Area2D

        func _ready() -> void:
            body_entered.connect(_on_body_entered)

        func _on_body_entered(body: Node2D) -> void:
            if body.is_in_group("player"):
                print("+10 points")
                queue_free()
      `,
    },
    steps: [
      { code: 'extends Area2D', explanation: 'The coin is an area, so it reports overlaps without stopping the player from walking through it.' },
      { code: 'body_entered.connect(_on_body_entered)', explanation: 'Tells Godot to call `_on_body_entered` whenever a body enters the coin’s shape.' },
      { code: 'if body.is_in_group("player"):', explanation: 'Checks the group tag. Only the player is in the `player` group, so walls and other coins are ignored.' },
      { code: 'print("+10 points")\nqueue_free()', explanation: 'Shows the points and removes the coin. The next lesson sends the points to the game. The coin can no longer be collected a second time.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a `coin.tscn` scene with an `Area2D` root, a `Sprite2D` and a `CircleShape2D`. Save it.',
      'Add the player to the group `player` in the Groups tab, then attach the coin script above.',
      'Place three coins in `main.tscn`, press Play, and walk into each one. Confirm each coin disappears and the message appears once per coin.',
    ],
  },
  mistakes: [
    { mistake: 'Using a `CharacterBody2D` for a coin, so the player bumps into it instead of passing through.', fix: 'Use an `Area2D` for pickups. Areas detect overlaps without blocking movement.' },
    { mistake: 'Scoring without checking which body entered.', fix: 'Check the group first, because walls and other bodies can also enter the area.' },
    { mistake: 'Forgetting `queue_free()`, so the coin can be collected many times.', fix: 'Remove the coin in the same handler that scores it.' },
  ],
  quiz: [
    {
      question: 'You want a coin to let the player walk through it and still detect the touch. Which node should be its root?',
      options: [
        { text: '`CharacterBody2D`', explanation: 'A character body moves and blocks other bodies. A coin should not block the player.' },
        { text: '`Area2D`', explanation: 'Yes. An area reports overlaps without stopping the player.' },
        { text: '`Timer`', explanation: 'A timer counts time. It does not detect touches.' },
        { text: '`Label`', explanation: 'A label shows text. It cannot detect contact.' },
      ],
      answer: 1,
    },
    {
      question: 'The coin scores the player and then calls `queue_free()`. A second player enters the same coin in the next frame. What happens?',
      options: [
        { text: 'The score goes up twice', explanation: 'The coin is removed at the end of the frame, so it cannot score again after that.' },
        { text: 'The coin is removed, so nothing else happens', explanation: 'Yes. Once the coin is queued for removal, it is gone and scores nothing more.' },
        { text: 'The game crashes', explanation: 'Freeing the node is safe, so the game does not crash.' },
        { text: 'The coin moves to the player', explanation: 'The coin is removed, not moved. It does not follow the player.' },
      ],
      answer: 1,
    },
    {
      question: 'Walls and coins both overlap the `Area2D` of a coin. Which check keeps the score correct?',
      options: [
        { text: '`if body.is_in_group("player"):`', explanation: 'Yes. The check scores only when the body is in the player group.' },
        { text: '`if body.visible:`', explanation: 'Visibility does not identify the player. A wall can be visible too.' },
        { text: 'No check is needed', explanation: 'Without a check, every body that enters the coin would score.' },
        { text: '`if body.position.x > 0:`', explanation: 'That tests a position, which says nothing about whether the body is the player.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Use an `Area2D` with a collision shape to detect a pickup, check which body touched it, and remove the pickup with `queue_free()` after scoring.',
  resources: [
    { title: 'Collision shapes and areas', provider: 'Godot Engine', description: 'The official overview of collision shapes, areas and the physics layers they use.', url: 'https://docs.godotengine.org/en/stable/tutorials/physics/collision_shapes_2d.html' },
  ],
}

export default lesson
