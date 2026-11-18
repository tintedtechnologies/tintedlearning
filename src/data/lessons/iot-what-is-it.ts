import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe what makes a device an Internet of Things device',
    'Name the parts of an IoT system: sensors, actuators, a gateway, and a cloud service',
    'Follow one reading from a sensor to a decision and back to an action',
  ],
  bigIdea: 'An Internet of Things device is a small computer that reads the world through sensors, acts on it through actuators, and usually sends data to a gateway or a cloud service. Most IoT systems run one loop: read, decide, send, and act. Designing the loop clearly is the core skill.',
  whyItMatters: 'A greenhouse needs its soil watered when it is dry, but not during rain. A sensor reads moisture, a small board decides whether the soil is dry, and a pump waters the plants. Without the loop, someone has to check the soil every hour. With it, the system does the checking and reports only what matters.',
  goalSections: [
    {
      heading: 'What makes a device IoT',
      paragraphs: [
        'An IoT device is a physical object with a small processor, some sensors or actuators, and a network connection. A thermostat, a door lock, a soil monitor, and a delivery tracker are all examples. The key feature is that the device connects the physical world to software.',
        'Not every connected device is an IoT device in the sense used here. A laptop has many sensors and a network connection, but it is a general computer. IoT devices are usually built for one job, run on little power, and often run for months without a person touching them.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Device            Sensor              Actuator
          Soil monitor      Moisture            None
          Smart thermostat  Temperature         Heater or cooler
          Door lock         Door contact        Lock motor
          Parcel tracker    Location (GPS)      None
        `,
      },
    },
    {
      heading: 'The parts of an IoT system',
      paragraphs: [
        'A sensor turns a physical quantity, such as light or distance, into a signal. An actuator does the reverse, turning a decision into motion or heat. Between them sits a microcontroller that runs the logic, and a radio that sends messages.',
        'Many systems add a gateway, a device that collects messages from nearby sensors and forwards them to the internet. The cloud service stores the data, shows dashboards, and can send commands back. Each part can fail, so each part needs a plan for what happens when it does.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Sensor -> Microcontroller -> Radio -> Gateway -> Cloud service
                         ^                                      |
                         |                                      v
                      Actuator <------- command <------- dashboard or rule
        `,
      },
    },
    {
      heading: 'Following one reading through the loop',
      paragraphs: [
        'Take the soil example. The sensor reports a moisture value every ten minutes. The microcontroller compares the value with a threshold. If the soil is dry, it switches on the pump for a short time. It then sends a message to the cloud service so the owner can see what happened.',
        'Good IoT design keeps the decision close to the device when speed or reliability matter. A pump should not depend on the internet to turn off. The cloud is good for history and summaries, while the device handles the moment-by-moment control.',
        'Many IoT systems also need changes after they are installed. A device might need a new sampling interval, a new Wi-Fi password, or a new threshold. Plan for that from the start. A device that can only be changed by replacing it becomes expensive to maintain, and a device that accepts unsafe changes becomes a security risk.',
        'Think about the people who will live with the device, too. A soil sensor that sends alerts every five minutes will be ignored or switched off within a week. A useful IoT design sends fewer, clearer messages, and it keeps the normal state quiet so that a real problem stands out.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'soil_loop.py',
        code: code`
          DRY_LEVEL = 300

          readings = [520, 480, 290, 260]
          for moisture in readings:
              if moisture < DRY_LEVEL:
                  print(moisture, "dry: run the pump for 20 seconds")
              else:
                  print(moisture, "wet enough: do nothing")
        `,
        output: '520 wet enough: do nothing\n480 wet enough: do nothing\n290 dry: run the pump for 20 seconds\n260 dry: run the pump for 20 seconds',
      },
    },
  ],
  seeItInAction: {
    title: 'Deciding locally and reporting once',
    intro: 'This program reads a list of soil values, decides locally whether to water, and collects a short report for the cloud. The decision happens on the device, and the report is sent less often. Run it, and check that the report counts only the watering events.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'water_report.py',
      code: code`
        DRY_LEVEL = 300
        readings = [520, 290, 480, 260, 510]

        watered = 0
        for moisture in readings:
            if moisture < DRY_LEVEL:
                watered += 1

        print({"readings": len(readings), "watered": watered})
      `,
      output: "{'readings': 5, 'watered': 2}",
    },
    steps: [
      { code: 'DRY_LEVEL = 300', explanation: 'The threshold is kept in one named place, so it is easy to change and explain.' },
      { code: 'for moisture in readings:', explanation: 'Each reading is checked on the device, without waiting for the cloud.' },
      { code: 'if moisture < DRY_LEVEL: watered += 1', explanation: 'Counts only the readings that triggered a watering action.' },
      { code: 'print({"readings": ..., "watered": ...})', explanation: 'The summary is what would be sent to the cloud, which keeps the message small.' },
    ],
  },
  tryIt: {
    instructions: [
      'List three devices in your home that have sensors or actuators. For each one, write the reading or action, and the decision it supports.',
      'Change DRY_LEVEL to 250 in the program. Predict how many readings will count as watered, then run it to check.',
      'Draw the loop for one device you chose. Mark which parts run on the device and which run in the cloud.',
    ],
  },
  mistakes: [
    { mistake: 'Sending every reading to the cloud before deciding anything.', fix: 'Decide on the device when timing matters, and send summaries or changes instead.' },
    { mistake: 'Calling any connected computer an IoT device.', fix: 'IoT devices are built for one job, run on little power, and usually have sensors or actuators.' },
    { mistake: 'Making a safety action depend on the internet being up.', fix: 'Keep the critical decision on the device, so it still works when the network fails.' },
  ],
  quiz: [
    {
      question: 'Which part of an IoT system turns a decision into a physical action?',
      options: [
        { text: 'The actuator', explanation: 'Yes. An actuator turns a decision into motion, heat, or another physical effect.' },
        { text: 'The sensor', explanation: 'A sensor reads the physical world. It does not change it.' },
        { text: 'The cloud service', explanation: 'The cloud stores data and can send commands, but the physical action happens at the actuator.' },
        { text: 'The gateway', explanation: 'A gateway forwards messages. It does not perform the action itself.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the reading 290?',
      code: { language: 'python', runnable: true, code: code`
        DRY_LEVEL = 300
        moisture = 290
        if moisture < DRY_LEVEL:
            print(moisture, "dry: run the pump")
        else:
            print(moisture, "wet enough")
      ` },
      options: [
        { text: '290 dry: run the pump', explanation: 'Yes. 290 is below the threshold of 300, so the pump runs.' },
        { text: '290 wet enough', explanation: 'That is the message for values at or above the threshold.' },
        { text: 'dry', explanation: 'The program prints the reading and the message, not just the word dry.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why should a pump-off decision stay on the device rather than in the cloud?',
      options: [
        { text: 'So it still works if the internet connection fails', explanation: 'Yes. A critical action should not depend on a network that can fail.' },
        { text: 'Because the cloud cannot store numbers', explanation: 'The cloud can store numbers well. The reason is reliability and timing.' },
        { text: 'Because devices must never send messages', explanation: 'Devices send messages often. The point is that critical control should not wait for them.' },
        { text: 'Because the pump is always off', explanation: 'The pump runs when needed. The decision still has to be made reliably.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'An IoT system runs a loop of reading, deciding, sending, and acting, and the most important decisions belong on the device so they still work when the network does not.',
  resources: [
    { title: 'What is IoT?', provider: 'Wikipedia', description: 'An overview of the Internet of Things, its devices, and how data moves through a system.', url: 'https://en.wikipedia.org/wiki/Internet_of_things' },
    { title: 'Internet of Things', provider: 'TechTarget', description: 'A plain introduction to connected devices and the sensors behind them.', url: 'https://www.techtarget.com/news/What-is-IoT-internet-of-things/872137/' },
  ],
}

export default lesson
