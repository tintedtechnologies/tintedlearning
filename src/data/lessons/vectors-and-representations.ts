import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe a real thing as a vector, a list of numbers called features',
    'Add vectors and multiply them by a number, and say what the result means',
    'Measure how similar two vectors are with distance and cosine similarity',
  ],
  bigIdea: "Computers cannot compare songs, houses or sentences directly, but they can compare lists of numbers. A vector is an ordered list of numbers that describes something, one number per feature. Once things are vectors, \"how alike are these?\" becomes a calculation.",
  whyItMatters: "When a streaming service suggests a film you end up loving, it has not watched anything. It has turned each film into a vector of numbers, and turned your taste into one too, then looked for films whose vectors sit close to yours. The same idea powers search engines, product recommendations and the way chatbots find relevant documents.",
  goalSections: [
    {
      heading: 'Turning things into vectors',
      paragraphs: [
        "A feature is one measurable property, such as a house's size or a song's tempo. A vector lists the features in a fixed order, like `[3, 120, 1]` for 3 bedrooms, 120 square meters and 1 garage. The number of features is the vector's length, also called its dimension.",
        "The order must be the same for every item. If one house is `[bedrooms, size]` and another is `[size, bedrooms]`, any comparison between them is nonsense.",
        "Not every feature starts as a number. Yes or no features become 1 or 0. Categories, like a film's genre, become several 0 or 1 features, one per category. AI models also learn their own vectors for words and images, called embeddings, with hundreds of features nobody chose by hand.",
      ],
      example: {
        language: 'python',
        code: code`
          # features: [action, comedy, romance, length in hours]
          heist_film = [1, 1, 0, 2.0]
          love_story = [0, 0, 1, 1.8]

          print(len(heist_film))
          print(heist_film[3])
        `,
        output: '4\n2.0',
      },
    },
    {
      heading: 'Adding and scaling vectors',
      paragraphs: [
        "To add two vectors of the same length, add the matching positions: `[1, 2] + [3, 4]` is `[4, 6]`. To scale a vector, multiply every number by the same amount: `2 * [1, 2]` is `[2, 4]`.",
        "These operations have plain meanings. Adding the vectors of two items combines them, which is how you might build a vector for \"my taste\" from the films you liked. Dividing a sum by the count gives the average vector, a profile somewhere in the middle of them.",
        "Picture a 2-number vector as an arrow from the origin, the point (0, 0), to that point on a graph. Scaling makes the arrow longer or shorter without changing its direction.",
      ],
      example: {
        language: 'python',
        code: code`
          liked_1 = [1, 0, 1]
          liked_2 = [1, 1, 0]

          total = [a + b for a, b in zip(liked_1, liked_2)]
          taste = [x / 2 for x in total]
          print(total)
          print(taste)
        `,
        output: '[2, 1, 1]\n[1.0, 0.5, 0.5]',
      },
    },
    {
      heading: 'Measuring similarity',
      paragraphs: [
        "Distance is the straight-line gap between two vectors: subtract position by position, square each difference, add them up and take the square root. Small distance means similar.",
        "The dot product multiplies matching positions and adds the results. It is large when both vectors have big numbers in the same places. Dividing it by the two vector lengths gives cosine similarity, which only cares about direction: 1 means pointing the same way, 0 means unrelated.",
        "Cosine similarity is popular for text, because a long document and a short one about the same topic point the same way even though their numbers differ in size.",
      ],
      example: {
        language: 'python',
        code: code`
          import math

          a = [1, 2]
          b = [2, 4]
          c = [2, -1]

          print(math.dist(a, b))
          dot = sum(x * y for x, y in zip(a, b))
          print(round(dot / (math.hypot(*a) * math.hypot(*b)), 3))
          print(sum(x * y for x, y in zip(a, c)))
        `,
        output: '2.23606797749979\n1.0\n0',
      },
    },
  ],
  seeItInAction: {
    title: 'Recommending a film by similarity',
    intro: "Each film is a vector of four features: action, comedy, romance and how dark it is, each scored from 0 to 1. Your taste is the vector of a film you loved. The program ranks the other films by cosine similarity.",
    example: {
      language: 'python',
      code: code`
        import math

        def cosine(u, v):
            dot = sum(x * y for x, y in zip(u, v))
            return dot / (math.hypot(*u) * math.hypot(*v))

        films = {
            "Night Chase": [0.9, 0.1, 0.0, 0.8],
            "Wedding Mixup": [0.0, 0.9, 0.7, 0.1],
            "Rooftop Heist": [0.8, 0.4, 0.1, 0.6],
        }
        loved = [1.0, 0.3, 0.0, 0.7]

        for title, vector in films.items():
            print(title, round(cosine(loved, vector), 2))
      `,
      output: 'Night Chase 0.98\nWedding Mixup 0.24\nRooftop Heist 0.99',
    },
    steps: [
      { code: 'def cosine(u, v):', explanation: "A small function for cosine similarity: the dot product divided by the lengths of the two vectors. `math.hypot(*u)` gives the length of `u`." },
      { code: '"Night Chase": [0.9, 0.1, 0.0, 0.8],', explanation: "Every film uses the same four features in the same order, so position 0 always means action." },
      { code: 'loved = [1.0, 0.3, 0.0, 0.7]', explanation: "Your taste, as a vector: lots of action, a little comedy, no romance, fairly dark." },
      { code: 'round(cosine(loved, vector), 2)', explanation: "Each film gets a score between 0 and 1. Rounding to 2 places keeps the output readable." },
      { code: 'Night Chase 0.98 ... Rooftop Heist 0.99', explanation: "Both action films point almost the same way as your taste, so they score near 1. The romantic comedy shares only a little comedy and darkness, and scores 0.24. A recommender would suggest the two heist-style films first." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Change `loved` to `[0.0, 0.8, 0.9, 0.0]`, someone who loves romantic comedies. Predict which film now scores highest, then run it.',
      'Add a fourth film with your own four numbers and see where it ranks.',
    ],
    playground: 'python',
    starterCode: code`
      import math

      def cosine(u, v):
          dot = sum(x * y for x, y in zip(u, v))
          return dot / (math.hypot(*u) * math.hypot(*v))

      films = {
          "Night Chase": [0.9, 0.1, 0.0, 0.8],
          "Wedding Mixup": [0.0, 0.9, 0.7, 0.1],
          "Rooftop Heist": [0.8, 0.4, 0.1, 0.6],
      }
      loved = [1.0, 0.3, 0.0, 0.7]

      for title, vector in films.items():
          print(title, round(cosine(loved, vector), 2))
    `,
  },
  mistakes: [
    { mistake: 'Putting features in a different order for different items.', fix: 'Decide the feature order once, write it down, and build every vector the same way.' },
    { mistake: 'Comparing features measured on very different scales.', fix: 'A size of 120 swamps a bedroom count of 3 in a distance. Rescale features to similar ranges, such as 0 to 1, before comparing.' },
    { mistake: 'Adding or comparing vectors of different lengths.', fix: 'Vector math only works position by position, so both vectors need the same number of features.' },
  ],
  quiz: [
    {
      question: 'What is `[2, 5] + [1, -3]`, added as vectors?',
      options: [
        { text: '[2, 5, 1, -3]', explanation: 'That joins the lists end to end, which is what `+` does to Python lists, but not what vector addition means.' },
        { text: '[3, 2]', explanation: 'Add matching positions: 2 + 1 = 3 and 5 + (-3) = 2.' },
        { text: '5', explanation: 'Adding two vectors gives another vector, not a single number.' },
        { text: '[2, -15]', explanation: 'That multiplies matching positions, which is the first step of a dot product, not addition.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        a = [3, 1, 2]
        b = [1, 0, 4]
        print(sum(x * y for x, y in zip(a, b)))
      ` },
      options: [
        { text: '11', explanation: '3 times 1, plus 1 times 0, plus 2 times 4: 3 + 0 + 8 = 11.' },
        { text: '[3, 0, 8]', explanation: 'Those are the products, but `sum` then adds them into a single number.' },
        { text: '6', explanation: 'That adds the numbers in `a` alone. The dot product multiplies matching positions first.' },
        { text: '13', explanation: 'That adds every number in both lists. The dot product multiplies pairs before adding.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Two customer reviews about the same faulty phone charger get a cosine similarity of 0.95. A review about a vacation gets 0.1 against both. What does this show?',
      options: [
        { text: 'The first two reviews must be identical word for word', explanation: 'A score of 1 would be needed for identical direction, and even then the wording could differ.' },
        { text: 'The vacation review is negative', explanation: 'Similarity says how alike the topics are, not whether a review is positive or negative.' },
        { text: 'The two charger reviews point in nearly the same direction, so they are about the same thing', explanation: 'A cosine near 1 means similar direction, which for text vectors means similar meaning.' },
        { text: 'The charger reviews are longer than the vacation review', explanation: 'Cosine similarity ignores length and only looks at direction.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Describe things as vectors of features in a fixed order, and similarity becomes something you can calculate with distance or cosine similarity.',
  resources: [
    { title: 'Vectors', provider: 'Khan Academy', description: 'Free lessons on vector addition, scaling and length.', url: 'https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces' },
    { title: 'Essence of linear algebra', provider: '3Blue1Brown', description: 'A visual video series that shows vectors as arrows you can see move.', url: 'https://www.3blue1brown.com/topics/linear-algebra' },
  ],
  underTheHood: {
    heading: 'Why the dot product measures direction',
    paragraphs: [
      "There is a second way to write the dot product: the length of the first vector, times the length of the second, times the cosine of the angle between them. The cosine of an angle is 1 at 0 degrees, 0 at 90 degrees and -1 at 180 degrees.",
      "Rearranging gives cosine similarity: the dot product divided by the two lengths leaves only the cosine of the angle. That is why it ignores size and only measures direction.",
      "In the example above, `[1, 2]` and `[2, -1]` have a dot product of 0. They sit at exactly 90 degrees to each other, which is called orthogonal. In a learned embedding, two words whose vectors are nearly orthogonal have almost nothing in common, while words pointing the same way, like king and queen, share a lot of meaning.",
    ],
  },
}

export default lesson
