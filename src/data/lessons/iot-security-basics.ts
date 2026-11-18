import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Name the most common security weaknesses in IoT devices',
    'Explain why updates, unique credentials, and encryption matter for devices in homes and workplaces',
    'Write a simple check that finds weak settings in a device inventory',
  ],
  bigIdea: 'IoT devices are attractive targets because they are often left on default settings, rarely updated, and placed on networks where people forget them. Basic security means unique passwords, a way to update the firmware, encrypted messages, and the smallest set of access each device needs.',
  whyItMatters: 'A smart camera ships with the same default password as every other camera of its model. It is connected to the office network and never updated. Anyone who knows the default can view the camera and reach the computers beside it. A one-hour audit of default passwords and firmware versions would have found the problem before anyone else did.',
  goalSections: [
    {
      heading: 'The common weaknesses',
      paragraphs: [
        'Default credentials are the most common problem. Many devices ship with a shared password that is printed in a manual or published online. A device that keeps its default password is open to anyone who can reach it.',
        'Other weaknesses include old firmware with known bugs, services left open that the owner never uses, and messages sent without encryption. A device with an open debugging port or an unencrypted login can be read or taken over by someone on the same network.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Weakness                    Simple fix
          Default password            Set a unique password, or use a key
          Old firmware                Enable updates, and apply them
          Unused open service         Turn it off, or block its port
          Unencrypted messages        Use TLS (port 8883 for MQTT)
          Device on the main network  Put devices on their own network
        `,
      },
    },
    {
      heading: 'Updates, identity, and encryption',
      paragraphs: [
        'A device needs a way to receive signed firmware updates, and the owner needs to apply them. A device that cannot be updated will keep its bugs for its whole life, so check whether the vendor commits to updates before you buy it.',
        'Each device should have its own identity, such as a certificate or a unique key, so one stolen secret does not unlock every device. Encrypt messages in transit with TLS, and check that the device verifies the server it connects to, not just that it uses encryption.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Device identity:   each device has its own certificate or key
          Encryption:        TLS on the connection, with the server checked
          Updates:           signed firmware, applied on a schedule
          Least privilege:   a sensor can publish its topic and nothing else
        `,
      },
    },
    {
      heading: 'Checking an inventory',
      paragraphs: [
        'Keep a list of every device, with its model, firmware version, network, and whether its default password has been changed. A simple check over that list finds the devices that need attention first. The list does not need special software to be useful. A spreadsheet or a small program can hold it.',
        'Review the list on a schedule, and remove devices you no longer use. A forgotten device on the network is a weakness nobody is watching.',
        'Physical access is part of security too. A device in an unlocked room can be unplugged, opened, or reset to factory settings, which may remove the protections the owner set. Where possible, place devices where people you trust can reach them, and check that a reset does not return the device to its default password.',
        'Plan the end of each device\'s life as well. When a device stops receiving updates, decide whether to replace it, isolate it on its own network, or remove it. Record that decision in the inventory, so the list shows every device still connected and why.',
        'Logs help too. A device that reports failed logins, unexpected restarts, or changes to its settings gives early warning. Choose devices that keep logs you can read, and send important events to a place where someone will see them.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'audit_devices.py',
        code: code`
          devices = [
              {"name": "front camera", "default_password": True, "firmware": "1.2", "latest": "1.4"},
              {"name": "soil sensor", "default_password": False, "firmware": "2.0", "latest": "2.0"},
          ]

          for device in devices:
              problems = []
              if device["default_password"]:
                  problems.append("default password")
              if device["firmware"] != device["latest"]:
                  problems.append("firmware out of date")
              if problems:
                  print(device["name"], "needs attention:", ", ".join(problems))
              else:
                  print(device["name"], "ok")
        `,
        output: 'front camera needs attention: default password, firmware out of date\nsoil sensor ok',
      },
    },
  ],
  seeItInAction: {
    title: 'Finding devices that need attention first',
    intro: 'This program reads a short inventory and lists the devices with weak settings. Run it, then add a device with an old firmware version and check that the audit catches it.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'priority.py',
      code: code`
        devices = {
            "front camera": {"default_password": True, "firmware": "1.2", "latest": "1.4"},
            "garage lock": {"default_password": False, "firmware": "3.1", "latest": "3.1"},
            "office sensor": {"default_password": False, "firmware": "0.9", "latest": "1.0"},
        }

        flagged = []
        for name, info in devices.items():
            if info["default_password"] or info["firmware"] != info["latest"]:
                flagged.append(name)

        print("review first:", flagged)
        print("total devices:", len(devices))
      `,
      output: "review first: ['front camera', 'office sensor']\ntotal devices: 3",
    },
    steps: [
      { code: 'devices = {...}', explanation: 'The inventory: each device with its password status and firmware versions.' },
      { code: 'if info["default_password"] or info["firmware"] != info["latest"]:', explanation: 'A device is flagged when either weakness is present. The check is simple on purpose, so it is easy to explain.' },
      { code: 'flagged.append(name)', explanation: 'Collects the names of devices to review, in the order they appear in the inventory.' },
      { code: 'print("review first:", flagged)', explanation: 'The result is a short list to act on, which is more useful than a long report.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a device to the inventory with a default password and up-to-date firmware. Predict whether it is flagged, then run the program.',
      'List the devices in your home that connect to the internet. For each one, write whether you have changed its default password and whether it updates itself.',
      'Choose one device and find its update policy on the vendor website. Write down how long the vendor promises to provide updates.',
    ],
  },
  mistakes: [
    { mistake: 'Leaving the default password because the device works without changing it.', fix: 'Set a unique password or a key on setup, and write it in a password manager.' },
    { mistake: 'Putting every device on the main network with the computers.', fix: 'Place devices on their own network where possible, so one weak device cannot reach your files.' },
    { mistake: 'Buying a device without checking whether it can be updated.', fix: 'Check the update policy before purchase, since a device that cannot be updated keeps its bugs.' },
  ],
  quiz: [
    {
      question: 'What is the most common security weakness in IoT devices, according to this lesson?',
      options: [
        { text: 'Default credentials that were never changed', explanation: 'Yes. Shared default passwords are a common and easy-to-exploit weakness.' },
        { text: 'A device that is too fast', explanation: 'Speed is not a security weakness in this sense.' },
        { text: 'A device with a large screen', explanation: 'A screen does not create a security weakness by itself.' },
        { text: 'A device that uses a battery', explanation: 'Battery power is not a security weakness on its own.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a device with an old firmware version?',
      code: { language: 'python', runnable: true, code: code`
        device = {"default_password": False, "firmware": "1.0", "latest": "1.1"}
        problems = []
        if device["firmware"] != device["latest"]:
            problems.append("firmware out of date")
        print(problems if problems else "ok")
      ` },
      options: [
        { text: "['firmware out of date']", explanation: 'Yes. The firmware is not the latest, so the problem is recorded.' },
        { text: 'ok', explanation: 'The firmware does not match the latest version, so the device is not ok.' },
        { text: 'firmware', explanation: 'The program prints the list of problems, not one word.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why should IoT devices be placed on their own network where possible?',
      options: [
        { text: 'So one weak device cannot reach the computers and files on the main network', explanation: 'Yes. Separation limits what an attacker can reach after a device is compromised.' },
        { text: 'So the devices run faster', explanation: 'Separation is about security, not speed.' },
        { text: 'So the devices can skip updates', explanation: 'Separation does not remove the need for updates.' },
        { text: 'So the devices stop using encryption', explanation: 'Separation does not change encryption. The two are used together.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Change default credentials, keep firmware updated, encrypt messages, give each device only the access it needs, and review an inventory on a schedule.',
  resources: [
    { title: 'Cybersecurity for IoT', provider: 'NIST', description: 'NIST research and guidance on securing connected devices, including device identity and updates.', url: 'https://www.nist.gov/' },
    { title: 'Secure your smart devices', provider: 'CISA', description: 'Practical steps for protecting connected devices at home and at work.', url: 'https://www.cisa.gov/' },
  ],
}

export default lesson
