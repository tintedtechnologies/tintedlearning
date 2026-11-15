import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'chatbot-production',
  whatYouBuild: "The chatbot from Build a Chatbot, made ready for other people to use. It identifies each user, limits how often each user can ask, logs what happened without logging private text, records feedback on each answer and runs from a container so it behaves the same on any machine.",
  diagram: code`
    Browser or app
      -> sign-in token checked (placeholder here, a real identity service later)
      -> rate limit per user: too many requests -> friendly message, nothing sent to the model
      -> chat turn (from the Build a Chatbot project)
      -> log line: request id, user, status, time. No prompt, no reply.
      -> feedback: thumbs up or down, saved with the request id
    Runs in a container, configured by environment variables
  `,
  lessons: ['large-language-models', 'docker', 'logging', 'config-and-secrets', 'ai-observability'],
  tools: ['The Build a Chatbot project, finished', 'Docker Desktop, for the container step', 'A free account on a platform that runs containers, for the deploy step'],
  time: 'about 6 hours, plus the deploy',
  requirements: [
    'Each request is tied to a user, and a request without a valid token is refused',
    'Each user is limited to a set number of questions per minute',
    'Logs record the request id, the user, the status and the time, and never the message or the reply',
    'A thumbs up or down can be recorded against any reply, using its request id',
    'The app runs in a container, with its settings read from environment variables',
  ],
  milestones: [
    {
      title: 'Identify the user',
      goal: 'Check a token on every request, and refuse requests that do not have one. This step uses a placeholder list; a real app uses an identity service.',
      hints: [
        'Store tokens and user names in one place, and never print the tokens.',
        'Return a clear refusal for a missing or unknown token, rather than crashing.',
        'Replace the placeholder list with an identity service once the rest works.',
      ],
      code: {
        language: 'python',
        filename: 'auth.py',
        code: code`
          USERS_BY_TOKEN = {"token-for-ana": "ana", "token-for-ben": "ben"}

          def identify(token):
              if not token or token not in USERS_BY_TOKEN:
                  return None
              return USERS_BY_TOKEN[token]

          print(identify("token-for-ana"))
          print(identify("guessed-token"))
        `,
        output: 'ana\nNone',
      },
      checkpoint: 'A known token returns a user name, and an unknown token returns None.',
    },
    {
      title: 'Limit how often each user can ask',
      goal: 'Allow a set number of questions per user in each minute, and refuse the rest before any model call is made.',
      hints: [
        'Keep a list of the times each user asked, and drop the ones older than a minute.',
        'Pass the current time in as a value, so the limit can be tested without waiting.',
        'Check the limit before the model is called, so a refused question costs nothing.',
      ],
      code: {
        language: 'python',
        filename: 'rate_limit.py',
        code: code`
          LIMIT = 3
          WINDOW_SECONDS = 60

          class RateLimiter:
              def __init__(self):
                  self.asked = {}

              def allow(self, user, now):
                  times = [t for t in self.asked.get(user, []) if now - t < WINDOW_SECONDS]
                  if len(times) >= LIMIT:
                      self.asked[user] = times
                      return False
                  times.append(now)
                  self.asked[user] = times
                  return True

          limiter = RateLimiter()
          results = [limiter.allow("ana", t) for t in [0, 10, 20, 30, 70]]
          print(results)
        `,
        output: '[True, True, True, False, True]',
      },
      checkpoint: 'The fourth question within a minute is refused, and a question after the minute passes is allowed.',
    },
    {
      title: 'Log what happened, without the private text',
      goal: 'Write one log line per request with the request id, the user, the status and the time taken, and no message or reply.',
      hints: [
        'Make a new request id for each request, so you can find one request later.',
        'Log the status ("ok", "limited" or "error") rather than the exception text, which can contain user data.',
        'Use the logging module from the Logging lesson, with a format that keeps every line the same shape.',
      ],
      code: {
        language: 'python',
        filename: 'log_turn.py',
        code: code`
          import json

          def log_turn(request_id, user, status, ms):
              line = {"request_id": request_id, "user": user, "status": status, "ms": ms}
              return json.dumps(line, sort_keys=True)

          print(log_turn("req-0001", "ana", "ok", 412))
          print(log_turn("req-0002", "ben", "limited", 3))
        `,
        output: '{"ms": 412, "request_id": "req-0001", "status": "ok", "user": "ana"}\n{"ms": 3, "request_id": "req-0002", "status": "limited", "user": "ben"}',
      },
      checkpoint: 'Each log line shows the request id, user, status and time, and no message text.',
    },
    {
      title: 'Record feedback on each reply',
      goal: 'Save a thumbs up or down against the request id, so you can find the replies people did not like.',
      hints: [
        'Accept only the values "up" and "down", and refuse anything else.',
        'Store the request id, not the reply text, when you save feedback.',
        'Count feedback by value, and review the "down" replies each week.',
      ],
      code: {
        language: 'python',
        filename: 'feedback.py',
        code: code`
          VALID = {"up", "down"}
          feedback = []

          def record_feedback(request_id, value):
              if value not in VALID:
                  raise ValueError("feedback must be up or down")
              feedback.append({"request_id": request_id, "value": value})

          record_feedback("req-0001", "up")
          record_feedback("req-0002", "down")
          print(len(feedback), sum(1 for item in feedback if item["value"] == "down"))
        `,
        output: '2 1',
      },
      checkpoint: 'Two feedback records are saved, and one of them is a down vote.',
    },
    {
      title: 'Run it in a container and deploy it',
      goal: 'Package the app so it runs the same way on any machine, and deploy it with its settings set outside the image.',
      hints: [
        'Use a Dockerfile from the Docker lesson, and a .dockerignore file that leaves out .env and .venv.',
        'Pass the provider and the key as environment variables when you run the container. Never bake the key into the image.',
        'Choose a platform that runs containers. Follow its own guide for the deploy command, because those commands change over time.',
      ],
      checkpoint: 'The container starts, a request gets a reply, and the key does not appear in the image or the logs.',
    },
  ],
  finishedMeans: [
    'A request with no token, or an unknown token, is refused without a model call',
    'A user who asks too often gets a friendly message, and other users are not affected',
    'Searching the logs for a message you typed finds nothing',
    'Feedback can be recorded and counted by value',
    'The container runs from a fresh clone, and the key is passed in as an environment variable',
  ],
  readmeTemplate: code`
    # [Project name]

    [One sentence: who uses it and what it answers.]

    ## Run it locally
    [Steps, including the environment variables.]

    ## Run it in a container
    [The build and run commands, with placeholders for the key.]

    ## Limits and logging
    [The per-user limit, and what the logs record and do not record.]

    ## Feedback
    [How feedback is stored and reviewed.]
  `,
  portfolioText: "Describe this as a chatbot that other people can safely use, with a per-user limit, logs that leave out private text, feedback and a container. Explain one decision you made about logging, and why you left out the message text. Employers look for that kind of judgment about data.",
  stretchGoals: [
    'Replace the placeholder token list with a real sign-in provider',
    'Add a dashboard that counts requests, limits and feedback per day',
    'Set a daily budget for model calls, and stop the service when it is used up',
  ],
}

export default plan
