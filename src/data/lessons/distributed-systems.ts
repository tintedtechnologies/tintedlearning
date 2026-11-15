import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'System Design, Scalability and Reliability, especially queues, workers and idempotent operations.',
  goals: [
    'Explain why a call to another machine can fail in ways a function call cannot',
    'Choose between strong and eventual consistency for each kind of data',
    'Handle messages that arrive twice or out of order, using version numbers and idempotent processing',
  ],
  bigIdea: "A distributed system is one whose parts run on different machines and talk over a network. The network can delay, lose or duplicate messages, and from the outside a slow machine looks just like a dead one. Designing for that means accepting that parts may briefly disagree, and making every operation safe to receive twice or out of order.",
  whyItMatters: "In the university design, an upload goes to note storage, a job goes on a queue, and an index worker on another machine embeds the note. A student uploads a correction a minute later. If a worker finishes the second job before the first, the old version is indexed last, and the student's searches keep finding the mistake they already fixed. Nothing crashed, and every part did its job. The bug exists only because the parts run on different machines.",
  goalSections: [
    {
      heading: 'When the network is involved',
      paragraphs: [
        "A function call inside one program either returns or raises an error. A call to another machine has a third outcome: silence. When a request times out, you do not know whether it never arrived, arrived and failed, or succeeded but the reply was lost. The work may or may not have happened.",
        "This is called partial failure: some parts work while others do not, and no single part knows the full picture. A worker might save a note's embeddings and then crash before telling the queue it finished. The queue, seeing no confirmation, hands the job to another worker.",
        "Because of this, most queues promise at-least-once delivery: every job is delivered, sometimes more than once. Guaranteeing exactly once is not possible in general. The practical answer is to make processing idempotent, so handling the same job twice has the same effect as handling it once.",
      ],
      example: {
        language: 'text',
        code: code`
          The worker asks the database to save embeddings, then hears nothing.
          What really happened                    What the worker can see
          request lost on the way                 timeout
          database failed to save                 timeout
          saved, but the reply was lost           timeout
          saved, reply on its way, very slowly    timeout

          So: retry, and make sure saving twice does no harm.
        `,
      },
    },
    {
      heading: 'Consistency',
      paragraphs: [
        "Strong consistency means every read sees the latest write, as with one database and its transactions. Eventual consistency means copies may lag behind for a while but catch up if updates stop. Strong consistency is simpler to reason about. Eventual consistency lets parts keep working independently, faster and through failures.",
        "Choose per piece of data. A student who logs a session expects to see it at once, and a removed permission must take effect immediately: both need strong consistency. A note becoming searchable within a minute, or a teacher's class totals being a few minutes old, is fine as eventual consistency.",
        "A useful middle ground is read-your-own-writes: each user sees their own changes immediately, even if others see them a little later. When the network between parts breaks, a system must choose between answering with possibly stale data and refusing to answer until it can be sure. That trade-off is known as the CAP theorem.",
      ],
      example: {
        language: 'text',
        code: code`
          Data                                   Consistency needed
          A student's own sessions               strong: they just logged it
          Account access after removal           strong: must stop immediately
          Note search after an upload            eventual: within about a minute
          Teacher's class totals                 eventual: a few minutes old is fine
          Cached totals                          eventual: up to 60 seconds old
        `,
      },
    },
    {
      heading: 'Order and duplicates',
      paragraphs: [
        "Messages can arrive out of order. Two workers take two jobs, and the later job finishes first. Retries deliver an old message after a newer one. Timestamps do not fix this, because clocks on different machines never agree exactly.",
        "Instead, let the owner of the data number each change. When a note is uploaded, the database increases that note's version number and puts it in the job. When a worker saves the index, it only writes if its version is newer than the one already stored. An older job is ignored and a duplicate does nothing.",
        "This makes processing both order-proof and idempotent with one comparison. In SQL it is a conditional update, such as `UPDATE ... WHERE note_id = ? AND version < ?`, so the database itself rejects stale writes even when two workers race.",
      ],
      example: {
        language: 'python',
        code: code`
          index = {}


          def apply(job):
              note_id, version, text = job
              current = index.get(note_id, (0, None))[0]
              if version <= current:
                  return f"skip {note_id} v{version}: already have v{current}"
              index[note_id] = (version, text)
              return f"index {note_id} v{version}"


          jobs = [("bio", 2, "fixed text"), ("bio", 1, "old text"), ("bio", 2, "fixed text")]
          for job in jobs:
              print(apply(job))
          print(index)
        `,
        output: "index bio v2\nskip bio v1: already have v2\nskip bio v2: already have v2\n{'bio': (2, 'fixed text')}",
      },
    },
  ],
  seeItInAction: {
    title: 'Indexing notes across machines',
    intro: "Here is how the university version of Study Tracker handles a note upload, so that duplicates, crashes and out-of-order jobs all end with the latest version indexed.",
    example: {
      language: 'text',
      code: code`
        1. Upload    API stores the file, then in ONE database transaction:
                     notes.version = 2 for "bio"; outbox row: index job (bio, v2)
        2. Relay     a small process copies outbox rows onto the queue, then marks them sent
        3. Worker A  takes (bio, v2), embeds it, saves WHERE version < 2 -> saved
        4. Worker B  receives (bio, v2) again after a timeout -> nothing to save
        5. Worker C  finally gets the delayed (bio, v1) -> v1 < 2 -> skipped
        6. Student   sees "Indexing your latest changes..." until v2 is searchable
      `,
    },
    steps: [
      { code: 'in ONE database transaction', explanation: "The version increase and the job record are saved together, so either both happen or neither does. If the API saved the note and then crashed before sending the job, the note would never be indexed." },
      { code: 'outbox row: index job (bio, v2)', explanation: "This is the transactional outbox pattern: jobs are written to a table in the same database, then delivered separately. It turns \"save and send\" into one reliable step." },
      { code: '2. Relay ... then marks them sent', explanation: "If the relay crashes after sending but before marking, it sends the job again. That is fine, because the worker is idempotent." },
      { code: 'saves WHERE version < 2 -> saved', explanation: "The conditional write means the database checks the version itself, so even two workers saving at the same moment cannot store an older version over a newer one." },
      { code: '4. Worker B receives (bio, v2) again ... nothing to save', explanation: "At-least-once delivery produced a duplicate, and idempotent processing made it harmless." },
      { code: '6. Student sees "Indexing your latest changes..."', explanation: "Search is eventually consistent, so the app tells the student what is happening, a design form of read-your-own-writes." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the version example above, then add a job `("bio", 3, "newest text")` in the middle of the list. Predict the output before running it.',
      'List five kinds of data in the university Study Tracker and choose strong or eventual consistency for each, with a reason.',
      'Write down what could go wrong if the API saved a note and then sent the index job to the queue as two separate steps, and how the outbox prevents it.',
    ],
    evidencePrompt: {
      label: 'Your answers',
      placeholder: 'For example: With v3 in the middle, the final index holds v3, because the later v2 job is skipped. Sessions: strong, because...',
    },
  },
  mistakes: [
    { mistake: 'Treating a timeout as proof that nothing happened.', fix: 'Assume the work may have happened, and make the retry safe with idempotent operations.' },
    { mistake: 'Assuming each queued job is delivered exactly once.', fix: 'Expect duplicates, and make handling the same job twice harmless.' },
    { mistake: 'Ordering events across machines by their timestamps.', fix: 'Have the owner of the data assign version numbers, and compare versions.' },
    { mistake: 'Saving to the database and sending a message as two separate steps.', fix: 'Write the message to an outbox table in the same transaction, and deliver it from there.' },
  ],
  quiz: [
    {
      question: 'The index worker\'s request to save embeddings times out. What does the worker know for certain?',
      options: [
        { text: 'The save failed, so it is safe to retry without any precautions', explanation: 'The save may have succeeded with only the reply lost.' },
        { text: 'Nothing certain: the save may or may not have happened, so the retry must be safe to repeat', explanation: 'A timeout cannot tell a lost request from a lost reply. Idempotent saves make retrying safe either way.' },
        { text: 'The save succeeded, because databases are reliable', explanation: 'A timeout gives no evidence of success.' },
        { text: 'The database has crashed', explanation: 'It might simply be slow, or the network might have dropped a message.' },
      ],
      answer: 1,
    },
    {
      question: 'Which data in the university Study Tracker can safely be eventually consistent?',
      options: [
        { text: 'The list of sessions a student just logged, shown back to them', explanation: 'Students expect to see their own changes immediately.' },
        { text: 'Whether a student who left the course can still see class data', explanation: 'Removed access must take effect at once.' },
        { text: 'A student\'s login password', explanation: 'An old password continuing to work would be a security problem.' },
        { text: 'The teacher\'s class totals dashboard', explanation: 'Totals a few minutes old do no harm, so eventual consistency is fine.' },
      ],
      answer: 3,
    },
    {
      question: 'What does this code print?',
      code: {
        language: 'python',
        code: code`
          index = {}


          def apply(note_id, version, text):
              if version > index.get(note_id, (0, ""))[0]:
                  index[note_id] = (version, text)


          for job in [("bio", 1, "a"), ("bio", 3, "c"), ("bio", 2, "b")]:
              apply(*job)
          print(index["bio"][1])
        `,
      },
      options: [
        { text: 'c', explanation: 'Version 3 is stored second. The version 2 job arrives last but is older, so it is skipped.' },
        { text: 'b', explanation: 'That would happen if the last job always won. The version check prevents it.' },
        { text: 'a', explanation: 'Version 1 is replaced as soon as version 3 arrives.' },
        { text: 'A KeyError', explanation: '`index.get` returns a default for a missing note, so the first job works.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
  ],
  takeaway: 'Across machines, assume any call may silently fail or repeat, give each piece of data the consistency it really needs, and order changes with version numbers so duplicates and late arrivals do no harm.',
  resources: [
    { title: 'Challenges with distributed systems', provider: 'Amazon Builders\' Library', description: 'Why even a simple request between two machines has many ways to fail.', url: 'https://aws.amazon.com/builders-library/challenges-with-distributed-systems/' },
    { title: 'Transactional outbox', provider: 'microservices.io', description: 'The pattern for saving data and publishing a message reliably.', url: 'https://microservices.io/patterns/data/transactional-outbox.html' },
    { title: 'Fallacies of distributed computing', provider: 'Wikipedia', description: 'Eight false assumptions developers make about networks.', url: 'https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing' },
    { title: 'Designing Data-Intensive Applications', provider: 'Martin Kleppmann', description: 'A widely recommended book on consistency, replication and distributed data.', url: 'https://dataintensive.net/' },
  ],
  underTheHood: {
    heading: 'Why clocks cannot order events',
    paragraphs: [
      "Every machine's clock drifts slightly, and machines regularly correct themselves against time servers. Corrections can make a clock jump, sometimes backward. Two machines can easily disagree by several milliseconds, and after a bad correction by much more. So if two events on different machines happen 5 ms apart, their timestamps may record them in the wrong order.",
      "Ordering by timestamp, with the newest winning, can therefore silently keep the older value. That is why this lesson uses version numbers from a single owner: the database that stores the note is the only one counting, so its numbers are always in the right order.",
      "When there is no single owner, systems use logical clocks. In the simplest, called a Lamport clock, each machine keeps a counter, adds 1 for each event and sends the counter with every message. A machine receiving a message sets its own counter to the larger of the two, plus 1. The counters never measure time, but they guarantee that if one event could have caused another, the cause gets the smaller number.",
    ],
  },
}

export default lesson
