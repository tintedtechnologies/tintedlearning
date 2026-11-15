import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Define a function and call it by name',
    'Pass values in with parameters and send a result back with return',
    'Split a task into small functions you can check one at a time',
  ],
  bigIdea: "A function is a named, reusable block of code. You write the steps once, give them a name, and then run them whenever you need by calling that name. Values go in through parameters and a result comes back with `return`.",
  whyItMatters: "Imagine a shop program that works out a 20% discount in five different places. One day the discount changes to 25%, and you update four of the five places but miss one. Now some customers are charged the wrong price. If the discount lived in one function, you would change one line and every part of the program would be correct.",
  goalSections: [
    {
      heading: 'Defining and calling a function',
      paragraphs: [
        "You create a function with the word `def`, then a name, brackets, and a colon. The indented lines underneath are the function's body: the steps it will carry out.",
        "Defining a function does not run it. It only teaches Python the steps. To run them, you call the function by writing its name followed by brackets. You can call it as many times as you like.",
        "Pick names that say what the function does, usually starting with a verb, like `greet` or `calculate_total`. Words are joined with underscores, a style Python programmers call snake case.",
      ],
      example: {
        language: 'python',
        code: code`
          def greet():
              print("Welcome back!")
              print("You have 3 new messages.")

          greet()
          greet()
        `,
        output: 'Welcome back!\nYou have 3 new messages.\nWelcome back!\nYou have 3 new messages.',
      },
    },
    {
      heading: 'Parameters in, return value out',
      paragraphs: [
        "A parameter is a named input listed inside the brackets when you define a function. When you call it, the value you pass in is called an argument. Inside the function, the parameter holds that value.",
        "`return` sends a value back to the line that called the function, and ends the function right there. The caller can store that value, print it, or pass it into another function.",
        "Returning is not the same as printing. `print()` only shows a value on screen. A returned value can be used again in your program. If a function has no `return`, it gives back the special value `None`, which means nothing.",
        "A parameter can have a default value, as in `def add_tax(price, rate=0.2):`. Callers can then leave it out: `add_tax(50)` uses 0.2. You can also pass arguments by name, such as `add_tax(price=50, rate=0.1)`, which makes a call with several numbers easier to read.",
      ],
      example: {
        language: 'python',
        code: code`
          def add_tax(price, rate):
              return price * (1 + rate)

          total = add_tax(50, 0.2)
          print(total)
          print(add_tax(10, 0.5) + 1)
        `,
        output: '60.0\n16.0',
      },
    },
    {
      heading: 'Breaking a task into small functions',
      paragraphs: [
        "Big programs are easier to understand when each function does one job. Instead of one long block that cleans a name, checks it and formats a message, write three small functions and combine them.",
        "Small functions are easy to check. You can call one with a known input and see whether you get the expected output, before trusting it inside something bigger. If something breaks, you know which small piece to look at.",
        "A good test: if you cannot describe what a function does in one short sentence without using the word \"and\", it is probably doing too much.",
      ],
      example: {
        language: 'python',
        code: code`
          def clean_name(raw):
              return raw.strip().title()

          def make_badge(name, role):
              return name + " (" + role + ")"

          print(clean_name("  ada lovelace "))
          print(make_badge(clean_name(" grace hopper"), "Engineer"))
        `,
        output: 'Ada Lovelace\nGrace Hopper (Engineer)',
      },
    },
  ],
  seeItInAction: {
    title: 'Calculating an order with three small functions',
    intro: "This program prices an order. Each function has one job, and the last one combines the other two. It runs as written.",
    example: {
      language: 'python',
      code: code`
        def subtotal(price, quantity):
            return price * quantity

        def apply_discount(amount, percent):
            return amount - amount * percent / 100

        def order_total(price, quantity, percent):
            before = subtotal(price, quantity)
            return apply_discount(before, percent)

        print(order_total(20, 3, 10))
        print(order_total(5, 2, 0))
      `,
      output: '54.0\n10.0',
    },
    steps: [
      { code: 'def subtotal(price, quantity):\n    return price * quantity', explanation: "The first function multiplies two inputs and hands back the result. It knows nothing about discounts." },
      { code: 'def apply_discount(amount, percent):', explanation: "The second function takes any amount and a percentage. 10 percent of 60 is 6, so it returns 60 minus 6." },
      { code: 'before = subtotal(price, quantity)', explanation: "Inside `order_total`, the first function is called and its returned value is stored in `before`." },
      { code: 'return apply_discount(before, percent)', explanation: "That value is passed straight into the second function, and whatever comes back is returned to the caller." },
      { code: 'print(order_total(20, 3, 10))', explanation: "20 times 3 is 60, minus 10% is 54.0. The `.0` appears because dividing with `/` always produces a float." },
      { code: 'print(order_total(5, 2, 0))', explanation: "The same functions handle a different order with no discount: 10.0. You wrote the logic once and reused it." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground and check the two totals.',
      'Predict what `order_total(8, 5, 25)` returns, then add a `print` line to check.',
      'Write a function `add_shipping(amount)` that adds 4.99, and use it on the result of `order_total(20, 3, 10)`.',
    ],
    playground: 'python',
    starterCode: code`
      def subtotal(price, quantity):
          return price * quantity

      def apply_discount(amount, percent):
          return amount - amount * percent / 100

      def order_total(price, quantity, percent):
          before = subtotal(price, quantity)
          return apply_discount(before, percent)

      print(order_total(20, 3, 10))
      print(order_total(5, 2, 0))
    `,
  },
  mistakes: [
    { mistake: 'Defining a function and wondering why nothing happens.', fix: 'A definition only stores the steps. Call it with its name and brackets, such as `greet()`.' },
    { mistake: 'Printing inside a function when you need to use the result.', fix: 'Use `return` to hand the value back. Print it outside the function if you also want to see it.' },
    { mistake: 'Writing code after `return` and expecting it to run.', fix: '`return` ends the function immediately. Put any work you need before it.' },
  ],
  quiz: [
    {
      question: 'What is printed when this runs?',
      code: { language: 'python', code: code`
        def double(n):
            return n * 2

        result = double(4) + double(1)
        print(result)
      ` },
      options: [
        { text: '10', explanation: '`double(4)` returns 8 and `double(1)` returns 2, and 8 + 2 is 10.' },
        { text: '5', explanation: 'That adds the inputs, 4 + 1, without doubling them. Each call returns double its input.' },
        { text: '8', explanation: 'That is only the first call. The second call returns 2, which is added on.' },
        { text: '82', explanation: 'The returned values are numbers, so `+` adds them. It only joins things together when both are strings.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        def square(n):
            print(n * n)

        result = square(3)
        print(result)
      ` },
      options: [
        { text: '9, then 9', explanation: 'The function prints 9, but it never returns anything, so `result` does not hold 9.' },
        { text: '9, then None', explanation: 'The function prints 9 itself. With no `return`, it gives back `None`, which is then printed.' },
        { text: 'Only 9', explanation: 'There are two `print` calls, so two lines appear. The second shows what was returned.' },
        { text: 'An error, because square has no return', explanation: 'A function without `return` is allowed. It just returns `None`.' },
      ],
      answer: 1,
    },
    {
      question: 'Your program converts temperatures from Celsius to Fahrenheit in four places, using `c * 9 / 5 + 32`. What is the best change?',
      options: [
        { text: 'Leave it, since the formula is short', explanation: 'Short or not, four copies means four places to fix if one has a typo, and nothing tells you they match.' },
        { text: 'Put the formula in a comment so you remember it', explanation: 'A comment does not stop the copies from drifting apart.' },
        { text: 'Write one function `to_fahrenheit(c)` and call it in all four places', explanation: 'The formula then lives in one place. You can check it once, and every caller gets the same answer.' },
        { text: 'Make the four copies into one long function that does everything', explanation: 'One giant function is harder to check. A small function with one job is easier to reuse and to test.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Wrap a job in a named function, pass it what it needs, and `return` the result, so you write the logic once and reuse it everywhere.',
  resources: [
    { title: 'Defining functions', provider: 'Python.org', description: 'The official tutorial section on def, arguments and return.', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' },
    { title: 'Automate the Boring Stuff, chapter 4', provider: 'Al Sweigart', description: 'A beginner chapter on functions, return values and scope.', url: 'https://automatetheboringstuff.com/3e/chapter4.html' },
  ],
  underTheHood: {
    heading: 'Local variables and scope',
    paragraphs: [
      "Variables created inside a function are local: they exist only while that call is running, and they disappear when it returns. In the order example, `before` cannot be used outside `order_total`. Try it and Python raises a `NameError`.",
      "This rule is called scope, and it is a feature. Two functions can both use a variable called `total` without interfering, because each call gets its own private set of names. You can reason about one function without reading the whole program.",
      "A function can read variables from outside, called global variables, but relying on them makes functions harder to test, because their result depends on something not in their parameters. Passing everything in through parameters and handing results back with `return` keeps each function predictable: the same inputs always give the same output.",
    ],
  },
}

export default lesson
