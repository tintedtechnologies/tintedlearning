import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Tell apart mistakes a user made from failures the system had',
    'Return clear, safe error responses instead of crashing or leaking details',
    'Retry only the failures that might succeed later, and stop after a fixed number of attempts',
  ],
  bigIdea: 'Programs fail in two broad ways. The user may send something invalid, which should get a clear message they can act on, or the system may fail for reasons outside the request, such as a slow database. Reliable software catches each kind at the right place, says only what is safe to say, and retries only when retrying can help.',
  whyItMatters: 'Study Tracker\'s API receives a session with the minutes written as "forty". The request crashes with a stack trace, the response shows database table names, and the user does not know what to change. A clear message, "minutes must be a whole number", fixes the user\'s problem and keeps the internals private. The same care applies when the database is briefly unavailable.',
  goalSections: [
    {
      heading: 'User errors and system errors',
      paragraphs: [
        'A user error is caused by input the program cannot accept, such as a missing field, a negative number, or text where a number belongs. The right response is a clear message that names the field and says what a valid value looks like. The user can fix it immediately, and the request is not retried, because the same input will fail again.',
        'A system error is caused by something the request did not control, such as a database that is down or a network call that timed out. The right response is a general message that does not reveal internal details, a record in the logs with the full information for the team, and sometimes a retry.',
        'Checking input early is the cheapest defense. Parse and validate at the edge of the program, before the data reaches the database, so that bad input is refused with a clear reason.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          def parse_minutes(text):
              try:
                  minutes = int(text)
              except ValueError:
                  return None, "minutes must be a whole number"
              if minutes <= 0:
                  return None, "minutes must be more than zero"
              return minutes, None

          for value in ["45", "forty", "-5"]:
              minutes, error = parse_minutes(value)
              print(value, "->", minutes if error is None else error)
        `,
        output: '45 -> 45\nforty -> minutes must be a whole number\n-5 -> minutes must be more than zero',
      },
    },
    {
      heading: 'Safe messages and logs',
      paragraphs: [
        'Never show a stack trace, a database error, or a file path to a user. These reveal how the system is built and can help an attacker. Replace them with a short, plain message and a request identifier, so the user can quote it when they ask for help.',
        'Log the full detail for the team. A log entry should record what failed, where, when, and the request identifier, with secrets removed. The user sees the short message, and the team sees the reason, which is the split that keeps both safe and useful.',
        'Be consistent. If one endpoint returns errors as text and another as a number with no message, every client has to guess. Choose one shape for errors, and use it everywhere.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          What the user sees: "We could not save your session. Quote request ID 7f3a when you contact support."
          What the log records: the request ID, the operation, the database error code, the time, and the account ID.
          What must not appear: stack traces, table names, connection strings, or any password or token.
        `,
      },
    },
    {
      heading: 'Retries and timeouts',
      paragraphs: [
        'A retry makes sense for a failure that may be temporary, such as a timeout or a busy server. It does not make sense for a user error, because the same invalid input will fail every time, and repeated attempts only add load.',
        'Limit retries to a small fixed number, and wait a little longer between each attempt. This is called exponential backoff. Without a limit, a failing service receives more and more traffic at exactly the moment it is struggling to recover.',
        'Set a timeout on every call to another service. A call that never returns holds a connection open forever, and enough of them stop the whole application. A timeout turns a silent hang into an error that can be handled and logged.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import time

          def call_with_timeout_and_retry(attempts):
              for number, outcome in enumerate(attempts, start=1):
                  if outcome == "ok":
                      return f"succeeded on attempt {number}"
                  print("attempt", number, "failed:", outcome)
                  if number < 3:
                      print("waiting", 2 ** (number - 1), "seconds before retrying")
              return "gave up after 3 attempts"

          print(call_with_timeout_and_retry(["timeout", "ok"]))
        `,
        output: 'attempt 1 failed: timeout\nwaiting 1 seconds before retrying\nsucceeded on attempt 2',
      },
    },
  ],
  seeItInAction: {
    title: 'Retrying only the failures that can recover',
    intro: 'The program above tries to save a session. A timeout is retried with a longer wait each time, up to three attempts. A bad input would stop at once, because retrying cannot fix it. Run it, then change the simulated failures to succeed on the second attempt and predict the output.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        def save_with_retries(attempt_results, max_attempts=3):
            for attempt, result in enumerate(attempt_results[:max_attempts], start=1):
                if result == "ok":
                    return f"saved on attempt {attempt}"
                if result == "bad input":
                    return "refused: bad input is not retried"
                print("attempt", attempt, "failed with", result, "- waiting", 2 ** (attempt - 1), "seconds")
            return f"gave up after {max_attempts} attempts"

        print(save_with_retries(["timeout", "timeout", "ok"]))
        print(save_with_retries(["bad input"]))
      `,
      output: "attempt 1 failed with timeout - waiting 1 seconds\nattempt 2 failed with timeout - waiting 2 seconds\nsaved on attempt 3\nrefused: bad input is not retried",
    },
    steps: [
      { code: 'for attempt, result in enumerate(attempt_results[:max_attempts], start=1):', explanation: 'Stops after a fixed number of attempts, so a failing service is not hammered forever.' },
      { code: 'if result == "bad input": return ...', explanation: 'A user error returns at once. Retrying would only repeat the same failure.' },
      { code: '2 ** (attempt - 1)', explanation: 'The wait doubles each time, which gives a struggling service room to recover.' },
    ],
  },
  tryIt: {
    instructions: [
      'Find a place in Study Tracker where a bad input could crash the program. Write the clear message the user should see instead.',
      'Change max_attempts in the seeItInAction example to 2 and predict the output when the results are timeout, timeout, ok. Run it to check.',
      'Write the log entry you would record for a database timeout, listing the fields it needs and the fields it must not contain.',
    ],
  },
  mistakes: [
    { mistake: 'Showing stack traces and database messages to users.', fix: 'Show a short message and a request identifier, and log the detail for the team.' },
    { mistake: 'Retrying every failure, including bad input.', fix: 'Retry only temporary failures, with a fixed limit and growing waits.' },
    { mistake: 'Calling another service with no timeout.', fix: 'Set a timeout on every outside call, and handle the timeout as an error.' },
  ],
  quiz: [
    {
      question: 'Which failure is worth retrying?',
      options: [
        { text: 'A minutes value of forty, typed as text', explanation: 'That is a user error. The same input will fail every time.' },
        { text: 'A database call that timed out, once', explanation: 'Yes. A timeout may be temporary, so a limited retry can succeed.' },
        { text: 'A missing required field', explanation: 'Retrying does not add the missing field.' },
        { text: 'A negative number of minutes', explanation: 'The value is invalid, so the same request will keep failing.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the value -5?',
      code: { language: 'python', runnable: true, code: code`
        def check(minutes):
            if minutes <= 0:
                return "minutes must be more than zero"
            return "ok"
        print(check(-5))
      ` },
      options: [
        { text: 'ok', explanation: 'Negative minutes are not accepted, so this is not the answer.' },
        { text: 'minutes must be more than zero', explanation: 'Yes. The check catches zero and negative values.' },
        { text: '-5', explanation: 'The program prints the message, not the value.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why set a timeout on a call to another service?',
      options: [
        { text: 'So a hanging call becomes a handled error rather than holding resources forever', explanation: 'Yes. A timeout keeps one slow service from stopping the whole application.' },
        { text: 'So the other service answers faster', explanation: 'A timeout does not make the other service faster.' },
        { text: 'So the user never sees an error', explanation: 'A timeout is an error that is handled, not hidden.' },
        { text: 'So the call is always retried', explanation: 'A timeout is a signal, and whether to retry is a separate decision.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Separate user errors from system errors, show safe and clear messages while logging the full detail, retry only temporary failures with a fixed limit, and set a timeout on every call to another service.',
  resources: [
    { title: 'Error handling in Python', provider: 'Python.org', description: 'The official tutorial on exceptions, try, except, and raising errors.', url: 'https://docs.python.org/3/tutorial/errors.html' },
    { title: 'Error Handling Cheat Sheet', provider: 'OWASP', description: 'Guidance on safe error messages and what to keep out of responses.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html' },
  ],
}

export default lesson
