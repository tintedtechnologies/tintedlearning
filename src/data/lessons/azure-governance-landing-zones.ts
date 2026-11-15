import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { policyParamsJson, tagLoopPowerShell } from './azure-shared'

const lesson: StructuredLesson = {
  assumes: 'Azure resilience and disaster recovery, with Study Tracker\'s resources in `rg-study-tracker`, and Azure identity and resource organization for roles and scopes. Set the track variables first.',
  goals: [
    'Use tags and naming rules so every resource says what it is for and who owns it',
    'Apply an Azure Policy that blocks resources breaking a rule',
    'Explain how management groups and landing zones organize many teams and environments',
  ],
  bigIdea: "Governance means setting rules for a whole cloud estate and making sure they are followed automatically. Tags label resources with facts such as project and owner, and Azure Policy checks every new or changed resource against rules, blocking the ones that break them. At larger scale, management groups and landing zones apply the same rules to many subscriptions at once.",
  whyItMatters: "Picture an organization a year after moving to the cloud: hundreds of resources, a growing bill, and a database called `test2` that nobody will admit to owning, so nobody dares delete it. Every unlabeled resource is money and risk with no name attached. Tags answer who owns it and why it exists, and policies make sure the next resource is labeled from the start instead of relying on everyone remembering.",
  goalSections: [
    {
      heading: 'Tags and naming',
      paragraphs: [
        "A tag is a name and value attached to a resource, such as `project=study-tracker`. Cost analysis can group costs by tag, and searches can find every resource of a project across resource groups. Agree a small, fixed set of tags and use them everywhere: Study Tracker uses `project`, `environment` and `owner`.",
        "Tags on a resource group are not automatically copied to the resources inside it, so tag each resource. The commands in this lesson tag everything already in `rg-study-tracker` in one loop.",
        "A naming convention does the same job in names. This track has followed one from the start: a short prefix for the resource type, then the project, plus `SUFFIX` where names must be unique worldwide, such as `rg-study-tracker`, `kv-study-jd4821` and `ca-study-tracker`.",
      ],
      example: {
        language: 'text',
        code: code`
          Tag            Example           Answers
          project        study-tracker     what is this for? (and cost per project)
          environment    learning          is it safe to delete? (dev, test, prod)
          owner          studyadmin        who do I ask before changing it?

          Prefixes: rg- resource group, st storage, kv- key vault, ca- container app,
                    psql- PostgreSQL, func- function app, id- managed identity
        `,
      },
    },
    {
      heading: 'Azure Policy',
      paragraphs: [
        "An Azure Policy definition is a rule, such as \"resources must have a tag called project\" or \"resources may only be created in these regions\". Assigning it to a scope, such as a resource group, makes it apply there. Azure has hundreds of built-in definitions, and you can write your own.",
        "Each definition has an effect. Deny blocks a request that breaks the rule, before anything is created. Audit allows it but marks the resource as non-compliant in a report. Some effects can even fix resources automatically, such as adding a missing tag.",
        "Assigning policies needs its own permission, which Contributor does not include. That is deliberate: the people who set the rules are often not the people who build with them. In this track your sign-up account assigns the policy, and `studyadmin` then lives under it.",
      ],
      example: {
        language: 'text',
        code: code`
          Assignment require-project-tag
            definition   Require a tag on resources (built in, effect: deny)
            parameter    tagName = project
            scope        rg-study-tracker
          Result: creating a resource without a project tag here fails with
                  RequestDisallowedByPolicy, before anything is created
        `,
      },
    },
    {
      heading: 'Management groups and landing zones',
      paragraphs: [
        "Organizations rarely have one subscription. They separate environments, such as development and production, and teams into different subscriptions, so costs, access and mistakes stay contained. Management groups arrange those subscriptions in a tree, and a policy or role assigned to a management group applies to every subscription beneath it.",
        "A landing zone is a subscription that is set up correctly before any team moves in: identity and roles, networking, policies, logging, budgets and security checks are already in place. Teams land their workloads in it and inherit good defaults instead of building them each time. Microsoft publishes a reference design called Azure landing zones, part of its Cloud Adoption Framework.",
        "You have built a tiny landing zone yourself in this track: a budget, a limited daily account, a network, logging and now tags and a policy. Real ones apply the same ideas across hundreds of subscriptions.",
      ],
      example: {
        language: 'text',
        code: code`
          Tenant root group
            Platform               shared networking, identity, logging
            Landing zones
              Production           policy: deny public databases, allowed regions only
                study-tracker-prod   subscription
              Development          policy: audit only, smaller sizes allowed
                study-tracker-dev    subscription
            Sandbox                experiments, strict budgets
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Tagging Study Tracker and enforcing the project tag',
    intro: "The tagging runs as `studyadmin`. The policy assignment and the scan need your sign-up account, because assigning policies is a separate permission. Save the parameters from Try it yourself as `policy-params.json` first. The PowerShell version of the loop is also in Try it yourself.",
    example: {
      language: 'bash',
      code: code`
        az resource list --resource-group $RG --query "[?tags.project==null].{name:name, type:type}" -o table

        for ID in $(az resource list --resource-group $RG --query "[].id" -o tsv); do
          az tag update --resource-id "$ID" --operation merge --tags project=study-tracker environment=learning owner=studyadmin --output none
        done

        RG_ID=$(az group show --name $RG --query id -o tsv)
        DEF=$(az policy definition list --query "[?displayName=='Require a tag on resources'].name" -o tsv)
        az policy assignment create --name require-project-tag --display-name "Require a project tag" --scope $RG_ID --policy $DEF --params "@policy-params.json"

        az storage account create --name stuntagged$SUFFIX --resource-group $RG --location $LOCATION --sku Standard_LRS
      `,
      output: code`
        (RequestDisallowedByPolicy) Resource 'stuntaggedjd4821' was disallowed by policy.
        Policy identifiers: '[{"policyAssignment":{"name":"Require a project tag",...}}]'.
      `,
    },
    steps: [
      { code: '--query "[?tags.project==null].{name:name, type:type}"', explanation: "Lists every resource without a `project` tag. Run it first to see what is missing, and again afterward to confirm the list is empty." },
      { code: 'az tag update --resource-id "$ID" --operation merge ...', explanation: "`merge` adds or updates these tags and keeps any others. `replace` would delete tags not listed, which is rarely what you want." },
      { code: 'DEF=$(az policy definition list --query "[?displayName==\'Require a tag on resources\'].name" -o tsv)', explanation: "Finds the built-in definition's ID by its display name, rather than pasting an ID you cannot easily check." },
      { code: '--params "@policy-params.json"', explanation: "Reads the parameters from a file, which avoids quoting JSON differently in each shell. Here it says the required tag is named `project`." },
      { code: 'RequestDisallowedByPolicy', explanation: "The test: a storage account with no tags is refused before it exists. New assignments can take a few minutes to start working, so retry if the first attempt succeeds, and delete that account if it does." },
    ],
  },
  tryIt: {
    instructions: [
      'Save `policy-params.json` below. Tag every resource with the loop above, then confirm the untagged list is empty.',
      'With your sign-up account, assign the policy and try creating the untagged storage account. Then create it with `--tags project=study-tracker` and see it succeed, and delete it.',
      'Open Cost analysis in the portal, filter by the tag `project = study-tracker`, and check that it shows the whole project.',
      'Clean up: tags and policy assignments cost nothing, so keep them. The final lesson deletes the whole resource group, which removes the assignment with it.',
    ],
    files: [
      { language: 'text', filename: 'policy-params.json', code: policyParamsJson },
      { language: 'text', filename: 'PowerShell version of the tag loop', code: tagLoopPowerShell },
    ],
  },
  mistakes: [
    { mistake: 'Letting every team invent its own tags.', fix: 'Agree a short, fixed list of tag names and values, and enforce the important ones with policy.' },
    { mistake: 'Tagging only the resource group.', fix: 'Tags are not inherited automatically. Tag each resource, or use a policy that copies the group\'s tags.' },
    { mistake: 'Starting with deny policies everywhere.', fix: 'Begin with audit to see what would break, fix it, then switch important rules to deny.' },
    { mistake: 'Giving every builder permission to change policies.', fix: 'Keep policy assignments with a platform owner, so the rules cannot be quietly removed by the people they govern.' },
  ],
  quiz: [
    {
      question: 'A policy with the deny effect requires a `project` tag. A colleague tries to create a storage account without tags. What happens?',
      options: [
        { text: 'The account is created and flagged as non-compliant', explanation: 'That is what the audit effect does. Deny stops it.' },
        { text: 'The request is refused with RequestDisallowedByPolicy, and nothing is created', explanation: 'Deny checks the request before the resource exists.' },
        { text: 'Azure adds the tag automatically', explanation: 'Some policy effects can add tags, but deny does not.' },
        { text: 'The colleague\'s account is locked', explanation: 'Policies judge resources, not people.' },
      ],
      answer: 1,
    },
    {
      question: '`studyadmin` has Contributor on the resource group but cannot assign a policy there. Why?',
      options: [
        { text: 'Policies can only be assigned to subscriptions', explanation: 'Policies can be assigned to resource groups, as in this lesson.' },
        { text: 'MFA is required for policies', explanation: 'MFA proves identity. It does not grant permissions.' },
        { text: 'Contributor does not include permission to assign policies, which needs a role such as Resource Policy Contributor', explanation: 'Contributor deliberately excludes authorization changes, so rules are set by a separate role.' },
        { text: 'The resource group has too many resources', explanation: 'Resource count does not affect policy permissions.' },
      ],
      answer: 2,
    },
    {
      question: 'An organization wants every new subscription to start with networking, logging, budgets and security policies already in place. What is that called?',
      options: [
        { text: 'A landing zone', explanation: 'A landing zone is a prepared environment that teams move into with good defaults already set.' },
        { text: 'A resource group', explanation: 'A resource group holds resources. It does not provide a whole prepared environment.' },
        { text: 'An availability zone', explanation: 'That is a separate data center within a region, a resilience concept.' },
        { text: 'A private DNS zone', explanation: 'That resolves private names inside a network.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Label every resource with a small, fixed set of tags, enforce the rules that matter with Azure Policy assigned by a separate owner, and use management groups and landing zones to give every team the same good defaults.',
  resources: [
    { title: 'What is Azure Policy?', provider: 'Microsoft Learn', description: 'Definitions, assignments, effects and compliance.', url: 'https://learn.microsoft.com/en-us/azure/governance/policy/overview' },
    { title: 'Define your tagging strategy', provider: 'Microsoft Cloud Adoption Framework', description: 'Which tags to use and how to keep them consistent.', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging' },
    { title: 'What is an Azure landing zone?', provider: 'Microsoft Cloud Adoption Framework', description: 'The reference design for organizing subscriptions, management groups and policies.', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/' },
    { title: 'Built-in policy definitions', provider: 'Microsoft Learn', description: 'Every built-in policy, searchable by name and category.', url: 'https://learn.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies' },
  ],
  underTheHood: {
    heading: 'Where Azure Policy checks your request',
    paragraphs: [
      "Every change in Azure, from the portal, the CLI or code, becomes a request to Azure Resource Manager, the single front door for creating and changing resources. Before Resource Manager passes the request to the service, such as Storage, it evaluates every policy assignment whose scope covers the target.",
      "A deny effect stops the request right there and returns an error, so the resource never exists, even briefly. An audit effect lets the request through and records the result in the compliance data. Because the check happens at the front door, it applies the same way whichever tool someone uses: there is no way around it by switching to the portal.",
      "Existing resources are evaluated on a schedule, and on demand with `az policy state trigger-scan`, which is how compliance reports find resources created before the policy existed. Deny cannot remove those, so teams usually fix them first, using the audit results as a to-do list.",
    ],
  },
}

export default lesson
