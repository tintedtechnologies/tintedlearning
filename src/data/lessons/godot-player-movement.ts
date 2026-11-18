import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read keyboard input with `Input.get_axis`, and turn it into a direction',
    'Set a velocity and let `move_and_slide()` move the player and stop at walls',
    'Move the player smoothly by running the movement code every physics frame',
  ],
  bigIdea: 'A player moves by setting a velocity, which is a direction and a speed. The physics step then moves the body by that velocity times the time since the last step. A `CharacterBody2D` does this with `move_and_slide()`, which also stops the body at walls and floors.',
  whyItMatters: 'Your coin game only feels good if the player responds at once, moves at a steady speed, and stops at walls. If you set the position directly each frame, the player walks through walls and jitters. Setting a velocity and letting the physics step move the body fixes both problems at once. Players notice a delay or a slide in the first second, so small details here shape how the whole game feels.',
  goalSections: [
    {
      heading: 'Reading input as a direction',
      figures: [
        { src: "/lesson-images/godot/input-map.webp", alt: "The Project Settings window on the Input Map tab, listing actions such as ui_accept with their keys.", caption: "Open Project Settings and choose the Input Map tab. Type a name in Add New Action and click Add. Use the plus button on an action to add a key.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/tutorials/inputs/input_examples.html" } },
      ],
      paragraphs: [
        'Godot has named input actions, such as `ui_left` and `ui_right`, which map to the arrow keys by default. You can add keys such as A and D, or create your own action names, in the Input Map in Project Settings. `Input.get_axis("ui_left", "ui_right")` returns -1 when only left is held, 1 when only right is held, and 0 when neither or both are held.',
        'Combine two axes to move in two directions at once. `Input.get_vector` returns a direction with a length of up to 1, so diagonal movement is not faster than straight movement.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          var direction := Input.get_axis("ui_left", "ui_right")
          # left held:  -1.0
          # right held:  1.0
          # neither:     0.0
        `,
      },
    },
    {
      heading: 'Setting velocity and moving',
      paragraphs: [
        'A `CharacterBody2D` has a property called `velocity`. Set it to the direction times the speed, then call `move_and_slide()`. That function moves the body by `velocity * delta`, so the speed stays the same on any computer. It also stops the body when it hits a wall or floor.',
        'Set the horizontal velocity every frame, even when no key is held. If you do not, the player keeps moving after you let go, because the last value stays in place.',
        'A player that stops the moment you release a key feels more responsive than one that slides. Setting velocity.x to zero each step is what makes that stop feel immediate.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends CharacterBody2D

          @export var speed: float = 300.0

          func _physics_process(delta: float) -> void:
              var direction := Input.get_axis("ui_left", "ui_right")
              velocity.x = direction * speed
              move_and_slide()
        `,
      },
    },
    {
      heading: 'Running movement in the physics step',
      paragraphs: [
        '`_physics_process(delta)` runs at a fixed rate, separately from the drawing rate. Godot uses the same fixed steps on every computer, which keeps collisions reliable. Put movement and collisions there, and keep `_process` for visual effects that do not affect the game rules.',
        'Gravity is not built in, so a side-scrolling game adds it to the vertical velocity. Add gravity with `velocity.y += gravity * delta` before `move_and_slide()`. Later, a jump sets `velocity.y` to a negative number, because up is negative on the screen.',
        'Keep the physics code in one function, so every rule about movement lives in one place. When the player feels wrong, you know where to look. Keeping movement in the physics step also makes the game easier to test, because every run follows the same schedule.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          @export var gravity: float = 900.0

          func _physics_process(delta: float) -> void:
              if not is_on_floor():
                  velocity.y += gravity * delta
              move_and_slide()
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A player that walks and stops at walls',
    intro: 'This complete player script moves left and right, and it falls with gravity when it is not on the floor. The player never passes through a wall, because `move_and_slide()` checks each move. Read the function from top to bottom, and notice that the gravity check comes before the input.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        extends CharacterBody2D

        @export var speed: float = 300.0
        @export var gravity: float = 900.0

        func _physics_process(delta: float) -> void:
            if not is_on_floor():
                velocity.y += gravity * delta
            var direction := Input.get_axis("ui_left", "ui_right")
            velocity.x = direction * speed
            move_and_slide()
      `,
    },
    steps: [
      { code: '@export var speed: float = 300.0', explanation: 'Sets the walking speed to 300 pixels per second. You can change it in the Inspector while you test.' },
      { code: 'if not is_on_floor():\n    velocity.y += gravity * delta', explanation: 'When the player is in the air, the vertical speed grows a little each physics step. That is how gravity pulls the player down.' },
      { code: 'var direction := Input.get_axis("ui_left", "ui_right")', explanation: 'Reads the keys each step. The value is -1 for left, 1 for right, and 0 when neither is pressed.' },
      { code: 'velocity.x = direction * speed\nmove_and_slide()', explanation: 'Sets the walking speed for this step, then moves the body. When the direction is 0, the player stops at once, and walls stop the body before it passes through.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a `CharacterBody2D` with a `CollisionShape2D` and a `Sprite2D`, and attach the script above.',
      'Place a floor with a `StaticBody2D` and a wall beside the player, then press Play.',
      'Change `speed` in the Inspector. Walk into the wall and confirm the player stops at the wall, not inside it.',
    ],
  },
  mistakes: [
    { mistake: 'Setting `position` directly each frame, which moves the player through walls.', fix: 'Set `velocity` and call `move_and_slide()`, so Godot checks collisions for you.' },
    { mistake: 'Leaving the velocity from the last key press, so the player keeps sliding.', fix: 'Set `velocity.x` every physics step, even when the direction is 0.' },
    { mistake: 'Moving the player in `_process` instead of `_physics_process`.', fix: 'Use `_physics_process(delta)` for movement, because the physics steps keep collisions reliable.' },
  ],
  quiz: [
    {
      question: 'The right arrow key is held, and `speed` is 300. What is `velocity.x` after `velocity.x = direction * speed` runs?',
      options: [
        { text: '-300', explanation: 'A negative value means left. Right is the positive direction.' },
        { text: '300', explanation: 'Yes. Right gives a direction of 1, and 1 times 300 is 300.' },
        { text: '0', explanation: 'Zero means not moving. Holding right gives a direction of 1.' },
        { text: '1', explanation: 'That is the direction, not the speed. The speed is multiplied in.' },
      ],
      answer: 1,
    },
    {
      question: 'A player holds no keys and the code sets `velocity.x = direction * speed` each physics step. What happens?',
      options: [
        { text: 'The player keeps sliding at the last speed', explanation: 'The velocity is reset to zero each step, so the player stops.' },
        { text: 'The player stops', explanation: 'Yes. A direction of 0 makes the horizontal velocity 0 on every step.' },
        { text: 'The game crashes', explanation: 'That line is valid, and it does not crash the game.' },
        { text: 'The player moves up', explanation: 'That line only changes horizontal velocity, so the player does not move up.' },
      ],
      answer: 1,
    },
    {
      question: 'Why is movement placed in `_physics_process(delta)` instead of `_process`?',
      options: [
        { text: 'The physics step runs at a fixed rate, which keeps collisions reliable', explanation: 'Yes. The physics step keeps movement and collisions consistent across computers.' },
        { text: 'Only `_physics_process` can read the keyboard', explanation: 'Both functions can read input. The reason is the fixed physics rate.' },
        { text: '`_process` cannot use variables', explanation: 'It can use variables. This is not about variables.' },
        { text: '`_physics_process` runs only once', explanation: 'It runs every physics step, which is why movement belongs there.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Read input as a direction, set the velocity every physics step, and let `move_and_slide()` move the body and stop it at walls.',
  resources: [
    { title: 'Physics introduction', provider: 'Godot Engine documentation', description: 'How bodies, velocity, and movement work in Godot\'s physics system.', url: 'https://docs.godotengine.org/en/stable/tutorials/physics/physics_introduction.html' },
    { title: 'Using CharacterBody2D', provider: 'Godot Engine', description: 'The official guide to moving a character body with velocity and collisions.', url: 'https://docs.godotengine.org/en/stable/tutorials/physics/using_character_body_2d.html' },
  ],
}

export default lesson
