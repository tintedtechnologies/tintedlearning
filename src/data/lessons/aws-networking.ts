import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'AWS compute and storage, signed in as `studyadmin`, and the Foundations lesson on cloud networking. Set the track variables first.',
  goals: [
    'Plan a VPC with public subnets for the app and private subnets for the database, across two availability zones',
    'Control traffic with security groups that refer to each other',
    'Decide what should be public, and why the database subnets have no route to the internet',
  ],
  bigIdea: "A VPC, or virtual private cloud, is your own private network inside AWS, divided into subnets, each in one availability zone. A subnet is public if its route table sends internet traffic to an internet gateway, and private if it has no such route. Security groups then decide which traffic each resource accepts, so Study Tracker's app can be public while its database answers only the app.",
  whyItMatters: "Databases reachable from the internet are found by automated scanners within hours and attacked with common passwords. If Study Tracker's database lives in subnets with no route to the internet, and only accepts connections from the app's security group, those attacks have nothing to reach. Building the network before the database means it is private from the moment it exists.",
  goalSections: [
    {
      heading: 'VPCs, subnets and zones',
      paragraphs: [
        "A VPC has an address range in CIDR notation, such as `10.0.0.0/16`, which is 65,536 private addresses. Subnets divide it, and each subnet lives in exactly one availability zone. AWS keeps five addresses in each subnet for itself.",
        "Several AWS services need subnets in at least two zones, so that one data center failing does not take everything down. ECS Express Mode needs two public subnets for its load balancer, and Amazon RDS needs a database subnet group covering two zones. Study Tracker therefore gets four subnets: public A and B, private A and B.",
        "Python's `ipaddress` module checks a plan before AWS does.",
      ],
      example: {
        language: 'python',
        code: code`
          import ipaddress

          vpc = ipaddress.ip_network("10.0.0.0/16")
          subnets = {"public-a": "10.0.0.0/24", "public-b": "10.0.1.0/24", "private-a": "10.0.2.0/24", "private-b": "10.0.3.0/24"}
          nets = {name: ipaddress.ip_network(cidr) for name, cidr in subnets.items()}
          print(all(n.subnet_of(vpc) for n in nets.values()))
          print(any(a.overlaps(b) for x, a in nets.items() for y, b in nets.items() if x < y))
          print(sum(n.num_addresses - 5 for n in nets.values()))
        `,
        output: 'True\nFalse\n1004',
      },
    },
    {
      heading: 'Security groups',
      paragraphs: [
        "A security group is a firewall attached to resources such as tasks and databases. It allows nothing in by default and everything out. You add inbound rules for what should be allowed, and replies to allowed traffic flow back automatically, because security groups track connections.",
        "Rules can name another security group as the source instead of addresses. Study Tracker's database group allows port 5432, PostgreSQL's port, only from members of `sg-study-app`, the group attached to the app's tasks. If the app gains more tasks or new addresses, the rule still works, because it follows the group, not the addresses.",
        "Subnets can also have network access control lists, stateless rules checked at the subnet edge. The default ones allow everything, and most designs leave them that way and rely on security groups.",
      ],
      example: {
        language: 'text',
        code: code`
          sg-study-app   attached to Study Tracker's tasks
            inbound: added by Express Mode, from its load balancer only
          sg-study-db    attached to the database
            inbound: TCP 5432 from sg-study-app      <- the only way in
          Default: everything not allowed is blocked
        `,
      },
    },
    {
      heading: 'Public, private and DNS',
      paragraphs: [
        "The public subnets' route table sends `0.0.0.0/0`, meaning all internet traffic, to an internet gateway. ECS Express Mode puts its internet-facing load balancer there and gives each task a public IP address, so tasks can download their image without a NAT gateway, a paid service that would charge every hour. The security group still blocks any direct connection to the tasks.",
        "The private subnets use the VPC's main route table, which only routes traffic inside the VPC. The database placed there has no path to or from the internet at all. Services such as S3 stay reachable by the app over HTTPS, protected by IAM.",
        "Inside the VPC, AWS's built-in DNS resolves the database's name to its private address, as long as DNS hostnames are turned on for the VPC, which this lesson does.",
      ],
      example: {
        language: 'text',
        code: code`
          Internet
             |  HTTPS
          public-a / public-b     load balancer, tasks (route 0.0.0.0/0 -> internet gateway)
             |  TCP 5432 from sg-study-app only
          private-a / private-b   PostgreSQL (lesson 9), no internet route
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Building Study Tracker\'s VPC',
    intro: "Run these as `studyadmin`. The block shows public subnet A, and the steps describe the same command for the other three subnets. In PowerShell, write `$VPC_ID = aws ec2 create-vpc ...` instead of `VPC_ID=$(...)`. VPCs, subnets, route tables, internet gateways and security groups cost nothing on their own.",
    example: {
      language: 'bash',
      code: code`
        VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=vpc-study-tracker},{Key=project,Value=study-tracker}]' --query Vpc.VpcId --output text)
        aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames
        AZ1=$(aws ec2 describe-availability-zones --query "AvailabilityZones[0].ZoneName" --output text)
        AZ2=$(aws ec2 describe-availability-zones --query "AvailabilityZones[1].ZoneName" --output text)

        PUB1=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.0.0/24 --availability-zone $AZ1 --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-a},{Key=project,Value=study-tracker}]' --query Subnet.SubnetId --output text)

        IGW=$(aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=project,Value=study-tracker}]' --query InternetGateway.InternetGatewayId --output text)
        aws ec2 attach-internet-gateway --internet-gateway-id $IGW --vpc-id $VPC_ID
        RT_PUB=$(aws ec2 create-route-table --vpc-id $VPC_ID --tag-specifications 'ResourceType=route-table,Tags=[{Key=project,Value=study-tracker}]' --query RouteTable.RouteTableId --output text)
        aws ec2 create-route --route-table-id $RT_PUB --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW
        aws ec2 associate-route-table --route-table-id $RT_PUB --subnet-id $PUB1

        SG_APP=$(aws ec2 create-security-group --group-name sg-study-app --description "Study Tracker app tasks" --vpc-id $VPC_ID --tag-specifications 'ResourceType=security-group,Tags=[{Key=project,Value=study-tracker}]' --query GroupId --output text)
        SG_DB=$(aws ec2 create-security-group --group-name sg-study-db --description "Study Tracker database" --vpc-id $VPC_ID --tag-specifications 'ResourceType=security-group,Tags=[{Key=project,Value=study-tracker}]' --query GroupId --output text)
        aws ec2 authorize-security-group-ingress --group-id $SG_DB --protocol tcp --port 5432 --source-group $SG_APP

        aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC_ID --query "Subnets[].{cidr:CidrBlock, az:AvailabilityZone}" --output table
      `,
      output: code`
        -----------------------------------
        |         DescribeSubnets         |
        +-------------+-------------------+
        |     az      |       cidr        |
        +-------------+-------------------+
        |  us-east-1a |  10.0.0.0/24      |
        |  us-east-1b |  10.0.1.0/24      |
        |  us-east-1a |  10.0.2.0/24      |
        |  us-east-1b |  10.0.3.0/24      |
        +-------------+-------------------+
      `,
    },
    steps: [
      { code: '--tag-specifications \'ResourceType=vpc,Tags=[...]\'', explanation: "EC2 resources are tagged as they are created. The `Name` tag is what the console shows, and the `project` tag puts each one in the `study-tracker` resource group." },
      { code: 'aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames', explanation: "Lets resources in the VPC get DNS names, which the database endpoint in lesson 9 relies on." },
      { code: 'PUB1=$(aws ec2 create-subnet ... --cidr-block 10.0.0.0/24 --availability-zone $AZ1 ...)', explanation: "Creates public subnet A. Repeat with `10.0.1.0/24` in `$AZ2` as `PUB2` named `public-b`, then `10.0.2.0/24` in `$AZ1` as `PRIV1` named `private-a`, and `10.0.3.0/24` in `$AZ2` as `PRIV2` named `private-b`." },
      { code: 'aws ec2 create-route --route-table-id $RT_PUB --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW', explanation: "Sends internet-bound traffic to the internet gateway. Only subnets associated with this route table become public." },
      { code: 'aws ec2 associate-route-table --route-table-id $RT_PUB --subnet-id $PUB1', explanation: "Makes public subnet A public. Run it again with `$PUB2`. The private subnets are never associated, so they keep the main route table with no internet route." },
      { code: '--protocol tcp --port 5432 --source-group $SG_APP', explanation: "The database accepts PostgreSQL connections only from resources in `sg-study-app`. Nothing else, inside or outside the VPC, can connect." },
      { code: 'aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC_ID ...', explanation: "Confirms four subnets across two zones. Save the `VPC_ID`, subnet and security group IDs: the next lessons use them." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the example in VPCs, subnets and zones, then add a fifth subnet, `10.0.4.0/24`, and confirm it still fits without overlapping.',
      'Run the commands above, including the three extra subnets and the second route table association described in the steps.',
      'In the VPC console, open the resource map for `vpc-study-tracker` and check which subnets route to the internet gateway.',
      'Clean up: the network costs nothing, so keep it. To remove it later, delete the resources inside it first, then the subnets, route table, internet gateway (detach it first), security groups and finally `aws ec2 delete-vpc --vpc-id $VPC_ID`.',
    ],
  },
  mistakes: [
    { mistake: 'Putting the database in a public subnet and relying on its password.', fix: 'Use private subnets with no internet route, and a security group that only accepts the app.' },
    { mistake: 'Allowing database access from an address range such as the whole VPC.', fix: 'Allow only the app\'s security group as the source, so new resources do not get access by accident.' },
    { mistake: 'Adding a NAT gateway without noticing its hourly cost.', fix: 'For a learning project, give tasks public IPs in public subnets, protected by security groups, as Express Mode does.' },
    { mistake: 'Building everything in one availability zone.', fix: 'Spread subnets across at least two zones. Several services require it, and it survives a data center failure.' },
  ],
  quiz: [
    {
      question: 'What makes an AWS subnet public?',
      options: [
        { text: 'Its name contains the word public', explanation: 'Names are labels. Routing decides what is public.' },
        { text: 'It is in the first availability zone', explanation: 'Zones have nothing to do with being public.' },
        { text: 'Its route table sends 0.0.0.0/0 to an internet gateway', explanation: 'A route to an internet gateway is what connects a subnet to the internet.' },
        { text: 'It has a security group attached', explanation: 'Security groups attach to resources and filter traffic. They do not create a route.' },
      ],
      answer: 2,
    },
    {
      question: 'The database security group allows TCP 5432 from `sg-study-app`. A new EC2 machine in a public subnet, without that group, tries to connect. What happens?',
      options: [
        { text: 'The connection is blocked, because the machine is not in sg-study-app', explanation: 'The rule follows group membership, and the machine is not a member.' },
        { text: 'It connects, because it is inside the same VPC', explanation: 'Being in the VPC grants nothing. Security groups block everything not allowed.' },
        { text: 'It connects, because it is in a public subnet', explanation: 'Subnet type does not grant access to the database.' },
        { text: 'It connects on any port except 5432', explanation: 'The database allows nothing at all except 5432 from the app group.' },
      ],
      answer: 0,
    },
    {
      question: 'Why does Study Tracker\'s VPC have two public and two private subnets instead of one of each?',
      options: [
        { text: 'AWS charges less for even numbers of subnets', explanation: 'Subnets are free, whatever their number.' },
        { text: 'Express Mode\'s load balancer and RDS each need subnets in at least two availability zones', explanation: 'Spreading across zones is required by these services and protects against a data center failure.' },
        { text: 'Each subnet can only hold one resource', explanation: 'A /24 subnet holds over 250 addresses.' },
        { text: 'Security groups only work across two subnets', explanation: 'Security groups work in any subnet of the VPC.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Build a VPC with public subnets for the app and private ones for the database across two zones, route only public subnets to the internet, and let the database security group accept the app\'s group and nothing else.',
  resources: [
    { title: 'How Amazon VPC works', provider: 'AWS Documentation', description: 'VPCs, subnets, route tables and gateways.', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html' },
    { title: 'Security groups', provider: 'AWS Documentation', description: 'Rules, references between groups and how connections are tracked.', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html' },
    { title: 'Express Mode networking defaults', provider: 'AWS Documentation', description: 'How Express Mode uses public and private subnets.', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-work.html' },
    { title: 'Subnet CIDR blocks', provider: 'AWS Documentation', description: 'Sizing subnets and the five reserved addresses.', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html' },
  ],
  underTheHood: {
    heading: 'Stateful security groups and stateless network ACLs',
    paragraphs: [
      "AWS gives you two kinds of firewall. Security groups are stateful: when they allow a connection in, the reply traffic is allowed back out automatically, because AWS remembers the connection. You only write rules for who may start a connection.",
      "Network access control lists, or network ACLs, sit at the edge of a subnet and are stateless: each packet is judged on its own, in both directions. To allow a database connection through a network ACL, you must allow port 5432 in and also the temporary high ports the replies use going out. Rules are checked in number order, and the first match wins.",
      "That difference is why most designs leave network ACLs open and do the real work in security groups, which are simpler and harder to get wrong. Network ACLs are useful as a coarse extra layer, for example to block a whole address range at the subnet edge, an example of the defense in depth the security lesson describes.",
    ],
  },
}

export default lesson
