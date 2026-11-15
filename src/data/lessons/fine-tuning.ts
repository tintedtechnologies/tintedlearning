import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Structured Outputs, Retrieval-Augmented Generation and Evaluating AI Responses. Nothing in this lesson requires you to train a model, which can cost money.',
  goals: [
    'Explain what fine-tuning changes inside a model and what it does not',
    'Choose between better prompts, RAG and fine-tuning for a given problem',
    'Prepare clean training examples in the format fine-tuning tools expect',
  ],
  bigIdea: "Fine-tuning means continuing a model's training on your own examples, so its weights shift toward the behavior you show it. It is good at teaching a consistent style, format or narrow skill, and poor at teaching facts, especially facts that change. Most problems are solved more cheaply with better prompts or with RAG, so fine-tuning is usually the last tool to reach for, not the first.",
  whyItMatters: "Suppose Study Tracker's session parser, running on a small free local model, gets \"an hour and a half\" wrong now and then. You could switch to a bigger model, add examples to the prompt, or fine-tune the small model on a few hundred labeled notes. Each fix costs different amounts of money, time and upkeep. Knowing which fits the problem saves you weeks spent on the wrong one.",
  goalSections: [
    {
      heading: 'What fine-tuning changes',
      paragraphs: [
        "Fine-tuning starts from a trained model and runs more training on your examples: inputs paired with the ideal outputs. The weights are nudged after each example, as in A Gentle Introduction to Neural Networks, and the result is a new version of the model.",
        "Most fine-tuning today uses parameter-efficient methods, the best known being LoRA, short for low-rank adaptation. They freeze the original weights and train a small set of extra ones, which needs far less memory and produces a small add-on file instead of a whole new model. Under the hood shows the arithmetic.",
        "Fine-tuning teaches behavior: tone, output format, a narrow task done the same way every time, or instructions you would otherwise repeat in every prompt. It is unreliable for facts. A model fine-tuned on your notes may blend and misremember them, cannot cite where an answer came from, and must be retrained whenever the notes change.",
      ],
      example: {
        language: 'text',
        code: code`
          Where the knowledge lives
          Prompting     in the prompt, sent with every request    change it any time
          RAG           in your documents, found per request      update a file, re-index
          Fine-tuning   in the model's weights                    retrain to change it
        `,
      },
    },
    {
      heading: 'Prompting, RAG or fine-tuning?',
      paragraphs: [
        "Work through the options in order of cost. First, improve the prompt: clearer instructions, the right context and a few examples, as in Prompt Engineering. That is free and takes minutes to change.",
        "If the model lacks facts, especially private or changing ones such as your notes, use RAG. No amount of prompt wording can give a model information it was never shown.",
        "Consider fine-tuning only when good prompts and examples still give inconsistent behavior, when a long prompt sent on every request costs too much at your volume, or when you want a small, cheap model to do one narrow job as well as a big one. Then budget for the whole job: collecting and checking examples, training runs, testing, and repeating it all when the base model is retired.",
      ],
      example: {
        language: 'text',
        code: code`
          Problem                                               Try
          Replies ignore the format you asked for               better prompt, then examples
          Assistant must answer from the learner's notes        RAG
          Notes change daily                                    RAG, never fine-tuning
          Small model inconsistent after good prompts, at       fine-tuning
            a million requests a month
          Replies need a house style you can't fully describe   fine-tuning, with many examples
        `,
      },
    },
    {
      heading: 'Preparing training data',
      paragraphs: [
        "Most fine-tuning tools, from providers and open-source libraries alike, accept examples as conversations: a system message, a user message and the ideal assistant reply. They are stored in JSON Lines format, usually a `.jsonl` file, with one complete JSON object per line. Check the exact format your tool expects.",
        "Quality beats quantity. For a narrow task, a few dozen to a few hundred carefully checked examples is a common starting point. Every answer must be exactly what you want, written consistently, and the set must include tricky cases such as \"an hour and a half\".",
        "Keep a separate test set that the model never trains on, and measure before and after. Never put personal data into training examples: it becomes part of the model, and models can repeat what they were trained on.",
      ],
      example: {
        language: 'python',
        code: code`
          import json

          labeled = [
              ("studied algebra 40 min", {"subject": "algebra", "minutes": 40}),
              ("an hour and a half of biology", {"subject": "biology", "minutes": 90}),
              ("python 25", {"subject": "python", "minutes": 25}),
          ]
          system = "Turn the note into JSON with subject and minutes."
          lines = [
              json.dumps({"messages": [
                  {"role": "system", "content": system},
                  {"role": "user", "content": note},
                  {"role": "assistant", "content": json.dumps(answer)},
              ]})
              for note, answer in labeled
          ]
          print(len(lines), "examples")
          print(lines[1])
        `,
        output: code`
          3 examples
          {"messages": [{"role": "system", "content": "Turn the note into JSON with subject and minutes."}, {"role": "user", "content": "an hour and a half of biology"}, {"role": "assistant", "content": "{\"subject\": \"biology\", \"minutes\": 90}"}]}
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deciding whether to fine-tune the session parser',
    intro: "Here is how a careful team would decide what to do about Study Tracker's parser, using a 50-note test set as in Evaluating AI Responses. The scores are illustrative of a typical small local model. The order of the steps is the real lesson.",
    example: {
      language: 'text',
      code: code`
        1. Baseline: small local model, prompt from Structured Outputs     47 of 50
        2. Read the 3 failures: all are fractions of hours ("an hour and a half")
        3. Add 3 worked examples with fractions of hours to the prompt     49 of 50
        4. Is this missing knowledge? No: the model knows what half an hour is.
           It is inconsistent behavior, so RAG would not help.
        5. Options for the last failure:
             a. medium hosted model                     50 of 50, costs per request
             b. fine-tune the small model               needs ~300 checked examples,
                                                        training runs, retesting
             c. keep the draft-and-confirm step         learner fixes the rare slip
        6. Decision: c for now, with a note to revisit if volume grows
      `,
    },
    steps: [
      { code: '1. Baseline ... 47 of 50', explanation: "Measure before changing anything. Without a baseline on a fixed test set, you cannot tell whether any fix helped." },
      { code: '2. Read the 3 failures', explanation: "All three failures have one cause. Knowing the pattern points to the cheapest fix." },
      { code: '3. Add 3 worked examples ... 49 of 50', explanation: "Few-shot examples fixed most of it in minutes, at no cost. This step solves many problems that look like they need fine-tuning." },
      { code: '4. Is this missing knowledge?', explanation: "The key question. Missing or changing facts call for RAG. Inconsistent behavior is what fine-tuning addresses." },
      { code: 'b. fine-tune the small model', explanation: "It would likely work, but the cost is real: labeling and checking 300 notes, training runs, retesting, and repeating it all when the base model is replaced." },
      { code: '6. Decision: c for now', explanation: "Study Tracker already asks the learner to confirm each draft, which catches a rare slip for free. Fine-tuning becomes worth it only if the volume or the error rate grows. Deciding not to fine-tune, for now, is a perfectly good outcome." },
    ],
  },
  tryIt: {
    instructions: [
      'Write 20 study notes as you would really type them, with the correct subject and minutes for each. Include at least four tricky ones.',
      'Use the code above to turn 15 of them into a `train.jsonl` file, one example per line. Keep the other 5 as a test set and never train on them.',
      'Run the 5 test notes through your current parser from Structured Outputs and record the score, which is your baseline. Then add 3 of your tricky notes to the prompt as examples and score again.',
      'Optional, and it may cost money: if your provider or an open-source tool offers fine-tuning, train on `train.jsonl` and compare all three scores on the same 5 test notes.',
    ],
    evidencePrompt: {
      label: 'Your scores',
      placeholder: 'For example: Baseline 3 of 5. With three examples in the prompt, 5 of 5, so fine-tuning is not needed yet.',
    },
  },
  mistakes: [
    { mistake: 'Fine-tuning to add facts, especially ones that change.', fix: 'Use RAG for facts. It can be updated instantly and lets answers cite their sources.' },
    { mistake: 'Fine-tuning before trying better prompts and examples.', fix: 'Improve the prompt and add few-shot examples first. They are free, instant and often enough.' },
    { mistake: 'Testing a fine-tuned model on its own training examples.', fix: 'Keep a separate test set that is never trained on, or a model that memorized the answers will look perfect.' },
    { mistake: 'Putting personal data into training examples.', fix: 'Remove names and private details first. Anything in the training data can come back out of the model.' },
  ],
  quiz: [
    {
      question: 'Study Tracker\'s assistant should answer questions from notes the learner adds every day. Which approach fits best?',
      options: [
        { text: 'Fine-tune the model on the notes every night', explanation: 'Retraining daily is slow and costly, the model may misremember notes, and it cannot cite them.' },
        { text: 'Put every note in the system prompt', explanation: 'The notes would soon overflow the context window, and every request would pay for all of them.' },
        { text: 'RAG: search the notes for each question and answer from what is found', explanation: 'New notes become searchable as soon as they are indexed, and answers can cite them.' },
        { text: 'Switch to the largest model available', explanation: 'No model has seen your private notes, whatever its size.' },
      ],
      answer: 2,
    },
    {
      question: 'You fine-tune on 300 examples, then test on 50 of those same examples and score 100%. What does that show?',
      options: [
        { text: 'Very little, because the model may simply have memorized them. You need examples it never trained on', explanation: 'A fair test uses held-out examples, which show how it handles new inputs.' },
        { text: 'The fine-tuned model is perfect', explanation: 'A perfect score on training data is expected even from a model that learned nothing general.' },
        { text: 'The base model was already perfect', explanation: 'You never tested the base model, so you cannot compare.' },
        { text: 'You should train on even more of the same examples', explanation: 'The problem is the test, not the amount of training.' },
      ],
      answer: 0,
    },
    {
      question: 'After good prompts and few-shot examples, a small model still formats replies inconsistently, and your app sends a million requests a month. What is most worth considering?',
      options: [
        { text: 'RAG over a folder of formatting guides', explanation: 'Formatting is behavior, not missing facts, so retrieval is unlikely to help.' },
        { text: 'Fine-tuning the small model on many consistent examples', explanation: 'Consistent behavior from a small, cheap model at high volume is what fine-tuning is good for.' },
        { text: 'Raising the temperature', explanation: 'Higher temperature makes output less consistent, not more.' },
        { text: 'Removing the examples from the prompt', explanation: 'That would make the formatting worse.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Fine-tuning reshapes a model\'s behavior through its weights, so try better prompts first, use RAG for facts, and fine-tune only when tested evidence shows behavior is still inconsistent and the volume justifies the cost.',
  resources: [
    { title: 'LoRA', provider: 'Hugging Face PEFT', description: 'How low-rank adaptation works, with code for fine-tuning open-weight models.', url: 'https://huggingface.co/docs/peft/main/en/conceptual_guides/lora' },
    { title: 'Supervised fine-tuning trainer', provider: 'Hugging Face TRL', description: 'An open-source library for fine-tuning on conversation-style examples.', url: 'https://huggingface.co/docs/trl/sft_trainer' },
    { title: 'LoRA: Low-Rank Adaptation of Large Language Models', provider: 'arXiv', description: 'The 2021 research paper that introduced LoRA.', url: 'https://arxiv.org/abs/2106.09685' },
    { title: 'JSON Lines', provider: 'jsonlines.org', description: 'The one-object-per-line format used for most training files.', url: 'https://jsonlines.org/' },
  ],
  underTheHood: {
    heading: 'How LoRA makes fine-tuning cheap',
    paragraphs: [
      "A single layer in a language model can hold a weight matrix of 4,096 rows by 4,096 columns: 16,777,216 numbers. Fine-tuning it the ordinary way means updating every one of them, for every such layer, and keeping extra training data in memory for each. That needs expensive hardware.",
      "LoRA freezes that matrix and learns two thin ones instead: one of 4,096 by 8 and one of 8 by 4,096. Multiplied together, as in the Math lesson Matrices and Linear Algebra, they produce a full-size 4,096 by 4,096 adjustment that is added to the frozen weights. But together they hold only 65,536 numbers, about 0.4% of the original.",
      "The bet is that the change you need is simple enough to express this compactly, and for most narrow tasks it is. Training far fewer numbers needs far less memory, so LoRA can run on a single graphics card. The result is a small adapter file. Several adapters can share one base model and be swapped per task. The 8 here is called the rank, and raising it gives the adapter more room to learn.",
    ],
  },
}

export default lesson
