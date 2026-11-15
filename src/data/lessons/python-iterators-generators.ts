import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how a `for` loop uses `iter()` and `next()` behind the scenes',
    'Write a generator function with `yield` that produces values one at a time',
    'Chain generators into a pipeline that handles large data without loading it all',
  ],
  bigIdea: "A `for` loop does not need a whole list in memory. It only needs something that can hand over the next value when asked, called an iterator. A generator is the easiest way to make one: a function that uses `yield` to produce values one at a time, only when they are needed.",
  whyItMatters: "Your script needs to find the errors in a 20 GB server log. Reading the whole file into a list asks for 20 GB of memory, and your laptop freezes. Processing it as a stream, one line at a time, keeps memory use tiny no matter how big the file is. Generators let you write that stream as a few short, readable functions.",
  goalSections: [
    {
      heading: 'How a for loop really works',
      paragraphs: [
        "When you write `for x in things:`, Python first calls `iter(things)` to get an iterator, an object that remembers where it is up to. Then it calls `next()` on that iterator again and again, running the loop body with each value.",
        "When there are no values left, `next()` raises `StopIteration`. The `for` loop catches that quietly and ends. Anything that works with `iter()` is called iterable: lists, strings, dictionaries, files and more.",
        "An iterator only goes forwards and can only be used once. After it is used up, asking it for more gives nothing.",
        "`next()` also accepts a default as a second argument, which it returns instead of raising `StopIteration` when nothing is left. That is handy when you only want the first match from a stream, or a fallback value if there is none.",
      ],
      example: {
        language: 'python',
        code: code`
          colors = ["red", "green"]
          it = iter(colors)

          print(next(it))
          print(next(it))
          print(next(it, "no more"))
        `,
        output: 'red\ngreen\nno more',
      },
    },
    {
      heading: 'Generators with yield',
      paragraphs: [
        "A generator function looks like a normal function, but uses `yield` instead of `return`. Calling it does not run the body. It returns a generator, which is an iterator.",
        "Each time you ask for the next value, the body runs until it reaches `yield`, hands that value out, and pauses right there, keeping all its local variables. The next request resumes from the same spot. When the body ends, iteration stops.",
        "Because values are made only when asked for, this is called lazy evaluation. A generator can even describe an endless sequence, since it never computes more than you request.",
      ],
      example: {
        language: 'python',
        code: code`
          def countdown(n):
              print("starting")
              while n > 0:
                  yield n
                  n -= 1

          gen = countdown(3)
          print("created")
          for value in gen:
              print(value)
        `,
        output: 'created\nstarting\n3\n2\n1',
      },
    },
    {
      heading: 'Pipelines that stream data',
      paragraphs: [
        "Generators can feed each other. One reads lines, the next keeps only the interesting ones, the next pulls out a field. Each step takes an iterable and yields results, so only one item moves through the whole pipeline at a time.",
        "A generator expression is the short form: like a list comprehension, but with round brackets. `(line.strip() for line in lines)` makes values on demand, while `[line.strip() for line in lines]` builds the whole list in memory at once.",
        "Functions such as `sum()`, `max()` and `any()` accept generators directly, and `itertools.islice` takes just the first few items of any stream.",
      ],
      example: {
        language: 'python',
        code: code`
          import sys

          squares_list = [n * n for n in range(1_000_000)]
          squares_gen = (n * n for n in range(1_000_000))

          print(sys.getsizeof(squares_list) > 1_000_000)
          print(sys.getsizeof(squares_gen) < 1_000)
          print(sum(squares_gen) == sum(squares_list))
        `,
        output: 'True\nTrue\nTrue',
      },
    },
  ],
  seeItInAction: {
    title: 'Finding errors in a log, one line at a time',
    intro: "This pipeline reads log lines, keeps the errors, and pulls out the service names. The log here is a short list so the code runs anywhere, but the same functions work unchanged on a file opened with `open()`, however large.",
    example: {
      language: 'python',
      code: code`
        from itertools import islice

        log = [
            "09:00 INFO  auth  user logged in",
            "09:01 ERROR db    connection timed out",
            "09:02 INFO  web   page served",
            "09:03 ERROR auth  bad token",
            "09:04 ERROR db    connection timed out",
        ]

        def errors(lines):
            for line in lines:
                if " ERROR " in line:
                    yield line

        def services(lines):
            for line in lines:
                yield line.split()[2]

        pipeline = services(errors(log))
        print(list(islice(pipeline, 2)))
        print(next(pipeline))
        print(next(pipeline, "done"))
      `,
      output: "['db', 'auth']\ndb\ndone",
    },
    steps: [
      { code: 'def errors(lines):\n    for line in lines:\n        if " ERROR " in line:\n            yield line', explanation: "A filter. It accepts any iterable, a list or an open file, and yields only error lines." },
      { code: 'yield line.split()[2]', explanation: "`.split()` breaks a line into words, and position 2 is the service name." },
      { code: 'pipeline = services(errors(log))', explanation: "Nothing has run yet. This just connects the two generators, like plugging pipes together." },
      { code: 'list(islice(pipeline, 2))', explanation: "Asks for the first two results. Each request pulls lines through `errors` only until enough have arrived." },
      { code: 'print(next(pipeline))', explanation: "The pipeline paused after the second error. Asking again resumes it, and the third error gives `db`." },
      { code: 'print(next(pipeline, "done"))', explanation: "The stream is used up. The default value `\"done\"` is returned instead of raising `StopIteration`." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Add a third generator `times(lines)` that yields the first word of each line, and use `times(errors(log))`. Predict the output.',
      'Call `list(pipeline)` twice in a row on a fresh pipeline. Predict what the second call returns, then run it.',
    ],
    playground: 'python',
    starterCode: code`
      from itertools import islice

      log = [
          "09:00 INFO  auth  user logged in",
          "09:01 ERROR db    connection timed out",
          "09:02 INFO  web   page served",
          "09:03 ERROR auth  bad token",
          "09:04 ERROR db    connection timed out",
      ]

      def errors(lines):
          for line in lines:
              if " ERROR " in line:
                  yield line

      def services(lines):
          for line in lines:
              yield line.split()[2]

      pipeline = services(errors(log))
      print(list(islice(pipeline, 2)))
      print(next(pipeline))
      print(next(pipeline, "done"))
    `,
  },
  mistakes: [
    { mistake: 'Looping over the same generator twice and getting nothing the second time.', fix: 'A generator is used up after one pass. Call the generator function again for a fresh one, or store the results in a list if you need them twice.' },
    { mistake: 'Wrapping a huge stream in `list()` out of habit.', fix: '`list()` loads everything into memory and throws away the benefit. Pass the generator straight to `sum`, `max` or a `for` loop.' },
    { mistake: 'Expecting the generator body to run when you call the function.', fix: 'Calling it only creates the generator. The body runs as values are requested.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        def evens(limit):
            for n in range(limit):
                if n % 2 == 0:
                    yield n

        gen = evens(7)
        print(list(gen))
        print(list(gen))
      ` },
      options: [
        { text: '[0, 2, 4, 6] twice', explanation: 'The first `list()` uses the generator up, so the second gets nothing.' },
        { text: '[0, 2, 4, 6], then []', explanation: 'A generator can only be used once. The second `list(gen)` finds it already finished.' },
        { text: '[2, 4, 6], then []', explanation: '`range(7)` starts at 0, and 0 is even, so 0 is included.' },
        { text: 'An error on the second line', explanation: 'An exhausted generator simply produces no more values. It does not raise an error in `list()`.' },
      ],
      answer: 1,
    },
    {
      question: 'What is printed when this runs?',
      code: { language: 'python', code: code`
        it = iter([10, 20, 30])
        next(it)
        print(sum(it))
      ` },
      options: [
        { text: '60', explanation: 'The first `next(it)` already took 10, so the sum only sees what remains.' },
        { text: '10', explanation: '10 was taken by `next`, but its value was not printed.' },
        { text: '30', explanation: 'That is only the last item. `sum` adds everything left in the iterator.' },
        { text: '50', explanation: '`next(it)` consumed the 10. The iterator then has 20 and 30 left, which add up to 50.' },
      ],
      answer: 3,
      answerIsOutput: true,
    },
    {
      question: 'You need the average length of lines in a 30 GB text file. Which approach uses the least memory?',
      options: [
        { text: 'Loop over the open file line by line, keeping a running total and count', explanation: 'A file object is an iterator that reads one line at a time, so memory stays tiny.' },
        { text: '`lines = open(path).readlines()`, then average them', explanation: '`readlines()` builds a list of every line, needing about 30 GB of memory.' },
        { text: '`text = open(path).read()`, then split it', explanation: '`read()` loads the whole file at once, and splitting makes a second copy.' },
        { text: 'Use a list comprehension of the line lengths', explanation: 'A list comprehension builds the full list in memory. A generator expression would be fine.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A `for` loop only needs an iterator, and generators let you write lazy, one-item-at-a-time pipelines that handle data of any size in very little memory.',
  resources: [
    { title: 'Generators', provider: 'Python.org', description: 'The official tutorial section on iterators, generators and generator expressions.', url: 'https://docs.python.org/3/tutorial/classes.html#generators' },
    { title: 'itertools', provider: 'Python.org', description: 'Ready-made tools for slicing, chaining and grouping streams.', url: 'https://docs.python.org/3/library/itertools.html' },
  ],
  underTheHood: {
    heading: 'The iterator protocol in a class',
    paragraphs: [
      "Any object can become iterable by following two rules, known together as the iterator protocol. Its `__iter__` method must return an iterator. That iterator's `__next__` method must return the next value, or raise `StopIteration` when there are no more.",
      "A countdown written as a class needs an `__init__` that stores the current number, an `__iter__` that returns `self`, and a `__next__` that checks for zero, raises `StopIteration` if done, and otherwise decreases the number and returns it. That is about ten lines and easy to get subtly wrong.",
      "A generator function does all of this for you. Python builds an object with `__iter__` and `__next__` automatically, stores the paused function's local variables inside it, and raises `StopIteration` when the body finishes. That is why generators are the usual choice, and hand-written iterator classes are kept for cases that need extra methods.",
    ],
  },
}

export default lesson
