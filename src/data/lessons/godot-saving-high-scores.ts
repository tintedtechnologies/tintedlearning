import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Save a value to a file the player’s computer keeps, using `ConfigFile`',
    'Load a saved value when the game starts, and use a default if no file exists yet',
    'Save a high score only when the player beats the old one',
  ],
  bigIdea: 'A game can save data to a file in the `user://` folder, which belongs to the player and survives closing the game. `ConfigFile` stores named values in sections, similar to a settings file. When the game starts, it loads the file, and when the score beats the best, it saves again.',
  whyItMatters: 'Your coin game is more fun when the player can try to beat their best score. If the best score resets every time the game closes, there is nothing to beat. Saving is short, but it has to handle the missing file on the first run, and it must not overwrite a better score with a worse one. Players trust a game that remembers their progress, and they stop trusting it the first time a score disappears.',
  goalSections: [
    {
      heading: 'Saving values with ConfigFile',
      paragraphs: [
        'Use `ConfigFile.new()` to create the file object. Call `set_value` with a section name, a key and a value, such as the section `scores` and the key `best`. Then call `save` with a path. The path `user://save.cfg` stores the file in a folder that Godot chooses for each player, so you do not need to know where it is.',
        'Sections keep related values together. You might later add a `settings` section for volume without touching the score. The file is plain text, so you can open it to check what was saved.',
        'The user:// folder exists on every computer Godot supports, but the exact location differs from system to system. Your code never needs to know it.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          var config := ConfigFile.new()
          config.set_value("scores", "best", 120)
          config.save("user://save.cfg")
        `,
      },
    },
    {
      heading: 'Loading with a default value',
      paragraphs: [
        'Call `load` to read the file back. It returns an error code. If the code is `OK`, the file exists and you can read it. If the player has never played before, the file is missing, and `load` returns an error. Your game must handle that case without crashing.',
        'Use `get_value` with a default, such as `0`. When the file is missing, the default is returned, so the game starts with a best score of zero. This avoids a special check everywhere you read the value.',
        'Store only what you need, such as one number, so the file stays small and simple to check.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          var config := ConfigFile.new()
          var best := 0
          if config.load("user://save.cfg") == OK:
              best = config.get_value("scores", "best", 0)
        `,
      },
    },
    {
      heading: 'Saving only a better score',
      paragraphs: [
        'Compare the score with the saved best before you write the file. Writing to disk takes time, and it is only needed when the score changes. Save only when the new score is higher, so the best score never goes down.',
        'Keep the saving code in one function, such as `save_best_score`. Call it when the game ends, not on every coin. Saving on every coin is slow and gives the player no benefit.',
        'Test the save path by closing and reopening the game. A save that works only during one session is not a save.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          func save_best_score(score: int) -> void:
              if score <= best:
                  return
              best = score
              var config := ConfigFile.new()
              config.set_value("scores", "best", best)
              config.save("user://save.cfg")
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Loading and saving a best score',
    intro: 'This script loads the best score when the game starts and saves a new best only when the player beats it. The file is missing on the first run, so the default value of zero is used. Read the load step first, then the save step. Nothing here changes the score during play. The code only reads and writes the best value.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        extends Node

        const SAVE_PATH := "user://save.cfg"
        var best := 0

        func _ready() -> void:
            var config := ConfigFile.new()
            if config.load(SAVE_PATH) == OK:
                best = config.get_value("scores", "best", 0)
            print("Best score: ", best)

        func save_best_score(score: int) -> void:
            if score <= best:
                return
            best = score
            var config := ConfigFile.new()
            config.set_value("scores", "best", best)
            config.save(SAVE_PATH)
      `,
    },
    steps: [
      { code: 'const SAVE_PATH := "user://save.cfg"', explanation: 'Stores the file path in one place. If you change it later, you change one line.' },
      { code: 'if config.load(SAVE_PATH) == OK:', explanation: 'Reads the file only if it exists and loads correctly. On a first run, the check fails and the best score stays at zero.' },
      { code: 'if score <= best:\n    return', explanation: 'Stops early when the score is not a new best, so the file is not written for a worse score.' },
      { code: 'config.save(SAVE_PATH)', explanation: 'Writes the new best score to disk, so it is still there the next time the game starts.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add the `save_best_score` function and the loading code above to your game’s score script.',
      'Play once, collect some coins, and let the game end. Check the printed best score on the next launch.',
      'Play again and score lower than your best. Confirm the saved best does not change.',
    ],
  },
  mistakes: [
    { mistake: 'Saving a file path such as `C:/games/save.cfg` that works on one computer only.', fix: 'Use `user://`, which Godot maps to a folder that belongs to the player on each system.' },
    { mistake: 'Assuming the file always exists, so the game crashes on the first run.', fix: 'Check that `load` returns `OK`, and use a default when it does not.' },
    { mistake: 'Saving on every coin instead of when the game ends.', fix: 'Save once, in the function that ends the game, to keep the game smooth.' },
  ],
  quiz: [
    {
      question: 'The player has never played before, so `config.load("user://save.cfg")` returns an error. With `get_value("scores", "best", 0)`, what is `best`?',
      options: [
        { text: '0', explanation: 'Yes. When the value is missing, `get_value` returns the default, which is 0 here.' },
        { text: '-1', explanation: 'The default in this code is 0. Negative one is not used.' },
        { text: 'The game crashes', explanation: 'The code checks the error first, and the default avoids reading a value that does not exist.' },
        { text: 'An empty string', explanation: 'The default is a number, so the value is a number, not a string.' },
      ],
      answer: 0,
    },
    {
      question: 'The best score is 120. A new score of 90 ends the game. What does `save_best_score(90)` do?',
      options: [
        { text: 'Saves 90 as the new best', explanation: 'That would make the best score go down. The function returns early for a lower score.' },
        { text: 'Returns early and leaves the file alone', explanation: 'Yes. A score that is not higher than the best does not change the saved value.' },
        { text: 'Adds 90 to the best score', explanation: 'The function never adds scores. It only compares and replaces the best.' },
        { text: 'Deletes the save file', explanation: 'The function does not delete anything. It returns early.' },
      ],
      answer: 1,
    },
    {
      question: 'Why is `user://save.cfg` better than a fixed path such as `C:/games/save.cfg`?',
      options: [
        { text: 'It makes the file load faster', explanation: 'Speed is not the reason. The path has to work on every player’s computer.' },
        { text: 'It works on every computer, because Godot chooses a folder that belongs to the player', explanation: 'Yes. A fixed drive letter exists on one system only, but `user://` maps to a valid location everywhere.' },
        { text: 'It encrypts the file automatically', explanation: 'The `user://` path does not encrypt anything. It only chooses where the file goes.' },
        { text: 'It stops players from changing the score', explanation: 'A saved text file can be edited by hand. Keeping scores honest is a separate problem.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Save to `user://` with `ConfigFile`, load with a default for the first run, and write only when the player beats the best score.',
  resources: [
    { title: 'Saving games', provider: 'Godot Engine documentation', description: 'How to save and load data between sessions in Godot.', url: 'https://docs.godotengine.org/en/stable/tutorials/io/saving_games.html' },
    { title: 'ConfigFile', provider: 'Godot Engine', description: 'The official reference for saving and loading named values with ConfigFile.', url: 'https://docs.godotengine.org/en/stable/classes/class_configfile.html' },
  ],
}

export default lesson
