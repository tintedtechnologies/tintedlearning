import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how publish and subscribe messaging connects devices through topics',
    'Describe what the three MQTT quality-of-service levels promise',
    'Build and check a small JSON message that a device would send',
  ],
  bigIdea: 'Many IoT devices use publish and subscribe messaging. A device publishes a message to a topic, such as a name for a sensor, and any service subscribed to that topic receives it. The message itself is usually JSON, and both sides should agree on its fields, units, and meaning.',
  whyItMatters: 'A warehouse has forty temperature sensors, each sending its reading to a dashboard. If one sensor sends the temperature as text, another as a number in Fahrenheit, and a third with no timestamp, the dashboard will show wrong or missing data. A shared message format and clear topics keep forty sensors understandable as one system.',
  goalSections: [
    {
      heading: 'Publish and subscribe',
      paragraphs: [
        'In publish and subscribe messaging, a sender does not send a message straight to one receiver. It publishes to a topic, and a broker delivers the message to every client subscribed to that topic. The sensor and the dashboard never need each other\'s address, which makes the system easier to change.',
        'MQTT is a common protocol for this pattern in IoT. Topics are written as paths such as farm/field-2/soil/moisture. A subscriber can listen to one exact topic or use wildcards, such as farm/+/soil/moisture for every field. Port 1883 is the usual plain port, and port 8883 is used with encryption.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Sensor (publisher)  --> farm/field-2/soil/moisture --> Broker
          Dashboard (subscriber) subscribes to farm/+/soil/moisture
          The broker delivers each message to every matching subscriber.
        `,
      },
    },
    {
      heading: 'Quality of service',
      paragraphs: [
        'MQTT offers three quality-of-service levels. Level 0 sends a message once with no confirmation, which suits frequent readings where a missed one does not matter. Level 1 guarantees delivery at least once, but a message may arrive twice. Level 2 guarantees exactly once, at the cost of more messages.',
        'Choose the level from the cost of a lost or duplicated message. A missed reading every few seconds is acceptable at level 0. A command to open a valve should use a higher level, and the receiver should also handle a duplicate safely.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          QoS 0   At most once    Frequent readings, a missed one is fine
          QoS 1   At least once   A duplicate is fine, a missed message is not
          QoS 2   Exactly once    Commands where a repeat or a loss matters most
        `,
      },
    },
    {
      heading: 'Designing the message',
      paragraphs: [
        'A good message says what it is, when it was measured, and what unit it uses. A device ID and a timestamp let the dashboard place each reading. A field named unit prevents a Fahrenheit reading from being read as Celsius. Keep the message small, because every byte costs power on a battery device.',
        'Check every message against the agreed fields before you trust it. A missing timestamp or an unknown unit should be rejected or flagged, the same way bad sensor readings are flagged.',
        'Retained messages and last wills are two MQTT features worth knowing. A retained message is stored by the broker, so a new subscriber receives the latest reading straight away. A last will is a message the broker publishes for a device if its connection drops unexpectedly, which lets a dashboard show that a sensor went offline rather than quietly showing its last value.',
        'Message size is a design choice too. Short field names save bytes on a battery device, but names that are too short are hard to read later. Keep the names clear, document them in one place, and version the format if it must change, so old devices and new dashboards can still agree.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'build_message.py',
        code: code`
          import json

          message = {
              "device": "field-2-soil",
              "measured_at": "2026-11-17T09:00:00Z",
              "moisture": 312,
              "unit": "raw",
          }
          text = json.dumps(message)
          print(text)
          print(len(text), "bytes")
        `,
        output: '{"device": "field-2-soil", "measured_at": "2026-11-17T09:00:00Z", "moisture": 312, "unit": "raw"}\n97 bytes',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a message before accepting it',
    intro: 'This program receives a message as text, checks that it has every required field, and accepts or rejects it. A receiver that skips this check trusts whatever arrives. Run it, and check why the second message is rejected.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'check_message.py',
      code: code`
        import json

        REQUIRED = ["device", "measured_at", "moisture", "unit"]

        incoming = [
            '{"device": "field-2-soil", "measured_at": "2026-11-17T09:00:00Z", "moisture": 312, "unit": "raw"}',
            '{"device": "field-3-soil", "moisture": 290}',
        ]
        for text in incoming:
            message = json.loads(text)
            missing = [field for field in REQUIRED if field not in message]
            if missing:
                print("rejected, missing", missing)
            else:
                print("accepted", message["device"])
      `,
      output: "accepted field-2-soil\nrejected, missing ['measured_at', 'unit']",
    },
    steps: [
      { code: 'REQUIRED = ["device", ...]', explanation: 'The agreed fields, written once, so every message is checked against the same list.' },
      { code: 'message = json.loads(text)', explanation: 'Turns the text into a dictionary. A message that is not valid JSON would fail here, which is also a useful signal.' },
      { code: 'missing = [field for field in REQUIRED if field not in message]', explanation: 'Lists the required fields that are absent, so the rejection explains itself.' },
      { code: 'print("rejected, missing", missing)', explanation: 'Gives the owner a reason to fix the sender, rather than a silent failure.' },
    ],
  },
  tryIt: {
    instructions: [
      'Add a "battery" field to the required list in check_message.py. Predict which messages will be rejected, then run the program.',
      'Change the unit in build_message.py to "percent" and predict whether the message gets longer or shorter. Run it to check.',
      'Choose a topic name for a device in your home, such as home/kitchen/fridge/temperature. Write one reason each part of the name is useful.',
    ],
  },
  mistakes: [
    { mistake: 'Sending values with no unit or timestamp.', fix: 'Include the unit and when the reading was taken, so every reader can interpret it the same way.' },
    { mistake: 'Choosing QoS 2 for every message.', fix: 'Pick the level from the cost of a loss or a duplicate. Higher levels cost more messages and power.' },
    { mistake: 'Trusting every incoming message.', fix: 'Check required fields and ranges before using a message, and reject or flag the ones that fail.' },
  ],
  quiz: [
    {
      question: 'Which MQTT quality-of-service level guarantees delivery but may deliver a message twice?',
      options: [
        { text: 'QoS 1', explanation: 'Yes. QoS 1 means at least once, so a duplicate is possible.' },
        { text: 'QoS 0', explanation: 'QoS 0 sends at most once and does not guarantee delivery.' },
        { text: 'QoS 2', explanation: 'QoS 2 means exactly once, so it avoids duplicates.' },
        { text: 'Port 1883', explanation: 'A port is not a quality-of-service level.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the second message?',
      code: { language: 'python', runnable: true, code: code`
        import json
        REQUIRED = ["device", "unit"]
        message = json.loads('{"device": "a1", "moisture": 290}')
        missing = [field for field in REQUIRED if field not in message]
        print("rejected, missing", missing if missing else "nothing")
      ` },
      options: [
        { text: "rejected, missing ['unit']", explanation: 'Yes. The message has the device field but not the unit field.' },
        { text: 'accepted a1', explanation: 'The program does not print accepted in this version, because the unit is missing.' },
        { text: "rejected, missing ['device', 'unit']", explanation: 'The device field is present, so only the unit is missing.' },
        { text: 'An error', explanation: 'The JSON is valid, so the program runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why should a message include a timestamp?',
      options: [
        { text: 'So the reader knows when each reading was taken, even if it arrives late', explanation: 'Yes. A timestamp places the reading in time, which matters when messages are delayed or buffered.' },
        { text: 'So the broker can delete old topics automatically', explanation: 'A timestamp in the message does not control the broker.' },
        { text: 'So the message uses fewer bytes', explanation: 'A timestamp adds bytes. Its value is in meaning, not size.' },
        { text: 'So the sensor can run without a battery', explanation: 'A timestamp does not change power use.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Devices publish messages to topics, the quality-of-service level matches the cost of a lost or repeated message, and every receiver checks the message fields before trusting them.',
  resources: [
    { title: 'MQTT specification', provider: 'OASIS', description: 'The official MQTT standard, including quality-of-service levels and topics.', url: 'https://mqtt.org/mqtt-specification/' },
    { title: 'JSON', provider: 'Mozilla', description: 'The format used for most IoT messages, with the rules for valid JSON.', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON' },
  ],
}

export default lesson
