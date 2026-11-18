import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain how cloud bills are built from usage, time, and data movement',
    'Estimate the monthly cost of a small system before it is built',
    'Set budgets and alerts so that a mistake is caught in hours, not at the end of the month',
  ],
  bigIdea: 'Cloud services are billed by use. You pay for how long something runs, how much storage it holds, how much data leaves the cloud, and how many requests it handles. A simple estimate, a budget, and an alert turn an unpleasant surprise into a small, early warning.',
  whyItMatters: 'A student tries a cloud tutorial, forgets to turn off a database, and finds a bill several hundred dollars higher than expected at the end of the month. The database was never used after the first hour. A budget alert set on day one would have sent an email the same afternoon. Cost is part of the design, and it can be checked like any other part.',
  goalSections: [
    {
      heading: 'What you are charged for',
      paragraphs: [
        'Most cloud charges fall into four groups. Compute is the time a server or function runs. Storage is the amount of data kept, billed by the gigabyte per month. Requests are the number of calls a service receives. Data transfer is the data that leaves the cloud or moves between regions.',
        'Some charges are easy to miss. A running virtual machine costs money even when nobody is using it. A stored snapshot keeps costing storage fees. Data sent to the internet is often billed, while data received is usually free. Reading the pricing page for each service you use is part of the work.',
        'The unit matters. A service billed per hour and a service billed per million requests cannot be compared directly. Convert both to a monthly figure for your expected use before deciding which one is cheaper.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          hours_per_month = 24 * 30
          server_per_hour = 0.02
          storage_gb = 50
          storage_per_gb = 0.08
          transfer_gb = 10
          transfer_per_gb = 0.09

          compute = hours_per_month * server_per_hour
          storage = storage_gb * storage_per_gb
          transfer = transfer_gb * transfer_per_gb
          total = compute + storage + transfer
          print("estimated monthly cost:", round(total, 2))
        `,
        output: 'estimated monthly cost: 19.3',
      },
    },
    {
      heading: 'Estimating before you build',
      paragraphs: [
        'A cost estimate is a list of the things that will run, the amount of each, and the price for that amount. Write the list before creating anything. The example above does this for a small web app: one server running all month, a database of fifty gigabytes, and ten gigabytes sent to visitors.',
        'Estimates are guesses, so give them a range. Make a low guess and a high guess, and plan for the high one. If the high guess is more than the budget, redesign before you build. Turning off a service at night or choosing a smaller size often reduces the cost a lot.',
        'Compare the estimate with the real bill after the first month. The gap teaches you what you missed. Keep a note of the surprises, and use them in the next estimate.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          services = {"web server": (730, 0.02), "database": (730, 0.05), "backups": (50, 0.02)}
          total = 0.0
          for name, (hours, rate) in services.items():
              cost = hours * rate
              total += cost
              print(name, round(cost, 2))
          print("estimated total:", round(total, 2))
        `,
        output: 'web server 14.6\ndatabase 36.5\nbackups 1.0\nestimated total: 52.1',
      },
    },
    {
      heading: 'Budgets and alerts',
      paragraphs: [
        'A budget is a limit you set for spending over a period. An alert is a message sent when spending passes a point you choose, such as half the budget, the whole budget, or a forecast that you will go over. Most cloud providers offer both, and they are free to set up.',
        'Set the first alert low. An alert at ten dollars for a project meant to cost five is far more useful than an alert at one hundred, because it arrives while there is still time to act. Send alerts to a person who will read them, not to a shared inbox nobody checks.',
        'Shut down what you are not using. Delete test resources when a lesson or experiment is finished. Stop a database or virtual machine when it is not needed, and check the console for resources you forgot. A cost review once a week is a simple habit that catches most surprises.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          budget = 100
          daily_spend = [20, 35, 25, 25]
          alerts_sent = []
          total = 0
          for day, amount in enumerate(daily_spend, start=1):
              total += amount
              for percent in [50, 80, 100]:
                  if total >= budget * percent / 100 and percent not in alerts_sent:
                      alerts_sent.append(percent)
                      print("day", day, "alert at", percent, "percent")
        `,
        output: 'day 2 alert at 50 percent\nday 3 alert at 80 percent\nday 4 alert at 100 percent',
      },
    },
  ],
  seeItInAction: {
    title: 'Checking spending against a budget',
    intro: 'The program below tracks daily spending against a monthly budget and flags the day the budget is passed. Real providers do this for you, but the logic is the same. Run it, then change one day\'s cost and predict whether the alert changes.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        budget = 20.0
        alert_at = 0.5 * budget
        daily_costs = [0.8, 1.2, 4.5, 3.0, 6.5, 2.0]

        spent = 0.0
        for day, cost in enumerate(daily_costs, start=1):
            spent += cost
            if spent >= budget:
                print("day", day, "over budget:", round(spent, 2))
                break
            if spent >= alert_at and spent - cost < alert_at:
                print("day", day, "alert: half the budget is spent")
        print("total so far:", round(spent, 2))
      `,
      output: 'day 5 alert: half the budget is spent\ntotal so far: 18.0',
    },
    steps: [
      { code: 'alert_at = 0.5 * budget', explanation: 'The first warning is set at half the budget, so there is time to react.' },
      { code: 'spent += cost', explanation: 'Adds each day\'s cost to the running total, the same way a provider tracks charges.' },
      { code: 'if spent >= alert_at and spent - cost < alert_at:', explanation: 'Sends the alert only on the day the threshold is crossed, not on every day after it.' },
      { code: 'break', explanation: 'Stops the loop once the full budget is passed, the point where a person must act.' },
    ],
  },
  tryIt: {
    instructions: [
      'Write a monthly cost estimate for a small app you could build. List each service, its amount, and its price, then add them up.',
      'Set a budget and two alerts in a cloud account you have, or in a free trial. Write down the amounts and who receives the alerts.',
      'Look at the cloud bill or usage page you have access to, and find the largest charge. Write one way to reduce it.',
    ],
  },
  mistakes: [
    { mistake: 'Leaving a test resource running after the lesson.', fix: 'Delete or stop resources as soon as the work is finished, and check the console for forgotten ones.' },
    { mistake: 'Setting the only alert at the full budget.', fix: 'Add an earlier alert at half the budget, so you can act before the limit.' },
    { mistake: 'Comparing prices in different units.', fix: 'Convert every price to a monthly amount for your expected use before comparing.' },
  ],
  quiz: [
    {
      question: 'Which of these is most likely to keep costing money when nobody uses it?',
      options: [
        { text: 'A stored snapshot of a server', explanation: 'Yes. Stored data keeps costing storage fees until it is deleted.' },
        { text: 'A written document on your laptop', explanation: 'A file on your own computer is not a cloud charge.' },
        { text: 'A page of documentation', explanation: 'Reading documentation is free and does not run any cloud service.' },
        { text: 'A login to the console', explanation: 'Signing in to the console does not create a charge by itself.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the first alert?',
      code: { language: 'python', runnable: true, code: code`
        budget = 10.0
        alert_at = 0.5 * budget
        spent = 0.0
        for cost in [2.0, 4.0]:
            before = spent
            spent += cost
            if spent >= alert_at and before < alert_at:
                print("alert at", spent)
      ` },
      options: [
        { text: 'alert at 2.0', explanation: 'The alert is at half the budget, which is 5.0, so 2.0 is not enough.' },
        { text: 'alert at 6.0', explanation: 'Yes. After the second day the total is 6.0, which passes 5.0 for the first time.' },
        { text: 'alert at 10.0', explanation: 'The full budget is not reached, and the alert fires at half the budget.' },
        { text: 'No output', explanation: 'The total does pass the alert point, so a line is printed.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Why set the first budget alert low?',
      options: [
        { text: 'So the warning arrives while there is still time to act', explanation: 'Yes. An early alert gives the team time to check and fix the cause.' },
        { text: 'So the bill is reduced automatically', explanation: 'An alert warns you. It does not change the bill by itself.' },
        { text: 'So the provider can charge less', explanation: 'Alert thresholds do not change prices.' },
        { text: 'So the project never goes over budget', explanation: 'Alerts reduce surprises but do not guarantee spending limits.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Cloud bills come from running time, stored data, requests, and data leaving the cloud, so estimate each one, set an early alert, and shut down what you do not use.',
  resources: [
    { title: 'AWS Pricing Calculator', provider: 'AWS', description: 'A free calculator for estimating monthly cloud costs before building.', url: 'https://calculator.aws/' },
    { title: 'Azure cost management', provider: 'Microsoft Learn', description: 'How to track spending, set budgets, and create alerts in Azure.', url: 'https://learn.microsoft.com/en-us/azure/cost-management-billing/' },
  ],
}

export default lesson
