import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Create strings and join them with concatenation and f-strings',
    'Change, search, and split text with common string methods',
    'Clean up user-style text so that comparisons and counts are reliable',
  ],
  bigIdea: 'A string is text stored in a variable, written inside quotes. Python gives you tools to build text from parts, search inside it, split it into pieces, and clean it up. Most programs that handle names, messages, files, or web pages spend much of their time working with strings, so learning them well pays off quickly.',
  whyItMatters: 'A class list arrives as one long line of names separated by commas. A teacher wants to count how many students are named Sam, ignoring capital letters and extra spaces. Without string methods, the count is wrong, and the teacher trusts the wrong number. With the right methods, the program is short, accurate, and easy to check.',
  goalSections: [
    {
      heading: 'Creating and joining strings',
      paragraphs: [
        'A string is text in quotes. You can use single or double quotes, as long as you start and finish with the same kind. A string can hold letters, digits, spaces, and punctuation. The digits in "42" are still text, and Python treats them differently from the number 42.',
        'To join strings, use the plus sign, which is called concatenation. To place a value inside text, use an f-string: put the letter f before the quote, and write the variable name inside curly braces. An f-string is clearer than joining pieces by hand, especially when a value is a number.',
        'Strings are fixed. A method that seems to change a string actually returns a new one, so you must store the result. This is one of the most common beginner surprises, and it is easy to fix once you know it.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          first = "Ada"
          last = "Lovelace"
          full = first + " " + last
          greeting = f"Hello, {first}! You have {3 + 2} new messages."
          print(full)
          print(greeting)
        `,
        output: 'Ada Lovelace\nHello, Ada! You have 5 new messages.',
      },
      visual: { kind: 'variables', names: ['first', 'last', 'full'], values: ['"Ada"', '"Lovelace"', '"Ada Lovelace"'], caption: 'Each name holds its own piece of text. The full name is built by joining the first and last names with a space, and the result is stored in a new box.' },
    },
    {
      heading: 'Searching and splitting text',
      paragraphs: [
        'The in operator checks whether a piece of text appears inside another, and it answers with True or False. This is the simplest way to ask whether a word is present in a sentence or a file name ends with a certain extension.',
        'The split method breaks a string into a list of pieces. With no argument it splits on spaces. With a comma as the argument, it splits on each comma, which is useful for data copied from a spreadsheet. The strip method removes spaces from both ends, which matters when text was typed by a person.',
        'Length and position are also useful. The len function counts characters, and an index in square brackets gives one character. Counting starts at zero, so the first character is at position zero, and the last is at position len minus one.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          roster = "  Sam, Ada , Sam,Priya "
          names = [name.strip() for name in roster.split(",")]
          print(names)
          print("Sam" in names)
          print(len(names), names[0][0])
        `,
        output: "['Sam', 'Ada', 'Sam', 'Priya']\nTrue\n4 S",
      },
    },
    {
      heading: 'Cleaning text before you compare it',
      paragraphs: [
        'Comparisons are exact. "sam" and "Sam" are different strings to Python, and so are "Sam" and "Sam " with a trailing space. Before comparing user text, clean it up: strip the spaces, and convert the case with lower or upper so that the same word matches.',
        'Make a rule for the cleaned form and use it everywhere. If you store names in lowercase, every search, count, and comparison must also use lowercase. A rule written once in a function keeps the program consistent.',
        'Be careful with characters that look alike, such as an accent or a non-breaking space pasted from a web page. These can make two identical-looking strings unequal. When a count is strange, print the repr of the value to see its hidden characters.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          typed = "  Sam "
          stored = "sam"
          print(typed == stored)
          print(typed.strip().lower() == stored)
        `,
        output: 'False\nTrue',
      },
    },
  ],
  seeItInAction: {
    title: 'Counting names after cleaning them',
    intro: 'The program below splits a messy roster, cleans each name, and counts how many students are named Sam. Without the cleaning step, the count would be wrong. Run it, then remove the strip and lower calls and predict the new count.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        roster = "  Sam, sam ,SAM,Priya, Ada "
        cleaned = [name.strip().lower() for name in roster.split(",")]
        count = cleaned.count("sam")
        print(cleaned)
        print("Sam appears", count, "times")
      `,
      output: "['sam', 'sam', 'sam', 'priya', 'ada']\nSam appears 3 times",
    },
    steps: [
      { code: 'roster.split(",")', explanation: 'Breaks the single line into one piece per name, using the comma as the separator.' },
      { code: 'name.strip().lower()', explanation: 'Removes the extra spaces and converts to lowercase, so the same name always looks the same.' },
      { code: 'cleaned.count("sam")', explanation: 'Counts the matching names in the cleaned list. Cleaning first is what makes the count correct.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write an f-string that prints your name and the number of books you have read this year, using a calculation inside the braces.',
      'Change the roster in the seeItInAction example so that one name is "SAM " with a trailing space and capital letters. Predict the count before you run the program.',
      'Write a program that takes a sentence and prints how many times the word "the" appears in it, after converting it to lowercase.',
    ],
  },
  mistakes: [
    { mistake: 'Calling a string method and not storing its result.', fix: 'Strings are fixed. Save the returned value, such as name = name.strip().' },
    { mistake: 'Comparing text without cleaning it first.', fix: 'Strip spaces and convert to one case before comparing or counting.' },
    { mistake: 'Joining a number to a string with the plus sign.', fix: 'Use an f-string, or convert the number with str first.' },
  ],
  quiz: [
    {
      question: 'What is printed when this code runs?',
      code: { language: 'python', runnable: true, code: code`
        word = "Python"
        word.upper()
        print(word)
      ` },
      options: [
        { text: 'PYTHON', explanation: 'The upper method returns a new string, and the result is not stored.' },
        { text: 'Python', explanation: 'Yes. Strings are fixed, so upper returns a new value that is not saved.' },
        { text: 'python', explanation: 'The program never calls lower, and the result is discarded anyway.' },
        { text: 'An error', explanation: 'That would need a failure, and this code runs normally.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Predict the output of this code.',
      code: { language: 'python', runnable: true, code: code`
        items =" red, blue ,green".split(",")
        print(len(items), items[1].strip())
      ` },
      options: [
        { text: '3 blue', explanation: 'Yes. The line splits into three pieces, and the second piece with its spaces removed is blue.' },
        { text: '3  blue ', explanation: 'The strip method removes the spaces around blue.' },
        { text: '2 blue', explanation: 'There are three pieces, not two, because the text has two commas.' },
        { text: 'An error', explanation: 'Nothing in this code fails, so no error is shown.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why clean text before comparing it?',
      options: [
        { text: 'Because "Sam" and "sam " are different strings to Python', explanation: 'Yes. Exact comparison treats case and spaces as part of the text.' },
        { text: 'Because strings cannot be compared at all', explanation: 'Strings can be compared. The issue is that small differences make them unequal.' },
        { text: 'Because cleaning makes the strings longer', explanation: 'Cleaning removes characters and changes case. Its purpose is matching, not length.' },
        { text: 'Because Python only reads lowercase text', explanation: 'Python reads both cases. Cleaning makes matches reliable.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Strings hold text, you join and format them with concatenation and f-strings, search and split them with in, split, and strip, and clean them before comparing so that matches are reliable.',
  resources: [
    { title: 'Strings in Python', provider: 'Python.org', description: 'The official tutorial on strings, string methods, and formatting.', url: 'https://docs.python.org/3/tutorial/introduction.html#strings' },
    { title: 'Python string methods', provider: 'W3Schools', description: 'A reference with examples for the most common string methods.', url: 'https://www.w3schools.com/python/python_ref_string.asp' },
  ],
}

export default lesson
