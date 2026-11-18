import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Find the entry point of an unfamiliar Python project and follow the path of one request or command',
    'Build a short map of a module: its functions, what each takes and returns, and what it depends on',
    'Use tests, logs, and small experiments to confirm what the code really does',
  ],
  bigIdea: 'Most professional Python work starts with reading code someone else wrote. A good reader begins at the entry point, follows one real example through the code, maps the functions and their inputs and outputs, and confirms each guess by running the code or its tests. Reading with a purpose, one path at a time, is faster than reading every file from the top.',
  whyItMatters: 'A new team member is asked to change how invoices are rounded in a billing service with twelve thousand lines. Reading the files in alphabetical order takes days and still misses the rule. Starting at the command that creates an invoice, following the call to the rounding function, and running its test finds the rule in an hour, and shows the change needed without breaking anything else.',
  goalSections: [
    {
      heading: 'Start at the entry point',
      paragraphs: [
        'Look for the place where the program starts. In a script, it is often the bottom of a file under a check for __main__. In a web service, it is the app or server setup. In a library, it is the public functions listed in the README or the package __init__ file.',
        'Read the README and the test folder before the code. The README says what the project is for, and the tests show examples of its behavior written by people who wanted it to work. Both are shorter and clearer than the implementation.',
        'Pick one real example, such as a command or a request, and follow it. Write down each function it calls, in order, and what it passes along. A single traced path teaches more than an hour of scanning files.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import ast

          source = '''
          def read_rows(path):
              return []

          def round_total(amount):
              return round(amount, 2)

          def main():
              rows = read_rows("sales.csv")
              print(round_total(sum(rows)))

          if __name__ == "__main__":
              main()
          '''

          tree = ast.parse(source)
          print([node.name for node in tree.body if isinstance(node, ast.FunctionDef)])
        `,
        output: "['read_rows', 'round_total', 'main']",
      },
    },
    {
      heading: 'Map a module as you go',
      paragraphs: [
        'Make a short map of each module you read. For each function, write its name, what it takes in, what it returns, and what other modules it depends on. The map is a working document, and it is the fastest way to see how a change will travel through the code.',
        'Look for the data shapes. Many confusing codebases are simply several shapes of the same data passed between functions. A list of dictionaries in one module and a list of tuples in another is a common source of bugs, so write down the shape at each boundary.',
        'Mark what you have confirmed and what you have only guessed. A guess from reading is a hypothesis, and a test or a small experiment turns it into a fact.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Module: billing.py
          round_invoice(lines)  takes a list of (name, price) pairs, returns a total rounded to cents
            depends on: money.round_half_up
            confirmed:  test_round_invoice passes
            guess:      tax is applied before rounding (check with a small experiment)
        `,
      },
    },
    {
      heading: 'Confirm with tests and small experiments',
      paragraphs: [
        'Run the existing tests before changing anything. If they pass, you have a baseline. If they fail, you have learned something about the project before making any change, and you should understand why.',
        'Write a small experiment when a behavior is unclear. Call the function with a value you choose, print the result, and compare it with your guess. Keep the experiment in a scratch file, and delete it when you are done, so the project stays clean.',
        'Use logging or a debugger to watch real values pass through the code. A breakpoint on the function you traced shows the actual inputs, which often differ from the names suggest.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def round_total(amount):
              return round(amount, 2)

          guess = {"input": 10.556, "expected": 10.56}
          actual = round_total(guess["input"])
          print("actual:", actual)
          print("guess matches:", actual == guess["expected"])
        `,
        output: 'actual: 10.56\nguess matches: True',
      },
    },
  ],
  seeItInAction: {
    title: 'Mapping a module from its own source',
    intro: 'The program above reads a small module as text, parses it, and lists each function with its parameters. The same technique works on real files, and it gives a quick map before you read the details. Run it, then add a function to the source and predict whether it appears in the list.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        import ast

        source = '''
        def total(prices, tax):
            return sum(prices) * (1 + tax)

        def label(total_value):
            return f"Total: {total_value}"
        '''

        tree = ast.parse(source)
        for node in tree.body:
            if isinstance(node, ast.FunctionDef):
                params = [arg.arg for arg in node.args.args]
                print(node.name, "takes", params)
      `,
      output: "total takes ['prices', 'tax']\nlabel takes ['total_value']",
    },
    steps: [
      { code: 'tree = ast.parse(source)', explanation: 'Turns the source text into a tree that describes its structure, without running it.' },
      { code: 'if isinstance(node, ast.FunctionDef):', explanation: 'Keeps only the function definitions at the top level of the module.' },
      { code: 'params = [arg.arg for arg in node.args.args]', explanation: 'Reads the parameter names, which tell you what each function needs.' },
    ],
  },
  tryIt: {
    instructions: [
      'Open a Python project you did not write, or a public one on GitHub. Find its entry point, and write the path of one command or request in five steps.',
      'Add a function to the source in the seItInAction example and predict whether it is listed. Run the program to check.',
      'Write a map of one module: each function, its inputs, its output, and what it depends on.',
    ],
  },
  mistakes: [
    { mistake: 'Reading every file in alphabetical order before tracing anything.', fix: 'Start at the entry point and follow one real example through the code.' },
    { mistake: 'Changing code before running its tests.', fix: 'Run the tests first, so you have a baseline and know what already fails.' },
    { mistake: 'Trusting names instead of checking the values.', fix: 'Run a small experiment or use a debugger to see the real values.' },
  ],
  quiz: [
    {
      question: 'What is the best first step when you open an unfamiliar Python project?',
      options: [
        { text: 'Find the entry point and read the README and tests', explanation: 'Yes. The entry point and the examples in the tests show how the project is meant to work.' },
        { text: 'Rename every file', explanation: 'Renaming changes the project before you understand it.' },
        { text: 'Delete the tests to make the code shorter', explanation: 'Tests describe the behavior, and deleting them removes your evidence.' },
        { text: 'Rewrite the project in another language', explanation: 'Rewriting before reading removes the knowledge the code holds.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        import ast
        tree = ast.parse("def a(x):\n    return x\ndef b(y, z):\n    return y")
        print([n.name for n in tree.body if isinstance(n, ast.FunctionDef)])
      ` },
      options: [
        { text: "['a', 'b']", explanation: 'Yes. The module defines two functions, a and b.' },
        { text: "['x', 'y', 'z']", explanation: 'Those are parameter names, not function names.' },
        { text: "['def']", explanation: 'The keyword def is not a function name.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why turn a guess from reading into a test or an experiment?',
      options: [
        { text: 'Because a guess is a hypothesis, and a test shows what the code actually does', explanation: 'Yes. Experiments confirm behavior that names alone may not show.' },
        { text: 'Because tests make the code run faster', explanation: 'Tests check behavior, they do not speed up code.' },
        { text: 'Because reading is not allowed', explanation: 'Reading is essential. Tests make it reliable.' },
        { text: 'Because every guess is always wrong', explanation: 'Many guesses are right. The point is to confirm them.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Read unfamiliar Python by starting at the entry point, tracing one real example, mapping each module and its data shapes, and confirming every important guess with the tests, a small experiment, or a debugger.',
  resources: [
    { title: 'The ast module', provider: 'Python.org', description: 'The standard library reference for parsing Python source into a tree you can inspect.', url: 'https://docs.python.org/3/library/ast.html' },
    { title: 'Reading code effectively', provider: 'Real Python', description: 'A practical tutorial on navigating and understanding existing Python codebases.', url: 'https://realpython.com/' },
  ],
}

export default lesson
