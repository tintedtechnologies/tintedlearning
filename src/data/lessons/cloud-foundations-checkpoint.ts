import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Design a small cloud application from its requirements to its services',
    'Check the design for identity, data location, cost, and monitoring',
    'Explain the design choices in plain words to someone who is not an engineer',
  ],
  bigIdea: 'A cloud design starts from what the application must do, who uses it, where its users are, what data it holds, and how much it can cost. Each service is a choice that answers one of those needs. This checkpoint asks you to design a small application from those requirements and to explain every choice.',
  whyItMatters: 'A teacher wants a site where students hand in essays and receive comments within a day. A design that starts with the favorite cloud service often misses the real needs: student privacy, a fixed budget, and a few hundred users at most. A design that starts with the requirements is smaller, cheaper, and easier to defend.',
  goalSections: [
    {
      heading: 'Start from the requirements',
      paragraphs: [
        'Write the requirements before naming any service. Who uses the application, and how many people use it at the busiest moment? Where are they? What data is stored, and does any of it need special protection? What must happen when something fails?',
        'For the essay site, the requirements might be these: about two hundred students, mostly in one region, a few uploads per student per week, private essays that only the student and the teacher can read, and a budget of about twenty dollars a month. Each of these answers shapes the design.',
        'Write the requirements as plain statements that a person could check. "The site responds in under two seconds for a student in the same region" can be tested. "The site is fast" cannot.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Requirement 1: about 200 students use the site at the busiest time.
          Requirement 2: essays are private to the student and the teacher.
          Requirement 3: data stays in one region.
          Requirement 4: the monthly cost stays under twenty dollars.
        `,
      },
    },
    {
      heading: 'Choose services that answer each need',
      paragraphs: [
        'A small web app usually needs five parts: a way to serve pages, a place to run the application code, a database for the data, a place to store uploaded files, and a way to control who can see what. Each part can be a managed service that the provider runs for you, which reduces the work of keeping it up to date.',
        'For a small site with a fixed budget, a managed database and a single application service are often better than a large cluster of machines. The design should say why the chosen size is enough, and what would trigger a larger one.',
        'Keep identity separate from data. Students log in through an identity service, and the application checks each request against the rule that only the owner and the teacher may read an essay. Storing passwords in your own code is a risk you do not need to take.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          design = {
              "serve pages": "static site or managed web host",
              "run application code": "small managed app service",
              "store data": "managed relational database",
              "store uploads": "private object storage",
              "control access": "managed identity service",
          }
          for part, choice in design.items():
              print(part.ljust(22), "->", choice)
        `,
        output: 'serve pages            -> static site or managed web host\nrun application code   -> small managed app service\nstore data             -> managed relational database\nstore uploads          -> private object storage\ncontrol access         -> managed identity service',
      },
    },
    {
      heading: 'Check the design, then explain it simply',
      paragraphs: [
        'Check where the data lives. If the students are in one region, keep the database and uploads in that region too. This lowers latency and helps meet rules about where student data may be stored.',
        'Estimate the monthly cost, as covered in the cost lesson. Add a budget alert at half the limit. If the estimate is above the budget, reduce the size, the number of services, or the storage before building.',
        'Plan monitoring from the start. Decide which two or three numbers show the site is healthy, such as the error rate and the time to load an essay page. Decide who receives the alert, and what that person checks first.',
        'A good design explanation fits on one page. It states the requirements, lists the services and why each one was chosen, names the main risk, and gives the budget. A teacher or manager should be able to read it and decide whether the design fits their needs.',
        'Be honest about what the design does not cover. If the site has no plan for a sudden spike in traffic, say so, and say what would be done. Naming a limit builds more trust than hiding it.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          monthly_estimate = 14.5
          budget = 20.0
          alert_at = budget * 0.5
          print("within budget:", monthly_estimate <= budget)
          print("alert at:", alert_at)
        `,
        output: 'within budget: True\nalert at: 10.0',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a design against its requirements',
    intro: 'The program below compares a design with a list of requirements and reports any requirement the design does not yet meet. A real review would go deeper, but the habit is the same: every requirement needs an answer. Run it, then add a requirement and predict whether it is met.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        requirements = {
            "data stays in one region": True,
            "private essays are protected": True,
            "monthly cost under twenty dollars": True,
            "monitoring and alerts planned": False,
        }
        unmet = [item for item, met in requirements.items() if not met]
        print("requirements met:", len(requirements) - len(unmet), "of", len(requirements))
        for item in unmet:
            print("still to design:", item)
      `,
      output: 'requirements met: 3 of 4\nstill to design: monitoring and alerts planned',
    },
    steps: [
      { code: 'requirements = {...}', explanation: 'Each requirement is written as a statement the design either meets or does not.' },
      { code: 'unmet = [item for item, met in requirements.items() if not met]', explanation: 'Collects the requirements the design does not yet satisfy.' },
      { code: 'print("requirements met:", ...)', explanation: 'Reports progress as a count, so the team can see how close the design is.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write the requirements for a small app you would like to build, with at least five statements that could be tested.',
      'Choose a service for each of the five needs in the design section. Write one reason for each choice and one alternative you rejected.',
      'Write a one-page explanation of the design for a non-technical reader, including the budget, the main risk, and one limit you are accepting.',
    ],
  },
  mistakes: [
    { mistake: 'Choosing services before writing the requirements.', fix: 'Write the requirements first, then choose the smallest service that meets each one.' },
    { mistake: 'Storing passwords in the application.', fix: 'Use a managed identity service and keep credentials out of the code.' },
    { mistake: 'Leaving monitoring for after launch.', fix: 'Name the health numbers and the alert owner during the design.' },
  ],
  quiz: [
    {
      question: 'What should a cloud design start from?',
      options: [
        { text: 'The most popular service on the provider\'s home page', explanation: 'Popularity does not show whether a service fits the requirements.' },
        { text: 'The requirements: users, data, location, cost, and failure plans', explanation: 'Yes. Each design choice should answer one of these needs.' },
        { text: 'The largest server available', explanation: 'A large server may cost more than the project needs and does not define the design.' },
        { text: 'The team\'s favorite programming language', explanation: 'The language matters, but the requirements decide the services.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the unmet requirement?',
      code: { language: 'python', runnable: true, code: code`
        req = {"cost under budget": True, "alerts planned": False}
        unmet = [item for item, met in req.items() if not met]
        print(len(unmet), unmet)
      ` },
      options: [
        { text: '1 [\'alerts planned\']', explanation: 'Yes. One requirement is not met, and it is the alerts requirement.' },
        { text: '0 []', explanation: 'The alerts requirement is False, so it counts as unmet.' },
        { text: '2 [\'cost under budget\', \'alerts planned\']', explanation: 'The cost requirement is True, so it is met.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why keep identity separate from the application data?',
      options: [
        { text: 'So access rules and credentials are handled by a service built for that job', explanation: 'Yes. Dedicated identity services reduce the risk of mistakes in your own code.' },
        { text: 'So the data becomes faster to read', explanation: 'Separation is about security and control, not speed.' },
        { text: 'So the data can be deleted without asking anyone', explanation: 'Separating identity does not make deleting data easier or allowed by default.' },
        { text: 'So the application does not need a database', explanation: 'The application still needs a database. Identity is a separate concern.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Design a cloud application from its requirements, choose the smallest managed service for each need, check region, cost, identity, and monitoring, and explain the result in plain words.',
  resources: [
    { title: 'Well-Architected Framework', provider: 'AWS', description: 'A free set of questions for reviewing a cloud design for reliability, security, cost, and performance.', url: 'https://aws.amazon.com/architecture/well-architected/' },
    { title: 'Azure Well-Architected Framework', provider: 'Microsoft Learn', description: 'Design review guidance for cloud workloads, with checklists for each pillar.', url: 'https://learn.microsoft.com/en-us/azure/well-architected/' },
  ],
}

export default lesson
