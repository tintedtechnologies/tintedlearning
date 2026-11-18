import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Declare a signal and emit it when something happens',
    'Connect a signal to a function, so another node reacts to it',
    'Keep nodes independent by sending events upward instead of reaching into other nodes',
  ],
  bigIdea: 'A signal is a message a node sends when something happens, such as a coin being collected. Other nodes connect to the signal and react without the sender needing to know who is listening. This keeps a coin from having to know about the score label or the level.',
  whyItMatters: 'When the coin is collected, the score must go up, the sound must play and the level may need to check for a win. If the coin reaches into every one of those nodes, a change to the score label breaks the coin. Signals let the coin announce the pickup, and each node decides what to do with it. Without signals, adding a sound effect or a score popup means editing the coin again, and the coin grows with every feature.',
  goalSections: [
    {
      heading: 'Declaring and emitting a signal',
      paragraphs: [
        'Declare a signal at the top of a script with the word `signal`, then a name. `signal coin_collected` creates an event that the coin can send. Name signals in the past tense, such as `coin_collected` or `player_died`, because they describe something that has already happened.',
        'Send the signal with `.emit()`. You can pass information along with it, such as the number of points. Emitting a signal does not do anything by itself. It only tells connected nodes that the event happened.',
        'The name of a signal is part of its contract. Renaming a signal means every connection to it must change too, so choose the name once and keep it.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends Area2D

          signal coin_collected(points: int)

          func _ready() -> void:
              body_entered.connect(_on_body_entered)

          func _on_body_entered(body: Node2D) -> void:
              if body.is_in_group("player"):
                  coin_collected.emit(10)
                  queue_free()
        `,
      },
    },
    {
      heading: 'Connecting a signal to a function',
      figures: [
        { src: "/lesson-images/godot/signals-tab.webp", alt: "The Inspector area with its Inspector, Signals, and Groups tabs, with the Signals tab highlighted.", caption: "Click the Signals tab next to the Inspector to see the signals a node can send, such as pressed().", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html" } },
        { src: "/lesson-images/godot/connect-signal-dialog.webp", alt: "The Connect a Signal to a Method dialog for the pressed signal, with a receiver method name filled in.", caption: "Choose the function that should receive the signal, then click Connect. Godot suggests a name such as _on_button_pressed.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html" } },
      ],
      paragraphs: [
        'A listener connects to the signal with `connect`. Write the connection in `_ready()`, or use the Signals tab. The function you connect must accept the same arguments that the signal sends. If the signal passes an integer, the handler takes an integer.',
        'Connections are one-way. The coin does not know the listener exists. You can connect the same signal to several listeners, such as the score label, the sound player and the level, and each one reacts on its own.',
        'Connect in code when the connection depends on the scene, and in the Signals tab when it is fixed in the editor.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends Label

          var score := 0

          func _ready() -> void:
              var coin = get_node("../Coin")
              coin.coin_collected.connect(_on_coin_collected)

          func _on_coin_collected(points: int) -> void:
              score += points
              text = "Score: " + str(score)
        `,
      },
    },
    {
      heading: 'Sending events upward instead of reaching into other nodes',
      paragraphs: [
        'A node that reaches into another node with a long path, such as `get_node("../../UI/ScoreLabel")`, breaks as soon as the scene tree changes. Paths are fragile. A signal sent upward is safer, because the parent or level connects the pieces when the scene starts.',
        'A useful rule is that a child emits a signal and a parent decides what to do. The coin says a coin was collected. The level then updates the score, plays a sound and checks whether the level is complete.',
        'A useful test is to ask who needs to know about the event. If the answer is only the parent, connect to the parent. If many nodes need it, the signal is the right tool.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends Node2D

          func _ready() -> void:
              for coin in $Coins.get_children():
                  coin.coin_collected.connect(_on_coin_collected)

          func _on_coin_collected(points: int) -> void:
              print("Level received ", points, " points")
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A coin tells the level it was collected',
    intro: 'The coin does not change the score itself. It emits `coin_collected` with the points, and the level receives the signal and decides what to do. Trace one coin pickup from the first line of the coin script to the last line of the level script. Each step follows the message from its sender to its receiver.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        # coin.gd
        extends Area2D

        signal coin_collected(points: int)

        func _ready() -> void:
            body_entered.connect(_on_body_entered)

        func _on_body_entered(body: Node2D) -> void:
            if body.is_in_group("player"):
                coin_collected.emit(10)
                queue_free()

        # level.gd
        extends Node2D

        func _ready() -> void:
            for coin in $Coins.get_children():
                coin.coin_collected.connect(_on_coin_collected)

        func _on_coin_collected(points: int) -> void:
            print("Level received ", points, " points")
      `,
    },
    steps: [
      { code: 'func _ready() -> void:\n    body_entered.connect(_on_body_entered)', explanation: 'Connects the coin to its own body_entered signal, so Godot calls the handler when the player touches the coin.' },
      { code: 'signal coin_collected(points: int)', explanation: 'The coin declares an event that carries a whole number of points.' },
      { code: 'coin_collected.emit(10)', explanation: 'When the player touches the coin, the coin sends the event with the value 10.' },
      { code: 'coin.coin_collected.connect(_on_coin_collected)', explanation: 'In the level script, every coin under `Coins` is connected once, when the level starts.' },
      { code: 'func _on_coin_collected(points: int) -> void:', explanation: 'The level receives the 10 points and prints them. The coin never called the level by name, so you can rename or move the level without touching the coin.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add the `coin_collected` signal to your coin script and emit it when the player touches the coin.',
      'Add a `Label` to the level and a script that connects every coin to a handler, then updates the label text with the score.',
      'Collect three coins and confirm the label reads "Score: 30".',
    ],
  },
  mistakes: [
    { mistake: 'Connecting a signal to a function with different arguments.', fix: 'Match the signal’s types exactly. A signal with `points: int` needs a handler that takes one integer.' },
    { mistake: 'Calling a node through a long path such as `get_node("../../UI/Score")`.', fix: 'Emit a signal from the child and connect it from the parent, so the path is not needed.' },
    { mistake: 'Connecting the same signal again every frame.', fix: 'Connect in `_ready()`, which runs once when the node enters the scene.' },
  ],
  quiz: [
    {
      question: 'A coin emits `coin_collected.emit(10)`, and nothing is connected to it. What happens?',
      options: [
        { text: 'The game crashes', explanation: 'Emitting a signal with no connections is allowed. Nothing crashes.' },
        { text: 'Nothing visible happens', explanation: 'Yes. The signal is sent, but no node is listening, so nothing reacts.' },
        { text: 'The score goes up by 10 automatically', explanation: 'A signal does not change the score by itself. A connected function must do that.' },
        { text: 'The coin is removed', explanation: 'Removal is a separate line, such as `queue_free()`. Emitting the signal does not remove the coin.' },
      ],
      answer: 1,
    },
    {
      question: 'The signal is declared as `signal coin_collected(points: int)`. Which handler can it be connected to?',
      options: [
        { text: '`func _on_coin_collected() -> void:`', explanation: 'That handler takes no arguments, but the signal sends one integer.' },
        { text: '`func _on_coin_collected(points: int) -> void:`', explanation: 'Yes. The handler matches the signal’s argument type and count.' },
        { text: '`func _on_coin_collected(points: String) -> void:`', explanation: 'The signal sends an integer, so a string argument does not match.' },
        { text: '`func _on_coin_collected(a: int, b: int) -> void:`', explanation: 'That handler expects two arguments, but the signal sends one.' },
      ],
      answer: 1,
    },
    {
      question: 'Why do many Godot projects prefer signals over a child node calling `get_node("../../Score")`?',
      options: [
        { text: 'Signals make the game run faster on every frame', explanation: 'Speed is not the reason. Signals make the parts of the game less tangled.' },
        { text: 'A signal keeps working when the scene tree changes, while a long path can break', explanation: 'Yes. The child does not depend on the exact path to the score.' },
        { text: 'Paths cannot point to labels', explanation: 'Paths can point to labels. The problem is that they break when the tree changes.' },
        { text: 'Signals can only be used in `_ready()`', explanation: 'Signals can be emitted from any function. `_ready()` is only a common place to connect them.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'A node emits a signal when something happens, and other nodes connect to that signal and decide how to react.',
  resources: [
    { title: 'Observer pattern', provider: 'Wikipedia', description: 'The design pattern behind signals: one object announces an event, and others react.', url: 'https://en.wikipedia.org/wiki/Observer_pattern' },
    { title: 'Signals', provider: 'Godot Engine documentation', description: 'How signals connect one node\'s event to another node\'s function.', url: 'https://docs.godotengine.org/en/stable/getting_started/step_by_step/signals.html' },
  ],
}

export default lesson
