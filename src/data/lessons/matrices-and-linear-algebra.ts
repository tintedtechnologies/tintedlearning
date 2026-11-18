import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read a matrix as a grid of numbers and state its shape',
    'Multiply a matrix by a vector by hand',
    'Check that shapes fit before multiplying and predict the shape of the result',
  ],
  bigIdea: "A matrix is a grid of numbers arranged in rows and columns. Multiplying a matrix by a vector turns one list of numbers into another, which is exactly what a rotation, a scaling, or a change of units does to a point. Computer graphics, physics engines, and data tables are built on this one operation, repeated millions of times.",
  whyItMatters: "When a game draws a scene, each corner of every object becomes a vector, and the engine pushes those vectors through a chain of matrix multiplications to move, turn, and scale the scene. When a program fails with a message like \"shapes (3,) and (4, 2) not aligned\", it means two of these grids did not fit together. Understanding matrices turns that error from gibberish into a five-second fix.",
  goalSections: [
    {
      heading: 'Rows, columns and shape',
      paragraphs: [
        "A matrix is a rectangle of numbers. Its shape is written rows by columns: a matrix with 2 rows and 3 columns is a 2 by 3 matrix, written (2, 3). Rows always come first.",
        "A spreadsheet is a good picture: each row might be a customer and each column a feature, such as age or number of orders. In Python, you can store a matrix as a list of rows, where each row is a list.",
        "To pick out one number, give its row and then its column, both counted from 0 in Python. `m[1][2]` is the number in the second row and third column.",
      ],
      example: {
        language: 'python',
        code: code`
          m = [
              [1, 2, 3],
              [4, 5, 6],
          ]

          rows = len(m)
          cols = len(m[0])
          print(rows, cols)
          print(m[1][2])
        `,
        output: '2 3\n6',
      },
    },
    {
      heading: 'Multiplying a matrix by a vector',
      paragraphs: [
        "To multiply a matrix by a vector, take each row of the matrix in turn and work out its dot product with the vector: multiply matching positions and add them up. Each row gives one number, so the result is a new vector with one entry per row.",
        "For the matrix with rows `[1, 2]` and `[3, 4]`, times the vector `[10, 1]`: the first row gives 1 times 10 plus 2 times 1, which is 12. The second gives 3 times 10 plus 4 times 1, which is 34. The answer is `[12, 34]`.",
        "Each row acts like a recipe that mixes the inputs in its own proportions. In a weighted average, these numbers are called weights, and changing them changes the result.",
      ],
      example: {
        language: 'python',
        code: code`
          W = [
              [1, 2],
              [3, 4],
          ]
          x = [10, 1]

          result = [sum(w * v for w, v in zip(row, x)) for row in W]
          print(result)
        `,
        output: '[12, 34]',
      },
    },
    {
      heading: 'Making the shapes fit',
      paragraphs: [
        "A matrix times a vector only works if each row has as many numbers as the vector. In shape terms, a (rows, n) matrix can only multiply a vector of length n. The result has length rows.",
        "The same rule extends to two matrices. A (2, 3) matrix times a (3, 4) matrix works, because the inner numbers match, 3 and 3. The result takes the outer numbers: (2, 4). A (2, 3) times a (2, 3) does not work, because 3 and 2 do not match.",
        "Checking shapes before you calculate catches a huge share of mistakes in matrix code. Write the shapes side by side and make sure the inner pair matches.",
      ],
      example: {
        language: 'text',
        code: code`
          (2, 3) x (3,)    ->  inner 3 = 3  ->  result (2,)
          (2, 3) x (3, 4)  ->  inner 3 = 3  ->  result (2, 4)
          (2, 3) x (2, 3)  ->  inner 3 vs 2 ->  not allowed
          (4, 2) x (3,)    ->  inner 2 vs 3 ->  not allowed
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'One step of a tiny weighted mix',
    intro: "A layer takes 3 input numbers about a house (size in hundreds of square meters, bedrooms, age in decades) and turns them into 2 new numbers. The weight matrix has shape (2, 3): 2 outputs, each mixing 3 inputs.",
    example: {
      language: 'python',
      code: code`
        def matvec(W, x):
            assert len(W[0]) == len(x), "shapes do not fit"
            return [sum(w * v for w, v in zip(row, x)) for row in W]

        W = [
            [0.5, 0.2, -0.1],
            [0.1, 0.4, 0.3],
        ]
        house = [1.2, 3, 2]

        print(len(W), len(W[0]))
        print([round(n, 2) for n in matvec(W, house)])
      `,
      output: '2 3\n[1.0, 1.92]',
    },
    steps: [
      { code: 'assert len(W[0]) == len(x), "shapes do not fit"', explanation: "Before calculating, check that each row is as long as the input vector. `assert` stops the program with the message if the check fails." },
      { code: 'return [sum(w * v ...) for row in W]', explanation: "One dot product per row: multiply each weight by the matching input and add them up." },
      { code: 'W = [[0.5, 0.2, -0.1], [0.1, 0.4, 0.3]]', explanation: "Shape (2, 3). The first row cares most about size and counts age slightly against. The second row cares mostly about bedrooms and age." },
      { code: 'house = [1.2, 3, 2]', explanation: "120 square meters, 3 bedrooms, 20 years old, written in the units the layer expects." },
      { code: '[1.0, 1.92]', explanation: "Row 1: 0.5 times 1.2 plus 0.2 times 3 minus 0.1 times 2 gives 1.0. Row 2: 0.12 plus 1.2 plus 0.6 gives 1.92. Three numbers went in and two came out, as the (2, 3) shape promised." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Change the house to `[1.2, 3, 2, 5]` by adding a fourth number. Predict what happens before you run it.',
      'Add a third row to `W`, such as `[0, 0, 1]`. Predict the new output length and the value of the new entry.',
    ],
    playground: 'python',
    starterCode: code`
      def matvec(W, x):
          assert len(W[0]) == len(x), "shapes do not fit"
          return [sum(w * v for w, v in zip(row, x)) for row in W]

      W = [
          [0.5, 0.2, -0.1],
          [0.1, 0.4, 0.3],
      ]
      house = [1.2, 3, 2]

      print(len(W), len(W[0]))
      print([round(n, 2) for n in matvec(W, house)])
    `,
  },
  mistakes: [
    { mistake: 'Writing a shape as columns by rows.', fix: 'Shape is always rows first. A matrix with 2 rows of 3 numbers is (2, 3).' },
    { mistake: 'Assuming matrix multiplication works in either order.', fix: 'A times B is usually different from B times A, and often one order is not even allowed. Check the inner shapes for the order you need.' },
    { mistake: 'Multiplying matching positions of two matrices and calling it matrix multiplication.', fix: 'That is a different operation, called element-wise multiplication. Matrix multiplication uses row-by-column dot products.' },
  ],
  quiz: [
    {
      question: 'What is the result of the matrix with rows `[2, 0]` and `[1, 3]` times the vector `[4, 5]`?',
      options: [
        { text: '[8, 15]', explanation: 'That multiplies only the diagonal numbers. Each row uses every position of the vector.' },
        { text: '[8, 19]', explanation: 'Row 1: 2 times 4 plus 0 times 5 is 8. Row 2: 1 times 4 plus 3 times 5 is 19.' },
        { text: '[6, 9]', explanation: 'That adds instead of multiplying. Each step multiplies matching positions, then adds.' },
        { text: '27', explanation: 'A matrix times a vector gives a vector, one number per row, not a single total.' },
      ],
      answer: 1,
    },
    {
      question: 'A layer has a weight matrix of shape (64, 128). What length must its input vector be, and what length comes out?',
      options: [
        { text: 'Input 64, output 128', explanation: 'That has it backwards. Each row has 128 numbers, so the input must be 128 long.' },
        { text: 'Input 128, output 128', explanation: 'The output has one number per row, and there are 64 rows.' },
        { text: 'Input 64 or 128, output either', explanation: 'Only one input length fits: the number of columns.' },
        { text: 'Input 128, output 64', explanation: 'The input must match the number of columns, 128. The output has one entry per row, 64.' },
      ],
      answer: 3,
    },
    {
      question: 'Which pair of shapes can be multiplied in the order given?',
      options: [
        { text: '(3, 5) times (5, 2)', explanation: 'The inner numbers match, 5 and 5, so it works, and the result has shape (3, 2).' },
        { text: '(3, 5) times (3, 5)', explanation: 'The inner numbers are 5 and 3, which do not match.' },
        { text: '(5, 2) times (5, 2)', explanation: 'The inner numbers are 2 and 5, which do not match.' },
        { text: '(2, 3) times (2,)', explanation: 'Each row has 3 numbers but the vector has only 2.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A matrix turns one vector into another by taking a dot product with each row, and it only works when the inner shapes match.',
  resources: [
    { title: 'Matrices', provider: 'Khan Academy', description: 'Free lessons and practice on matrix shapes and multiplication.', url: 'https://www.khanacademy.org/math/precalculus/x9e81a4f98389efdf:matrices' },
    { title: 'Linear transformations and matrices', provider: '3Blue1Brown', description: 'A visual explanation of what multiplying by a matrix does to space.', url: 'https://www.3blue1brown.com/lessons/linear-transformations' },
  ],
  underTheHood: {
    heading: 'Why matrix work runs fast on parallel hardware',
    paragraphs: [
      "Look at the matrix-vector code again. Each row's dot product does not depend on any other row. Row 1 and row 2 could be calculated at the same moment by two different workers.",
      "A normal processor, the CPU, has a handful of powerful cores and does a few things at once. A graphics card, the GPU, has thousands of simpler cores, originally designed to work out the color of every pixel on a screen at the same time. That is the same shape of problem: many small independent multiply-and-add jobs.",
      "A physics simulation or a 3D game multiplies matrices with thousands of rows and columns many times every second. Spread across thousands of GPU cores, those dot products happen side by side instead of one after another. That is why game studios and scientists buy graphics cards for this work, and why libraries like NumPy exist: they hand these multiplications to fast, parallel code.",
    ],
  },
}

export default lesson
