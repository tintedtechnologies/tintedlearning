import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the job of a port, and how it separates services on one address',
    'Compare TCP and UDP, and choose one for a task',
    'Name the common ports for web, email, and remote login',
  ],
  bigIdea: 'A device has one IP address, but it runs many services at once. A port number, from 0 to 65535, tells the device which service should receive a message. A protocol such as TCP or UDP defines how the message is sent: TCP checks that every piece arrives, and UDP sends quickly without that check.',
  whyItMatters: 'A web server works, but the video app on the same server cannot connect. The firewall allows traffic to port 443 and blocks the video app\'s port. The server is fine, and the service is fine. A port rule is the missing piece, and knowing the port numbers makes the mistake visible in one command.',
  goalSections: [
    {
      heading: 'What a port does',
      paragraphs: [
        'An IP address gets a message to a device. The port gets it to the right program on that device. A port is a number from 0 to 65535 that a service listens on, and the sender chooses a port for the reply.',
        'Some ports are well known and used by convention. Port 80 is for plain web traffic, port 443 is for encrypted web traffic, port 22 is for secure remote login, and port 25 is for sending email between servers. Services can use other ports too, as long as both sides agree.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Address 192.168.1.50, port 443   ->  the web server
          Address 192.168.1.50, port 22    ->  the remote login service
          Address 192.168.1.50, port 5000  ->  an application
        `,
      },
    },
    {
      heading: 'TCP and UDP',
      paragraphs: [
        'TCP, the Transmission Control Protocol, sets up a connection, numbers each piece of data, and resends anything that does not arrive. It is the right choice for web pages, email, and file transfers, where every byte must arrive correctly.',
        'UDP, the User Datagram Protocol, sends messages without setting up a connection or checking delivery. It is faster and has less overhead, so it suits live video, online games, and sensor readings that can be replaced by newer ones.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Need                              Usually use
          Every byte must arrive intact     TCP
          Fast, and a lost packet is fine   UDP
          A web page or a file              TCP
          A live game or a video call       UDP
        `,
      },
    },
    {
      heading: 'Common ports and checking them',
      paragraphs: [
        'A firewall decides which ports traffic may use. A rule that allows port 443 lets web traffic in. Traffic to any port without a matching allow rule is blocked, provided the firewall\'s default is to deny. When a service is unreachable, check whether its port is listening on the server and allowed by the firewall.',
        'Keep a table of the ports your services use. Writing them down makes a firewall review fast, and it reveals services that should not be open.',
        'Ports also have a direction. A client usually picks a temporary high-numbered port for its side of the conversation, while the server listens on a well-known port. When a browser opens a page, the server sees the request arriving at port 443, and the browser replies on the port it chose. Knowing which side listens helps you read firewall logs and connection tests. A firewall rule that names both the port and the source is clearer than one that opens a port to everyone.',
        'Ports below 1024 are often reserved for system services on many operating systems, so a program that needs one may need extra permission. A development server on a higher port, such as 8000 or 5173, avoids that problem. Once a project is shared, the port it uses becomes part of the setup that others must allow through.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'ports.py',
        code: code`
          common = {80: "web", 443: "secure web", 22: "remote login", 25: "email"}
          allowed = {80, 443}

          for port, service in common.items():
              status = "allowed" if port in allowed else "blocked"
              print(port, service, status)
        `,
        output: '80 web allowed\n443 secure web allowed\n22 remote login blocked\n25 email blocked',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking whether a service port is allowed',
    intro: 'This program checks a set of services against a firewall rule that allows only web traffic. The remote login service is blocked, which is what you want unless you need to log in from outside. Run it, and check each line against the rule.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'firewall_check.py',
      code: code`
        services = {"web": 443, "remote login": 22, "video": 5000}
        allowed = {443}

        for name, port in services.items():
            if port in allowed:
                print(name, "on", port, "is open")
            else:
                print(name, "on", port, "is closed")
      `,
      output: 'web on 443 is open\nremote login on 22 is closed\nvideo on 5000 is closed',
    },
    steps: [
      { code: 'services = {"web": 443, ...}', explanation: 'Each service and the port it listens on.' },
      { code: 'allowed = {443}', explanation: 'The firewall rule, written as the set of ports that may receive traffic.' },
      { code: 'if port in allowed:', explanation: 'Checks the port against the rule. A port not in the set is blocked.' },
      { code: 'print(name, "on", port, "is closed")', explanation: 'Shows which services the rule blocks. A closed port is not a broken service, but a rule that keeps it unreachable.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a service that uses port 3306 to the program, and decide whether it should be allowed on a public server. Predict the output, then run it.',
      'Choose TCP or UDP for three tasks: sending an email, streaming a live sensor feed, and downloading a file. Write one reason for each.',
      'List the ports your own computer is listening on, using a command from the terminal, and decide whether each one is expected.',
    ],
  },
  mistakes: [
    { mistake: 'Treating a port number as a separate computer.', fix: 'A port belongs to one device. The address picks the device, and the port picks the service.' },
    { mistake: 'Choosing UDP for data that must arrive intact.', fix: 'Use TCP when a missing piece would break the result, such as a file or a payment.' },
    { mistake: 'Opening a port to the whole internet to test something.', fix: 'Restrict the rule to the addresses that need the service, and close the port after the test.' },
  ],
  quiz: [
    {
      question: 'A web server listens for encrypted web traffic. Which port do most browsers use?',
      options: [
        { text: '443', explanation: 'Yes. Port 443 is the usual port for encrypted web traffic.' },
        { text: '22', explanation: 'Port 22 is for secure remote login, not web traffic.' },
        { text: '25', explanation: 'Port 25 is for sending email between servers.' },
        { text: '80', explanation: 'Port 80 is for plain, unencrypted web traffic.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for port 22?',
      code: { language: 'python', runnable: true, code: code`
        allowed = {443}
        port = 22
        print("open" if port in allowed else "closed")
      ` },
      options: [
        { text: 'closed', explanation: 'Yes. Port 22 is not in the allowed set, so the rule blocks it.' },
        { text: 'open', explanation: 'Port 22 is not in the allowed set, so the program does not print open.' },
        { text: '22', explanation: 'The program prints the status word, not the port number.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Which protocol is the better choice for a live video call where a dropped packet can be skipped?',
      options: [
        { text: 'UDP, because it sends quickly without waiting for lost packets', explanation: 'Yes. A dropped packet can be skipped, so the lower delay of UDP is worth it.' },
        { text: 'TCP, because it resends every packet, so the call is always correct', explanation: 'Resending adds delay, and a live call cannot wait for old packets.' },
        { text: 'Neither, because a video call uses no protocol', explanation: 'Every network exchange uses a protocol. Here the choice is between TCP and UDP.' },
        { text: 'Port 80 only', explanation: 'A port number is not a protocol. Choosing TCP or UDP is the protocol decision.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A port picks the service on a device, TCP delivers every piece while UDP trades that guarantee for speed, and a firewall rule decides which ports traffic may use.',
  resources: [
    { title: 'Ports and protocols', provider: 'Cloudflare', description: 'An overview of TCP, UDP, and the port numbers that services use.', url: 'https://www.cloudflare.com/learning/network-layer/what-is-a-protocol/' },
    { title: 'Transmission Control Protocol', provider: 'Mozilla', description: 'How TCP sets up connections and resends lost data.', url: 'https://developer.mozilla.org/en-US/docs/Glossary/TCP' },
  ],
}

export default lesson
