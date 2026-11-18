import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { resourceQueryJson, trustEcsTasksJson } from './aws-shared'

const lesson: StructuredLesson = {
  assumes: 'AWS Cloud Engineering overview, signed in as `studyadmin` with `aws sso login`, with a budget set. Set the track variables first.',
  goals: [
    'Read an IAM policy and say exactly what it allows',
    'Apply least privilege by granting only the actions and resources a job needs',
    'Create an IAM role so Study Tracker can reach AWS services without any stored key',
  ],
  bigIdea: "AWS Identity and Access Management, or IAM, decides who can do what. Permissions are written as policies, JSON documents listing allowed actions on specific resources, and attached to users or roles. A role is an identity that a person or service takes on temporarily, which is how Study Tracker will get permissions without a key in its code.",
  whyItMatters: "Study Tracker will need to read notes from S3 and pull its image from a registry. The quick way is to create an access key and paste it into an environment variable. Leaked AWS keys are found by automated scanners within minutes of reaching a public repository, and an over-powerful one lets an attacker run servers on your bill. With a role that can only read one bucket, there is no key to leak and very little to steal.",
  goalSections: [
    {
      heading: 'Policies, actions and resources',
      paragraphs: [
        "An IAM policy is a JSON document made of statements. Each statement has an effect, Allow or Deny, a list of actions such as `s3:GetObject`, and the resources they apply to, written as Amazon Resource Names, or ARNs, unique IDs such as `arn:aws:s3:::study-notes-jd4821/*`.",
        "AWS denies everything by default. A request succeeds only if some policy allows it and no policy explicitly denies it. An explicit Deny always wins, which makes it useful for guardrails.",
        "Policies attach to identities. A user or role with no policies can do nothing at all, which is exactly where Study Tracker's role starts.",
      ],
      example: {
        language: 'text',
        code: code`
          {
            "Version": "2012-10-17",
            "Statement": [{
              "Effect": "Allow",
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::study-notes-jd4821/*"
            }]
          }
          Allows: reading objects in one bucket.  Not: listing other buckets, writing, deleting.
        `,
      },
    },
    {
      heading: 'Least privilege on AWS',
      paragraphs: [
        "Least privilege means each identity gets only the actions and resources its job needs. AWS supplies managed policies for common jobs, such as ReadOnlyAccess, but they are broad. For an app, write your own small policy naming the exact actions and the exact bucket or secret.",
        "AWS has no resource-group scope like Azure. The strongest boundary is the account, so organizations separate teams and environments into different accounts, and the governance lesson shows how. Within an account, policies narrow access by naming specific resources, or by conditions on tags.",
        "In this one-person learning account, `studyadmin` has administrator access, because it builds everything, including roles. In a team, people would get narrower permission sets, and a policy simulator, `aws iam simulate-principal-policy`, lets you test what an identity can do before relying on it.",
      ],
      example: {
        language: 'text',
        code: code`
          Identity                       Gets                                        Where
          studyadmin (you)               AdministratorAccess permission set          this learning account only
          study-tracker-task-role (app)  read notes bucket, read its secrets         added in lessons 3 and 12
          Anyone else                    nothing: AWS denies by default
        `,
      },
    },
    {
      heading: 'Roles for apps',
      paragraphs: [
        "A role has permissions but no password or key. Instead, it has a trust policy that says who may take it on, or assume it. Study Tracker's role trusts `ecs-tasks.amazonaws.com`, so only containers run by Amazon ECS can assume it.",
        "When the app runs, ECS gives it temporary credentials for the role, and the AWS SDK for Python, boto3, finds them automatically. On your laptop the same code uses your `aws sso login` session instead. No key appears in code, environment variables or `.env`.",
        "This lesson also creates a resource group, `study-tracker`. On AWS a resource group is a saved search, here for everything tagged `project=study-tracker`, rather than a container. It gives you one place to see the whole project.",
      ],
      example: {
        language: 'text',
        code: code`
          On your laptop:   boto3 -> your aws sso login session (studyadmin)
          In ECS:           boto3 -> temporary credentials for study-tracker-task-role
          In both:          no access key in code, .env or environment variables
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Creating Study Tracker\'s role and resource group',
    intro: "Run these as `studyadmin`, in the folder where you saved `trust-ecs-tasks.json` and `resource-query.json` from Try it yourself.",
    example: {
      language: 'bash',
      code: code`
        aws iam create-role --role-name study-tracker-task-role --assume-role-policy-document file://trust-ecs-tasks.json --tags Key=project,Value=study-tracker
        aws iam list-attached-role-policies --role-name study-tracker-task-role
        aws iam get-role --role-name study-tracker-task-role --query "Role.AssumeRolePolicyDocument.Statement[0].Principal" --output text

        aws resource-groups create-group --name study-tracker --resource-query file://resource-query.json --tags project=study-tracker
        aws resource-groups list-group-resources --group study-tracker --query "ResourceIdentifiers[].ResourceArn" --output text
      `,
      output: code`
        {
            "AttachedPolicies": []
        }
        ecs-tasks.amazonaws.com
      `,
    },
    steps: [
      { code: '--assume-role-policy-document file://trust-ecs-tasks.json', explanation: "The trust policy: only the ECS tasks service may assume this role. Nobody can sign in as it." },
      { code: '--tags Key=project,Value=study-tracker', explanation: "Tags the role, so it belongs to the project from the start. Different AWS services write tags slightly differently, as the next command shows." },
      { code: 'aws iam list-attached-role-policies --role-name study-tracker-task-role', explanation: "The empty list is the point: the role exists but can do nothing yet. Lesson 3 adds read access to the notes bucket." },
      { code: '--query "Role.AssumeRolePolicyDocument.Statement[0].Principal" --output text', explanation: "Reads back who may assume the role, to confirm it is the ECS tasks service." },
      { code: 'aws resource-groups create-group --name study-tracker --resource-query file://resource-query.json', explanation: "Creates a saved search for everything tagged `project=study-tracker`. The query inside the file is itself JSON written as a string, which is how this API expects it." },
      { code: 'aws resource-groups list-group-resources --group study-tracker', explanation: "Lists the project's resources. Only the role, and the group itself if listed, appear so far. The list grows with each lesson." },
    ],
  },
  tryIt: {
    instructions: [
      'Save the two files below and run the commands above.',
      'Read the example policy in the first section and write in your own words exactly what it allows and what it does not.',
      'In the IAM console, open `study-tracker-task-role` and look at its Trust relationships and Permissions tabs.',
      'Clean up: roles and resource groups cost nothing, so keep them for the next lessons. If you stop the track, delete them with `aws iam delete-role --role-name study-tracker-task-role` and `aws resource-groups delete-group --group study-tracker`.',
    ],
    files: [
      { language: 'text', filename: 'trust-ecs-tasks.json', code: trustEcsTasksJson },
      { language: 'text', filename: 'resource-query.json', code: resourceQueryJson },
    ],
  },
  mistakes: [
    { mistake: 'Giving an app an access key.', fix: 'Give it a role that only the right service can assume, and let AWS supply temporary credentials.' },
    { mistake: 'Attaching broad managed policies to app roles.', fix: 'Write a small policy that names the exact actions and resources the app uses.' },
    { mistake: 'Using `"Resource": "*"` when a specific ARN is known.', fix: 'Name the bucket, secret or table, so the permission cannot reach anything else.' },
    { mistake: 'Forgetting that explicit Deny always wins.', fix: 'Use Deny statements for guardrails, and check for one when an expected permission fails.' },
  ],
  quiz: [
    {
      question: 'A role has one policy allowing `s3:GetObject` on `arn:aws:s3:::study-notes-jd4821/*`. Can it delete an object in that bucket?',
      options: [
        { text: 'Yes, because it has access to the bucket', explanation: 'Access is per action. Only GetObject is allowed.' },
        { text: 'No, because `s3:DeleteObject` is not allowed, and AWS denies anything not allowed', explanation: 'Permissions are opt-in. Deleting needs its own Allow.' },
        { text: 'Yes, if the object is small', explanation: 'Object size has nothing to do with permissions.' },
        { text: 'Only from the console', explanation: 'The console uses the same permissions as the CLI and SDKs.' },
      ],
      answer: 1,
    },
    {
      question: 'What does the trust policy on `study-tracker-task-role` control?',
      options: [
        { text: 'Which S3 buckets the role can read', explanation: 'That is the job of its permission policies, not the trust policy.' },
        { text: 'How long the role exists', explanation: 'Roles exist until deleted. Trust policies say who may use them.' },
        { text: 'Which services or identities may assume the role, here only ECS tasks', explanation: 'The trust policy decides who can take on the role. The permission policies decide what it can then do.' },
        { text: 'Which region the role works in', explanation: 'IAM roles are global within an account.' },
      ],
      answer: 2,
    },
    {
      question: 'One policy allows `s3:*` on a bucket. Another policy on the same role explicitly denies `s3:DeleteObject`. Can the role delete objects?',
      options: [
        { text: 'No, because an explicit Deny always overrides an Allow', explanation: 'AWS evaluates all policies, and any explicit Deny wins.' },
        { text: 'Yes, because the Allow covers all S3 actions', explanation: 'An Allow never overrides an explicit Deny.' },
        { text: 'Yes, because the Allow was attached first', explanation: 'Order does not matter in IAM evaluation.' },
        { text: 'It depends on the region', explanation: 'Policy evaluation is the same in every region.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Write small IAM policies that name exact actions and resources, remember that AWS denies by default and explicit Deny always wins, and give apps roles with trust policies instead of access keys.',
  resources: [
    { title: 'Policies and permissions in IAM', provider: 'AWS Documentation', description: 'How policies are written and evaluated.', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html' },
    { title: 'IAM roles', provider: 'AWS Documentation', description: 'Trust policies and how services assume roles.', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html' },
    { title: 'Amazon ECS task IAM role', provider: 'AWS Documentation', description: 'How containers get temporary credentials for a role.', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html' },
    { title: 'What are resource groups?', provider: 'AWS Documentation', description: 'Grouping resources by tags across services.', url: 'https://docs.aws.amazon.com/ARG/latest/userguide/resource-groups.html' },
  ],
  underTheHood: {
    heading: 'How AWS decides whether to allow a request',
    paragraphs: [
      "Every AWS request carries the identity making it, the action and the resource. AWS then gathers every policy that could apply: the identity's own policies, any policy on the resource itself, such as an S3 bucket policy, and organization-wide guardrails if the account belongs to an organization.",
      "The evaluation follows a fixed order. If any applicable policy has an explicit Deny matching the request, the answer is no, immediately. Otherwise, if at least one policy has a matching Allow, the answer is yes. If nothing matches at all, the answer is no, the implicit deny.",
      "This is why a role with no policies is safe to create, and why the most reliable way to block something everywhere is an explicit Deny. It also explains a common puzzle: a request can fail even though you can see an Allow for it, because a Deny somewhere else, often in an organization guardrail, quietly wins.",
    ],
  },
}

export default lesson
