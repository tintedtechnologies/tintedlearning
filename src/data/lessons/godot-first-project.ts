import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Install Godot and create a new 2D project from the Project Manager',
    'Find the main scene and run the game with the Play button',
    'Read the project folder and explain what each file is for',
  ],
  bigIdea: 'Godot keeps a game as a project folder. The folder holds scenes, scripts, images and a settings file called `project.godot`. Godot runs the main scene when you press Play, and every other file is loaded from there.',
  whyItMatters: 'You want to make a small game about collecting coins before the weekend. You install Godot, press Play, and see an empty window. Nothing happens, and you do not know which file to edit. Knowing the project folder and the main scene tells you where the game starts, so you can change the right thing. Five minutes spent reading the folder layout saves an hour of searching.',
  goalSections: [
    {
      heading: 'Creating a project',
      figures: [
        { src: "/lesson-images/godot/project-manager-create-button.webp", alt: "The Godot Project Manager with an empty project list and the Create button in the top toolbar.", caption: "Click Create in the top toolbar to start a new project.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/tutorials/editor/project_manager.html" } },
        { src: "/lesson-images/godot/project-create-form.webp", alt: "The Create New Project form with Project Name, Project Path, Renderer, and Edit Now options.", caption: "Type coin-dash in Project Name, and leave the renderer on its default for a first project. Keep Edit Now checked, then click Create.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/tutorials/editor/project_manager.html" } },
      ],
      paragraphs: [
        'Download Godot from the official site and open it. The Project Manager lists your projects. Click Create, give the project a name such as `coin-dash`, and pick a folder you can find later. Godot creates the folder and a file called `project.godot` that stores the settings for the whole project.',
        'Accept the renderer the Project Manager suggests for a small 2D game. A first project does not need a special choice, and Godot can open the empty project right away, so you can start working.',
      ],
      example: {
        language: 'bash',
        runnable: true,
        code: code`
          mkdir -p coin-dash/scenes coin-dash/scripts coin-dash/images
          cd coin-dash
          touch project.godot scenes/main.tscn scripts/player.gd
          find . -type f | sort
        `,
      },
    },
    {
      heading: 'Running the main scene',
      figures: [
        { src: "/lesson-images/godot/editor-run-buttons.webp", alt: "The Godot editor with the Play button in the top toolbar, beside the Scene, FileSystem, and Inspector panels.", caption: "Press F5 or click the Play button in the top toolbar to run the project. Press F6 to run only the scene you are editing.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html" } },
        { src: "/lesson-images/godot/main-scene-picker.webp", alt: "The Pick a Main Scene dialog, which Godot shows when a project has no main scene yet.", caption: "If the project has no main scene yet, Godot asks you to pick one. You can change it later in Project Settings, under Application, then Run.", credit: { text: "Godot Engine documentation, CC BY 3.0", url: "https://docs.godotengine.org/en/stable/getting_started/step_by_step/nodes_and_scenes.html" } },
      ],
      paragraphs: [
        'A scene is a saved tree of nodes. Your first scene is called `main.tscn`, and it becomes the main scene for the project. Godot starts the main scene when you press Play in the top toolbar, or press F5. You can also press F6 to run only the scene you are looking at.',
        'The main scene is stored in the project settings. You can see it in Project Settings under Application, then Run, where the Main Scene field points to a path such as `res://scenes/main.tscn`. The prefix `res://` means the top of your project folder.',
        'Godot saves your project as you work, but use the Save Scene command before you test a change. A saved scene is the version the game runs, so an unsaved change can make a test look wrong.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          [application]
          config/name="Coin Dash"
          run/main_scene="res://scenes/main.tscn"
        `,
      },
    },
    {
      heading: 'Reading the project folder',
      paragraphs: [
        'Each folder has a job. Scenes go in `scenes/`, scripts in `scripts/`, and pictures in `images/`. Keeping them apart makes a project easy to search when it grows. A file ending in `.tscn` is a scene, and a file ending in `.gd` is a GDScript script. The `.godot/` folder holds files Godot creates for itself, and you do not edit it.',
        'Commit the project folder with Git, but leave out `.godot/`. Add that folder to `.gitignore`, just as you would leave out `.venv/` in a Python project. The rest of the folder is the game, and it should be in version control.',
        'When you open a project later, the Project Manager shows its name and folder path. Keep your projects in one folder on your computer, so you can find them again without searching.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          coin-dash/
          ├── project.godot     settings for the whole project
          ├── scenes/
          │   └── main.tscn     the scene that starts when you press Play
          ├── scripts/
          │   └── player.gd     code attached to a node
          ├── images/           pictures for sprites
          └── .godot/           created by Godot, not edited by hand
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Setting up the coin-dash folder from the command line',
    intro: 'Godot creates the project for you from the Project Manager, but the same folder layout can be made from a terminal. These commands make the folders and the first files for the game. Run them in an empty location on your computer. The files are empty placeholders, so you can see the structure without the editor. Godot fills them in when you use the editor.',
    example: {
      language: 'bash',
      runnable: true,
      code: code`
        mkdir -p coin-dash/scenes coin-dash/scripts coin-dash/images
        cd coin-dash
        touch project.godot scenes/main.tscn scripts/player.gd
        find . -type f | sort
      `,
    },
    steps: [
      { code: 'mkdir -p coin-dash/scenes coin-dash/scripts coin-dash/images', explanation: 'Creates the project folder and three subfolders in one command. The `-p` flag creates parent folders too, and it does not complain if they already exist.' },
      { code: 'cd coin-dash', explanation: 'Moves into the project, so every later path is relative to the project folder.' },
      { code: 'touch project.godot scenes/main.tscn scripts/player.gd', explanation: 'Creates empty files. Godot fills `project.godot` and the scene when you use the editor. The `touch` command makes an empty file if it does not exist.' },
      { code: 'find . -type f | sort', explanation: 'Lists every file under the current folder, sorted by name. Use it to check the layout before you open Godot.' },
    ],
  },
  tryIt: {
    instructions: [
      'Create a new Godot project called `coin-dash` in the Project Manager.',
      'Open Project Settings, find the Main Scene field under Application, then Run, and confirm it points to the scene you want to start with.',
      'Press Play. If the window is empty, that is expected. Your scene has no nodes yet.',
    ],
  },
  mistakes: [
    { mistake: 'Pressing Play and expecting a different scene than the main scene.', fix: 'Godot always runs the main scene from Project Settings. Press F6 to run the scene you are editing.' },
    { mistake: 'Committing the `.godot/` folder to Git.', fix: 'Add `.godot/` to `.gitignore`. Godot rebuilds it, so it does not belong in your history.' },
    { mistake: 'Moving a file outside Godot with your file manager, then wondering why a scene is broken.', fix: 'Move and rename files inside the Godot FileSystem panel, so Godot updates every reference for you.' },
  ],
  quiz: [
    {
      question: 'You press F5 in Godot and the game starts from `res://scenes/menu.tscn`, not from your main scene. What is the most likely cause?',
      options: [
        { text: 'The main scene in Project Settings points to `menu.tscn`', explanation: 'Yes. Godot runs whatever scene Project Settings names as the main scene when you press F5.' },
        { text: 'Godot always starts the scene with the most nodes', explanation: 'Godot does not choose by size. It uses the main scene setting.' },
        { text: 'The `.godot/` folder is missing', explanation: 'That folder holds Godot files. Its absence does not decide which scene starts.' },
        { text: 'The scene file ends in `.tscn`', explanation: 'That is the normal extension for a scene. Every scene uses it.' },
      ],
      answer: 0,
    },
    {
      question: 'In the folder layout shown in the lesson, which file stores settings for the whole project?',
      options: [
        { text: '`scenes/main.tscn`', explanation: 'That file is a scene. A scene describes nodes, not project settings.' },
        { text: '`scripts/player.gd`', explanation: 'That is a script attached to a node, not a settings file.' },
        { text: '`project.godot`', explanation: 'Yes. It stores the project settings, including which scene runs first.' },
        { text: '`.godot/`', explanation: 'That folder holds files Godot creates for itself, and you should not edit it.' },
      ],
      answer: 2,
    },
    {
      question: 'Your team uses Git. Which entry belongs in `.gitignore` for a Godot project?',
      options: [
        { text: '`scenes/`', explanation: 'Scenes are the game itself, so they belong in Git.' },
        { text: '`project.godot`', explanation: 'The settings file should be in Git, so the whole team shares the same settings.' },
        { text: '`.godot/`', explanation: 'Yes. Godot rebuilds that folder, so it should not be stored in history.' },
        { text: '`scripts/`', explanation: 'Scripts are part of the game and belong in version control.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'A Godot game is a folder with a main scene and a settings file, and Godot starts the main scene every time you press Play.',
  resources: [
    { title: 'Step by step: your first project', provider: 'Godot Engine documentation', description: 'The official walkthrough for creating a Godot project and running it.', url: 'https://docs.godotengine.org/en/stable/getting_started/step_by_step/index.html' },
    { title: 'Godot documentation: Project organization', provider: 'Godot Engine', description: 'How to structure a Godot project folder and what each file type is for.', url: 'https://docs.godotengine.org/en/stable/tutorials/best_practices/project_organization.html' },
  ],
}

export default lesson
