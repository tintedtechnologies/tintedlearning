import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'capstone-rag',
  whatYouBuild: "A question-and-answer assistant over documents you choose: a hobby guide, public material from your job, or a community group's handbook. It finds the passages that match a question, answers only from them, cites each passage by number, and says \"I don't know\" when the documents do not cover the question.",
  diagram: code`
    Your documents (public or owned material only)
      -> check each one: safe to use? no personal contact details?
      -> split into sections, each with an id and a title
      -> score every section against the question
      -> best score below the threshold? -> "I don't know in the documents."
      -> otherwise answer from that section, cite it as [1], show the text
    No documents of your own? Use the Brightway handbook that comes with the project.
  `,
  lessons: ['rag', 'embeddings', 'vector-databases', 'hallucinations', 'responsible-ai', 'data-collection-and-cleaning'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'Your own documents, or the Brightway handbook supplied with the project', 'A model provider from Ship a Chatbot People Can Use, for the final step'],
  time: 'about 6 hours',
  requirements: [
    'Answers only from the documents, and names the section it used',
    'Shows the cited section text next to every answer',
    'Replies "I don\'t know in the documents." when no section matches well enough',
    'Refuses documents that are not public or owned by you, and documents with personal contact details',
    'Handles questions that use different words for the same idea, such as "holiday" and "leave"',
    'Ships with at least 10 test questions, some the documents answer and some they do not',
  ],
  milestones: [
    {
      title: 'Choose your documents safely',
      goal: 'Check each document before it is indexed. Refuse anything that is not public or yours, and anything with personal contact details.',
      hints: [
        'Record where each document came from, and accept only "public" or "owned" as its source type.',
        'Search for email addresses and phone numbers with the same patterns the privacy lesson used.',
      ],
      code: {
        language: 'python',
        filename: 'check_documents.py',
        code: code`
          import re

          EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
          PHONE = re.compile(r"\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b")

          def check_document(name, source_type, text):
              problems = []
              if source_type not in {"public", "owned"}:
                  problems.append("use only public or material you own")
              if EMAIL.search(text) or PHONE.search(text):
                  problems.append("contains personal contact details")
              return problems or ["ok"]

          print(check_document("club-handbook.txt", "owned", "Meetings are on Tuesdays."))
          print(check_document("staff-list.txt", "internal", "Contact ana@example.com or 555-123-4567."))
        `,
        output: "['ok']\n['use only public or material you own', 'contains personal contact details']",
      },
      checkpoint: 'The club handbook is accepted, and the staff list is refused for both reasons.',
    },
    {
      title: 'Split a document into sections',
      goal: 'Turn a document into sections, each with an id, a title and its text, so every answer can point to one of them.',
      hints: [
        'Use a blank line between sections, and treat the first line of each one as its title.',
        'Real documents are messy, so strip extra spaces and skip empty lines before you split.',
      ],
      code: {
        language: 'python',
        filename: 'sections.py',
        code: code`
          def split_sections(text):
              sections = []
              for block in text.strip().split("\n\n"):
                  lines = [line.strip() for line in block.splitlines() if line.strip()]
                  title = lines[0].lstrip("# ").strip()
                  body = " ".join(lines[1:])
                  sections.append({"id": len(sections) + 1, "title": title, "text": body})
              return sections

          DOC = """# Leave
          Staff get 20 days of paid leave each year.

          # Expenses
          Keep every receipt and submit claims within 30 days."""

          for s in split_sections(DOC):
              print(s["id"], s["title"], "|", s["text"])
        `,
        output: '1 Leave | Staff get 20 days of paid leave each year.\n2 Expenses | Keep every receipt and submit claims within 30 days.',
      },
      checkpoint: 'Each section prints with its id, title and text, with no empty sections.',
    },
    {
      title: 'Find the sections that match a question',
      goal: 'Rank the sections by how well they match the question, so the best match comes first.',
      hints: [
        'Start with a simple score, such as shared words, then compare it with the embeddings from the lessons.',
        'Keep the top matches and their scores, so you can see why a section was chosen.',
      ],
      checkpoint: 'For "How many days of paid leave do I get?", the leave section ranks first, and you can print its score.',
    },
    {
      title: 'Answer only when the documents support it',
      goal: 'Give an answer with its citation when the best section scores high enough, and say "I don\'t know" when it does not.',
      hints: [
        'Pick a threshold by testing it on questions the documents answer and questions they do not.',
        'Never answer from memory. If nothing matches well enough, use the fixed "I don\'t know" reply.',
      ],
      checkpoint: 'An answerable question returns a cited answer, and an unrelated question returns the "I don\'t know" reply.',
    },
    {
      title: 'Write a test set',
      goal: 'Write at least ten questions with the section each should cite, and mark the questions the documents cannot answer.',
      hints: [
        'Include questions in the words a reader would use, not only the words in the document.',
        'Use the Brightway handbook if you have no documents of your own, and keep the test set in a file.',
      ],
      checkpoint: 'The test set has at least ten questions, with a mix of answerable and unanswerable ones, saved in a file.',
    },
  ],
  finishedMeans: [
    'Every answer names the section it came from and shows that section\'s text',
    'A document with personal contact details, or one that is not public or yours, is refused',
    'The test set of at least ten questions runs, and the report gives the pass rate and the threshold',
    'A question the documents do not cover gets the "I don\'t know" reply every time',
    'The project runs from a fresh clone, and its README says which documents it was built on and where they came from',
  ],
  readmeTemplate: code`
    # [Project name]

    [One sentence: what the assistant answers, and which documents it uses.]

    ## Your documents
    [Where each document came from, and why you may use it.]

    ## Run it
    [Setup steps, and the command to ask a question.]

    ## How it answers
    [How sections are made, how they are scored, and the threshold for "I don't know".]

    ## Results
    [The test set size, the pass rate and two failures you looked into.]
  `,
  writeUpPrompts: [
    'The problem: who would use this assistant, and which documents it answers from.',
    'One decision you made about documents, such as refusing anything with contact details, and why.',
    'One question it got wrong, and what you changed.',
    'What you would do next, such as embeddings or more documents.',
  ],
  demoGuidance: 'Record three questions: one the documents answer with a citation, one they only partly answer, and one the assistant declines. Keep it under 60 seconds. Free tools include the screen recorder built into macOS and Windows, OBS Studio, and ScreenToGif on Windows. Save it as demo.gif and link it from the README.',
  interviewGuidance: "Lead with a choice about the data, not the model. For example: 'I refused documents with personal contact details before indexing, because a search can quote anything it has stored.' Then describe your test set and one failure you found.",
  stretchGoals: [
    'Replace the word-overlap score with embeddings, and compare the pass rates',
    'Add a second set of documents, and show which set each answer came from',
    'Store the sections in a small database, and search them there',
  ],
}

export default plan
