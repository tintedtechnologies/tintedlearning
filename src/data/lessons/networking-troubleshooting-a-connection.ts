import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Follow the layers of a connection problem in order, from the cable to the application',
    'Use ping, traceroute, and a name lookup to find where a connection stops',
    'Write down what you tested, so the next person does not repeat it',
  ],
  bigIdea: 'A connection problem has a place where it stops, and each test narrows the search. Test the local link first, then the gateway, then the internet address, then the name, and finally the service port. Each step answers one yes-or-no question, and the first failing step points to the fault.',
  whyItMatters: 'A user says the internet is down. You could restart everything, or you could spend two minutes testing in order. A ping to the gateway passes, a ping to an internet address passes, and a name lookup fails. The problem is DNS, and you can fix it without touching the router. Testing in order saves the restarts.',
  goalSections: [
    {
      heading: 'Testing from the inside out',
      paragraphs: [
        'Start with the device itself. Check that it has an address, a subnet mask, and a default gateway, and that the network link is up. An address that starts with 169.254 usually means the device could not get one from the network, which points to the local link or the address server.',
        'Next, test the gateway. If the gateway does not answer, the problem is on the local network. If the gateway answers but the internet does not, the problem is past the gateway. Testing in this order keeps each step small.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          1. Does the device have an address, mask, and gateway?
          2. Does the default gateway answer?
          3. Does an internet address answer?
          4. Does a name resolve to an address?
          5. Does the service port accept a connection?
        `,
      },
    },
    {
      heading: 'Ping and traceroute',
      paragraphs: [
        'Ping sends a short message and waits for a reply. A reply shows the address is reachable and how long the round trip took. No reply does not prove the address is down, because some devices block replies, so pair ping with another test before you decide.',
        'Traceroute shows each router on the path to a destination. The last hop that answers shows how far the message got, and the first hop that stops answering is the likely place the path breaks. Some hops are set not to reply, so look for a pattern rather than one silent hop.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          ping 192.168.1.1        # the default gateway
          ping 93.184.215.14      # an internet address (an example value)
          traceroute example.com  # the path, one hop per line
        `,
      },
    },
    {
      heading: 'Writing down what you found',
      paragraphs: [
        'Keep a short record of each test: the command, the result, and what it rules out. A record like this lets a colleague continue your work without repeating the steps, and it shows what changed after a fix.',
        'Stop when you find the failing layer, fix it, and test again from the start. A fix that works at one step should make the later steps pass, and if it does not, you may have found a second problem.',
        'Write the result of each test on its own line, with the time and the command. Many problems come back later, and a dated record shows whether a fix held or whether the fault is intermittent. Intermittent faults often point to a loose cable, a busy Wi-Fi channel, or a device that is overheating, so the timing is part of the evidence.',
        'When you ask for help, send the test log rather than a description from memory. A list that says gateway passed, name lookup failed, with the time it happened, gives the next person a place to start. It also protects you, because the record shows what you already ruled out.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'test_log.py',
        code: code`
          tests = [
              ("gateway", True),
              ("internet address", True),
              ("name lookup", False),
          ]
          for name, passed in tests:
              print(name, "passed" if passed else "failed")
          first_failure = next(name for name, passed in tests if not passed)
          print("Start here:", first_failure)
        `,
        output: 'gateway passed\ninternet address passed\nname lookup failed\nStart here: name lookup',
      },
    },
  ],
  seeItInAction: {
    title: 'Finding the first failing step',
    intro: 'This program records the results of five tests in order and finds the first one that failed. The earlier steps passed, so the search points to the first failure and nothing after it. Run it, and check that the program names the right step.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'first_failure.py',
      code: code`
        tests = [
            ("device address", True),
            ("gateway", True),
            ("internet address", True),
            ("name lookup", False),
            ("service port", False),
        ]
        first_failure = next(name for name, passed in tests if not passed)
        print("Start here:", first_failure)
      `,
      output: 'Start here: name lookup',
    },
    steps: [
      { code: 'tests = [...]', explanation: 'The tests in the order you ran them, each with its result.' },
      { code: 'next(name for name, passed in tests if not passed)', explanation: 'Walks the list in order and returns the first test that failed. The service port failure is after it, so it is not the first problem.' },
      { code: 'print("Start here:", first_failure)', explanation: 'Names the step to fix first. The later failures may be caused by the first one.' },
    ],
  },
  tryIt: {
    instructions: [
      'Run a ping to your default gateway. Record whether it replies and how long the reply takes.',
      'Run a traceroute to a public website. Count the hops and note the first hop that does not answer, if there is one.',
      'Write a test log for a real problem, or a made-up one, with the order of tests and the result of each. Use the first-failure program to find where to start.',
    ],
  },
  mistakes: [
    { mistake: 'Restarting devices before testing where the connection stops.', fix: 'Test in order from the device outward. The first failing step tells you what to restart, if anything.' },
    { mistake: 'Treating one silent hop in traceroute as a broken path.', fix: 'Look for a pattern. Many routers do not reply to probes, but traffic still passes.' },
    { mistake: 'Fixing a later step while an earlier step still fails.', fix: 'Fix the first failure, then test again from the start.' },
  ],
  quiz: [
    {
      question: 'The gateway answers ping, but a public address does not. Where is the problem most likely?',
      options: [
        { text: 'Beyond the gateway, on the path to the internet', explanation: 'Yes. The local link and the gateway work, so the failure is past the gateway.' },
        { text: 'On the local cable between the laptop and the gateway', explanation: 'That link is working, because the gateway answered.' },
        { text: 'In the web browser only', explanation: 'A ping test does not use the browser, so the browser is not the cause here.' },
        { text: 'In the power supply of the laptop', explanation: 'A laptop with a working network link is not failing at the power supply level in this test.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print as the place to start?',
      code: { language: 'python', runnable: true, code: code`
        tests = [("gateway", True), ("name lookup", False), ("service", False)]
        first = next(name for name, passed in tests if not passed)
        print("Start here:", first)
      ` },
      options: [
        { text: 'Start here: name lookup', explanation: 'Yes. It is the first failed test in the list.' },
        { text: 'Start here: service', explanation: 'The service test also failed, but it comes after the name lookup.' },
        { text: 'Start here: gateway', explanation: 'The gateway test passed, so it is not the first failure.' },
        { text: 'An error', explanation: 'The generator finds a failed test, so the code runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'A traceroute shows one hop with no reply, and later hops do reply. What should you conclude?',
      options: [
        { text: 'That hop may simply not answer probes, so look for a pattern before deciding', explanation: 'Yes. Some routers do not reply, but traffic still passes through them.' },
        { text: 'The connection is definitely broken at that hop', explanation: 'A silent hop does not prove a break, because later hops replied.' },
        { text: 'The whole network must be replaced', explanation: 'One silent hop is not enough evidence for that.' },
        { text: 'The traceroute test is useless', explanation: 'Traceroute is useful, especially when you read the pattern across all hops.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Test in order from the device outward, use ping and traceroute to narrow the failing step, and fix the first failure before testing again.',
  resources: [
    { title: 'Troubleshooting network connections', provider: 'Cisco Networking Academy', description: 'Free networking courses that cover troubleshooting with ping and traceroute.', url: 'https://www.netacad.com/' },
    { title: 'Traceroute and MTR', provider: 'Cloudflare', description: 'An explanation of how traceroute maps the path to a destination.', url: 'https://www.cloudflare.com/learning/network-layer/what-is-mtr/' },
  ],
}

export default lesson
