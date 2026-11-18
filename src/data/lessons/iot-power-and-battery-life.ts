import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain where a battery-powered device spends its energy',
    'Estimate battery life from the current used in each state and the time spent in it',
    'Choose design changes that stretch battery life without losing the reading the device exists to take',
  ],
  bigIdea: 'A battery device spends most of its life sleeping and a small part of its life awake, and the awake part uses far more energy. Battery life is therefore decided by how long the radio and sensors stay on, not by the size of the battery alone. Estimating each state separately lets a team predict months of life before it buys hardware.',
  whyItMatters: 'A team builds a field sensor that reads every minute and sends every reading over a cellular connection. The battery lasts nine days. The team blames the battery and orders a larger one, which adds weight and cost. A calculation would have shown that sending once an hour, and reading only when needed, multiplies the life many times over.',
  goalSections: [
    {
      heading: 'Where the energy goes',
      paragraphs: [
        'A battery device has states. Deep sleep uses microamps, which is very little. Active sensing uses milliamps for a short time. Radio transmission is often the biggest cost, because the radio draws a lot of current while it sends and waits for a reply. Each state has its own current and its own duration.',
        'The radio is usually the largest share. Turning it on takes time and power before any data is sent, so a device that sends many tiny messages can use more energy than one that sends a single larger message. Batching readings is often the simplest way to save power.',
        'Temperature, the age of the battery, and the signal strength also matter. A radio in a weak signal area must transmit longer and at higher power, so the same message costs more energy. A battery loses capacity in cold weather, which shortens its life in winter.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          State         Current     Time per cycle
          Deep sleep    0.005 mA    3598 seconds
          Read sensor   5 mA        0.5 seconds
          Send radio    80 mA       1.5 seconds
        `,
      },
    },
    {
      heading: 'Estimating battery life',
      paragraphs: [
        'To estimate battery life, find the average current over one full cycle. Multiply each state\'s current by the fraction of time it runs, and add the results. The average current then tells you how fast the battery empties.',
        'Divide the battery capacity by the average current to get the life in hours. A battery rated at 2000 milliamp hours with an average draw of 0.1 milliamps would last about 20000 hours, which is more than two years. Real batteries lose some capacity, so leave a margin of at least twenty percent.',
        'Check the estimate against a real measurement. A meter that records the current during a test cycle often shows a surprise, such as a sensor that stays on longer than expected. Update the estimate with what you measure.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          cycle_seconds = 3600
          states = [
              ("sleep", 0.005, 3598),
              ("read", 5.0, 0.5),
              ("send", 80.0, 1.5),
          ]
          total_mah_seconds = sum(ma * seconds for _, ma, seconds in states)
          average_ma = total_mah_seconds / cycle_seconds
          battery_mah = 2000
          hours = battery_mah / average_ma
          print("average current (mA):", round(average_ma, 3))
          print("estimated life (days):", round(hours / 24))
        `,
        output: 'average current (mA): 0.039\nestimated life (days): 2135',
      },
    },
    {
      heading: 'Design changes that save power',
      paragraphs: [
        'Send less often, and send less data. Reducing the number of messages from one a minute to one an hour can extend life many times, if the decision the data supports does not need more frequent readings. Send a change only when the value moves beyond a threshold, which is a useful technique called report by exception.',
        'Keep the radio off most of the time. Choose a connection designed for low power, as covered in the connectivity lesson, and keep the device in deep sleep between readings. A device should wake only for the task, do it quickly, and return to sleep.',
        'Plan for the cold and for the end of the battery. Test the design at the lowest temperature the device will see, and set a warning level so the owner can replace the battery before the device fails silently.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def life_days(messages_per_hour, battery_mah=2000, sleep_ma=0.005, message_mah=0.04):
              average_ma = sleep_ma + messages_per_hour * message_mah
              return round(battery_mah / average_ma / 24)

          print("hourly:", life_days(1))
          print("every 10 minutes:", life_days(6))
        `,
        output: 'hourly: 1852\nevery 10 minutes: 340',
      },
    },
  ],
  seeItInAction: {
    title: 'Comparing two reporting plans',
    intro: 'The program below compares a device that reports every minute with one that reports every hour, using the same battery and the same per-message energy. The difference in life is the reason for the design choice. Run it, then change the report interval and predict the new life.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        battery_mah = 2000
        sleep_ma = 0.005
        message_mah = 0.04

        def life_days(messages_per_hour):
            average_ma = sleep_ma + messages_per_hour * message_mah
            return round(battery_mah / average_ma / 24)

        print("every minute:", life_days(60), "days")
        print("every hour:  ", life_days(1), "days")
      `,
      output: 'every minute: 35 days\nevery hour:   1852 days',
    },
    steps: [
      { code: 'average_ma = sleep_ma + messages_per_hour * message_mah', explanation: 'The average draw is the sleep current plus the energy from the messages, spread over the hour.' },
      { code: 'return round(battery_mah / average_ma / 24)', explanation: 'Turns the average current into days of battery life, rounded to a whole number.' },
      { code: 'print("every minute:", life_days(60), "days")', explanation: 'Sending sixty messages an hour uses far more energy, so the life drops sharply.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the message energy in the example to 0.01 and predict whether the every-minute plan lasts longer. Run it to check.',
      'Write the average current for a device that reads every ten minutes, with a sleep current of 0.005 milliamps and one message of 0.04 milliamp hours per reading.',
      'Choose one design change from the lesson, and write how it would change the battery life of a device you know.',
    ],
  },
  mistakes: [
    { mistake: 'Estimating battery life from the battery size alone.', fix: 'Estimate the average current across all states, including sleep, reading, and sending.' },
    { mistake: 'Sending data more often than the decision needs.', fix: 'Choose the interval from the question the data answers, and report only changes when possible.' },
    { mistake: 'Forgetting the cold and the end of the battery.', fix: 'Test at the lowest expected temperature and add a battery warning level.' },
  ],
  quiz: [
    {
      question: 'Which part of a battery device usually uses the most energy per event?',
      options: [
        { text: 'The radio while it is transmitting', explanation: 'Yes. Transmitting often draws the most current in a cycle.' },
        { text: 'The device case', explanation: 'The case does not use energy.' },
        { text: 'The deep sleep state', explanation: 'Deep sleep uses very little current, which is why it is so useful.' },
        { text: 'The battery label', explanation: 'A label does not use energy.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the every-hour plan?',
      code: { language: 'python', runnable: true, code: code`
        battery_mah = 2000
        average_ma = 0.005 + 1 * 0.04
        print(round(battery_mah / average_ma / 24), "days")
      ` },
      options: [
        { text: '1852 days', explanation: 'Yes. The average draw is 0.045 milliamps, which gives about 1852 days.' },
        { text: '35 days', explanation: '35 days is the answer for sixty messages an hour, not one.' },
        { text: '2000 days', explanation: 'The 2000 is the battery capacity in milliamp hours, not the life. Dividing it by the average current and by 24 gives about 1852 days.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why is report by exception a useful design technique?',
      options: [
        { text: 'It sends a message only when the value changes enough to matter, saving energy', explanation: 'Yes. Fewer messages means less radio time and longer battery life.' },
        { text: 'It makes the sensor more accurate', explanation: 'Reporting less often does not change how accurate the sensor is.' },
        { text: 'It removes the need for a battery', explanation: 'The device still needs power. The technique reduces how much it uses.' },
        { text: 'It makes the radio stronger', explanation: 'The technique is about sending less, not about signal strength.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Battery life depends on the average current across sleep, reading, and transmitting, so estimate each state, send only what the decision needs, and test at the coldest temperature the device will see.',
  resources: [
    { title: 'Low-power electronics', provider: 'Wikipedia', description: 'An overview of low-power design: sleep modes, duty cycling, and where a device spends its energy.', url: 'https://en.wikipedia.org/wiki/Low-power_electronics' },
    { title: 'Battery basics for electronics', provider: 'SparkFun', description: 'An introduction to battery capacity, discharge, and how to estimate runtime.', url: 'https://learn.sparkfun.com/tutorials/battery-technologies' },
  ],
}

export default lesson
