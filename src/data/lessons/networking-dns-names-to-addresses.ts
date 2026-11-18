import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why computers use IP addresses, and why people use names',
    'Describe how a name is turned into an address, step by step',
    'Find and fix a problem where a name resolves to the wrong address',
  ],
  bigIdea: 'The Domain Name System, DNS, turns a name such as example.com into an IP address. Your computer asks a resolver, which may ask other servers, until it gets an answer and keeps a copy for a while. Most connection problems that look like "the site is down" are name problems, not server problems.',
  whyItMatters: 'A website works on your phone but not on your laptop. Both are on the same Wi-Fi. The phone uses the network\'s DNS server, while the laptop was set to a private DNS server that has an old record. The laptop asks the wrong place and gets an address for a server that was moved last month. Knowing how names become addresses tells you where to check.',
  goalSections: [
    {
      heading: 'Why names and addresses are separate',
      paragraphs: [
        'People remember names, and computers need numbers. An IP address identifies a device on a network, and it can change when a device moves or a service is rebuilt. A name stays the same while the address behind it changes.',
        'DNS is the system that holds the mapping between them. It is distributed, so no single server holds every name. Each part of the system is responsible for a piece of the namespace, and it hands out answers for that piece.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Name:     www.example.com
          Address:  a number like 93.184.215.14 (an example value)
          The name stays the same. The address can change.
        `,
      },
    },
    {
      heading: 'How a name becomes an address',
      paragraphs: [
        'Your device first checks its own cache, a short memory of recent answers. If the name is not there, it asks a recursive resolver, usually run by your internet provider or by a public service. The resolver walks the hierarchy: root servers point to the server for the top-level domain, that server points to the server for the domain, and that server returns the address.',
        'Each answer carries a time to live, which says how long it may be kept. When the time runs out, the device asks again. This is why a change to a website can take a while to be seen everywhere.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          1. Check the local cache.
          2. Ask the recursive resolver.
          3. The resolver asks a root server, then a top-level domain server,
             then the server for the domain.
          4. The answer is returned and cached for its time to live.
        `,
      },
    },
    {
      heading: 'Finding a name that resolves to the wrong address',
      paragraphs: [
        'When a name points to the wrong place, check three things in order. First, does the name resolve at all? Second, which address does it give, and does that address answer? Third, is an old cached answer still in use? A tool that asks for the address directly, such as nslookup or dig, shows what the resolver returns.',
        'Separate a DNS problem from a server problem. If you can reach the server by its address but not by its name, the fault is in name resolution. If neither works, check the network first.',
        'DNS records have types. The two you will meet most often are A records, which hold an IPv4 address, and AAAA records, which hold an IPv6 address. A name can have several records, and the resolver may return them in a different order. A website that moves to a new host usually changes its A record, and every cache must expire before most users see the change.',
        'Watch for local shortcuts. A browser can keep its own copy of an address, and a device can keep a local override in its hosts file. Either can point a name at an old address long after the public record changed. When a name is wrong on one device only, check the local cache and the hosts file before you change anything on the server.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'name_check.py',
        code: code`
          expected = {"www.example.com": "93.184.215.14"}
          answers = {"www.example.com": "203.0.113.9"}

          for name, address in answers.items():
              if address == expected[name]:
                  print(name, "resolves correctly")
              else:
                  print(name, "resolves to", address, "but expected", expected[name])
        `,
        output: 'www.example.com resolves to 203.0.113.9 but expected 93.184.215.14',
      },
    },
  ],
  seeItInAction: {
    title: 'Comparing a resolver answer with the expected address',
    intro: 'This check compares the address a resolver returned with the address you expect. A mismatch means a stale record or a wrong resolver, and you should check the cache or the resolver setting. Run it, and read the one line it prints.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'resolve_check.py',
      code: code`
        expected = {"www.example.com": "93.184.215.14", "api.example.com": "198.51.100.7"}
        answers = {"www.example.com": "93.184.215.14", "api.example.com": "203.0.113.9"}

        for name in expected:
            if answers[name] == expected[name]:
                print(name, "ok")
            else:
                print(name, "mismatch: flush the cache or check the resolver")
      `,
      output: 'www.example.com ok\napi.example.com mismatch: flush the cache or check the resolver',
    },
    steps: [
      { code: 'expected = {...}', explanation: 'The addresses you know are correct, from the owner of the names or a trusted record.' },
      { code: 'answers = {...}', explanation: 'What the resolver returned on your device. Here one answer differs from the expected one.' },
      { code: 'if answers[name] == expected[name]:', explanation: 'Compares the two addresses for each name, one at a time.' },
      { code: 'print(name, "mismatch: ...")', explanation: 'Points to the likely fix. A stale cache or a wrong resolver is the first thing to check.' },
    ],
  },
  tryIt: {
    instructions: [
      'Run the command that asks your system for the address of a public website, and write down the address it returns.',
      'Add a third name to the check, with an address you expect, and predict whether it will match before you run the program.',
      'Find out which DNS server your computer uses, and write down whether it is your network default or one you chose.',
    ],
  },
  mistakes: [
    { mistake: 'Assuming a website is down when only its name fails.', fix: 'Try the server by its address. If that works, the problem is in name resolution.' },
    { mistake: 'Editing a DNS record and expecting every device to change at once.', fix: 'Caches keep old answers until their time to live expires. Plan changes around that delay.' },
    { mistake: 'Trusting a single resolver without checking the answer.', fix: 'Compare the answer with a second resolver or with the value the owner published.' },
  ],
  quiz: [
    {
      question: 'A website opens by its address but not by its name. What is the most likely cause?',
      options: [
        { text: 'A name resolution problem, such as a stale or wrong DNS answer', explanation: 'Yes. The server works, so the problem is turning the name into an address.' },
        { text: 'The server is completely offline', explanation: 'A server that is offline would also fail when reached by its address.' },
        { text: 'The cable is broken', explanation: 'A broken cable would stop the address too, not just the name.' },
        { text: 'The website has no content', explanation: 'That would not stop the name from resolving or the address from answering.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        expected = {"a.test": "1.1.1.1"}
        answers = {"a.test": "1.1.1.1"}
        for name in expected:
            print(name, "ok" if answers[name] == expected[name] else "mismatch")
      ` },
      options: [
        { text: 'a.test ok', explanation: 'Yes. The two addresses match, so the check passes.' },
        { text: 'a.test mismatch', explanation: 'The two addresses are equal, so this message does not print.' },
        { text: '1.1.1.1', explanation: 'The program prints the name and the status, not the address.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why does a DNS change sometimes take a while to appear everywhere?',
      options: [
        { text: 'Devices keep old answers until the time to live expires', explanation: 'Yes. Cached answers stay in use until their time to live runs out.' },
        { text: 'DNS only updates once a year', explanation: 'DNS answers update on the schedule the time to live sets, not on a yearly cycle.' },
        { text: 'Changes must be printed on paper first', explanation: 'DNS changes are made in the record system, not on paper.' },
        { text: 'The domain name has to be re-registered', explanation: 'Changing a record does not require re-registering the name.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'DNS turns a name into an address through a chain of servers and caches, so when a name fails, check whether the address works before you blame the server.',
  resources: [
    { title: 'What is DNS?', provider: 'Cloudflare', description: 'A plain explanation of how DNS resolves names, with the roles of each server.', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
    { title: 'Domain Name System', provider: 'Mozilla', description: 'How the DNS hierarchy works, with examples of queries and answers.', url: 'https://developer.mozilla.org/en-US/docs/Glossary/DNS' },
  ],
}

export default lesson
