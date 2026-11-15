import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read a traceback to find the failing line and the kind of error',
    'Catch an error you expect with `try` and `except`',
    'Find a bug by printing values one step at a time',
  ],
  bigIdea: "When Python hits a problem it cannot handle, it stops and prints a traceback: a report of what went wrong and where. Reading it from the bottom up usually tells you the fix. For problems you expect, such as a user typing letters where you wanted a number, you can catch the error and carry on.",
  whyItMatters: "Your script imports 5,000 orders from a spreadsheet and crashes on order 3,417 because someone typed \"ten\" instead of 10. Without knowing how to read the error, you might spend an hour staring at code that is actually fine. With a traceback you find the line in seconds, and with `try` and `except` you can log the bad row and let the other 4,999 orders through.",
  goalSections: [
    {
      heading: 'Reading a traceback',
      paragraphs: [
        "Read a traceback from the bottom up. The last line names the kind of error, called the exception type, followed by a short message. `ZeroDivisionError: division by zero` tells you exactly what happened.",
        "The lines above show the path Python took to get there, with the most recent step at the bottom. Each step gives a file name, a line number and the code on that line. The bottom step is where the error happened. The steps above it show which line called which function.",
        "The line where Python noticed the problem is not always where the mistake is. Here, dividing by zero happens inside `average`, but the real mistake is calling it with an empty list.",
      ],
      example: {
        language: 'text',
        code: code`
          Traceback (most recent call last):
            File "report.py", line 5, in <module>
              print(average([]))
            File "report.py", line 2, in average
              return sum(values) / len(values)
          ZeroDivisionError: division by zero
        `,
      },
    },
    {
      heading: 'Catching expected errors with try and except',
      paragraphs: [
        "Put code that might fail inside a `try` block. If an error happens, Python jumps to the matching `except` block instead of stopping the program. If nothing goes wrong, the `except` block is skipped.",
        "Always name the error you expect, such as `except ValueError:`. That way you only handle the problem you planned for. A typo or a different bug still shows up as a normal traceback, which is what you want.",
        "Only catch errors you can actually do something sensible about: use a default, skip a bad row, or show a friendly message.",
      ],
      example: {
        language: 'python',
        code: code`
          def to_number(text):
              try:
                  return int(text)
              except ValueError:
                  print("Not a number:", text)
                  return None

          print(to_number("42"))
          print(to_number("forty"))
        `,
        output: '42\nNot a number: forty\nNone',
      },
    },
    {
      heading: 'Finding a bug step by step',
      paragraphs: [
        "Some bugs do not crash. The program runs and gives the wrong answer. To find these, check what your values actually are, instead of what you assume they are.",
        "The simplest tool is a temporary `print()` placed just before the result goes wrong. Wrapping a value in `repr()` shows it exactly, including quotes and hidden spaces. Once you see the real value, the bug is usually obvious.",
        "Work from a small example you can check by hand, change one thing at a time, and remove the debug prints when you are done.",
        "Python also has a built-in debugger. Add the line `breakpoint()` where you want to look, and the program pauses there so you can type a variable name to see its value. For most beginner bugs, a well-placed print is enough.",
      ],
      example: {
        language: 'python',
        code: code`
          def count_words(text):
              words = text.split(" ")
              print("DEBUG:", repr(words))
              return len(words)

          print(count_words("hello  world"))
        `,
        output: "DEBUG: ['hello', '', 'world']\n3",
      },
    },
  ],
  seeItInAction: {
    title: 'Totalling orders when some rows are bad',
    intro: "Here a list of order quantities, as they might arrive from a spreadsheet, contains one bad value. The program adds up the good rows and records the bad ones instead of crashing.",
    example: {
      language: 'python',
      code: code`
        orders = ["3", "2", "ten", "5"]
        total = 0
        problems = []

        for position, raw in enumerate(orders):
            try:
                total += int(raw)
            except ValueError:
                problems.append((position, raw))

        print("Total items:", total)
        print("Could not read:", problems)
      `,
      output: "Total items: 10\nCould not read: [(2, 'ten')]",
    },
    steps: [
      { code: 'orders = ["3", "2", "ten", "5"]', explanation: "Data from files arrives as text, so every quantity is a string, and one is not a number at all." },
      { code: 'for position, raw in enumerate(orders):', explanation: "`enumerate()` gives each item with its position, so a problem can be reported with the row it came from." },
      { code: 'try:\n    total += int(raw)', explanation: "`int()` turns text like \"3\" into the number 3. For \"ten\" it raises a `ValueError`, and Python jumps straight to `except`, skipping the addition." },
      { code: 'except ValueError:\n    problems.append((position, raw))', explanation: "Only a `ValueError` is caught. The bad row is saved with its position, and the loop moves on to the next item." },
      { code: 'print("Could not read:", problems)', explanation: "The program reports a total of 10 from the three good rows, and tells you exactly which row needs fixing: position 2, \"ten\"." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground and check the output.',
      'Change `"5"` to `"5.5"`. Predict whether it is added to the total or listed as a problem, then run it.',
      'Delete the `try` and `except` lines (and un-indent the addition). Run it and read the traceback from the bottom up.',
    ],
    playground: 'python',
    starterCode: code`
      orders = ["3", "2", "ten", "5"]
      total = 0
      problems = []

      for position, raw in enumerate(orders):
          try:
              total += int(raw)
          except ValueError:
              problems.append((position, raw))

      print("Total items:", total)
      print("Could not read:", problems)
    `,
  },
  mistakes: [
    { mistake: 'Reading a traceback from the top and getting lost.', fix: 'Start at the last line for the error type and message, then look at the line just above it for where it happened.' },
    { mistake: 'Catching every error with a bare `except:` or `except Exception: pass`.', fix: 'This hides real bugs, including typos. Catch the specific error you expect and handle it on purpose.' },
    { mistake: 'Changing several things at once while hunting a bug.', fix: 'Change one thing, run again, and compare. Otherwise you cannot tell which change fixed it, or broke something else.' },
  ],
  quiz: [
    {
      question: 'A traceback ends with `KeyError: \'email\'`. What does it mean?',
      options: [
        { text: 'The code tried to read the key "email" from a dictionary that does not have it', explanation: 'A `KeyError` names the missing key. Use `.get("email")` or check that the key exists first.' },
        { text: 'The variable `email` has not been created yet', explanation: 'That would be a `NameError`, which is about an unknown variable name rather than a dictionary key.' },
        { text: 'The email address is in the wrong format', explanation: 'Python does not check email formats on its own. The error is about a dictionary lookup.' },
        { text: 'A key on the keyboard was pressed by mistake', explanation: 'The word key here means a dictionary key, not a keyboard key.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        try:
            n = int("3.5")
            print("ok", n)
        except ValueError:
            print("bad input")
        print("done")
      ` },
      options: [
        { text: 'ok 3, then done', explanation: '`int()` does not round text with a decimal point. It raises a `ValueError` instead.' },
        { text: 'ok 3.5, then done', explanation: '`int()` only makes whole numbers. To read "3.5", you would use `float()`.' },
        { text: 'bad input, and then the program stops', explanation: 'After `except` handles the error, the program carries on to the next line.' },
        { text: 'bad input, then done', explanation: '`int("3.5")` raises `ValueError`, so the `print("ok", n)` line is skipped, the `except` block runs, and the program continues.' },
      ],
      answer: 3,
    },
    {
      question: 'A colleague wraps their whole program in `try:` and `except Exception: pass`. The program now never crashes, but sometimes gives wrong totals. What is the problem?',
      options: [
        { text: 'There is no problem, since the program no longer crashes', explanation: 'A crash at least tells you something is wrong. Silent wrong totals are worse.' },
        { text: 'They should use `except ValueError: pass` everywhere instead', explanation: 'Narrower, but `pass` still silently throws errors away. Errors should be handled or reported.' },
        { text: 'Every error, including real bugs, is silently ignored, so nobody can see what went wrong', explanation: 'Catching everything and doing nothing hides the cause. Catch specific errors and record or report them.' },
        { text: 'Exception is not a real error type in Python', explanation: '`Exception` is real. It is the parent of almost every error type, which is exactly why catching it hides so much.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Read tracebacks from the bottom up, catch only the errors you expect and can handle, and print real values to find bugs that do not crash.',
  resources: [
    { title: 'Errors and exceptions', provider: 'Python.org', description: 'The official tutorial on tracebacks, try, except and raise.', url: 'https://docs.python.org/3/tutorial/errors.html' },
    { title: 'Built-in exceptions', provider: 'Python.org', description: 'A list of every standard error type and what it means.', url: 'https://docs.python.org/3/library/exceptions.html' },
  ],
  underTheHood: {
    heading: 'Raising your own errors',
    paragraphs: [
      "You can create errors as well as catch them, using `raise`. For example, a function that calculates an average can start with `if not values: raise ValueError(\"need at least one value\")`.",
      "This is better than letting the code fail later with a confusing `ZeroDivisionError`. The person calling your function gets a clear message at the exact point the bad input arrived, which is where the real mistake is.",
      "Errors are arranged in a family tree. `ValueError`, `KeyError` and `ZeroDivisionError` all descend from `Exception`. When you write `except ValueError`, Python checks whether the raised error is a `ValueError` or one of its descendants. That is why `except Exception` catches nearly everything, and why a specific name keeps your handling narrow. You can also add `else:` to run code only when no error happened, and `finally:` to run code no matter what.",
    ],
  },
}

export default lesson
