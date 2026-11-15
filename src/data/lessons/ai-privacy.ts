import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'RAG and Vector Security from this section, with Study Tracker indexing notes for search. Every example uses made-up people and placeholder contact details, such as example.com addresses and 555 phone numbers.',
  goals: [
    'Decide what personal data should never be sent to a model, and what can be left out',
    'Redact personal details before notes are embedded or stored, and know the limits of pattern-based redaction',
    'Set a retention rule for logs and copies, so personal data does not outlive its purpose',
  ],
  bigIdea: "Privacy in an AI app starts with not collecting or sending more data than the task needs. Anything you send to a model provider, embed in an index or write to a log becomes another copy, and each copy needs its own protection and its own end date. Redaction removes obvious personal details early, but it is only a first step.",
  whyItMatters: "A learner's study notes often contain an email address, a phone number, a friend's name or a health detail, such as a note about needing extra time for exams. Once those words are embedded and logged, they are stored in several places, and deleting the note does not reach all of them. Study Tracker has to decide what it keeps, before a learner asks. A short written list of what is kept, where and for how long makes those decisions visible to the whole team, and it is the first thing a privacy review will ask for.",
  goalSections: [
    {
      heading: 'What not to send to a model',
      paragraphs: [
        "Data minimization means sending only what the task needs. A question about cell biology needs the biology notes, not the learner's whole folder, their email or their birthday. The smaller the input, the less can leak, and the cheaper each call becomes.",
        "A hosted model is run by another company, so the text you send leaves your system and is handled under that company's terms. Some categories should never be sent without a clear reason and consent: passwords and keys, government identifiers, financial details, health information and anything about children. When you are unsure, remove it first.",
      ],
      example: {
        language: 'text',
        code: code`
          Data                         Send to the model?
          the question                 yes, the task needs it
          the matching study note      yes, only the passages that matched
          the learner's email          no, the answer does not need it
          a password or API key        never, in any part of a prompt
          health or disability notes   only with a clear reason and consent
        `,
      },
    },
    {
      heading: 'Redact before it is stored',
      paragraphs: [
        "Redaction replaces personal details with a neutral label before the text goes anywhere it will stay. The important timing is before embedding. An embedding of a note stores the note's meaning in numbers, and the search index keeps those numbers, so a personal detail that reaches the index is hard to remove later.",
        "Pattern-based redaction works well for predictable formats, such as email addresses and phone numbers. It misses names, street addresses and details written in unusual ways. Treat it as one layer, and combine it with the minimization rules above rather than trusting it alone.",
      ],
      example: {
        language: 'text',
        code: code`
          Stored in the index                     Why
          "Ana, email ana@example.com"            the email can be found by search and quoted
          "Ana, email [email]"                    the label keeps the note useful without the address
          "Ben needs extra time in exams"         a health detail, which needs its own handling
        `,
      },
    },
    {
      heading: 'Retention and safe logs',
      paragraphs: [
        "Retention means deciding how long each kind of data is kept and deleting it when that time ends. Logs are the usual surprise. A log that records every full prompt stores the notes and the questions, often for much longer than the notes themselves, and anyone who can read the logs can read them.",
        "Log what you need to debug: the request id, the learner id, the tool name, the timing and the result status. Leave out the prompt, the notes and the model's full reply. When a learner deletes their account, the delete has to reach the notes, the chunks, the logs and any cached answers that contain their text.",
      ],
      example: {
        language: 'text',
        code: code`
          Log line, safe:    2026-11-14 10:02 req=41 learner=ana tool=get_totals status=ok ms=38
          Log line, unsafe:  2026-11-14 10:02 prompt="Study group: ana@example.com, call 555-123-4567..."
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Redacting a note before it is embedded',
    intro: "The function below runs before Study Tracker embeds a note. It replaces email addresses and phone numbers with labels, so the index never stores them. The example note uses placeholder details only.",
    example: {
      language: 'python',
      filename: 'redact.py',
      code: code`
        import re

        EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
        PHONE = re.compile(r"\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b")

        def redact(text):
            text = EMAIL.sub("[email]", text)
            text = PHONE.sub("[phone]", text)
            return text

        note = "Study group: ana@example.com, call 555-123-4567 before the exam."
        print(redact(note))
      `,
      output: 'Study group: [email], call [phone] before the exam.',
    },
    steps: [
      { code: 'EMAIL = re.compile(r"[\\w.+-]+@[\\w-]+\\.[\\w.]+")', explanation: "A pattern for a typical email address: a name, an @ sign, a domain and an ending. It finds the common shape, not every valid address." },
      { code: 'PHONE = re.compile(r"\\b\\d{3}[-.\\s]\\d{3}[-.\\s]\\d{4}\\b")', explanation: "A pattern for a 10-digit phone number with dashes, dots or spaces. Numbers in other formats need their own patterns." },
      { code: 'text = EMAIL.sub("[email]", text)', explanation: "Each match is replaced by a neutral label. The label keeps the sentence readable, so the note is still useful for search." },
      { code: 'print(redact(note))', explanation: "The output is the text that should be embedded. The address and the number never reach the index, the logs or the model." },
    ],
  },
  tryIt: {
    instructions: [
      'Add a `redact` function to `notes.py`, and call it on every note before it is embedded. Test it with three placeholder notes that contain an email, a phone number and a name.',
      'Change your logging so it records the request id, learner id, tool name, timing and status, and never the prompt or the notes. Trigger one error and check that the log line contains no personal text.',
      'Add `test_privacy.py`. It should check that an indexed note contains no email address, and that deleting a note removes its chunks and its logged traces.',
    ],
  },
  mistakes: [
    { mistake: 'Treating a regular expression as complete redaction.', fix: 'Use it as one layer, and keep personal data out of the prompt in the first place.' },
    { mistake: 'Redacting after the note is embedded and stored.', fix: 'Redact before embedding, because the index keeps a copy of the meaning.' },
    { mistake: 'Logging full prompts for debugging.', fix: 'Log identifiers, timing and status, and turn on full prompt logs only with a short retention period and clear access rules.' },
    { mistake: 'Deleting the note but keeping its backups and logs forever.', fix: 'Write a retention rule for every store, and make account deletion reach all of them.' },
  ],
  quiz: [
    {
      question: 'A learner\'s note includes an email address. When should the app redact it?',
      options: [
        { text: 'After the answer is shown to the learner', explanation: 'By then the address has already been embedded and may be in logs.' },
        { text: 'Before the note is embedded and stored, so the address never reaches the index', explanation: 'Redaction before embedding keeps the index free of the address.' },
        { text: 'Only in the logs', explanation: 'The index would still hold the address, and the logs are not the only copy.' },
        { text: 'Never, because the learner wrote the note', explanation: 'Who wrote the note does not decide whether the text needs protection.' },
      ],
      answer: 1,
    },
    {
      question: 'The app logs every full prompt, including the notes. What is the main risk?',
      options: [
        { text: 'Logs run slower than necessary', explanation: 'Speed is a real cost, but it is not the privacy risk here.' },
        { text: 'Prompts become shorter over time', explanation: 'Prompts do not shrink because of logging, so this is not the risk.' },
        { text: 'Personal data is kept in logs longer than the notes, and anyone who reads the logs sees it', explanation: 'Logs are another copy with their own retention, and they often have wider access than the notes.' },
        { text: 'The model learns from the logs', explanation: 'Logs do not train the model. The risk is what they store and who can read them.' },
      ],
      answer: 2,
    },
    {
      question: 'A learner deletes their account. Which copies must be removed?',
      options: [
        { text: 'Only the account row', explanation: 'The notes, chunks and logs also hold the learner\'s data.' },
        { text: 'Nothing, since logs are not personal data', explanation: 'Logs can contain personal details and must follow the retention rule.' },
        { text: 'Only the notes, since the logs are anonymous', explanation: 'Logs that include the learner\'s id or text are not anonymous.' },
        { text: 'The notes, their chunks, and every log or cached answer that contains their text', explanation: 'Each copy holds the learner\'s data, so each one must be removed.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Send models only the data a task needs, redact personal details before they are embedded or logged, and give every stored copy a retention rule that account deletion can reach.',
  resources: [
    { title: 'NIST Privacy Framework', provider: 'National Institute of Standards and Technology', description: 'A voluntary framework for managing privacy risk in systems that handle personal data.', url: 'https://www.nist.gov/privacy-framework' },
    { title: 'OWASP Top 10 for Large Language Model Applications', provider: 'OWASP GenAI Security Project', description: 'Includes sensitive information disclosure, which covers personal data leaking through model output.', url: 'https://genai.owasp.org/llm-top-10/' },
  ],
  underTheHood: {
    heading: 'Why pattern redaction makes two kinds of mistake',
    paragraphs: [
      "A pattern for email addresses can miss an unusual address, and it can also match text that is not an address, such as a code sample with an @ sign. Missing a real address is a false negative, and it is the dangerous mistake, because the address leaks. Matching something harmless is a false positive, and it only makes a note a little less useful.",
      "Names are much harder than addresses. A name such as \"Jordan\" can be a person or a word, and no simple pattern tells them apart. This is why redaction for names usually needs a trained recognizer, and why minimization, which keeps names out of the prompt in the first place, is the stronger control.",
      "Some systems replace each value with a stable token, such as a code for the same person, so the model can still tell two mentions apart. The mapping from token to real value is then stored separately under tight access. Whichever approach you use, test it on realistic notes and count what slips through.",
    ],
  },
}

export default lesson
