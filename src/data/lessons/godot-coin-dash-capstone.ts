import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Combine a player, coins, hazards, a score and a game over screen into one playable level',
    'Export the game for your own computer, and test the exported copy outside the editor',
    'Share the project with a README and a short list of what you would improve next',
  ],
  bigIdea: 'A finished game is a set of working parts that run together: a player, pickups, hazards, interface and saved scores. Exporting packages the project into a program that runs without the editor. Sharing it means a README that lets someone else play it and see how it works.',
  whyItMatters: 'A game in the editor is a prototype. Employers and players see the exported game, a link to play it and a repository that explains it. This capstone turns the lessons into one piece of evidence you can point to, and it shows that you can finish something. A shipped game is proof that the work is finished, and a README is the first thing a reviewer reads.',
  goalSections: [
    {
      heading: 'Combining the parts into one level',
      paragraphs: [
        'Start from the parts you already built: the `player.tscn` scene, `coin.tscn`, `rock.tscn`, the HUD with the score and the game over panel, and the best-score save. Place the player and a row of coins in `main.tscn`, then connect each coin to the level, the way you did with signals. Add a `Timer` for the rocks, and show the game over panel when the player takes a hit.',
        'Test each system alone before you combine them. A coin should score. A rock should fall and be removed. A hit should show the game over panel. Fix one part at a time, because a bug is much easier to find in one system than in four.',
        'Build the level in a copy of the project, so the working version survives if a change breaks something.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Main (Node2D)
          ├── Player (instance of player.tscn)
          ├── Coins
          │   ├── Coin (instance of coin.tscn)
          │   └── Coin (instance of coin.tscn)
          ├── SpawnTimer (Timer)
          └── HUD (CanvasLayer)
              ├── ScoreLabel (Label)
              └── GameOver (Panel, hidden at start)
        `,
      },
    },
    {
      heading: 'Exporting the game',
      figures: [
        { src: "/lesson-images/godot/export-dialog.webp", alt: "The Export window with an empty Presets list, an Add button, and Export Project buttons at the bottom.", caption: "Open Project, then Export. Click Add to create a preset for your system. Export Project writes the game to a folder you choose.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html" } },
      ],
      paragraphs: [
        'Open Project, then Export, and add a preset for your own computer. Godot needs export templates for the version you are using. The editor offers to download them when you first export, and you only need to do this once. Export a program for your system, then run it from its folder, outside the editor.',
        'Play the exported copy from start to finish, and check two things the editor hides. Make sure every file the game loads is inside the project, and check that the best score is saved and loaded from the exported program, not only from the editor.',
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          mkdir -p coin-dash-release
          cd coin-dash-release
          printf 'Coin Dash\n\nPlay the exported program in this folder.\n' > README.md
          ls
        `,
      },
    },
    {
      heading: 'Sharing with a README',
      paragraphs: [
        'A README tells a stranger what the game is, how to play it, and how it is built. Give the controls first, then the goal, then a short list of the scenes and scripts. Include one screenshot or a short GIF, because people judge a game in the first few seconds.',
        'End the README with two or three things you would improve next, such as a second level, better sound or a faster rock spawn that increases with the score. Naming the next steps shows that you understand where the game is and what it needs.',
        'Read the README as if you were a stranger before you publish. Any step that feels obvious to you may be the step that stops someone else.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # Coin Dash

          Move with the left and right arrow keys. Collect coins, avoid rocks,
          and try to beat your best score.

          ## How it is built
          - Godot with GDScript, one level and a HUD with a CanvasLayer
          - Best score saved with ConfigFile to user://save.cfg

          ## Next steps
          - A second level with faster rocks
          - Sound when a coin is collected
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Testing the exported game',
    intro: 'Run these commands to make a release folder with a README, then copy the exported program into it. The same checks apply to any game you ship. Each command leaves a clear result, so you can check one step before you move to the next.',
    example: {
      language: 'bash',
      runnable: true,
      code: code`
        mkdir -p coin-dash-release
        cd coin-dash-release
        printf 'Coin Dash\n\nPlay the exported program in this folder.\n' > README.md
        ls
      `,
    },
    steps: [
      { code: 'mkdir -p coin-dash-release', explanation: 'Creates a folder for the release. Keeping release files apart from the project stops you from shipping editor files by accident.' },
      { code: 'cd coin-dash-release', explanation: 'Moves into the release folder, so the next commands act on it.' },
      { code: "printf 'Coin Dash\\n\\nPlay the exported program in this folder.\\n' > README.md", explanation: 'Writes a short README. Each `\\n` is a line break, so the double one leaves a blank line between the title and the instructions.' },
      { code: 'ls', explanation: 'Lists the files, so you can confirm the README is there before you add the exported program.' },
    ],
  },
  tryIt: {
    instructions: [
      'Build the level with at least five coins, falling rocks, a score label, a game over panel and a saved best score.',
      'Export the game for your computer, then play the exported copy from start to finish and note any bugs.',
      'Write a README with controls, a goal, the parts it uses and two next steps. Put the project in a public Git repository, with `.godot/` in `.gitignore`.',
    ],
  },
  mistakes: [
    { mistake: 'Testing only in the editor, then finding that the exported game cannot find a file.', fix: 'Play the exported copy from its own folder before you share it.' },
    { mistake: 'Shipping the `.godot/` folder or other files Godot creates.', fix: 'Ship only the exported program and the README. Keep `.godot/` in `.gitignore`.' },
    { mistake: 'A README with no controls, so the first player does not know how to play.', fix: 'Put the controls in the first paragraph, before any setup or technical detail.' },
  ],
  quiz: [
    {
      question: 'Your coin pickup works in the editor, but the exported game never saves a best score. Which check is most useful first?',
      options: [
        { text: 'Change the coin scene color', explanation: 'A color does not affect saving. Check the save code and the path first.' },
        { text: 'Check that the save and load code run in the exported program, and that the path is `user://`', explanation: 'Yes. Testing the exported copy shows whether the save code runs and writes to the right place.' },
        { text: 'Delete `.godot/`', explanation: 'That folder is rebuilt by Godot. Deleting it does not test saving.' },
        { text: 'Add more rocks', explanation: 'More rocks do not test the save code. This check is about saving only.' },
      ],
      answer: 1,
    },
    {
      question: 'Which files belong in the release folder you share?',
      options: [
        { text: 'The exported program and the README', explanation: 'Yes. Players need the program to play, and the README explains how.' },
        { text: 'The whole `.godot/` folder', explanation: 'That folder holds files Godot creates for itself, and it does not belong in a release.' },
        { text: 'Every scene and script, with no program', explanation: 'Scripts run inside the game, so a player needs the exported program instead.' },
        { text: 'Your Git password', explanation: 'Never share credentials. A release contains the game and its documentation only.' },
      ],
      answer: 0,
    },
    {
      question: 'A good README for the game lists the controls first. Why?',
      options: [
        { text: 'Controls are the longest part of the README', explanation: 'Length is not the reason. The first reader needs to know how to play.' },
        { text: 'A player must know how to move before they can try the game', explanation: 'Yes. Controls come first so the first reader can start playing at once.' },
        { text: 'Controls must appear in alphabetical order', explanation: 'Alphabetical order is not required. The reason is that players need the controls first.' },
        { text: 'Godot requires it', explanation: 'Godot does not read READMEs. The order serves the reader.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'A shipped game combines tested parts, runs as an exported program, and comes with a README that tells a stranger how to play it.',
  resources: [
    { title: 'Game design', provider: 'Wikipedia', description: 'The discipline of defining rules, goals, and player experience for a game.', url: 'https://en.wikipedia.org/wiki/Game_design' },
    { title: 'Exporting projects', provider: 'Godot Engine documentation', description: 'How to export a finished Godot project for other platforms.', url: 'https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html' },
  ],
}

export default lesson
