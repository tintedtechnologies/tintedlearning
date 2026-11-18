import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Use an AnimationPlayer or an AnimatedSprite2D to show a character moving between poses',
    'Add sound effects that match each important game event, and keep them from repeating too loudly',
    'Add small feedback effects such as screen shake or a brief pause, and judge when they help',
  ],
  bigIdea: 'Feel is how a game responds to the player, and it comes from motion, sound, and small effects. Animation shows that something is happening, sound confirms it, and effects make a hit or a pickup satisfying. These details cost little to add, and they change how the same mechanic feels, so they are worth testing as carefully as the rules.',
  whyItMatters: 'Two versions of the same coin game play identically. One coin pickup is silent and instant. The other plays a short chime and a sparkle while the coin shrinks away. Players describe the second version as "better", even though no rule changed. Feel is part of the design, and a silent game can feel unfinished even when it works.',
  goalSections: [
    {
      heading: 'Animation that shows what is happening',
      paragraphs: [
        'An animation is a sequence of frames or property changes played over time. In Godot, an AnimationPlayer can change a sprite\'s frame, its position, or its scale across several keyframes. An AnimatedSprite2D is simpler, and it plays a list of frames for each named state, such as idle, run, or jump.',
        'Tie animations to states, not to single key presses. A character should be in the run state while the player is moving, and it should switch back to idle when the movement stops. A state controller keeps the animation consistent, even when inputs overlap.',
        'Keep animations short and readable. A pickup that spins for half a second is clear. A pickup that spins for three seconds makes the player wait. Test each animation at normal speed, and shorten any that feel slow.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def animation_for(moving, in_air):
              if in_air:
                  return "jump"
              if moving:
                  return "run"
              return "idle"

          for state in [(False, False), (True, False), (True, True)]:
              print(state, "->", animation_for(*state))
        `,
        output: "(False, False) -> idle\n(True, False) -> run\n(True, True) -> jump",
      },
    },
    {
      heading: 'Sound that confirms an event',
      paragraphs: [
        'Play a sound for each important event: a pickup, a hit, a jump, a game over. The sound should begin on the frame the event happens, so the player connects the two. A sound that starts a moment late feels disconnected, even when the timing is only a fraction of a second.',
        'Repeated sounds can become tiresome. Vary the pitch slightly, or pick from a few similar sounds, so that the tenth pickup does not sound like the first. Keep the loudest sounds for the most important events, so that the player can hear the difference.',
        'Use a separate audio player for each kind of sound, or a small pool of players, so that a new sound does not cut off an important one that is still playing.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          sounds = ["chime_1", "chime_2", "chime_3"]
          played = []
          for pickup in range(5):
              played.append(sounds[pickup % len(sounds)])
          print(played)
        `,
        output: "['chime_1', 'chime_2', 'chime_3', 'chime_1', 'chime_2']",
      },
    },
    {
      heading: 'Small effects, used sparingly',
      paragraphs: [
        'A brief screen shake after a hit can make the impact feel strong. A short pause of a fraction of a second when the player collects something can make the moment feel important. A small particle burst can show where a coin was. Each effect is a small change, and it should support the event, not hide it.',
        'Use effects sparingly. If every event shakes the screen, the shake stops meaning anything, and players may feel tired or dizzy. Save the strongest effects for the moments that matter most.',
        'Give players a way to reduce motion and effects. Some people are sensitive to screen shake or flashing lights, and a simple setting that lowers the intensity makes the game usable for more people.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Coin pickup:  sparkle for 0.2 seconds, no screen shake
          Enemy hit:    screen shake for 0.15 seconds, a short pause of 0.05 seconds
          Setting:      "Reduce screen shake" on: shake is skipped, the sparkle stays
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Choosing an effect for each event',
    intro: 'The program below maps each game event to a small set of feedback effects and skips effects for events that do not need them. It shows how a list of rules keeps feedback consistent. Run it, then add a new event and predict which effects it gets.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        feedback = {
            "coin picked up": ["chime", "sparkle"],
            "player hit": ["sound", "screen shake"],
            "walking": [],
        }
        for event, effects in feedback.items():
            print(event, "->", ", ".join(effects) if effects else "no effect")
      `,
      output: 'coin picked up -> chime, sparkle\nplayer hit -> sound, screen shake\nwalking -> no effect',
    },
    steps: [
      { code: 'feedback = {...}', explanation: 'Each event is paired with its feedback, so the choice is written down and can be reviewed.' },
      { code: 'for event, effects in feedback.items():', explanation: 'Goes through each event, so no event is forgotten.' },
      { code: 'print(event, "->", ...)', explanation: 'Shows the feedback next to the event. Events with no effect are visible too, which keeps the design deliberate.' },
    ],
  },
  tryIt: {
    instructions: [
      'Pick one event in your game and write the animation, the sound, and one effect it should have. Keep each one short.',
      'Add a "coin missed" event with a sound but no screen shake in the seeItInAction example. Predict the output, then run it to check.',
      'Play a game you enjoy and note three moments where the feel helped you understand what happened. Write what each feedback was.',
    ],
  },
  mistakes: [
    { mistake: 'Playing a sound a moment after the event.', fix: 'Start the sound on the frame the event happens, and test the timing.' },
    { mistake: 'Adding screen shake to every event.', fix: 'Save strong effects for important moments, so they keep their meaning.' },
    { mistake: 'Ignoring players who are sensitive to motion.', fix: 'Offer a setting that reduces shake and flashing effects.' },
  ],
  quiz: [
    {
      question: 'Why should a sound start on the same frame as the event it confirms?',
      options: [
        { text: 'So the player connects the sound with the action, and the moment feels responsive', explanation: 'Yes. Timing makes the feedback feel connected to what the player did.' },
        { text: 'So the file is smaller', explanation: 'Timing does not change file size.' },
        { text: 'So the sound plays forever', explanation: 'The sound length is unrelated to when it starts.' },
        { text: 'So the game runs at a higher frame rate', explanation: 'Sound timing does not change the frame rate.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the fourth pickup sound?',
      code: { language: 'python', runnable: true, code: code`
        sounds = ["a", "b", "c"]
        print(sounds[3 % len(sounds)])
      ` },
      options: [
        { text: 'a', explanation: 'Yes. Index 3 wraps back to index 0 in a list of three, which is a.' },
        { text: 'b', explanation: 'Index 1 would be b, but 3 wraps to 0.' },
        { text: 'c', explanation: 'Index 2 would be c, but 3 wraps to 0.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why should players be able to reduce screen shake?',
      options: [
        { text: 'Some players are sensitive to motion, and a setting makes the game usable for more people', explanation: 'Yes. Accessibility options widen who can enjoy the game.' },
        { text: 'Because shake always slows the game down', explanation: 'Shake does not always slow the game.' },
        { text: 'Because shake is illegal in games', explanation: 'That is not a rule. The reason is accessibility.' },
        { text: 'Because the engine cannot shake the screen', explanation: 'The engine can shake the screen. The issue is player comfort.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Animate characters by state, start sounds on the frame of each event, and use screen shake and other effects sparingly, with a setting so that players can reduce them.',
  resources: [
    { title: 'AnimationPlayer', provider: 'Godot Engine documentation', description: 'How to animate properties and sprites in Godot with the AnimationPlayer node.', url: 'https://docs.godotengine.org/en/stable/classes/class_animationplayer.html' },
    { title: 'AudioStreamPlayer', provider: 'Godot Engine documentation', description: 'How to play sounds in Godot, including several players for overlapping effects.', url: 'https://docs.godotengine.org/en/stable/classes/class_audiostreamplayer.html' },
  ],
}

export default lesson
