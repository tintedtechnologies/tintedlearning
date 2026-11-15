import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiEmbed, appSearch, configEmbed, db, indexNotesScript, notesStore, testNotesStore } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Embeddings, with `notes.py`, the `notes` folder and an embedding model set in `AI_EMBED_MODEL`.',
  goals: [
    'Store note embeddings once, so each search only embeds the question',
    'Search stored vectors and narrow the results with filters on details such as the source file',
    'Decide when a dedicated vector database is worth adding',
  ],
  bigIdea: "A vector database stores embeddings together with the text and details they came from, and finds the stored vectors closest to a new one. You embed your notes once, whenever they change, instead of on every question. You can start with an ordinary SQLite table, and move to a dedicated vector database only when there are too many vectors to compare one by one.",
  whyItMatters: "Last lesson's `find_similar()` embeds every note paragraph each time someone asks a question. With four paragraphs that is instant. With 3,000 paragraphs from a year of notes, every question means embedding all 3,000 again: slow on your laptop, and paid for each time on a hosted service. Store the vectors, and each question costs one embedding: the question's own.",
  goalSections: [
    {
      heading: 'Embed once, store, reuse',
      paragraphs: [
        "Indexing means embedding every chunk once and saving the result. Study Tracker keeps it in a new table in `study.db`, called `note_chunks`, with one row per paragraph: the file it came from, the text and the vector.",
        "SQLite has no special type for vectors, so each vector is stored as JSON text, such as `[0.12, -0.03, ...]`. It is simple and readable, and `json.loads` turns it back into a list. Keeping the text and source next to the vector means a search result can be shown and cited without looking anything up elsewhere.",
        "An index is a copy, so it goes stale. When you edit your notes, run the indexing again. If you switch embedding models, rebuild the whole index, because old and new vectors cannot be compared.",
      ],
      example: {
        language: 'text',
        code: code`
          note_chunks
          id  source       text                                      embedding
          1   algebra.md   To add fractions, make the denominat...   [0.031, -0.112, ...]
          2   biology.md   Mitochondria turn glucose into ATP, ...   [0.054, 0.087, ...]
          3   biology.md   Photosynthesis happens in the chloro...   [-0.020, 0.141, ...]
          4   history.md   The Peace of Westphalia was signed i...   [0.118, -0.006, ...]
        `,
      },
    },
    {
      heading: 'Searching with filters',
      paragraphs: [
        "A search now has three steps: embed the question, compare it with every stored vector, and return the closest few. Returning the top few results is often called top-k, where k is how many you keep.",
        "The extra details stored with each vector, called metadata, let you filter before ranking. Searching only `biology.md` is an ordinary SQL `WHERE` clause. Later you might store a subject, a date or the learner who owns the note.",
        "That last one matters. In an app with many learners, filtering by owner is what stops one learner's search from returning another learner's notes. Like tool permissions, it belongs in code, never in a prompt.",
      ],
      example: {
        language: 'python',
        code: code`
          import json
          import sqlite3


          def cosine_similarity(a, b):
              dot = sum(x * y for x, y in zip(a, b))
              return dot / ((sum(x * x for x in a) ** 0.5) * (sum(x * x for x in b) ** 0.5))


          conn = sqlite3.connect(":memory:")
          conn.execute("CREATE TABLE note_chunks (source TEXT, text TEXT, embedding TEXT)")
          rows = [
              ("biology.md", "Mitochondria make ATP.", [0.9, 0.1, 0.0]),
              ("biology.md", "Plants use sunlight.", [0.6, 0.4, 0.1]),
              ("algebra.md", "Common denominators first.", [0.1, 0.1, 0.9]),
          ]
          conn.executemany("INSERT INTO note_chunks VALUES (?, ?, ?)", [(s, t, json.dumps(v)) for s, t, v in rows])

          question = [0.8, 0.0, 0.2]
          for source, text, embedding in conn.execute("SELECT * FROM note_chunks WHERE source = ?", ("biology.md",)):
              print(round(cosine_similarity(question, json.loads(embedding)), 2), text)
        `,
        output: '0.96 Mitochondria make ATP.\n0.83 Plants use sunlight.',
      },
    },
    {
      heading: 'When a dedicated vector database is worth it',
      paragraphs: [
        "Comparing the question with every stored vector is called exact search, and it is simpler than it sounds to outgrow. Timed in plain Python on a typical laptop, with 384 numbers per vector, comparing 1,000 vectors took about 0.02 seconds and 10,000 about 0.2 seconds. At around 100,000 it reaches seconds per question, which is too slow.",
        "Dedicated vector databases solve this with an approximate nearest neighbor index, which finds very close vectors without checking all of them, trading a tiny chance of missing the best match for a huge gain in speed. They also handle filtering, updates and storage at scale.",
        "You have choices at every size. The sqlite-vec extension adds vector search to SQLite. The pgvector extension adds it to PostgreSQL, the database the Cloud Engineering section moves Study Tracker to. Chroma is an open-source vector database you can run on your laptop, and cloud providers offer hosted options. Keep `search()` as the only function that knows how vectors are stored, so switching later means changing one file.",
      ],
      example: {
        language: 'text',
        code: code`
          Stored vectors     Reasonable choice
          up to ~10,000      a SQLite table and exact search, as in this lesson
          ~10,000+           sqlite-vec, pgvector or Chroma with an index
          millions           a dedicated or hosted vector database
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s notes.py with stored vectors',
    intro: "This version of `notes.py` replaces `find_similar()` with two functions: `index_notes()`, run when notes change, and `search()`, run for every question. The outputs at the end came from the running app and show typical results.",
    example: { language: 'python', filename: 'notes.py', code: notesStore, runnable: false, files: { 'config.py': configEmbed, 'ai.py': aiEmbed, 'db.py': db } },
    steps: [
      { code: 'CREATE TABLE IF NOT EXISTS note_chunks (', explanation: "The new table lives in `study.db` next to `sessions`. `db.connect()` already opens that file using `DATABASE_PATH`, so tests can point it at a temporary database." },
      { code: 'conn.execute("DELETE FROM note_chunks")', explanation: "Indexing rebuilds the table from scratch. For a few thousand paragraphs this takes seconds and avoids stale rows from edited or deleted notes." },
      { code: 'json.dumps(vector)', explanation: "Each vector is saved as JSON text. `executemany` inserts every row in one call, using `?` placeholders as in Databases and SQL." },
      { code: 'question_vector = embed([question])[0]', explanation: "The key saving: a search embeds only the question. The notes were embedded once, at indexing time." },
      { code: 'if source:\n    sql += " WHERE source = ?"', explanation: "An optional metadata filter. SQLite drops the rows from other files before any similarity is computed." },
      { code: '$ python index_notes.py\nIndexed 4 paragraphs from notes/', explanation: "Run this whenever your notes change. The `# Biology` style headings are skipped, so the three sample files give four paragraphs." },
      { code: 'GET /notes/search?q=How do cells get energy?\n[{"source": "biology.md", "text": "Mitochondria turn glucose into ATP, ...", "score": 0.63}, ...]', explanation: "The new endpoint in `app.py` returns the closest paragraphs. Add `&source=algebra.md` and only that file is searched." },
    ],
  },
  tryIt: {
    instructions: [
      'Replace `notes.py` with the version above, and add `index_notes.py` and the new `app.py` below. Run `python index_notes.py`.',
      'Start the app and try `GET /notes/search` in `/docs`, with and without a `source` filter.',
      'Edit one of your notes, search for the new wording before and after re-running `index_notes.py`, and see the stale index in action.',
      'Add `test_notes_store.py` and run `python -m pytest`. Then add a `.gitignore` check: `study.db` now holds your note vectors too, so make sure it is still ignored.',
    ],
    playground: 'embeddings',
    files: [
      { language: 'python', filename: 'index_notes.py', code: indexNotesScript, runnable: false },
      { language: 'python', filename: 'app.py', code: appSearch, runnable: false },
      { language: 'python', filename: 'test_notes_store.py', code: testNotesStore, files: { 'config.py': configEmbed, 'ai.py': aiEmbed, 'db.py': db, 'notes.py': notesStore }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Embedding every note on every search.', fix: 'Index once when notes change and store the vectors, so each search embeds only the question.' },
    { mistake: 'Forgetting to re-index after editing notes.', fix: 'Run `index_notes.py` after changes, or call it automatically when a note is saved.' },
    { mistake: 'Storing vectors without their text and source.', fix: 'Keep the text and metadata in the same row, so results can be shown, filtered and cited.' },
    { mistake: 'Adding a hosted vector database before you need one.', fix: 'Start with a table and exact search, measure, and move to an indexed option when searches get slow.' },
  ],
  quiz: [
    {
      question: 'With this lesson\'s `notes.py`, how many texts are embedded when a learner searches 3,000 indexed paragraphs?',
      options: [
        { text: '3,001: every paragraph plus the question', explanation: 'That was the last lesson\'s approach. The paragraphs are now stored already embedded.' },
        { text: '1: only the question', explanation: 'The paragraphs were embedded at indexing time, so a search only embeds the new question.' },
        { text: '3: one for each of the top results', explanation: 'Results come from stored vectors. Nothing is embedded for them.' },
        { text: '0: the question is matched by keywords', explanation: 'The question must be embedded to compare it with the stored vectors.' },
      ],
      answer: 1,
    },
    {
      question: 'Study Tracker gains many learners, and every note row stores an `owner` column. Where should the rule "only search your own notes" be enforced?',
      options: [
        { text: 'In the system prompt: "Only use the learner\'s own notes"', explanation: 'By the time the model sees other learners\' notes, the leak has already happened.' },
        { text: 'By trusting the embedding model to rank other learners\' notes lower', explanation: 'Similarity has nothing to do with who owns a note.' },
        { text: 'By asking learners not to search for other people\'s topics', explanation: 'A rule that depends on users behaving is not a protection.' },
        { text: 'In the search query, with a `WHERE owner = ?` filter set by the code', explanation: 'Rows from other learners are never read, so they cannot reach a result or a prompt.' },
      ],
      answer: 3,
    },
    {
      question: 'You switch to a different embedding model in `.env`. What must you do before searching again?',
      options: [
        { text: 'Run the indexing again, so every stored vector comes from the new model', explanation: 'Question and note vectors must come from the same model to be comparable.' },
        { text: 'Nothing, because the stored vectors are still valid', explanation: 'They were made by the old model, so comparing them with new question vectors is meaningless.' },
        { text: 'Delete the `sessions` table', explanation: 'Sessions are unrelated to note vectors and should be kept.' },
        { text: 'Lower the number of results returned', explanation: 'The problem is incompatible vectors, not the number of results.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Embed notes once into a table with their text and metadata, filter in code and compare only the question at search time, and move to an indexed vector database when exact search gets slow.',
  resources: [
    { title: 'pgvector', provider: 'GitHub', description: 'Open-source vector search for PostgreSQL, with exact and indexed search.', url: 'https://github.com/pgvector/pgvector' },
    { title: 'sqlite-vec', provider: 'GitHub', description: 'A small extension that adds vector search to SQLite.', url: 'https://github.com/asg017/sqlite-vec' },
    { title: 'Introduction to Chroma', provider: 'Chroma', description: 'An open-source vector database you can run locally.', url: 'https://docs.trychroma.com/docs/overview/introduction' },
    { title: 'Hierarchical Navigable Small Worlds', provider: 'Pinecone', description: 'A visual explanation of the most common approximate nearest neighbor index.', url: 'https://www.pinecone.io/learn/series/faiss/hnsw/' },
  ],
  underTheHood: {
    heading: 'How an approximate index skips most vectors',
    paragraphs: [
      "The most widely used vector index, called HNSW, short for hierarchical navigable small world, works like finding a house by asking for directions. When each vector is added, it is linked to a handful of its nearest neighbors, forming a web of connections. A few vectors are also copied into sparser upper layers with longer links, like highways above local streets.",
      "A search starts at the top layer and hops along whichever link gets closest to the question, drops down a layer, and repeats, until it reaches the bottom layer and examines the neighborhood it has arrived in. Instead of comparing the question with a million vectors, it might compare it with a few hundred.",
      "The catch is in the word approximate. Because it follows links rather than checking everything, it can occasionally miss the true closest vector. Settings let you trade speed for accuracy, and in practice the results are almost always the same as exact search, which is why nearly every vector database uses an index like this.",
    ],
  },
}

export default lesson
