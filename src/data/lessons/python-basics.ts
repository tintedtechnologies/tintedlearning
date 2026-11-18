import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Run a Python program and read what it prints',
    'Store text, numbers and True or False values in variables',
    'Combine values with operators to calculate something new',
  ],
  bigIdea: "A Python program is a list of instructions that Python carries out from the top line to the bottom. You give values names so you can use them later, and you combine those values to work things out. Almost every program you will ever write is built from these three moves.",
  whyItMatters: "Say you sell handmade candles and every Sunday you add up the week's orders on a calculator, typing the same prices again and again. A ten-line Python program can do the same sum in a blink, never mistypes a price, and gives the right answer every week. Running code, naming values and calculating with them is all that program needs.",
  goalSections: [
    {
      heading: 'Running a program',
      paragraphs: [
        "Python code lives in a plain text file whose name ends in `.py`, such as `hello.py`. To run it, open a terminal in the same folder and type `python3 hello.py` (on Windows, `python hello.py`). You can also paste code into the playground on this site, which runs Python in your browser.",
        "Python reads the file one line at a time, top to bottom. The `print()` instruction shows whatever is inside its brackets. Text has to go inside quote marks, so Python knows it is text and not an instruction. Lines that start with `#` are comments: notes for humans that Python skips.",
        "If you make a typo, Python stops and prints an error message that names the line it was reading. That is normal and happens to everyone. Check that line for a missing quote mark or bracket, fix it and run the program again.",
      ],
      example: {
        language: 'python',
        code: code`
          # This line is a comment, so Python ignores it
          print("Hello!")
          print("Python runs these lines in order.")
        `,
        output: 'Hello!\nPython runs these lines in order.',
      },
    },
    {
      heading: 'Variables and types of values',
      visual: { kind: 'variables', names: ['msg', 'count', 'price'], values: ['"Roll a dice!"', '6', '2.5'], caption: 'Each assignment creates a named box that holds one value. The name is the variable, and the value is what it holds. Press Next to see each box appear.' },
      paragraphs: [
        "A variable is a name that points to a value. You create one with a single equals sign: `price = 4.5` means \"from now on, `price` refers to 4.5\". It does not mean the two sides are equal in the math sense.",
        "Values come in different kinds, called types. Text is called a string, written in quotes: `\"Ada\"`. Whole numbers are integers: `3`. Numbers with a decimal point are floats: `4.5`. True and false values are Booleans, written `True` and `False` with capital letters.",
        "You can give a variable a new value at any time, and the old one is replaced. The function `type()` tells you which kind of value a variable holds.",
      ],
      example: {
        language: 'python',
        code: code`
          name = "Ada"
          age = 36
          height = 1.65
          is_member = True

          print(name, age, height, is_member)
          age = 37
          print(age)
          print(type(height))
        `,
        output: "Ada 36 1.65 True\n37\n<class 'float'>",
      },
    },
    {
      heading: 'Calculating with operators',
      paragraphs: [
        "An operator is a symbol that combines values. The everyday math ones are `+`, `-`, `*` for multiply and `/` for divide. Python follows normal math order, so multiplication happens before addition unless you use brackets.",
        "Comparison operators answer yes or no questions and give back a Boolean: `>` greater than, `<` less than, `>=` at least, and `==` equal to. Note the double equals: one equals sign stores a value, two compare values.",
        "Some operators work on text too. `+` joins two strings together. But Python will not add a string to a number, because it cannot guess what you mean.",
      ],
      example: {
        language: 'python',
        code: code`
          print(2 + 3 * 4)
          print((2 + 3) * 4)
          print(10 / 4)
          print(7 > 5)
          print(3 == 3.0)
          print("note" + "book")
        `,
        output: '14\n20\n2.5\nTrue\nTrue\nnotebook',
      },
    },
  ],
  seeItInAction: {
    title: 'A tiny receipt calculator',
    intro: "This program works out the cost of one line on a shop receipt. It uses every idea from this lesson. You can run it exactly as written.",
    example: {
      language: 'python',
      code: code`
        item = "Notebook"
        price = 4.5
        quantity = 3
        in_stock = True

        total = price * quantity
        print(item, "x", quantity)
        print("Total:", total)
        print("Over $10?", total > 10)
        print("In stock:", in_stock)
      `,
      output: 'Notebook x 3\nTotal: 13.5\nOver $10? True\nIn stock: True',
    },
    steps: [
      { code: 'item = "Notebook"', explanation: "Stores the text `Notebook` under the name `item`. The quotes mark it as a string." },
      { code: 'price = 4.5\nquantity = 3', explanation: "Stores a float and an integer. Neither needs quotes, because they are numbers." },
      { code: 'in_stock = True', explanation: "Stores a Boolean. It has a capital T and no quotes, otherwise Python would treat it as text or an unknown name." },
      { code: 'total = price * quantity', explanation: "Python looks up both names, multiplies 4.5 by 3, and stores the result, 13.5, in a new variable called `total`." },
      { code: 'print(item, "x", quantity)', explanation: "When you give `print()` several values separated by commas, it prints them on one line with a space between each." },
      { code: 'print("Over $10?", total > 10)', explanation: "The comparison `total > 10` is worked out first. 13.5 is greater than 10, so it becomes `True`, and that is what gets printed." },
    ],
  },
  tryIt: {
    instructions: [
      'Open the code in the playground and run it once to see the output above.',
      'Change `quantity` to 2. Before you run it, predict the total and whether it is over $10.',
      'Add a line `discount = 1.5` and change the total line to `total = price * quantity - discount`. Predict the new total, then run it.',
    ],
    playground: 'python',
    starterCode: code`
      item = "Notebook"
      price = 4.5
      quantity = 3
      in_stock = True

      total = price * quantity
      print(item, "x", quantity)
      print("Total:", total)
      print("Over $10?", total > 10)
      print("In stock:", in_stock)
    `,
  },
  mistakes: [
    { mistake: 'Forgetting the quotes around text, as in `name = Ada`.', fix: 'Without quotes Python looks for a variable called `Ada` and stops with a `NameError`. Put text in quotes: `name = "Ada"`.' },
    { mistake: 'Joining text and a number with `+`, as in `"Age: " + 36`.', fix: 'Turn the number into text first with `str(36)`, or pass both to `print()` separated by a comma.' },
    { mistake: 'Using one equals sign to compare, as in `if age = 18`.', fix: 'One `=` stores a value. Two, `==`, asks whether two values are equal.' },
    { mistake: 'Writing `true` or `false` in lower case.', fix: 'Python only recognizes `True` and `False` with a capital first letter.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        x = 7
        y = 2
        print(x / y)
      ` },
      options: [
        { text: '3', explanation: 'In Python 3, `/` always gives the exact answer with decimals. It does not drop the remainder.' },
        { text: '3.5', explanation: '7 divided by 2 is 3.5, and `/` keeps the decimal part.' },
        { text: '1', explanation: '1 is the remainder of 7 divided by 2, which Python gives with the `%` operator, not `/`.' },
        { text: 'x / y', explanation: 'There are no quotes, so Python treats `x` and `y` as variables and calculates the result.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What happens when this code runs?',
      code: { language: 'python', code: code`
        age = "30"
        print(age + 1)
      `, raises: 'TypeError' },
      options: [
        { text: 'It prints 31', explanation: 'The quotes make `age` the text "30", not the number 30, so Python will not do math with it.' },
        { text: 'It prints 301', explanation: 'Python will not quietly turn 1 into text to join them. It refuses instead.' },
        { text: 'It stops with a TypeError, because you cannot add text and a number', explanation: 'Mixing a string and an integer with `+` is an error. Use `int(age) + 1` to do the math.' },
        { text: 'It prints age + 1', explanation: 'The expression is not in quotes, so Python tries to calculate it rather than print it as text.' },
      ],
      answer: 2,
    },
    {
      question: 'After these three lines run, what is printed?',
      code: { language: 'python', code: code`
        score = 5
        score = score + 2
        print(score)
      ` },
      options: [
        { text: '5', explanation: 'The second line gives `score` a new value, replacing the 5.' },
        { text: 'score + 2', explanation: 'That expression is calculated, not printed as text, and only `score` is printed anyway.' },
        { text: 'An error, because score cannot equal score + 2', explanation: 'A single `=` is not a math equation. It means: work out the right side, then store it under the name on the left.' },
        { text: '7', explanation: 'Python works out the right side first, 5 + 2 = 7, and then stores 7 back in `score`.' },
      ],
      answer: 3,
      answerIsOutput: true,
    },
  ],
  takeaway: 'Python runs your lines from top to bottom, variables give values a name, and operators combine those values into new ones.',
  resources: [
    { title: 'An informal introduction to Python', provider: 'Python.org', description: 'The official tutorial section on numbers, text and variables.', url: 'https://docs.python.org/3/tutorial/introduction.html' },
    { title: 'Automate the Boring Stuff, chapter 1', provider: 'Al Sweigart', description: 'A free beginner chapter on expressions, types and variables.', url: 'https://automatetheboringstuff.com/3e/chapter1.html' },
  ],
  underTheHood: {
    heading: 'Why 0.1 + 0.2 is not exactly 0.3',
    paragraphs: [
      "Try `print(0.1 + 0.2)` and Python prints `0.30000000000000004`. Python is not broken. Computers store floats in binary, using only 0s and 1s, and most decimal fractions cannot be written exactly in binary, just as one third cannot be written exactly in decimal (0.3333 goes on forever).",
      "So 0.1 is stored as the nearest binary number, which is a tiny bit off. Add two slightly-off numbers and the small errors can show up in the last digit.",
      "For everyday sums this does not matter. It does matter when you compare floats with `==`, because `0.1 + 0.2 == 0.3` is `False`. Round first, as in `round(0.1 + 0.2, 2) == 0.3`, or use whole numbers of cents for money, so $4.50 is stored as 450.",
    ],
  },
}

export default lesson
