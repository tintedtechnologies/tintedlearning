import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain latency as the delay between a request and its response, and name what adds to it',
    'Choose a region based on where your users are, your data rules, and the services you need',
    'Estimate the effect of distance on a request before you measure it',
  ],
  bigIdea: 'Latency is the time between a user sending a request and receiving the response. Distance adds delay, because signals take time to travel, and each step the request passes through adds more. A region is a group of data centers in one area, and choosing one close to your users is often the cheapest way to make an app feel fast.',
  whyItMatters: 'A team hosts its app in a region on the other side of the world from its customers, because that region was the default when the account was created. Every click takes a noticeable pause, and customers assume the app is broken. Moving the app to a nearby region is a configuration change, but it is easy to miss when nobody asks where the users are.',
  goalSections: [
    {
      heading: 'What latency is made of',
      paragraphs: [
        'Latency is the total delay for one round trip: the request travels to the server, the server does its work, and the response travels back. Distance adds a delay because light in fiber travels at a fixed speed, and a request crossing an ocean takes measurable time before any work starts.',
        'The network is only part of the delay. The server may wait on a database, a slow query may add more time, and a busy server may queue requests. When an app feels slow, check each part separately instead of assuming the distance is the only cause. Measure each part with a timer or a trace, so the slow step is found with evidence and not guessed.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          One request, rough shares of the delay:
          Network to the server      depends on distance and routing
          Server processing          code and load on the machine
          Database query             indexes, size, and location of the data
          Network back to the user   depends on distance and routing
        `,
      },
    },
    {
      heading: 'Choosing a region',
      paragraphs: [
        'A region is a set of data centers in one geographic area. Pick the region closest to most of your users, unless a rule requires your data to stay in a particular country. Users in several countries may need one region for each area, or a region close to the largest group. Compare the services each region offers, because a service you need may not be available everywhere.',
        'Look at the cost as well. Prices for the same service can differ by region, and moving data between regions can add charges. Write down the region choice with the reason for it, so a later team knows why it was made. A region moved later for cost or law should also be recorded, because the old reason may no longer apply.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Question                                  Check
          Where are most of our users?              Choose a region near them
          Do rules require data to stay somewhere?  Choose a region that meets the rule
          Do we need a specific managed service?    Confirm it is offered in that region
          What does each region cost?               Compare, and note data transfer charges
        `,
      },
    },
    {
      heading: 'Estimating before you measure',
      paragraphs: [
        'A rough estimate helps you decide whether a region change is worth testing. Light in fiber covers about 200 kilometers in one millisecond, so a round trip over 2,000 kilometers adds at least 20 milliseconds before any processing. This is a physical floor, not a promise, because real routes are longer than straight lines.',
        'After the estimate, measure the real response time from the places your users are. A measurement from your office can look fast while customers far away wait. Test from several locations, and compare the numbers before and after a change. Use the same test each time, so the comparison is fair.',
      ],
      example: {
        language: 'python',
        runnable: true,
        filename: 'latency_floor.py',
        code: code`
          distance_km = 2000
          km_per_ms = 200
          round_trip_ms = 2 * distance_km / km_per_ms
          print(round_trip_ms)
        `,
        output: '20.0',
      },
    },
  ],
  seeItInAction: {
    title: 'Estimating the distance floor for a round trip',
    intro: 'This program estimates the least delay that distance can add to one round trip. It is a floor, so real delays are higher. Run it, then compare the result with a measurement from a test that you run from the same distance.',
    example: {
      language: 'python',
      runnable: true,
      filename: 'latency_floor.py',
      code: code`
        distance_km = 2000
        km_per_ms = 200
        round_trip_ms = 2 * distance_km / km_per_ms
        print(round_trip_ms)
      `,
      output: '20.0',
    },
    steps: [
      { code: 'distance_km = 2000', explanation: 'The one-way distance between the user and the data center, in kilometers. Use a real estimate for your users.' },
      { code: 'km_per_ms = 200', explanation: 'A rough speed for signals in fiber, about 200 kilometers per millisecond. The real speed varies with the cable.' },
      { code: 'round_trip_ms = 2 * distance_km / km_per_ms', explanation: 'A request travels there and back, so the distance counts twice.' },
      { code: 'print(round_trip_ms)', explanation: 'Prints 20.0 milliseconds. Real routes are longer and add routing and processing time on top of this floor.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the distance to 6000 kilometers and predict the new floor before you run the program.',
      'List where your users are, then choose a region for your project. Write the reason in one sentence.',
      'Measure the response time of a public website from two different locations, if you can, and compare the numbers with the floor estimate.',
    ],
  },
  mistakes: [
    { mistake: 'Choosing the default region without checking where users are.', fix: 'Compare your users\' locations with each region before you deploy.' },
    { mistake: 'Testing latency only from the office where the app was built.', fix: 'Measure from the places your users are, and from more than one location.' },
    { mistake: 'Blaming the distance for every slow response.', fix: 'Check the database and the server work as well. Distance is only one part of the delay.' },
  ],
  quiz: [
    {
      question: 'Your users are mostly in one country, and your app is hosted on another continent. What is the most likely effect on latency?',
      options: [
        { text: 'Each request takes longer, because the distance adds delay', explanation: 'Yes. Distance adds time to every round trip, before any processing begins.' },
        { text: 'Latency is unaffected, because the cloud is everywhere', explanation: 'The cloud does not remove distance. Each region is a physical place.' },
        { text: 'Latency falls, because the data travels faster over long distances', explanation: 'Data does not travel faster over longer distances.' },
        { text: 'Only the database is affected', explanation: 'The network and the server both add delay. The distance affects every round trip.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print?',
      code: { language: 'python', runnable: true, code: code`
        distance_km = 1000
        km_per_ms = 200
        print(2 * distance_km / km_per_ms)
      ` },
      options: [
        { text: '10.0', explanation: 'Yes. The round trip covers 2000 kilometers, and 2000 divided by 200 is 10.0.' },
        { text: '5.0', explanation: 'That counts only one way. A request travels there and back.' },
        { text: '1000', explanation: 'That is the one-way distance, not the time in milliseconds.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'A data rule requires customer records to stay in one country. How does that affect the region choice?',
      options: [
        { text: 'The region must be in that country, even if it is farther from some users', explanation: 'Yes. A legal rule can outweigh latency, so the region must meet it.' },
        { text: 'Any region is fine, because latency is the only factor', explanation: 'Latency is one factor. A data rule can be a hard requirement.' },
        { text: 'The rule only affects the cost, not the region', explanation: 'The rule affects which regions you may use, not just the price.' },
        { text: 'The rule means you must use IaaS', explanation: 'A data rule does not choose the service model.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Choose a region near your users that meets your data rules, and measure real response times from where your users are, because distance sets a floor that no setting can remove.',
  resources: [
    { title: 'Regions and Availability Zones', provider: 'Amazon Web Services', description: 'An explanation of regions, availability zones, and how to choose a location for an application.', url: 'https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/regions-and-availability-zones.html' },
  ],
}

export default lesson
