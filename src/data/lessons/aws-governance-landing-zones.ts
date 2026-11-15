import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { awsTagLoopPowerShell, requireProjectTagPolicyJson } from './aws-shared'

const lesson: StructuredLesson = {
  assumes: 'AWS resilience and disaster recovery, with Study Tracker\'s resources tagged `project=study-tracker`, and AWS identity and resource organization for roles and the `study-tracker` resource group. Set the track variables first.',
  goals: [
    'Use tags and naming rules so every resource says what it is for and who owns it',
    'Add a guardrail that denies creating resources without a project tag',
    'Explain how AWS Organizations, service control policies and landing zones organize many accounts',
  ],
  bigIdea: "Governance means setting rules for a whole cloud estate and making sure they are followed automatically. Tags label resources with facts such as project and owner, and deny rules in IAM refuse requests that break your rules before anything is created. At larger scale, AWS Organizations applies the same rules to many accounts at once.",
  whyItMatters: "Picture an organization a year after moving to AWS: forty accounts, a bill that keeps growing, and three Lambda functions called `test-final` that nobody will admit to owning, so nobody dares delete them. Every unlabeled resource is money and risk with no name attached. Tags answer who owns it and why it exists, and guardrails make sure the next resource is labeled from the start instead of relying on everyone remembering.",
  goalSections: [
    {
      heading: 'Tags and naming',
      paragraphs: [
        "A tag is a key and value attached to a resource, such as `project=study-tracker`. Resource groups find every resource with a tag, and the bill can be split by tag once you activate the tag key as a cost allocation tag in Billing. Agree a small, fixed set of tags and use them everywhere: Study Tracker uses `project`, `environment` and `owner`.",
        "Every lesson in this track has tagged its resources with `project` as it created them. The Resource Groups Tagging API, `aws resourcegroupstaggingapi`, can add the other two to all of them in one loop, and it reports any resource it could not tag, which you then tag with that service's own command, such as `aws iam tag-role`.",
        "A naming convention does the same job in names. This track names things after the project, `study-tracker-...`, and adds your suffix where names must be unique worldwide, such as S3 buckets.",
      ],
      example: {
        language: 'text',
        code: code`
          Tag            Example           Answers
          project        study-tracker     what is this for? (and cost per project)
          environment    learning          is it safe to delete? (dev, test, prod)
          owner          studyadmin        who do I ask before changing it?

          Names: study-tracker-db, study-tracker-task-role, study-tracker-weekly-summary,
                 study-notes-jd4821 (buckets need your suffix)
        `,
      },
    },
    {
      heading: 'A guardrail that requires the project tag',
      paragraphs: [
        "Many AWS actions accept tags as part of the create request and let a policy check them with the condition key `aws:RequestTag/project`. A Deny statement with the condition `Null` set to `true` refuses the request when that tag is missing. An explicit deny always wins over any allow, even AdministratorAccess.",
        "This lesson adds the rule to `studyadmin`'s permission set as an inline policy, for three actions this track uses: creating secrets, ECR repositories and Lambda functions. Every other action works as before, and the rule can grow to more actions once it has proved itself.",
        "There is an honest limit: `studyadmin` is an administrator, so it could remove its own guardrail. In a team, the same rule lives where builders cannot change it, which the next section explains.",
      ],
      example: {
        language: 'text',
        code: code`
          Request: secretsmanager:CreateSecret, no tags
            AdministratorAccess      Allow *
            RequireProjectTag        Deny, because aws:RequestTag/project is missing
          Result: AccessDeniedException, "with an explicit deny in an identity-based policy"
        `,
      },
    },
    {
      heading: 'Organizations and landing zones',
      paragraphs: [
        "Organizations rarely use one AWS account. They separate environments, such as development and production, and teams into different accounts, so costs, access and mistakes stay contained. AWS Organizations groups accounts into organizational units, or OUs, arranged in a tree.",
        "A service control policy, or SCP, attached to an OU sets the most that any identity in its accounts may do, administrators included, and nobody inside those accounts can remove it. The tag rule from this lesson, written as an SCP, would bind every account in the OU. SCPs never apply to the management account, the one that owns the organization, which is why that account should hold no workloads.",
        "A landing zone is an account set up correctly before a team moves in: identity, networking, logging, budgets and guardrails already in place. AWS Control Tower builds and manages a landing zone on top of Organizations. You have built a tiny one yourself in this track.",
      ],
      example: {
        language: 'text',
        code: code`
          Root (management account: billing and Identity Center only)
            Security OU          log archive, audit accounts
            Workloads OU         SCP: require project tag, allowed regions only
              Production OU      SCP: deny public databases
                study-tracker-prod   account
              Development OU
                study-tracker-dev    account
            Sandbox OU           experiments, strict budgets
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Tagging Study Tracker and requiring the project tag',
    intro: "Run these as `studyadmin`. Save `require-project-tag.json` from Try it yourself first. If you have more than one permission set, `PS_ARN` must be the AdministratorAccess one: check with `aws sso-admin describe-permission-set`. The PowerShell version of the tag loop is in Try it yourself.",
    example: {
      language: 'bash',
      code: code`
        for ARN in $(aws resourcegroupstaggingapi get-resources --tag-filters Key=project,Values=study-tracker --query "ResourceTagMappingList[].ResourceARN" --output text); do
          aws resourcegroupstaggingapi tag-resources --resource-arn-list "$ARN" --tags environment=learning,owner=studyadmin --query "FailedResourcesMap" --output text
        done

        INSTANCE_ARN=$(aws sso-admin list-instances --query "Instances[0].InstanceArn" --output text)
        PS_ARN=$(aws sso-admin list-permission-sets --instance-arn $INSTANCE_ARN --query "PermissionSets[0]" --output text)
        aws sso-admin put-inline-policy-to-permission-set --instance-arn $INSTANCE_ARN --permission-set-arn $PS_ARN --inline-policy file://require-project-tag.json
        aws sso-admin provision-permission-set --instance-arn $INSTANCE_ARN --permission-set-arn $PS_ARN --target-type ALL_PROVISIONED_ACCOUNTS --query "PermissionSetProvisioningStatus.Status" --output text

        aws secretsmanager create-secret --name study-tracker/untagged-test --secret-string placeholder
      `,
      output: code`
        IN_PROGRESS
        An error occurred (AccessDeniedException) when calling the CreateSecret operation: User: arn:aws:sts::123456789012:assumed-role/AWSReservedSSO_AdministratorAccess_0123456789abcdef/studyadmin is not authorized to perform: secretsmanager:CreateSecret on resource: study-tracker/untagged-test with an explicit deny in an identity-based policy
      `,
    },
    steps: [
      { code: 'aws resourcegroupstaggingapi get-resources --tag-filters Key=project,Values=study-tracker', explanation: "Lists the ARN of every resource tagged with the project, the same set the resource group shows." },
      { code: 'tag-resources ... --tags environment=learning,owner=studyadmin', explanation: "Adds the two new tags and keeps existing ones. It prints nothing when it succeeds, and the resource and error when it fails." },
      { code: 'put-inline-policy-to-permission-set ... --inline-policy file://require-project-tag.json', explanation: "Adds the Deny rule to the permission set, alongside AdministratorAccess." },
      { code: 'provision-permission-set ... --target-type ALL_PROVISIONED_ACCOUNTS', explanation: "Pushes the change to the role Identity Center created for `studyadmin` in your account. It takes a few seconds, and starts as `IN_PROGRESS`." },
      { code: 'explicit deny in an identity-based policy', explanation: "The test: the untagged secret is refused before it exists. If it was created because provisioning had not finished, delete it and try again." },
    ],
  },
  tryIt: {
    instructions: [
      'Save `require-project-tag.json` below. Tag everything with the loop above, then check with `aws resourcegroupstaggingapi get-resources --tag-filters Key=owner,Values=studyadmin --query "length(ResourceTagMappingList)"`.',
      'Add the guardrail and try the untagged secret. Then add `--tags Key=project,Value=study-tracker` and see it succeed, and delete it with `aws secretsmanager delete-secret --secret-id study-tracker/untagged-test --force-delete-without-recovery`.',
      'Activate the tag for billing with `aws ce update-cost-allocation-tags-status --cost-allocation-tags-status TagKey=project,Status=Active`. After about a day, filter Cost Explorer by the tag `project` and check it shows the whole project.',
      'Clean up: tags and inline policies cost nothing, so keep them. If you stop the track, remove the guardrail with `aws sso-admin delete-inline-policy-from-permission-set` and the same instance and permission set ARNs, then provision again.',
    ],
    files: [
      { language: 'text', filename: 'require-project-tag.json', code: requireProjectTagPolicyJson },
      { language: 'text', filename: 'PowerShell version of the tag loop', code: awsTagLoopPowerShell },
    ],
  },
  mistakes: [
    { mistake: 'Letting every team invent its own tags.', fix: 'Agree a short, fixed list of tag keys and values, and require the important ones with a guardrail.' },
    { mistake: 'Expecting tags to appear in the bill straight away.', fix: 'Activate them as cost allocation tags first. Costs are grouped by tag only from then on.' },
    { mistake: 'Denying many actions at once without testing.', fix: 'Start with a few actions, test them, then extend the list.' },
    { mistake: 'Running workloads in the management account.', fix: 'SCPs never apply there. Keep it for billing and identity, and put workloads in member accounts.' },
  ],
  quiz: [
    {
      question: '`studyadmin` has AdministratorAccess and the RequireProjectTag deny. It runs `aws ecr create-repository --repository-name demo` with no tags. What happens?',
      options: [
        { text: 'It succeeds, because AdministratorAccess allows everything', explanation: 'An explicit deny overrides any allow.' },
        { text: 'It fails with AccessDeniedException, because the project tag is missing from the request', explanation: 'The condition sees no `aws:RequestTag/project`, so the deny applies.' },
        { text: 'It succeeds, and AWS adds the project tag automatically', explanation: 'AWS never adds your tags for you.' },
        { text: 'It fails because ECR repositories cannot be tagged', explanation: 'They can, with `--tags Key=project,Value=study-tracker`.' },
      ],
      answer: 1,
    },
    {
      question: 'Your organization attaches an SCP to the Workloads OU that denies creating untagged secrets. Which identity can still create one without tags?',
      options: [
        { text: 'An administrator in a production account under that OU', explanation: 'SCPs limit everyone in the accounts they cover, administrators included.' },
        { text: 'A Lambda function\'s role in a development account under that OU', explanation: 'Roles in those accounts are limited too.' },
        { text: 'Nobody, in any account in the organization', explanation: 'The management account is never limited by SCPs.' },
        { text: 'An administrator in the management account', explanation: 'SCPs do not apply to the management account, which is why it should hold no workloads.' },
      ],
      answer: 3,
    },
    {
      question: 'You tag every resource with `project=study-tracker`, but Cost Explorer cannot group costs by `project`. What is missing?',
      options: [
        { text: 'Activating `project` as a cost allocation tag in Billing', explanation: 'User-defined tags appear in cost reports only after activation, and only from then on.' },
        { text: 'A resource group for the project', explanation: 'Resource groups find resources. They do not change the bill.' },
        { text: 'An SCP that requires the tag', explanation: 'That would enforce the tag, not report on it.' },
        { text: 'Tagging the account itself', explanation: 'Cost grouping by tag uses tags on resources.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Agree a few tags and tag everything, deny untagged creation with a rule that even administrators cannot skip, and at scale put those rules in SCPs over OUs, with the management account kept free of workloads.',
  resources: [
    { title: 'Tagging best practices', provider: 'AWS Whitepaper', description: 'Choosing tag keys, naming and enforcing them.', url: 'https://docs.aws.amazon.com/whitepapers/latest/tagging-best-practices/tagging-best-practices.html' },
    { title: 'Controlling access with tags', provider: 'AWS Documentation', description: 'The `aws:RequestTag` condition and other tag-based rules.', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_tags.html' },
    { title: 'Service control policies', provider: 'AWS Documentation', description: 'How SCPs limit accounts in an organization, and what they never affect.', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html' },
    { title: 'What is AWS Control Tower?', provider: 'AWS Documentation', description: 'Setting up and governing a multi-account landing zone.', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html' },
  ],
  underTheHood: {
    heading: 'How AWS decides allow or deny',
    paragraphs: [
      "Every AWS request is evaluated against all the policies that apply to it. AWS starts from an implicit deny: nothing is allowed unless something allows it.",
      "It then checks for explicit denies first. If any applicable policy, whether an SCP, a permissions boundary, an identity policy or a resource policy, has a Deny statement matching the request, the answer is deny, and nothing else is considered. That is why the tag rule beats AdministratorAccess.",
      "If there is no explicit deny, every layer that limits access must allow the request. An SCP over the account must allow it, any permissions boundary must allow it, and an identity policy or resource policy must grant it. Missing any one of these leaves the implicit deny in place.",
      "This order explains the error messages you see: `with an explicit deny in an identity-based policy` names the layer that said no, while `because no identity-based policy allows` means nothing granted it. Reading which one you got tells you where to look.",
    ],
  },
}

export default lesson
