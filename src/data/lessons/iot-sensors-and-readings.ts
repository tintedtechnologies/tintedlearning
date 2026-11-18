import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the difference between an analog reading and a digital one',
    'Smooth noisy sensor readings by averaging, and explain the trade-off',
    'Check readings against a valid range and flag the ones that look wrong',
  ],
  bigIdea: 'A sensor never reports the exact truth. Its readings have noise, drift, and sometimes faults, so good IoT code checks each reading before it trusts it. Averaging several readings reduces noise, and a valid range catches broken values.',
  whyItMatters: 'A temperature sensor in a freezer reports 4 degrees one minute and 85 degrees the next. The second value is almost certainly a loose wire, not a heat wave. If the system trusts every reading, it may switch off the cooling or send a false alarm. Checking the readings is what keeps the freezer and the owner informed.',
  goalSections: [
    {
      heading: 'Analog and digital readings',
      paragraphs: [
        'An analog sensor produces a continuous signal, such as a voltage that changes with light or temperature. A microcontroller reads that voltage with an analog-to-digital converter, which turns it into a number, usually between 0 and 1023 or 0 and 4095 depending on the chip. The number is only as good as the conversion and the sensor behind it.',
        'A digital sensor does the conversion itself and sends a number over a bus such as I2C or SPI. Digital sensors are often easier to use, but they still need the same care. Every reading comes with units, and a number without units is not useful. A value of 512 means nothing until you know it is raw counts, degrees, or percent.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Raw reading:   512 (counts from a 10-bit converter)
          Converted:     about 2.5 volts, then about 23 degrees Celsius
          Sent to cloud: 23.4 C   (value with units)
        `,
      },
    },
    {
      heading: 'Smoothing noisy readings',
      paragraphs: [
        'Noise is random variation that a sensor adds to every reading. Averaging several readings reduces it, because random ups and downs tend to cancel. A rolling average keeps the last few readings and reports their mean, which gives a steady value for display.',
        'Averaging has a cost. A large window hides real changes and makes the system slow to react. A short window reacts quickly but keeps more noise. Choose the window from the question you need to answer, and test it with data that contains a known change.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'rolling_average.py',
        code: code`
          readings = [21.0, 21.4, 20.8, 21.2, 27.9, 21.1]
          window = 3

          for i in range(len(readings)):
              recent = readings[max(0, i - window + 1): i + 1]
              average = sum(recent) / len(recent)
              print(round(average, 2))
        `,
        output: '21.0\n21.2\n21.07\n21.13\n23.3\n23.4',
      },
    },
    {
      heading: 'Checking whether a reading is valid',
      paragraphs: [
        'Before a reading is used, check that it falls inside the range the sensor can really produce. A temperature sensor for a room may only read between -10 and 50 degrees. A value outside that range points to a fault, such as a loose wire, a short circuit, or a corrupt message.',
        'Flag suspicious readings instead of silently dropping them. A flagged reading tells the owner that something needs a look, and a log of flags shows whether a sensor is getting worse over time.',
        'Calibration is the other half of trust. A sensor can be precise and still be wrong by a fixed amount, so a thermometer may read two degrees high at every temperature. Compare the sensor with a trusted reference at a known condition, such as ice water, and record the difference. Apply that correction in code, and note the date so you know when to check it again.',
        'Sampling matters too. A sensor that reports every second may produce far more data than the decision needs, and a sensor that reports once a day may miss a short event. Pick the rate from the speed of the change you care about. Soil moisture changes slowly, so a reading every ten minutes is usually enough.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'range_check.py',
        code: code`
          LOW, HIGH = -10, 50
          readings = [21.4, 85.0, -40.0, 19.8]

          for value in readings:
              if LOW <= value <= HIGH:
                  print(value, "valid")
              else:
                  print(value, "flagged: outside the sensor range")
        `,
        output: '21.4 valid\n85.0 flagged: outside the sensor range\n-40.0 flagged: outside the sensor range\n19.8 valid',
      },
    },
  ],
  seeItInAction: {
    title: 'Averaging only the valid readings',
    intro: 'This program removes readings outside the sensor range, then averages the rest. Removing the bad values first keeps one loose wire from pulling the average off. Run it, and compare the average with and without the fault.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'clean_average.py',
      code: code`
        LOW, HIGH = -10, 50
        readings = [21.0, 21.4, 85.0, 20.8, -40.0, 21.2]

        valid = [value for value in readings if LOW <= value <= HIGH]
        average = sum(valid) / len(valid)
        print("kept", len(valid), "of", len(readings))
        print("average", round(average, 2))
      `,
      output: 'kept 4 of 6\naverage 21.1',
    },
    steps: [
      { code: 'LOW, HIGH = -10, 50', explanation: 'The valid range is written once, so every reading uses the same test.' },
      { code: 'valid = [value for value in readings if LOW <= value <= HIGH]', explanation: 'Keeps only the readings the sensor could really produce.' },
      { code: 'average = sum(valid) / len(valid)', explanation: 'Averages the kept readings. Dividing by len(valid) matters, because the count has changed.' },
      { code: 'print("kept", len(valid), "of", len(readings))', explanation: 'Reports how many readings were removed, so a rising count of rejects is visible.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the window in rolling_average.py to 5, and predict whether the spike of 27.9 will be smaller or larger in the output. Run it to check.',
      'Add a reading of 60.0 to clean_average.py and predict the kept count before you run it.',
      'Look at a datasheet for a sensor you own, or a sensor you would like to use, and write down its range, its units, and its accuracy.',
    ],
  },
  mistakes: [
    { mistake: 'Reporting a number without its units.', fix: 'Always attach the unit, such as degrees Celsius or percent relative humidity, before the value is used.' },
    { mistake: 'Dropping bad readings without a record.', fix: 'Flag them, and count the flags, so a failing sensor is noticed.' },
    { mistake: 'Using a large averaging window for a fast change.', fix: 'Pick the window from the question. A fast change needs a short window, and a steady value needs a longer one.' },
  ],
  quiz: [
    {
      question: 'Why does averaging several readings help with a noisy sensor?',
      options: [
        { text: 'Random ups and downs tend to cancel out in the average', explanation: 'Yes. Random noise partly cancels when readings are averaged.' },
        { text: 'The sensor becomes more accurate with each reading', explanation: 'Averaging does not change the sensor. It reduces random noise in the result.' },
        { text: 'Averaging removes every fault', explanation: 'Averaging does not remove faults. A broken sensor still gives bad readings, which is why range checks matter.' },
        { text: 'The units change to percent', explanation: 'Averaging does not change units.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the value 85.0?',
      code: { language: 'python', runnable: true, code: code`
        LOW, HIGH = -10, 50
        value = 85.0
        print(value, "valid" if LOW <= value <= HIGH else "flagged")
      ` },
      options: [
        { text: '85.0 flagged', explanation: 'Yes. The value is above the high limit of 50, so it is flagged.' },
        { text: '85.0 valid', explanation: 'The value is above HIGH, so the check fails.' },
        { text: 'valid', explanation: 'The program prints the value first, then the result.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why should a reading that fails the range check be flagged rather than silently dropped?',
      options: [
        { text: 'A flag tells the owner that something may be wrong, and a count of flags can show a failing sensor', explanation: 'Yes. Keeping a record of rejected readings makes faults visible.' },
        { text: 'Dropped readings cannot be stored at all', explanation: 'Dropped readings can be stored. The issue is that they disappear without a trace.' },
        { text: 'Flags make the range check unnecessary', explanation: 'Flags do not replace the check. They record the result of the check.' },
        { text: 'Flagged readings are always correct', explanation: 'A flagged reading is one to investigate, not one that is known to be right.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Sensor readings need units, smoothing to remove noise, and range checks to catch faults, and rejected readings should be flagged rather than hidden.',
  resources: [
    { title: 'MicroPython sensor tutorials', provider: 'MicroPython', description: 'Read sensors and handle analog and digital values on small boards.', url: 'https://docs.micropython.org/en/latest/' },
    { title: 'Analog-to-digital conversion', provider: 'Arduino', description: 'How microcontrollers read analog voltages and convert them into numbers.', url: 'https://docs.arduino.cc/learn/microcontrollers/analog-input/' },
  ],
}

export default lesson
