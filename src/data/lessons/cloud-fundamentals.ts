import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what the cloud is and how you pay for it',
    'Split the work between you and the cloud provider',
    'Use regions and zones to keep an app running when a data center fails',
  ],
  bigIdea: "The cloud means renting computers, storage and ready-made services from a company that runs huge data centers, instead of buying and running your own machines. You pay for what you use, often by the hour or the gigabyte. The provider looks after the buildings and hardware, but keeping your own app and data safe is still your job.",
  whyItMatters: "A small online bakery runs its website on one computer in the owner's back office. One weekend the power fails, the site goes dark, and a week of orders is lost because the only copy was on that machine. In the cloud, the same site can run in a professional data center with backups in another city, for a few dollars a month. But the owner still has to switch those backups on.",
  goalSections: [
    {
      heading: 'What the cloud is and how you pay',
      paragraphs: [
        "A data center is a large building full of computers, called servers, with backup power, cooling and security guards. Cloud providers such as Amazon Web Services (AWS), Microsoft Azure and Google Cloud run hundreds of them around the world and rent out the capacity.",
        "You rent through a website called the console, or through commands and code. A new server can be ready in about a minute, and switched off when you no longer need it. You pay only while it exists. This is called pay-as-you-go pricing, and it is the biggest difference from buying hardware.",
        "The flip side is that costs can surprise you. A forgotten test server keeps charging every hour. Setting a budget alert, an email when spending passes a limit, is one of the first things to do in any cloud account.",
      ],
      example: {
        language: 'text',
        code: code`
          Buying your own server            Renting in the cloud
          ----------------------            --------------------
          $3,000 up front                   about $0.05 an hour, about $36 a month
          weeks to order and set up         ready in about a minute
          you replace failed parts          the provider replaces hardware
          sits idle at night, still paid    switch it off, stop paying
        `,
      },
    },
    {
      heading: 'Who looks after what',
      paragraphs: [
        "Using the cloud does not mean the provider handles everything. The split is called the shared responsibility model. The provider is responsible for the cloud itself: buildings, power, physical machines and the network between data centers. You are responsible for what you put in the cloud: your data, your app's code and settings, and who is allowed to log in.",
        "Most cloud security failures happen on the customer's side, for example a storage folder accidentally set to public, or a weak password on an admin account. The provider gave you the lock. You still have to turn the key.",
        "The more managed a service is, the more the provider takes on. With a rented server you install updates yourself. With a managed database, the provider installs them, but you still decide who can read the data.",
      ],
      example: {
        language: 'text',
        code: code`
          Provider looks after              You look after
          --------------------              --------------
          buildings and power               your data and backups
          physical servers and disks        who can log in and what they can do
          the network between sites         your app's code and settings
          (managed services) software       public or private sharing settings
            updates on that service
        `,
      },
    },
    {
      heading: 'Regions and zones',
      paragraphs: [
        "Cloud data centers are grouped by location. A region is a geographic area, such as Frankfurt or Virginia. Each region contains several availability zones: separate data centers a few kilometers apart, with their own power and cooling, so a fire or flood in one should not affect the others.",
        "Choose a region close to your users, because data traveling a shorter distance arrives faster. Laws matter too: some countries require personal data to stay inside their borders.",
        "To survive a failure, run copies of your app in at least two zones. If one zone goes down, the other keeps serving. Copies in a second region protect against rarer events that affect a whole area, at extra cost.",
      ],
      example: {
        language: 'text',
        code: code`
          Region: Frankfurt (close to customers in Germany, data stays in the EU)
            Zone A: web server copy 1, main database
            Zone B: web server copy 2, standby database
          Zone A loses power -> Zone B keeps serving -> customers notice nothing
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Moving the bakery website to the cloud',
    intro: "Here is a simple plan for the bakery's site, written the way a cloud engineer would sketch it before building anything. Each line is one decision.",
    example: {
      language: 'text',
      code: code`
        1. Region: London, because most customers are in the UK
        2. Two small web servers, one in each of two zones
        3. Orders saved in a managed database with daily backups
        4. Backups copied to a second region, Dublin
        5. Owner logs in with a password plus a phone code
        6. Budget alert at $50 a month
      `,
    },
    steps: [
      { code: '1. Region: London', explanation: "Close to customers, so pages load quickly, and the data stays in the country the bakery operates in." },
      { code: '2. Two small web servers, one in each of two zones', explanation: "If one data center has a problem, the other server keeps the site up. Two small servers are often cheaper than one big one, and safer." },
      { code: '3. Orders saved in a managed database with daily backups', explanation: "The provider runs the database software and its updates. Turning on backups is still the owner's decision under shared responsibility." },
      { code: '4. Backups copied to a second region', explanation: "Protects against the rare event that affects all of London. This is what would have saved the lost week of orders." },
      { code: '5. Password plus a phone code', explanation: "Securing logins is always the customer's job. A second step, such as a code sent to a phone, stops most stolen-password attacks." },
      { code: '6. Budget alert at $50 a month', explanation: "Pay-as-you-go means mistakes cost money. An alert catches a forgotten server or a sudden spike early." },
    ],
  },
  mistakes: [
    { mistake: 'Assuming the provider backs up your data automatically.', fix: 'Check each service. Many keep nothing unless you switch backups on, and backups are your responsibility.' },
    { mistake: 'Running everything in a single zone.', fix: 'Put at least two copies of anything important in different zones, so one data center failing does not take you offline.' },
    { mistake: 'Leaving test resources running.', fix: 'Set a budget alert on day one, and delete anything you created for practice when you are done.' },
  ],
  quiz: [
    {
      question: 'A company\'s customer files leak because a cloud storage folder was set to public. Under shared responsibility, whose job was that setting?',
      options: [
        { text: 'The cloud provider\'s, because the files were on its servers', explanation: 'The provider secures the hardware. Sharing settings for your data are yours to set.' },
        { text: 'The company\'s, because it controls who can access its own data', explanation: 'Access settings for your data are always on the customer side of the split.' },
        { text: 'Nobody\'s, because public folders are a cloud default', explanation: 'Most providers now make storage private by default. Someone chose to make it public.' },
        { text: 'The internet provider\'s', explanation: 'The internet provider only carries traffic. It has no control over cloud storage settings.' },
      ],
      answer: 1,
    },
    {
      question: 'Your app runs in one availability zone. That zone loses power for two hours. What would have kept the app running?',
      options: [
        { text: 'A bigger server in the same zone', explanation: 'A bigger server in the same zone loses power too.' },
        { text: 'A faster internet connection', explanation: 'The problem is the data center, not the connection to it.' },
        { text: 'A second copy of the app in another zone of the same region', explanation: 'Zones have separate power, so a copy in another zone keeps serving while the first is down.' },
        { text: 'Moving the app to a region on another continent', explanation: 'That could work, but it adds delay for users. A second zone in the same region is the usual first step.' },
      ],
      answer: 2,
    },
    {
      question: 'Why can a cloud bill surprise new users?',
      options: [
        { text: 'Resources charge for as long as they exist, even when nobody is using them', explanation: 'Pay-as-you-go charges by time or usage, so forgotten resources keep costing money until deleted.' },
        { text: 'Cloud providers charge a large fee to open an account', explanation: 'Opening an account is usually free. Charges come from what you create.' },
        { text: 'Prices change every hour without warning', explanation: 'Prices are published and change rarely. Surprises come from what is left running.' },
        { text: 'You must pay for a whole year up front', explanation: 'Up-front plans exist as an option for discounts, but the default is paying as you go.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'The cloud lets you rent computing by the hour in professional data centers, but your data, logins and backups remain your responsibility, so plan for zones failing and set a budget alert.',
  resources: [
    { title: 'Shared responsibility model', provider: 'AWS', description: 'The provider\'s own diagram of who secures what.', url: 'https://aws.amazon.com/compliance/shared-responsibility-model/' },
    { title: 'Azure fundamentals', provider: 'Microsoft Learn', description: 'Free beginner modules on cloud concepts, regions and pricing.', url: 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/' },
  ],
  underTheHood: {
    heading: 'How one physical server becomes many rented ones',
    paragraphs: [
      "When you rent a server, you almost never get a whole physical machine. You get a virtual machine: a software imitation of a computer, with its own operating system, that runs alongside others on one large physical server.",
      "A layer of software called a hypervisor makes this possible. It divides the physical machine's processors, memory and disks into slices and gives each virtual machine its own slice, keeping them strictly separated so one customer cannot see another's memory.",
      "This is how providers rent out computing in small pieces by the hour. A physical server with 128 processor cores might host dozens of customers at once. It is also why a new server appears in a minute: nothing physical is installed, the hypervisor simply starts another virtual machine on hardware that is already running.",
    ],
  },
}

export default lesson
