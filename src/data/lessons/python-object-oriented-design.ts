import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a class with attributes and methods, and create objects from it',
    'Use `__init__` and `self` so each object keeps its own data',
    'Decide when to build a class from other objects and when to use inheritance',
  ],
  bigIdea: "A class is a blueprint that bundles data together with the functions that work on that data. Each object made from the class gets its own copy of the data but shares the same behavior. Classes help most when a program has several kinds of thing, each with its own state and rules.",
  whyItMatters: "A shopping cart program starts as a list of prices and a few loose functions. Then you add quantities, discounts, gift cards and tax, and the same five values get passed to every function. Soon one function forgets the discount and a customer is overcharged. A `Cart` class keeps all of that state in one place, behind methods that always apply the rules correctly.",
  goalSections: [
    {
      heading: 'Classes, objects, attributes and methods',
      paragraphs: [
        "You define a class with `class` and a name written in CapitalWords, such as `BankAccount`. Calling the class like a function, `BankAccount()`, creates an object, also called an instance.",
        "Data stored on an object is an attribute, read with a dot: `account.balance`. Functions defined inside the class are methods, called with a dot too: `account.deposit(50)`. Methods are how the outside world should change an object, so the rules live in one place.",
        "You have used objects all along. A list is an object of class `list`, and `.append()` is one of its methods. A string is an object too, which is why you can write `\"hello\".upper()`. Writing your own classes means creating new kinds of object like these, shaped around your own program.",
      ],
      example: {
        language: 'python',
        code: code`
          class Counter:
              def __init__(self):
                  self.count = 0

              def click(self):
                  self.count += 1

          door = Counter()
          door.click()
          door.click()
          print(door.count)
          print(type(door).__name__)
        `,
        output: '2\nCounter',
      },
    },
    {
      heading: '__init__ and self',
      paragraphs: [
        "`__init__` is a special method that Python runs automatically when you create an object. It sets up the starting attributes. Any arguments you pass to the class go to `__init__`.",
        "`self` is the first parameter of every method. It refers to the particular object the method was called on. When you call `alice.deposit(50)`, Python runs `deposit` with `self` set to `alice`. That is how two accounts, made from the same class, keep separate balances.",
        "Methods can enforce rules. A `withdraw` method can refuse to go below zero, so no part of the program can accidentally create a negative balance.",
      ],
      example: {
        language: 'python',
        code: code`
          class BankAccount:
              def __init__(self, owner, balance=0):
                  self.owner = owner
                  self.balance = balance

              def withdraw(self, amount):
                  if amount > self.balance:
                      raise ValueError("insufficient funds")
                  self.balance -= amount

          alice = BankAccount("Alice", 100)
          bob = BankAccount("Bob")
          alice.withdraw(30)
          print(alice.balance, bob.balance)
        `,
        output: '70 0',
      },
    },
    {
      heading: 'Composition and inheritance',
      paragraphs: [
        "Inheritance creates a class that extends another: `class SavingsAccount(BankAccount):` gets every attribute and method of `BankAccount` and can add or change some. Use it for a true \"is a kind of\" relationship, where the new class can be used anywhere the old one can.",
        "Composition builds a class out of other objects: a `Cart` has a list of `Item` objects and a discount rule. Use it for \"has a\" relationships, and whenever a part may need swapping, such as a different discount each season.",
        "When unsure, prefer composition. Deep chains of inheritance are hard to follow, because a method might be defined three classes up. Swappable parts are easier to change and to test.",
      ],
      example: {
        language: 'python',
        code: code`
          class Item:
              def __init__(self, name, price):
                  self.name = name
                  self.price = price

          class Cart:
              def __init__(self):
                  self.items = []

              def add(self, item):
                  self.items.append(item)

          cart = Cart()
          cart.add(Item("Pen", 2.5))
          cart.add(Item("Pad", 4.0))
          print([item.name for item in cart.items])
        `,
        output: "['Pen', 'Pad']",
      },
    },
  ],
  seeItInAction: {
    title: 'A cart with a swappable discount',
    intro: "The cart is composed of items and a discount object. Each discount class has the same method, `apply`, so the cart can use any of them without knowing which one it has.",
    example: {
      language: 'python',
      code: code`
        class Item:
            def __init__(self, name, price, quantity=1):
                self.name = name
                self.price = price
                self.quantity = quantity

        class NoDiscount:
            def apply(self, subtotal):
                return subtotal

        class PercentOff:
            def __init__(self, percent):
                self.percent = percent

            def apply(self, subtotal):
                return subtotal * (1 - self.percent / 100)

        class Cart:
            def __init__(self, discount=None):
                self.items = []
                self.discount = discount or NoDiscount()

            def add(self, item):
                self.items.append(item)

            def total(self):
                subtotal = sum(i.price * i.quantity for i in self.items)
                return round(self.discount.apply(subtotal), 2)

        cart = Cart()
        cart.add(Item("Notebook", 4.5, 2))
        cart.add(Item("Pen", 1.2, 5))
        print(cart.total())

        cart.discount = PercentOff(10)
        print(cart.total())
      `,
      output: '15.0\n13.5',
    },
    steps: [
      { code: 'class Item:', explanation: "A small class that only holds data. Each item knows its name, price and quantity." },
      { code: 'class NoDiscount: ...\nclass PercentOff: ...', explanation: "Two discount classes with the same `apply` method. Neither inherits from anything. They just share an interface: the methods other code relies on." },
      { code: 'self.discount = discount or NoDiscount()', explanation: "Composition: the cart has a discount. `or` uses `NoDiscount()` when no discount is given." },
      { code: 'subtotal = sum(i.price * i.quantity for i in self.items)', explanation: "The cart works out its own subtotal: 2 notebooks at 4.5 plus 5 pens at 1.2 is 15." },
      { code: 'return round(self.discount.apply(subtotal), 2)', explanation: "The cart asks its discount object to do the math. It does not care which kind of discount it is." },
      { code: 'cart.discount = PercentOff(10)', explanation: "Swapping the part changes the behavior, 15 becomes 13.5, without touching the `Cart` class at all." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Write a class `FixedOff` whose `__init__` takes an amount and whose `apply` takes that amount off the subtotal. Predict `cart.total()` with `FixedOff(5)` before running.',
      'Make `FixedOff` never go below zero. Test it with `FixedOff(50)`.',
    ],
    playground: 'python',
    starterCode: code`
      class Item:
          def __init__(self, name, price, quantity=1):
              self.name = name
              self.price = price
              self.quantity = quantity

      class NoDiscount:
          def apply(self, subtotal):
              return subtotal

      class PercentOff:
          def __init__(self, percent):
              self.percent = percent

          def apply(self, subtotal):
              return subtotal * (1 - self.percent / 100)

      class Cart:
          def __init__(self, discount=None):
              self.items = []
              self.discount = discount or NoDiscount()

          def add(self, item):
              self.items.append(item)

          def total(self):
              subtotal = sum(i.price * i.quantity for i in self.items)
              return round(self.discount.apply(subtotal), 2)

      cart = Cart()
      cart.add(Item("Notebook", 4.5, 2))
      cart.add(Item("Pen", 1.2, 5))
      print(cart.total())

      cart.discount = PercentOff(10)
      print(cart.total())
    `,
  },
  mistakes: [
    { mistake: 'Forgetting `self` as the first parameter of a method.', fix: 'Python passes the object in automatically, so `def withdraw(amount):` fails with a confusing error about the number of arguments. Write `def withdraw(self, amount):`.' },
    { mistake: 'Writing `balance = 0` inside `__init__` instead of `self.balance = 0`.', fix: 'Without `self.`, it is a local variable that disappears when `__init__` ends.' },
    { mistake: 'Using inheritance just to reuse a few lines of code.', fix: 'Inherit only for a real "is a kind of" relationship. Otherwise, give the class the other object as an attribute.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        class Lamp:
            def __init__(self):
                self.on = False

            def toggle(self):
                self.on = not self.on

        a = Lamp()
        b = Lamp()
        a.toggle()
        a.toggle()
        b.toggle()
        print(a.on, b.on)
      ` },
      options: [
        { text: 'True True', explanation: 'Lamp `a` was toggled twice, which switches it on and then off again.' },
        { text: 'False True', explanation: 'Each lamp has its own `on` attribute. `a` went on then off, and `b` went on once.' },
        { text: 'True False', explanation: 'That swaps the two lamps. The single toggle on `b` switched it on.' },
        { text: 'False False', explanation: 'The two objects do not share state, so toggling `a` twice does not undo the toggle on `b`.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Inside a method, what does `self` refer to?',
      options: [
        { text: 'The class itself', explanation: 'The class is the blueprint. `self` is one specific object made from it.' },
        { text: 'Every object made from the class', explanation: '`self` is just one object, which is why each one keeps separate data.' },
        { text: 'The particular object the method was called on', explanation: 'In `alice.withdraw(30)`, `self` is `alice`. In `bob.withdraw(30)`, it is `bob`.' },
        { text: 'The method that is currently running', explanation: '`self` refers to an object, not to a function.' },
      ],
      answer: 2,
    },
    {
      question: 'A delivery app needs to price orders by bike, van or drone, and the company plans to add more options later. Which design is easiest to extend?',
      options: [
        { text: 'An `Order` class that has a delivery object, with one small class per method, each with the same `price` method', explanation: 'Composition: adding a new option is a new small class, and `Order` never changes.' },
        { text: 'One `Order` class with an `if` chain checking the delivery type in every method', explanation: 'Every new option means editing several `if` chains, and missing one causes bugs.' },
        { text: 'A separate copy of the whole `Order` class for each delivery type', explanation: 'Any fix to orders would have to be repeated in every copy.' },
        { text: 'Make `Order` inherit from `Bike`, `Van` and `Drone` at once', explanation: 'An order is not a kind of bike. Mixing several parents this way is confusing and fragile.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Use a class to keep related data and the rules that change it together, give each object its own state through `self`, and prefer building classes from swappable parts over deep inheritance.',
  resources: [
    { title: 'Classes', provider: 'Python.org', description: 'The official tutorial on classes, instances, methods and inheritance.', url: 'https://docs.python.org/3/tutorial/classes.html' },
    { title: 'Composition over inheritance', provider: 'Python Design Patterns', description: 'A clear explanation, with Python examples, of why swappable parts often beat subclasses.', url: 'https://python-patterns.guide/gang-of-four/composition-over-inheritance/' },
  ],
  underTheHood: {
    heading: 'What a method call really does',
    paragraphs: [
      "When you write `alice.withdraw(30)`, Python looks for an attribute called `withdraw` on the object `alice`. It does not find one there, because methods are stored on the class, so it looks on `BankAccount` and finds the function.",
      "Python then binds the object to the function and calls it, which is exactly the same as writing `BankAccount.withdraw(alice, 30)`. That is the whole secret of `self`: it is an ordinary first parameter that Python fills in for you.",
      "Each object stores its own attributes in a dictionary, which you can see with `vars(alice)`, giving `{'owner': 'Alice', 'balance': 70}`. Method lookup follows a fixed order called the method resolution order: first the object, then its class, then any parent classes. When a subclass defines a method with the same name as its parent, the subclass version is found first. That is called overriding.",
    ],
  },
}

export default lesson
