import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { cfnTemplate } from './study-tracker'

const architectureDiagram = code`
  Internet
     | HTTPS
  Express Mode load balancer -> study-tracker service (ECS on Fargate, 1 to 2 tasks)
     |  public subnets 10.0.0.0/24, 10.0.1.0/24          roles: execution (image, logs, one secret)
     |                                                          task (read the notes bucket)
     |-- port 5432 only --> study-tracker-db (RDS PostgreSQL, private subnets, encrypted, 7-day backups)
     |-- HTTPS ----------> notes bucket (S3, versioned, public access blocked)
     |-- at start-up ----> Secrets Manager: study-tracker/database-url, study-tracker/db-password
     |-- image pull -----> ECR repository study-tracker
  Logs -> /ecs/study-tracker (CloudWatch, 30 days) | Alarm: >5 server errors in 5 min -> email
  Every resource tagged project=study-tracker | Budget alert on the account
`

const lesson: StructuredLesson = {
  assumes: 'all 15 earlier AWS lessons, Docker Desktop, and the architecture lessons System Design and Architecture Decision Records. Set the track variables plus `REGISTRY`, `ACCOUNT` and `SERVICE_ARN`.',
  goals: [
    'Describe Study Tracker\'s whole AWS architecture in one diagram and one decision record',
    'Deploy the whole architecture from one CloudFormation template, as many times as you like',
    'Prove the deployment meets its requirements, then remove everything cleanly',
  ],
  bigIdea: "Infrastructure as code, or IaC, describes every cloud resource in files kept with the app, so the whole system can be created, reviewed, changed and deleted by running them, as the Foundations lesson introduced. The capstone rebuilds the Study Tracker you assembled by hand in the earlier lessons from one AWS CloudFormation template, a YAML file that lists every resource. If you can delete everything and recreate it in minutes, you truly own the system.",
  whyItMatters: "Ask a team that built its AWS setup by hand to recreate it in a second account for production, and the answer is usually weeks of console screenshots, guessed settings and surprises nobody wrote down. A system described in a template can be rebuilt by anyone, reviewed in a pull request before it changes, and checked for drift against what is actually running. That, with the diagram and decision record, turns a working project into a portfolio piece an employer can trust.",
  goalSections: [
    {
      heading: 'The architecture on one page',
      paragraphs: [
        "Start by drawing what you built. A good architecture diagram shows each component, where it sits in the network, how traffic flows and how each connection is protected. Below is Study Tracker's, as a text diagram you can put in your README or redraw in a diagram tool.",
        "Then write at least one architecture decision record, as in Architecture Decision Records, for a choice this track made. Good candidates are ECS Express Mode instead of EKS, RDS instead of SQLite, or signing Bedrock requests with the task role instead of using an API key. Include the options you rejected and when to revisit the decision.",
        "Together, the diagram and the records let a reviewer understand in five minutes both what the system is and why it is that way.",
      ],
      example: { language: 'text', code: architectureDiagram },
    },
    {
      heading: 'CloudFormation in practice',
      paragraphs: [
        "A template lists resources, each with a type and properties. `!Ref` and `!GetAtt` connect them, such as the database security group allowing the app's group, and CloudFormation works out the order to create them. Everything the template creates belongs to one stack, `study-tracker`, which you update or delete as a unit.",
        "The template never contains a password. Secrets Manager generates one, and `{{resolve:secretsmanager:...}}` passes it to the database and into the database URL at deploy time, without CloudFormation storing or logging the value.",
        "The app needs an image that does not exist until the repository does, so the template deploys in two passes. The first creates everything except the app, you push the image, and the second, with `DeployApp=true`, adds the app and its alarm. The weekly summary function and the Bedrock settings are left out to keep the template readable, and adding them is a good stretch goal.",
      ],
      example: {
        language: 'text',
        code: code`
          Repository:
            Type: AWS::ECR::Repository
            Properties:
              RepositoryName: study-tracker
              EmptyOnDelete: true
              Tags: [{ Key: project, Value: study-tracker }]
        `,
      },
    },
    {
      heading: 'Proving it, then cleaning up',
      paragraphs: [
        "Finished means each requirement from this track has evidence you can show, not just a belief that it works. Turn the requirements into a checklist, and next to each one write the command or screen that proves it.",
        "Some proof takes action: a restore drill from Resilience and Disaster Recovery, an alarm email triggered on purpose, a note brought back from a delete marker. Record the results, with dates and times, in your repository.",
        "Then clean up completely. Deleting the stack removes everything it created, in the right order. CloudFormation cannot delete a bucket that still holds objects, so empty the notes bucket first. The repository's `EmptyOnDelete` setting removes its images for you.",
      ],
      example: {
        language: 'text',
        code: code`
          Requirement              Evidence
          Built from code          template.yaml in the repository, two deployments succeed
          Database private         describe-db-instances shows PubliclyAccessible False
          Secrets managed          the service's secrets point at Secrets Manager ARNs
          Monitoring and alarms    alarm email received after triggering 503s
          Backups tested           restore drill runbook with measured times
          Tagged                   every stack resource carries project=study-tracker
          Within budget            Cost Explorer below the budget, no budget alerts
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying Study Tracker from CloudFormation',
    intro: "Run these as `studyadmin` from your `study-tracker` folder, with `template.yaml` from Try it yourself, after retiring the hand-built resources as the guide's first step explains. Use your own email address. The tags in the template also satisfy the project tag guardrail from lesson 14.",
    example: {
      language: 'bash',
      code: code`
        cfn-lint template.yaml
        aws cloudformation deploy --stack-name study-tracker --template-file template.yaml --capabilities CAPABILITY_IAM --parameter-overrides AlertEmail=you@example.com --tags project=study-tracker --no-execute-changeset
        aws cloudformation deploy --stack-name study-tracker --template-file template.yaml --capabilities CAPABILITY_IAM --parameter-overrides AlertEmail=you@example.com --tags project=study-tracker

        aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REGISTRY
        docker build --platform linux/amd64 -t $REGISTRY/study-tracker:v4 .
        docker push $REGISTRY/study-tracker:v4

        aws cloudformation deploy --stack-name study-tracker --template-file template.yaml --capabilities CAPABILITY_IAM --parameter-overrides DeployApp=true --tags project=study-tracker
        aws cloudformation describe-stacks --stack-name study-tracker --query "Stacks[0].Outputs[?OutputKey=='AppUrl'].OutputValue" --output text
      `,
      output: 'https://st-0123456789abcdef.ecs.us-east-1.on.aws',
    },
    steps: [
      { code: 'cfn-lint template.yaml', explanation: "AWS's linter checks every resource and property against CloudFormation's schemas before anything reaches AWS. Install it with `python -m pip install cfn-lint`. The template passed it with no errors or warnings while this lesson was written." },
      { code: '--capabilities CAPABILITY_IAM', explanation: "Confirms you know the template creates IAM roles. CloudFormation refuses to create roles without it." },
      { code: '--no-execute-changeset', explanation: "Creates a change set, a list of everything that would be created, changed or replaced, without doing any of it. Review it with the `describe-change-set` command CloudFormation prints, then run the deploy again without this flag." },
      { code: 'aws cloudformation deploy ... --tags project=study-tracker', explanation: "The first pass: network, buckets, repository, logs, secrets, database, roles and the alarm topic. The database takes the longest, often ten minutes. Confirm the email from SNS when it arrives." },
      { code: '--parameter-overrides DeployApp=true --tags project=study-tracker', explanation: "The second pass adds the app and its alarm. `AlertEmail` keeps its earlier value. Pass the tags every time, because a deploy without them removes the stack's tags." },
      { code: "--query \"Stacks[0].Outputs[?OutputKey=='AppUrl'].OutputValue\"", explanation: "Prints the app's address from the template's outputs. Open it followed by `/docs`. Yours will differ from the example." },
    ],
  },
  tryIt: {
    instructions: [
      'Work through the guided build below, using `template.yaml` from this lesson.',
      'Fill in the evidence checklist with real command output and dates, and commit it with the diagram and your decision record.',
      'Finish with the clean-up step and confirm in the console that nothing tagged `project=study-tracker` remains.',
    ],
    files: [{ language: 'text', filename: 'template.yaml', code: cfnTemplate }],
    project: {
      goal: 'Rebuild Study Tracker on AWS from one CloudFormation template, prove every requirement from the track with evidence, document it with a diagram and a decision record, then delete everything.',
      prerequisites: ['All 15 earlier AWS lessons.', 'The AWS CLI signed in as `studyadmin`, Docker Desktop, and the Study Tracker repository with the PostgreSQL-ready code from lesson 9.'],
      setup: ['Set the track variables, plus `REGISTRY`, `ACCOUNT` and `SERVICE_ARN`.', 'Save `template.yaml` in your repository and install cfn-lint with `python -m pip install cfn-lint`.'],
      files: [
        { path: 'template.yaml', purpose: 'Every Study Tracker resource, tagged, in one template.' },
        { path: 'docs/architecture.md', purpose: 'The architecture diagram and a short description of each component.' },
        { path: 'docs/adr/0001-*.md', purpose: 'At least one architecture decision record.' },
        { path: 'docs/evidence.md', purpose: 'The requirements checklist with command output and dates.' },
      ],
      dependencies: ['AWS CLI version 2', 'python -m pip install cfn-lint', 'Docker Desktop'],
      steps: [
        { title: 'Retire the hand-built version', instructions: ['Save the list of what you built by hand, with `aws resourcegroupstaggingapi get-resources --tag-filters Key=project,Values=study-tracker --query "ResourceTagMappingList[].ResourceARN"`, in `docs/evidence.md`.', 'Delete the hand-built resources that cost money or whose names the template reuses. The secret is deleted without a recovery window so its name is free straight away.', 'The old VPC, buckets and roles cost nothing or very little, and the final step removes them.'], commands: ['aws ecs delete-express-gateway-service --service-arn $SERVICE_ARN', 'aws scheduler delete-schedule --name study-tracker-weekly', 'aws lambda delete-function --function-name study-tracker-weekly-summary', 'aws rds delete-db-instance --db-instance-identifier study-tracker-db --skip-final-snapshot --delete-automated-backups', 'aws secretsmanager delete-secret --secret-id study-tracker/database-url --force-delete-without-recovery', 'aws ecr delete-repository --repository-name study-tracker --force', 'aws logs delete-log-group --log-group-name /ecs/study-tracker', 'aws cloudwatch delete-alarms --alarm-names study-tracker-5xx', 'aws sns delete-topic --topic-arn arn:aws:sns:us-east-1:$ACCOUNT:study-tracker-alerts', 'aws rds wait db-instance-deleted --db-instance-identifier study-tracker-db'], checkpoint: '`aws rds describe-db-instances --query "DBInstances[].DBInstanceIdentifier"` prints an empty list.' },
        { title: 'Check the template', instructions: ['Lint the template and fix anything cfn-lint reports.', 'Read through each resource and match it to the lesson that introduced it.'], commands: ['cfn-lint template.yaml'], checkpoint: 'cfn-lint prints nothing and exits with status 0.' },
        { title: 'First deployment', instructions: ['Create and review a change set, then deploy, as in See it in action.', 'Confirm the SNS subscription email.'], commands: ['aws cloudformation deploy --stack-name study-tracker --template-file template.yaml --capabilities CAPABILITY_IAM --parameter-overrides AlertEmail=you@example.com --tags project=study-tracker'], checkpoint: '`aws cloudformation describe-stacks --stack-name study-tracker --query "Stacks[0].StackStatus"` shows `CREATE_COMPLETE`.' },
        { title: 'Image, notes and second deployment', instructions: ['Push the image to the new repository and deploy again with `DeployApp=true`.', 'Upload your notes to the new bucket, using the bucket name from the stack outputs. Open the app\'s `/docs` and save a session.'], commands: ['docker push $REGISTRY/study-tracker:v4', 'aws cloudformation deploy --stack-name study-tracker --template-file template.yaml --capabilities CAPABILITY_IAM --parameter-overrides DeployApp=true --tags project=study-tracker', 'aws s3 cp notes s3://REPLACE-WITH-NotesBucketName/ --recursive'], checkpoint: 'The app answers at its address, and a saved session is still there after forcing a new deployment.' },
        { title: 'Collect the evidence', instructions: ['For each requirement in the checklist, run the proving command and paste its output with the date.', 'Trigger the error alarm with repeated 503s, and repeat the restore drill from lesson 13 against the new database.'], checkpoint: 'Every line of the checklist has real evidence.' },
        { title: 'Diagram and decision record', instructions: ['Add the architecture diagram to `docs/architecture.md`, adjusted to what you deployed.', 'Write at least one decision record in `docs/adr/`, with options, consequences and a revisit trigger.'], checkpoint: 'A reviewer could explain the system and one key decision after five minutes of reading.' },
        { title: 'Clean up', instructions: ['Empty the stack\'s notes bucket with Empty in the S3 console, which removes every version, then delete the stack.', 'In the console, delete the old hand-built VPC (Delete VPC removes its subnets, gateway and security groups too), the old buckets after emptying them, the old IAM roles, the resource group and the analyzer.', 'Check Cost Explorer over the next two days to confirm spending stops. Keep the budget and the guardrail if you plan to keep the account.'], commands: ['aws cloudformation delete-stack --stack-name study-tracker', 'aws cloudformation wait stack-delete-complete --stack-name study-tracker'], checkpoint: '`aws resourcegroupstaggingapi get-resources --tag-filters Key=project,Values=study-tracker` lists nothing that still costs money, and Cost Explorer shows no new costs.' },
      ],
      verification: [
        'The whole system was created from `template.yaml`, in two deployments, with no manual resource creation.',
        'The database has no public access, and the app reads its URL from Secrets Manager.',
        'An alarm email arrived after deliberately causing server errors.',
        'A restore drill was completed and timed.',
        'Every resource carried the `project=study-tracker` tag, and costs stayed within the budget.',
        'The diagram, decision record and evidence are committed, and the stack and old resources have been deleted.',
      ],
      nextSteps: [
        'Add the weekly summary function, its schedule and the Bedrock permission and settings to the template.',
        'Deploy the stack from GitHub Actions on every merge, using an IAM role that GitHub assumes through OpenID Connect instead of stored keys.',
        'Build the same system on Azure or Google Cloud with that track, and compare.',
      ],
    },
  },
  mistakes: [
    { mistake: 'Changing resources in the console after deploying from a template.', fix: 'Change the template and redeploy. Console changes drift from the code, and CloudFormation\'s drift detection will report them.' },
    { mistake: 'Putting a password in the template or a parameter file.', fix: 'Let Secrets Manager generate it and pass it with a `{{resolve:secretsmanager:...}}` dynamic reference.' },
    { mistake: 'Deploying without reviewing the change set.', fix: 'Create one with `--no-execute-changeset` first. It shows replacements, which can delete and recreate a resource, before they happen.' },
    { mistake: 'Calling it finished without evidence.', fix: 'Prove each requirement with output you can show, and commit it next to the code.' },
  ],
  quiz: [
    {
      question: 'Someone raised the service\'s maximum tasks in the console. You change something else in `template.yaml` and redeploy. The template still says `MaxTaskCount: 2`. What should you expect?',
      options: [
        { text: 'The console change is copied into your template file', explanation: 'CloudFormation never edits your files.' },
        { text: 'The deployment applies the template, so the setting can return to 2, and drift detection would have shown the difference first', explanation: 'The template describes the desired state. Changes belong in the file, not the console.' },
        { text: 'CloudFormation asks which value to keep', explanation: 'Deployments do not ask. A change set and drift detection are how you find out in advance.' },
        { text: 'The stack is deleted because it no longer matches', explanation: 'Drift never deletes a stack.' },
      ],
      answer: 1,
    },
    {
      question: 'Why is Study Tracker deployed in two passes?',
      options: [
        { text: 'CloudFormation can only create 20 resources at a time', explanation: 'There is no such limit for a stack like this.' },
        { text: 'The database must be created in its own stack', explanation: 'It is created with everything else in the first pass.' },
        { text: 'Each pass uses a different region', explanation: 'Both passes update the same stack in the same region.' },
        { text: 'The app needs an image in the repository, and the repository is created by the first pass', explanation: 'The first pass creates the repository, you push the image, and the second pass creates the app that uses it.' },
      ],
      answer: 3,
    },
    {
      question: 'How does the database get its password in this template?',
      options: [
        { text: 'Secrets Manager generates it, and a dynamic reference passes it to RDS at deploy time', explanation: 'The value never appears in the template, the command line or CloudFormation\'s logs.' },
        { text: 'You type it as a parameter on the command line', explanation: 'The template has no password parameter at all.' },
        { text: 'It is written in the template in plain text', explanation: 'That would put the password in your Git history.' },
        { text: 'RDS creates a database without a password', explanation: 'RDS always requires a master password or another sign-in method.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Describe the whole system in a template, review a change set before every deployment, keep passwords out of it with Secrets Manager, prove every requirement with evidence and document the design and its decisions, so that you can delete everything and rebuild it with confidence.',
  resources: [
    { title: 'What is AWS CloudFormation?', provider: 'AWS Documentation', description: 'Templates, stacks and how CloudFormation creates resources.', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html' },
    { title: 'Update stacks using change sets', provider: 'AWS Documentation', description: 'Previewing changes, including replacements, before deploying.', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html' },
    { title: 'Secrets Manager dynamic references', provider: 'AWS Documentation', description: 'Passing secrets into resources without storing them in the template.', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references-secretsmanager.html' },
    { title: 'cfn-lint', provider: 'AWS CloudFormation on GitHub', description: 'The linter used in this lesson, with editor plugins.', url: 'https://github.com/aws-cloudformation/cfn-lint' },
  ],
  underTheHood: {
    heading: 'How CloudFormation decides what to do',
    paragraphs: [
      "When you deploy, CloudFormation compares the new template with the one the stack last used, resource by resource, using each resource's logical name, such as `Database`. A new name means create, a missing name means delete, and a changed property means update.",
      "Each property's documentation says how it updates. Some change in place with no interruption, such as a tag. Some cause a short interruption, such as resizing an instance. Some require replacement: CloudFormation creates a new resource, moves references to it and deletes the old one. Changing the database's identifier would replace it, which is why change sets list replacements so clearly.",
      "It builds a dependency graph from every `!Ref` and `!GetAtt`, creates independent resources in parallel and waits for dependencies. If any step fails, it rolls back to the last working state, so a stack is never left half-updated. Deleting walks the same graph in reverse. That is how one template safely creates and removes twenty-six connected resources.",
    ],
  },
}

export default lesson
