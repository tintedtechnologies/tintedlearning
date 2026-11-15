import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Name the kinds of input and output in an everyday multimodal task',
    'Explain how a model turns images and sound into tokens it can read alongside text',
    'Check multimodal results for the slips they typically make',
  ],
  bigIdea: "Multimodal AI works with more than one kind of information, such as text, images, audio and video. Each kind is called a modality. You can show a model a photo and ask about it in words, or speak to it and hear an answer, because every kind of input is turned into tokens that one model can read together.",
  whyItMatters: "You photograph a page of handwritten history notes and ask an assistant to type them up as a study sheet. It saves you twenty minutes. But if it reads a smudged 8 as a 5, the sheet now gives the wrong year, in neat type that looks more trustworthy than your handwriting ever did. Knowing what these tools do well, and where they slip, lets you keep the twenty minutes without the wrong year.",
  goalSections: [
    {
      heading: 'Inputs and outputs',
      paragraphs: [
        "The easiest way to understand a multimodal tool is to name what goes in and what comes out. A photo of a math problem plus the question \"Why is step 3 allowed?\" is image and text in, text out. Asking a voice assistant a question while you cook is audio in, audio out.",
        "Turning speech into written words has its own name, transcription. Turning text into spoken audio is called text to speech. Both are everyday multimodal tasks, built into phones, video calls and accessibility tools.",
        "Some products use one model that handles several modalities at once. Others chain separate models together, for example one that transcribes, one that answers and one that speaks. From the outside, the two often look the same.",
      ],
      example: {
        language: 'text',
        code: code`
          Task                                             In              Out
          "Why is step 3 allowed?" + photo of the problem  image + text    text
          Lecture recording turned into notes              audio           text
          Screenshot of an error + "What does this mean?"  image + text    text
          "Draw a simple diagram of a plant cell"          text            image
          Spoken question while cooking                    audio           audio
        `,
      },
    },
    {
      heading: 'How pictures and sound become tokens',
      paragraphs: [
        "A model can only work with numbers, so every modality is converted into token-like lists of numbers first. An image is usually resized, then cut into a grid of small square patches. Each patch becomes one list of numbers, much like one text token. Audio is cut into very short slices, a fraction of a second each, and treated the same way.",
        "Once everything is tokens, attention works across all of them together. The word \"red\" in your question can attend to the patches of the photo that contain red, which is how the model connects your words to the right part of the picture.",
        "Two practical results follow. Images and audio use up tokens, often a lot of them, so they count against the context window and the cost. And because large images are often shrunk before being cut up, very small text in a photo can become unreadable to the model even though you can read it.",
      ],
      example: {
        language: 'text',
        code: code`
          Photo of your notes
            -> resized to a standard size
            -> cut into a grid of small patches
            -> each patch becomes a list of numbers, like a token
            -> patches + the tokens of your question go into the model together
            -> the reply is written one text token at a time
        `,
      },
    },
    {
      heading: 'Where multimodal models slip',
      paragraphs: [
        "These models are impressive at describing a scene, reading clear printed text and explaining a diagram. They are much weaker at some things that look easy to people: counting many similar objects, reading small, blurry or handwritten text, reading exact values off a chart, and telling apart look-alike symbols such as 5 and 8 or mg and ml. With audio, names and technical terms are often misheard. Generated images often contain garbled lettering.",
        "As with text, the model rarely says it cannot see clearly. A blurry digit is read as some digit, in the same confident tone as a sharp one.",
        "So check the parts where one misread changes the meaning: numbers, names, units and dates. Asking the model to mark anything it is unsure about helps, but it will not catch everything. And look at what else is in a photo before you send it: faces, addresses and open screens are easy to include by accident.",
      ],
      example: {
        language: 'text',
        code: code`
          Usually reliable              Check carefully
          describing a scene            counting 23 similar objects
          reading clear printed text    handwriting and small print
          explaining a diagram          exact numbers from a chart
          summarizing a clear recording names and technical terms in audio
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'From a photo of notes to a study sheet',
    intro: "A learner photographs one page of handwritten history notes and asks an assistant to type it up. The reply shown is a typical one, and yours will differ. Compare it with what the page actually says.",
    example: {
      language: 'text',
      code: code`
        Input:  a photo of one page of handwritten notes
        Prompt: Type out these notes exactly as written. Put [?] after any
                word you are not sure about. Then list 3 key terms.

        A typical reply:
          Peace of Westphalia
          - signed in 1645
          - ended the Thirty Years' War
          - recognized each state's control over its own territory [?]
          Key terms: Westphalia, Thirty Years' War, sovereignty

        What the page says: signed in 1648
      `,
    },
    steps: [
      { code: 'Input: a photo ... Prompt: ...', explanation: "Image and text go in together. The photo becomes patches, the request becomes text tokens, and the model reads both at once." },
      { code: 'Type out these notes exactly as written.', explanation: "Asking for an exact copy rather than a summary matters. Otherwise the model may tidy, reword or fill gaps from what it knows, and you lose track of what came from your page." },
      { code: 'Put [?] after any word you are not sure about.', explanation: "This invites the model to flag doubt. It marked one line, where the handwriting was cramped. That is useful, but it is not a guarantee that everything else is right." },
      { code: '- signed in 1645', explanation: "The 8 in the notes was written with a small gap, and the model read it as a 5, with no [?] mark. A misread digit is one of the most common slips, and it looks exactly as confident as the correct lines." },
      { code: 'What the page says: signed in 1648', explanation: "Comparing every number, name and date against the photo takes under a minute and catches the error. The rest of the page, the plain words, came out correctly." },
      { code: 'Key terms: Westphalia, Thirty Years\' War, sovereignty', explanation: "\"Sovereignty\" is not on the page. The model added it from its own knowledge because it fits the topic. Here it is correct and useful, but it shows why an exact copy and an AI summary are different things." },
    ],
  },
  tryIt: {
    instructions: [
      'Pick a page of your own handwritten notes that contains nothing private, and include at least a few numbers or dates.',
      'In a free assistant that accepts images, send a clear photo with the same prompt as above: exact copy, [?] for anything unsure, then 3 key terms.',
      'Check every number, name and date against the page and count the errors. Then send a darker or more distant photo of the same page and compare the error count.',
    ],
    evidencePrompt: {
      label: 'What you found',
      placeholder: 'For example: The clear photo had 1 error, a 7 read as a 1. The dark photo had 4 errors, and only 2 were marked with [?].',
    },
  },
  mistakes: [
    { mistake: 'Trusting text read from a photo without checking the numbers and names.', fix: 'Compare every number, name, unit and date with the original. Those are where one misread changes the meaning.' },
    { mistake: 'Sending a blurry, dark or distant photo.', fix: 'Use good light, fill the frame with the part that matters, and crop out the rest. Sharper input means fewer guesses.' },
    { mistake: 'Uploading photos that show more than you meant to share.', fix: 'Before sending, check for faces, addresses, ID cards and open screens in the background, and crop them out.' },
    { mistake: 'Asking for an exact count or measurement and using it as is.', fix: 'Ask the model to list each item it counted so you can check, or count it yourself when the number matters.' },
  ],
  quiz: [
    {
      question: 'An app turns a recorded lecture into written notes. What are its input and output?',
      options: [
        { text: 'Text in, audio out', explanation: 'That is text to speech, the opposite direction.' },
        { text: 'Audio in, text out', explanation: 'The recording is audio, and the notes are text. This is transcription.' },
        { text: 'Image in, text out', explanation: 'No picture is involved, only sound.' },
        { text: 'Audio in, audio out', explanation: 'The notes are written, so the output is text.' },
      ],
      answer: 1,
    },
    {
      question: 'An assistant reads a slightly blurry photo of a receipt and says the total is $43.80. What should you do before using that number?',
      options: [
        { text: 'Nothing, because the model would say if it could not read it', explanation: 'Models rarely admit they cannot see clearly. A blurry digit still gets read as some digit.' },
        { text: 'Ask it twice and use whichever answer appears both times', explanation: 'A misread can repeat. Agreement between two runs is not a check against the receipt.' },
        { text: 'Compare the total with the photo yourself', explanation: 'Numbers in unclear images are a common slip, and checking against the source is the only real test.' },
        { text: 'Ask it to describe the receipt in more detail', explanation: 'More description does not confirm the one number you need.' },
      ],
      answer: 2,
    },
    {
      question: 'Why can attaching a large photo make a request slower and more expensive?',
      options: [
        { text: 'The photo is turned into many tokens, which count toward the window and the cost', explanation: 'Images become patches, each like a token, and a big image can mean many of them.' },
        { text: 'A person has to look at the photo and describe it to the model', explanation: 'The model reads the image directly, as patches of numbers.' },
        { text: 'The model has to be trained on the photo before it can answer', explanation: 'Weights do not change during use. The photo is just more input.' },
        { text: 'The photo is saved forever on the provider\'s servers', explanation: 'Storage policy varies by provider, and it is not why the request is slower or costs more.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Multimodal AI turns pictures and sound into tokens so it can read them alongside your words, which makes it remarkably useful and means you should check its numbers, names and small details against the original.',
  resources: [
    { title: 'Vision Language Models Explained', provider: 'Hugging Face', description: 'How models that read images and text together are built and used.', url: 'https://huggingface.co/blog/vlms' },
    { title: 'What is multimodal AI?', provider: 'Google Cloud', description: 'A short overview with everyday examples across text, images, audio and video.', url: 'https://cloud.google.com/use-cases/multimodal-ai' },
    { title: 'An Image is Worth 16x16 Words', provider: 'arXiv', description: 'The 2020 research paper that showed images can be read as a grid of patch tokens.', url: 'https://arxiv.org/abs/2010.11929' },
  ],
  underTheHood: {
    heading: 'One model, or a chain of models?',
    paragraphs: [
      "Many voice assistants were first built as a chain. One model transcribes your speech into text. A language model writes a reply in text. A third model turns that reply into speech. Each part is good at its own job and can be replaced on its own.",
      "Chains have a cost. Everything except your words is lost at the first step: your tone, your hesitation, whether you sounded confused. And the delays of three models add up, which makes conversation feel slow.",
      "Models that take audio tokens directly avoid both problems. They can respond to how you said something, not only what you said, and reply quickly enough for natural back-and-forth, including being interrupted. Chains are still common, though, because each part is cheaper, easier to swap and easier to inspect: a written transcript in the middle is simple to log and check.",
    ],
  },
}

export default lesson
