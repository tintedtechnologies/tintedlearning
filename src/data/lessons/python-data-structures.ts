import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Store, read and change an ordered collection with a list',
    'Look up values by name with a dictionary',
    'Choose between a list, dictionary, tuple and set for a task',
  ],
  bigIdea: "Real programs work with many values at once, so Python gives you containers to hold them. A list keeps items in order, a dictionary finds a value by its name, a tuple holds a fixed group, and a set keeps only unique items. Picking the right container makes the rest of your code shorter and clearer.",
  whyItMatters: "Suppose you store a contact's details as separate variables: `name1`, `phone1`, `email1`, `name2`, `phone2`, and so on. By the tenth contact the program is a mess, and you cannot loop over them. Put each contact in a dictionary and all contacts in a list, and one loop can search, sort or print every contact, however many you have.",
  goalSections: [
    {
      heading: 'Lists: items in order',
      paragraphs: [
        "A list holds values in a fixed order, inside square brackets and separated by commas. Each item has a position number, called an index, and counting starts at 0. So `tasks[0]` is the first item, and `tasks[-1]` is a shortcut for the last.",
        "Lists can change after you create them. `append()` adds an item to the end, `remove()` takes out the first matching item, and assigning to an index replaces that item. `len()` tells you how many items there are.",
        "You can also take a slice, a new list made from part of another. `tasks[0:2]` gives the items at positions 0 and 1, because a slice stops just before its second number. Slicing works on strings too, so `\"Python\"[0:3]` is `\"Pyt\"`.",
      ],
      example: {
        language: 'python',
        code: code`
          tasks = ["email Sam", "buy milk", "pay rent"]
          print(tasks[0])
          print(tasks[-1])

          tasks.append("call mum")
          tasks.remove("buy milk")
          tasks[0] = "email Sam and Jo"
          print(tasks)
          print(len(tasks))
        `,
        output: "email Sam\npay rent\n['email Sam and Jo', 'pay rent', 'call mum']\n3",
      },
    },
    {
      heading: 'Dictionaries: values found by name',
      paragraphs: [
        "A dictionary stores pairs: a key and its value, written `key: value` inside curly brackets. You look up a value by its key instead of by position, like finding a word in a real dictionary.",
        "Read a value with `person[\"email\"]`. Add or change one by assigning to a key. Keys are unique, so assigning to a key that already exists replaces its value. If a key might be missing, use `.get(\"key\", default)`, which returns the default instead of crashing.",
        "Values can be anything, including lists and other dictionaries. That is how Python represents real data such as a user profile or a response from a website.",
      ],
      example: {
        language: 'python',
        code: code`
          person = {"name": "Ada", "email": "ada@example.com", "skills": ["Python", "math"]}

          print(person["name"])
          person["city"] = "London"
          person["skills"].append("writing")
          print(person["skills"])
          print(person.get("phone", "no phone saved"))
        `,
        output: "Ada\n['Python', 'math', 'writing']\nno phone saved",
      },
    },
    {
      heading: 'Tuples, sets and choosing the right one',
      paragraphs: [
        "A tuple is like a list that cannot change, written with round brackets: `(51.5, -0.12)`. Use it for a small group of values that belong together and should stay fixed, like a map coordinate.",
        "A set holds unique items with no order, written with curly brackets but no colons. Adding a duplicate does nothing. Sets are ideal for removing repeats and for asking \"is this in the group?\"",
        "To choose, ask what you need. Order and changes: a list. Look up by name: a dictionary. A fixed group of values: a tuple. Uniqueness: a set.",
      ],
      example: {
        language: 'python',
        code: code`
          location = (51.5, -0.12)
          print(location[0])

          visitors = ["ana", "ben", "ana", "chen", "ben"]
          unique = set(visitors)
          print(len(unique))
          print("chen" in unique)
        `,
        output: '51.5\n3\nTrue',
      },
    },
  ],
  seeItInAction: {
    title: 'Finding students who still need to submit',
    intro: "A class list is a list of dictionaries, which is the most common shape for real data. This program finds who has not submitted homework and lists every subject anyone is taking.",
    example: {
      language: 'python',
      code: code`
        students = [
            {"name": "Ana", "submitted": True, "subjects": ["math", "art"]},
            {"name": "Ben", "submitted": False, "subjects": ["math"]},
            {"name": "Chen", "submitted": False, "subjects": ["art", "music"]},
        ]

        missing = []
        subjects = set()

        for student in students:
            if not student["submitted"]:
                missing.append(student["name"])
            for subject in student["subjects"]:
                subjects.add(subject)

        print("Still to submit:", missing)
        print("Subjects:", sorted(subjects))
      `,
      output: "Still to submit: ['Ben', 'Chen']\nSubjects: ['art', 'math', 'music']",
    },
    steps: [
      { code: 'students = [ {...}, {...}, {...} ]', explanation: "A list holds the students in order. Each student is a dictionary, so every detail has a clear name." },
      { code: 'missing = []\nsubjects = set()', explanation: "An empty list to collect names, and an empty set to collect subjects. Note that `{}` would make an empty dictionary, so an empty set is written `set()`." },
      { code: 'if not student["submitted"]:', explanation: "`not` flips `True` to `False` and back. This line is true for students who have not submitted." },
      { code: 'missing.append(student["name"])', explanation: "Looks up the name in that student's dictionary and adds it to the end of the list." },
      { code: 'for subject in student["subjects"]:\n    subjects.add(subject)', explanation: "A loop inside a loop. Math and art appear twice across students, but the set keeps one copy of each." },
      { code: 'sorted(subjects)', explanation: "Sets have no order, so `sorted()` turns it into an alphabetical list for tidy printing." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground and check the output.',
      'Add a fourth student, `{"name": "Dee", "submitted": False, "subjects": ["music", "drama"]}`. Predict both printed lines before you run it.',
      'Change Ben to `True` and predict who is still missing.',
    ],
    playground: 'python',
    starterCode: code`
      students = [
          {"name": "Ana", "submitted": True, "subjects": ["math", "art"]},
          {"name": "Ben", "submitted": False, "subjects": ["math"]},
          {"name": "Chen", "submitted": False, "subjects": ["art", "music"]},
      ]

      missing = []
      subjects = set()

      for student in students:
          if not student["submitted"]:
              missing.append(student["name"])
          for subject in student["subjects"]:
              subjects.add(subject)

      print("Still to submit:", missing)
      print("Subjects:", sorted(subjects))
    `,
  },
  mistakes: [
    { mistake: 'Expecting the first item to be at index 1.', fix: 'Python counts from 0. The first item is `items[0]` and the last is `items[-1]`.' },
    { mistake: 'Reading a dictionary key that might not exist with square brackets.', fix: '`data["phone"]` raises a `KeyError` if the key is missing. Use `data.get("phone")` or check with `"phone" in data` first.' },
    { mistake: 'Using a list where you only need to check membership in a big group.', fix: 'Checking `x in a_list` looks at every item. A set answers the same question almost instantly.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        colors = ["red", "green", "blue"]
        colors.append("yellow")
        print(colors[1], len(colors))
      ` },
      options: [
        { text: 'red 4', explanation: 'Index 1 is the second item, because counting starts at 0.' },
        { text: 'green 3', explanation: '`append` added a fourth item, so the length is now 4.' },
        { text: 'green 4', explanation: 'Index 1 is "green", and after `append` the list has 4 items.' },
        { text: 'yellow 4', explanation: '"yellow" was added to the end, at index 3, not index 1.' },
      ],
      answer: 2,
      answerIsOutput: true,
    },
    {
      question: 'What will the last line show?',
      code: { language: 'python', code: code`
        stock = {"apples": 5, "pears": 0}
        stock["apples"] = stock["apples"] - 2
        print(stock["apples"], stock.get("plums", 0))
      ` },
      options: [
        { text: '5 0', explanation: 'The second line stores a new value for apples, 5 - 2.' },
        { text: '3 0', explanation: 'Apples drop from 5 to 3. Plums is not a key, so `.get` returns the default, 0.' },
        { text: '3 None', explanation: '`.get` was given a default of 0, so it returns 0, not `None`.' },
        { text: 'An error, because plums is not in the dictionary', explanation: 'Square brackets would raise a `KeyError`, but `.get` is safe for missing keys.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'You are building a sign-up form and need to check quickly whether a username is already taken, among 2 million users. Which container should hold the existing usernames?',
      options: [
        { text: 'A list, because it keeps names in sign-up order', explanation: 'Order does not help here, and checking membership in a list means scanning up to 2 million items.' },
        { text: 'A tuple, because usernames should not change', explanation: 'A tuple is just as slow as a list to search, and you need to add new users.' },
        { text: 'A dictionary with each username as a value', explanation: 'Searching dictionary values is slow. Only the keys are fast to look up, and a set gives you that without the unused values.' },
        { text: 'A set, because it holds unique items and answers "is this in it?" very quickly', explanation: 'Usernames must be unique and the only question is membership. That is exactly what sets are for.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Use a list for ordered items, a dictionary to find values by name, a tuple for a fixed group and a set for unique items.',
  resources: [
    { title: 'Data structures', provider: 'Python.org', description: 'The official tutorial on lists, tuples, sets and dictionaries.', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
    { title: 'Automate the Boring Stuff, chapters 6 and 7', provider: 'Al Sweigart', description: 'Beginner chapters on lists and dictionaries with practice projects.', url: 'https://automatetheboringstuff.com/3e/chapter6.html' },
  ],
  underTheHood: {
    heading: 'Why sets and dictionaries are so fast',
    paragraphs: [
      "To check whether a value is in a list, Python compares it with each item in turn. With a million items, that can mean a million comparisons.",
      "Sets and dictionaries use a trick called hashing. When you add a key, Python runs it through a hash function, which turns it into a number. That number decides which slot in a hidden table the key goes into. To look a key up later, Python hashes it again and goes straight to that slot, no matter how many items there are.",
      "This is why dictionary keys and set items must be values that cannot change, such as strings, numbers and tuples. If a key could change, its hash would change and Python would look in the wrong slot. That is also why you cannot use a list as a dictionary key: Python raises a `TypeError` saying the list is unhashable.",
    ],
  },
}

export default lesson
