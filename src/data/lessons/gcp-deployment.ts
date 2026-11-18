import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud networking, the notes bucket and service account from lessons 2 and 3, and the Docker lesson from Software Engineering, with Docker Desktop running. Set the track variables plus `SA`.',
  goals: [
    'Push Study Tracker\'s image to a private Artifact Registry repository',
    'Run it on Cloud Run with its own service account instead of passwords or keys',
    'Reach the running app over HTTPS and explain where its data lives for now',
  ],
  bigIdea: "Deploying a container takes a registry that stores the image and a service that runs it. Artifact Registry stores Study Tracker's image privately, and Cloud Run runs it with an HTTPS address and automatic scaling, down to zero when nobody is using it. The app runs as its own service account, so no password or key appears anywhere.",
  whyItMatters: "Until now Study Tracker has run only on your own computer. After this lesson it has a public HTTPS address that anyone you share it with can open, built from the same image you tested locally. That is when a project becomes a service, and when cost and security start to matter every hour, which is why the project, identity and network came first.",
  goalSections: [
    {
      heading: 'A private repository for the image',
      paragraphs: [
        "Artifact Registry stores container images and other packages in repositories. A Docker repository in `us-central1` has the address `us-central1-docker.pkg.dev/` followed by your project ID and the repository name. Only identities with a role on it can pull or push.",
        "`gcloud auth configure-docker` tells Docker to sign in to that address with your Google login, so no registry password is ever created. Images get a tag, such as `v1`, and each new version gets a new tag, so you always know exactly which build is running.",
        "Cloud Run machines use Intel and AMD processors, while many laptops now use ARM processors. `docker build --platform linux/amd64` builds an image Cloud Run can run, whatever your laptop uses.",
      ],
      example: {
        language: 'text',
        code: code`
          us-central1-docker.pkg.dev/study-tracker-jd4821/study-tracker/study-tracker:v1
          |--------- registry -----| |----- project ----| |- repo --| |-- image --| |tag|
        `,
      },
    },
    {
      heading: 'Cloud Run and its service account',
      paragraphs: [
        "A Cloud Run service runs an image as revisions: every deployment creates a new, unchangeable revision, and traffic moves to it once it is ready. If a revision fails to start, the old one keeps serving, which makes deployments safe to try.",
        "`--service-account` sets the identity the app's code runs as, here `study-tracker`, which can read the notes bucket and nothing else. Without it, Cloud Run would use the project's default compute service account, which often holds the broad Editor role.",
        "`--allow-unauthenticated` makes the service public, so browsers can reach it without signing in to Google. Settings such as `NOTES_BUCKET` are passed as environment variables, as in Configuration and Secrets.",
      ],
      example: {
        language: 'text',
        code: code`
          Who               Identity                          Can do
          You, deploying    your Google account (Owner)       create the service, act as study-tracker
          Cloud Run itself  Google's service agent            pull the image from Artifact Registry
          Study Tracker     study-tracker service account     read the notes bucket
        `,
      },
    },
    {
      heading: 'Where the data lives, for now',
      paragraphs: [
        "The deployed app still saves sessions in SQLite, inside the instance's own file system. Cloud Run scales to zero when there is no traffic, and every new revision starts fresh instances, so saved sessions disappear surprisingly quickly. Two instances would also each have their own separate database.",
        "That is acceptable for a first deployment, and lesson 9 fixes it by moving the data to Cloud SQL. The notes are already safe, because they come from the bucket.",
        "Scaling to zero also means an idle app costs very little, and the first request after a quiet period waits a few seconds while an instance starts, called a cold start. `--max-instances 2` caps how far it can scale, which also caps the cost.",
      ],
      example: {
        language: 'text',
        code: code`
          Data          Lives in                       Survives a new revision or scale to zero?
          Notes         gs://study-notes-jd4821        yes
          Sessions      SQLite inside the instance     no: fixed in lesson 9
          The image     Artifact Registry              yes
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying Study Tracker to Cloud Run',
    intro: "Run these from your `study-tracker` folder, with Docker Desktop running and the Google Cloud version of `sync_notes.py` from lesson 3. In PowerShell, set variables as `$NAME = ...`. The deploy command takes a minute or two.",
    example: {
      language: 'bash',
      code: code`
        gcloud services enable artifactregistry.googleapis.com run.googleapis.com
        gcloud artifacts repositories create study-tracker --repository-format docker --location $REGION --description "Study Tracker images" --labels project=study-tracker
        gcloud auth configure-docker $REGION-docker.pkg.dev
        REGISTRY=$REGION-docker.pkg.dev/$PROJECT_ID/study-tracker
        docker build --platform linux/amd64 -t $REGISTRY/study-tracker:v1 .
        docker push $REGISTRY/study-tracker:v1

        gcloud run deploy study-tracker --image $REGISTRY/study-tracker:v1 --region $REGION --service-account $SA --allow-unauthenticated --port 8000 --set-env-vars LOG_LEVEL=INFO,NOTES_BUCKET=study-notes-$SUFFIX --min-instances 0 --max-instances 2 --labels project=study-tracker
        gcloud run services describe study-tracker --region $REGION --format "value(status.url)"
      `,
      output: 'https://study-tracker-123456789012.us-central1.run.app',
    },
    steps: [
      { code: 'gcloud auth configure-docker $REGION-docker.pkg.dev', explanation: "Adds a credential helper to Docker's settings, so `docker push` signs in with your Google login. Nothing is typed or stored as a password." },
      { code: 'docker build --platform linux/amd64 -t $REGISTRY/study-tracker:v1 .', explanation: "Builds the image for the processors Cloud Run uses, tagged with the repository's address and `v1`." },
      { code: '--service-account $SA', explanation: "The app runs as `study-tracker`, which can read the notes bucket. It never uses your own account or the broad default service account." },
      { code: '--port 8000', explanation: "Study Tracker's Dockerfile starts Uvicorn on port 8000, so Cloud Run sends requests there." },
      { code: '--min-instances 0 --max-instances 2', explanation: "Scales to zero when idle and to two instances at most under load." },
      { code: 'https://study-tracker-123456789012.us-central1.run.app', explanation: "Your app's address will look like this, with your project number. Open it with `/docs` on the end." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above and open your app\'s `/docs`. Save a session and read it back with `GET /sessions`.',
      'Push a `v2` image after a small change to `app.py`, then run `gcloud run services update study-tracker --region $REGION --image $REGISTRY/study-tracker:v2`. List revisions with `gcloud run revisions list --service study-tracker --region $REGION` and check whether your session survived.',
      'In the console, open Cloud Run, then `study-tracker`, and look at its Revisions, Logs and Security tabs.',
      'Clean up: an idle Cloud Run service scales to zero and costs very little, so keep it for the next lessons. Stored images cost a little each month. To remove both, run `gcloud run services delete study-tracker --region $REGION --quiet` and `gcloud artifacts repositories delete study-tracker --location $REGION --quiet`.',
    ],
  },
  mistakes: [
    { mistake: 'Deploying without `--service-account`.', fix: 'Always name the app\'s own service account, so it never runs with the default account\'s broad roles.' },
    { mistake: 'Building on an ARM laptop without `--platform linux/amd64`.', fix: 'Add the flag, or Cloud Run rejects the image because it does not support that processor type.' },
    { mistake: 'Reusing the same tag, such as `latest`, for every build.', fix: 'Give each build a new tag, so you know exactly what runs and can roll back to an earlier one.' },
    { mistake: 'Storing data inside the instance.', fix: 'Instances start and stop freely. Keep data in Cloud SQL or Cloud Storage, which lesson 9 sets up.' },
  ],
  quiz: [
    {
      question: 'Cloud Run refuses your image, saying the container must support amd64/linux. You built it on a Mac with an Apple processor. What is the most likely fix?',
      options: [
        { text: 'Give the service more memory', explanation: 'Memory does not change the processor type the image was built for.' },
        { text: 'Rebuild with `docker build --platform linux/amd64` and push it again', explanation: 'Apple processors are ARM. Cloud Run needs an amd64 image.' },
        { text: 'Make the repository public', explanation: 'Visibility does not affect the image format.' },
        { text: 'Use a different region', explanation: 'Every region uses the same processor types for Cloud Run.' },
      ],
      answer: 1,
    },
    {
      question: 'Which identity does Study Tracker\'s own code use when it reads the notes bucket on Cloud Run?',
      options: [
        { text: 'Your Google account, because you deployed it', explanation: 'Deploying does not hand your identity to the app.' },
        { text: 'Cloud Run\'s service agent', explanation: 'The service agent pulls images. It is not the app\'s identity.' },
        { text: 'An API key stored in the image', explanation: 'There is no key anywhere in this setup.' },
        { text: 'The `study-tracker` service account named with `--service-account`', explanation: 'The app\'s code receives short-lived tokens for that account.' },
      ],
      answer: 3,
    },
    {
      question: 'You save sessions in the deployed app. The next morning, after a quiet night, they are gone. Why?',
      options: [
        { text: 'Cloud Run scaled to zero, and the sessions were in SQLite inside the stopped instance', explanation: 'Each instance\'s file system disappears with it. Lesson 7 moves the data to Cloud SQL.' },
        { text: 'The budget deleted them', explanation: 'Budgets never delete anything.' },
        { text: 'The service account cannot write to SQLite', explanation: 'SQLite is a local file, not a Google Cloud resource controlled by IAM.' },
        { text: 'Artifact Registry deleted the image', explanation: 'The image is still there, and the data was never in it.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Push versioned, amd64 images to Artifact Registry, run them on Cloud Run with the app\'s own service account and a cap on instances, and keep data out of the instance, because it starts and stops at any time.',
  resources: [
    { title: 'Deploy container images to Cloud Run', provider: 'Google Cloud Documentation', description: 'Deploying images, revisions and service settings.', url: 'https://docs.cloud.google.com/run/docs/deploying' },
    { title: 'Push and pull images with Artifact Registry', provider: 'Google Cloud Documentation', description: 'Repositories, addresses and Docker credential setup.', url: 'https://docs.cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling' },
    { title: 'Service identity for Cloud Run', provider: 'Google Cloud Documentation', description: 'Why each service should use its own service account.', url: 'https://docs.cloud.google.com/run/docs/securing/service-identity' },
    { title: 'Allowing public access', provider: 'Google Cloud Documentation', description: 'What `--allow-unauthenticated` grants, and alternatives.', url: 'https://docs.cloud.google.com/run/docs/authenticating/public' },
  ],
  underTheHood: {
    heading: 'What happens when a request reaches Cloud Run',
    paragraphs: [
      "Your service's address points at Google's global front end, the same network that serves Google's own sites. It ends the HTTPS connection with a certificate Google manages, then checks whether the caller may invoke the service. With `--allow-unauthenticated`, everyone may.",
      "Cloud Run then looks for an instance of the current revision with spare capacity. Each instance handles many requests at once, so usually one is free. If none is running, because the service scaled to zero, Cloud Run starts one from your image, waits until it listens on port 8000, and only then forwards the request. That wait is the cold start.",
      "After a period with no requests, idle instances are shut down. Their memory and file system disappear with them, which is why the app must keep nothing it cares about locally. Each instance runs in its own sandbox, isolated from every other customer's code on the same machine.",
    ],
  },
}

export default lesson
