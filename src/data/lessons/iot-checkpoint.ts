import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Design a connected device from its purpose through its sensors, connection, messages, and power',
    'Check the design for security, privacy, battery life, and updates',
    'Explain the design and its trade-offs to someone who has never built a device',
  ],
  bigIdea: 'A connected device design answers a few questions in order: what decision it supports, what it senses, how it connects, what messages it sends, how long its battery lasts, how it stays secure, and how it is updated. This checkpoint asks you to design one device with those answers, check each one, and explain the trade-offs honestly.',
  whyItMatters: 'Many connected products fail for reasons unrelated to their main feature. The battery runs out in a month, the messages cannot be understood by the dashboard, or the device cannot be updated when a weakness is found. A design that answers every question on paper prevents those failures from reaching customers, and it is the skill most IoT teams need first.',
  goalSections: [
    {
      heading: 'Start with the decision',
      paragraphs: [
        'Write the device\'s purpose as a decision it supports. A soil monitor helps a gardener decide when to water. A door sensor helps a building manager see whether a fire door was left open. A device without a decision is usually a device nobody uses after the first week.',
        'Then name who acts on the decision, how quickly they must act, and what happens if the device is wrong. A missed watering is a minor problem. A missed fire door alarm is serious, and the design must reflect that difference in reliability and in the alert system.',
        'Choose the simplest set of sensors that supports the decision. More sensors add cost, power use, and data to protect, so each one should earn its place.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Device: a door sensor for a building manager
          Decision: is a fire door open for longer than 30 seconds?
          Who acts: the building manager, within one minute
          If the device is wrong: a missed alarm is serious, a false alarm is a nuisance
          Sensors: one magnetic contact sensor on the door
        `,
      },
    },
    {
      heading: 'Choose the connection, messages, and power',
      paragraphs: [
        'Pick the connection from the requirements, as covered in the connectivity lesson. Write the range, the message size, the message rate, the power source, and the cost, and choose the option that meets them with the least risk.',
        'Design the messages. Give each message a device identifier, a timestamp, a unit, and a clear topic name. Decide the quality of service for each message, based on the cost of a lost or repeated message. Keep the format stable, because changing it later breaks every dashboard that reads it.',
        'Estimate battery life using the method from the power lesson. Include sleep, reading, and transmitting, and leave a margin for cold temperature and aging. If the estimate is shorter than the maintenance plan allows, change the reporting rate or the connection before building.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          design = {
              "decision": True,
              "sensors chosen": True,
              "connection chosen": True,
              "message format fixed": True,
              "battery estimate": False,
              "security checked": False,
              "update plan": True,
          }
          open_items = [item for item, done in design.items() if not done]
          print("open items:", len(open_items))
          for item in open_items:
              print("-", item)
        `,
        output: 'open items: 2\n- battery estimate\n- security checked',
      },
    },
    {
      heading: 'Check security, privacy, and updates, then explain honestly',
      paragraphs: [
        'Check security from the security basics lesson. Every device has a unique credential, no default password is shipped, messages are encrypted, and the device runs only the services it needs. Write down how each of these is achieved, not only that it is intended.',
        'Check privacy from the edge and privacy lesson. Name the personal data the device collects, the purpose of each item, how long it is kept, and who can access it. If the device could reveal someone\'s routine or location, the design should say how that risk is reduced.',
        'Check the update plan. The design must say how firmware is signed, how a bad release is rolled back, and how the rollout is staged. A device without an update plan should not be sold, however simple it seems.',
        'Write a short document for a non-technical reader. Describe the decision, the device, its connection, the data it sends, its battery life, and its security. Name at least one trade-off you accepted, such as a shorter battery life in exchange for faster alerts.',
        'List the open risks. A good design does not claim perfection. It says what is not yet known, such as how the device performs in very cold weather, and what test will answer the question before launch.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Security: a unique credential per device, no default password, TLS for messages
          Privacy: collects open or closed state and a timestamp only, kept 30 days
          Updates: signed firmware, a rollback slot, and a rollout to one percent of doors first
          Open risk: battery behavior in freezing temperatures, to test in the pilot
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Finding the open items before a build',
    intro: 'The program above checks a design checklist and lists the items that are not done. A real review adds judgment on top, but the list is where the review starts. Run it, then mark the battery estimate as done and predict the new count.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        design = {
            "decision": True,
            "sensors chosen": True,
            "connection chosen": True,
            "message format fixed": True,
            "battery estimate": True,
            "security checked": True,
            "update plan": True,
        }
        open_items = [item for item, done in design.items() if not done]
        if open_items:
            print("revise before building:", open_items)
        else:
            print("ready for a field pilot")
      `,
      output: 'ready for a field pilot',
    },
    steps: [
      { code: 'design = {...}', explanation: 'The checklist, with each item from the design written as a yes or no.' },
      { code: 'open_items = [item for item, done in design.items() if not done]', explanation: 'Collects the items still open. These are gaps, not failures, and they should be closed before a build.' },
      { code: 'print("ready for a field pilot")', explanation: 'A complete checklist moves the design to a small field pilot, where real conditions test the assumptions.' },
    ],
  },
  tryIt: {
    instructions: [
      'Choose a device you would like to build, such as a plant monitor or a door sensor. Write its decision, sensors, connection, and message topics.',
      'Estimate its battery life using the method in the power lesson, and write one change that would extend it.',
      'Write the security, privacy, and update answers for your device in no more than two hundred words, and list the open risks you still have.',
    ],
  },
  mistakes: [
    { mistake: 'Choosing sensors and connections before naming the decision.', fix: 'Write the decision and who acts on it first. Let it decide the sensors.' },
    { mistake: 'Writing that the device is secure without saying how.', fix: 'For each security item, write the method, such as unique credentials and encrypted messages.' },
    { mistake: 'Presenting the design as finished when risks remain.', fix: 'List the open risks and the test that will answer each one.' },
  ],
  quiz: [
    {
      question: 'What should a connected device design start from?',
      options: [
        { text: 'The brand of the chip', explanation: 'The chip is a later choice. The design starts with the decision the device supports.' },
        { text: 'The decision the device supports and who acts on it', explanation: 'Yes. Every sensor, connection, and message should serve that decision.' },
        { text: 'The cloud provider\'s newest service', explanation: 'A cloud service is a later choice, made after the decision is clear.' },
        { text: 'The color of the case', explanation: 'Appearance does not define what the device must do.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for a design with two unchecked items?',
      code: { language: 'python', runnable: true, code: code`
        design = {"battery": False, "security": False, "updates": True}
        open_items = [item for item, done in design.items() if not done]
        print("open items:", len(open_items))
      ` },
      options: [
        { text: 'open items: 1', explanation: 'Two items are False, so two are open.' },
        { text: 'open items: 2', explanation: 'Yes. The battery and security items are not done.' },
        { text: 'open items: 3', explanation: 'The updates item is True, so it is not open.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why should a design explain its trade-offs honestly?',
      options: [
        { text: 'Because every design has limits, and naming them lets a reader decide whether they are acceptable', explanation: 'Yes. Honest trade-offs let the owner judge the design for their situation.' },
        { text: 'Because the law forbids any trade-offs', explanation: 'No such rule is implied here. The reason is clarity and trust.' },
        { text: 'Because trade-offs make the device faster', explanation: 'Naming trade-offs does not change speed.' },
        { text: 'Because readers always prefer long documents', explanation: 'Length is not the goal. Clarity about limits is.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Design a connected device from its decision outward, through its sensors, connection, messages, power, security, privacy, and updates, and explain each trade-off in plain words.',
  resources: [
    { title: 'IoT security guidance', provider: 'NIST', description: 'NIST research and guidance on securing connected devices.', url: 'https://www.nist.gov/' },
    { title: 'MQTT specification', provider: 'OASIS', description: 'The official MQTT standard for topics and quality of service.', url: 'https://mqtt.org/mqtt-specification/' },
  ],
}

export default lesson
