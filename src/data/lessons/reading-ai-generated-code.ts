import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read a function and trace what each line does to the data',
    'Spot common problems in generated code, such as shared state and unchecked input',
    'Ask the assistant to explain a line you do not understand before you accept it',
  ],
  bigIdea: 'Generated code looks confident, and it can still be wrong in quiet ways. Read it the way you would read a stranger’s code: follow the data line by line, check every assumption about inputs, and ask about anything you cannot explain. Code you cannot explain is code you cannot fix later.',
  whyItMatters: 'The assistant gives you a reading list tool that works in your first test. A week later you add a second list, and the books from the first list show up in it too. Nothing crashed, so the bug is hard to see. Reading the code would have shown you a shared default value that keeps old data. Two minutes of reading would have caught the shared list before the second list was ever created.',
  goalSections: [
    {
      heading: 'Tracing the data line by line',
      paragraphs: [
        'Pick one input and follow it through the function. Write down what each variable holds after each line. This takes two minutes and shows what the code really does, which is not always what the function name suggests.',
        'Trace a list or dictionary carefully. Assigning a list to a new name does not copy it, so two names can change the same data. Check each place where a value is changed, and ask whether the change is meant to be visible to the caller.',
        'Read the function name, the parameters and the return value before you read the body. Those three things tell you what the author meant the code to do.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'trace.py',
        code: code`
          def add_title(titles, new_title):
              titles.append(new_title)
              return titles

          first = add_title([], "Dune")
          second = add_title(first, "Emma")
          print(first)
        `,
        output: "['Dune', 'Emma']",
      },
    },
    {
      heading: 'Spotting a shared default value',
      paragraphs: [
        'A default value in a function definition is created once, when Python reads the function. Every call that uses the default shares the same list. If the function changes that list, the change stays in place for the next call. This is a common mistake in generated code, because it looks tidy.',
        'The fix is to use `None` as the default, then create a new list inside the function. The function then starts fresh every time it is called without a list.',
        'A list that is returned from a function may be the same list the caller passed in. Ask yourself whether the caller expects a new list or a changed one.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'shared_default.py',
        code: code`
          def add_title(title, shelf=[]):
              shelf.append(title)
              return shelf

          print(add_title("Dune"))
          print(add_title("Emma"))
        `,
        output: "['Dune']\n['Dune', 'Emma']",
      },
    },
    {
      heading: 'Checking what the code assumes',
      paragraphs: [
        'Every function assumes something about its input. Look for those assumptions. Does the code expect a number and get text? Does it expect a file to exist? Does it expect a key to be in a dictionary? Missing checks cause many real bugs.',
        'When you cannot explain a line, ask the assistant to explain it in plain words and to name the assumption it makes. A good answer names the input and the result. If the answer is vague, treat the line as suspect, and test it before you keep it.',
        'Read the code as a sequence of changes to specific values, not as a story. The question at each line is what value exists now.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Question to ask: "Explain this line in plain words. What does it assume
          about book['read'], and what happens if that key is missing?"
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A bug that hides in a default value',
    intro: 'This example looks correct, and the first call prints what you expect. The second call shows the problem. Run the file, then read the function and explain why the second call keeps the first title. Watch what happens to the shared list between the two prints.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'shared_default.py',
      code: code`
        def add_title(title, shelf=[]):
            shelf.append(title)
            return shelf

        print(add_title("Dune"))
        print(add_title("Emma"))
      `,
      output: "['Dune']\n['Dune', 'Emma']",
    },
    steps: [
      { code: 'def add_title(title, shelf=[]):', explanation: 'The default `[]` is created once, when Python reads this line. It is not a new empty list for each call.' },
      { code: 'shelf.append(title)', explanation: 'Adds the title to the default list. That list is the same object every time the default is used.' },
      { code: 'print(add_title("Dune"))', explanation: 'The first call prints one title, which looks correct.' },
      { code: 'print(add_title("Emma"))', explanation: 'The second call uses the same default list, so `Dune` is still there. The output shows both titles, which is the bug.' },
    ],
  },
  tryIt: {
    instructions: [
      'Paste the `shared_default.py` example into a file and run it. Confirm you see the two lines of output shown above.',
      'Change the function to use `shelf=None` and create a new list inside when `shelf` is `None`. Run it again and confirm the second output has only `Emma`.',
      'Write one sentence that explains the fix to someone who has never seen Python. Keep it to one sentence.',
    ],
  },
  mistakes: [
    { mistake: 'Accepting code because it runs once.', fix: 'Trace at least one input through the code, and test a second call before you trust it.' },
    { mistake: 'Using a list or dictionary as a default argument.', fix: 'Use `None` as the default, then create the list inside the function.' },
    { mistake: 'Keeping a line you cannot explain.', fix: 'Ask for a plain explanation first. If the explanation is still vague, test the line or replace it.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', runnable: true, code: code`
        def add_title(title, shelf=[]):
            shelf.append(title)
            return shelf

        add_title("Dune")
        print(add_title("Emma"))
      ` },
      options: [
        { text: "['Emma']", explanation: 'That would be true for a new list. The default list still holds Dune from the first call.' },
        { text: "['Dune', 'Emma']", explanation: 'Yes. The first call added Dune to the shared default list, and the second call adds Emma to it.' },
        { text: "['Dune']", explanation: 'The second call added Emma, so the list has both titles.' },
        { text: 'An error', explanation: 'The code is valid Python. It runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Which default argument avoids sharing one list between calls?',
      options: [
        { text: '`shelf=[]`', explanation: 'That default is created once and then shared by every call that uses it.' },
        { text: '`shelf=None`, with a new list created inside the function when shelf is None', explanation: 'Yes. Each call that does not pass a list gets its own new list.' },
        { text: '`shelf=list`', explanation: 'That makes the default the list type itself, not an empty list, so the code will fail.' },
        { text: '`shelf=""`', explanation: 'That is a text default. The function calls `append`, which text does not have.' },
      ],
      answer: 1,
    },
    {
      question: 'You do not understand a line in a generated function. What is the best next step?',
      options: [
        { text: 'Keep it, because the assistant wrote it', explanation: 'Generated code can be wrong. Understanding it is your responsibility.' },
        { text: 'Ask the assistant to explain it in plain words, naming the assumption it makes, then test it', explanation: 'Yes. A clear explanation and a test show whether the line does what you need.' },
        { text: 'Delete the whole function', explanation: 'That may lose working code. Understanding the line is the better step.' },
        { text: 'Rename the variables until it makes sense', explanation: 'Renaming does not change what the code does.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Read generated code by tracing its data, watching for shared defaults, and asking for a plain explanation of every line you keep.',
  resources: [
    { title: 'Code review developer guide', provider: 'Google', description: 'What to check when reading someone else\'s change, including generated code.', url: 'https://google.github.io/eng-practices/review/' },
    { title: 'Python tutorial: More on defining functions', provider: 'Python.org', description: 'The official explanation of default argument values, including the shared default trap.', url: 'https://docs.python.org/3/tutorial/controlflow.html#default-argument-values' },
  ],
}

export default lesson
