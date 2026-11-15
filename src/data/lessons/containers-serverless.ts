import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what a container is and why it runs the same way everywhere',
    'Explain what a serverless function is and what you give up for its convenience',
    'Choose between a virtual machine, a container and a serverless function for a job',
  ],
  bigIdea: "A container packs an app together with everything it needs to run, so it behaves the same on a laptop and in the cloud. A serverless function goes further: you hand the provider a small piece of code, and it runs only when something triggers it, with no server for you to manage. Each option trades control for convenience in a different way.",
  whyItMatters: "A developer's app works perfectly on their laptop, then crashes on the company server because the server has a different Python version and is missing a library. The team loses a day finding out why. Packaging the app in a container, with the exact Python version and libraries inside, would have made \"works on my machine\" mean \"works everywhere\".",
  goalSections: [
    {
      heading: 'Containers: the app and its whole setup in one package',
      paragraphs: [
        "A container image is a package containing your app, the language runtime it needs (such as Python 3.12), its libraries and its settings. A container is that image running. Docker is the most common tool for building and running them.",
        "You describe the image in a short text file called a Dockerfile: start from a base image with Python, copy in the code, install the requirements, and say which command starts the app. Anyone who builds from that file gets an identical image.",
        "Containers are much lighter than virtual machines, because they share the host computer's operating system core instead of each running a full operating system. Many containers can run on one machine, and they start in seconds.",
      ],
      example: {
        language: 'text',
        code: code`
          # Dockerfile
          FROM python:3.12-slim
          WORKDIR /app
          COPY requirements.txt .
          RUN pip install -r requirements.txt
          COPY . .
          CMD ["python", "app.py"]
        `,
      },
    },
    {
      heading: 'Serverless functions: code that runs on demand',
      paragraphs: [
        "With serverless functions, such as AWS Lambda, Azure Functions or Google Cloud Run functions, you upload a single function and choose what triggers it: a web request, a new file in storage, or a timer. The provider runs it when triggered and stops it afterwards.",
        "There are still servers, but they are entirely the provider's problem. You pay only for the time your code runs, often measured in milliseconds, and nothing when it is idle. If a thousand requests arrive at once, the provider runs a thousand copies.",
        "The trade-offs: each run has a time limit, often 15 minutes or less. Nothing is kept between runs, so state must live in storage or a database. And a function that has not run recently may take a moment to start, which is called a cold start.",
      ],
      example: {
        language: 'python',
        runnable: false,
        code: code`
          # Runs each time a photo is uploaded to a storage bucket
          def handle_upload(event, context):
              file_name = event["name"]
              make_thumbnail(file_name)
              return {"status": "done", "file": file_name}
        `,
      },
    },
    {
      heading: 'Choosing how to run your code',
      paragraphs: [
        "Virtual machines give the most control: you choose the operating system and install anything. You also patch it, secure it and pay for it every hour, busy or not.",
        "Containers on a managed container service give a consistent package and fast scaling, with less to maintain than a VM. They suit web apps and services that run all day.",
        "Serverless functions need the least work and cost nothing when idle. They suit short tasks that happen now and then or in bursts, like resizing an uploaded photo or sending a nightly report. For a busy app running all day long, they can end up costing more than a container.",
      ],
      example: {
        language: 'text',
        code: code`
          Job                                         Good fit
          Old software that needs a specific OS       virtual machine
          A web app with steady traffic all day       container
          Resize each photo when it is uploaded       serverless function
          A report emailed once every night           serverless function
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Choosing how to run each part of a recipe website',
    intro: "A recipe site has four jobs to do. Here is how an engineer would decide where each one runs, and why.",
    example: {
      language: 'text',
      code: code`
        1. Main website, busy all day         -> container, 2 copies
        2. Resize recipe photos on upload     -> serverless function
        3. Weekly newsletter, Mondays at 8am  -> serverless function on a timer
        4. Video encoding, up to 2 hours each -> container job
        5. All state                          -> database and object storage
      `,
    },
    steps: [
      { code: '1. Main website, busy all day -> container, 2 copies', explanation: "Steady traffic means something is always running anyway. A container is consistent, cheap at steady load, and two copies survive one failing." },
      { code: '2. Resize recipe photos on upload -> serverless function', explanation: "Uploads come in bursts, then nothing for hours. A function costs nothing while idle and scales up for a busy hour automatically." },
      { code: '3. Weekly newsletter -> serverless function on a timer', explanation: "It runs for a few minutes once a week. Paying for a server all week to do this would be wasteful." },
      { code: '4. Video encoding, up to 2 hours each -> container job', explanation: "Two hours is longer than the time limit for most serverless functions, so a container that runs until the job is finished fits better." },
      { code: '5. All state -> database and object storage', explanation: "Containers and functions are both replaceable and keep nothing between runs, so everything that matters is stored outside them." },
    ],
  },
  mistakes: [
    { mistake: 'Saving files inside a running container or function and expecting them to stay.', fix: 'Anything written inside disappears when it stops. Save state to object storage or a database.' },
    { mistake: 'Using serverless functions for long-running jobs.', fix: 'Check the provider\'s time limit. Use a container for work that may take longer.' },
    { mistake: 'Building container images that install whatever versions are newest that day.', fix: 'Pin versions in the base image and in `requirements.txt`, so every build is identical.' },
  ],
  quiz: [
    {
      question: 'An app runs on a developer\'s laptop but fails on the server with a missing library error. How do containers prevent this?',
      options: [
        { text: 'Containers install every library that exists', explanation: 'An image contains only what its Dockerfile lists, which keeps it small and predictable.' },
        { text: 'Containers run faster, so errors do not happen', explanation: 'Speed has nothing to do with missing libraries.' },
        { text: 'The image includes the exact runtime and libraries, so the app gets the same setup everywhere', explanation: 'The app no longer depends on what happens to be installed on each machine.' },
        { text: 'Containers automatically fix code errors', explanation: 'Containers package code. They do not change or repair it.' },
      ],
      answer: 2,
    },
    {
      question: 'A task converts uploaded receipts to text. It takes 3 seconds and happens a few hundred times a day, at random times. What is the best fit?',
      options: [
        { text: 'A serverless function triggered by each upload', explanation: 'Short, occasional work triggered by an event is the classic serverless job, and you pay only for those few seconds.' },
        { text: 'A large virtual machine running all day', explanation: 'It would sit idle almost all the time while you pay for every hour.' },
        { text: 'A container job that runs for two hours each night', explanation: 'Users would wait until night for their receipts, and the timing does not match the work.' },
        { text: 'The user\'s own laptop', explanation: 'You cannot rely on users\' devices to run your back-end processing.' },
      ],
      answer: 0,
    },
    {
      question: 'Why is a serverless function a poor fit for a job that takes 90 minutes?',
      options: [
        { text: 'Serverless functions cannot read files', explanation: 'They can read files from storage. The problem is how long the job runs.' },
        { text: 'Serverless functions only run at night', explanation: 'They run whenever their trigger fires, at any time of day.' },
        { text: 'They always cost more than containers', explanation: 'For short, occasional work they are usually cheaper.' },
        { text: 'Most providers stop a function after a time limit, often 15 minutes or less', explanation: 'A 90-minute job would be cut off. A container or VM can run until the work is finished.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Containers package an app with its exact setup so it runs the same everywhere, serverless functions run short event-driven code with no server to manage, and the right choice depends on how long and how often the work runs.',
  resources: [
    { title: 'Docker overview', provider: 'Docker', description: 'What images and containers are, with a guided first example.', url: 'https://docs.docker.com/get-started/docker-overview/' },
    { title: 'What is serverless computing?', provider: 'Cloudflare', description: 'A short beginner explanation of serverless and its trade-offs.', url: 'https://www.cloudflare.com/learning/serverless/what-is-serverless/' },
  ],
  underTheHood: {
    heading: 'How a container is isolated without its own operating system',
    paragraphs: [
      "A virtual machine imitates a whole computer, including its own operating system. A container does not. All containers on a machine share the host's operating system core, called the kernel. They are just ordinary programs, fenced off from each other by two Linux features.",
      "Namespaces control what a process can see. Inside its namespaces, a container sees only its own files, its own list of running programs and its own network address, as if it were alone on the machine. Control groups, or cgroups, control what a process can use, such as a limit of one processor and 512 MB of memory.",
      "The image itself is built from layers, one per line of the Dockerfile. Layers that have not changed are reused from a cache, which is why rebuilding after a small code change is fast, and why copying `requirements.txt` before the rest of the code saves time.",
    ],
  },
}

export default lesson
