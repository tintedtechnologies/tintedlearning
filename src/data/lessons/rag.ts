import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiEmbed, appRag, assistant, configEmbed, db, extract, notesStore, rag, schemas, testRag } from './study-tracker'

const ragFiles = { 'config.py': configEmbed, 'ai.py': aiEmbed, 'db.py': db, 'notes.py': notesStore, 'rag.py': rag }
const appFiles = { ...ragFiles, 'schemas.py': schemas, 'extract.py': extract, 'assistant.py': assistant, 'app.py': appRag }

const lesson: StructuredLesson = {
  assumes: 'Vector Databases, with your notes indexed in `study.db` and `GET /notes/search` working.',
  goals: [
    'Explain how retrieval-augmented generation answers questions from your own documents',
    'Build a prompt that numbers its sources so every fact can be cited',
    'Make the assistant say it does not know when the notes do not answer the question',
  ],
  bigIdea: "Retrieval-augmented generation, or RAG, answers a question in two steps. First it searches your documents for the passages most related to the question, then it gives those passages to a language model with the instruction to answer only from them. The model writes the answer, but the facts come from your documents, and each one can be traced back to its source.",
  whyItMatters: "Ask a general chatbot what your teacher said about the Krebs cycle and it can only guess, because it has never seen your notes. Paste all your notes into every question and you soon run out of context window and money. RAG sends only the few paragraphs that matter, so Study Tracker's assistant can answer from a year of notes, show which note each fact came from and admit when your notes do not cover something.",
  goalSections: [
    {
      heading: 'Search, then answer',
      paragraphs: [
        "A RAG request runs in a fixed order. Embed the question, search the stored note vectors, keep the best matches, put them in a prompt, ask the model, and return the answer together with the passages it used.",
        "It works for the reason AI Hallucinations gave: a model answers more accurately when the facts are in front of it instead of being recalled from training. It also handles private and recent information, such as your notes from this morning, without retraining anything.",
        "The quality of a RAG answer depends most on the search step. If the right paragraph is not found, the model cannot use it, however good the model is. That is why Study Tracker keeps `GET /notes/search` as its own endpoint: you can check the search results separately.",
      ],
      example: {
        language: 'text',
        code: code`
          "How do cells get energy?"
            -> embed the question
            -> search note_chunks: 0.63 mitochondria, 0.43 photosynthesis, 0.07 fractions
            -> keep matches scoring at least 0.35: the first two
            -> prompt: numbered notes + the question
            -> model answers, citing [1]
            -> return the answer and the two sources
        `,
      },
    },
    {
      heading: 'Numbered sources and citations',
      paragraphs: [
        "Give each passage a number in square brackets and include the file it came from. Put the passages between `<notes>` tags, as in Prompt Engineering, so the model can tell them apart from the question. The system prompt asks the model to write the matching number after each fact it uses.",
        "Return the sources alongside the answer, with their full text. Then the app can show the learner exactly what note [1] says, and checking a fact takes one glance.",
        "Citations make checking easy, but they are not proof. A model can occasionally attach [2] to a fact that came from [1], or to nothing at all. Showing the source text is what lets the learner catch it.",
      ],
      example: {
        language: 'python',
        filename: 'try_prompt.py',
        files: ragFiles,
        code: code`
          from rag import build_prompt

          matches = [
              {"source": "biology.md", "text": "Mitochondria turn glucose into ATP, the cell's energy currency."},
              {"source": "biology.md", "text": "Photosynthesis happens in the chloroplasts of plant cells."},
          ]
          print(build_prompt("How do cells get energy?", matches))
        `,
        output: "<notes>\n[1] (biology.md) Mitochondria turn glucose into ATP, the cell's energy currency.\n[2] (biology.md) Photosynthesis happens in the chloroplasts of plant cells.\n</notes>\n\nQuestion: How do cells get energy?",
      },
    },
    {
      heading: 'Saying "I don\'t know"',
      paragraphs: [
        "Study Tracker refuses to guess at two levels. The first is in code. If no paragraph scores at least `MIN_SCORE`, nothing related exists, so it returns a fixed reply without calling the model at all. That costs nothing and cannot go wrong.",
        "The second is in the prompt. Sometimes a paragraph is related but does not contain the answer. \"What does ATP stand for?\" scores 0.54 against the mitochondria note, which never says. The instruction to reply exactly \"I couldn't find that in your notes\" covers this case. Without it, the model would answer from its training, uncited, and the learner could not tell.",
        "The right minimum score depends on your embedding model. These real scores, from the Embeddings playground's model, show how to choose one: unrelated questions score low, related ones higher.",
      ],
      example: {
        language: 'text',
        code: code`
          Question                              Best score   Result with MIN_SCORE = 0.35
          Where does photosynthesis happen?     0.79         answered from [1], biology.md
          How do cells get energy?              0.63         answered from [1] and [2]
          What does ATP stand for?              0.54         sent to the model, which says not found
          Who won the 1998 World Cup?           0.11         not found, model never called
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s rag.py',
    intro: "This file connects the search from Vector Databases to `ask_model()`. The responses at the end came from the running app with a model connected, and show typical replies.",
    example: { language: 'python', filename: 'rag.py', code: rag, runnable: false, files: ragFiles },
    steps: [
      { code: 'MIN_SCORE = 0.35', explanation: "The lowest similarity that counts as a match. The comment says how to tune it: try questions your notes can and cannot answer, and pick a value between their scores." },
      { code: 'If the notes do not answer the question, reply exactly: {NOT_FOUND}', explanation: "The system prompt uses the same sentence as the code's own not-found reply, so the learner sees one consistent message either way." },
      { code: 'f"[{number}] ({match[\'source\']}) {match[\'text\']}"', explanation: "Each passage gets a number and its file name. `enumerate(..., start=1)` numbers them from 1, as people expect." },
      { code: 'matches = [match for match in notes.search(question, top=3) if match["score"] >= MIN_SCORE]', explanation: "Up to three paragraphs, and only those that are related enough. Unrelated notes never reach the prompt, where they could only confuse the model." },
      { code: 'if not matches:\n    return {"answer": NOT_FOUND, "sources": []}', explanation: "The first \"I don't know\": no model call at all. The log records that it happened, without recording the question, which may be personal." },
      { code: 'POST /notes/ask {"question": "How do cells get energy?"}\n{"answer": "Cells get energy from mitochondria, which turn glucose into ATP [1].", "sources": [{"number": 1, "source": "biology.md", ...}, {"number": 2, ...}]}', explanation: "A typical answer with its citation. Both sources come back, so the app can show the learner the note behind [1]." },
      { code: 'POST /notes/ask {"question": "Who won the 1998 World Cup?"}\n{"answer": "I couldn\'t find that in your notes.", "sources": []}', explanation: "Nothing scored above the minimum, so the reply is honest, instant and free." },
    ],
  },
  tryIt: {
    instructions: [
      'Add `rag.py` and replace `app.py` with the version below, which adds `POST /notes/ask`. Make sure your notes are indexed.',
      'In `/docs`, ask three questions: one your notes answer, one that is related but not answered, such as "What does ATP stand for?", and one that is unrelated. Check each citation against its source text.',
      'Print the scores from `GET /notes/search` for five questions you can and cannot answer, and adjust `MIN_SCORE` if needed.',
      'Add `test_rag.py` and run `python -m pytest`. The tests replace both the search and the model, so they run without either.',
    ],
    files: [
      { language: 'python', filename: 'app.py', code: appRag, runnable: false },
      { language: 'python', filename: 'test_rag.py', code: testRag, files: appFiles, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Sending passages without telling the model to use only them.', fix: 'Say so in the system prompt, and give it an exact sentence to use when the passages do not answer the question.' },
    { mistake: 'Having no minimum score, so some notes are always sent.', fix: 'Drop matches below a tested threshold, and skip the model entirely when nothing is left.' },
    { mistake: 'Showing citation numbers without the text they point to.', fix: 'Return each source\'s file and text with the answer, so the learner can check it.' },
    { mistake: 'Blaming the model for a bad answer before checking the search.', fix: 'Look at what `GET /notes/search` returns for the same question first. Most RAG failures are search failures.' },
  ],
  quiz: [
    {
      question: 'The search returns scores of 0.31, 0.22 and 0.12, and `MIN_SCORE` is 0.35. What does `answer_from_notes()` return?',
      options: [
        { text: 'An answer built from the 0.31 paragraph, the best available', explanation: 'The best is still below the minimum, so it is treated as unrelated.' },
        { text: 'An error, because there are no matches', explanation: 'No matches is a normal case with its own reply, not an error.' },
        { text: '"I couldn\'t find that in your notes." with no sources, without calling the model', explanation: 'Nothing passes the minimum, so the code returns the fixed reply straight away.' },
        { text: 'An answer from the model\'s own training', explanation: 'The model is never called when nothing matches.' },
      ],
      answer: 2,
    },
    {
      question: 'A learner asks "What does ATP stand for?". The mitochondria note scores 0.54, but it never says what ATP stands for. What should the reply be?',
      options: [
        { text: '"ATP stands for adenosine triphosphate [1]."', explanation: 'The fact may be true, but note [1] does not say it, so the citation is false and the answer did not come from the notes.' },
        { text: '"I couldn\'t find that in your notes."', explanation: 'The note is related but does not contain the answer, which is exactly what the instruction covers.' },
        { text: 'The mitochondria sentence, copied word for word', explanation: 'That does not answer the question.' },
        { text: 'An error, because the score is too low', explanation: '0.54 is above the minimum, so the note is sent to the model.' },
      ],
      answer: 1,
    },
    {
      question: 'The assistant gives a wrong answer about the Krebs cycle, even though your notes cover it correctly. What should you check first?',
      options: [
        { text: 'Whether a larger model fixes it', explanation: 'If the right note was never retrieved, no model can use it.' },
        { text: 'Whether raising the temperature helps', explanation: 'More randomness does not bring the right note into the prompt.' },
        { text: 'Whether adding "be accurate" to the prompt helps', explanation: 'The model cannot be accurate about a note it was never given.' },
        { text: 'Which paragraphs `GET /notes/search` returns for that question', explanation: 'Most RAG failures start with the search, so check what the model was actually given.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'RAG searches your notes, sends only the passages that are related enough with numbers to cite, returns those sources with the answer and refuses to guess when nothing in the notes answers the question.',
  resources: [
    { title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', provider: 'arXiv', description: 'The 2020 research paper that introduced the name RAG.', url: 'https://arxiv.org/abs/2005.11401' },
    { title: 'Advanced RAG', provider: 'Hugging Face Cookbook', description: 'A hands-on notebook covering chunking, retrieval and answer quality.', url: 'https://huggingface.co/learn/cookbook/advanced_rag' },
    { title: 'Chunking strategies', provider: 'Pinecone', description: 'How chunk size and overlap affect what retrieval finds.', url: 'https://www.pinecone.io/learn/chunking-strategies/' },
  ],
  underTheHood: {
    heading: 'Why chunk size matters',
    paragraphs: [
      "How you cut documents into chunks quietly decides what RAG can find. Chunks that are too small, such as single sentences, lose their context. A chunk that says \"It happens there in two stages\" has no idea what \"it\" or \"there\" means, so its embedding is vague and the model cannot use it.",
      "Chunks that are too large have the opposite problem. A whole page about cells blends mitochondria, membranes and division into one vector, which matches many questions weakly and none strongly. Large chunks also use more of the context window for each match.",
      "Common practice is chunks of a paragraph or a few hundred tokens. Many systems add a small overlap, repeating the last sentence or two of one chunk at the start of the next, so an idea that crosses a boundary appears whole somewhere. Some also put the document title or heading at the start of each chunk to keep its context. Study Tracker's one-paragraph chunks are a sensible start for notes, and the right choice for any project is found by testing questions against it.",
    ],
  },
}

export default lesson
