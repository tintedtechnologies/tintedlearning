import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Declare variables with types, and change them while the game runs',
    'Write functions that run when a node starts and on every frame',
    'Use `if` statements to choose what happens next',
  ],
  bigIdea: 'GDScript is the language Godot uses for game code. You attach a script to a node, and the script runs with that node, using its properties and functions. Variables store the numbers and words your game needs, and functions run the rules.',
  whyItMatters: 'Your coin game needs a score that goes up when the player collects a coin, and a rule that ends the game when time runs out. Both need a variable that changes and a check that decides what happens. Without these basics, every feature you add to the game becomes guesswork. A missing check, such as a game over test that never runs, can leave a level with no way to end.',
  goalSections: [
    {
      heading: 'Declaring variables',
      paragraphs: [
        'A variable is a named box that holds a value. Declare one with `var`, then the name, then the value. `var score := 0` creates a variable called `score` that holds the whole number 0. The `:=` tells Godot to work out the type from the value, which is an integer here. You can also write the type yourself, as in `var speed: float = 300.0`.',
        'Use `@export` before a variable to show it in the Inspector. A designer can then change the speed without opening the script. This is useful when you want to tune a game without editing code.',
        'Assign a new value with a single equals sign, and compare with two equals signs. Mixing them up is one of the most common beginner mistakes in any language, so check every if line you write.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          extends CharacterBody2D

          @export var speed: float = 300.0
          var score := 0
          var lives: int = 3
        `,
      },
    },
    {
      heading: 'Writing functions for frames and events',
      paragraphs: [
        '`_ready()` runs once, when the node enters the scene. Use it to set things up, such as connecting a signal or loading an image. `_physics_process(delta)` runs every physics frame, and `delta` gives the seconds since the last frame. Put movement and other per-frame rules there.',
        'You can also write your own functions. A function starts with `func`, its name, and parentheses for inputs. `func add_point() -> void:` is a function that does not return a value. Name functions with verbs, such as `collect_coin` or `take_hit`, so the code reads like the rule it follows.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          func _ready() -> void:
              print("Player is ready")

          func add_point() -> void:
              score += 1
              print("Score is now ", score)
        `,
      },
    },
    {
      heading: 'Choosing with if statements',
      paragraphs: [
        'An `if` statement runs its block only when a condition is true. Use it for rules such as the game ending when lives reach zero. Godot needs the block indented under the `if`, and it uses a colon at the end of the line, just like Python.',
        'Compare values with `==` for equal, `!=` for not equal, and `<` or `>` for size. Use `elif` for a second choice and `else` for everything left. Keep conditions short, so you can read them at a glance.',
        'Godot’s style guide uses lowercase names with underscores, such as move_speed, for variables and functions. Test each condition by reading it aloud. If the sentence sounds wrong, the condition is probably wrong too.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          func take_hit() -> void:
              lives -= 1
              if lives == 0:
                  print("Game over")
              elif lives == 1:
                  print("One life left")
              else:
                  print("Lives left: ", lives)
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A score and lives system',
    intro: 'This script keeps a score and a count of lives. Coins add points, and hits remove a life. The `if` statement ends the game when lives reach zero. Read it top to bottom and follow one coin and one hit. The output shows what the rule did, so you can check it against the rule you meant to write.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        extends Node

        var score := 0
        var lives: int = 3

        func collect_coin() -> void:
            score += 10
            print("Score: ", score)

        func take_hit() -> void:
            lives -= 1
            if lives == 0:
                print("Game over with ", score, " points")
            else:
                print("Lives left: ", lives)
      `,
    },
    steps: [
      { code: 'extends Node', explanation: 'Says this script adds behavior to a `Node`. Every script starts with an `extends` line that names the type of node it belongs to.' },
      { code: 'var score := 0\nvar lives: int = 3', explanation: 'Two variables that hold the state. `score` starts at zero, and `lives` starts at three.' },
      { code: 'func collect_coin() -> void:\n    score += 10', explanation: 'Each coin adds 10 points. `+=` adds to the current value, so the score keeps growing.' },
      { code: 'func take_hit() -> void:\n    lives -= 1\n    if lives == 0:', explanation: 'A hit removes one life. The `if` check ends the game only when the count reaches zero, not before.' },
    ],
  },
  tryIt: {
    instructions: [
      'Create a script for a `Node` in your `coin-dash` project and paste the score and lives code from this lesson.',
      'Add a `func _ready() -> void:` that prints the starting score and lives.',
      'Add a button or key press later, or call `take_hit()` from `_ready()` for now, and check that the output says "Lives left: 2".',
    ],
  },
  mistakes: [
    { mistake: 'Using `=` where you meant `==`, so the condition sets a value instead of comparing it.', fix: 'Use `==` in `if` statements. A single `=` is for assignment only.' },
    { mistake: 'Writing a variable name with a typo, such as `scroe`, and getting a new empty variable.', fix: 'Read the error in the Debugger panel. Godot names the line and the unknown identifier.' },
    { mistake: 'Putting movement code in `_ready()`, so it runs only once.', fix: 'Use `_physics_process(delta)` for anything that must happen every frame.' },
  ],
  quiz: [
    {
      question: 'After `collect_coin()` runs three times, what does `score` hold? `var score := 0` and each call adds 10.',
      options: [
        { text: '3', explanation: 'That counts the calls. Each call adds 10 points to the score.' },
        { text: '30', explanation: 'Yes. Three calls of 10 points each add up to 30.' },
        { text: '10', explanation: 'That is only one call. The function ran three times.' },
        { text: '0', explanation: 'The score starts at 0, and each call adds to it, so it is not still 0.' },
      ],
      answer: 1,
    },
    {
      question: 'Lives start at 1. A hit runs `lives -= 1`, then `if lives == 0`. What does the output show?',
      options: [
        { text: 'Lives left: 0', explanation: 'That is printed only in the `else` branch. The `if` branch runs when lives are zero.' },
        { text: 'Game over', explanation: 'Yes. One hit takes lives from 1 to 0, so the `if` branch runs.' },
        { text: 'Nothing, because `lives` cannot change', explanation: 'Variables can change with `-=`. This one does change.' },
        { text: 'An error, because the value is 1', explanation: 'A value of 1 is valid for a number. There is no error here.' },
      ],
      answer: 1,
    },
    {
      question: 'You want the speed to be changed from the Inspector without editing code. Which line makes that possible?',
      options: [
        { text: '`var speed: float = 300.0`', explanation: 'A normal variable is hidden from the Inspector. It must be exported to show there.' },
        { text: '`@export var speed: float = 300.0`', explanation: 'Yes. The `@export` line shows the variable in the Inspector so a designer can change it.' },
        { text: '`func speed() -> float`', explanation: 'A function is code, not a value you set in the Inspector.' },
        { text: '`speed := "300"`', explanation: 'That makes a text value, not a number, so movement would not work.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Store state in variables, run rules in functions, and use `if` statements to decide what happens next.',
  resources: [
    { title: 'GDScript reference', provider: 'Godot Engine', description: 'The official reference for the GDScript language, with every keyword and built-in function.', url: 'https://docs.godotengine.org/en/stable/classes/class_@gdscript.html' },
  ],
}

export default lesson
