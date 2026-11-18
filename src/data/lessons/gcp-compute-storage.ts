import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { syncNotesGcp, testSyncNotesGcp } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Google Cloud identity and resource organization, with the `study-tracker` service account created. Set the track variables plus `SA`, the service account\'s email.',
  goals: [
    'Choose between Compute Engine, Cloud Run and GKE for a workload',
    'Choose between Cloud Storage, Persistent Disk and Filestore, and confirm a bucket is private',
    'Store Study Tracker\'s notes in Cloud Storage and give its service account read access to that bucket only',
  ],
  bigIdea: "Google Cloud offers compute at several levels: Compute Engine virtual machines you manage, Cloud Run, which runs containers for you and scales them to zero, and GKE, its managed Kubernetes. Storage comes in three shapes: Cloud Storage for files as objects, Persistent Disk for disks attached to one machine, and Filestore for shared file systems. For Study Tracker, that means Cloud Run for the app and Cloud Storage for the notes.",
  whyItMatters: "Study Tracker's notes have lived in a `notes` folder beside the code. In the cloud the app may run as several copies, started and stopped at any time, each with a disk that disappears when it stops. Notes saved there would differ between copies and vanish on restart. A Cloud Storage bucket gives every copy the same notes, kept safely in one place, and lets you control exactly who can read them.",
  goalSections: [
    {
      heading: 'Choosing compute on Google Cloud',
      paragraphs: [
        "Compute Engine rents virtual machines. You choose the operating system, apply updates and handle failures yourself, which suits special software or full control.",
        "Cloud Run runs a Docker image as a service with its own HTTPS address. It starts copies, called instances, as requests arrive and can scale to zero when nobody is using it, so an idle app costs little. Each instance can handle many requests at once, and Cloud Run adds instances as traffic grows. Lesson 5 deploys Study Tracker there. GKE, Google Kubernetes Engine, offers more control and more to manage, which lesson 10 weighs up.",
        "Cloud Run functions run a single function when something triggers it, such as a schedule, which suits small jobs like the weekly summary in lesson 11.",
      ],
      example: {
        language: 'text',
        code: code`
          Option           You manage                     Fits Study Tracker?
          Compute Engine   the operating system, updates  no: more work than needed
          Cloud Run        the image and its settings     yes: the web API
          GKE              Kubernetes resources, upgrades only to learn Kubernetes (lesson 10)
          Cloud Run functions  one function's code        yes: the weekly job (lesson 11)
        `,
      },
    },
    {
      heading: 'Choosing storage, and keeping a bucket private',
      paragraphs: [
        "Cloud Storage keeps files as objects in buckets, reached over HTTPS by name, such as `biology.md`. Persistent Disk provides disks for one Compute Engine machine, and Filestore is a shared file system several machines can mount. Databases are a separate choice, covered in lesson 9.",
        "Bucket names are unique worldwide, so this track uses `study-notes-` plus your suffix. Two settings keep a bucket private. Uniform bucket-level access means only IAM controls access, with no per-object exceptions. Public access prevention blocks any grant to `allUsers`, the whole internet, even by mistake.",
        "Cloud Storage encrypts every object at rest automatically, with keys Google manages. Lesson 12 explains the alternatives.",
      ],
      example: {
        language: 'text',
        code: code`
          gs://study-notes-jd4821              location us-central1
            uniform bucket-level access       on: IAM only
            public access prevention          enforced: never public
            biology.md, algebra.md, history.md
            study-tracker service account     Storage Object Viewer, this bucket only
        `,
      },
    },
    {
      heading: 'Reading notes from the app',
      paragraphs: [
        "In Python, the `google-cloud-storage` library lists and downloads objects. Study Tracker gets a Google Cloud version of `sync_notes.py`, which reads the bucket name from `NOTES_BUCKET` and saves the notes into the local `notes` folder that the indexing from AI Engineering already reads.",
        "The service account gets Storage Object Viewer on this bucket only, granted on the bucket rather than the project. On your laptop the same code uses your `application-default` login instead. No key appears in code, environment variables or `.env`.",
        "The test replaces the real client with a small fake one, so it runs without a Google Cloud account.",
      ],
      example: {
        language: 'bash',
        code: '$ NOTES_BUCKET=study-notes-jd4821 python sync_notes.py\nDownloaded 3 notes',
      },
    },
  ],
  seeItInAction: {
    title: 'Putting Study Tracker\'s notes in Cloud Storage',
    intro: "Run these from your `study-tracker` folder, which has the `notes` folder from AI Engineering. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        gcloud services enable storage.googleapis.com
        gcloud storage buckets create gs://study-notes-$SUFFIX --location $REGION --uniform-bucket-level-access --public-access-prevention --labels project=study-tracker
        gcloud storage buckets describe gs://study-notes-$SUFFIX --format "default(public_access_prevention, uniform_bucket_level_access)"

        gcloud storage rsync notes gs://study-notes-$SUFFIX
        gcloud storage ls gs://study-notes-$SUFFIX
        gcloud storage buckets add-iam-policy-binding gs://study-notes-$SUFFIX --member serviceAccount:$SA --role roles/storage.objectViewer
      `,
      output: code`
        public_access_prevention: enforced
        uniform_bucket_level_access: true
        gs://study-notes-jd4821/algebra.md
        gs://study-notes-jd4821/biology.md
        gs://study-notes-jd4821/history.md
      `,
    },
    steps: [
      { code: 'gcloud storage buckets create gs://study-notes-$SUFFIX --location $REGION', explanation: "Creates the bucket in your region. If the name is taken, change `SUFFIX`." },
      { code: '--uniform-bucket-level-access --public-access-prevention', explanation: "Turns on IAM-only access and blocks public access, so no setting can ever make the notes public." },
      { code: '--labels project=study-tracker', explanation: "Labels the bucket, so it appears in the project search from lesson 2 and in cost reports." },
      { code: 'gcloud storage rsync notes gs://study-notes-$SUFFIX', explanation: "Uploads every file in `notes` that is missing or changed in the bucket. Run it again after editing notes." },
      { code: '--member serviceAccount:$SA --role roles/storage.objectViewer', explanation: "Gives Study Tracker's service account read access to this bucket only. The binding lives on the bucket, not the project." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above, then open the bucket in the console and look at its Permissions and Configuration tabs.',
      'Add `sync_notes.py` and `test_sync_notes.py` below, add `google-cloud-storage` to `requirements.txt`, install it with `python -m pip install google-cloud-storage`, and run `python -m pytest`.',
      'Delete your local `notes` folder, run `sync_notes.py` with `NOTES_BUCKET` set, then run `index_notes.py` from AI Engineering. In PowerShell, set `$env:NOTES_BUCKET` first.',
      'Clean up: storing a few small notes costs very little, so keep the bucket for the following lessons. To remove it, run `gcloud storage rm --recursive gs://study-notes-$SUFFIX`, which deletes its objects and the bucket.',
    ],
    files: [
      { language: 'python', filename: 'sync_notes.py', code: syncNotesGcp, runnable: false },
      { language: 'python', filename: 'test_sync_notes.py', code: testSyncNotesGcp, files: { 'sync_notes.py': syncNotesGcp }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Saving files on the container\'s own disk.', fix: 'Instances come and go. Keep files in Cloud Storage, where every copy of the app sees the same data.' },
    { mistake: 'Granting `allUsers` access to make something work.', fix: 'Keep public access prevention on and grant roles to the service account instead.' },
    { mistake: 'Granting Storage Object Viewer on the whole project.', fix: 'Grant it on the one bucket the app reads, so it cannot reach any other bucket.' },
    { mistake: 'Starting with Compute Engine out of habit.', fix: 'Use the most managed option that fits. A virtual machine means patching and repairing an operating system yourself.' },
  ],
  quiz: [
    {
      question: 'Study Tracker\'s service account holds Storage Object Viewer on the notes bucket. The app tries to upload a new note. What happens?',
      options: [
        { text: 'It works, because the account has a role on the bucket', explanation: 'The role contains read and list permissions only.' },
        { text: 'It works if the note is a Markdown file', explanation: 'File type does not affect permissions.' },
        { text: 'It works, because public access prevention is on', explanation: 'That setting blocks public access. It grants nothing.' },
        { text: 'It is denied, because the role does not include `storage.objects.create`', explanation: 'Anything not granted is denied, and writing was never granted.' },
      ],
      answer: 3,
    },
    {
      question: 'Which Google Cloud service fits Study Tracker\'s web API best?',
      options: [
        { text: 'Cloud Run, running the existing Docker image', explanation: 'It runs containers without managing servers, gives HTTPS and can scale to zero.' },
        { text: 'Compute Engine, with Python installed by hand', explanation: 'That works, but you would manage the operating system yourself.' },
        { text: 'Persistent Disk', explanation: 'That is storage for one machine, not a way to run an app.' },
        { text: 'A GKE cluster per feature', explanation: 'Each cluster adds cost and work far beyond one API\'s needs.' },
      ],
      answer: 0,
    },
    {
      question: 'Two Cloud Run instances of Study Tracker each save notes to their own local disk. What goes wrong?',
      options: [
        { text: 'Nothing, because Cloud Run shares disks between instances', explanation: 'Each instance has its own short-lived file system.' },
        { text: 'The notes are encrypted twice', explanation: 'Encryption is not the problem here.' },
        { text: 'Each instance sees different notes, and they are lost when an instance stops', explanation: 'That is why shared files belong in Cloud Storage.' },
        { text: 'Cloud Run refuses to start', explanation: 'It starts fine. The data problem appears later.' },
      ],
      answer: 2,
    },
  ],
  takeaway: 'Run the app on the most managed compute that fits, Cloud Run here, keep shared files in a private Cloud Storage bucket, and grant the app\'s service account read access to that one bucket.',
  resources: [
    { title: 'What is Cloud Run?', provider: 'Google Cloud Documentation', description: 'Services, instances and scaling to zero.', url: 'https://docs.cloud.google.com/run/docs/overview/what-is-cloud-run' },
    { title: 'Cloud Storage overview', provider: 'Google Cloud Documentation', description: 'Buckets, objects and locations.', url: 'https://docs.cloud.google.com/storage/docs/introduction' },
    { title: 'Public access prevention', provider: 'Google Cloud Documentation', description: 'Blocking public access to buckets and objects.', url: 'https://docs.cloud.google.com/storage/docs/public-access-prevention' },
    { title: 'Cloud Storage client library for Python', provider: 'Google Cloud Documentation', description: 'Installing and using `google-cloud-storage`.', url: 'https://docs.cloud.google.com/python/docs/reference/storage/latest' },
  ],
  underTheHood: {
    heading: 'Why objects are not files',
    paragraphs: [
      "Cloud Storage looks like folders in the console, but it has none. A bucket holds a flat list of objects, each with a full name such as `notes/biology.md`, its bytes and some metadata. The slashes are just characters the console uses to draw folders.",
      "Objects are written whole. You cannot open one and change a line in the middle, as you would a file on disk: you upload a new version that replaces it. In return, Cloud Storage can copy each object across several machines, serve it to any number of readers over HTTPS and store practically unlimited amounts.",
      "Cloud Storage is strongly consistent: once an upload succeeds, every reader everywhere sees the new version, and a listing immediately includes it. That is why `sync_notes.py` can run straight after `gcloud storage rsync` and download exactly what you just uploaded.",
    ],
  },
}

export default lesson
