import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud compute and storage, and the Foundations lesson on cloud networking. Set the track variables first.',
  goals: [
    'Plan a VPC network with a subnet for the app and a private range for Google-managed databases',
    'Control traffic with firewall rules, and remove the permissive default network',
    'Decide what should be public, and why the database will have no public address at all',
  ],
  bigIdea: "A VPC network is your own private network inside Google Cloud. Unlike most clouds, one VPC network spans every region, and its subnets are regional. Firewall rules decide which traffic reaches your resources, and private services access gives Google-managed services such as Cloud SQL addresses inside your network, so Study Tracker's app can be public while its database has no public address.",
  whyItMatters: "Databases reachable from the internet are found by automated scanners within hours and attacked with common passwords. New Google Cloud projects also start with a `default` network whose firewall rules allow SSH and remote desktop from anywhere. If Study Tracker's database has only a private address, inside a network you designed, those attacks have nothing to reach. Building the network before the database means it is private from the moment it exists.",
  goalSections: [
    {
      heading: 'Networks, subnets and ranges',
      paragraphs: [
        "A custom-mode VPC network starts empty, and you add subnets yourself, each in one region with an address range such as `10.0.0.0/24`. Resources in any zone of that region can use it. Google keeps four addresses in each subnet's range for itself.",
        "Study Tracker needs two ranges. `snet-apps`, `10.0.0.0/24`, is where Cloud Run sends the app's traffic into the network in lesson 5. Google's documentation asks for a `/26` or larger for this, because each instance uses about two addresses. A second range, `10.100.0.0/16`, is reserved for Google-managed services, where Cloud SQL will place the database.",
        "Python's `ipaddress` module checks a plan before Google Cloud does.",
      ],
      example: {
        language: 'python',
        code: code`
          import ipaddress

          apps = ipaddress.ip_network("10.0.0.0/24")
          services = ipaddress.ip_network("10.100.0.0/16")
          print(apps.overlaps(services))
          print(apps.prefixlen <= 26)
          print(apps.num_addresses - 4)
        `,
        output: 'False\nTrue\n252',
      },
    },
    {
      heading: 'Firewall rules',
      paragraphs: [
        "VPC firewall rules allow or deny traffic to and from resources in the network. Every network has two hidden rules: deny all incoming traffic and allow all outgoing. You add allow rules only for what should come in, and replies to allowed traffic flow back automatically, because the firewall tracks connections.",
        "Rules can target resources by network tag or by service account instead of by address. A custom network you create has no allow rules at all, so nothing can connect in until you decide it should.",
        "The `default` network that new projects get is different: its rules allow SSH, remote desktop and ping from the whole internet, and traffic between all its resources. This track never uses it, and this lesson deletes it.",
      ],
      example: {
        language: 'text',
        code: code`
          vpc-study-tracker (custom mode)
            implied: deny all ingress, allow all egress
            your allow rules: none, nothing can connect in
          default (created with new projects)
            default-allow-ssh   tcp:22 from 0.0.0.0/0    <- anyone on the internet
            default-allow-rdp   tcp:3389 from 0.0.0.0/0
            default-allow-icmp, default-allow-internal
        `,
      },
    },
    {
      heading: 'Public, private and private services access',
      paragraphs: [
        "Cloud Run services get a public HTTPS address from Google's front end, outside your network. Nothing in your VPC needs to be public for that. When the app needs the database, Direct VPC egress sends its private traffic into `snet-apps`.",
        "Cloud SQL runs in a network Google manages. Private services access connects that network to yours through VPC peering, using the range you reserved, so the database gets an address such as `10.100.0.3` and no public address at all. Only resources connected to `vpc-study-tracker` can reach it, and lesson 7 adds a password and encryption on top.",
        "Private Google Access on the subnet lets resources without public addresses still reach Google APIs, such as Cloud Storage, over Google's network, protected by IAM.",
      ],
      example: {
        language: 'text',
        code: code`
          Internet --HTTPS--> Cloud Run (public address from Google)
                                 | Direct VPC egress, private ranges only
                                 v
          vpc-study-tracker:  snet-apps 10.0.0.0/24, us-central1
                                 | VPC peering (private services access)
                                 v
          Google-managed:     10.100.0.0/16 -> Cloud SQL, private address only (lesson 7)
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Building Study Tracker\'s network',
    intro: "Run these in your terminal, with the track variables set. Network resources and firewall rules cost nothing on their own. The peering command takes a minute or two.",
    example: {
      language: 'bash',
      code: code`
        gcloud services enable compute.googleapis.com servicenetworking.googleapis.com
        gcloud compute networks create vpc-study-tracker --subnet-mode custom --description "Study Tracker"
        gcloud compute networks subnets create snet-apps --network vpc-study-tracker --region $REGION --range 10.0.0.0/24 --enable-private-ip-google-access

        gcloud compute addresses create google-managed-services-study --global --purpose VPC_PEERING --addresses 10.100.0.0 --prefix-length 16 --network vpc-study-tracker
        gcloud services vpc-peerings connect --service servicenetworking.googleapis.com --ranges google-managed-services-study --network vpc-study-tracker

        gcloud compute firewall-rules delete default-allow-ssh default-allow-rdp default-allow-icmp default-allow-internal --quiet
        gcloud compute networks delete default --quiet
        gcloud compute networks subnets list --network vpc-study-tracker --format "table(name, region.basename(), ipCidrRange)"
      `,
      output: code`
        NAME       REGION       IP_CIDR_RANGE
        snet-apps  us-central1  10.0.0.0/24
      `,
    },
    steps: [
      { code: 'gcloud compute networks create vpc-study-tracker --subnet-mode custom', explanation: "Creates an empty network. Automatic mode would create a subnet in every region, which you do not need." },
      { code: '--range 10.0.0.0/24 --enable-private-ip-google-access', explanation: "The app's subnet, large enough for Direct VPC egress, with private access to Google APIs." },
      { code: '--global --purpose VPC_PEERING --addresses 10.100.0.0 --prefix-length 16', explanation: "Reserves the range Google-managed services will use. Choosing it yourself keeps it from overlapping your subnets." },
      { code: 'gcloud services vpc-peerings connect --service servicenetworking.googleapis.com', explanation: "Connects Google's service network to yours through that range. Cloud SQL instances created later with this network get private addresses from it." },
      { code: 'gcloud compute firewall-rules delete default-allow-ssh ...', explanation: "Removes the default network's open rules, then the network itself. If your project has no default network, these report that nothing was found, which is fine." },
      { code: 'gcloud compute networks subnets list --network vpc-study-tracker', explanation: "Confirms the subnet and its range. Note `vpc-study-tracker` and `snet-apps`: the next lessons use them." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the example in Networks, subnets and ranges, then check that a second subnet, `10.0.1.0/24`, would also fit without overlapping either range.',
      'Run the commands above. Then list the network\'s firewall rules with `gcloud compute firewall-rules list --filter "network~vpc-study-tracker"` and confirm there are none.',
      'In the console, open VPC network, then `vpc-study-tracker`, and look at its Subnets, Firewalls and Private services access tabs.',
      'Clean up: the network costs nothing, so keep it. To remove it later, delete what uses it first, then run `gcloud services vpc-peerings delete --service servicenetworking.googleapis.com --network vpc-study-tracker`, delete the address and subnet, and finally `gcloud compute networks delete vpc-study-tracker`.',
    ],
  },
  mistakes: [
    { mistake: 'Building on the default network.', fix: 'Create a custom network and delete the default one, whose rules let the whole internet try SSH and remote desktop.' },
    { mistake: 'Giving the database a public address and relying on its password.', fix: 'Use private services access, so the database has only a private address inside your network.' },
    { mistake: 'Letting Google pick the services range at random.', fix: 'Reserve it yourself, sized and placed so it never overlaps your subnets.' },
    { mistake: 'Making the app subnet too small.', fix: 'Direct VPC egress needs a `/26` or larger, because each instance uses about two addresses.' },
  ],
  quiz: [
    {
      question: 'You create `snet-apps` in `us-central1`. Where can resources use it?',
      options: [
        { text: 'Only in the zone `us-central1-a`', explanation: 'Google Cloud subnets are regional, not zonal.' },
        { text: 'In every region, because VPC networks are global', explanation: 'The network is global, but each subnet belongs to one region.' },
        { text: 'In any zone of `us-central1`', explanation: 'A subnet covers its whole region.' },
        { text: 'Only in Cloud Run', explanation: 'Virtual machines, GKE and other resources in the region can use it too.' },
      ],
      answer: 2,
    },
    {
      question: 'A custom network has no firewall rules you added. A machine on the internet tries to connect to a VM in it on port 22. What happens?',
      options: [
        { text: 'It connects, because egress is allowed', explanation: 'Egress is outgoing traffic. This is incoming.' },
        { text: 'It connects, because the network is public', explanation: 'Networks are not public or private. Firewall rules decide.' },
        { text: 'It connects only during business hours', explanation: 'Firewall rules have no schedule.' },
        { text: 'It is blocked by the implied rule that denies all ingress', explanation: 'Without an allow rule, nothing can connect in.' },
      ],
      answer: 3,
    },
    {
      question: 'The Cloud SQL database will have only a private address from the reserved range. You try to connect from your laptop at home. What happens?',
      options: [
        { text: 'It fails, because the address is only reachable from resources connected to the VPC network', explanation: 'Your laptop is not in the network, so there is no route to that address.' },
        { text: 'It works with the right password', explanation: 'The password matters only once a connection can be made.' },
        { text: 'It works, because private services access makes it public', explanation: 'Private services access connects networks privately. Nothing becomes public.' },
        { text: 'It works through Private Google Access', explanation: 'That reaches Google APIs, not private database addresses.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Build a custom VPC network with a regional subnet for the app and a reserved range for Google-managed services, rely on the implied deny for incoming traffic, delete the default network, and give the database a private address only.',
  resources: [
    { title: 'VPC networks', provider: 'Google Cloud Documentation', description: 'Global networks, regional subnets and modes.', url: 'https://docs.cloud.google.com/vpc/docs/vpc' },
    { title: 'VPC firewall rules', provider: 'Google Cloud Documentation', description: 'Implied rules, targets and the default network\'s rules.', url: 'https://docs.cloud.google.com/firewall/docs/firewalls' },
    { title: 'Private services access', provider: 'Google Cloud Documentation', description: 'Reserving a range and connecting Google-managed services.', url: 'https://docs.cloud.google.com/vpc/docs/private-services-access' },
    { title: 'Direct VPC egress with a VPC network', provider: 'Google Cloud Documentation', description: 'How Cloud Run sends traffic into your network, and subnet sizing.', url: 'https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc' },
  ],
  underTheHood: {
    heading: 'Why Google Cloud networks are global',
    paragraphs: [
      "In most clouds, a network lives in one region, and connecting regions means building links between separate networks. Google Cloud's VPC networks are a single global object, and its subnets in different regions can reach each other over Google's own private backbone, without gateways or peering.",
      "This is possible because Google's network is software-defined end to end. Routes and firewall rules are not configured on individual routers: a central control system computes them and programs every host directly. A packet from a machine in Iowa to one in Belgium follows routes Google's system already knows, and firewall rules are enforced on each machine's virtual network card rather than at a boundary.",
      "Two practical consequences follow. Firewall rules apply everywhere in the network at once, whatever the region. And adding a region later is just adding a subnet, which is why Study Tracker's network can grow without being redesigned.",
    ],
  },
}

export default lesson
