import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Find an item with linear search and explain why it slows down as data grows',
    'Find an item in a sorted list with binary search',
    'Sort data with `sorted()` and a key, and compare the cost of each approach',
  ],
  bigIdea: "An algorithm is a step-by-step method for solving a problem. For the same task, different algorithms can take wildly different amounts of time: checking a million items one by one is slow, but halving a sorted list each step needs only about 20 checks. Choosing well starts with asking how the work grows as the data grows.",
  whyItMatters: "A shop's website checks each new order against a list of blocked card numbers. With 100 blocked cards, checking one by one is instant. Two years later the list has 5 million entries, every order checks all of them, and the checkout page starts timing out. The code never changed. Only the size of the data did, and the algorithm could not keep up.",
  goalSections: [
    {
      heading: 'Linear search: check every item',
      paragraphs: [
        "Linear search starts at the first item and checks each one in turn until it finds a match or runs out. It works on any list, sorted or not, and it is easy to get right.",
        "Its cost grows in step with the list. Twice as many items means up to twice as many checks. Programmers describe this as O(n), read as \"order n\", where n is the number of items. This way of describing growth is called big O notation.",
        "Python's `in` operator and the list method `.index()` both do a linear search behind the scenes. For a few thousand items that is perfectly fine.",
      ],
      example: {
        language: 'python',
        code: code`
          def linear_search(items, target):
              for index, item in enumerate(items):
                  if item == target:
                      return index
              return -1

          names = ["Zoe", "Ali", "Mia", "Ben"]
          print(linear_search(names, "Mia"))
          print(linear_search(names, "Tom"))
        `,
        output: '2\n-1',
      },
    },
    {
      heading: 'Binary search: halve a sorted list',
      paragraphs: [
        "If the list is sorted, you can do much better. Look at the middle item. If it is the target, you are done. If the target is smaller, it can only be in the left half, so throw the right half away. Otherwise, throw the left half away. Repeat on what is left.",
        "Each step halves the remaining items, so a million items need at most about 20 checks, and a billion need about 30. This is O(log n), and it barely grows at all.",
        "The catch: binary search only works on sorted data, and gives wrong answers on unsorted data. Python's `bisect` module provides a ready-made, tested version.",
      ],
      example: {
        language: 'python',
        code: code`
          def binary_search(items, target):
              low, high = 0, len(items) - 1
              while low <= high:
                  middle = (low + high) // 2
                  if items[middle] == target:
                      return middle
                  if items[middle] < target:
                      low = middle + 1
                  else:
                      high = middle - 1
              return -1

          prices = [3, 8, 12, 19, 25, 31, 40]
          print(binary_search(prices, 25))
          print(binary_search(prices, 26))
        `,
        output: '4\n-1',
      },
    },
    {
      heading: 'Sorting and comparing costs',
      paragraphs: [
        "`sorted()` returns a new sorted list and leaves the original alone. The list method `.sort()` sorts the list in place. Both take `reverse=True` for largest first, and a `key`: a function that says what to sort by, such as `key=len` to sort words by length.",
        "Python's sort is O(n log n): a bit more than linear, and far better than the simple methods taught in many textbooks, which are O(n squared). Never write your own sort for real work.",
        "So when is sorting worth it? Sorting once costs more than one linear search, but if you then search many times, binary search pays it back quickly. For pure \"is it in here?\" questions, a set is even faster, as you saw in the data structures lesson.",
      ],
      example: {
        language: 'python',
        code: code`
          words = ["banana", "fig", "apple", "kiwi"]
          print(sorted(words))
          print(sorted(words, key=len))

          people = [("Ana", 34), ("Ben", 28), ("Cy", 41)]
          print(sorted(people, key=lambda person: person[1], reverse=True))
        `,
        output: "['apple', 'banana', 'fig', 'kiwi']\n['fig', 'kiwi', 'apple', 'banana']\n[('Cy', 41), ('Ana', 34), ('Ben', 28)]",
      },
    },
  ],
  seeItInAction: {
    title: 'Counting the steps each search takes',
    intro: "This program searches a sorted list of one million numbers for the same target with both methods and counts how many items each one looks at.",
    example: {
      language: 'python',
      code: code`
        def linear_steps(items, target):
            steps = 0
            for item in items:
                steps += 1
                if item == target:
                    break
            return steps

        def binary_steps(items, target):
            low, high, steps = 0, len(items) - 1, 0
            while low <= high:
                steps += 1
                middle = (low + high) // 2
                if items[middle] == target:
                    break
                if items[middle] < target:
                    low = middle + 1
                else:
                    high = middle - 1
            return steps

        numbers = list(range(0, 2_000_000, 2))
        target = 1_999_998
        print(len(numbers))
        print("linear:", linear_steps(numbers, target))
        print("binary:", binary_steps(numbers, target))
      `,
      output: '1000000\nlinear: 1000000\nbinary: 20',
    },
    steps: [
      { code: 'numbers = list(range(0, 2_000_000, 2))', explanation: "Makes a sorted list of the even numbers from 0 up to 1,999,998: one million items. Underscores in numbers are just for readability." },
      { code: 'target = 1_999_998', explanation: "The very last item, which is the worst case for linear search." },
      { code: 'steps += 1', explanation: "Both functions add 1 each time they look at an item, so the counts compare like for like." },
      { code: 'middle = (low + high) // 2', explanation: "`//` divides and drops the remainder, giving a whole-number position in the middle of the current range." },
      { code: 'linear: 1000000', explanation: "Linear search had to look at every single item to reach the last one." },
      { code: 'binary: 20', explanation: "Binary search halved the range 20 times. Double the list to two million and it would need just one more step." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground. It may take a second, because one million is a lot of items.',
      'Change the target to 0. Predict both step counts before running.',
      'Change the target to 1,000,001, which is odd and so not in the list. Predict roughly how many steps binary search needs to give up.',
    ],
    playground: 'python',
    starterCode: code`
      def linear_steps(items, target):
          steps = 0
          for item in items:
              steps += 1
              if item == target:
                  break
          return steps

      def binary_steps(items, target):
          low, high, steps = 0, len(items) - 1, 0
          while low <= high:
              steps += 1
              middle = (low + high) // 2
              if items[middle] == target:
                  break
              if items[middle] < target:
                  low = middle + 1
              else:
                  high = middle - 1
          return steps

      numbers = list(range(0, 2_000_000, 2))
      target = 1_999_998
      print(len(numbers))
      print("linear:", linear_steps(numbers, target))
      print("binary:", binary_steps(numbers, target))
    `,
  },
  mistakes: [
    { mistake: 'Running binary search on a list that is not sorted.', fix: 'It will not crash, it will just quietly miss items. Sort first, or keep the data sorted as you add to it.' },
    { mistake: 'Writing `while low < high` instead of `while low <= high`.', fix: 'With `<`, the loop stops before checking the last remaining item. Test with lists of length 0, 1 and 2.' },
    { mistake: 'Calling `.sort()` and using its result.', fix: '`.sort()` changes the list and returns `None`. Use `sorted(items)` when you need a new list back.' },
  ],
  quiz: [
    {
      question: 'Roughly how many checks does binary search need, at most, to search a sorted list of about 1,000 items?',
      options: [
        { text: '1,000', explanation: 'That is linear search\'s worst case. Binary search throws away half the list each step.' },
        { text: '500', explanation: 'That is only the first halving. Binary search keeps halving.' },
        { text: '100', explanation: 'Still far too many. 1,000 halves to 1 in about 10 steps.' },
        { text: '10', explanation: '1,000, 500, 250, 125, 63, 32, 16, 8, 4, 2, 1: about 10 halvings, since 2 to the power 10 is 1,024.' },
      ],
      answer: 3,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        scores = [("Ana", 7), ("Ben", 9), ("Cy", 5)]
        best = sorted(scores, key=lambda s: s[1], reverse=True)
        print(best[0][0])
      ` },
      options: [
        { text: 'Ana', explanation: 'Ana is first in the original list, but `sorted` reorders by score.' },
        { text: 'Ben', explanation: 'Sorted by score, highest first, the order is Ben 9, Ana 7, Cy 5. `best[0][0]` is the first person\'s name.' },
        { text: 'Cy', explanation: 'Cy has the lowest score. Without `reverse=True` Cy would come first.' },
        { text: '9', explanation: '`best[0][1]` would be the score. Index 0 inside the pair is the name.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'An app looks up whether usernames are taken, millions of times a day, in a list of 5 million names. What is the best fix?',
      options: [
        { text: 'Store the names in a set and check with `in`', explanation: 'A set answers membership questions almost instantly, however large it gets, and the question here is only "is it taken?"' },
        { text: 'Sort the list before every single lookup', explanation: 'Sorting is more expensive than one linear search, so doing it before every lookup makes things worse.' },
        { text: 'Keep the list and use a faster computer', explanation: 'Faster hardware buys a little time, but the work still grows with every new user.' },
        { text: 'Search the list backwards', explanation: 'That is still linear search. It is just as slow on average.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Ask how the work grows with the data: linear search is O(n), binary search on sorted data is O(log n), and a well-chosen structure can beat both.',
  resources: [
    { title: 'Sorting techniques', provider: 'Python.org', description: 'The official guide to sorted, keys and sorting by several fields.', url: 'https://docs.python.org/3/howto/sorting.html' },
    { title: 'Algorithms', provider: 'Khan Academy', description: 'Free lessons on binary search, sorting and big O, with visual demos.', url: 'https://www.khanacademy.org/computing/computer-science/algorithms' },
  ],
  underTheHood: {
    heading: 'How Python sorts so quickly',
    paragraphs: [
      "Python uses an algorithm called Timsort, designed by Tim Peters for Python in 2002. It is a blend of two classic methods, merge sort and insertion sort, tuned for the kind of data people actually sort.",
      "Real data is rarely random. It often contains runs that are already in order, like a log file that is mostly sorted by time. Timsort finds those runs first, sorts short stretches with insertion sort, which is very fast on small or nearly sorted pieces, and then merges the runs together pairwise.",
      "On already-sorted data, Timsort finishes in a single pass, which is O(n). In the worst case it is O(n log n), which is the best any comparison-based sort can guarantee. It is also stable: items that compare equal keep their original order, so you can sort by one key and then another and the first order survives within ties.",
    ],
  },
}

export default lesson
