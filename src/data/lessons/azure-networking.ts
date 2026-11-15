import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Azure compute and storage, signed in as `studyadmin`, and the Foundations lesson on cloud networking. Set the track variables first.',
  goals: [
    'Plan a virtual network with separate subnets for the app and the database',
    'Control traffic between subnets with network security group rules',
    'Decide what should be public and what private, and how private services are found by name',
  ],
  bigIdea: "A virtual network is your own private network inside Azure, divided into subnets, smaller address ranges for different parts of the app. Rules decide which traffic may flow between them. The aim is that only the parts users must reach are public, so Study Tracker's app is reachable from the internet while its database can only be reached from the app's subnet.",
  whyItMatters: "Databases left open to the internet are found within hours by automated scanners trying common passwords, and leaked databases are one of the most common ways personal data ends up public. If Study Tracker's database has no public address at all, those attacks have nothing to aim at. Designing the network before creating the database means it is private from its first second, not secured later.",
  goalSections: [
    {
      heading: 'Virtual networks and subnets',
      paragraphs: [
        "A virtual network, or VNet, has an address space written in CIDR notation, such as `10.0.0.0/16`. The number after the slash says how many leading bits are fixed: /16 leaves 16 bits free, which is 65,536 addresses. Addresses starting with 10 are private ranges, never reachable from the internet.",
        "Subnets split the space. Study Tracker uses `snet-apps`, `10.0.0.0/23` with 512 addresses, for the Container Apps environment, and `snet-db`, `10.0.2.0/24` with 256, for PostgreSQL. Subnets must not overlap, and Azure keeps five addresses in each for itself.",
        "Some services need a subnet delegated to them, meaning handed over to that service to manage. Container Apps needs delegation to `Microsoft.App/environments`, and PostgreSQL to `Microsoft.DBforPostgreSQL/flexibleServers`. Subnet sizes cannot easily change once services use them, so leave room to grow.",
      ],
      example: {
        language: 'python',
        code: code`
          import ipaddress

          vnet = ipaddress.ip_network("10.0.0.0/16")
          apps = ipaddress.ip_network("10.0.0.0/23")
          db = ipaddress.ip_network("10.0.2.0/24")
          print(vnet.num_addresses, apps.num_addresses, db.num_addresses)
          print(apps.subnet_of(vnet), apps.overlaps(db))
          print(ipaddress.ip_address("10.0.1.17") in apps, ipaddress.ip_address("10.0.2.4") in apps)
        `,
        output: '65536 512 256\nTrue False\nTrue False',
      },
    },
    {
      heading: 'Network security group rules',
      paragraphs: [
        "A network security group, or NSG, is a list of rules attached to a subnet. Each rule matches traffic by direction, source, destination, port and protocol, then allows or denies it. Rules are checked in order of priority, lowest number first, and the first match wins.",
        "Every NSG also has default rules at the end, numbered from 65000. One of them allows all traffic from inside the virtual network, which is convenient but too generous for a database. So Study Tracker's database NSG adds two rules above it: allow PostgreSQL's port, 5432, from the apps subnet, then deny everything else from the network.",
        "Rules are cheap to add and easy to forget, so give each a name that says why it exists.",
      ],
      example: {
        language: 'text',
        code: code`
          nsg-study-db, inbound, checked from the top
          Priority  Name                        Source        Port   Action
          100       allow-postgres-from-apps    10.0.0.0/23   5432   Allow
          200       deny-other-vnet             VirtualNetwork  *    Deny
          65000     AllowVnetInBound (default)  VirtualNetwork  *    Allow  (never reached)
          65500     DenyAllInBound (default)    any             *    Deny
        `,
      },
    },
    {
      heading: 'Public, private and DNS',
      paragraphs: [
        "Decide for each component whether the internet must reach it. Study Tracker's app must be public, so it gets a public address with HTTPS, called ingress. The database must not: it gets only a private address inside `snet-db`. Services that are public by default, such as storage, can also be given a private endpoint, a private address in your network, and have public access turned off. The security lesson does this.",
        "Apps find services by name, not by address. Private addresses need private names, so Azure uses private DNS zones: name directories visible only inside your virtual network. When lesson 7 creates the database, it creates a zone so the app can reach it by name.",
        "Network rules are one layer. Identity, from lesson 2, is another. Even inside the network, the database will still require a sign-in.",
      ],
      example: {
        language: 'text',
        code: code`
          Internet
             |  HTTPS only
          snet-apps 10.0.0.0/23     Container Apps environment (public ingress)
             |  port 5432 only
          snet-db   10.0.2.0/24     PostgreSQL, private address only
          Private DNS zone: the app looks up the database by name inside the VNet
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Building Study Tracker\'s network',
    intro: "Run these as `studyadmin`. They create the network, the two subnets and the database subnet's rules. Nothing here costs money on its own: virtual networks, subnets and NSGs are free, and costs begin with the services placed in them.",
    example: {
      language: 'bash',
      code: code`
        az network vnet create --name vnet-study-tracker --resource-group $RG --location $LOCATION --address-prefixes 10.0.0.0/16 --tags project=study-tracker
        az network vnet subnet create --name snet-apps --vnet-name vnet-study-tracker --resource-group $RG --address-prefixes 10.0.0.0/23 --delegations Microsoft.App/environments

        az network nsg create --name nsg-study-db --resource-group $RG --location $LOCATION --tags project=study-tracker
        az network nsg rule create --nsg-name nsg-study-db --resource-group $RG --name allow-postgres-from-apps --priority 100 --direction Inbound --access Allow --protocol Tcp --source-address-prefixes 10.0.0.0/23 --destination-port-ranges 5432
        az network nsg rule create --nsg-name nsg-study-db --resource-group $RG --name deny-other-vnet --priority 200 --direction Inbound --access Deny --protocol "*" --source-address-prefixes VirtualNetwork --destination-port-ranges "*"

        az network vnet subnet create --name snet-db --vnet-name vnet-study-tracker --resource-group $RG --address-prefixes 10.0.2.0/24 --delegations Microsoft.DBforPostgreSQL/flexibleServers --network-security-group nsg-study-db
        az network vnet subnet list --vnet-name vnet-study-tracker --resource-group $RG --query "[].{name:name, prefix:addressPrefix, delegation:delegations[0].serviceName}" -o table
      `,
      output: code`
        Name       Prefix       Delegation
        ---------  -----------  -----------------------------------------
        snet-apps  10.0.0.0/23  Microsoft.App/environments
        snet-db    10.0.2.0/24  Microsoft.DBforPostgreSQL/flexibleServers
      `,
    },
    steps: [
      { code: '--address-prefixes 10.0.0.0/16', explanation: "The whole private range for Study Tracker. It must not overlap any other network you might connect it to later, such as an office network." },
      { code: '--address-prefixes 10.0.0.0/23 --delegations Microsoft.App/environments', explanation: "The apps subnet, handed to Container Apps. The environment in lesson 5 will place its infrastructure here." },
      { code: '--priority 100 ... --source-address-prefixes 10.0.0.0/23 --destination-port-ranges 5432', explanation: "Allows PostgreSQL connections only from the apps subnet. Nothing else in the network can reach the database port." },
      { code: '--priority 200 ... --access Deny ... --source-address-prefixes VirtualNetwork', explanation: "Blocks every other source inside the network, overriding the generous default rule numbered 65000. `VirtualNetwork` is a service tag, a built-in name for the network's own addresses." },
      { code: '--protocol "*" ... --destination-port-ranges "*"', explanation: "The quotes stop your shell from expanding `*` into a list of file names." },
      { code: '--delegations Microsoft.DBforPostgreSQL/flexibleServers --network-security-group nsg-study-db', explanation: "The database subnet, handed to PostgreSQL and protected by the rules above from the start." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the example in Virtual networks and subnets, then change it to check whether `10.0.2.0/24` and `10.0.2.128/25` overlap. Predict the answer first.',
      'Run the commands above, then open `vnet-study-tracker` in the portal and look at its subnets and the NSG\'s inbound rules, including the defaults.',
      'Add a third subnet on paper for a future service: choose a range that fits inside `10.0.0.0/16` without overlapping the others, and check it with Python.',
      'Clean up: the network costs nothing, so keep it for the next lessons. To remove it later, delete the services in it first, then run `az network vnet delete --name vnet-study-tracker --resource-group $RG`.',
    ],
  },
  mistakes: [
    { mistake: 'Giving the database a public address and relying on a password.', fix: 'Place it in a private subnet with no public address, so scanners on the internet cannot reach it at all.' },
    { mistake: 'Relying on the default rule that allows all traffic inside the network.', fix: 'Add explicit rules that allow only what each subnet needs, above a deny rule.' },
    { mistake: 'Making subnets too small to grow.', fix: 'Size them for future scale. Many services cannot move to a bigger subnet without being recreated.' },
    { mistake: 'Choosing address ranges that overlap other networks.', fix: 'Plan ranges so they will not clash with any network you may connect later, such as an office or another VNet.' },
  ],
  quiz: [
    {
      question: 'A virtual machine at `10.0.3.5`, in another subnet of the same network, tries to connect to the database on port 5432. Which rule decides?',
      options: [
        { text: 'Rule 100, allow-postgres-from-apps, so it connects', explanation: '10.0.3.5 is outside 10.0.0.0/23, so rule 100 does not match it.' },
        { text: 'Rule 200, deny-other-vnet, so it is blocked', explanation: 'It is inside the virtual network but not the apps subnet, so the first matching rule is the deny at 200.' },
        { text: 'The default rule 65000, so it connects', explanation: 'Rule 200 matches first, and the first match wins.' },
        { text: 'No rule, because NSGs only filter internet traffic', explanation: 'NSGs filter traffic from inside the network too.' },
      ],
      answer: 1,
    },
    {
      question: 'How many addresses does a subnet written as `10.0.2.0/24` contain in total?',
      options: [
        { text: '24', explanation: 'The 24 is the number of fixed bits, not the number of addresses.' },
        { text: '65,536', explanation: 'That is a /16.' },
        { text: '512', explanation: 'That is a /23.' },
        { text: '256', explanation: 'A /24 leaves 8 free bits, and 2 to the power of 8 is 256. Azure keeps 5 of them for itself.' },
      ],
      answer: 3,
    },
    {
      question: 'Study Tracker\'s app will connect to the database by its name. Why does a private database need a private DNS zone?',
      options: [
        { text: 'So the name resolves to the database\'s private address, visible only inside the network', explanation: 'Private DNS zones answer name lookups from inside the VNet with private addresses.' },
        { text: 'So the database gets a public address as well', explanation: 'A private DNS zone adds no public address. The point is to stay private.' },
        { text: 'So the database can send emails', explanation: 'DNS here is about finding the database, not email.' },
        { text: 'Because NSG rules only work with names', explanation: 'NSG rules use addresses and service tags, not DNS names.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Give each part of the app its own subnet, allow only the traffic each part needs with NSG rules above a deny, and keep anything users do not reach directly, above all the database, private.',
  resources: [
    { title: 'What is Azure Virtual Network?', provider: 'Microsoft Learn', description: 'Address spaces, subnets and how virtual networks connect.', url: 'https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview' },
    { title: 'Network security groups', provider: 'Microsoft Learn', description: 'How rules, priorities and default rules work.', url: 'https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview' },
    { title: 'Container Apps networking', provider: 'Microsoft Learn', description: 'Subnet sizes and delegation for Container Apps environments.', url: 'https://learn.microsoft.com/en-us/azure/container-apps/custom-virtual-networks' },
    { title: 'PostgreSQL private networking', provider: 'Microsoft Learn', description: 'Delegated subnets and private DNS zones for Azure Database for PostgreSQL.', url: 'https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/concepts-networking-private' },
  ],
  underTheHood: {
    heading: 'How CIDR notation works',
    paragraphs: [
      "An IPv4 address is 32 bits, usually written as four numbers from 0 to 255, such as 10.0.2.4. CIDR notation, short for classless inter-domain routing, adds a slash and a number, the prefix length: how many of the 32 bits are fixed for the whole network. The rest can vary, and each combination is one address.",
      "So `10.0.0.0/16` fixes the first 16 bits, 10.0, and leaves 16 free: 2 to the power of 16, or 65,536 addresses, from 10.0.0.0 to 10.0.255.255. A /23 leaves 9 free bits, 512 addresses. Each extra bit in the prefix halves the size, which is why subnet sizes go 512, 256, 128 and so on.",
      "Two ranges overlap if one's fixed bits match the start of the other's. `10.0.0.0/23` covers 10.0.0.0 to 10.0.1.255, so 10.0.2.0/24 starts right after it and does not overlap. Python's `ipaddress` module does this arithmetic for you, which is a quick way to check a plan before Azure rejects it.",
    ],
  },
}

export default lesson
