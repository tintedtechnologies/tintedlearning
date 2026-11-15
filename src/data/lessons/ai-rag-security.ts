import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'RAG from AI Engineering, with Study Tracker\'s notes indexed for search, and How Apps Get Attacked and AI Security from this section. Run every attack only on your own local copy of Study Tracker, with made-up notes for two learners.',
  goals: [
    'Explain why search results are untrusted input, and why a citation does not make them safe',
    'Filter notes by the learner\'s permissions before the search ranks them',
    'Remove a deleted note from the index, so the assistant cannot quote it later',
  ],
  bigIdea: "Retrieval-augmented generation adds a search step between the learner and the model, and that step decides what the model is allowed to see. The search must return only notes the learner may read, because the model repeats anything it is given. Retrieved text is also untrusted, so it needs the same labels and checks as any other input.",
  whyItMatters: "Once Study Tracker serves many learners, one index holds everyone's notes. If the search ranks all notes together and only the final answer is filtered, one learner's private note can reach the prompt for another learner's question, even when the answer never quotes it. A deleted note that still has vectors in the index can also keep answering questions.",
  goalSections: [
    {
      heading: 'The search is an access decision',
      paragraphs: [
        "Whatever the search returns is what the model can use. So the search is an access decision, not just a ranking step. A note that reaches the prompt has left the protected part of the system, even if the answer later leaves it out.",
        "The safe order is the reverse of the naive one. First keep only the notes this learner may read. Then search, rank and build the prompt from that smaller set. The model never sees what it was not allowed to see, so there is nothing to hide afterwards.",
        "Test the order with two learners, not by reading the code. Ask a question that only Ben's note answers while logged in as Ana. Ana's results must be empty and her answer must not contain Ben's text. Tests like this catch leaks that a careful reading of the code can miss. Keep the test in your suite, so a later change that removes the filter fails loudly.",
      ],
      example: {
        language: 'text',
        code: code`
          Naive order (leaks)              Safe order
          1. search all notes              1. keep notes where owner = this learner
          2. rank them                     2. search and rank only those
          3. build the prompt              3. build the prompt
          4. hide other learners' text     4. the model never saw anyone else's notes
        `,
      },
    },
    {
      heading: 'Retrieved text is untrusted input',
      paragraphs: [
        "A note the learner imported can contain instructions, as the previous lesson showed. A citation does not change that. The model can cite a note that says something false or hostile, and the number in brackets only says where the text came from, not whether it is safe.",
        "Keep each chunk\'s metadata with it: the owner, the source file, how it was imported and when. Show that metadata with the answer. Then a learner can see that a surprising sentence came from a web page they imported last week, not from their own lecture notes.",
      ],
      example: {
        language: 'text',
        code: code`
          Chunk stored with its metadata
            owner: ana
            source: algebra.md
            imported_from: classmate share, 2026-11-02
            text: "Solve for x by moving terms across an equals sign."
        `,
      },
    },
    {
      heading: 'Keep the index in step with the notes',
      paragraphs: [
        "A vector index is a second copy of your notes. If you delete a note from the notes table but leave its chunks in the index, the search will keep returning text the learner removed. Deletion has to remove both copies, and the answer has to be checked against the notes table, not only the index.",
        "Re-indexing an edited note works the same way. Remove the old chunks first, then add the new ones, so an edit never leaves two versions competing in the search.",
      ],
      example: {
        language: 'text',
        code: code`
          DELETE /notes/7
            1. delete the row in notes (id 7)
            2. delete every chunk whose note_id is 7
            3. return 204, so the learner knows the note is gone
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Two learners, one index',
    intro: "The script below uses a simple word-overlap score instead of embeddings, so the result is easy to check. The lesson\'s point does not depend on the score. Whatever ranking you use, the owner filter has to come first. Run it on your own computer with made-up notes.",
    example: {
      language: 'python',
      filename: 'owner_filter.py',
      code: code`
        chunks = [
            {"owner": "ana", "source": "biology.md", "text": "Mitochondria make ATP."},
            {"owner": "ben", "source": "private.md", "text": "Ben's exam password hint is the name of his dog."},
            {"owner": "ana", "source": "algebra.md", "text": "Solve for x by moving terms across an equals sign."},
        ]

        def overlap(query, text):
            return len(set(query.lower().replace("?", "").split()) & set(text.lower().replace(".", "").split()))

        def search_naive(query, notes):
            results = [(overlap(query, c["text"]), c["source"]) for c in notes]
            return sorted([r for r in results if r[0]], reverse=True)

        def search_for_learner(query, learner, notes):
            allowed = [c for c in notes if c["owner"] == learner]
            return search_naive(query, allowed)

        question = "what is the exam password?"
        print("Naive:", search_naive(question, chunks))
        print("Fixed:", search_for_learner(question, "ana", chunks))
      `,
      output: "Naive: [(4, 'private.md')]\nFixed: []",
    },
    steps: [
      { code: 'chunks = [ {"owner": "ana", ...}, {"owner": "ben", ...} ]', explanation: "One index holds both learners' notes, with an owner stored beside each chunk. This is how most real systems start, and why the owner field matters." },
      { code: 'results = [(overlap(query, c["text"]), c["source"]) for c in notes]', explanation: "The naive search ranks every note, including Ben's, with no regard for who is asking. This is the leak." },
      { code: 'allowed = [c for c in notes if c["owner"] == learner]', explanation: "The fix. The filter runs before scoring, so Ben's chunk is never compared, returned or added to the prompt." },
      { code: 'print("Fixed:", search_for_learner(question, "ana", chunks))', explanation: "Ana gets nothing back for a question about Ben's password, because none of her notes match. The model is never given Ben's text." },
    ],
  },
  tryIt: {
    instructions: [
      'Add an `owner` column to the notes and note chunks in `db.py`. For now, read the learner\'s name from a placeholder header such as `X-Learner: demo`. The Identity lesson replaces this with real sign-in.',
      'Change `notes.search` so it filters by owner before it scores or sorts anything. Copy the order from the diagram above.',
      'Make `DELETE /notes/{id}` remove the note and its chunks in one transaction. Add `test_rag_security.py` with two learners. It should check that Ana never sees Ben\'s text, and that a deleted note stops appearing in answers.',
    ],
  },
  mistakes: [
    { mistake: 'Filtering the answer instead of the search.', fix: 'Filter the notes before ranking, so the model never receives text the learner may not read.' },
    { mistake: 'Deleting a note but not its chunks.', fix: 'Delete both in one transaction, and test that a deleted note never appears again.' },
    { mistake: 'Treating a citation as proof that a source is safe.', fix: 'Show the source and its import history with the answer, and treat every chunk as untrusted text.' },
    { mistake: 'Storing every learner\'s notes with no owner field.', fix: 'Store the owner with each chunk from the start, because adding it later means re-indexing everything.' },
  ],
  quiz: [
    {
      question: 'Ana asks about exam dates. The search returns Ben\'s private note, and the assistant does not quote it. What is wrong?',
      options: [
        { text: 'The model should have been told to refuse', explanation: 'The refusal came too late. Ben\'s note already reached the prompt, which is the leak.' },
        { text: 'The note was too short to match', explanation: 'A short note matching is not the issue. The problem is that another learner\'s note was ranked at all.' },
        { text: 'Ben\'s note reached the prompt, because the search did not filter by owner, even though the answer hid it', explanation: 'The filter belongs before the search. A hidden answer does not undo what the model already received.' },
        { text: 'Ana should have typed more words', explanation: 'Her question is fine. The search should never have considered Ben\'s notes for her.' },
      ],
      answer: 2,
    },
    {
      question: 'Ben deletes a note. Two days later, a question that matched it gets an answer quoting the deleted text. What most likely happened?',
      options: [
        { text: 'The model remembered the note from its training', explanation: 'The model was never trained on the learner\'s notes, so it cannot remember them.' },
        { text: 'The note\'s chunks stayed in the index after the note was deleted', explanation: 'Deleting the note row alone leaves a second copy in the index, which the search still finds.' },
        { text: 'The question was too similar to the note', explanation: 'Similar questions are normal. The problem is the leftover copy, not the question.' },
        { text: 'The temperature setting was too high', explanation: 'Temperature changes wording, not what the search returns.' },
      ],
      answer: 1,
    },
    {
      question: 'Which order is the safest for a question from one learner?',
      options: [
        { text: 'Search all notes, write the prompt, then remove any answer that mentions another learner', explanation: 'The prompt already contains the other learner\'s text, so removing it from the answer is too late.' },
        { text: 'Search all notes, rank them, then drop the other learners\' notes before the prompt', explanation: 'Ranking other learners\' notes still reads them, and mistakes in the drop step would leak them.' },
        { text: 'Search all notes, then ask the model to ignore notes that belong to other learners', explanation: 'A request to the model is not an access check, so this cannot be relied on.' },
        { text: 'Keep only the notes this learner may read, then search, then write the prompt', explanation: 'Filtering first means the search and the model never handle text the learner may not see.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Filter the search by the learner\'s permissions before ranking, treat retrieved text as untrusted, and remove deleted notes from the index so the assistant cannot quote them.',
  resources: [
    { title: 'OWASP Top 10 for Large Language Model Applications', provider: 'OWASP GenAI Security Project', description: 'Includes the risks of vector and embedding weaknesses in retrieval systems.', url: 'https://genai.owasp.org/llm-top-10/' },
  ],
  underTheHood: {
    heading: 'Why embeddings do not carry permissions',
    paragraphs: [
      "An embedding is a list of numbers that places a passage near similar ones. It says nothing about who may read the passage. Permissions have to be stored beside the vector as metadata, such as an owner field, and checked whenever the search runs.",
      "Vector databases can apply a filter in two ways. Some filter first and then search among the allowed items. Others search for the closest items and then remove the ones that fail the filter. The second approach can return fewer results than you asked for, and it can waste work on items that were never allowed. Check which behavior your database uses, and test the result with two learners.",
      "Whatever the database does, keep the check in your own code as well. Your code knows the learner who asked. The database may not, unless you pass that identity on every query. A check you write and test yourself is the one you can rely on.",
    ],
  },
}

export default lesson
