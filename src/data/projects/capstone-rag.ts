import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'capstone-rag',
  whatYouBuild: "A question-and-answer assistant over a made-up company handbook for a fictional company, Brightway. It finds the handbook passages that match a question, answers only from them, cites each passage by number and says \"I don't know\" when the handbook does not cover the question.",
  diagram: code`
    Question: "How many days of paid leave do I get?"
      -> split the handbook into sections, each with an id and a title
      -> score every section against the question
      -> best score below the threshold? -> "I don't know in the handbook."
      -> otherwise answer from that section, and cite it as [1]
      -> show the cited section text beside the answer
  `,
  lessons: ['embeddings', 'vector-databases', 'rag', 'hallucinations', 'evaluating-ai-responses'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'The Brightway handbook, supplied with the project as a text file', 'A model provider from Build a Chatbot, for the final step'],
  time: 'about 6 hours',
  requirements: [
    'Answers only from the handbook, and names the section it used',
    'Gives the cited section text next to every answer',
    'Replies "I don\'t know in the handbook." when no section matches well enough',
    'Handles questions with different words for the same idea, such as "holiday" and "leave"',
    'Ships with at least 10 test questions, some the handbook answers and some it does not',
  ],
  milestones: [
    {
      title: 'Split the handbook into sections',
      goal: 'Turn one long text into sections, each with an id, a title and its text, so every answer can point to a section.',
      hints: [
        'Start a new section at each line that begins with a title followed by a colon.',
        'Give each section an id from 1 upward, so the citation is simple.',
        'Keep the handbook text in a file, and read it in your code rather than pasting it into the program.',
      ],
      code: {
        language: 'python',
        filename: 'sections.py',
        code: code`
          HANDBOOK = """Leave: Staff get 20 days of paid leave each year, pro rata for part-time work.
          Expenses: Keep every receipt and submit claims within 30 days of the purchase.
          Remote work: Teams may work from home two days a week, agreed with a manager.
          """

          def split_sections(text):
              sections = []
              for line in text.strip().splitlines():
                  title, _, body = line.partition(":")
                  sections.append({"id": len(sections) + 1, "title": title.strip(), "text": body.strip()})
              return sections

          if __name__ == "__main__":
              for section in split_sections(HANDBOOK):
                  print(section["id"], section["title"])
        `,
        output: '1 Leave\n2 Expenses\n3 Remote work',
      },
      checkpoint: 'The program lists three sections with their ids and titles.',
    },
    {
      title: 'Find the sections that match a question',
      goal: 'Score each section by how many meaningful words it shares with the question, and rank the sections from best to worst.',
      hints: [
        'Lowercase the text and split it into words, then remove common words such as "the" and "how".',
        'Count shared words as a simple score. Later you can replace this with embeddings from the Embeddings lesson.',
        'Sort by score, highest first, and keep the top matches.',
      ],
      code: {
        language: 'python',
        filename: 'search.py',
        code: code`
          from sections import split_sections, HANDBOOK

          STOP_WORDS = {"the", "a", "an", "how", "do", "i", "is", "of", "to", "for", "my", "in", "on", "each"}

          def words(text):
              return {w.strip("?.,") for w in text.lower().split()} - STOP_WORDS

          def search(question, sections):
              q = words(question)
              scored = [(len(q & words(s["text"] + " " + s["title"])), s) for s in sections]
              return sorted(scored, key=lambda pair: pair[0], reverse=True)

          if __name__ == "__main__":
              sections = split_sections(HANDBOOK)
              for score, section in search("How many days of paid leave do I get?", sections)[:2]:
                  print(score, section["title"])
        `,
        output: '4 Leave\n1 Expenses',
      },
      checkpoint: 'The leave section ranks first for the leave question.',
    },
    {
      title: 'Answer only when the handbook supports it',
      goal: 'Return an answer with its citation when the best section scores high enough, and the "I don\'t know" reply when it does not.',
      hints: [
        'Pick a threshold, then test it with questions the handbook answers and questions it does not.',
        'Return the section number and text with every answer, so the reader can check it.',
        'Never answer from memory. If the score is low, say you do not know.',
      ],
      code: {
        language: 'python',
        filename: 'answer.py',
        code: code`
          from sections import split_sections, HANDBOOK
          from search import search

          THRESHOLD = 2
          NOT_FOUND = "I don't know in the handbook."

          def answer(question, sections):
              ranked = search(question, sections)
              score, best = ranked[0]
              if score < THRESHOLD:
                  return NOT_FOUND, []
              return f"See section [{best['id']}] {best['title']}: {best['text']}", [best["id"]]

          if __name__ == "__main__":
              sections = split_sections(HANDBOOK)
              print(answer("How many days of paid leave do I get?", sections)[0])
              print(answer("Can I bring my dog to the office?", sections)[0])
        `,
        output: "See section [1] Leave: Staff get 20 days of paid leave each year, pro rata for part-time work.\nI don't know in the handbook.",
      },
      checkpoint: 'The leave question returns a cited answer, and the dog question returns the "I don\'t know" reply.',
    },
    {
      title: 'Build a test set',
      goal: 'Write at least ten questions with the expected section, so you can tell when a change makes the assistant worse.',
      hints: [
        'Include questions the handbook answers, questions it does not, and questions that use different words.',
        'Write each expected answer as a section title, not a full sentence, so the test is clear.',
        'Keep the test set in a file. Milestone 5 of the evaluation project uses it.',
      ],
      checkpoint: 'The test set has at least ten questions, with a mix of answerable and unanswerable ones, saved in a file.',
    },
    {
      title: 'Use a model to write the answer',
      goal: 'Send the cited section and the question to a model, and keep the rule that the answer must come from the section.',
      hints: [
        'Use the provider setting from Build a Chatbot, so the same code works with a local or hosted model.',
        'Tell the model to answer only from the section, to cite its number, and to reply with the exact "I don\'t know" line if the section does not help.',
        'Compare the model\'s answers with the section text on your test set, not by reading each one once.',
      ],
      checkpoint: 'The assistant answers from the section, cites it, and returns the exact "I don\'t know" line on your unanswerable questions.',
    },
  ],
  finishedMeans: [
    'Every answer names the section it came from, and shows that section\'s text',
    'The test set of at least ten questions passes, with the threshold you chose',
    'A question the handbook does not cover gets the "I don\'t know" reply, every time',
    'The README explains the threshold and how you chose it',
    'The project runs from a fresh clone with the handbook file included',
  ],
  readmeTemplate: code`
    # Brightway Handbook Assistant

    [One sentence: a question-and-answer assistant over a handbook, answering only from its text.]

    ## Run it
    [Setup steps and the command to ask a question.]

    ## How it answers
    [Sections, scoring, the threshold, and when it says "I don't know".]

    ## Results
    [Test set size, how many questions passed, and two failures you investigated.]

    ## What I would improve next
    [For example, embeddings for better matches.]
  `,
  portfolioText: "Describe this as a question-and-answer assistant that cites its sources and admits when it does not know. Show your test set, the pass rate and one failure you investigated. Interviewers want evidence that the assistant was tested, not just demonstrated.",
  stretchGoals: [
    'Replace the word-overlap score with embeddings, and compare the test results',
    'Add a second handbook, and show which handbook each answer came from',
    'Store the sections in a small database, and search them there',
  ],
}

export default plan
