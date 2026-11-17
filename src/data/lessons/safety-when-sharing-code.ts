import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Keep keys, passwords and personal data out of the messages and files you share with an assistant',
    'Recognize risky patterns in generated code, such as running text as code',
    'Check input from users before the program relies on it',
  ],
  bigIdea: 'Everything you paste into an assistant may be stored by a service, and everything the assistant writes may be unsafe in ways it does not warn about. Protect secrets before you share them, and read generated code for patterns that run text as code or trust input without checking it.',
  whyItMatters: 'You paste a configuration file into a chat to get help, and it includes your database password. You then commit the code with that password in it. Anyone who can read the repository can now log in to your data. The mistake takes one paste, and cleaning it up takes much longer. Once a secret is committed, you should assume it has been seen, and replace it.',
  goalSections: [
    {
      heading: 'Keeping secrets out of what you share',
      paragraphs: [
        'A secret is anything that grants access: an API key, a password, a token, or a private connection string. Replace real secrets with clear placeholders such as `YOUR_API_KEY_HERE` before you paste code. Keep the real value in a `.env` file, and add `.env` to `.gitignore`, as the configuration lesson in the software section explains.',
        'Personal data needs the same care. Remove real names, emails, phone numbers and customer records from examples. A made-up record with the same shape gives the assistant what it needs to help.',
        'Assume that anything typed into a chat may be kept for a while. Plan your sharing as if the text were public, even when it is not.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          # Shared with the assistant (safe)
          DATABASE_URL=YOUR_DATABASE_URL_HERE

          # Kept in .env, never shared or committed
          DATABASE_URL=postgres://real-user:real-password@...
        `,
      },
    },
    {
      heading: 'Spotting code that runs text',
      paragraphs: [
        'The built-in `eval` function runs a string as Python code. If the string comes from a user, the user can run any code they like on your computer. Generated code sometimes uses `eval` to read numbers, because it is short. Replace it with a function that only converts the text, such as `int`, and that rejects anything else.',
        'Be just as careful with shell commands. Passing user text into a shell command can let the user add extra commands. Use the list form of `subprocess` with separate arguments, rather than building one command string.',
        'A good placeholder keeps the shape of the value. A connection string with the same parts, such as user, host and database, tells the assistant what to change without revealing the real value.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'safe_number.py',
        code: code`
          text = "12"
          number = int(text)
          print(number + 1)
        `,
        output: '13',
      },
    },
    {
      heading: 'Checking input before you rely on it',
      paragraphs: [
        'Input from a user, a file or a web service is data you did not write. Check its type and its range before you use it. A book title should be text with a sensible length, and a page count should be a positive whole number.',
        'Handle the failure case clearly. When a conversion fails, show a short message and ask again, rather than letting the program crash or accept a bad value silently.',
        'Check the user’s text against the rules you expect: a length, a range, a type. A check that is easy to read is one you will actually keep.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'checked_pages.py',
        code: code`
          def read_pages(text):
              try:
                  pages = int(text)
              except ValueError:
                  return None
              if pages <= 0:
                  return None
              return pages

          print(read_pages("300"))
          print(read_pages("many"))
        `,
        output: '300\nNone',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a page count from a user',
    intro: 'This function reads a page count typed by a user. It returns a number when the input is a positive whole number, and `None` otherwise. Run the file and check both outputs. The second call shows what happens with bad text, which the first call does not.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'checked_pages.py',
      code: code`
        def read_pages(text):
            try:
                pages = int(text)
            except ValueError:
                return None
            if pages <= 0:
                return None
            return pages

        print(read_pages("300"))
        print(read_pages("many"))
      `,
      output: '300\nNone',
    },
    steps: [
      { code: 'pages = int(text)', explanation: 'Converts the text to a whole number. This only converts; it does not run anything the user typed, which is why it is safer than `eval`.' },
      { code: 'except ValueError:\n    return None', explanation: 'If the text is not a number, the conversion fails with a `ValueError`. The function catches it and returns `None` instead of crashing.' },
      { code: 'if pages <= 0:\n    return None', explanation: 'Rejects zero and negative numbers, which make no sense for a page count.' },
      { code: 'print(read_pages("many"))', explanation: 'The second call gives `None`, so the program can ask the user to try again.' },
    ],
  },
  tryIt: {
    instructions: [
      'Run `checked_pages.py`, then add a third call with `"-5"` and predict the output before you run it.',
      'Find one place in a generated program where text from a user is converted or used. Add a check that rejects bad input there.',
      'Write a short note of which values in your project are secrets, and confirm each one is in `.env`, not in the code or the chat.',
    ],
  },
  mistakes: [
    { mistake: 'Pasting a real key or password into a chat to get help.', fix: 'Replace it with a placeholder before pasting, and rotate any key that was shared by mistake.' },
    { mistake: 'Accepting `eval` in generated code that reads user input.', fix: 'Use a conversion such as `int` or `float` with a check on the result.' },
    { mistake: 'Trusting a number from a user without checking the range.', fix: 'Check the type, the range and the failure case before using the value.' },
  ],
  quiz: [
    {
      question: 'You need to share a configuration file with an assistant so it can help debug a connection error. What should you do first?',
      options: [
        { text: 'Paste the file exactly as it is', explanation: 'The file may hold real credentials. Anything pasted may be stored by the service.' },
        { text: 'Replace each secret with a placeholder, then paste the file', explanation: 'Yes. The assistant needs the shape of the configuration, not your real credentials.' },
        { text: 'Paste it, then delete the chat', explanation: 'Deleting the chat does not remove what the service has already received.' },
        { text: 'Paste only the password, because it is the key to the problem', explanation: 'The password is the secret you must not share.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        text = "12"
        number = int(text)
        print(number + 1)
      ` },
      options: [
        { text: '12', explanation: 'The program adds 1 to the number, so the output is not the original text.' },
        { text: '13', explanation: 'Yes. The text converts to the number 12, and adding 1 gives 13.' },
        { text: '121', explanation: 'That would come from joining the text with 1. The program adds numbers instead.' },
        { text: 'An error', explanation: 'The text "12" is a valid whole number, so the conversion works.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'A user types "many" as a page count. In the checked function, what is returned?',
      options: [
        { text: 'An error that crashes the program', explanation: 'The `except ValueError` branch catches the failed conversion, so the program does not crash.' },
        { text: '`None`', explanation: 'Yes. The conversion fails, the exception is caught, and the function returns None.' },
        { text: '0', explanation: 'The function returns None on failure, not zero.' },
        { text: '"many"', explanation: 'The function converts the text, and when that fails, it returns None, not the text.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Keep secrets and personal data out of what you share, avoid running user text as code, and check every input before the program relies on it.',
  resources: [
    { title: 'OWASP Top 10 for Large Language Model Applications', provider: 'OWASP', description: 'A public list of the most serious security risks in applications built with language models.', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
  ],
}

export default lesson
