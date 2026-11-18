import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe what a network is, and name the devices that move data across it',
    'Explain the difference between a switch, a router, and an access point',
    'Trace the path of a message from one laptop to a server on another network',
  ],
  bigIdea: 'A network is a set of devices that can send data to each other over links. A switch connects devices inside one local network, a router connects one network to another, and an access point connects wireless devices to the wired network. Each message follows a path through these devices, and each device decides where to send it next.',
  whyItMatters: 'A new office has a laptop that cannot reach the printer, but it can reach the internet. The printer and the laptop are on the same switch, so the problem is not the cable between them. Knowing which device does which job tells you where to look first, and saves a morning of guessing.',
  goalSections: [
    {
      heading: 'What a network is',
      paragraphs: [
        'A network is a group of devices connected so they can exchange data. The devices can be computers, phones, printers, cameras, or sensors. The links can be copper cable, fiber, or radio waves. What matters is that every device can send a message and expect a reply.',
        'Networks come in sizes. A local area network, or LAN, covers one building or one home. A wide area network, or WAN, connects sites that are far apart. The internet is a very large network of networks, joined by agreed rules for addressing and routing.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Laptop ---+
                    |
          Printer --+-- Switch --- Router --- Internet
                    |
          Phone ----+
        `,
      },
    },
    {
      heading: 'Switches, routers, and access points',
      paragraphs: [
        'A switch connects devices within the same local network. When a laptop sends a message to a printer on the same switch, the switch forwards it to the printer and does not send it anywhere else. Switches learn which device is on which port, so traffic goes only where it is needed.',
        'A router connects one network to another. It reads the destination address and decides which way to send the message next. Your home router usually does both jobs: it routes between your network and the internet, and it contains a switch for the devices plugged into it.',
        'An access point connects wireless devices to the wired network. Phones and laptops join the wireless network, and the access point passes their messages onto the switch.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Device            Job
          Switch            Connects devices in one local network
          Router            Connects one network to another
          Access point      Connects wireless devices to the wired network
        `,
      },
    },
    {
      heading: 'Tracing a message across a network',
      paragraphs: [
        'Suppose a laptop opens a web page on a server in another city. The laptop sends the request to its default gateway, which is usually the router. The router forwards it toward the internet, and each router along the way passes it to the next one that is closer to the destination. The server replies along a path that may be different.',
        'Each device only needs to know the next step. This is why one broken link can stop traffic to some destinations but not others. When you troubleshoot, ask which device the message reached last.',
        'An address and a route are different things. The address names the destination, and the route is the chain of devices that carry the message there. A device on your network does not need to know the whole route. It only needs to know the next device to send to, and that device makes the same decision. This is why a laptop can reach a website it has never heard of.',
        'Home networks show these jobs clearly. Your phone connects to the access point, the access point connects to the switch inside the router, and the router connects to your internet provider. Drawing that path on paper makes the next troubleshooting step much easier to choose.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          1. Laptop sends request to its default gateway (the router).
          2. Router forwards it toward the internet.
          3. Each router on the path passes it to the next closer one.
          4. The server replies along the path back to the laptop.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deciding which device handles a message',
    intro: 'This program holds a small table of devices and their jobs, then answers where a message stops for two destinations. Run it, and check that a printer on the same switch never reaches the router.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'path.py',
      code: code`
        same_network = {"printer": True, "phone": True, "web_server": False}

        for destination, local in same_network.items():
            if local:
                print(destination, "stays on the switch")
            else:
                print(destination, "goes through the router")
      `,
      output: 'printer stays on the switch\nphone stays on the switch\nweb_server goes through the router',
    },
    steps: [
      { code: 'same_network = {...}', explanation: 'A small record of whether each destination is on the same local network as the laptop.' },
      { code: 'for destination, local in same_network.items():', explanation: 'Visits each destination in turn, so each one gets the same check.' },
      { code: 'if local:', explanation: 'A local destination is reached through the switch. Nothing needs to leave the building.' },
      { code: 'print(destination, "goes through the router")', explanation: 'A remote destination needs the router, because the router connects this network to others.' },
    ],
  },
  tryIt: {
    instructions: [
      'Draw your home network: list each device, the switch or router it connects to, and which device reaches the internet.',
      'Change the program so the web server is on the same network. Predict the output, then run it.',
      'Open a terminal and run the command that shows your default gateway on your system, then find that device in your drawing.',
    ],
  },
  mistakes: [
    { mistake: 'Calling every network device a router.', fix: 'Name the job first. A switch joins devices locally, a router joins networks, and an access point joins wireless devices.' },
    { mistake: 'Looking at the cable between two devices when they cannot talk.', fix: 'Check whether the devices are on the same network and whether their gateway works.' },
    { mistake: 'Assuming the internet is one single network.', fix: 'The internet is many networks connected by routers that follow shared rules.' },
  ],
  quiz: [
    {
      question: 'Two laptops on the same switch cannot be reached by each other. Which device handles traffic between them?',
      options: [
        { text: 'The switch', explanation: 'Yes. The switch forwards traffic between devices on the same local network.' },
        { text: 'The internet', explanation: 'Traffic between two devices on the same switch does not need to leave the local network.' },
        { text: 'The wireless access point', explanation: 'An access point is for wireless devices. These two are on the same switch.' },
        { text: 'A web server', explanation: 'A web server is not in the path between two laptops on the same switch.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the web server?',
      code: { language: 'python', runnable: true, code: code`
        same_network = {"web_server": False}
        for destination, local in same_network.items():
            print(destination, "goes through the router" if not local else "stays on the switch")
      ` },
      options: [
        { text: 'web_server goes through the router', explanation: 'Yes. The web server is not on the local network, so the router is needed.' },
        { text: 'web_server stays on the switch', explanation: 'That is the answer when the destination is local, which this one is not.' },
        { text: 'web_server', explanation: 'The program prints a sentence about the route, not just the name.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Which device connects wireless phones to the wired part of the network?',
      options: [
        { text: 'An access point', explanation: 'Yes. Access points connect wireless devices to the wired network.' },
        { text: 'A router only', explanation: 'A router can have wireless features, but its job is connecting networks. The access point is the device that joins wireless clients.' },
        { text: 'A cable', explanation: 'A cable carries data, but it does not connect wireless devices by itself.' },
        { text: 'A server', explanation: 'A server holds data and services. It does not join wireless devices to the network.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A switch joins devices inside one network, a router joins networks, and an access point joins wireless devices, so knowing which job each device does tells you where a message can stop.',
  resources: [
    { title: 'How the web works', provider: 'Mozilla', description: 'An approachable explanation of networks, routers, and how a request reaches a server.', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works' },
    { title: 'Networking Basics', provider: 'Cisco Networking Academy', description: 'Free introductory networking courses from Cisco Networking Academy.', url: 'https://www.netacad.com/' },
  ],
}

export default lesson
