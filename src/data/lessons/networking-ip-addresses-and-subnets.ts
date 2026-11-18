import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Read an IPv4 address and its subnet mask or prefix length',
    'Work out how many addresses a subnet holds, and which addresses are usable',
    'Decide whether two addresses are on the same network',
  ],
  bigIdea: 'An IPv4 address is four numbers from 0 to 255, written with dots. A subnet mask, or a prefix length such as /24, splits that address into a network part and a host part. Two devices are on the same network when their network parts match.',
  whyItMatters: 'Two computers on a home network cannot reach each other, even though both have addresses that start with 192.168. One has the address 192.168.1.10 with a mask of /24, and the other has 192.168.2.10 with the same mask. Their network parts differ, so they are on different networks. Checking the network part is the fastest way to find the mistake.',
  goalSections: [
    {
      heading: 'Reading an IPv4 address',
      paragraphs: [
        'An IPv4 address is 32 bits, written as four decimal numbers from 0 to 255 separated by dots. Each number is one byte. For example, 192.168.1.10 is four bytes, and a computer uses those bits to decide where a message should go.',
        'The subnet mask says which leading bits are the network part. A /24 prefix means the first 24 bits are the network and the last 8 bits are the host. In a /24 network, the first three numbers identify the network, and the last number identifies the device.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Address:     192.168.1.10
          Prefix:      /24
          Network:     192.168.1  (first 24 bits)
          Host:        .10        (last 8 bits)
        `,
      },
    },
    {
      heading: 'How many addresses a subnet holds',
      paragraphs: [
        'A prefix length tells you how many addresses the subnet holds. The host part has 32 minus the prefix bits, so a /24 has 8 host bits, which gives 2 to the power 8 addresses, or 256. Two of those addresses are reserved: the first is the network address, and the last is the broadcast address. A /24 therefore has 254 usable addresses for devices.',
        'A smaller prefix means a larger network. A /16 has 16 host bits, which is 65,536 addresses. Each extra bit in the prefix halves the number of addresses.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'subnet_size.py',
        code: code`
          import ipaddress

          net = ipaddress.ip_network("192.168.1.0/24")
          print(net.num_addresses)
          print(net.num_addresses - 2)
        `,
        output: '256\n254',
      },
    },
    {
      heading: 'Deciding whether two devices are on the same network',
      paragraphs: [
        'Two addresses are on the same network when their network parts match for the given prefix. Devices on the same network can talk directly through a switch. Devices on different networks need a router to pass messages between them.',
        'Use the prefix to compare, not the first numbers alone. 192.168.1.10 and 192.168.1.200 are on the same /24 network, but 192.168.1.10 and 192.168.2.10 are not.',
        'Subnets also organize a site. A company might give its office computers 192.168.10.0/24, its printers 192.168.20.0/24, and its guest Wi-Fi 192.168.30.0/24. Each group is separate, so a guest device cannot reach the printers unless a router rule allows it. The address plan is part of the security design, not only a numbering scheme. Writing the plan in one table, with each group, its prefix, and its purpose, lets a new engineer see the whole network at a glance and spot a device that is in the wrong place.',
        'Some ranges are reserved for private networks. Ranges such as 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 are handed out inside homes and offices. The router shares one public address with the internet, which is why many homes can use the same private ranges without conflict.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'same_network.py',
        code: code`
          import ipaddress

          net = ipaddress.ip_network("192.168.1.0/24")
          print(ipaddress.ip_address("192.168.1.200") in net)
          print(ipaddress.ip_address("192.168.2.10") in net)
        `,
        output: 'True\nFalse',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking which devices can talk directly',
    intro: 'This program asks whether three devices are on the same /24 network as the laptop. Two devices can reach each other without a router only when they are on the same network. Run it, and read the answer for each device.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'same_subnet.py',
      code: code`
        import ipaddress

        laptop_net = ipaddress.ip_network("192.168.1.0/24")
        devices = ["192.168.1.20", "192.168.1.200", "192.168.2.10"]

        for address in devices:
            on_same = ipaddress.ip_address(address) in laptop_net
            print(address, "same network" if on_same else "different network")
      `,
      output: '192.168.1.20 same network\n192.168.1.200 same network\n192.168.2.10 different network',
    },
    steps: [
      { code: 'laptop_net = ipaddress.ip_network("192.168.1.0/24")', explanation: 'Describes the laptop\'s network. The /24 says the first three numbers identify it.' },
      { code: 'devices = [...]', explanation: 'Three addresses to check against the laptop\'s network.' },
      { code: 'on_same = ipaddress.ip_address(address) in laptop_net', explanation: 'Checks whether the address falls inside the network range, which is the same as comparing the network parts.' },
      { code: 'print(address, "same network" if on_same else "different network")', explanation: 'Reports the result. Different-network devices need a router to reach the laptop.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the laptop network to 10.0.0.0/8 and check which of the three devices are inside it. Predict the answer before you run the program.',
      'Compute how many addresses a /28 network holds, using the rule of 2 to the power of the host bits.',
      'Find your own IP address and subnet mask in your system settings, and decide whether your printer is on the same network.',
    ],
  },
  mistakes: [
    { mistake: 'Comparing only the first number of two addresses.', fix: 'Use the prefix length to find the network part, then compare that part.' },
    { mistake: 'Assigning the network address or the broadcast address to a device.', fix: 'Those two addresses are reserved. Devices use the addresses between them.' },
    { mistake: 'Forgetting that a smaller prefix means a larger network.', fix: 'Compare the host bits. A /16 holds far more addresses than a /24.' },
  ],
  quiz: [
    {
      question: 'How many addresses does a /24 network hold in total?',
      options: [
        { text: '256', explanation: 'Yes. A /24 leaves 8 host bits, and 2 to the power 8 is 256.' },
        { text: '254', explanation: '254 is the number of usable device addresses, after the network and broadcast addresses are removed.' },
        { text: '24', explanation: 'That is the prefix length, not the number of addresses.' },
        { text: '65,536', explanation: 'That is the size of a /16 network, which has 16 host bits.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        import ipaddress
        net = ipaddress.ip_network("10.0.0.0/8")
        print(ipaddress.ip_address("10.4.5.6") in net)
      ` },
      options: [
        { text: 'True', explanation: 'Yes. 10.4.5.6 is inside 10.0.0.0/8, because the first 8 bits match.' },
        { text: 'False', explanation: 'The address shares its first 8 bits with the network, so it is inside.' },
        { text: '16777216', explanation: 'That is the number of addresses. The program checks membership, which is True or False.' },
        { text: 'An error', explanation: 'The module and the address are valid, so the code runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Two devices have the addresses 192.168.1.5 and 192.168.2.5, both with a /24 prefix. What is true?',
      options: [
        { text: 'They are on different networks, so a router is needed to connect them', explanation: 'Yes. The network parts 192.168.1 and 192.168.2 do not match.' },
        { text: 'They are on the same network, because the first two numbers match', explanation: 'Only the first three numbers matter for a /24, and those differ here.' },
        { text: 'They cannot be on any network', explanation: 'Both addresses are valid for a network. They are just on different ones.' },
        { text: 'They are on the same network, because the last numbers match', explanation: 'The last number is the host part and does not decide the network.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'The prefix length splits an address into a network part and a host part, and two devices can talk directly only when their network parts match.',
  resources: [
    { title: 'Python ipaddress module', provider: 'Python.org', description: 'The official reference for working with IP addresses and networks in Python.', url: 'https://docs.python.org/3/library/ipaddress.html' },
    { title: 'Subnetting basics', provider: 'Cisco Networking Academy', description: 'Free networking courses that cover addressing and subnetting.', url: 'https://www.netacad.com/' },
  ],
}

export default lesson
