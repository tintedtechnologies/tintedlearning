import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Recognize the common patterns of phishing and social engineering',
    'Check a link or sender before acting on an urgent request',
    'Design simple habits and workplace checks that make a successful attack less likely',
  ],
  bigIdea: 'Phishing and social engineering target people rather than machines. The attacker creates urgency, imitates someone trusted, and asks for something that seems routine, such as a password, a payment, or a code. Defenses combine a short list of habits, a verification step outside the message, and workplace processes that do not depend on any one person noticing.',
  whyItMatters: 'An accounts assistant receives an email that looks like it comes from the company director, asking for an urgent bank transfer before a meeting. The email address differs by one letter, and the request skips the usual approval. A simple rule, that payment changes are confirmed by phone on a known number, would have stopped the transfer. The technology was fine. The process was not designed for a convincing message.',
  goalSections: [
    {
      heading: 'The patterns attackers use',
      paragraphs: [
        'Most social engineering follows a few patterns. The message creates urgency, such as a deadline or a locked account. It imitates authority or a familiar service. It asks for something unusual, such as a code, a password, a gift card, or a change to bank details. And it discourages checking, with phrases such as "do not tell anyone" or "I am in a meeting".',
        'Phishing messages are often convincing because they copy real logos, real wording, and real invoices. Attackers also use phone calls, text messages, chat apps, and even video. The channel changes, but the pattern of pressure and an unusual request stays the same.',
        'When a request has urgency, authority, and an unusual action together, slow down. Those three are the signal, and legitimate organizations rarely need all three at once.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          From: director@company-name.co        (the real domain is company-name.com)
          Subject: URGENT, transfer needed before 3pm
          "I am in a meeting and cannot talk. Do not call me. Send the payment now."
          Signals: urgency, authority, an unusual action, and discouragement to check.
        `,
      },
    },
    {
      heading: 'Checking links and senders',
      paragraphs: [
        'Check the address a link actually goes to, not the text shown. Hover over the link or long-press it to see the destination. The real domain is the end of the host name, just before the first slash. A name that begins with a trusted brand but ends with an unknown domain is not that brand.',
        'Look at the sender address carefully. Lookalike domains swap a letter, add a word, or use a different ending. An email display name can be set to anything, so the address behind it is what matters.',
        'Verify outside the message. If a request looks real, contact the person or the service through a number or site you already know, not one given in the message. This one habit defeats most attacks, because the attacker cannot answer on a number they do not control.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          from urllib.parse import urlparse

          trusted = {"bank.example"}
          links = ["https://bank.example/login", "https://bank.example.verify-now.net/login"]

          for link in links:
              host = urlparse(link).hostname
              ok = host in trusted
              print(host, "->", "matches a trusted domain" if ok else "does not match")
        `,
        output: 'bank.example -> matches a trusted domain\nbank.example.verify-now.net -> does not match',
      },
    },
    {
      heading: 'Workplace processes that resist pressure',
      paragraphs: [
        'Build the rule into the process. A payment change, a new bank account, or a request for credentials should always go through a second person, using a known contact method. The approval should not depend on whether the request sounds urgent, because urgency is what the attacker supplies.',
        'Never share one-time codes, and never type a password on a page you reached from a message. A real service will not ask for your code in a message or a call. If you are asked for one, that is the answer.',
        'Report the attempt, even if nothing happened. A report lets others check their own inboxes, and it shows that the process worked. People should be thanked for reporting, not blamed for being fooled, because blame makes the next report less likely.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Rule: any change to payment details is confirmed by phone on a number already on file.
          Second approver: a payment above a set amount needs a second person who did not receive the request.
          Codes: a one-time code is never shared, and no real service asks for it by message or call.
          Reporting: anyone who suspects an attempt reports it, and is thanked, even if nothing happened.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking whether a link goes where it claims',
    intro: 'The program above checks the real host of each link against a list of trusted domains. The displayed text is never used. Run it, then add a link to the trusted domain on a different path and predict the result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        from urllib.parse import urlparse

        trusted = {"payroll.example"}
        message_links = [
            "https://payroll.example/pay-slip",
            "https://payroll-example.com/pay-slip",
            "https://payroll.example.reset-login.net/",
        ]
        for link in message_links:
            host = urlparse(link).hostname
            print("trusted" if host in trusted else "do not click", host)
      `,
      output: 'trusted payroll.example\ndo not click payroll-example.com\ndo not click payroll.example.reset-login.net',
    },
    steps: [
      { code: 'host = urlparse(link).hostname', explanation: 'Reads the real destination of the link, which is the part that matters.' },
      { code: 'if host in trusted', explanation: 'Compares the whole host name with the trusted list. A longer name that starts with a trusted name does not match.' },
      { code: 'print("trusted" if host in trusted else "do not click", host)', explanation: 'Shows the decision next to the real host, so the lookalike is visible.' },
    ],
  },
  tryIt: {
    instructions: [
      'Look at your last five unexpected emails. For each, write which of the three signals (urgency, authority, unusual action) it used, if any.',
      'Add a link with a lookalike domain to the seeItInAction example and predict the result. Run it to check.',
      'Write the verification rule for one payment or account change at a place you know, including who approves it and how they contact the requester.',
    ],
  },
  mistakes: [
    { mistake: 'Trusting the link text or the display name.', fix: 'Read the real host name, and check the sender address behind the display name.' },
    { mistake: 'Confirming an urgent request using the contact details in the message.', fix: 'Verify through a number or site you already know, never one given in the message.' },
    { mistake: 'Blaming a person who was fooled, and so not reporting.', fix: 'Make reporting easy and thank people for it, so problems reach the team quickly.' },
  ],
  quiz: [
    {
      question: 'Which of these is the strongest sign of a social engineering attempt?',
      options: [
        { text: 'A request that combines urgency, authority, and an unusual action', explanation: 'Yes. Those three together are the pattern attackers rely on.' },
        { text: 'A message with a friendly greeting', explanation: 'Friendly language is normal and is not a warning sign by itself.' },
        { text: 'A message sent during working hours', explanation: 'Timing alone does not signal an attack.' },
        { text: 'A message with a company logo', explanation: 'Logos are easy to copy, so they do not prove the sender is real.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a lookalike domain?',
      code: { language: 'python', runnable: true, code: code`
        from urllib.parse import urlparse
        trusted = {"bank.example"}
        host = urlparse("https://bank.example.verify.net/x").hostname
        print("trusted" if host in trusted else "do not click")
      ` },
      options: [
        { text: 'trusted', explanation: 'The host is bank.example.verify.net, which is not in the trusted set.' },
        { text: 'do not click', explanation: 'Yes. The full host name does not match the trusted domain.' },
        { text: 'bank.example', explanation: 'The program prints the decision, not the host.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'What is the best way to confirm a request to change bank details?',
      options: [
        { text: 'Reply to the email and ask whether it is real', explanation: 'The attacker controls that channel and can answer.' },
        { text: 'Call the person using a number you already know, and have a second person approve', explanation: 'Yes. The check uses a channel the attacker does not control, and a second approver.' },
        { text: 'Make the change right away because the request is urgent', explanation: 'Urgency is the pressure the attacker creates, so it should slow you down.' },
        { text: 'Ask a colleague who received the same message', explanation: 'A colleague may have received the same fake message.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Attacks rely on urgency, authority, and an unusual request, so check the real destination, verify through a known channel, and make the process require a second approval that urgency cannot skip.',
  resources: [
    { title: 'Avoiding social engineering and phishing attacks', provider: 'CISA', description: 'Practical guidance on recognizing phishing and reporting it.', url: 'https://www.cisa.gov/' },
    { title: 'Phishing', provider: 'NCSC (UK)', description: 'Plain guidance on spotting phishing messages and what to do after one.', url: 'https://www.ncsc.gov.uk/guidance/phishing' },
  ],
}

export default lesson
