import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe collections with sets, and combine them with union, intersection, and difference',
    'Count outcomes with the multiplication rule and the addition rule',
    'Use counting to decide how likely or how many options a choice really has',
  ],
  bigIdea: 'A set is a collection of distinct items, and most everyday questions about groups can be answered with three operations: union, which combines two groups, intersection, which keeps what they share, and difference, which keeps what is in one but not the other. Counting extends this by showing how many ways a sequence of choices can happen.',
  whyItMatters: 'A school asks how many students play a sport, how many play an instrument, and how many do both. The answers come from set operations, not guesswork. Later, a password policy asks how many passwords are possible with a given length and character set. That is a counting question, and the answer decides how secure the policy really is.',
  goalSections: [
    {
      heading: 'Sets and their operations',
      paragraphs: [
        'A set is a collection with no repeated items. Order does not matter, so the set of sports {football, tennis} is the same as {tennis, football}. Each item is either in a set or not, which makes sets a clear way to describe groups. That yes or no answer is what makes questions about groups precise.',
        'The union of two sets contains every item in either set. The intersection contains only the items that are in both. The difference of two sets contains the items in the first set that are not in the second. Venn diagrams show these operations as overlapping circles, and sketching one is often the quickest way to check a count.',
        'The inclusion and exclusion rule helps count the union. The size of the union equals the size of the first set plus the size of the second, minus the size of their intersection, because the shared items were counted twice.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          sports = {"football", "tennis", "rowing"}
          music = {"piano", "tennis", "choir"}
          print("union:", len(sports | music))
          print("both:", sports & music)
          print("sports only:", sorted(sports - music))
        `,
        output: "union: 5\nboth: {'tennis'}\nsports only: ['football', 'rowing']",
      },
    },
    {
      heading: 'Counting with the multiplication rule',
      paragraphs: [
        'If one choice has three options and a second choice has four, the two choices together have twelve combinations. This is the multiplication rule: when choices are independent, multiply the number of options at each step.',
        'A four-digit PIN with ten digits at each position has ten thousand possible values, because the choices multiply. A six-character password from a set of ninety-five characters has ninety-five to the power of six possibilities, which is far larger. Counting the possibilities shows how hard a guess would be.',
        'The multiplication rule explains why length matters more than complexity alone. Each extra character multiplies the number of possibilities, so a longer password is harder to guess than a slightly more complicated short one.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          shirts = 4
          trousers = 3
          shoes = 2
          print("outfits:", shirts * trousers * shoes)
        `,
        output: 'outfits: 24',
      },
    },
    {
      heading: 'Counting with the addition rule and listing carefully',
      paragraphs: [
        'When outcomes fall into separate groups that cannot happen together, add the counts. A menu with five starters and four mains has nine choices if you pick one course, but twenty combinations if you pick a starter and a main.',
        'Be careful not to count the same outcome twice. When two categories overlap, use the inclusion and exclusion rule. A list of students who like math or science must subtract the students who like both, or they will be counted twice.',
        'When counting is hard to picture, list a small case by hand. Writing out the possibilities for two or three items often reveals the pattern, and the formula can then be checked against the list.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          starters = ["soup", "salad", "bread", "olives", "melon"]
          mains = ["pasta", "fish", "curry", "burger"]
          desserts = ["cake", "fruit"]
          print("one course only:", len(starters) + len(mains) + len(desserts))
          print("starter and main:", len(starters) * len(mains))
        `,
        output: 'one course only: 11\nstarter and main: 20',
      },
    },
  ],
  seeItInAction: {
    title: 'Counting possibilities for a password',
    intro: 'The program below counts the possible passwords for a length and a character set, then shows how much each extra character matters. Run it, then change the length to 10 and predict how many times more possibilities there are.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        charset = 26 + 26 + 10
        for length in [6, 8]:
            print("length", length, "possibilities:", charset ** length)
        print("extra characters multiply the total:", (charset ** 8) // (charset ** 6))
      `,
      output: 'length 6 possibilities: 56800235584\nlength 8 possibilities: 218340105584896\nextra characters multiply the total: 3844',
    },
    steps: [
      { code: 'charset = 26 + 26 + 10', explanation: 'Lowercase letters, uppercase letters, and digits: 62 choices at each position.' },
      { code: 'charset ** length', explanation: 'The multiplication rule: each position multiplies the number of possibilities by the same count.' },
      { code: 'print("extra characters multiply the total:", ...)', explanation: 'Two extra characters multiply the total by 62 times 62, which is 3844. Length has a large effect.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write two sets of your own, such as the hobbies of two friends. Find the union, the intersection, and the difference of the first set from the second.',
      'Change the length in the password example to 10 and predict the number of possibilities by multiplying by 62 twice more. Run it to check.',
      'A menu has four starters, three mains, and two desserts. Count the meals with one of each course, and count the meals with a starter and a main only.',
    ],
  },
  mistakes: [
    { mistake: 'Adding the sizes of overlapping sets without subtracting the overlap.', fix: 'Use the inclusion and exclusion rule: subtract the items that were counted in both.' },
    { mistake: 'Adding when the choices happen one after another.', fix: 'When each choice is independent and happens in sequence, multiply the options.' },
    { mistake: 'Estimating counts without listing a small case.', fix: 'List a small example by hand, then check the formula against it.' },
  ],
  quiz: [
    {
      question: 'Two sets share one item out of four and five items. How many items are in their union?',
      options: [
        { text: '9', explanation: 'That counts the shared item twice. Subtract the overlap once.' },
        { text: '8', explanation: 'Yes. Four plus five is nine, and the shared item is counted once, so eight.' },
        { text: '1', explanation: 'That is the intersection, which is the shared items, not the union.' },
        { text: '20', explanation: 'That is four times five, which applies to choices in sequence, not to set unions.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the length of the set union?',
      code: { language: 'python', runnable: true, code: code`
        a = {"red", "blue"}
        b = {"blue", "green"}
        print(len(a | b))
      ` },
      options: [
        { text: '4', explanation: 'The blue item is in both sets, so it appears once in the union.' },
        { text: '3', explanation: 'Yes. The union is red, blue, and green.' },
        { text: '2', explanation: 'That is the size of each set, not the union.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why does a longer password help more than a slightly more complex short one?',
      options: [
        { text: 'Each extra position multiplies the number of possibilities', explanation: 'Yes. The multiplication rule means each added character has a large effect on the total.' },
        { text: 'Long passwords are always stored differently', explanation: 'Storage is not the reason. The count of possibilities is.' },
        { text: 'Complex characters are not allowed in short passwords', explanation: 'Characters can be used in short passwords too. The issue is the number of possibilities.' },
        { text: 'Long passwords never need to be changed', explanation: 'Changing passwords is a separate practice and is not the reason.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Sets describe groups with union, intersection, and difference, and counting uses the multiplication rule for choices in sequence and the addition rule for separate groups, while the inclusion and exclusion rule avoids double counting.',
  resources: [
    { title: 'Sets and Venn diagrams', provider: 'Khan Academy', description: 'Free lessons on sets, Venn diagrams, and set operations.', url: 'https://www.khanacademy.org/math/precalculus' },
    { title: 'Counting principles', provider: 'Brilliant', description: 'Interactive lessons on the multiplication and addition rules, with worked problems.', url: 'https://brilliant.org/wiki/counting-principles/' },
  ],
}

export default lesson
