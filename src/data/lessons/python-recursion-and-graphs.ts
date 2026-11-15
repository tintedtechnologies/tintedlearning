import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Write a recursive function with a base case that stops it',
    'Store a network of connections as a graph using a dictionary',
    'Explore a graph with breadth-first search to find the shortest route',
  ],
  bigIdea: "Some problems contain smaller copies of themselves, like folders inside folders. A recursive function solves them by calling itself on the smaller piece until it reaches a case simple enough to answer directly. Networks of connections, called graphs, are explored with the same step-by-step thinking, using a queue to visit places in order.",
  whyItMatters: "A map app finding the fewest train changes between two stations, a social network suggesting \"people you may know\", and a tool totalling the size of every file in nested folders all solve the same kinds of problem. Each one is a graph or a nested structure, and each one is a few lines of Python once you know recursion and breadth-first search.",
  goalSections: [
    {
      heading: 'Recursion and the base case',
      paragraphs: [
        "A recursive function calls itself. To count down from 3, print 3 and then count down from 2. To count down from 2, print 2 and count down from 1. Each call hands a smaller problem to the next.",
        "Every recursive function needs a base case: an input simple enough to answer without calling itself again. For a countdown, that is reaching 0. Without a base case, the calls never stop, and Python halts with a `RecursionError` after about 1,000 levels.",
        "Recursion shines on nested data, where you do not know in advance how deep it goes. A folder can hold files and other folders, which hold more files and folders.",
      ],
      example: {
        language: 'python',
        code: code`
          def total_size(item):
              if isinstance(item, int):
                  return item
              return sum(total_size(child) for child in item)

          # a folder is a list, a file is its size in MB
          documents = [4, [2, 3], [1, [5, 5]]]
          print(total_size(documents))
        `,
        output: '20',
      },
    },
    {
      heading: 'Graphs as dictionaries',
      paragraphs: [
        "A graph is a set of things, called nodes, joined by connections, called edges. Stations and the train lines between them, people and their friendships, or web pages and their links are all graphs.",
        "The simplest way to store one in Python is an adjacency list: a dictionary where each key is a node and its value is a list of the nodes it connects to. If connections go both ways, like friendships, each one is listed under both people.",
        "With this layout, \"who is connected to X?\" is a single dictionary lookup: `graph[\"X\"]`.",
      ],
      example: {
        language: 'python',
        code: code`
          friends = {
              "Ana": ["Ben", "Cy"],
              "Ben": ["Ana", "Dee"],
              "Cy": ["Ana"],
              "Dee": ["Ben"],
          }

          print(friends["Ben"])
          print(len(friends["Ana"]))
          print("Dee" in friends["Ana"])
        `,
        output: "['Ana', 'Dee']\n2\nFalse",
      },
    },
    {
      heading: 'Breadth-first search for shortest routes',
      paragraphs: [
        "Breadth-first search, or BFS, explores a graph in rings. First it visits every node one step from the start, then every node two steps away, and so on. Because it goes ring by ring, the first time it reaches a node is always by a route with the fewest steps.",
        "BFS uses a queue: a line where the first item added is the first taken out. Python's `collections.deque` is a fast queue. Take a node from the front, add its unvisited neighbours to the back, and repeat until the queue is empty.",
        "A visited set stops it going round in circles. If you swap the queue for a stack, where the last item added is taken first, you get depth-first search, which dives down one path before backing up.",
      ],
      example: {
        language: 'python',
        code: code`
          from collections import deque

          friends = {"Ana": ["Ben", "Cy"], "Ben": ["Ana", "Dee"], "Cy": ["Ana"], "Dee": ["Ben"]}

          queue = deque(["Ana"])
          visited = {"Ana"}
          order = []
          while queue:
              person = queue.popleft()
              order.append(person)
              for friend in friends[person]:
                  if friend not in visited:
                      visited.add(friend)
                      queue.append(friend)
          print(order)
        `,
        output: "['Ana', 'Ben', 'Cy', 'Dee']",
      },
    },
  ],
  seeItInAction: {
    title: 'Fewest stops between two stations',
    intro: "This program finds a route with the fewest stops on a small metro map, using BFS. It records how it reached each station, then walks backwards from the destination to rebuild the route.",
    example: {
      language: 'python',
      code: code`
        from collections import deque

        metro = {
            "Park": ["Market", "River"],
            "Market": ["Park", "Museum", "Harbour"],
            "River": ["Park", "Harbour"],
            "Museum": ["Market", "Airport"],
            "Harbour": ["Market", "River", "Airport"],
            "Airport": ["Museum", "Harbour"],
        }

        def shortest_route(graph, start, goal):
            came_from = {start: None}
            queue = deque([start])
            while queue:
                station = queue.popleft()
                if station == goal:
                    break
                for nxt in graph[station]:
                    if nxt not in came_from:
                        came_from[nxt] = station
                        queue.append(nxt)
            if goal not in came_from:
                return None
            route = []
            while goal is not None:
                route.append(goal)
                goal = came_from[goal]
            return route[::-1]

        print(shortest_route(metro, "Park", "Airport"))
        print(shortest_route(metro, "River", "Museum"))
      `,
      output: "['Park', 'Market', 'Museum', 'Airport']\n['River', 'Park', 'Market', 'Museum']",
    },
    steps: [
      { code: 'came_from = {start: None}', explanation: "Records how each station was first reached. It also works as the visited set: if a station is a key, it has been seen." },
      { code: 'station = queue.popleft()', explanation: "Takes the station that has waited longest. This is what makes the search go ring by ring." },
      { code: 'if nxt not in came_from:\n    came_from[nxt] = station', explanation: "The first time a station is reached is by a shortest route, so only that first arrival is recorded." },
      { code: 'if goal not in came_from:\n    return None', explanation: "If the search ran out without reaching the goal, there is no route, and the function says so." },
      { code: 'while goal is not None:\n    route.append(goal)\n    goal = came_from[goal]', explanation: "Walks backwards from the destination, one recorded step at a time, until it reaches the start, whose entry is `None`." },
      { code: 'return route[::-1]', explanation: "The route was built backwards, so `[::-1]` reverses it. Park to Airport takes 3 hops, and Park, River, Harbour, Airport would be just as short. BFS returns the first one it finds." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Add a new station `"Stadium": ["Airport"]`, and add `"Stadium"` to Airport\'s list. Predict the route from Park to Stadium, then run it.',
      'Ask for a route to a station that is not connected to anything, such as `"Depot": []`. Predict what is returned.',
    ],
    playground: 'python',
    starterCode: code`
      from collections import deque

      metro = {
          "Park": ["Market", "River"],
          "Market": ["Park", "Museum", "Harbour"],
          "River": ["Park", "Harbour"],
          "Museum": ["Market", "Airport"],
          "Harbour": ["Market", "River", "Airport"],
          "Airport": ["Museum", "Harbour"],
      }

      def shortest_route(graph, start, goal):
          came_from = {start: None}
          queue = deque([start])
          while queue:
              station = queue.popleft()
              if station == goal:
                  break
              for nxt in graph[station]:
                  if nxt not in came_from:
                      came_from[nxt] = station
                      queue.append(nxt)
          if goal not in came_from:
              return None
          route = []
          while goal is not None:
              route.append(goal)
              goal = came_from[goal]
          return route[::-1]

      print(shortest_route(metro, "Park", "Airport"))
      print(shortest_route(metro, "River", "Museum"))
    `,
  },
  mistakes: [
    { mistake: 'Writing a recursive function without a base case, or one that never gets closer to it.', fix: 'Write the base case first, and check that every recursive call works on something smaller.' },
    { mistake: 'Forgetting to track visited nodes in a graph.', fix: 'Graphs often contain loops. Without a visited set, the search goes round them forever.' },
    { mistake: 'Using a plain list as a queue with `pop(0)`.', fix: 'Removing from the front of a list shifts every other item. Use `collections.deque` and `popleft()`.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        def count_down(n):
            if n == 0:
                return "go"
            return str(n) + " " + count_down(n - 1)

        print(count_down(3))
      ` },
      options: [
        { text: 'go', explanation: 'That is only the base case. Each call before it adds its own number in front.' },
        { text: '3 2 1', explanation: 'The base case adds "go" at the end.' },
        { text: '3 2 1 go', explanation: 'Each call puts its number in front of the result of the smaller call, ending with "go" from the base case.' },
        { text: 'go 1 2 3', explanation: 'Each call puts its own number before the result of the next call, so 3 comes first.' },
      ],
      answer: 2,
      answerIsOutput: true,
    },
    {
      question: 'Why does breadth-first search find a route with the fewest steps?',
      options: [
        { text: 'It tries every possible route and picks the shortest', explanation: 'That would be far slower. BFS never needs to compare routes.' },
        { text: 'It always follows the first neighbour in each list', explanation: 'That describes one path, not a search, and gives no guarantee about length.' },
        { text: 'It uses recursion, which finds short answers', explanation: 'BFS is normally written with a queue, not recursion, and recursion has nothing to do with route length.' },
        { text: 'It visits every node 1 step away before any node 2 steps away, and so on', explanation: 'Because it moves outwards ring by ring, the first time it reaches a node is by a route with the fewest steps.' },
      ],
      answer: 3,
    },
    {
      question: 'A recursive function crashes with `RecursionError: maximum recursion depth exceeded`. What is the most likely cause?',
      options: [
        { text: 'The base case is missing or never reached', explanation: 'Without a reachable base case, the function calls itself over and over until Python stops it.' },
        { text: 'The function uses too many variables', explanation: 'The number of variables does not cause this error. The number of nested calls does.' },
        { text: 'Recursion is not allowed in Python', explanation: 'Python supports recursion. It just limits how deep the calls can go.' },
        { text: 'The input list is sorted', explanation: 'Sorting has no effect on whether recursion stops.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A recursive function solves a smaller copy of the problem until it reaches a base case, and breadth-first search explores a graph ring by ring with a queue to find routes with the fewest steps.',
  resources: [
    { title: 'Recursive algorithms', provider: 'Khan Academy', description: 'Free lessons on recursion with step-by-step visuals.', url: 'https://www.khanacademy.org/computing/computer-science/algorithms/recursive-algorithms/a/recursion' },
    { title: 'Breadth-first search', provider: 'Khan Academy', description: 'An illustrated walk through BFS on a graph.', url: 'https://www.khanacademy.org/computing/computer-science/algorithms/breadth-first-search/a/breadth-first-search-and-its-uses' },
  ],
  underTheHood: {
    heading: 'The call stack',
    paragraphs: [
      "When a function calls another function, Python must remember where to come back to. It keeps a stack of frames, one per active call, each holding that call's local variables and its place in the code. This is the call stack.",
      "In `count_down(3)`, the frame for 3 waits while the frame for 2 runs, which waits for 1, which waits for 0. Then they finish in reverse order, each one adding its number to the answer. That is why recursion naturally gives last-in, first-out behavior, just like a stack.",
      "Each frame uses memory, so Python caps the depth at about 1,000 frames to protect itself. That is plenty for nested folders, but not for walking a list of a million items one at a time. For very deep problems, rewrite the recursion as a loop with your own explicit stack, which is exactly what iterative depth-first search does.",
    ],
  },
}

export default lesson
