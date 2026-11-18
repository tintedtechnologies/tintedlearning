import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why personal data needs care at every stage of an AI project',
    'Remove or reduce personal information before data is shared or used for training',
    'Describe consent, purpose, and retention in plain words',
  ],
  bigIdea: 'Every AI project depends on data, and much of that data describes people. Responsible use means collecting only what the project needs, removing identifying details before the data is shared, using it only for the purpose people agreed to, and deleting it when it is no longer needed. These habits protect the people in the data and the project itself.',
  whyItMatters: 'A school builds a homework helper and saves every student question, with names, to train a later version. A year later, a parent discovers that a student\'s health details were in the saved questions and could be seen by a contractor. The fix is not one setting. It is a set of decisions made before the first question was saved, and those decisions are what this lesson covers.',
  goalSections: [
    {
      heading: 'Personal data and why it is sensitive',
      paragraphs: [
        'Personal data is any information that can identify a person, either directly or when combined with other details. A name, an email address, and a student number are direct identifiers. A date of birth, a postcode, and a rare job title can identify someone when they are put together.',
        'Some personal data is more sensitive than the rest. Health information, money, religion, political views, and information about children need more protection, because a leak can cause real harm. A data set can look harmless until someone adds a second source and the people become easy to find.',
        'The first question for any AI project is therefore not "what can we collect?" It is "what do we actually need to answer our question?" Often the answer needs far less information than the team first wanted.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          records = [
              {"name": "Ada Lovelace", "email": "ada@example.com", "score": 91},
              {"name": "Alan Turing", "email": "alan@example.com", "score": 78},
          ]
          safe = [{"score": r["score"]} for r in records]
          print(safe)
        `,
        output: "[{'score': 91}, {'score': 78}]",
      },
    },
    {
      heading: 'Removing and reducing identifying details',
      paragraphs: [
        'Removing a name is only a first step. Replacing it with a random code, which is called pseudonymization, keeps the link between records without showing who they belong to. The key that connects the codes to people must be stored separately and protected.',
        'Reducing detail is also powerful. An exact birth date can become an age range. A full postcode can become a region. A precise time can become a day of the week. The model often still learns the pattern, while the people become harder to identify.',
        'Check the data after cleaning. Search for email addresses, phone numbers, and unusual combinations of details. A cleaning step that worked on last month\'s data may miss a new column added since then.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          record = {"name": "Ada Lovelace", "birth_date": "1985-03-14", "postcode": "BS1 4DJ", "score": 91}
          reduced = {"age_band": "35-44", "region": "South West", "score": record["score"]}
          print(reduced)
        `,
        output: '{\'age_band\': \'35-44\', \'region\': \'South West\', \'score\': 91}',
      },
    },
    {
      heading: 'Consent, purpose, and keeping data only as long as needed',
      paragraphs: [
        'Consent means people understand what will happen to their data and agree to it. Agreement given for one purpose does not cover another. A person who shared answers to help with homework did not agree to have those answers used to sell products, even if the data is technically in the same file.',
        'Purpose limits how data is used. Write the purpose down before collecting the data, and check each new use against it. If a new idea falls outside the purpose, ask for consent again or do not use the data.',
        'Retention is how long data is kept. Set a period and delete the data when it expires. Old data is a risk, because it can be leaked, misused, or kept long after anyone remembers why it was collected.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          from datetime import date, timedelta

          collected = date(2026, 1, 10)
          delete_on = collected + timedelta(days=365)
          print("delete on:", delete_on)
        `,
        output: 'delete on: 2027-01-10',
      },
    },
  ],
  seeItInAction: {
    title: 'Keeping only the fields the project needs',
    intro: 'The program below takes a record with personal details and keeps only the fields the analysis needs, while replacing the name with a code. Notice that the analysis does not need to know who the student is. Run it, then add a field the project really needs and decide whether it should stay.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        records = [
            {"name": "Ada Lovelace", "email": "ada@example.com", "age": 17, "score": 91},
        ]
        needed = ["score", "age"]

        for index, record in enumerate(records, start=1):
            code_name = "student-" + str(index)
            kept = {field: record[field] for field in needed}
            kept["student"] = code_name
            print(kept)
      `,
      output: "{'score': 91, 'age': 17, 'student': 'student-1'}",
    },
    steps: [
      { code: 'needed = ["score", "age"]', explanation: 'The project decides in advance which fields it needs. Anything else is left out.' },
      { code: 'code_name = "student-" + str(index)', explanation: 'Replaces the name with a code. The key linking codes to names must be stored separately.' },
      { code: 'kept = {field: record[field] for field in needed}', explanation: 'Builds a new record with only the approved fields, so the email never reaches the analysis.' },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a dataset you have, such as a list of contacts or orders. Write down which fields the project truly needs and which can be removed.',
      'Choose one field that could identify someone when combined with another, such as a birth date. Write a way to reduce it, such as an age range.',
      'Write a purpose statement and a retention period for a small project of your own, and check whether each data field supports the purpose.',
    ],
  },
  mistakes: [
    { mistake: 'Collecting everything in case it is useful later.', fix: 'Write down what the project needs before collecting. Leave out the rest.' },
    { mistake: 'Believing a name removed means the data is anonymous.', fix: 'Combined details can still identify people. Reduce details and check the combinations.' },
    { mistake: 'Keeping data indefinitely.', fix: 'Set a retention period and delete the data when it expires.' },
  ],
  quiz: [
    {
      question: 'Which field is most useful to remove first from a dataset for a study about exam results?',
      options: [
        { text: 'The score', explanation: 'The score is what the study needs, so it should stay.' },
        { text: 'The student name', explanation: 'Yes. The study does not need the name to measure results, and it identifies the student directly.' },
        { text: 'The subject', explanation: 'The subject is part of the analysis and should usually stay.' },
        { text: 'The year level', explanation: 'The year level may be needed to compare groups, so it should be kept if it serves the purpose.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        needed = ["score"]
        record = {"name": "Ada", "score": 91}
        print({field: record[field] for field in needed})
      ` },
      options: [
        { text: "{'name': 'Ada', 'score': 91}", explanation: 'The name is not in the needed list, so it is left out.' },
        { text: "{'score': 91}", explanation: 'Yes. Only the score is kept.' },
        { text: "{'name': 'Ada'}", explanation: 'The name is removed, and the score is kept.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why is consent for one purpose not enough for a different purpose?',
      options: [
        { text: 'Because people agreed to a specific use, and a new use needs to be checked against it', explanation: 'Yes. Consent and purpose are tied together, so a new use may need new agreement.' },
        { text: 'Because data cannot be used at all', explanation: 'Data can be used for approved purposes. The issue is a new purpose that was never agreed to.' },
        { text: 'Because computers are not allowed to read data', explanation: 'Reading data is not the issue. The issue is use outside the agreed purpose.' },
        { text: 'Because consent expires every hour', explanation: 'Consent does not expire on a fixed hourly schedule. It depends on the purpose and the agreement.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Collect only what a project needs, reduce and separate identifying details, use data only for the agreed purpose, and delete it when the retention period ends.',
  resources: [
    { title: 'Privacy and data protection basics', provider: 'ICO (UK)', description: 'Plain guidance on personal data, consent, purpose, and data minimization.', url: 'https://ico.org.uk/' },
    { title: 'Data minimization', provider: 'European Data Protection Supervisor', description: 'An explanation of why collecting less data reduces risk, with examples.', url: 'https://www.edps.europa.eu/' },
  ],
}

export default lesson
