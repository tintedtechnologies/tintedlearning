import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Add type hints to function parameters and return values',
    'Describe a structured record with a dataclass',
    'Split code into modules and use a Protocol so parts can be swapped safely',
  ],
  bigIdea: "Type hints are labels that say what kind of value a variable, parameter or return value should hold. Python does not enforce them while running, but tools and editors read them to catch mistakes before you run anything. Together with dataclasses and well-chosen modules, they make a growing program easier to understand and safer to change.",
  whyItMatters: "Six months after writing a function called `load_orders(source)`, you cannot remember whether `source` is a file path, an open file or a list of dictionaries, or what comes back. You read the whole function to find out, and a teammate guesses wrong and causes a crash in production. One line, `def load_orders(source: Path) -> list[Order]:`, would have answered both questions and let a checker catch the wrong call instantly.",
  goalSections: [
    {
      heading: 'Type hints on functions',
      paragraphs: [
        "Write a type after a parameter with a colon, and the return type after `->`. `def area(width: float, height: float) -> float:` says both inputs and the result are floats.",
        "Built-in types work as hints: `int`, `str`, `float`, `bool`. Collections say what they contain: `list[str]` is a list of strings and `dict[str, int]` maps strings to integers. `str | None` means a string or nothing.",
        "Python ignores hints when running, so wrong types do not fail on their own. A type checker such as mypy, run with `python -m mypy yourfile.py`, reads the hints and reports mismatches. Most editors run one as you type and underline problems.",
      ],
      example: {
        language: 'python',
        code: code`
          def average(scores: list[float]) -> float | None:
              if not scores:
                  return None
              return sum(scores) / len(scores)

          print(average([70.0, 90.0]))
          print(average([]))
          print(average.__annotations__["return"])
        `,
        output: '80.0\nNone\nfloat | None',
      },
    },
    {
      heading: 'Dataclasses for structured records',
      paragraphs: [
        "When data has a fixed set of named fields, like an order with an id, a customer and a total, a dictionary is easy to get wrong: a typo in a key just creates a new key. A dataclass gives the record a proper shape.",
        "Put `@dataclass` above a class and list the fields with their types. Python writes `__init__`, a readable printout and equality checks for you. A misspelled field now fails immediately instead of silently.",
        "Add `frozen=True` to make records that cannot be changed after creation, which prevents a whole class of bugs where one part of the program edits data another part relies on.",
      ],
      example: {
        language: 'python',
        code: code`
          from dataclasses import dataclass

          @dataclass(frozen=True)
          class Order:
              order_id: str
              customer: str
              total_cents: int

          order = Order("A-17", "Ana", 2599)
          print(order)
          print(order == Order("A-17", "Ana", 2599))
        `,
        output: "Order(order_id='A-17', customer='Ana', total_cents=2599)\nTrue",
      },
    },
    {
      heading: 'Modules, packages and Protocols',
      paragraphs: [
        "As a program grows, split it by responsibility. A module is one `.py` file. A package is a folder of modules with an `__init__.py` file. Keep the core rules separate from the parts that touch the outside world, such as files, databases and APIs. Then the core can be tested without any of them.",
        "Where the core needs something from outside, such as somewhere to save orders, describe what it needs with a `Protocol`: a class listing the methods required, with no code. Any class with matching methods fits, without inheriting from anything. The type checker confirms it fits.",
        "The core then depends only on the Protocol, so you can swap a real database for a simple in-memory list in tests.",
      ],
      example: {
        language: 'text',
        code: code`
          orders/
            __init__.py      public names other code may import
            models.py        Order dataclass
            service.py       the rules: create, validate, total
            storage.py       OrderStore Protocol, plus a JSON file version
          tests/
            test_service.py  uses an in-memory store, no files needed
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A service that works with any store',
    intro: "The service needs somewhere to save orders. It asks for an `OrderStore`, a Protocol. The in-memory store has the right methods, so it fits, and the service never knows which store it is using.",
    example: {
      language: 'python',
      code: code`
        from dataclasses import dataclass
        from typing import Protocol

        @dataclass(frozen=True)
        class Order:
            order_id: str
            total_cents: int

        class OrderStore(Protocol):
            def save(self, order: Order) -> None: ...
            def all(self) -> list[Order]: ...

        class MemoryStore:
            def __init__(self) -> None:
                self._orders: list[Order] = []

            def save(self, order: Order) -> None:
                self._orders.append(order)

            def all(self) -> list[Order]:
                return list(self._orders)

        def place_order(store: OrderStore, order_id: str, total_cents: int) -> Order:
            if total_cents <= 0:
                raise ValueError("total must be positive")
            order = Order(order_id, total_cents)
            store.save(order)
            return order

        def revenue(store: OrderStore) -> int:
            return sum(order.total_cents for order in store.all())

        store = MemoryStore()
        place_order(store, "A-1", 1500)
        place_order(store, "A-2", 2500)
        print(revenue(store))
        print(len(store.all()))
      `,
      output: '4000\n2',
    },
    steps: [
      { code: 'class OrderStore(Protocol):\n    def save(self, order: Order) -> None: ...', explanation: "The Protocol lists what a store must be able to do. The `...` means no body: it is a description, not code that runs." },
      { code: 'class MemoryStore:', explanation: "It does not mention `OrderStore` at all. It fits because it has `save` and `all` with matching types. This is called structural typing." },
      { code: 'self._orders: list[Order] = []', explanation: "Hints work on variables too. The leading underscore is a convention meaning internal, so other code should use the methods." },
      { code: 'def place_order(store: OrderStore, ...) -> Order:', explanation: "The core rule asks for any `OrderStore`. A JSON file store or a database store with the same methods could be passed in without changing this function." },
      { code: 'if total_cents <= 0:\n    raise ValueError(...)', explanation: "Validation lives in the core, so every store gets the same rule." },
      { code: 'print(revenue(store))', explanation: "1500 plus 2500 cents is 4000. In a test, this in-memory store makes checks fast and free of files." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Call `place_order(store, "A-3", -50)` and predict what happens before running it.',
      'Write a `CountingStore` class that has `save` and `all` methods and also counts how many times `save` was called. Pass it to `place_order` without changing the service functions.',
    ],
    playground: 'python',
    starterCode: code`
      from dataclasses import dataclass
      from typing import Protocol

      @dataclass(frozen=True)
      class Order:
          order_id: str
          total_cents: int

      class OrderStore(Protocol):
          def save(self, order: Order) -> None: ...
          def all(self) -> list[Order]: ...

      class MemoryStore:
          def __init__(self) -> None:
              self._orders: list[Order] = []

          def save(self, order: Order) -> None:
              self._orders.append(order)

          def all(self) -> list[Order]:
              return list(self._orders)

      def place_order(store: OrderStore, order_id: str, total_cents: int) -> Order:
          if total_cents <= 0:
              raise ValueError("total must be positive")
          order = Order(order_id, total_cents)
          store.save(order)
          return order

      def revenue(store: OrderStore) -> int:
          return sum(order.total_cents for order in store.all())

      store = MemoryStore()
      place_order(store, "A-1", 1500)
      place_order(store, "A-2", 2500)
      print(revenue(store))
      print(len(store.all()))
    `,
  },
  mistakes: [
    { mistake: 'Believing type hints stop wrong values at run time.', fix: 'Python ignores hints when running. Run a type checker such as mypy, and still validate data that comes from users or files.' },
    { mistake: 'Passing dictionaries with changing keys between many functions.', fix: 'Define a dataclass for any record with a fixed shape, so misspelled fields fail loudly.' },
    { mistake: 'Letting core rules open files or call APIs directly.', fix: 'Keep outside-world code in its own module behind a Protocol, and pass it in.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        def double(n: int) -> int:
            return n * 2

        print(double("ab"))
      ` },
      options: [
        { text: 'abab', explanation: 'Python ignores the hint at run time, and multiplying a string by 2 repeats it.' },
        { text: 'TypeError', explanation: 'Hints are not checked while running. Only a type checker like mypy would flag this call.' },
        { text: '0', explanation: 'The string is not turned into a number. It is repeated.' },
        { text: 'None', explanation: 'The function returns `n * 2`, which is a real value.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'What does `def find(name: str) -> User | None:` tell a reader?',
      options: [
        { text: 'It returns a string or a User', explanation: 'The part after `->` is the return type, which is a User or nothing. The `str` is the parameter.' },
        { text: 'It always returns a User', explanation: '`| None` means it may also return nothing, so callers must handle that case.' },
        { text: 'It takes a name as text and returns either a User or None', explanation: 'The parameter type comes after the colon, and the return type after the arrow.' },
        { text: 'It raises an error if the user is missing', explanation: 'Nothing in the hint says it raises. Returning `None` is the documented way it reports a missing user.' },
      ],
      answer: 2,
    },
    {
      question: 'Your order service saves to a database. Tests are slow and need a running database. What is the best change?',
      options: [
        { text: 'Delete the tests that touch saving', explanation: 'Saving is important behavior. Removing its tests hides bugs instead of fixing the slowness.' },
        { text: 'Define a store Protocol, have the service accept any store, and pass an in-memory store in tests', explanation: 'The core rules get fast tests, and only a few separate tests need the real database.' },
        { text: 'Make the service inherit from the database class', explanation: 'That ties the service even more tightly to the database, which is the opposite of what you want.' },
        { text: 'Add type hints, which will make the tests faster', explanation: 'Hints describe types. They do not change how fast anything runs.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Type hints and dataclasses make the shape of your data clear and checkable, and Protocols let you split a program into modules that can be swapped and tested separately.',
  resources: [
    { title: 'Type hints cheat sheet', provider: 'mypy', description: 'Quick reference for writing hints for functions, collections and classes.', url: 'https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html' },
    { title: 'dataclasses', provider: 'Python.org', description: 'Reference for dataclass options such as frozen, defaults and ordering.', url: 'https://docs.python.org/3/library/dataclasses.html' },
  ],
  underTheHood: {
    heading: 'Where type hints are stored',
    paragraphs: [
      "When Python defines a function, it evaluates the hints and stores them in a dictionary on the function called `__annotations__`. You saw that in the first example. Apart from storing them, Python does nothing with them: no checks, no conversions, and no speed difference.",
      "Other tools read that information. mypy and editors read the hints straight from your source code, without running it, and work out whether every call fits. That is called static type checking. Libraries can also read `__annotations__` while the program runs. Dataclasses use them to discover the fields, and libraries such as Pydantic use them to validate and convert incoming data, such as JSON from an API, into the right types.",
      "This split is deliberate. Hints stay optional, so you can add them gradually to existing code, starting with the functions other people call.",
    ],
  },
}

export default lesson
