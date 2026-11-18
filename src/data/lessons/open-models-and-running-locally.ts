import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the difference between a hosted model behind an API and an open-weight model you run yourself',
    'Estimate the memory a model needs from its size and its number format',
    'Choose between hosted and self-run models using privacy, cost, quality, and license as the deciding factors',
  ],
  bigIdea: 'A model can be used in two ways: through a provider\'s API, where someone else runs it, or as an open-weight model that you download and run on your own hardware or cloud machine. Each choice trades cost, privacy, control, and quality. Before you run anything locally, estimate its memory need and read its license, because both can rule a model out.',
  whyItMatters: 'A clinic wants an assistant that summarizes patient notes. Sending the notes to a hosted API may break its privacy rules, and running a very large model on a laptop will not work at all. An open model that fits on a server the clinic controls, under a license that allows the use, may be the only option that meets every requirement. Knowing how to estimate and check these things is part of building responsibly.',
  goalSections: [
    {
      heading: 'Hosted models and open-weight models',
      paragraphs: [
        'A hosted model runs on the provider\'s servers. You send a request and receive a reply. This is simple to start with, usually gives strong quality, and needs no hardware of your own. Your data leaves your systems, and your cost grows with each request.',
        'An open-weight model publishes its learned settings so that anyone can download and run it. You control where it runs, which keeps data inside your systems, and you can tune or restrict it. The cost is hardware or cloud compute, the work of setting it up, and the responsibility for keeping it updated and safe.',
        'Open does not always mean free to use in every way. Each model comes with a license that sets what you may do, such as whether commercial use is allowed or whether you must share changes. Read the license before building on a model, and keep a copy with your project records.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Hosted: strong quality, no hardware, data leaves your systems, cost grows with each request.
          Open-weight: data stays where you run it, you can tune it, but you pay for hardware and keep it updated.
          License: read the terms for your use, such as commercial use or required attribution, and keep a copy.
        `,
      },
    },
    {
      heading: 'Estimating the memory a model needs',
      paragraphs: [
        'A model\'s memory need is roughly its number of parameters multiplied by the bytes used to store each one. A model with seven billion parameters stored at two bytes each needs about fourteen gigabytes just for its weights. Storing the same model at half a byte per parameter, which is common with compression, needs about three and a half gigabytes.',
        'Running the model needs more than the weights. The context you send and the reply being generated also take memory, so leave a margin. A model that barely fits in memory will often run very slowly or fail on long inputs.',
        'Compression trades a little quality for much less memory. Test the compressed model on your own examples before choosing it, because the loss is not the same for every task.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def weight_gigabytes(billions_of_parameters, bytes_per_parameter):
              return billions_of_parameters * bytes_per_parameter

          for name, bytes_each in [("16-bit", 2), ("8-bit", 1), ("4-bit", 0.5)]:
              print(name, round(weight_gigabytes(7.0, bytes_each), 1), "GB for a 7 billion parameter model")
        `,
        output: '16-bit 14.0 GB for a 7 billion parameter model\n8-bit 7.0 GB for a 7 billion parameter model\n4-bit 3.5 GB for a 7 billion parameter model',
      },
    },
    {
      heading: 'Choosing between hosted and self-run',
      paragraphs: [
        'Start with the requirements that cannot be traded away. If the data must stay inside your systems, a hosted API may be ruled out. If the license forbids your use, the model is out. If the hardware you can afford cannot hold the model, a smaller model or a hosted option may be needed.',
        'Then compare the costs honestly. A hosted model has a per-request cost that grows with use. A self-run model has a fixed cost for hardware or cloud machines, plus the staff time to run and update it. The cheaper option depends on how much you use the model.',
        'Test quality on your own examples before deciding. A large hosted model may give better answers for a hard task, while a smaller open model may be good enough for a narrow one. The test set is the only fair way to compare them.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Hard requirements first: data location, license, and whether the hardware can hold the model.
          Then cost: a per-request bill for hosted, or a fixed machine and staff time for self-run.
          Then quality: test both on your own examples, and choose the cheapest one that passes.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking whether a model fits your hardware',
    intro: 'The program below takes a model size, a number format, and the memory of a machine, and reports whether the weights fit with a margin for the working memory. Run it, then change the machine to 8 gigabytes and predict which models still fit.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        machine_gb = 16
        margin_gb = 4
        models = [("7B at 16-bit", 7, 2), ("7B at 4-bit", 7, 0.5), ("13B at 4-bit", 13, 0.5)]

        for name, billions, bytes_each in models:
            needed = billions * bytes_each
            fits = needed + margin_gb <= machine_gb
            print(name, "needs", needed, "GB:", "fits" if fits else "too large")
      `,
      output: '7B at 16-bit needs 14 GB: too large\n7B at 4-bit needs 3.5 GB: fits\n13B at 4-bit needs 6.5 GB: fits',
    },
    steps: [
      { code: 'needed = billions * bytes_each', explanation: 'The memory for the weights alone, from the size and the number format.' },
      { code: 'fits = needed + margin_gb <= machine_gb', explanation: 'Adds a margin for the working memory, so a model that barely fits is marked as a risk.' },
      { code: 'print(name, "needs", needed, "GB: ...")', explanation: 'Reports the need and the decision, so the trade-off between size and format is visible.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change machine_gb in the seeItInAction example to 8 and predict which models fit. Run the program to check.',
      'Read the license of one open model you know, and write down two things it allows and two things it requires.',
      'Write one task where a hosted model is the right choice and one where a self-run model is, with a reason for each.',
    ],
  },
  mistakes: [
    { mistake: 'Choosing a model without checking its license.', fix: 'Read the license for the intended use, and keep a copy with the project record.' },
    { mistake: 'Matching the model size to memory with no margin.', fix: 'Leave room for the context and the reply, and test long inputs.' },
    { mistake: 'Assuming a compressed model is as good as the original.', fix: 'Test the compressed model on your own examples before deciding.' },
  ],
  quiz: [
    {
      question: 'A 7 billion parameter model is stored with 2 bytes per parameter. About how much memory do its weights need?',
      options: [
        { text: 'About 3.5 gigabytes', explanation: 'That is the 4-bit size. At 2 bytes each, it is about 14 gigabytes.' },
        { text: 'About 14 gigabytes', explanation: 'Yes. Seven billion times two bytes is fourteen billion bytes, about 14 GB.' },
        { text: 'About 7 gigabytes', explanation: 'That would be one byte per parameter.' },
        { text: 'About 140 gigabytes', explanation: 'That would be ten bytes per parameter, which is not the case here.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for a 13 billion parameter model at 4-bit with 16 GB and a 4 GB margin?',
      code: { language: 'python', runnable: true, code: code`
        needed = 13 * 0.5
        print("fits" if needed + 4 <= 16 else "too large")
      ` },
      options: [
        { text: 'fits', explanation: 'Yes. The weights need 6.5 GB, and 6.5 plus 4 is within 16.' },
        { text: 'too large', explanation: 'The total is 10.5 GB, which is within the 16 GB machine.' },
        { text: '6.5', explanation: 'The program prints the decision, not the size.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'What should decide whether an open model may be used in a product?',
      options: [
        { text: 'Its license, read for the intended use', explanation: 'Yes. Open weights still come with terms that set what you may do.' },
        { text: 'Its name, if it sounds popular', explanation: 'Popularity does not show what the license allows.' },
        { text: 'The number of stars on a code site', explanation: 'Stars do not describe the terms of use.' },
        { text: 'Whether it can run on a phone', explanation: 'Hardware fit matters, but it does not decide permission to use the model.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Choose between a hosted model and an open model by its privacy, cost, quality, and license, estimate memory from parameters and number format with a margin, and test quality on your own examples.',
  resources: [
    { title: 'Hugging Face documentation', provider: 'Hugging Face', description: 'Guides on downloading, running, and quantizing open models on your own hardware.', url: 'https://huggingface.co/docs' },
    { title: 'Open Source AI Definition', provider: 'Open Source Initiative', description: 'A definition of what makes an AI system open, which helps read model licenses.', url: 'https://opensource.org/ai' },
  ],
}

export default lesson
