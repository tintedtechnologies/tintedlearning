import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain IP addresses, private cloud networks and subnets in plain words',
    'Decide which parts of an app should be reachable from the internet and which should stay private',
    'Describe how a web address and a load balancer get a visitor to a healthy server',
  ],
  bigIdea: "Cloud networking decides which computers can talk to which. You build a private network for your app, place each part inside it, and open only the doors that must be open. Everything else stays unreachable from the internet, which is the simplest and strongest protection you have.",
  whyItMatters: "A company puts its customer database directly on the internet so its web server can reach it easily. Automated scanners find it within hours and start guessing passwords. Had the database lived in a private part of the network, reachable only by the web server, the scanners would never have seen it in the first place.",
  goalSections: [
    {
      heading: 'Addresses, private networks and subnets',
      paragraphs: [
        "Every computer on a network has an IP address, a number like `10.0.1.25` that works like a postal address, so data can be delivered to it. Public IP addresses can be reached from anywhere on the internet. Private addresses only work inside a private network.",
        "In the cloud you create your own private network, called a virtual private cloud, or VPC. Only your resources live inside it, and by default nothing from outside can get in.",
        "You divide a VPC into smaller sections called subnets, like floors in a building. A public subnet has a route to the internet. A private subnet has no route in from the internet at all. Where you place each server decides who can possibly reach it.",
      ],
      example: {
        language: 'text',
        code: code`
          VPC: 10.0.0.0/16          (your private network)
            public subnet  10.0.1.0/24   entry point that faces the internet
            private subnet 10.0.2.0/24   app servers
            private subnet 10.0.3.0/24   database

          /16 and /24 describe how many addresses each range holds:
          a /24 holds 256 addresses, a /16 holds 65,536
        `,
      },
    },
    {
      heading: 'Public doors and private rooms',
      paragraphs: [
        "A firewall is a set of rules that allow or block traffic. Cloud providers attach firewall rules directly to servers, often called security groups. Each rule names who may connect and on which port, a number that identifies the service, such as 443 for secure websites and 5432 for a PostgreSQL database.",
        "The safe pattern is to make only the entry point public, usually a load balancer listening on port 443. App servers accept traffic only from the load balancer. The database accepts traffic only from the app servers. Nothing else is allowed.",
        "Servers in private subnets sometimes need to reach out, for example to download updates. A NAT gateway, short for network address translation, lets them make outgoing connections without anyone outside being able to start a connection in.",
      ],
      example: {
        language: 'text',
        code: code`
          Resource         Allow incoming from          Port
          load balancer    anywhere on the internet     443
          app servers      the load balancer only       8080
          database         the app servers only         5432
          everything else  nobody                       -
        `,
      },
    },
    {
      heading: 'From a web address to a healthy server',
      paragraphs: [
        "People type names, not numbers. DNS, the domain name system, is the internet's address book: it turns a name like `shop.example.com` into the IP address of your entry point.",
        "That entry point is usually a load balancer: a service that receives every visitor and passes each request to one of several servers behind it, spreading the work.",
        "A load balancer also runs health checks, visiting a test page on every server every few seconds. If a server stops answering, the load balancer stops sending visitors to it until it recovers. Visitors never notice, as long as at least one healthy server remains.",
      ],
      example: {
        language: 'text',
        code: code`
          shop.example.com
            -> DNS answers: 203.0.113.10 (the load balancer)
            -> load balancer checks health: server A ok, server B not responding
            -> request goes to server A
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Following one visitor through a shop\'s network',
    intro: "A customer opens the shop's website and views an order. Here is every hop the request makes, and why each one is allowed.",
    example: {
      language: 'text',
      code: code`
        1. Browser asks DNS for shop.example.com -> 203.0.113.10
        2. Browser connects to the load balancer on port 443
        3. Load balancer forwards to a healthy app server, port 8080
        4. App server queries the database on port 5432
        5. Database replies, the page goes back the same way
        6. A scanner tries the database's port directly: no route, blocked
      `,
    },
    steps: [
      { code: '1. Browser asks DNS for shop.example.com', explanation: "The name is turned into the public address of the load balancer, the only public part of the system." },
      { code: '2. Browser connects to the load balancer on port 443', explanation: "Port 443 is open to everyone, because customers anywhere must reach the shop. The 443 means the connection is encrypted." },
      { code: '3. Load balancer forwards to a healthy app server', explanation: "The app server sits in a private subnet. Its rule accepts traffic only from the load balancer, and the health check guarantees the chosen server is working." },
      { code: '4. App server queries the database on port 5432', explanation: "The database's rule accepts only the app servers. This is the one path to the data." },
      { code: '5. Database replies, the page goes back the same way', explanation: "Responses travel back along the connection that was already allowed. No extra doors need opening." },
      { code: '6. A scanner tries the database\'s port directly', explanation: "The database has no public address and its subnet has no route from the internet, so the attempt never even arrives." },
    ],
  },
  mistakes: [
    { mistake: 'Giving a database a public IP address so it is easy to connect to.', fix: 'Keep databases in private subnets and allow only the app servers. Use a secure admin connection for maintenance.' },
    { mistake: 'Allowing traffic from anywhere, written as `0.0.0.0/0`, on every port.', fix: 'Open only the ports a service needs, and only to the sources that need them.' },
    { mistake: 'Sending traffic straight to one server\'s address.', fix: 'Put a load balancer in front, so a failed server is skipped and more servers can be added later.' },
  ],
  quiz: [
    {
      question: 'Which part of a typical web app should be in a public subnet?',
      options: [
        { text: 'The database', explanation: 'The database holds the most sensitive data and only the app needs it, so it belongs in a private subnet.' },
        { text: 'The load balancer', explanation: 'It is the single entry point customers must reach. Everything behind it can stay private.' },
        { text: 'Every server, so they can all receive updates', explanation: 'Private servers can download updates through a NAT gateway without being reachable from outside.' },
        { text: 'Nothing, because public subnets are never safe', explanation: 'Customers need some way in. One carefully limited public entry point is the safe pattern.' },
      ],
      answer: 1,
    },
    {
      question: 'One of three app servers crashes. What does the load balancer do?',
      options: [
        { text: 'Its health checks fail, so it stops sending visitors to that server and uses the other two', explanation: 'Health checks detect the failure within seconds, and traffic flows to the healthy servers.' },
        { text: 'It restarts the crashed server', explanation: 'A load balancer routes traffic. Restarting servers is handled by other tools.' },
        { text: 'It shows every visitor an error page', explanation: 'Only if all servers are down. While some are healthy, visitors are served normally.' },
        { text: 'It changes the DNS name of the shop', explanation: 'DNS keeps pointing at the load balancer. The load balancer decides which server gets each request.' },
      ],
      answer: 0,
    },
    {
      question: 'The database\'s firewall rule allows port 5432 from `0.0.0.0/0`. What does that mean?',
      options: [
        { text: 'No one can connect, since 0 means none', explanation: 'In network notation, `0.0.0.0/0` covers every possible address.' },
        { text: 'Only servers in the same subnet can connect', explanation: 'A same-subnet rule would name that subnet\'s range, such as `10.0.2.0/24`.' },
        { text: 'Anyone on the internet who can reach the database may try to connect to it', explanation: '`0.0.0.0/0` means every address. The rule should name only the app servers.' },
        { text: 'Only the load balancer can connect', explanation: 'A rule for the load balancer would name it specifically, not every address.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Build a private network, put only the entry point in a public subnet, let each layer accept traffic only from the layer in front of it, and use DNS and a load balancer to reach healthy servers.',
  resources: [
    { title: 'What is the network layer?', provider: 'Cloudflare', description: 'A beginner explanation of IP addresses, routing and networks.', url: 'https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/' },
    { title: 'What is DNS?', provider: 'Cloudflare', description: 'How names like example.com become IP addresses, step by step.', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
  ],
  underTheHood: {
    heading: 'What /16 and /24 really mean',
    paragraphs: [
      "An IPv4 address is 32 bits, the 0s and 1s a computer uses, written as four numbers from 0 to 255, such as `10.0.2.7`. A range like `10.0.2.0/24` uses CIDR notation, short for classless inter-domain routing. The number after the slash says how many of the 32 bits are fixed.",
      "With /24, the first 24 bits, the first three numbers, are fixed at `10.0.2`. The last 8 bits can vary, giving 2 to the power 8, which is 256 addresses, from `10.0.2.0` to `10.0.2.255`. With /16, only the first two numbers are fixed, leaving 16 bits and 65,536 addresses.",
      "Cloud providers reserve a few addresses in each subnet for their own use, so a /24 gives you slightly fewer than 256. And `0.0.0.0/0` fixes zero bits, which is why it matches every address on the internet.",
    ],
  },
}

export default lesson
