import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe Study Tracker\'s AWS resources in a CloudFormation template with parameters and outputs',
    'Preview a stack update with a change set before applying it',
    'Detect drift in a stack, and decide whether to bring resources back or update the template',
  ],
  bigIdea: 'AWS CloudFormation describes resources in a template, and it keeps the record of every stack it creates. A change set shows exactly what an update would add, change, or replace before it happens. Drift detection finds resources that were changed outside the template, so the team can decide what the correct state is.',
  whyItMatters: 'A team updates Study Tracker\'s database settings in the console during an incident, which fixes the outage. The next routine deployment reverts the change, and the outage returns. A drift check would have shown the console change, and the team could have written it into the template before the next deployment.',
  goalSections: [
    {
      heading: 'Describing a stack',
      paragraphs: [
        'A CloudFormation template has three main parts for this lesson: parameters that vary between environments, resources that describe what to create, and outputs that report values such as the load balancer address. The stack is the running collection of resources that the template created.',
        'Use parameters for values that differ between environments, such as the environment name or the instance size. Never put a password in the template. Use a secrets store and reference it, so the template can be shared and reviewed safely.',
        'Keep the template in version control. Each stack update should come from a reviewed change to the template, so the history explains every difference between one version and the next. Tag the stack with its owner, so the person to ask is always clear. Keep the template and its change sets in the same repository, so the preview and the update stay together. A stack that nobody owns is the one most likely to drift. Review the stack list each month and remove stacks that are no longer used.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Parameters:
            Environment:
              Type: String
              Default: test
          Resources:
            StudyTrackerTable:
              Type: AWS::DynamoDB::Table
              ...
          Outputs:
            TableName:
              Value: !Ref StudyTrackerTable
        `,
      },
    },
    {
      heading: 'Previewing with change sets',
      paragraphs: [
        'A change set is a preview of an update. You create it from the new template, read the list of changes, and only then execute it. Some changes replace a resource, which means a new one is created and the old one is removed, so the replacement must be read carefully.',
        'Look for replacements and deletions first. Replacing a database can lose its data unless a backup or a retention policy is in place. A change set that shows a replacement is a signal to stop and check the data plan.',
        'Execute only the change set you reviewed. If the template changes after review, create a new change set, so the preview matches the update.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          aws cloudformation create-change-set --stack-name study-tracker-test --change-set-name review-1 --template-body file://template.yaml --parameters ParameterKey=Environment,ParameterValue=test
          aws cloudformation describe-change-set --stack-name study-tracker-test --change-set-name review-1
          aws cloudformation execute-change-set --stack-name study-tracker-test --change-set-name review-1
        `,
      },
    },
    {
      heading: 'Drift: changes made outside the template',
      paragraphs: [
        'Drift is a difference between a stack\'s template and the live resources. A security group rule added in the console is drift, and so is a changed instance size. Drift detection checks the stack and reports which resources differ and how.',
        'Decide on each drift item. If the manual change is correct, put it in the template and deploy the template, so the record matches. If it was temporary, bring the resource back to the template\'s state. Either way, write the decision down.',
        'Reduce future drift by limiting console changes to people who can also update the template, and by reviewing drift on a schedule, not only after an incident.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          template = {"table_read_capacity": 5, "backup": True}
          live = {"table_read_capacity": 20, "backup": True}

          for setting in template:
              if template[setting] != live[setting]:
                  print("drift in", setting, "- template:", template[setting], "live:", live[setting])
        `,
        output: 'drift in table_read_capacity - template: 5 live: 20',
      },
    },
  ],
  seeItInAction: {
    title: 'Comparing a stack setting with the live value',
    intro: 'The program above compares each setting in the template with its live value and reports the drift. The incident fix changed the capacity to 20, and the template still says 5. Run it, then update the template to 20 and predict the output.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        template = {"table_read_capacity": 5, "backup": True, "encryption": True}
        live = {"table_read_capacity": 20, "backup": True, "encryption": True}

        drifted = [s for s in template if template[s] != live[s]]
        print("drifted settings:", drifted if drifted else "none")
        print("decision needed:", len(drifted))
      `,
      output: "drifted settings: ['table_read_capacity']\ndecision needed: 1",
    },
    steps: [
      { code: 'drifted = [s for s in template if template[s] != live[s]]', explanation: 'Finds each setting where the template and the live value disagree.' },
      { code: 'print("drifted settings:", ...)', explanation: 'Names the settings, so the decision is about specific values, not a general unease.' },
      { code: 'print("decision needed:", len(drifted))', explanation: 'Counts the decisions still open. Each one must be settled, not left to the next deployment.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a CloudFormation parameter for the environment name and a resource that uses it in its name. Do not put any secret in the template.',
      'Change the template value in the seeItInAction example to 20 and predict the output. Run it to check.',
      'Write the change-set steps you would follow for an update that replaces a database, with the check you would make before executing.',
    ],
  },
  mistakes: [
    { mistake: 'Fixing production in the console and never updating the template.', fix: 'Record the change as drift, then update the template so the next deployment keeps it.' },
    { mistake: 'Executing an update without reading its change set.', fix: 'Read the change set, pay attention to replacements, and execute only what you reviewed.' },
    { mistake: 'Putting passwords in the template.', fix: 'Reference secrets from a secrets store, and keep them out of the template and version control.' },
  ],
  quiz: [
    {
      question: 'Why is a replacement in a change set important to read carefully?',
      options: [
        { text: 'A replaced resource is recreated, which can lose data unless a backup or retention plan exists', explanation: 'Yes. Replacements can destroy data, so they need a deliberate check.' },
        { text: 'Replacements are always faster', explanation: 'Speed is not the concern. Data loss is.' },
        { text: 'Replacements are hidden from the console', explanation: 'They are shown in the change set, which is why they must be read.' },
        { text: 'Replacements cost nothing', explanation: 'Cost is not the main risk. Data loss is.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        template = {"capacity": 5, "backup": True}
        live = {"capacity": 20, "backup": True}
        print([s for s in template if template[s] != live[s]])
      ` },
      options: [
        { text: "['capacity']", explanation: 'Yes. The capacity differs between the template and the live value.' },
        { text: "['backup']", explanation: 'The backup setting matches in both, so it is not drift.' },
        { text: '[]', explanation: 'The capacity differs, so the list is not empty.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'What is the right way to keep an emergency console fix after the incident?',
      options: [
        { text: 'Write the change into the template, review it, and deploy it, so the record matches', explanation: 'Yes. The template becomes the record, and the next deployment keeps the fix.' },
        { text: 'Leave it in the console and hope the next deployment ignores it', explanation: 'A deployment may revert the change, bringing back the incident.' },
        { text: 'Delete the stack and start again', explanation: 'Deleting the stack can destroy data and is rarely the right fix.' },
        { text: 'Turn off drift detection', explanation: 'Drift detection is what reveals the difference, so it should stay on.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Describe Study Tracker\'s AWS resources in a versioned CloudFormation template, preview each update with a change set, and decide on each drifted setting so the template and the stack agree.',
  resources: [
    { title: 'AWS CloudFormation User Guide', provider: 'AWS', description: 'How templates, stacks, and change sets work in CloudFormation.', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html' },
    { title: 'Detect drift on a stack', provider: 'AWS', description: 'How to find resources that have changed outside their CloudFormation template.', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html' },
  ],
}

export default lesson
