import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how an API token proves who is calling, and why tokens must expire',
    'Validate every request against an allowlist of expected fields before using it',
    'Limit how fast any one client can call an API, and return only the data the caller needs',
  ],
  bigIdea: 'An API is a door that other programs knock on, and every knock needs three checks: who is calling, whether the request is well-formed, and whether the caller is allowed to make it at this rate. Tokens prove identity and should expire, input validation rejects anything unexpected, rate limits protect against abuse, and responses should contain only the data the caller needs.',
  whyItMatters: 'A study app exposes an API that returns each student\'s full record when given a student ID. The ID is a small number, so a script tries every ID in sequence and downloads the whole database in minutes. Each check that was missing would have stopped it: a token tied to one student, a rate limit, and a response that returned only that student\'s own data.',
  goalSections: [
    {
      heading: 'Tokens that prove who is calling',
      paragraphs: [
        'An API token is a credential the client sends with each request, which the server checks before answering. A good token is random and long, is issued after the user signs in, is tied to specific permissions, and expires after a short time. A refresh step renews it without asking the user to sign in every time.',
        'Store tokens securely on the client and never put them in a URL, where they can be logged by servers and browsers. Send them in a header, and revoke them when a user signs out or changes their password.',
        'The server must check the token on every request, not only at sign-in. A check that happens once and then trusts the client for the rest of the session is an easy mistake to make.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Request:  GET /students/42/record
          Header:   Authorization: Bearer <token issued at sign-in, expires in 15 minutes>
          Server:   checks the token, reads the student ID the token belongs to, and returns record 42 only if they match
        `,
      },
    },
    {
      heading: 'Validating every request',
      paragraphs: [
        'Accept only the fields the endpoint expects, with the types and ranges it needs. Reject anything else. An allowlist is safer than a blocklist, because a blocklist always misses a new trick.',
        'Validate the values, not only the shape. A request for a page size of a million rows should be refused or capped. A request with an ID that belongs to another user should be refused even when the format is correct.',
        'Return clear errors without internal detail. A message that says which field is wrong helps the developer, and a stack trace or a database message helps an attacker.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          ALLOWED = {"title": str, "minutes": int}

          def validate(body):
              extra = [key for key in body if key not in ALLOWED]
              if extra:
                  return False, "unexpected fields: " + ", ".join(extra)
              for key, expected in ALLOWED.items():
                  if key in body and not isinstance(body[key], expected):
                      return False, key + " has the wrong type"
              return True, "ok"

          print(validate({"title": "math", "minutes": 30}))
          print(validate({"title": "math", "role": "admin"}))
        `,
        output: "(True, 'ok')\n(False, 'unexpected fields: role')",
      },
    },
    {
      heading: 'Rate limits and minimal responses',
      paragraphs: [
        'A rate limit caps how many requests one client can make in a period. It slows down scripts that try every ID, brute-force a login, or overload the service. Limits should apply per user or per token, not only per address, because many users can share one address.',
        'Return only the fields the caller needs. A list endpoint for students does not need the date of birth or the home address. Returning fewer fields limits the damage when something goes wrong, and it reduces what the client can misuse. Document the fields each endpoint returns, so a reviewer can check them.',
        'Log refused requests, especially repeated ones from the same client. A pattern of refused requests is often the first sign of an attack in progress. Review the log once a week, and look for clients that are refused again and again.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          LIMIT_PER_MINUTE = 5
          requests_by_token = {"token-a": 4, "token-b": 9}

          for token, count in requests_by_token.items():
              if count > LIMIT_PER_MINUTE:
                  print(token, "refused: over", LIMIT_PER_MINUTE, "per minute")
              else:
                  print(token, "allowed")
        `,
        output: 'token-a allowed\ntoken-b refused: over 5 per minute',
      },
    },
  ],
  seeItInAction: {
    title: 'Refusing a scraper and a bad request',
    intro: 'The program above applies the two checks that stop a scraper: a token must be present, and a request must stay under the rate limit. Run it, then add a token with no value and predict how it is handled.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        LIMIT = 5
        requests = [
            {"token": "student-7", "count": 2},
            {"token": "scraper-1", "count": 300},
            {"token": "", "count": 1},
        ]
        for request in requests:
            if not request["token"]:
                print("refused: missing token")
            elif request["count"] > LIMIT:
                print(request["token"], "refused: rate limit")
            else:
                print(request["token"], "allowed")
      `,
      output: 'student-7 allowed\nscraper-1 refused: rate limit\nrefused: missing token',
    },
    steps: [
      { code: 'if not request["token"]:', explanation: 'Checks identity first. A request with no credential is refused before anything else.' },
      { code: 'elif request["count"] > LIMIT:', explanation: 'Applies the rate limit, which stops a script from making thousands of calls.' },
      { code: 'print(request["token"], "allowed")', explanation: 'Only requests that pass both checks are allowed to reach the data.' },
    ],
  },
  tryIt: {
    instructions: [
      'Pick an API you use. Find out whether it has a rate limit, and write down the limit it documents.',
      'Add a request with a count of exactly 5 to the seItInAction example and predict whether it is allowed. Run it to check.',
      'Write the allowlist of fields for one endpoint you would build, and list one field you would refuse to return.',
    ],
  },
  mistakes: [
    { mistake: 'Checking the token only at sign-in.', fix: 'Check the token on every request, and make it expire after a short time.' },
    { mistake: 'Blocking known bad inputs instead of allowing only expected ones.', fix: 'Use an allowlist of fields, types, and ranges, and refuse everything else.' },
    { mistake: 'Returning full records when the caller needs a few fields.', fix: 'Return only the fields the caller needs, and log refused requests.' },
  ],
  quiz: [
    {
      question: 'Why should an API token expire after a short time?',
      options: [
        { text: 'So a stolen token stops working soon, which limits how long it can be misused', explanation: 'Yes. Expiry bounds the damage of a leaked token.' },
        { text: 'So the user has to sign in with a different password each time', explanation: 'Expiry is about the credential, not the password.' },
        { text: 'So the API runs faster', explanation: 'Token expiry does not change speed.' },
        { text: 'So the token can be shared more easily', explanation: 'Short expiry makes sharing less useful.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a request with an unexpected field?',
      code: { language: 'python', runnable: true, code: code`
        ALLOWED = {"title"}
        body = {"title": "math", "admin": True}
        extra = [k for k in body if k not in ALLOWED]
        print("refused" if extra else "accepted")
      ` },
      options: [
        { text: 'accepted', explanation: 'The admin field is not on the allowlist, so the request is refused.' },
        { text: 'refused', explanation: 'Yes. The unexpected admin field is caught by the allowlist.' },
        { text: 'admin', explanation: 'The program prints the decision, not the field.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why limit responses to the fields a caller needs?',
      options: [
        { text: 'So a leak or misuse exposes less personal data', explanation: 'Yes. Minimal responses reduce the damage when something goes wrong.' },
        { text: 'So the response is larger', explanation: 'Minimal responses are smaller, not larger.' },
        { text: 'So the caller cannot read the response at all', explanation: 'The caller can read the fields they need.' },
        { text: 'So the database does less work', explanation: 'The reason is protecting data, not database load.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Protect an API with expiring tokens checked on every request, allowlisted and typed input, rate limits per client, minimal responses, and logs of refused requests.',
  resources: [
    { title: 'REST security cheat sheet', provider: 'OWASP', description: 'Guidance on authentication, input validation, and rate limiting for REST APIs.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html' },
    { title: 'API Security Top 10', provider: 'OWASP', description: 'The most common API security risks, including broken object-level authorization.', url: 'https://owasp.org/API-Security/' },
  ],
}

export default lesson
