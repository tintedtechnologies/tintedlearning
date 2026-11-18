import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Run a playtest that watches what players do, rather than asking them to judge the game',
    'Record observations with the time, the action, and what the player seemed to expect',
    'Turn observations into a short list of changes, ranked by how often they cause trouble',
  ],
  bigIdea: 'Playtesting means watching people play a game and noticing where they get confused, bored, or stuck. What players do is more reliable than what they say, so good playtests focus on observation. Recording what happened, looking for patterns across several players, and ranking the problems turns a feeling that something is wrong into a clear list of fixes.',
  whyItMatters: 'A developer is sure the jump in her platformer feels fine. Three friends playtest it, and all three try to jump onto a ledge and fall, because the ledge looks reachable but is not. None of them say "the jump is bad". They just keep falling. Watching the falls, not the opinions, reveals the problem in ten minutes.',
  goalSections: [
    {
      heading: 'Watch, do not explain',
      paragraphs: [
        'Give the player the game and say very little. Explaining the controls or the goal changes how the player reads the game, and it hides the problems you need to see. Let them struggle for a short time before you step in, and note how long each struggle lasts.',
        'Watch the moments of hesitation, repeated actions, and surprise. A player who looks at the screen for a long time, presses the same button again and again, or says "huh" has found something that does not match their expectation. Those moments are more useful than a general rating.',
        'Ask questions after the session, not during it. "What did you expect to happen there?" gives you the gap between expectation and result, which is the core of most fixes. Write the answer down in the words the player used, because their own wording often shows the expectation more clearly than a summary would.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Time   Player  Action                      Expected              What happened
          02:14  Ana     jumps at the ledge twice     to land on it        fell past the edge
          04:37  Ben     opens the menu to find help  a hint on screen     no hint shown
          06:02  Ana     jumps at the ledge again    to land on it        fell past the edge
        `,
      },
    },
    {
      heading: 'Patterns across players',
      paragraphs: [
        'One player who struggles may be unlucky or unusual. Three players who struggle in the same place point to a real problem. Look for the pattern across sessions, and count how many players ran into each issue.',
        'Separate the problem from the fix. A player who falls off a ledge has shown you that the ledge is confusing. The fix might be a visual cue, a wider landing, or a different jump, and the team can choose among them later.',
        'Watch for players who stop playing. Quitting is the strongest signal of all, because it shows that the game lost the player at that moment. Note the time and what came just before it. A short note of the moment is enough, and the pattern across players will show whether it matters.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          observations = [
              ("ledge falls", "Ana"), ("ledge falls", "Ben"), ("ledge falls", "Cy"),
              ("no hint found", "Ben"), ("quit at level 2", "Dee"),
          ]
          counts = {}
          for issue, player in observations:
              counts.setdefault(issue, set()).add(player)
          for issue, players in sorted(counts.items(), key=lambda item: -len(item[1])):
              print(issue, "-", len(players), "players")
        `,
        output: 'ledge falls - 3 players\nno hint found - 1 players\nquit at level 2 - 1 players',
      },
    },
    {
      heading: 'Turning observations into changes',
      paragraphs: [
        'Rank the issues by how many players ran into them and how badly each one stopped progress. A problem that stops most players is more urgent than one that only confuses a single player for a moment.',
        'Make the change, then test again with new players. Playtesting is a loop, not a single event. A fix can create a new problem, and only a new session shows whether the change worked. Compare the new session with the old notes, not with memory.',
        'Keep notes about what you changed and why. A record of each playtest and each fix helps the team see whether the game is improving over time.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          issues = [("ledge falls", 3, 5), ("no hint found", 1, 2)]
          ranked = sorted(issues, key=lambda i: i[1] * i[2], reverse=True)
          for name, players, severity in ranked:
              print(name, players * severity)
        `,
        output: 'ledge falls 15\nno hint found 2',
      },
    },
  ],
  seeItInAction: {
    title: 'Ranking problems by how many players hit them',
    intro: 'The program above counts how many different players ran into each problem and sorts the problems by that count. Run it, then add a fourth player to the no-hint problem and predict whether the order changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        problems = {
            "ledge falls": {"Ana", "Ben", "Cy"},
            "no hint found": {"Ben"},
            "quit at level 2": {"Dee"},
        }
        ranked = sorted(problems.items(), key=lambda item: len(item[1]), reverse=True)
        for name, players in ranked:
            print(len(players), name)
        print("fix first:", ranked[0][0])
      `,
      output: '3 ledge falls\n1 no hint found\n1 quit at level 2\nfix first: ledge falls',
    },
    steps: [
      { code: 'problems = {"ledge falls": {"Ana", "Ben", "Cy"}, ...}', explanation: 'Each problem is paired with the set of players who ran into it, so a player is counted only once.' },
      { code: 'ranked = sorted(problems.items(), key=lambda item: len(item[1]), reverse=True)', explanation: 'Ranks problems by how many players they affected, the most common first.' },
      { code: 'print("fix first:", ranked[0][0])', explanation: 'Names the problem to address first, based on evidence from several players.' },
    ],
  },
  tryIt: {
    instructions: [
      'Invite two people to play your game for ten minutes each. Say nothing except the controls. Write down three moments where they hesitated or got stuck.',
      'Add a fourth player to the no-hint problem in the seeItInAction example and predict the new order. Run it to check.',
      'Write one change you would make after a playtest, the observation behind it, and the test you would run next.',
    ],
  },
  mistakes: [
    { mistake: 'Explaining the controls and goals before the player tries.', fix: 'Say very little, and watch what the player does on their own.' },
    { mistake: 'Treating one player\'s struggle as a general problem.', fix: 'Look for the same issue across several players before changing the game.' },
    { mistake: 'Asking players to rate the game instead of watching them play.', fix: 'Record actions and expectations, and use ratings only as a secondary signal.' },
  ],
  quiz: [
    {
      question: 'Why is watching players more reliable than asking them to rate the game?',
      options: [
        { text: 'What players do shows the real problem, even when they cannot describe it', explanation: 'Yes. Behavior often reveals problems that players do not name.' },
        { text: 'Ratings are always wrong', explanation: 'Ratings are a useful secondary signal. They are just less direct than behavior.' },
        { text: 'Players never talk about games', explanation: 'Players do talk, but what they say may not match what they do.' },
        { text: 'Watching is faster than any other method', explanation: 'Speed is not the reason. The reason is that behavior is more reliable.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print first?',
      code: { language: 'python', runnable: true, code: code`
        issues = {"a": {"x", "y"}, "b": {"x"}}
        top = max(issues, key=lambda k: len(issues[k]))
        print(top)
      ` },
      options: [
        { text: 'a', explanation: 'Yes. Issue a was hit by two players, more than issue b.' },
        { text: 'b', explanation: 'Issue b was hit by only one player.' },
        { text: 'x', explanation: 'The program prints the issue name, not a player.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why keep testing after a fix?',
      options: [
        { text: 'A fix can create a new problem, and only a new session shows whether it worked', explanation: 'Yes. Playtesting is a loop, so each change should be checked with new players.' },
        { text: 'Because the first test is always wrong', explanation: 'The first test is useful. The loop is what makes it reliable.' },
        { text: 'Because the engine needs a new session to update', explanation: 'The engine does not need testing to update. The players are the test.' },
        { text: 'Because fixes are never needed', explanation: 'Fixes are often needed. Testing shows whether they work.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Playtest by watching what players do, look for patterns across several players, rank the problems by how many players they affect, and keep testing after each change.',
  resources: [
    { title: 'Game Developer', provider: 'Game Developer', description: 'A games industry site with articles on playtesting, observing players, and acting on feedback.', url: 'https://www.gamedeveloper.com/' },
    { title: 'Game Design Workshop', provider: 'Tracy Fullerton (book overview)', description: 'A guide to playtesting and iteration, with exercises for each stage.', url: 'https://www.routledge.com/Game-Design-Workshop-A-Playcentric-Approach-to-Creating-Innovative-Games/Fullerton/p/book/9781032607016' },
  ],
}

export default lesson
