import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Scalability and AI Observability and Operations, and the retry logic in Study Tracker\'s `ai.py` from What is an AI API?',
  goals: [
    'Set timeouts and retry rules so one slow dependency cannot drag the whole system down',
    'Design fallbacks so the system degrades gracefully when a part fails',
    'Use an availability target and an error budget to balance new features against reliability work',
  ],
  bigIdea: "Reliability means a system keeps doing what its users need, even when parts of it fail. And parts always fail eventually: a model provider has an outage, a database slows down, a network drops requests. Reliable systems limit how long they wait, retry with care, fall back to something simpler and measure their reliability against an explicit target.",
  whyItMatters: "During exam week the model provider has a 40-minute outage. In a fragile Study Tracker, every AI request waits a full minute before timing out, web workers pile up waiting, and soon even logging a session fails. In a reliable one, AI features say \"unavailable\" within a second or two, everything else works normally, and the team's error budget tells them whether next month is for new features or for hardening.",
  goalSections: [
    {
      heading: 'Timeouts and retries',
      paragraphs: [
        "Every call over a network needs a timeout, chosen from measurements: a little above the slowest normal responses you see, not a generous default. A request that waits forever ties up a worker, and enough stuck workers take down the whole service.",
        "Retries rescue brief failures but multiply load during real ones. Retry at one layer only, with growing waits and a little randomness, as in What is an AI API? And only retry operations that are safe to repeat, called idempotent. Reading totals twice is harmless. Saving a session twice creates a duplicate, unless the request carries a unique key the server uses to recognize a repeat, called an idempotency key.",
        "When a dependency keeps failing, stop calling it for a while. A circuit breaker counts failures, and after a few in a row it opens: calls fail instantly without waiting. After a cooling-off period it lets one trial call through, and closes again if that works.",
      ],
      example: {
        language: 'text',
        code: code`
          Call                     Timeout     Retry?
          GET /totals (database)   2 s         yes, once: a safe read
          Embed a question         5 s         yes, with backoff: no side effects
          Stream an answer         first token within 10 s; no retry once started
          Save a session           2 s         only with an idempotency key
          Model provider down      circuit breaker opens after 3 failures in a row
        `,
      },
    },
    {
      heading: 'Fallbacks and graceful degradation',
      paragraphs: [
        "For each dependency, decide in advance what happens when it fails. If the model provider is down, the circuit breaker opens and AI features answer \"unavailable\" at once. The gateway could also switch to a second provider or a local model, which is one more reason Study Tracker routes every call through one helper.",
        "Some features can fall back to something simpler instead of disappearing. If embeddings are unavailable, note search can use a plain keyword search, labeled as basic. If the totals cache is unreachable, the database can answer directly, just more slowly. Doing less, rather than failing completely, is called graceful degradation.",
        "Keep failures contained. Give AI calls their own limited pool of workers or connections, so a slow provider can only use up that pool, not the ones handling ordinary page loads. This idea is called a bulkhead, after the walls that stop one flooded section from sinking a ship.",
      ],
      example: {
        language: 'python',
        code: code`
          class CircuitBreaker:
              def __init__(self, failure_limit=3, cool_down=30):
                  self.failure_limit = failure_limit
                  self.cool_down = cool_down
                  self.failures = 0
                  self.opened_at = None

              def allow(self, now):
                  if self.opened_at is None:
                      return True
                  return now - self.opened_at >= self.cool_down

              def record(self, success, now):
                  if success:
                      self.failures, self.opened_at = 0, None
                  else:
                      self.failures += 1
                      if self.failures >= self.failure_limit:
                          self.opened_at = now


          breaker = CircuitBreaker()
          for now, works in [(0, False), (1, False), (2, False), (3, False), (35, True), (36, True)]:
              if not breaker.allow(now):
                  print(f"t={now}s skipped: circuit open, reply 'unavailable' at once")
                  continue
              breaker.record(works, now)
              print(f"t={now}s called the model:", "ok" if works else "failed")
        `,
        output: "t=0s called the model: failed\nt=1s called the model: failed\nt=2s called the model: failed\nt=3s skipped: circuit open, reply 'unavailable' at once\nt=35s called the model: ok\nt=36s called the model: ok",
      },
    },
    {
      heading: 'Targets and error budgets',
      paragraphs: [
        "Reliability needs a target to be managed. First choose what to measure, a service level indicator, such as the share of requests that succeed within 2 seconds. Then set a service level objective, the target for that measure, such as 99.5% over 30 days.",
        "The gap between 100% and the target is the error budget: here 0.5%, about 216 bad minutes a month. While budget remains, the team can ship new features and take reasonable risks. When it is used up, the team pauses risky changes and works on reliability until it recovers. The budget turns an argument about priorities into a number everyone can see.",
        "Do not aim for 100%. Users cannot tell 99.99% from 100%, your own dependencies are not perfect either, and each extra nine costs far more than the last.",
      ],
      example: {
        language: 'python',
        code: code`
          minutes_in_30_days = 30 * 24 * 60
          for target in [99.0, 99.5, 99.9, 99.99]:
              budget = minutes_in_30_days * (100 - target) / 100
              print(f"{target}% -> {budget:.1f} bad minutes allowed")
        `,
        output: '99.0% -> 432.0 bad minutes allowed\n99.5% -> 216.0 bad minutes allowed\n99.9% -> 43.2 bad minutes allowed\n99.99% -> 4.3 bad minutes allowed',
      },
    },
  ],
  seeItInAction: {
    title: 'A model provider outage, two ways',
    intro: "Here is the same 40-minute outage during exam week, first in a fragile design and then in one using this lesson's ideas. The timings are illustrative, but both chains of events are common in real systems.",
    example: {
      language: 'text',
      code: code`
        Fragile design
          18:00  provider starts failing; every AI call waits the full 60 s timeout
          18:02  each failed call is retried 3 times by the API and 3 by the client
          18:04  all web workers are busy waiting; logging a session times out too
          18:40  provider recovers; a flood of retries keeps the app slow until 18:55

        Reliable design
          18:00  three AI calls fail within their 10 s timeout; the circuit breaker opens
          18:00  AI features reply "unavailable" in under 50 ms; note search falls
                 back to keyword search; sessions, totals and history work normally
          18:30  the breaker lets one trial call through each 30 s; still failing
          18:40  a trial succeeds; the breaker closes; AI features return
          Error budget: 40 minutes of AI unavailability used, out of 216
      `,
    },
    steps: [
      { code: 'every AI call waits the full 60 s timeout', explanation: "A timeout chosen as a generous default rather than from measurements. Each user waits a minute to learn that nothing will happen." },
      { code: 'retried 3 times by the API and 3 by the client', explanation: "Retries at two layers multiply. Each user action now sends up to 9 requests to a provider that is already failing. Under the hood shows how quickly this grows." },
      { code: 'logging a session times out too', explanation: "Without a bulkhead, AI calls used up every worker, so a failure in an optional feature took down the core one." },
      { code: 'the circuit breaker opens', explanation: "After three failures, calls stop immediately. Users get a fast, honest answer, and the struggling provider gets no extra load from Study Tracker." },
      { code: 'note search falls back to keyword search', explanation: "Graceful degradation: a weaker version of the feature is better than none, as long as it is labeled honestly." },
      { code: 'Error budget: 40 minutes ... out of 216', explanation: "The outage used part of the month's budget. If it had been used up, the team would know from the number alone to prioritize reliability work." },
    ],
  },
  tryIt: {
    instructions: [
      'List every network call your Study Tracker makes. For each, write a timeout, whether it is safe to retry, and what the user should see if it fails.',
      'Run the circuit breaker example above, then change `failure_limit` to 1 and `cool_down` to 10. Predict the output before running it.',
      'Choose a service level indicator and objective for Study Tracker\'s notes assistant, and work out its monthly error budget with the code above.',
      'Write a one-paragraph error budget policy: what the team does when half the budget is used, and when all of it is.',
    ],
    evidencePrompt: {
      label: 'Your reliability plan',
      placeholder: 'For example: Indicator: share of notes answers that start within 2 s. Objective: 99% over 30 days, so 432 bad minutes. When half is used we...',
    },
  },
  mistakes: [
    { mistake: 'Using long default timeouts everywhere.', fix: 'Set each timeout from measured response times, a little above the slowest normal ones.' },
    { mistake: 'Retrying at every layer.', fix: 'Retry at one layer only, with backoff and jitter, and never retry an action that is unsafe to repeat.' },
    { mistake: 'Letting an optional feature\'s failure take down the core app.', fix: 'Use circuit breakers, separate worker pools and fallbacks, so core features keep working.' },
    { mistake: 'Aiming for 100% reliability.', fix: 'Set a realistic objective and use the error budget to decide when to slow down and harden.' },
  ],
  quiz: [
    {
      question: 'Which operation is safe to retry automatically after a timeout?',
      options: [
        { text: '`POST /sessions` without an idempotency key', explanation: 'If the first attempt actually succeeded, a retry saves a duplicate session.' },
        { text: 'Sending a reminder email', explanation: 'A retry could send the learner the same email twice.' },
        { text: '`GET /totals`', explanation: 'Reading data changes nothing, so repeating it is harmless.' },
        { text: 'Approving a study plan', explanation: 'A repeated approval could save the plan twice.' },
      ],
      answer: 2,
    },
    {
      question: 'Your objective is 99.5% good requests over 30 days. On day 20, 90% of the error budget is gone. What does an error budget policy suggest?',
      options: [
        { text: 'Pause risky launches and focus on reliability until the budget recovers', explanation: 'The budget is nearly spent, so the priority shifts to making the service more reliable.' },
        { text: 'Launch faster to make up for lost time', explanation: 'That risks breaking the objective, which is exactly what the budget is there to prevent.' },
        { text: 'Lower the objective to 99% so there is more budget', explanation: 'Moving the target hides the problem from the people it protects.' },
        { text: 'Nothing, because the month is not over', explanation: 'With 10% left and 10 days to go, one more incident would break the objective.' },
      ],
      answer: 0,
    },
    {
      question: 'The model provider is down. Which design keeps Study Tracker most useful?',
      options: [
        { text: 'Every AI call waits 60 seconds, then retries three times', explanation: 'Users wait minutes for nothing, and the retries add load to a failing provider.' },
        { text: 'Show a maintenance page for the whole app until the provider recovers', explanation: 'Sessions, totals and history do not need the model, so blocking them is unnecessary.' },
        { text: 'Hide the error and show the last answer each student received', explanation: 'An old answer to a different question is wrong and misleading.' },
        { text: 'A circuit breaker fails AI calls fast with a clear message, search falls back to keywords, and core features keep working', explanation: 'Failing fast, degrading gracefully and protecting the core is what reliable design looks like.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Give every call a measured timeout, retry only safe operations at one layer, open a circuit and fall back when a dependency fails, and manage reliability with an explicit objective and error budget.',
  resources: [
    { title: 'Service level objectives', provider: 'Google SRE Book', description: 'Indicators, objectives and how to choose them.', url: 'https://sre.google/sre-book/service-level-objectives/' },
    { title: 'Embracing risk', provider: 'Google SRE Book', description: 'Error budgets and why 100% is the wrong target.', url: 'https://sre.google/sre-book/embracing-risk/' },
    { title: 'Timeouts, retries and backoff with jitter', provider: 'Amazon Builders\' Library', description: 'How large systems choose timeouts and avoid retry storms.', url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/' },
    { title: 'Circuit breaker', provider: 'Martin Fowler', description: 'A short explanation of the pattern, with diagrams.', url: 'https://martinfowler.com/bliki/CircuitBreaker.html' },
  ],
  underTheHood: {
    heading: 'How retries multiply',
    paragraphs: [
      "Imagine a browser that retries a failed request up to 3 times in total, calling an API that retries up to 3 times, which calls a gateway that also retries up to 3 times. When the provider at the bottom is completely down, one user action becomes 3 x 3 x 3 = 27 calls to it.",
      "Multiply by every user who clicks during the outage, and the provider faces many times its normal load at the exact moment it is weakest. Even after it recovers, the flood of waiting retries can knock it straight back down. This is called a retry storm.",
      "The defenses work together. Retry at one layer only and fail fast everywhere else. Add jitter so retries spread out instead of arriving together. Use a retry budget, for example only retrying when fewer than 10% of recent requests were retries, so retries stop when failure is widespread. And open a circuit breaker once failures are clearly not brief, which drops the load from Study Tracker to almost nothing until a trial call succeeds.",
    ],
  },
}

export default lesson
