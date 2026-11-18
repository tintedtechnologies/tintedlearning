import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Compare common IoT connections by range, power use, data rate, and cost',
    'Match a connection choice to the requirements of a device',
    'Explain why a battery-powered device and a mains-powered device may need different connections',
  ],
  bigIdea: 'No single wireless connection fits every IoT device. Wi-Fi moves a lot of data but uses more power, while Bluetooth Low Energy saves power at short range. Low-power wide-area networks reach far with tiny messages, so choosing well starts with range, data size, battery, and cost.',
  whyItMatters: 'A team builds a soil sensor with Wi-Fi. The sensor works at the test bench, but in the field the battery lasts three days. A low-power connection that sends one small message an hour would have lasted months. The choice of connection decided the battery life, not the sensor.',
  goalSections: [
    {
      heading: 'The common choices',
      paragraphs: [
        'Wi-Fi is familiar and fast, and it fits devices that are plugged in and send large amounts of data, such as cameras. It uses more power than most IoT options, and its range is limited to a building or a yard.',
        'Bluetooth Low Energy is designed for short range and low power. It suits wearables, door sensors, and phone-linked devices. Zigbee and Thread form mesh networks, where devices relay messages for each other, which helps a home with many small sensors. Cellular options such as LTE-M and NB-IoT use mobile networks, reach far, and need a subscription. LoRaWAN reaches kilometers with very small messages, and suits sensors in fields.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Connection     Range          Power     Data rate   Typical use
          Wi-Fi          Tens of m      High      High        Camera, plugged-in hub
          Bluetooth LE   Up to ~100 m  Very low   Moderate    Wearable, door sensor
          Zigbee/Thread  Mesh, home     Low       Low         Many home sensors
          LTE-M/NB-IoT   Mobile network Low       Low         Remote asset tracker
          LoRaWAN        Several km     Very low  Very low    Farm or city sensor
        `,
      },
    },
    {
      heading: 'Choosing from the requirements',
      paragraphs: [
        'Start with the requirements, not the connection you know best. Ask how far the message must travel, how large each message is, how often it is sent, whether the device has a battery, and whether a subscription is acceptable. The answers narrow the list quickly.',
        'Battery life depends mostly on how often the radio turns on. A device that sends one short message an hour can run for a long time on a small battery, even with a modest connection. A device that streams video needs mains power, whatever connection it uses.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'pick_connection.py',
        code: code`
          def pick(range_m, on_battery, large_data):
              if large_data:
                  return "Wi-Fi"
              if on_battery and range_m > 500:
                  return "LoRaWAN"
              if on_battery:
                  return "Bluetooth LE"
              return "Wi-Fi"

          print(pick(range_m=2000, on_battery=True, large_data=False))
          print(pick(range_m=20, on_battery=False, large_data=True))
        `,
        output: 'LoRaWAN\nWi-Fi',
      },
    },
    {
      heading: 'Trade-offs to write down',
      paragraphs: [
        'Every choice has a cost. Wi-Fi needs a router and power. Cellular needs a plan and a data contract. LoRaWAN needs a gateway, and its messages are too small for anything but readings and commands. Write the trade-offs next to the choice, so the team knows what it accepted.',
        'Check the rules in your region before you choose a radio band. Some bands are shared and limited by law, and a design that works on the bench may break the rules when it is deployed.',
        'Consider the whole lifetime, not only the first day. Replacing batteries in a hundred sensors is a real cost, and a subscription that is cheap for one device can add up across a fleet. Ask how long the device must run, who will maintain it, and what happens when the chosen network changes or closes. Those answers often matter more than the speed on the data sheet.',
        'A quick field test helps. Build a prototype with the chosen connection, place it where it will live, and measure the signal and the battery for a week. Lab results rarely include walls, interference, or a crowded radio environment, and field measurements often change the decision.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Choice: LoRaWAN for the field sensor
          Accepts:  small messages, a gateway in range, low data rate
          Gains:    long range, low power, no monthly plan per sensor
          Checks:   gateway coverage, duty-cycle limits, regional band rules
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Choosing a connection from the requirements',
    intro: 'This program applies a simple rule to three devices and prints a connection for each. The rule is short, but the reasoning behind it is the same as in a real design review. Run it, and check that each answer follows from the requirements.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'devices.py',
      code: code`
        def pick(range_m, on_battery, large_data):
            if large_data:
                return "Wi-Fi"
            if on_battery and range_m > 500:
                return "LoRaWAN"
            if on_battery:
                return "Bluetooth LE"
            return "Wi-Fi"

        devices = {
            "field sensor": (2000, True, False),
            "garage door": (15, True, False),
            "security camera": (20, False, True),
        }
        for name, needs in devices.items():
            print(name, "->", pick(*needs))
      `,
      output: 'field sensor -> LoRaWAN\ngarage door -> Bluetooth LE\nsecurity camera -> Wi-Fi',
    },
    steps: [
      { code: 'def pick(range_m, on_battery, large_data):', explanation: 'Takes the three requirements that matter most for the choice.' },
      { code: 'if large_data: return "Wi-Fi"', explanation: 'Large data needs a connection with high data rate, which Wi-Fi provides.' },
      { code: 'if on_battery and range_m > 500: return "LoRaWAN"', explanation: 'A battery device that must reach far needs a low-power, long-range connection.' },
      { code: 'devices = {...}', explanation: 'Each device is described by its requirements, which keeps the reasoning visible.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the garage door range to 300 and predict its connection. Run the program to check.',
      'Add a device that is plugged in, has a small range, and sends small messages. Predict which connection it gets, then run it.',
      'Pick an IoT device you know, and write its range, power source, message size and message rate. Choose a connection and write one trade-off you accept.',
    ],
  },
  mistakes: [
    { mistake: 'Choosing Wi-Fi for every device because it is familiar.', fix: 'Start from the requirements. A battery sensor with small messages usually needs a low-power connection.' },
    { mistake: 'Estimating battery life from the sensor alone.', fix: 'Most of the battery use comes from how often the radio is on, so measure the message rate.' },
    { mistake: 'Ignoring radio rules for the chosen band.', fix: 'Check the regional rules for the band before deployment, since some limits only appear in the field.' },
  ],
  quiz: [
    {
      question: 'A battery-powered sensor in a remote field sends one short reading every hour. Which connection fits best?',
      options: [
        { text: 'LoRaWAN, for long range, very low power, and tiny messages', explanation: 'Yes. Long range and very low power suit this use.' },
        { text: 'Wi-Fi, because it is the fastest option', explanation: 'Speed is not the need here. Wi-Fi uses more power and reaches a shorter distance.' },
        { text: 'A video stream over Wi-Fi', explanation: 'The sensor sends one short reading, so streaming is not needed.' },
        { text: 'Any connection, since the battery size is the only factor', explanation: 'The connection also decides battery life, so it matters.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a battery device 2000 meters away that sends small data?',
      code: { language: 'python', runnable: true, code: code`
        def pick(range_m, on_battery, large_data):
            if large_data:
                return "Wi-Fi"
            if on_battery and range_m > 500:
                return "LoRaWAN"
            return "Bluetooth LE"
        print(pick(2000, True, False))
      ` },
      options: [
        { text: 'LoRaWAN', explanation: 'Yes. The device is on a battery, reaches more than 500 meters, and sends small data.' },
        { text: 'Bluetooth LE', explanation: 'Bluetooth LE is for short range, and 2000 meters is far beyond it in this rule.' },
        { text: 'Wi-Fi', explanation: 'Wi-Fi is returned only when the data is large.' },
        { text: 'None', explanation: 'The function returns one of the three connection names.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why is a radio band check needed before deployment?',
      options: [
        { text: 'Some bands are shared and limited by law, so a design can break rules in the field', explanation: 'Yes. Regional limits on bands and duty cycles apply to the deployed device.' },
        { text: 'Bands only matter for cameras', explanation: 'Every radio uses a band, so every device needs to respect the rules.' },
        { text: 'The check replaces the need for a gateway', explanation: 'A band check does not replace coverage planning. Both are needed.' },
        { text: 'Bands are always free to use anywhere', explanation: 'Many bands are regulated, and the rules vary by region.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Choose the IoT connection from the requirements of range, data size, battery and cost, and write down the trade-offs you accept.',
  resources: [
    { title: 'Bluetooth Low Energy overview', provider: 'Bluetooth SIG', description: 'How Bluetooth Low Energy works and where it fits in device design.', url: 'https://www.bluetooth.com/learn-about-bluetooth/' },
    { title: 'LoRaWAN', provider: 'LoRa Alliance', description: 'An overview of LoRaWAN for long-range, low-power devices.', url: 'https://lora-alliance.org/about-lorawan/' },
  ],
}

export default lesson
