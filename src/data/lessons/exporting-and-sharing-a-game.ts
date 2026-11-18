import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Export a Godot project for a target platform using the export presets',
    'Check an exported build on a clean machine before sharing it',
    'Write a short release note that tells players what to expect, how to play, and how to report problems',
  ],
  bigIdea: 'A game is only shared when someone else can run it. Godot exports a project into a runnable build for each platform, using export presets that name the target, the options, and the files to include. Before sharing, test the exported build on a clean machine, not only in the editor, and write a release note that makes the first run easy.',
  whyItMatters: 'A student sends a Coin Dash build to a friend. It runs on the student\'s laptop, but the friend sees a black screen, because the export left out the high score file and a scene that was loaded by name. The editor hid the problem, and the clean-machine test would have shown it. A small checklist before sharing prevents a lost first impression.',
  goalSections: [
    {
      heading: 'Export presets',
      paragraphs: [
        'An export preset is a saved set of settings for one target platform, such as Windows, macOS, Linux, or the web. Each preset names the output file, the options such as icons and window size, and which resources to include or exclude. Creating a preset once makes every later export repeatable.',
        'Godot needs export templates for each platform. These are the runtime files the game is packaged with, and they must match the version of the editor. Install them from the editor\'s export menu before the first export, and keep the editor and the templates on the same version.',
        'Check the file list in the preset. A scene or file loaded only by a name written in code may not be included automatically. Add those resources explicitly, or the exported game will fail where the editor did not.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Preset:      Windows Desktop
          Output:      builds/coin-dash-windows.exe
          Options:     window size 1280x720, icon set, debug off
          Resources:   include scenes/score.tscn and data/save_format.cfg
          Templates:   Godot 4 export templates, same version as the editor
        `,
      },
    },
    {
      heading: 'Testing on a clean machine',
      paragraphs: [
        'A clean machine has none of your project files, your saved data, or your editor installed. Test the exported build there, or on a second account on your own computer. The question is whether a new player can start and finish the game without help.',
        'Check the first minute carefully. Does the menu appear? Do the controls work? Does the game save and load a high score, and does it start again after a game over? These are the paths most likely to break between the editor and the export.',
        'Test each platform you claim to support. A build that works on Windows may still fail on macOS, because the security settings and file paths differ. If you cannot test a platform, say so in the release note.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          checks = {
              "menu appears": True,
              "controls respond": True,
              "high score saved and loaded": False,
              "restarts after game over": True,
          }
          failed = [name for name, passed in checks.items() if not passed]
          print("ready to share" if not failed else "fix before sharing: " + ", ".join(failed))
        `,
        output: 'fix before sharing: high score saved and loaded',
      },
    },
    {
      heading: 'The release note',
      paragraphs: [
        'A release note tells players what they are downloading and how to start. Include the version number, the platforms tested, the controls, and one sentence about what the game is. A player who knows the controls in the first minute is much more likely to keep playing.',
        'Name the known problems. A short list of limits, such as "no sound on macOS yet", builds trust and saves people from reporting problems you already know about.',
        'Say how to report problems and what helps. Ask for the version number, the platform, and the steps that caused the problem. Those three details turn a vague report into one you can act on.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Version 1.0.2: tested on Windows, macOS not yet tested
          Controls: arrow keys move, space jumps
          Known problem: no sound on macOS yet
          Report a problem with: the version number, your platform, and the steps that caused it
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a build before sharing it',
    intro: 'The program above runs a short pre-share checklist and reports what must be fixed before the build goes to anyone. Run it, then mark the high score check as passed and predict the result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        build = {
            "version": "1.0.2",
            "platform tested": ["Windows"],
            "clean machine run": True,
            "release note written": True,
        }
        problems = []
        if not build["clean machine run"]:
            problems.append("test on a clean machine")
        if len(build["platform tested"]) < 2:
            problems.append("test a second platform or say it is untested in the note")
        if not build["release note written"]:
            problems.append("write the release note")
        print("version", build["version"], "-", "ready" if not problems else "; ".join(problems))
      `,
      output: 'version 1.0.2 - test a second platform or say it is untested in the note',
    },
    steps: [
      { code: 'if not build["clean machine run"]:', explanation: 'A build that has not run on a clean machine could be missing files or saved data.' },
      { code: 'if len(build["platform tested"]) < 2:', explanation: 'Testing one platform is not enough to claim the game works everywhere, so the note must say so.' },
      { code: 'print("version", build["version"], ...)', explanation: 'Reports the version with the result, so the build being checked is never confused with another.' },
    ],
  },
  tryIt: {
    instructions: [
      'Create an export preset for one platform in a Godot project you have, and write down the output file name and the resources you included.',
      'Change the high score check in the first code example to passed and predict the result. Run it to check.',
      'Write a release note for your game with the version, the platforms tested, the controls, and one known problem.',
    ],
  },
  mistakes: [
    { mistake: 'Sharing a build that has only run in the editor.', fix: 'Test the exported build on a clean machine before sharing it.' },
    { mistake: 'Leaving out a scene or file that the game loads by name.', fix: 'Check the export preset\'s resource list, and include what the game needs.' },
    { mistake: 'Claiming platforms that were never tested.', fix: 'Name the tested platforms, and say plainly which ones are untested.' },
  ],
  quiz: [
    {
      question: 'Why test an exported build on a clean machine?',
      options: [
        { text: 'The editor can hide missing files and saved data that a new player would not have', explanation: 'Yes. A clean machine shows what a new player will actually experience.' },
        { text: 'Clean machines are faster', explanation: 'Speed is not the reason for the test.' },
        { text: 'Exports only work on clean machines by law', explanation: 'No such rule applies. The reason is a realistic test.' },
        { text: 'The editor cannot run games', explanation: 'The editor runs games. The reason is the test environment.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print when the high score check fails?',
      code: { language: 'python', runnable: true, code: code`
        checks = {"menu": True, "save": False}
        failed = [n for n, ok in checks.items() if not ok]
        print("ready" if not failed else "fix: " + ", ".join(failed))
      ` },
      options: [
        { text: 'ready', explanation: 'The save check failed, so the build is not ready.' },
        { text: 'fix: save', explanation: 'Yes. The save check is the one that failed.' },
        { text: 'fix: menu', explanation: 'The menu check passed, so it is not in the failed list.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What should a release note say about platforms that were not tested?',
      options: [
        { text: 'That they are untested, so players know what to expect', explanation: 'Yes. Honest limits build trust and prevent wasted reports.' },
        { text: 'Nothing, so the list looks longer', explanation: 'Hiding untested platforms misleads players.' },
        { text: 'That they definitely work', explanation: 'Claiming untested platforms work is a false promise.' },
        { text: 'That the game is not for them', explanation: 'That is a judgment about players, not a statement of what was tested.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Export with saved presets that include every needed resource, test the build on a clean machine across the platforms you claim, and share it with a release note that names the controls, the tests, and the known limits.',
  resources: [
    { title: 'Exporting projects', provider: 'Godot Engine documentation', description: 'How export presets, export templates, and platform options work in Godot 4.', url: 'https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html' },
    { title: 'Export templates', provider: 'Godot Engine documentation', description: 'How to install and manage the export templates each platform needs.', url: 'https://docs.godotengine.org/en/stable/tutorials/export/exporting_projects.html#export-templates' },
  ],
}

export default lesson
