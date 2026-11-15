import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Choose between object storage, a disk and a database for a kind of data',
    'Pick a virtual machine size from how much processing and memory an app needs',
    'Keep data off the server so the server can be replaced or copied safely',
  ],
  bigIdea: "Every app needs somewhere to run and somewhere to keep its data. In the cloud those are separate things you rent: compute, meaning processing power, and storage, meaning places to keep data. Keeping them separate, so no important data lives only on a server, is what makes cloud apps easy to recover and grow.",
  whyItMatters: "A photo-sharing site stores every uploaded photo on its single web server's own disk. Traffic grows, so the team adds a second server, and now half the photos are \"missing\" depending on which server a visitor reaches. Then the first server fails and its photos are gone for good. Putting photos in the right kind of storage from the start avoids both problems.",
  goalSections: [
    {
      heading: 'Three kinds of storage',
      paragraphs: [
        "Object storage keeps whole files, called objects, such as photos, videos, backups and documents, in containers called buckets. You save and fetch each file over the internet by its name. It is cheap, almost endless and very durable, because the provider keeps several copies. Examples are Amazon S3, Azure Blob Storage and Google Cloud Storage.",
        "Block storage is a virtual hard disk attached to one server. It is fast and works like the drive in your laptop, so operating systems and programs run from it. Usually only one server can use it at a time.",
        "A database stores structured records, like customers and orders, and lets you search and update them quickly and safely, even with many users at once. A managed database is one the provider runs, patches and backs up for you.",
      ],
      example: {
        language: 'text',
        code: code`
          Data                               Best fit
          Profile photos and videos          object storage
          The server's operating system      block storage (a disk)
          Customer accounts and orders       database
          Nightly backup files               object storage
        `,
      },
    },
    {
      heading: 'Virtual machines and their sizes',
      paragraphs: [
        "A virtual machine, or VM, is a rented computer in the cloud with its own operating system. You choose its size from a menu: how many virtual processors, called vCPUs, and how much memory, measured in gigabytes (GB).",
        "Processors do the thinking, and memory holds what the computer is working on right now. A busy website with many simple requests needs more vCPUs. An app that loads large data into memory, like a reporting tool, needs more memory. Bigger sizes cost more per hour, roughly in proportion.",
        "Start small and measure. The cloud lets you resize later, so guessing big wastes money from day one. If processor use stays above about 80% at busy times, size up.",
      ],
      example: {
        language: 'text',
        code: code`
          Size       vCPUs   Memory   Rough cost   Good for
          small      2       4 GB     $30/month    a small website or test app
          medium     4       16 GB    $120/month   a busy site, a small database
          large      16      64 GB    $480/month   heavy data processing
        `,
      },
    },
    {
      heading: 'Keeping servers stateless',
      paragraphs: [
        "State is information an app needs to remember: uploaded files, user accounts, shopping carts. A server is called stateless when it keeps no important state on itself, and stores it instead in object storage or a database.",
        "Stateless servers are interchangeable. If one fails, start a new one and nothing is lost. If traffic doubles, run two identical servers behind a single address, and every visitor sees the same data, because both read from the same shared storage.",
        "This is the most important habit in cloud design: treat servers as replaceable, and protect the storage instead, with backups and copies in more than one zone.",
      ],
      example: {
        language: 'text',
        code: code`
          Stateful (fragile)                  Stateless (robust)
          photos saved on server 1's disk     photos saved in object storage
          server 2 cannot see them            every server reads the same bucket
          server 1 dies -> photos lost        any server dies -> start another
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Redesigning the photo-sharing site',
    intro: "Here is how the photo site from the start of the lesson could be rebuilt so it survives failures and can grow. Each line is one choice.",
    example: {
      language: 'text',
      code: code`
        1. Photos       -> object storage bucket, copied across zones
        2. Users, likes -> managed database with daily backups
        3. Web servers  -> two small VMs, no photos stored on them
        4. Server disks -> only the operating system and app code
        5. Busy evenings -> add a third VM, remove it after midnight
      `,
    },
    steps: [
      { code: '1. Photos -> object storage bucket', explanation: "Files of any size, stored cheaply and durably, and reachable by every server. Photos survive any server failing." },
      { code: '2. Users, likes -> managed database', explanation: "Structured records that change constantly belong in a database. The provider handles updates and backups." },
      { code: '3. Web servers -> two small VMs, no photos stored on them', explanation: "The servers are now stateless, so either one can handle any request, and losing one loses nothing." },
      { code: '4. Server disks -> only the operating system and app code', explanation: "Block storage still has a job: running the server. Everything on it can be rebuilt from the app's code." },
      { code: '5. Busy evenings -> add a third VM', explanation: "Because servers hold no state, adding or removing one is safe. You pay for the extra server only while it runs." },
    ],
  },
  mistakes: [
    { mistake: 'Saving user uploads on the web server\'s own disk.', fix: 'Send uploads to object storage, so every server can reach them and they outlive any one server.' },
    { mistake: 'Choosing the largest VM size to be safe.', fix: 'Start small, watch processor and memory use, and resize when the numbers show a need.' },
    { mistake: 'Using object storage like a database for records that change constantly.', fix: 'Object storage is for whole files. Use a database for records you search, update and change together.' },
  ],
  quiz: [
    {
      question: 'A video course platform needs to store 20,000 lesson videos. Which storage fits best?',
      options: [
        { text: 'A database table with one row per video file', explanation: 'Databases are built for structured records, not large files. Store the video\'s details there, and the file elsewhere.' },
        { text: 'The web server\'s disk', explanation: 'Other servers could not reach the videos, and they would be lost if the server failed.' },
        { text: 'Object storage', explanation: 'Large files, read often and changed rarely, are exactly what object storage is made for.' },
        { text: 'The server\'s memory', explanation: 'Memory is cleared when the server restarts, and costs far more per gigabyte.' },
      ],
      answer: 2,
    },
    {
      question: 'A small reporting app is slow, and monitoring shows memory is always full while processor use stays at 15%. What should you change?',
      options: [
        { text: 'Pick a size with more memory', explanation: 'Memory is the bottleneck. Extra processors would sit idle.' },
        { text: 'Pick a size with more vCPUs', explanation: 'At 15% use, the processors are not the problem.' },
        { text: 'Add more disk space', explanation: 'Disk space and memory are different. The full resource is memory.' },
        { text: 'Move the app to object storage', explanation: 'Object storage stores files. It cannot run an app.' },
      ],
      answer: 0,
    },
    {
      question: 'Why is a stateless web server easier to recover when it fails?',
      options: [
        { text: 'Stateless servers never fail', explanation: 'They fail like any other server. The difference is what is lost when they do.' },
        { text: 'The provider repairs stateless servers for free', explanation: 'The provider handles hardware either way. Stateless is about where your data lives.' },
        { text: 'It keeps a copy of all data in its memory', explanation: 'That would make it stateful, and memory is lost when a server stops.' },
        { text: 'Nothing important is stored on it, so a new identical server can replace it immediately', explanation: 'The data lives in shared storage, so replacing the server loses nothing.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Put files in object storage, records in a database and only the operating system on server disks, so servers stay stateless and can be replaced, resized or added at any time.',
  resources: [
    { title: 'What is cloud storage?', provider: 'Google Cloud', description: 'A plain explanation of object, block and file storage.', url: 'https://cloud.google.com/learn/what-is-cloud-storage' },
    { title: 'Choose an Azure compute service', provider: 'Microsoft Learn', description: 'A decision guide for virtual machines, containers and serverless.', url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree' },
  ],
  underTheHood: {
    heading: 'How object storage keeps your files safe',
    paragraphs: [
      "Object storage services often advertise eleven nines of durability: 99.999999999%. That means if you stored ten million files, you might expect to lose one every ten thousand years.",
      "They achieve this by never keeping just one copy. When you upload a file, it is split into pieces and stored across many disks in several separate data centers. Some services use a technique called erasure coding: they add extra calculated pieces, so the original can be rebuilt even if several disks fail at once.",
      "Background processes constantly check every piece for damage and repair it from the others. Durability is not the same as backup, though. If you delete a file by mistake, the service faithfully deletes every copy. Turning on versioning, which keeps old versions of changed or deleted files, protects against your own mistakes.",
    ],
  },
}

export default lesson
