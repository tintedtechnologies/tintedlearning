import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how DHCP gives a device its address, mask, gateway, and DNS server',
    'Explain how NAT lets many private devices share one public address',
    'Use these two ideas to diagnose a device that has no address or cannot reach the internet',
  ],
  bigIdea: 'Two services make a home or office network work without manual setup. DHCP hands each device an address and the other settings it needs when it joins. NAT, which stands for network address translation, lets all the private addresses inside share one public address when they talk to the internet.',
  whyItMatters: 'A new phone joins the Wi-Fi, but its apps say there is no internet. The phone shows an address that starts with 169.254, which means it never received one from DHCP. The router is working, and so is the internet. Knowing how addresses are handed out points straight to the cause, and saves an hour of resetting things that are not broken.',
  goalSections: [
    {
      heading: 'DHCP: handing out the settings',
      paragraphs: [
        'When a device joins a network, it does not know its own address. It broadcasts a request asking for one. A DHCP server, usually the router, replies with an offer that includes an address, a subnet mask, a default gateway, and one or more DNS server addresses. The device accepts, and it can then talk on the network.',
        'Each offer is for a limited time, called a lease. The device renews the lease before it expires, and the server can reuse the address if the device leaves. That is why a laptop sometimes shows a different address after a few days, and why this is normal behavior.',
        'The router keeps a pool of addresses it is allowed to hand out, for example from 192.168.1.100 to 192.168.1.200. Addresses outside that pool, such as the router itself and printers with fixed addresses, are kept out of the pool so they are never given to another device.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Device says:   "I need an address"          (broadcast)
          Router offers: 192.168.1.142, mask /24,
                         gateway 192.168.1.1, DNS 192.168.1.1
          Device accepts, lease lasts 24 hours, renews halfway through
        `,
      },
    },
    {
      heading: 'When DHCP fails: the 169.254 address',
      paragraphs: [
        'If a device cannot reach a DHCP server, it gives itself an address in the range 169.254.0.0 to 169.254.255.255. This is called link-local addressing. The device can talk to other devices on the same local link, but it has no gateway and no DNS server, so it cannot reach the internet.',
        'A 169.254 address is therefore a clear sign. The problem is between the device and the DHCP server. Check the Wi-Fi password, the cable, whether the DHCP service on the router is turned on, and whether the pool has run out of addresses.',
        'Running out of addresses is common in busy networks, especially when guests join and never leave. A pool that is too small, or a lease time that is too long, can leave new devices with no address at all.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import ipaddress

          address = ipaddress.ip_address("169.254.23.9")
          print("link-local:", address.is_link_local)
          print("private:", address.is_private)
        `,
        output: 'link-local: True\nprivate: True',
      },
    },
    {
      heading: 'NAT: sharing one public address',
      paragraphs: [
        'Private addresses cannot be used on the open internet, because many homes use the same ones. NAT solves this. The router replaces the private source address of each outgoing request with its own public address, and it remembers which device sent the request and which port it used.',
        'When the reply comes back to the public address, the router looks up its memory and forwards the reply to the correct device. This is why many phones, laptops, and smart devices can all browse at once through one public address.',
        'NAT also means a device inside your network is not reachable from outside by default. A request from the internet has nowhere to go unless the router was told to forward it. This is one reason home networks feel safer, although NAT is not a complete security tool on its own.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Laptop 192.168.1.42 sends out as 203.0.113.9, port 50021
          Phone 192.168.1.57 sends out as 203.0.113.9, port 50022
          A reply to 203.0.113.9, port 50021 is forwarded to 192.168.1.42
          A reply to 203.0.113.9, port 50022 is forwarded to 192.168.1.57
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Spotting a device that did not get an address',
    intro: 'The program below checks a list of devices and reports the ones that have a link-local address, which points to a DHCP problem. It uses the standard library module that understands IP addresses. Run it, then change one address to a normal private address and predict the new output.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        import ipaddress

        devices = {
            "laptop": "192.168.1.42",
            "phone": "169.254.10.7",
            "printer": "192.168.1.20",
        }
        for name, text in devices.items():
            address = ipaddress.ip_address(text)
            if address.is_link_local:
                print(name, "has no DHCP address: check the DHCP server")
            else:
                print(name, "has an address")
      `,
      output: 'laptop has an address\nphone has no DHCP address: check the DHCP server\nprinter has an address',
    },
    steps: [
      { code: 'address = ipaddress.ip_address(text)', explanation: 'Converts the text into an address object the module can check.' },
      { code: 'if address.is_link_local:', explanation: 'A 169.254 address means the device gave itself one, so DHCP did not reply.' },
      { code: 'print(name, "has no DHCP address: ...")', explanation: 'Names the device and points to the most likely cause, so the next step is clear.' },
    ],
  },
  tryIt: {
    instructions: [
      'On a computer you own, find the address, the gateway, and the DNS server it was given. Check whether the address is in the pool you expected.',
      'Change the phone address in the example to 192.168.1.55 and predict the output. Run it to check.',
      'Write the steps you would take if a laptop shows a 169.254 address, in the order you would test them.',
    ],
  },
  mistakes: [
    { mistake: 'Assigning a fixed address that is inside the DHCP pool.', fix: 'Keep fixed addresses outside the pool, or reserve them in the router settings.' },
    { mistake: 'Assuming NAT makes a network secure by itself.', fix: 'Use firewall rules and updated devices as well. NAT hides addresses but does not check traffic.' },
    { mistake: 'Resetting the router before checking the device.', fix: 'Read the device address first. A 169.254 address points to DHCP, not to the internet connection.' },
  ],
  quiz: [
    {
      question: 'A laptop shows an address starting with 169.254. What does this most likely mean?',
      options: [
        { text: 'The internet is fully working', explanation: 'A link-local address means the device could not get a normal address.' },
        { text: 'The device could not reach a DHCP server', explanation: 'Yes. The device picked its own link-local address because no DHCP reply came.' },
        { text: 'The device is a router', explanation: 'Routers have normal addresses, and this one is a sign of a missing DHCP reply.' },
        { text: 'The Wi-Fi password is printed on the device', explanation: 'The address does not reveal a password.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the address 10.0.0.5?',
      code: { language: 'python', runnable: true, code: code`
        import ipaddress
        address = ipaddress.ip_address("10.0.0.5")
        print("link-local:", address.is_link_local)
      ` },
      options: [
        { text: 'link-local: True', explanation: 'The 10.0.0.0 range is not link-local. Link-local addresses start with 169.254.' },
        { text: 'link-local: False', explanation: 'Yes. 10.0.0.5 is a normal private address, not a link-local one.' },
        { text: 'link-local: 10.0.0.5', explanation: 'The program prints True or False, not the address.' },
        { text: 'An error', explanation: 'The address is valid, so the code runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why does NAT make a device inside a home network hard to reach from outside?',
      options: [
        { text: 'Requests from outside have no mapping to a device unless the router forwards them', explanation: 'Yes. The router only forwards replies to requests the inside device started, unless it is told otherwise.' },
        { text: 'The device turns off its network card', explanation: 'NAT does not disable the device. It changes how addresses are shared.' },
        { text: 'The internet provider blocks every private address', explanation: 'The router does the translation. The provider does not block devices one by one.' },
        { text: 'Private addresses are encrypted', explanation: 'NAT does not encrypt traffic. It rewrites addresses.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'DHCP gives each device its address and settings when it joins, a 169.254 address means that hand-off failed, and NAT lets many private devices share one public address.',
  resources: [
    { title: 'DHCP overview', provider: 'Cisco Networking Academy', description: 'Free networking courses that explain how DHCP leases and pools work.', url: 'https://www.netacad.com/' },
    { title: 'Network address translation', provider: 'Wikipedia', description: 'A plain explanation of NAT and why it is used in homes and offices.', url: 'https://en.wikipedia.org/wiki/Network_address_translation' },
  ],
}

export default lesson
