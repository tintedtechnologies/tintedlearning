import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Diagnose a broken network scenario by testing the layers in order',
    'Explain each finding in plain words, with the evidence that supports it',
    'Write a short fix plan that says what to change, what to test, and what to watch afterward',
  ],
  bigIdea: 'This checkpoint brings the networking lessons together in one realistic problem. You will receive a set of symptoms and test results, decide which layer is failing, explain why the other layers are working, and propose one fix with a test that proves it worked. The method matters more than the answer, because the same steps solve most real problems.',
  whyItMatters: 'Employers and clients rarely ask whether you can name a protocol. They ask what you would do when the office printer disappears from every laptop at nine in the morning. A calm, ordered diagnosis that a non-expert can follow is the skill that makes a network reliable, and it is the skill this checkpoint tests.',
  goalSections: [
    {
      heading: 'The scenario',
      paragraphs: [
        'A small office of twelve people has a router, a switch, a shared printer, and a file server. This morning, staff report that the printer cannot be found, and some laptops show a warning about the Wi-Fi. Email and the public website still work for most people. Two staff members say the Wi-Fi works, but the file server does not open.',
        'Collect the facts before you guess. Which devices are affected? Which services work? When did the problem start? What changed since yesterday? Write the answers down. A diagnosis built on facts is far more reliable than one built on the first idea that comes to mind.',
        'In this scenario, the printer and the file server share a switch, and the website is reached through the router. The facts already point to something local rather than to the internet as a whole.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Office: 12 people, one router, one switch, a shared printer, and a file server
          Symptom: the printer is not found on most laptops, and some laptops show a Wi-Fi warning
          Still working: email, the public website, and Wi-Fi for two staff members
          Not working: the file server for two staff members, and the printer for most laptops
          Changed since yesterday: the router restarted at 8:40 this morning
        `,
      },
    },
    {
      heading: 'Testing in order',
      paragraphs: [
        'Start with the device and work outward. Check whether an affected laptop has a normal address or a 169.254 address. A link-local address means the DHCP step failed, and the printer and file server are not the first place to look.',
        'Next, test the gateway and a public address by its number, then a name. If the address works and the name fails, the problem is DNS. If the gateway fails, the problem is on the local network. Record each result, with the time.',
        'Then test the service. Can you reach the printer and the file server by their addresses? If the address answers but the name does not, the fault is in name resolution. If nothing answers, check the switch and the cable, and check whether the device has changed its address.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          tests = [
              ("laptop address", "192.168.1.31"),
              ("gateway 192.168.1.1", "reply"),
              ("public address", "reply"),
              ("printer by address 192.168.1.20", "no reply"),
              ("file server by name", "no reply"),
          ]
          first_failure = next((name for name, result in tests if result == "no reply"), None)
          print("start here:", first_failure)
        `,
        output: 'start here: printer by address 192.168.1.20',
      },
    },
    {
      heading: 'Explain the finding and the fix',
      paragraphs: [
        'Write the finding in one paragraph. For example: the printer has a fixed address that no longer answers, because the router was restarted and its DHCP pool now includes that address for a different device. The gateway and the internet work, so the router is not the problem.',
        'Propose one fix and one test. The fix might be to reserve the printer\'s address outside the pool, or to give it a reservation tied to its hardware. The test is to ping the printer by its address from two laptops and to print a test page.',
        'Finish with a watch item. What would tell you the problem is back? A printer that drops offline again, or a second device with the same address, would be the signal. Writing this down means the next person does not start from zero.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Finding: the printer's address 192.168.1.20 now belongs to another device,
          because the router restarted and handed that address out from its pool.
          Fix: reserve 192.168.1.20 for the printer's hardware address, outside the pool.
          Test: ping 192.168.1.20 from two laptops, then print a test page.
          Watch: a second device with the same address, or the printer dropping offline.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Ranking the failures to find where to start',
    intro: 'The program below takes a list of tests in the order you ran them and finds the first one that failed. The earlier tests passed, so the failure after them is the first place to look. Run it, then change one result to "reply" and predict the new starting point.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        results = [
            ("laptop has a normal address", True),
            ("gateway answers", True),
            ("public address answers", True),
            ("printer answers by address", False),
            ("file server answers by name", False),
        ]
        first_failure = next((test for test, passed in results if not passed), None)
        failed = [test for test, passed in results if not passed]
        print("start here:", first_failure)
        print("also failing:", len(failed) - 1)
      `,
      output: 'start here: printer answers by address\nalso failing: 1',
    },
    steps: [
      { code: 'results = [...]', explanation: 'The tests in the order they were run, each with a pass or fail.' },
      { code: 'first_failure = next((test for test, passed in results if not passed), None)', explanation: 'Finds the first failed test. Earlier passes rule out the layers before it.' },
      { code: 'print("also failing:", len(failed) - 1)', explanation: 'Counts the other failures, which may be caused by the first one.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write your own five-step test order for a laptop that cannot reach a website, and mark which result would point to DNS and which to the router.',
      'Change the results in the example so that the gateway fails. Predict the starting point, then run the program to check.',
      'Write the finding, the fix, the test, and the watch item for a real or imagined network problem, in no more than two hundred words.',
    ],
  },
  mistakes: [
    { mistake: 'Changing several settings at once after a failure.', fix: 'Change one thing, test, and record the result, so you know which change worked.' },
    { mistake: 'Blaming the internet before testing the local network.', fix: 'Test from the device outward, and let the first failure show where to look.' },
    { mistake: 'Writing a fix with no test that proves it worked.', fix: 'Every fix needs a test you can repeat, and a watch item for the future.' },
  ],
  quiz: [
    {
      question: 'Printers and a file server cannot be reached, but the public website works. Where should testing start?',
      options: [
        { text: 'With the public website', explanation: 'The website works, so testing it first does not narrow the local fault.' },
        { text: 'With the affected devices and the local network, testing outward', explanation: 'Yes. The local services fail while the internet works, so the fault is probably local.' },
        { text: 'With a new computer', explanation: 'Replacing hardware before testing guesses at the cause.' },
        { text: 'With the printer manufacturer', explanation: 'Contacting a vendor is a later step, after the local tests show the fault is in the printer.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print when the gateway fails first?',
      code: { language: 'python', runnable: true, code: code`
        results = [("device address", True), ("gateway answers", False), ("printer", False)]
        first = next((name for name, passed in results if not passed), None)
        print("start here:", first)
      ` },
      options: [
        { text: 'start here: device address', explanation: 'The device address passed, so it is not the first failure.' },
        { text: 'start here: gateway answers', explanation: 'Yes. It is the first test that failed in the list.' },
        { text: 'start here: printer', explanation: 'The printer failed too, but it comes after the gateway test.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why is a watch item part of a good fix?',
      options: [
        { text: 'It says what would show the problem is back, so the next person does not start from zero', explanation: 'Yes. A clear signal of recurrence makes the fix easier to trust and maintain.' },
        { text: 'It replaces the test', explanation: 'A watch item is not a test. The fix still needs a test that proves it worked.' },
        { text: 'It is required by the internet provider', explanation: 'It is good practice, not a provider requirement.' },
        { text: 'It makes the network faster', explanation: 'A watch item records what to monitor. It does not change speed.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A network diagnosis is an ordered set of tests, each with a recorded result, and a good fix ends with a test that proves it worked and a watch item for the future.',
  resources: [
    { title: 'Troubleshooting network connections', provider: 'Cisco Networking Academy', description: 'Free networking courses covering ordered testing and fault isolation.', url: 'https://www.netacad.com/' },
    { title: 'Network troubleshooting guide', provider: 'Cloudflare', description: 'A plain guide to finding where a connection fails, from device to service.', url: 'https://www.cloudflare.com/learning/' },
  ],
}

export default lesson
