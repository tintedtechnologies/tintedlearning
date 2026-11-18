import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Break an AI feature into small steps: load, retrieve, build a prompt, call a model, check',
    'Build a simple keyword search that finds the right document before any model is involved',
    'Keep the model call behind one function so the rest can be tested without it',
  ],
  bigIdea: "An AI feature is mostly ordinary Python with one model call in the middle. You load your documents, find the ones relevant to a question, build a prompt from them, send it to a model and check what comes back. Writing each step as its own small function lets you test and improve them one at a time.",
  whyItMatters: "A small team builds a chatbot that answers questions about its staff handbook. It gives wrong answers, and nobody can tell why: did it find the wrong page, was the prompt confusing, or did the model make something up? Because everything is one tangled block, they cannot check. Splitting the pipeline into steps turns that mystery into three separate questions you can each answer with a quick test.",
  goalSections: [
    {
      heading: 'The steps of an AI feature',
      paragraphs: [
        "Most question-answering features follow the same path. Load: read the source documents. Retrieve: pick the few that are relevant to the question. Build a prompt: combine the question and those documents into instructions for the model. Generate: send the prompt to a model and get text back. Check: make sure the answer is usable before showing it.",
        "Giving the model the relevant documents, instead of hoping it already knows, is called retrieval-augmented generation, or RAG. It lets a general model answer questions about your own information.",
        "Write each step as a function with a clear input and output. Then, when an answer is wrong, you can look at what each step produced and find exactly where it went off course.",
      ],
      example: {
        language: 'text',
        code: code`
          question
            -> retrieve(question, documents)   -> the 2 most relevant documents
            -> build_prompt(question, docs)    -> one block of instruction text
            -> ask_model(prompt)               -> the model's answer text
            -> check(answer, docs)             -> answer, or "I don't know"
        `,
      },
    },
    {
      heading: 'A keyword baseline for retrieval',
      paragraphs: [
        "Before reaching for anything clever, start with the simplest retrieval that could work: count how many words the question shares with each document, and pick the documents with the highest counts. This is your baseline, the score that fancier methods must beat.",
        "Lower-case everything and split on spaces so `Vacation` and `vacation` match. Dropping very common words such as \"the\" and \"is\", called stop words, stops them from swamping the count.",
        "A keyword baseline is fast, free, easy to understand, and surprisingly good. Later lessons replace it with embeddings, which match meaning instead of exact words, but you will only know whether that helped if you measured the baseline first.",
      ],
      example: {
        language: 'python',
        code: code`
          STOP = {"the", "is", "a", "how", "do", "i", "many", "what"}

          def words(text):
              return {w.strip("?.,").lower() for w in text.split()} - STOP

          def overlap(question, document):
              return len(words(question) & words(document))

          print(sorted(words("How many vacation days do I get?")))
          print(overlap("vacation days", "Staff get 25 vacation days a year."))
        `,
        output: "['days', 'get', 'vacation']\n2",
      },
    },
    {
      heading: 'Keeping the model behind one function',
      paragraphs: [
        "Put the model call inside a single function, such as `ask_model(prompt)`. Nothing else in your code should know which company's model you use, what the API key is or how the request is sent.",
        "This gives you two big benefits. You can swap providers by changing one function. And you can test everything else with a fake model: a stand-in function that returns a fixed answer instantly, for free, with no internet. Your retrieval and checking code then gets tested on every run without spending money.",
        "The fake does not test whether the real model is any good. That needs evaluation, the topic of the next lesson.",
      ],
      example: {
        language: 'python',
        code: code`
          def fake_model(prompt):
              return "You get 25 vacation days."

          def answer(question, ask_model):
              prompt = f"Answer briefly: {question}"
              return ask_model(prompt)

          print(answer("How many vacation days?", fake_model))
        `,
        output: 'You get 25 vacation days.',
      },
    },
  ],
  seeItInAction: {
    title: 'A tiny handbook assistant, end to end',
    intro: "This assistant answers questions from three handbook entries. It uses keyword retrieval, builds a prompt and calls a fake model, so it runs anywhere. To use a real model, you would replace only `fake_model`.",
    example: {
      language: 'python',
      code: code`
        DOCS = {
            "leave": "Staff get 25 vacation days a year. Book vacation in the HR portal.",
            "expenses": "Submit expenses within 30 days with a receipt.",
            "remote": "You may work remotely up to 3 days a week.",
        }
        STOP = {"the", "is", "a", "how", "do", "i", "many", "what", "get"}

        def words(text):
            return {w.strip("?.,").lower() for w in text.split()} - STOP

        def retrieve(question):
            scores = {name: len(words(question) & words(text)) for name, text in DOCS.items()}
            best = max(scores, key=scores.get)
            return best if scores[best] > 0 else None

        def build_prompt(question, doc_name):
            return f"Use only this text: {DOCS[doc_name]}\nQuestion: {question}"

        def fake_model(prompt):
            return "(model answer based on: " + prompt.split(": ")[1].split("\n")[0] + ")"

        def assistant(question, ask_model=fake_model):
            doc_name = retrieve(question)
            if doc_name is None:
                return "Sorry, the handbook does not cover that."
            return ask_model(build_prompt(question, doc_name))

        print(retrieve("How many vacation days do I get?"))
        print(assistant("How many vacation days do I get?"))
        print(assistant("What is the parking policy?"))
      `,
      output: 'leave\n(model answer based on: Staff get 25 vacation days a year. Book vacation in the HR portal.)\nSorry, the handbook does not cover that.',
    },
    steps: [
      { code: 'DOCS = { "leave": ..., "expenses": ..., "remote": ... }', explanation: "The load step. In a real project these would be read from files. Short documents keep the example easy to follow." },
      { code: 'def retrieve(question):', explanation: "Scores every document by shared words and returns the best one's name, or `None` if nothing matches at all." },
      { code: 'def build_prompt(question, doc_name):', explanation: "Puts the retrieved text and the question together, and tells the model to use only that text, which reduces made-up answers." },
      { code: 'def assistant(question, ask_model=fake_model):', explanation: "The model is a parameter with a default. Tests use the fake. The real app passes in a function that calls a real API." },
      { code: 'if doc_name is None:\n    return "Sorry, the handbook does not cover that."', explanation: "The check step. With no relevant document, the assistant says so instead of letting a model guess." },
      { code: 'print(retrieve("How many vacation days do I get?"))', explanation: "Printing what one step returns, here `leave`, is how you confirm retrieval worked before blaming the model." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Ask `assistant("Can I stay home and do my job?")`. Predict the result, then run it. Why does retrieval miss the remote-work entry?',
      'Add the word `home` to the remote document so that question works, and run it again.',
    ],
    playground: 'python',
    starterCode: code`
      DOCS = {
          "leave": "Staff get 25 vacation days a year. Book vacation in the HR portal.",
          "expenses": "Submit expenses within 30 days with a receipt.",
          "remote": "You may work remotely up to 3 days a week.",
      }
      STOP = {"the", "is", "a", "how", "do", "i", "many", "what", "get"}

      def words(text):
          return {w.strip("?.,").lower() for w in text.split()} - STOP

      def retrieve(question):
          scores = {name: len(words(question) & words(text)) for name, text in DOCS.items()}
          best = max(scores, key=scores.get)
          return best if scores[best] > 0 else None

      def build_prompt(question, doc_name):
          return f"Use only this text: {DOCS[doc_name]}\nQuestion: {question}"

      def fake_model(prompt):
          return "(model answer based on: " + prompt.split(": ")[1].split("\n")[0] + ")"

      def assistant(question, ask_model=fake_model):
          doc_name = retrieve(question)
          if doc_name is None:
              return "Sorry, the handbook does not cover that."
          return ask_model(build_prompt(question, doc_name))

      print(retrieve("How many vacation days do I get?"))
      print(assistant("How many vacation days do I get?"))
      print(assistant("What is the parking policy?"))
    `,
  },
  mistakes: [
    { mistake: 'Writing the whole feature as one long function.', fix: 'Split it into load, retrieve, prompt, generate and check, so you can inspect each step\'s output.' },
    { mistake: 'Blaming the model before checking retrieval.', fix: 'Print what `retrieve` returned. If the right document was not found, no model can answer correctly.' },
    { mistake: 'Calling a paid model API inside every test.', fix: 'Pass in a fake model for tests. Save real calls for deliberate evaluation runs.' },
  ],
  quiz: [
    {
      question: 'Your handbook assistant gives a wrong answer about expenses. What should you check first?',
      options: [
        { text: 'Switch to a bigger, more expensive model', explanation: 'If retrieval found the wrong document, a bigger model will just answer the wrong question more fluently.' },
        { text: 'Which document `retrieve` returned for that question', explanation: 'Retrieval comes first in the pipeline. If it picked the wrong document, nothing later can fix that.' },
        { text: 'Rewrite the prompt to be longer', explanation: 'The prompt might matter, but check the earlier step first so you know where the problem actually is.' },
        { text: 'Delete the expenses document and add it again', explanation: 'The document text is probably fine. You need to see which step went wrong.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        def words(text):
            return {w.lower() for w in text.split()}

        q = "Refund policy"
        doc = "Our refund policy lasts 30 days"
        print(len(words(q) & words(doc)))
      ` },
      options: [
        { text: '1', explanation: 'Both "refund" and "policy" match once lower-cased, so the count is 2, not 1.' },
        { text: '6', explanation: 'That is how many words are in the document. `&` keeps only the words both sets share.' },
        { text: '2', explanation: 'After lower-casing, "refund" and "policy" appear in both, so the shared set has 2 words.' },
        { text: '0', explanation: 'Lower-casing both sides means the capital R no longer prevents a match.' },
      ],
      answer: 2,
      answerIsOutput: true,
    },
    {
      question: 'Why pass the model in as a parameter, as in `assistant(question, ask_model=fake_model)`?',
      options: [
        { text: 'So tests can use a free, instant fake while the real app uses a real model', explanation: 'The rest of the pipeline is tested without network calls or cost, and swapping providers touches one function.' },
        { text: 'Because Python requires models to be parameters', explanation: 'Python has no such rule. It is a design choice that makes the code easier to test.' },
        { text: 'So the fake model can improve the real model\'s answers', explanation: 'The fake does not affect the real model. It only stands in for it during tests.' },
        { text: 'To make the program run faster in production', explanation: 'In production the real model is used either way, so the speed is the same.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Build AI features as a chain of small, testable steps with a simple baseline for retrieval and the model call kept behind one replaceable function.',
  resources: [
    { title: 'Build a retrieval augmented generation app', provider: 'LangChain', description: 'A step-by-step tutorial using a popular framework, for once the basics are clear.', url: 'https://python.langchain.com/docs/tutorials/rag/' },
    { title: 'What is retrieval-augmented generation?', provider: 'IBM Research', description: 'A short plain-language explanation of why RAG is used.', url: 'https://research.ibm.com/blog/retrieval-augmented-generation-RAG' },
  ],
  underTheHood: {
    heading: 'Why keyword search misses some questions',
    paragraphs: [
      "Keyword overlap only matches exact words. \"Can I work from home?\" shares no useful words with \"You may work remotely\", apart from \"work\", so it may score below a document that happens to contain \"can\". People call this the vocabulary mismatch problem.",
      "Two upgrades tackle it. TF-IDF, short for term frequency and inverse document frequency, weights each word by how rare it is across all documents, so a distinctive word like \"refund\" counts for more than a common one. It still needs exact words.",
      "Embeddings go further. A model turns each text into a vector, as in the vectors lesson, so that texts with similar meaning point in similar directions even when they share no words. Retrieval becomes finding the document vectors with the highest cosine similarity to the question's vector. The rest of the pipeline stays exactly the same, which is the payoff of keeping retrieval in its own function.",
    ],
  },
}

export default lesson
