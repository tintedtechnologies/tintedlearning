import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the difference between processing data on a device, at the edge, and in the cloud',
    'Choose where each decision in an IoT system should be made',
    'Reduce the personal data an IoT system collects, stores, and shares',
  ],
  bigIdea: 'An IoT system can process data in three places: on the device, at a nearby edge computer, or in the cloud. Each place trades speed, reliability, cost, and privacy against the others. The best design makes urgent decisions close to the sensor and sends only the summaries and events that the cloud truly needs.',
  whyItMatters: 'A home security camera uploads every second of video to the cloud, so the internet connection is always busy, a monthly bill grows, and every family video is stored on a server the family does not control. A camera that detects motion on the device and uploads only the clip that matters is faster, cheaper, and more private. The design choice decided all three outcomes.',
  goalSections: [
    {
      heading: 'Device, edge, or cloud',
      paragraphs: [
        'Processing on the device is the fastest and most reliable option, because the decision does not need a network. A smart lock that checks a code on its own keeps working when the internet is down. The device has limited memory and power, so the logic must be simple.',
        'Edge computing places a more capable computer close to the devices, often in the same building or on the same site. A factory may run a gateway that combines readings from many machines, detects faults, and sends only the summaries upstream. The edge keeps responses quick and reduces the data sent to the cloud.',
        'The cloud is best for long-term storage, large-scale analysis, dashboards, and coordinating many sites. It is not the best place for a decision that must happen in a few milliseconds, or one that must keep working when the network fails.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Decision                       Best place
          Lock opens for a valid code    Device (works offline)
          Machine fault across a plant   Edge gateway (fast, local)
          Monthly energy report          Cloud (storage and analysis)
        `,
      },
    },
    {
      heading: 'Sending less data',
      paragraphs: [
        'Every reading sent to the cloud costs bandwidth, power, storage, and sometimes money, and it increases the amount of personal data at risk. Send events and summaries instead of raw streams where possible. A door sensor needs to send a change, not every second of closed state.',
        'Filtering and summarizing are often the same step. A temperature device that averages readings every ten minutes and sends only the average, the maximum, and any alarm, reduces the data by a large factor and keeps the information the owner needs.',
        'Check whether the raw data is needed at all. If the decision is made on the device and the owner only needs a yes or no, send the yes or no, and keep the raw data local or delete it after use.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          readings = [21.0, 21.2, 21.1, 21.3, 21.2, 21.4]
          summary = {
              "average": round(sum(readings) / len(readings), 2),
              "max": max(readings),
              "alarm": max(readings) > 30,
          }
          print("raw values sent:", len(readings))
          print("summary sent:", summary)
        `,
        output: "raw values sent: 6\nsummary sent: {'average': 21.2, 'max': 21.4, 'alarm': False}",
      },
    },
    {
      heading: 'Privacy by design',
      paragraphs: [
        'Personal data in IoT is often more revealing than people expect. A smart meter that reports energy use every few minutes can show when a household is awake, away, or asleep. A wearable can reveal location and health. A camera can record the faces of visitors who never agreed to be filmed.',
        'Collect only what the purpose needs, store it for the shortest time that works, and delete it when it is no longer needed. Tell people what is collected and why, in plain words, on the device or in its app. Give them a way to turn off features they do not want.',
        'Think about who can access the data. Keep the access list short, use separate accounts for each person, and log who reads sensitive data. A device sold or passed on should have its data and access removed first.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Collect: door state and a timestamp
          Do not collect: video, names, or phone identifiers
          Keep: 30 days, then delete
          Share: alarm events only, sent to the building manager
          Access: two named staff accounts, with every read logged
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Sending a summary instead of a stream',
    intro: 'The program above compares the number of raw readings with the summary that is actually sent. The summary keeps the average, the peak, and the alarm, which are what the owner needs. Run it, then add a reading of 35 degrees and predict whether the alarm changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        readings = [21.0, 21.2, 21.1, 21.3, 21.2, 21.4]
        ALARM_ABOVE = 30

        peak = max(readings)
        message = {
            "average": round(sum(readings) / len(readings), 2),
            "peak": peak,
            "alarm": peak > ALARM_ABOVE,
        }
        print("readings kept on device:", len(readings))
        print("message sent to cloud:", message)
      `,
      output: "readings kept on device: 6\nmessage sent to cloud: {'average': 21.2, 'peak': 21.4, 'alarm': False}",
    },
    steps: [
      { code: 'ALARM_ABOVE = 30', explanation: 'The alarm rule is decided and written in one place, on the device, not in the cloud.' },
      { code: 'peak = max(readings)', explanation: 'Keeps the most important value from the window, rather than sending every reading.' },
      { code: 'message = {...}', explanation: 'Only the summary is sent. The raw readings stay on the device.' },
    ],
  },
  tryIt: {
    instructions: [
      'List three IoT devices in your home. For each one, write what it collects, where the processing happens, and whether that is necessary.',
      'Add 35.0 to the readings in the seeItInAction example and predict whether the alarm changes. Run it to check.',
      'Read the privacy settings of one connected device you own. Write down one setting you would change and why.',
    ],
  },
  mistakes: [
    { mistake: 'Sending every raw reading to the cloud out of habit.', fix: 'Decide what the owner needs, and send events and summaries instead.' },
    { mistake: 'Making a safety decision depend on the cloud being reachable.', fix: 'Keep urgent decisions on the device or at the edge, so they work when the network fails.' },
    { mistake: 'Keeping personal data forever because storage is cheap.', fix: 'Set a retention period, delete old data, and remove data when a device is retired.' },
  ],
  quiz: [
    {
      question: 'Which decision should stay on the device or at the edge rather than in the cloud?',
      options: [
        { text: 'A monthly report of energy use', explanation: 'A monthly report can wait for the cloud, which is good at storage and analysis.' },
        { text: 'Opening a lock for a valid code', explanation: 'Yes. The decision must work quickly and keep working when the network is down.' },
        { text: 'Storing ten years of readings', explanation: 'Long-term storage is a cloud strength, not an edge task.' },
        { text: 'Comparing sites across a country', explanation: 'Coordinating many sites is a cloud task.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the alarm value with a peak of 21.4?',
      code: { language: 'python', runnable: true, code: code`
        readings = [21.0, 21.4]
        peak = max(readings)
        print("alarm:", peak > 30)
      ` },
      options: [
        { text: 'alarm: True', explanation: 'The peak is 21.4, which is not above 30.' },
        { text: 'alarm: False', explanation: 'Yes. 21.4 is below the alarm limit of 30.' },
        { text: 'alarm: 21.4', explanation: 'The program prints the comparison result, not the peak.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why can a smart meter reveal more than expected?',
      options: [
        { text: 'Its regular readings can show when people are home, awake, or away', explanation: 'Yes. Patterns in frequent readings can reveal daily habits.' },
        { text: 'It always records voices', explanation: 'A smart meter does not need to record voices to reveal patterns.' },
        { text: 'It stores the electricity itself', explanation: 'A meter records use, not the electricity.' },
        { text: 'It connects only to the internet', explanation: 'Connection type does not determine privacy risk.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Decide each task on the device, at the edge, or in the cloud by its speed, reliability, and privacy needs, and send summaries rather than raw personal data.',
  resources: [
    { title: 'Edge computing explained', provider: 'Cloudflare', description: 'A plain explanation of edge computing and when it reduces latency and data movement.', url: 'https://www.cloudflare.com/learning/serverless/glossary/what-is-edge-computing/' },
    { title: 'IoT privacy principles', provider: 'ICO (UK)', description: 'Guidance on data minimization, transparency, and retention for connected devices.', url: 'https://ico.org.uk/' },
  ],
}

export default lesson
