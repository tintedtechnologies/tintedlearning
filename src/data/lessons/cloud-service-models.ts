import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Name the three common cloud service models: IaaS, PaaS, and SaaS',
    'Sort a set of tasks by the layer that the provider manages and the layer you manage',
    'Choose the least managed model that still meets your needs',
  ],
  bigIdea: 'A cloud service model describes how much of the stack the provider runs and how much you run. Infrastructure as a service gives you machines, platform as a service gives you a runtime, and software as a service gives you a finished application. Each step up means less work for you and less control.',
  whyItMatters: 'A small team wants to launch a web app. One member proposes renting raw servers and installing everything, which takes weeks and needs patching every month. Another proposes a platform that runs the code for them, which takes days. Knowing the service models lets the team choose the level of work they can keep up with, instead of the level that sounds most impressive.',
  goalSections: [
    {
      heading: 'The three service models',
      paragraphs: [
        'Infrastructure as a service, or IaaS, gives you virtual machines, storage, and networks. You install the operating system, the runtime, and the application, and you keep them patched. Platform as a service, or PaaS, runs your code on a managed runtime, so you handle the application and its data. Software as a service, or SaaS, is a finished application you use, such as email or a document editor.',
        'The boundary moves with each model. In IaaS, the provider runs the physical hardware and the virtualization. In PaaS, the provider also runs the operating system and the runtime. In SaaS, the provider runs nearly everything, and you manage only your data and your settings.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Layer                 IaaS         PaaS         SaaS
          Application code      You         You          Provider
          Data                  You         You          You (your records)
          Runtime and OS        You         Provider     Provider
          Virtual machines      Provider    Provider     Provider
          Hardware and network  Provider    Provider     Provider
        `,
      },
    },
    {
      heading: 'Sorting tasks by who runs them',
      paragraphs: [
        'Pick a task and ask who runs it in each model. Applying a security patch to the operating system is your job in IaaS, the provider\'s job in PaaS, and the provider\'s job in SaaS. Backing up your database is usually your job in every model, because the data is yours even when the service is not.',
        'Writing this table for your own project makes the work visible. Share the table with the people who will be on call, so everyone knows which tasks are theirs. Each row is a task, and each column names the party who owns it. Rows where you own everything are the ones that will take your time, so they deserve the most thought before you choose.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Task                       IaaS          PaaS          SaaS
          Patch the operating system You           Provider      Provider
          Scale the number of copies You           Provider      Provider
          Back up your data          You           You           You
          Configure the application  You           You           Provider settings
        `,
      },
    },
    {
      heading: 'Choosing the least managed model that fits',
      paragraphs: [
        'Start with the least managed model that can do the job. If a finished application meets the need, SaaS avoids most of the operational work. If you need your own code and a standard runtime, PaaS is often the right balance. Choose IaaS when you need control that the other models do not offer, such as a special operating system setting.',
        'More control also means more responsibility. Every choice you make in IaaS becomes something you must patch, monitor, and recover. Before you move down a level, estimate who will do that work, and whether they have time for it every month.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Need                                        Start with
          A ready application for a common task      SaaS
          Your own web app on a standard runtime     PaaS
          A special operating system or driver       IaaS
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Sorting one task across the three models',
    intro: 'This table follows one task, patching the operating system, across the three service models. The answer changes with the model, and the table shows who must act in each case. Read the row, then check which column you would pick for a small team with no operations staff.',
    example: {
      language: 'text',
      runnable: false,
      code: code`
        Task: patch the operating system

        IaaS: You patch the machine. Schedule the update, test it, and apply it.
        PaaS: The provider patches the runtime. Check your app still works after the update.
        SaaS: The provider patches the whole application. Nothing for you to do.
      `,
    },
    steps: [
      { code: 'IaaS: You patch the machine.', explanation: 'The machine is yours, so the patch is your job. The provider only keeps the hardware running.' },
      { code: 'PaaS: The provider patches the runtime.', explanation: 'The provider owns the operating system under your app. You still check that your code behaves correctly after the update.' },
      { code: 'SaaS: The provider patches the whole application.', explanation: 'The provider owns the application and everything under it, so the patch is not your task.' },
      { code: 'Read the row across the models.', explanation: 'The more managed the model, the fewer patch tasks land on your team. For a small team, that is often the deciding factor.' },
    ],
  },
  tryIt: {
    instructions: [
      'Pick one application you use, such as an email service. Name its service model, and write who patches it.',
      'Make a table with five tasks for your own project, such as patching, scaling, backups, and monitoring. Mark who owns each task in IaaS and PaaS.',
      'Choose a model for your project, and write one sentence that explains the trade-off you accepted.',
    ],
  },
  mistakes: [
    { mistake: 'Assuming the provider handles backups and data safety in every model.', fix: 'Assume your data is your responsibility in all three models, and plan backups for it.' },
    { mistake: 'Choosing IaaS because it sounds more flexible, without a team to maintain it.', fix: 'Start with the least managed model that fits, and move down only when you have a clear need.' },
    { mistake: 'Confusing the service model with the location of the servers.', fix: 'Ask who runs each layer. The location of the hardware is a separate question.' },
  ],
  quiz: [
    {
      question: 'Your team wants to run its own application code on a managed runtime, without managing the operating system. Which model fits best?',
      options: [
        { text: 'PaaS', explanation: 'Yes. PaaS runs your code on a managed runtime, so the provider handles the operating system.' },
        { text: 'IaaS', explanation: 'IaaS leaves the operating system to you, which is more work than the team asked for.' },
        { text: 'SaaS', explanation: 'SaaS is a finished application, so it does not run your own code.' },
        { text: 'On-premises hardware', explanation: 'That is not a cloud service model. It is running your own equipment.' },
      ],
      answer: 0,
    },
    {
      question: 'In which model does the provider manage the entire application, leaving you with your data and settings?',
      options: [
        { text: 'SaaS', explanation: 'Yes. In SaaS the provider runs the application, and you manage your data and configuration.' },
        { text: 'IaaS', explanation: 'In IaaS you manage the operating system and the application.' },
        { text: 'PaaS', explanation: 'In PaaS you still manage your application code and its data.' },
        { text: 'None of them', explanation: 'SaaS is one of the three models, and it matches this description.' },
      ],
      answer: 0,
    },
    {
      question: 'Which task is usually yours in every service model?',
      options: [
        { text: 'Backing up your data', explanation: 'Yes. The data belongs to you, so you plan its backups even when the service is managed.' },
        { text: 'Replacing failed physical hardware', explanation: 'The provider replaces hardware in every model.' },
        { text: 'Patching the hypervisor', explanation: 'The provider patches the hypervisor in every model.' },
        { text: 'Keeping the data center powered', explanation: 'The provider runs the data center in every model.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Choose the least managed service model that meets your needs, because each step toward control adds patching, monitoring, and recovery work that your team must keep up with.',
  resources: [
    { title: 'What is cloud computing?', provider: 'Microsoft Learn', description: 'An overview of the cloud service models and the shared responsibility for each layer.', url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/overview/cloud-computing' },
  ],
}

export default lesson
