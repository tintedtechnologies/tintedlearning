import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Set up a home or small office Wi-Fi network with a strong password and current encryption',
    'Separate guests and smart devices from the computers that hold important files',
    'Run a simple review of the devices on a network and remove the ones that should not be there',
  ],
  bigIdea: 'Most home and small office networks are attacked through simple weaknesses: an old encryption setting, a weak shared password, a router that never gets updated, and devices nobody remembers joining. Securing a network means fixing those four things, then separating the devices that matter from the ones that do not, and reviewing the list regularly.',
  whyItMatters: 'A family buys a new camera and a smart plug, and both are set up with the default password printed on the box. A neighbor who guesses the Wi-Fi password can see the camera and try the same password on the laptop that holds the family photos. The router was never updated, and nobody checked the device list in two years. Each step is small, and each one closes a real door.',
  goalSections: [
    {
      heading: 'The router and the Wi-Fi password',
      paragraphs: [
        'Wi-Fi security is set in the router. Choose WPA3 if the router supports it, or WPA2 if it does not, and turn off older options such as WEP and WPA, which can be broken quickly. The encryption setting is one of the few security controls you change once and then benefit from every day.',
        'The Wi-Fi password should be long and random. A passphrase of four or five unrelated words is strong and easy to type. Do not reuse a password from another account, and do not keep the default that came with the router. A password manager can create and store it.',
        'Change the router\'s admin password too. Many routers come with a shared default, and that password controls every other setting. Use a unique one and store it with the Wi-Fi password, so you can recover the network if the settings are ever lost.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def check_wifi(encryption, passphrase):
              problems = []
              if encryption not in ("WPA2", "WPA3"):
                  problems.append("use WPA2 or WPA3")
              if len(passphrase) < 16:
                  problems.append("use a longer passphrase")
              return problems or ["looks good"]

          print(check_wifi("WEP", "sunshine"))
          print(check_wifi("WPA3", "correct horse battery staple"))
        `,
        output: "['use WPA2 or WPA3', 'use a longer passphrase']\n['looks good']",
      },
    },
    {
      heading: 'Separating the devices',
      paragraphs: [
        'Many routers offer a guest network. Put visitors there, so their phones cannot reach the computers and printers on your main network. A guest network is one of the simplest protections a home can have, and it costs nothing to turn on.',
        'Smart devices such as cameras, plugs, and speakers are often the weakest part of a home network, because they receive few updates and their makers may not last. Place them on a separate network if your router allows it. Then a weakness in one device cannot reach the files on your laptop.',
        'Keep the devices that hold important data on the main network, and make sure those computers are updated and locked with their own passwords. The idea is simple: the more important the device, the fewer other devices can reach it.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Main network: laptop, phone, file server, printer
          Guest network: visitor phones
          Device network: camera, smart plug, speaker
          Rule: the device network cannot reach the main network
        `,
      },
    },
    {
      heading: 'Reviewing the device list',
      paragraphs: [
        'Your router shows a list of connected devices. Look at it at least once a month. Every device should be one you recognize. An unknown name is a question to answer, and a device you no longer own should be removed from the network and its access revoked.',
        'Check for updates on the router and the devices. Turn on automatic updates where you can. An old router with unpatched bugs is a common entry point, and replacing a router that is no longer supported is a reasonable security decision.',
        'Write the review as a short list: the device, its owner, whether it is updated, and whether it is on the right network. A list you keep is far easier to act on than a memory of what was once set up.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          devices = {"laptop": "Sam", "smart plug": None, "tablet": "Ada"}
          for name, owner in devices.items():
              print(name, "owner:", owner if owner else "unknown, identify or remove")
        `,
        output: 'laptop owner: Sam\nsmart plug owner: unknown, identify or remove\ntablet owner: Ada',
      },
    },
  ],
  seeItInAction: {
    title: 'Reviewing a home device list',
    intro: 'The program below reads a small device list, flags anything unknown, and flags devices that are not on the separate network. Run it, then add a device you own and predict whether it is flagged.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        devices = [
            {"name": "laptop", "owner": "Sam", "network": "main", "updated": True},
            {"name": "smart plug", "owner": "Sam", "network": "main", "updated": False},
            {"name": "unknown tablet", "owner": None, "network": "guest", "updated": True},
        ]
        for device in devices:
            notes = []
            if device["owner"] is None:
                notes.append("unknown owner: remove or identify")
            if device["name"] == "smart plug" and device["network"] == "main":
                notes.append("move to the device network")
            if not device["updated"]:
                notes.append("not updated")
            print(device["name"], "-", "; ".join(notes) if notes else "ok")
      `,
      output: 'laptop - ok\nsmart plug - move to the device network; not updated\nunknown tablet - unknown owner: remove or identify',
    },
    steps: [
      { code: 'if device["owner"] is None:', explanation: 'A device with no known owner is the first thing to check. It may be a guest or something left behind.' },
      { code: 'if device["name"] == "smart plug" and device["network"] == "main":', explanation: 'Flags the kind of device that belongs on a separate network, so a weak point cannot reach the laptop.' },
      { code: 'if not device["updated"]:', explanation: 'Flags devices that are behind on updates, which are common sources of known weaknesses.' },
    ],
  },
  tryIt: {
    instructions: [
      'Log in to your router and check the Wi-Fi encryption setting. Write down what it says and whether the admin password was changed from the default.',
      'Look at the list of connected devices. Name each one, and mark any you cannot identify.',
      'Set up a guest network if your router supports one, and check that a phone on the guest network cannot see a computer on the main network.',
    ],
  },
  mistakes: [
    { mistake: 'Keeping the default admin password on the router.', fix: 'Change it to a unique password and store it with your other important passwords.' },
    { mistake: 'Putting smart devices on the same network as the computers that hold files.', fix: 'Use a guest or device network where the router supports one.' },
    { mistake: 'Ignoring unknown devices on the list.', fix: 'Identify each device or remove it, and revoke its access.' },
  ],
  quiz: [
    {
      question: 'Which Wi-Fi encryption setting is the safest choice from the options listed here?',
      options: [
        { text: 'WEP', explanation: 'WEP is old and can be broken quickly, so it should be turned off.' },
        { text: 'WPA3', explanation: 'Yes. WPA3 is the current standard, and WPA2 is a safe fallback when a router lacks it.' },
        { text: 'Open network with no password', explanation: 'An open network gives anyone nearby access to the traffic.' },
        { text: 'WPA', explanation: 'The original WPA is older and weaker than the current options.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for a 9 character passphrase with WPA3?',
      code: { language: 'python', runnable: true, code: code`
        def check(encryption, passphrase):
            problems = []
            if encryption not in ("WPA2", "WPA3"):
                problems.append("use WPA2 or WPA3")
            if len(passphrase) < 16:
                problems.append("use a longer passphrase")
            return problems or ["looks good"]
        print(check("WPA3", "sunshine9"))
      ` },
      options: [
        { text: "['looks good']", explanation: 'The passphrase is shorter than 16 characters, so the check flags it.' },
        { text: "['use a longer passphrase']", explanation: 'Yes. The encryption is fine, but the passphrase is only nine characters.' },
        { text: "['use WPA2 or WPA3']", explanation: 'The encryption is WPA3, so this message does not appear.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why put smart devices on a separate network from the main computers?',
      options: [
        { text: 'So a weakness in one device cannot reach the files on the computers', explanation: 'Yes. Separation limits what a compromised device can reach.' },
        { text: 'So the devices run faster', explanation: 'Separation is about security, not speed.' },
        { text: 'So the devices stop needing updates', explanation: 'Separation does not remove the need for updates.' },
        { text: 'So the internet provider can see the devices', explanation: 'Separating devices does not give anyone new visibility.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Use current Wi-Fi encryption with a long passphrase, change the router password, keep guests and smart devices away from important computers, and review the device list regularly.',
  resources: [
    { title: 'Securing your home network', provider: 'CISA', description: 'Practical steps for router passwords, updates, and guest networks.', url: 'https://www.cisa.gov/' },
    { title: 'Wi-Fi security basics', provider: 'Wi-Fi Alliance', description: 'An overview of WPA2 and WPA3 and what each one protects.', url: 'https://www.wi-fi.org/' },
  ],
}

export default lesson
