import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what a firewall rule decides, and read a simple rule set in order',
    'Explain what a VPN does, and what it does not do',
    'Choose between allowing, blocking, and separating traffic for a device',
  ],
  bigIdea: 'A firewall checks each connection against a list of rules and allows or blocks it. Rules are read from the top, and the first match decides the result. A VPN creates an encrypted tunnel between your device and another network, which protects the path, but it does not make the devices at either end safe.',
  whyItMatters: 'An office moves its file server behind a firewall. The next morning, staff at home cannot open shared files, and an intern accidentally opens the server to the whole internet to test something. One rule was in the wrong place and another was too broad. Knowing how rules are read and what a VPN covers prevents both mistakes.',
  goalSections: [
    {
      heading: 'Reading firewall rules in order',
      paragraphs: [
        'A firewall rule usually says where traffic comes from, where it is going, which port it uses, and what to do: allow or deny. Real firewalls read their rules from the top. The first rule that matches a connection decides its fate, and the rest are ignored for that connection.',
        'Most firewalls end with a default rule that denies everything not explicitly allowed. This is the safe pattern. Start with everything blocked, then open only the ports the service needs, from only the places that need them.',
        'Because order matters, a broad rule placed near the top can hide a narrow one below it. When you change rules, read the whole list from the top, and ask for each connection which rule would catch it first.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          rules = [
              ("allow", "any", 443),
              ("deny", "any", 22),
              ("allow", "office", 22),
          ]

          def decide(source, port):
              for action, rule_source, rule_port in rules:
                  if rule_port == port and rule_source in ("any", source):
                      return action
              return "deny"

          print(decide("home", 22))
          print(decide("office", 22))
          print(decide("home", 443))
        `,
        output: 'deny\ndeny\nallow',
      },
    },
    {
      heading: 'The order trap',
      paragraphs: [
        'The example above shows a trap. The rule that allows the office to reach port 22 comes after the rule that denies everyone on port 22, so the office is also blocked. The later rule can never match. Moving the office rule above the deny rule fixes it.',
        'Test a rule change with a connection that should pass and one that should fail. A rule set that only gets tested by the connection you want to allow can hide a broad rule that lets too much through.',
        'Write a short comment with each rule. Saying why a port is open makes it easy to remove the rule when the reason no longer exists.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Rule 1: deny any to port 22
          Rule 2: allow office to port 22
          An office connection to port 22 matches rule 1 first, so it is denied.
          Fix: move "allow office" above "deny any".
        `,
      },
    },
    {
      heading: 'What a VPN does and does not do',
      paragraphs: [
        'A VPN, which stands for virtual private network, creates an encrypted tunnel from your device to a server or network you trust. Traffic inside the tunnel cannot be read by people on the local Wi-Fi, and the remote network sees the traffic as coming from inside its own network.',
        'A VPN is useful on untrusted networks, to reach a private office system from home, or to join two offices as one network. It does not make a weak password strong, and it does not protect a device that has malware. The tunnel protects the path, and the endpoints still need updates and good habits.',
        'Choose a VPN from a provider you trust, because that provider can see where your traffic goes. A free service that is paid for by selling data is not protecting you.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Protected: traffic between your laptop and the office network while you use public Wi-Fi
          Not protected: a laptop infected with malware, a weak password on the office server, or a fake login page where you type your password
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Testing a rule set with real connections',
    intro: 'The program below uses the same rule order as the example and tests three connections. It reports each decision in a way you can check against the rules by eye. Run it, then move the office rule above the deny rule and predict the new result for office traffic.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        rules = [
            ("allow", "any", 443),
            ("deny", "any", 22),
            ("allow", "office", 22),
        ]
        tests = [("home", 443, "allow"), ("office", 22, "allow"), ("home", 22, "deny")]

        def decide(source, port):
            for action, rule_source, rule_port in rules:
                if rule_port == port and rule_source in ("any", source):
                    return action
            return "deny"

        for source, port, expected in tests:
            result = decide(source, port)
            print(source, port, "->", result, "(ok)" if result == expected else "(WRONG)")
      `,
      output: 'home 443 -> allow (ok)\noffice 22 -> deny (WRONG)\nhome 22 -> deny (ok)',
    },
    steps: [
      { code: 'rules = [...]', explanation: 'The rules in the order the firewall reads them. Order is part of the rule set.' },
      { code: 'tests = [...]', explanation: 'Each test names a connection and the decision it should get, so a mistake shows up as WRONG.' },
      { code: 'for action, rule_source, rule_port in rules:', explanation: 'Reads the rules from the top and stops at the first match, the same way a firewall does.' },
    ],
  },
  tryIt: {
    instructions: [
      'Move the office rule above the deny rule in the example and predict the output for the office test. Run it to check.',
      'Write three rules for a home server: allow web traffic from anywhere, allow remote login only from your own address, and deny everything else. Put them in the right order.',
      'Find out whether your computer has a firewall turned on. Write down where the setting is and whether it blocks incoming connections by default.',
    ],
  },
  mistakes: [
    { mistake: 'Putting a broad allow rule above a narrow deny rule.', fix: 'Read the rules from the top and check which rule catches each connection first.' },
    { mistake: 'Opening a port to everyone to test something.', fix: 'Limit the rule to the sources that need it, and close the port after the test.' },
    { mistake: 'Believing a VPN makes a device safe on its own.', fix: 'Keep the device updated and use strong passwords. A VPN protects the path, not the device.' },
  ],
  quiz: [
    {
      question: 'In a firewall rule list read from the top, what decides what happens to a connection?',
      options: [
        { text: 'The last rule in the list', explanation: 'Firewalls usually stop at the first match, so the last rule is often never used.' },
        { text: 'The first rule that matches the connection', explanation: 'Yes. The first match decides, and later rules are not checked for that connection.' },
        { text: 'The rule with the longest comment', explanation: 'Comments do not affect how rules are applied.' },
        { text: 'A random rule each time', explanation: 'Rules are applied in a fixed order, not at random.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for office traffic on port 22 with the rules shown?',
      code: { language: 'python', runnable: true, code: code`
        rules = [("deny", "any", 22), ("allow", "office", 22)]
        def decide(source, port):
            for action, src, p in rules:
                if p == port and src in ("any", source):
                    return action
            return "deny"
        print(decide("office", 22))
      ` },
      options: [
        { text: 'allow', explanation: 'The deny rule comes first and matches office traffic, so the allow rule is never reached.' },
        { text: 'deny', explanation: 'Yes. The deny rule is first, so it matches before the office rule.' },
        { text: 'office', explanation: 'The program prints the action, not the source.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Which statement about a VPN is correct?',
      options: [
        { text: 'It protects the path between your device and the other network, but the devices still need updates', explanation: 'Yes. The tunnel protects traffic, and the endpoints need their own protection.' },
        { text: 'It makes any password strong', explanation: 'A VPN does not change how strong a password is.' },
        { text: 'It removes all malware from a device', explanation: 'A VPN does not scan or clean a device.' },
        { text: 'It makes every website safe to use', explanation: 'A VPN does not check whether a website is honest.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Firewall rules are read from the top and the first match wins, so keep the default deny and open only what is needed, and remember that a VPN protects the path while the devices still need their own protection.',
  resources: [
    { title: 'Firewall basics', provider: 'Cisco Networking Academy', description: 'Free networking courses that cover firewall rules, ordering, and default policies.', url: 'https://www.netacad.com/' },
    { title: 'What is a VPN?', provider: 'Cloudflare', description: 'A plain explanation of VPN tunnels and what they protect.', url: 'https://www.cloudflare.com/learning/access-management/what-is-a-vpn/' },
  ],
}

export default lesson
