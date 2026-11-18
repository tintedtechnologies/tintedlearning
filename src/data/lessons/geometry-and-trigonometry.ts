import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Use the Pythagorean theorem to find the distance between two points',
    'Use sine and cosine to find a side of a right triangle from an angle',
    'Explain why angles are measured in radians in most formulas',
  ],
  bigIdea: 'Geometry relates lengths and angles, and the Pythagorean theorem links the sides of a right triangle. Trigonometry extends this to any angle, using sine and cosine to turn an angle and a length into the horizontal and vertical parts of a movement. Those two parts together describe any straight move in a plane, which is why these ideas appear in maps, games, and engineering drawings.',
  whyItMatters: 'A surveyor needs the distance across a lake without wading into it. She measures a baseline on land, then the angle to a tree on the far shore from each end. Trigonometry turns those measurements into the distance, and no one has to cross the water.',
  goalSections: [
    {
      heading: 'Distance with the Pythagorean theorem',
      paragraphs: [
        'In a right triangle, the square of the longest side, called the hypotenuse, equals the sum of the squares of the other two sides. If the legs are 3 and 4, the hypotenuse is the square root of 9 plus 16, which is 5. The same rule gives the straight-line distance between two points: take the horizontal and vertical differences as the legs. Two points on a grid with horizontal and vertical gaps of 6 and 8 are 10 apart, which is the same triangle scaled up.',
        'Use the rule carefully. It applies only to right triangles, and the hypotenuse is always the longest side. Writing the steps down, with each length named, prevents most mistakes. Sketch the triangle first, and mark the right angle, so you can see which side is the hypotenuse before you write any numbers.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'distance.py',
        code: code`
          import math

          print(math.hypot(3, 4))
        `,
        output: '5.0',
      },
    },
    {
      heading: 'Sine and cosine from an angle',
      paragraphs: [
        'In a right triangle, the sine of an angle is the opposite side divided by the hypotenuse, and the cosine is the adjacent side divided by the hypotenuse. If you know the angle and the hypotenuse, these ratios give the other two sides. A ramp at 30 degrees that is 10 meters long rises 5 meters, because the sine of 30 degrees is one half. The same idea works for a ladder against a wall, a shadow on the ground, or a slope on a hill.',
        'Calculators and Python use radians rather than degrees in their formulas. A full turn is 2 times pi radians, which is 360 degrees, so 30 degrees is pi divided by 6 radians.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'sine.py',
        code: code`
          import math

          print(round(math.sin(math.pi / 6), 2))
        `,
        output: '0.5',
      },
    },
    {
      heading: 'Why radians are the natural unit',
      paragraphs: [
        'A radian is the angle that cuts off an arc equal in length to the radius of a circle. Because of that definition, the arc length is simply the radius times the angle, with no conversion factor. Formulas for rotation, motion along a circle, and waves are much simpler in radians for this reason. Physics and engineering textbooks use radians for the same reason.',
        'When a formula gives an unexpected result, check the unit first. A sine computed with degrees where radians are expected can look plausible and still be wrong. Use the same unit everywhere in a calculation, and write the unit beside every number you carry through the work.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Angle        Radians
          0 degrees    0
          90 degrees   pi / 2
          180 degrees  pi
          360 degrees  2 pi
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Measuring a distance across a lake',
    intro: 'The surveyor measures a baseline of 100 meters along the shore and a right angle to the tree from one end. A right triangle with legs of 60 and 80 meters gives the distance across. Run the check, and compare the answer with the shortest path.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'lake.py',
      code: code`
        import math

        across = 60
        along = 80
        print(math.hypot(across, along))
      `,
      output: '100.0',
    },
    steps: [
      { code: 'import math', explanation: 'Brings in Python\'s math module, which includes hypot for the hypotenuse of a right triangle.' },
      { code: 'across = 60', explanation: 'The distance across the lake, measured as one leg of the right triangle.' },
      { code: 'along = 80', explanation: 'The distance along the shore, measured as the other leg.' },
      { code: 'print(math.hypot(across, along))', explanation: 'Prints the hypotenuse, 100.0. That is the straight-line distance, the shortest path between the two points.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the legs to 5 and 12, and predict the hypotenuse before you run the program.',
      'Compute the height of a 10-meter ramp at 45 degrees, using sine. Remember to convert 45 degrees to radians first.',
      'Find a real right triangle in your home or school, measure two sides, and check the third with the rule.',
    ],
  },
  mistakes: [
    { mistake: 'Using the Pythagorean theorem on a triangle that is not a right triangle.', fix: 'Check for a right angle first. Use the law of cosines for other triangles.' },
    { mistake: 'Passing degrees to a function that expects radians.', fix: 'Convert with math.radians, or multiply degrees by pi divided by 180, before you call sine or cosine.' },
    { mistake: 'Naming the wrong side as the opposite or adjacent side.', fix: 'Pick the angle first, then name the sides from that angle. The hypotenuse never changes.' },
  ],
  quiz: [
    {
      question: 'A right triangle has legs of 6 and 8. What is the hypotenuse?',
      options: [
        { text: '10', explanation: 'Yes. The square root of 36 plus 64 is the square root of 100, which is 10.' },
        { text: '14', explanation: 'That adds the legs. The theorem adds their squares, then takes the square root.' },
        { text: '2', explanation: 'That is the difference between the legs, which does not give the hypotenuse.' },
        { text: '48', explanation: 'That multiplies the legs, which gives the area of the triangle, not its longest side.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        import math
        print(math.hypot(6, 8))
      ` },
      options: [
        { text: '10.0', explanation: 'Yes. The function returns the hypotenuse as a decimal number.' },
        { text: '14', explanation: 'That adds the legs instead of using the theorem.' },
        { text: '10', explanation: 'hypot returns a float, so the output shows a decimal point.' },
        { text: 'An error', explanation: 'The module and function both exist, so the code runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why are radians the natural unit for arc length?',
      options: [
        { text: 'Arc length equals the radius times the angle, with no conversion factor', explanation: 'Yes. That is the definition of the radian, so the formula is simple.' },
        { text: 'Radians are always smaller than degrees', explanation: 'Size is not the reason. The reason is the simple relationship with arc length.' },
        { text: 'Radians remove the need for triangles', explanation: 'Triangles still matter. Radians simplify formulas for arcs and rotation.' },
        { text: 'Calculators cannot use degrees', explanation: 'Calculators can use degrees. Formulas are simpler in radians.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'The Pythagorean theorem gives distances in right triangles, and sine and cosine turn an angle and a length into the sides of any right triangle.',
  resources: [
    { title: 'Trigonometry', provider: 'Khan Academy', description: 'Practice right triangles, sine and cosine, and the unit circle with guided exercises.', url: 'https://www.khanacademy.org/math/trigonometry' },
  ],
}

export default lesson
