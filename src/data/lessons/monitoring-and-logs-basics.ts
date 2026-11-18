import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the difference between logs, metrics, and alerts',
    'Write a log message that a person can read during an incident',
    'Choose a few measurements that show whether a service is healthy',
  ],
  bigIdea: 'Once a system runs in the cloud, you cannot watch it directly, so you need signals that describe what it is doing. Logs record events, metrics record numbers over time, and alerts tell a person when a number crosses a line. Good monitoring shows a problem before users report it.',
  whyItMatters: 'A small online shop works for months, then on a Monday morning customers cannot pay. Nobody knows when the problem began. If the checkout service had logged its errors and tracked the error rate, the team would have seen the rise on Sunday night and fixed the problem before the morning rush.',
  goalSections: [
    {
      heading: 'Logs, metrics, and alerts',
      paragraphs: [
        'A log is a record of an event, written as a line of text or structured data. "Payment failed for order 1042: card declined" is a log. Logs answer the question of what happened, and they are most useful when you already know roughly when the problem began.',
        'A metric is a number measured over time, such as requests per minute, average response time, or the percentage of requests that failed. Metrics answer the question of how the system is behaving overall. A chart of the error rate can show a problem in seconds, when reading a thousand log lines would take hours.',
        'An alert connects the two. It watches a metric, and when the value stays above a limit for a set time, it notifies a person. A good alert is specific enough that the person knows what to check, and quiet enough that they do not learn to ignore it.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import json

          event = {
              "time": "2026-11-16T22:14:03Z",
              "level": "ERROR",
              "service": "checkout",
              "order": 1042,
              "message": "payment declined",
          }
          print(json.dumps(event))
        `,
        output: '{"time": "2026-11-16T22:14:03Z", "level": "ERROR", "service": "checkout", "order": 1042, "message": "payment declined"}',
      },
    },
    {
      heading: 'Writing logs a person can use',
      paragraphs: [
        'A useful log message says what happened, where, and to which item. It also carries a time and a level, such as INFO, WARNING, or ERROR, so a person can filter the noise. The example above writes the same event as structured data, which a tool can search by field.',
        'Never write secrets into logs. Passwords, access tokens, and full card numbers must stay out, because logs are copied, stored, and read by many people. Log the fact that a payment failed, not the card number that failed.',
        'Log enough to explain a failure, but not so much that the important line is buried. A log that records every single request grows quickly and costs money to store. Choose the events that matter, such as errors, changes, and slow requests.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import json

          event = {"level": "ERROR", "service": "checkout", "message": "payment declined", "order": 1042}
          print(json.dumps(event))
          print("card number in the log:", "no")
        `,
        output: '{"level": "ERROR", "service": "checkout", "message": "payment declined", "order": 1042}\ncard number in the log: no',
      },
    },
    {
      heading: 'Choosing what to measure',
      paragraphs: [
        'Start with three questions. Is the service available? Is it fast enough? Is it correct? Availability can be measured as the share of requests that succeed. Speed can be measured as the time that most users wait, often the 95th percentile. Correctness can be measured as the share of results that pass a check.',
        'Measure from the user\'s point of view when you can. A server can report that it is fine while the network between it and users is failing. A check that calls the service the way a user would is often the most honest signal.',
        'Keep the list short. Five clear metrics that a team looks at every day are worth more than fifty that nobody reads. Each metric should have a plain-language name, a normal range, and the person who responds when it leaves that range.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          measures = {
              "successful requests": (985, 1000),
              "requests under 2 seconds": (960, 1000),
          }
          for name, (good, total) in measures.items():
              print(name, round(good / total * 100, 1), "%")
        `,
        output: 'successful requests 98.5 %\nrequests under 2 seconds 96.0 %',
      },
    },
  ],
  seeItInAction: {
    title: 'Turning raw requests into an error rate',
    intro: 'The program below takes a list of request results and turns them into a metric, then decides whether an alert should fire. This is the same idea a monitoring tool uses behind its charts. Run it, then change one result and predict whether the alert changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        results = ["ok", "ok", "error", "ok", "error", "error", "ok", "ok", "ok", "ok"]
        error_rate = results.count("error") / len(results)
        print("error rate:", round(error_rate * 100), "%")

        ALERT_ABOVE = 0.2
        if error_rate > ALERT_ABOVE:
            print("ALERT: check the checkout service")
        else:
            print("normal")
      `,
      output: 'error rate: 30 %\nALERT: check the checkout service',
    },
    steps: [
      { code: 'error_rate = results.count("error") / len(results)', explanation: 'Turns individual events into one number, the share of requests that failed.' },
      { code: 'ALERT_ABOVE = 0.2', explanation: 'The threshold is named and written in one place, so the team can see and change it.' },
      { code: 'print("ALERT: check the checkout service")', explanation: 'The alert names the service to check, so the person knows where to start.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a log message for an event in an app you use, such as a failed login. Include the time, the level, and the item affected, but no secrets.',
      'Change ALERT_ABOVE in the example to 0.4 and predict whether the alert fires. Then run it to check.',
      'Pick three metrics for a service you know. For each, write the normal range and the person who should respond when it is outside the range.',
    ],
  },
  mistakes: [
    { mistake: 'Logging passwords, tokens, or full card numbers.', fix: 'Log the event and an identifier, never the secret.' },
    { mistake: 'Setting alerts so sensitive that they fire all the time.', fix: 'Alert on sustained problems, and review alerts that nobody acts on.' },
    { mistake: 'Measuring only whether the server is running.', fix: 'Also measure what users experience: success, speed, and correct results.' },
  ],
  quiz: [
    {
      question: 'Which tool best shows that the error rate rose sharply over the last hour?',
      options: [
        { text: 'A metric chart', explanation: 'Yes. A metric shows numbers over time, so a rise is visible at a glance.' },
        { text: 'A single log line from last week', explanation: 'One old event does not show the overall trend.' },
        { text: 'A password manager', explanation: 'A password manager does not record service behavior.' },
        { text: 'A copy of the source code', explanation: 'Source code shows how the system is built, not how it behaves right now.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the error rate?',
      code: { language: 'python', runnable: true, code: code`
        results = ["ok", "error", "ok", "ok"]
        print("error rate:", round(results.count("error") / len(results) * 100), "%")
      ` },
      options: [
        { text: 'error rate: 25 %', explanation: 'Yes. One error in four requests is 25 percent.' },
        { text: 'error rate: 1 %', explanation: 'The program divides the error count by the total and multiplies by 100.' },
        { text: 'error rate: 75 %', explanation: '75 percent would be three errors in four. There is only one error here.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why should an alert fire only when a problem lasts for a set time?',
      options: [
        { text: 'So people are not woken up by a single brief spike that clears itself', explanation: 'Yes. Sustained thresholds reduce false alarms and keep alerts worth reading.' },
        { text: 'So the system never sends any alerts', explanation: 'Alerts still fire, just after the problem persists.' },
        { text: 'So logs are deleted automatically', explanation: 'Alert timing has nothing to do with deleting logs.' },
        { text: 'So the metric is measured more slowly', explanation: 'The metric can still be measured often. The rule is about when to notify a person.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Logs record what happened, metrics show how the system behaves over time, and alerts call a person when a few carefully chosen numbers stay outside their normal range.',
  resources: [
    { title: 'Observability primer', provider: 'Google Cloud', description: 'An introduction to logs, metrics, and traces, and how they support operations.', url: 'https://cloud.google.com/architecture/devops/devops-measurement' },
    { title: 'Logging and monitoring', provider: 'AWS', description: 'How AWS services collect logs and metrics, and how alarms respond to them.', url: 'https://aws.amazon.com/cloudwatch/' },
  ],
}

export default lesson
