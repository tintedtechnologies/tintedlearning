import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what a microcontroller is and how it differs from a laptop computer',
    'Explain why voltage, current, and the power supply matter for every connected device',
    'Describe basic safety habits for building and testing with electronics',
  ],
  bigIdea: 'A microcontroller is a small chip that runs one program to read sensors and control outputs, with little memory and very little power use. Working with one means respecting voltage and current, because a wrong connection can damage the board, the sensor, or the person handling it. Careful wiring and checking before power-up prevent most failures.',
  whyItMatters: 'A hobbyist connects a motor directly to a microcontroller pin to make it spin faster. The pin cannot supply enough current, the board resets, and the chip is damaged. A small driver circuit and a separate power supply would have solved it. Knowing the limits of a pin is the difference between a working prototype and a box of broken parts.',
  goalSections: [
    {
      heading: 'What a microcontroller is',
      paragraphs: [
        'A microcontroller is a complete small computer on one chip. It has a processor, a little memory, and input and output pins that can read a sensor or switch a light. It usually runs a single program from start to finish, with no operating system like the one on a laptop.',
        'The advantages are size, cost, and power use. A microcontroller can run for months on a small battery because it does very little when it is waiting. That is why it is the heart of most IoT devices, from thermostats to soil monitors.',
        'The limits are memory and speed. A microcontroller cannot run a large program or store large amounts of data. Designs that need a lot of processing usually send data to a larger computer, which is one of the design choices covered in the edge and privacy lesson.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Laptop:          many gigabytes of memory, an operating system, runs on mains power
          Microcontroller: kilobytes of memory, one program, runs for months on a battery
        `,
      },
    },
    {
      heading: 'Voltage, current, and pin limits',
      paragraphs: [
        'Voltage is the push that moves electricity, and current is the amount that flows. A microcontroller pin is designed to switch a small signal, often at three volts or five volts, and to supply only a small current. Anything bigger, such as a motor or a bright LED strip, needs its own power and a driver circuit.',
        'Always check the datasheet for the pin limits and the supply voltage. Connecting a five volt device to a three volt pin can damage the pin. Connecting a motor directly to a pin can draw more current than the chip can provide, causing resets or permanent damage.',
        'Use a separate power supply for loads that need more current, and share the ground between the supply and the microcontroller so the signals refer to the same reference. A driver such as a transistor or a motor driver board lets a small signal control a large load safely.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          pin_volts = 3.3
          pin_max_ma = 20
          device = {"name": "LED", "volts": 3.3, "ma": 15}
          ok = device["volts"] <= pin_volts and device["ma"] <= pin_max_ma
          print(device["name"], "safe to connect directly:", ok)
        `,
        output: 'LED safe to connect directly: True',
      },
    },
    {
      heading: 'Safety habits for building',
      paragraphs: [
        'Disconnect power before changing wires. Many accidents happen when someone reaches to adjust a connection on a live board. Make the habit of unplugging first, then wiring, then checking, and only then powering up.',
        'Check the wiring against the diagram before the first power-up. Look for short circuits, where two wires that should be separate touch each other. A multimeter can check continuity and voltage, and it is one of the most useful tools for a beginner.',
        'Keep mains power out of the first projects. Wall electricity is dangerous, and a device that connects to it needs enclosure and training that a beginner should not improvise. Use a low-voltage battery or a regulated adapter for early prototypes, and get expert help for anything that connects to the mains.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          pin_limit_ma = 40
          loads = {"status LED": 20, "small fan": 200, "relay coil": 70}
          for name, milliamps in loads.items():
              if milliamps <= pin_limit_ma:
                  print(name, "can connect directly")
              else:
                  print(name, "needs a driver and its own supply")
        `,
        output: 'status LED can connect directly\nsmall fan needs a driver and its own supply\nrelay coil needs a driver and its own supply',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking loads against a pin limit',
    intro: 'The program above compares the current each load needs with the current a pin can safely supply. The limit here is an example, and the real number comes from the datasheet of your chip. Run it, then change the pin limit to 100 and predict which loads change their answer.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        pin_limit_ma = 100
        loads = {"status LED": 20, "small fan": 200, "relay coil": 70}
        needs_driver = [name for name, ma in loads.items() if ma > pin_limit_ma]
        print("needs a driver:", needs_driver)
      `,
      output: "needs a driver: ['small fan']",
    },
    steps: [
      { code: 'pin_limit_ma = 100', explanation: 'The safe limit for one pin, taken from the datasheet and never guessed.' },
      { code: 'loads = {...}', explanation: 'Each load and the current it needs, written down before any wire is connected.' },
      { code: 'needs_driver = [name for name, ma in loads.items() if ma > pin_limit_ma]', explanation: 'Collects the loads that need a driver circuit, so they are never wired directly to a pin.' },
    ],
  },
  tryIt: {
    instructions: [
      'Find the datasheet for a microcontroller board, such as an Arduino or a Raspberry Pi Pico. Write down its supply voltage and its maximum current per pin.',
      'Change the pin limit in the example to 25 and predict which loads need a driver. Run it to check.',
      'Write a pre-power checklist with at least four items, such as the wiring diagram, the voltage, the short circuits, and the power source.',
    ],
  },
  mistakes: [
    { mistake: 'Wiring a motor or a bright light directly to a microcontroller pin.', fix: 'Use a driver circuit and a separate power supply for any load above the pin limit.' },
    { mistake: 'Powering up before checking the wiring.', fix: 'Check the diagram, look for short circuits, and only then connect power.' },
    { mistake: 'Guessing the voltage of a device.', fix: 'Read the label or the datasheet, and match the voltage before connecting.' },
  ],
  quiz: [
    {
      question: 'What is the main reason a motor should not be wired directly to a microcontroller pin?',
      options: [
        { text: 'The motor needs more current than the pin can safely supply', explanation: 'Yes. The pin is designed for a small signal, and a motor can draw more current than it can handle.' },
        { text: 'The motor is too quiet', explanation: 'Noise is not the issue. The current needed is the problem.' },
        { text: 'Microcontrollers cannot have motors', explanation: 'Microcontrollers can control motors, through a driver circuit.' },
        { text: 'The motor will always work better with the pin alone', explanation: 'A pin cannot supply the current a motor needs, so it works less reliably.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a 60 milliamp load on a 40 milliamp pin?',
      code: { language: 'python', runnable: true, code: code`
        pin_limit_ma = 40
        load = 60
        print("direct" if load <= pin_limit_ma else "needs a driver")
      ` },
      options: [
        { text: 'direct', explanation: 'The load is above the pin limit, so it cannot be wired directly.' },
        { text: 'needs a driver', explanation: 'Yes. The 60 milliamp load is more than the 40 milliamp limit.' },
        { text: '40', explanation: 'The program prints the decision, not the limit.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why check a multimeter or wiring diagram before the first power-up?',
      options: [
        { text: 'Because a wrong connection can damage parts or cause a short circuit', explanation: 'Yes. Checking first catches the mistakes that cause most damage.' },
        { text: 'Because the device will not start without a diagram', explanation: 'The device may start, but a wrong connection can still cause damage.' },
        { text: 'Because multimeters make the device faster', explanation: 'A multimeter is for checking, not for speeding up the device.' },
        { text: 'Because the power supply is always dangerous to touch with a meter', explanation: 'The reason is checking the circuit before power is applied, not a rule about the power supply.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A microcontroller is a small, low-power computer with strict pin limits, so check the datasheet, use a driver for larger loads, and check the wiring before power-up.',
  resources: [
    { title: 'Arduino language and hardware reference', provider: 'Arduino', description: 'Reference for microcontroller pins, voltages, and basic electronics.', url: 'https://docs.arduino.cc/' },
    { title: 'MicroPython documentation', provider: 'MicroPython', description: 'Documentation for running Python on small microcontroller boards.', url: 'https://micropython.org/' },
  ],
}

export default lesson
