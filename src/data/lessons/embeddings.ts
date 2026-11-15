import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiEmbed, configEmbed, notesAlgebra, notesBiology, notesHistory, notesV1, testNotes, tryNotes } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Tool Calling, with Study Tracker\'s `ai.py` working. The Math lesson Vectors and Representations helps but is not required.',
  goals: [
    'Explain what an embedding is and why similar meanings get similar vectors',
    'Measure how close two embeddings are with cosine similarity',
    'Embed your study notes and find the paragraphs closest to a question',
  ],
  bigIdea: "An embedding is a list of numbers, called a vector, that represents the meaning of a piece of text. An embedding model is trained so that texts with similar meanings get vectors pointing in similar directions, even when they share no words. Comparing vectors lets your code find related text by meaning, which is the foundation of searching your own notes.",
  whyItMatters: "You have months of study notes and want what you wrote about how cells get energy. A keyword search for \"power\" misses the paragraph that says \"Mitochondria turn glucose into ATP, the cell's energy currency\", because the word never appears in it. Embeddings find the mitochondria paragraph because they compare meaning, not spelling. Study Tracker's assistant will use exactly this to answer questions from your notes.",
  goalSections: [
    {
      heading: 'Text as a vector',
      paragraphs: [
        "An embedding model is a different kind of model from a chat model. It does not write text. It reads text and outputs a fixed-length list of numbers. The small model in the Embeddings playground outputs 384 numbers for every input, whether that input is two words or a whole paragraph. Larger models output more.",
        "No single number has a simple meaning such as \"is about biology\". What matters is where vectors sit relative to each other. Picture a map where similar meanings sit close together, except that the map has hundreds of directions instead of two.",
        "The model learns this from training on huge numbers of text pairs that mean similar things, such as a question and its answer, or a sentence and a rewording of it. Under the hood explains how.",
      ],
      example: {
        language: 'text',
        code: code`
          Text:       "studied algebra"
          Embedding:  [-0.016, 0.047, -0.052, 0.062, -0.142, ... 379 more numbers]
          Length:     384 numbers, from the Embeddings playground's model
        `,
      },
    },
    {
      heading: 'Measuring closeness',
      paragraphs: [
        "The usual way to compare two embeddings is cosine similarity. It measures whether two vectors point in the same direction: 1 means the same direction, 0 means unrelated, and negative values, which are rare in practice, point away from each other.",
        "The formula multiplies matching numbers and adds them up, which is called the dot product, then divides by the two vectors' lengths. Many embedding models already output vectors of length 1, and then cosine similarity is simply the dot product.",
        "Scores only mean something relative to each other. With one model, related sentences might score 0.6. With another, 0.8. So compare scores within one model, and choose any cutoff for \"close enough\" by testing with your own examples.",
      ],
      example: {
        language: 'python',
        code: code`
          def cosine_similarity(a, b):
              dot = sum(x * y for x, y in zip(a, b))
              length_a = sum(x * x for x in a) ** 0.5
              length_b = sum(x * x for x in b) ** 0.5
              return dot / (length_a * length_b)


          algebra = [0.9, 0.1, 0.0]
          equations = [0.8, 0.3, 0.1]
          smoothie = [0.0, 0.2, 0.9]
          print(round(cosine_similarity(algebra, equations), 2))
          print(round(cosine_similarity(algebra, smoothie), 2))
        `,
        output: '0.96\n0.02',
      },
    },
    {
      heading: 'Searching notes by meaning',
      paragraphs: [
        "To search notes by meaning, split them into chunks, usually paragraphs. One vector for a whole file blurs many topics together, while one per paragraph keeps each meaning sharp. Then embed every chunk and the question, score each chunk against the question and keep the highest scores.",
        "Always embed the question and the notes with the same model. Vectors from different models live on different maps, and comparing them gives meaningless scores.",
        "These real scores, from the playground's model, show the difference from keyword search. The mitochondria note wins clearly. The plants note shares no words with the query at all, yet it still beats the phone battery note, because it is closer in meaning.",
      ],
      example: {
        language: 'text',
        code: code`
          Query: "cell energy"
          0.64  Mitochondria turn glucose into ATP, the cell's energy currency.
          0.30  Plants use sunlight to make food.
          0.24  My phone battery dies fast.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Searching Study Tracker\'s notes',
    intro: "Here is `notes.py`, which reads every Markdown file in a `notes` folder and finds the paragraphs closest to a question. It uses a new `embed()` function in `ai.py`. The output is from the three sample notes in Try it yourself, with scores from the playground's model. Your embedding model will give different numbers, usually in the same order.",
    example: { language: 'python', filename: 'notes.py', code: notesV1, runnable: false, files: { 'config.py': configEmbed, 'ai.py': aiEmbed } },
    steps: [
      { code: 'for path in sorted(NOTES_DIR.glob("*.md")):', explanation: "Every `.md` file in `notes/` is read. Markdown, a plain text format where `#` marks a heading, is a common choice for notes." },
      { code: 'split("\\n\\n")', explanation: "A blank line separates paragraphs, so splitting on two newlines gives one chunk per paragraph." },
      { code: 'if text and not text.startswith("#")', explanation: "Empty pieces and heading lines such as \"# Biology\" are skipped. A heading on its own carries too little meaning to be a useful search result." },
      { code: '{"source": path.name, "text": text}', explanation: "Each chunk remembers its file. When the assistant answers from your notes later, it can say where the answer came from." },
      { code: 'vectors = embed([question] + [chunk["text"] for chunk in chunks])', explanation: "One request embeds the question and every chunk together, which is faster than one request each. The first vector is the question's." },
      { code: 'return sorted(chunks, key=lambda chunk: chunk["score"], reverse=True)[:top]', explanation: "Highest score first, keeping only the best few." },
      { code: '$ python try_notes.py\n0.63  biology.md: Mitochondria turn glucose into ATP, the cell\'s energy currency.\n0.43  biology.md: Photosynthesis happens in the chloroplasts of plant cells.\n0.07  algebra.md: To add fractions, make the denominators the same first.', explanation: "The mitochondria paragraph wins, though it never uses the word \"get\". Photosynthesis, also about energy in cells, comes second. The algebra note is far behind, as it should be." },
    ],
  },
  tryIt: {
    instructions: [
      'Pull an embedding model, for example from the embedding category of Ollama\'s library, and set `AI_EMBED_MODEL` in `.env`. Replace `config.py` and `ai.py` with the versions below.',
      'Create a `notes` folder with the three sample files below, add `notes.py` and `try_notes.py`, and run `python try_notes.py`.',
      'Add a paragraph from your own notes, then search for it using different words from the ones in the paragraph. Note its score and its rank.',
      'Add `test_notes.py` and run `python -m pytest`. Then open the Embeddings playground and compare a few of your own sentences.',
    ],
    playground: 'embeddings',
    files: [
      { language: 'python', filename: 'config.py', code: configEmbed, runnable: false },
      { language: 'python', filename: 'ai.py', code: aiEmbed, runnable: false },
      { language: 'text', filename: 'notes/biology.md', code: notesBiology },
      { language: 'text', filename: 'notes/algebra.md', code: notesAlgebra },
      { language: 'text', filename: 'notes/history.md', code: notesHistory },
      { language: 'python', filename: 'try_notes.py', code: tryNotes, runnable: false },
      { language: 'python', filename: 'test_notes.py', code: testNotes, files: { 'config.py': configEmbed, 'ai.py': aiEmbed, 'notes.py': notesV1 }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Comparing embeddings made by two different models.', fix: 'Embed the question and every chunk with the same model, and re-embed everything if you switch.' },
    { mistake: 'Embedding whole files as one vector.', fix: 'Split notes into paragraphs, so each vector stands for one idea and the best match is specific.' },
    { mistake: 'Using a fixed cutoff, such as 0.8, borrowed from somewhere else.', fix: 'Score ranges differ between models. Choose a cutoff by testing questions you know the answers to.' },
    { mistake: 'Assuming the closest paragraph is correct.', fix: 'Embeddings measure how related text is, not whether it is true. A wrong date scores almost as high as the right one.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: {
        language: 'python',
        code: code`
          def cosine_similarity(a, b):
              dot = sum(x * y for x, y in zip(a, b))
              return dot / ((sum(x * x for x in a) ** 0.5) * (sum(x * x for x in b) ** 0.5))


          print(round(cosine_similarity([3, 4], [6, 8]), 2))
        `,
      },
      options: [
        { text: '0.5', explanation: 'That would mean the vectors point in quite different directions, but [6, 8] is just [3, 4] doubled.' },
        { text: '2.0', explanation: 'Cosine similarity ignores length. Doubling a vector does not change its direction, and the result can never exceed 1.' },
        { text: '1.0', explanation: '[6, 8] points in exactly the same direction as [3, 4], so the similarity is 1.' },
        { text: '50.0', explanation: 'That is the dot product before dividing by the lengths, 5 and 10.' },
      ],
      answer: 2,
      answerIsOutput: true,
    },
    {
      question: 'You switch to a new embedding model for questions but keep the note vectors made with the old one. What happens?',
      options: [
        { text: 'Search improves, because the new model is better', explanation: 'The new question vectors cannot be meaningfully compared with the old note vectors.' },
        { text: 'Scores become meaningless, because vectors from different models are not comparable', explanation: 'Each model places meaning differently. Re-embed every note with the new model.' },
        { text: 'Nothing changes, because 384 numbers are 384 numbers', explanation: 'Even with the same length, the numbers mean different things in each model.' },
        { text: 'The code raises an error straight away', explanation: 'If the lengths happen to match, it runs and quietly returns poor results, which is worse.' },
      ],
      answer: 1,
    },
    {
      question: 'Your notes say "The Peace of Westphalia was signed in 1648." A classmate\'s notes say the same sentence with 1748. How similar are their embeddings likely to be?',
      options: [
        { text: 'Very different, because one date is wrong', explanation: 'Embeddings capture what text is about, not whether it is correct.' },
        { text: 'Exactly 1.0, because embeddings ignore numbers', explanation: 'The numbers do change the vector a little, just not by much.' },
        { text: 'Close to 0, because dates are always split into many tokens', explanation: 'Tokens do not decide similarity. The rest of the sentence is identical in meaning.' },
        { text: 'Very similar, because the sentences are about the same thing', explanation: 'With the playground\'s model they score 0.79. Similar topic, not similar truth.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'An embedding turns text into a vector so your code can compare meaning with cosine similarity, which finds related paragraphs in your notes even when they use different words, though related never means correct.',
  resources: [
    { title: 'Embeddings', provider: 'Ollama', description: 'Generating embeddings with a local model, with Python examples.', url: 'https://docs.ollama.com/capabilities/embeddings' },
    { title: 'Getting started with embeddings', provider: 'Hugging Face', description: 'A hands-on introduction to creating and comparing sentence embeddings.', url: 'https://huggingface.co/blog/getting-started-with-embeddings' },
    { title: 'Sentence Transformers', provider: 'SBERT', description: 'The documentation for a popular library of embedding models, including how they are trained.', url: 'https://www.sbert.net/' },
  ],
  underTheHood: {
    heading: 'How an embedding model learns what close means',
    paragraphs: [
      "Embedding models are usually trained on huge numbers of matching pairs: a question and the passage that answers it, a title and its article, two wordings of the same sentence. Training happens in batches. In a batch of, say, a thousand pairs, the model is rewarded when each question's vector is closer to its own passage than to the 999 other passages in the batch, and the weights are nudged until that is true. This approach is called contrastive learning.",
      "Repeat that over millions of pairs and a geometry of meaning appears: texts that tend to answer each other, or say the same thing, end up pointing in similar directions.",
      "Notice what was never rewarded: being true. \"Signed in 1648\" and \"signed in 1748\" answer the same kind of question, so they land close together, at 0.79 with the playground's model. Embeddings find text that is about the right thing. Deciding whether it is right is still the job of the model reading it, and of you.",
    ],
  },
}

export default lesson
