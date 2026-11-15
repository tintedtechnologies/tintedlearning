import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { readNotesPolicyJson } from './aws-shared'
import { syncNotesAws, testSyncNotesAws } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'AWS identity and resource organization, with `study-tracker-task-role` created. Set the track variables first.',
  goals: [
    'Choose between EC2, containers on ECS and Lambda functions for a workload',
    'Choose between S3, EBS and EFS, and confirm a bucket is private and encrypted',
    'Store Study Tracker\'s notes in S3 and give its role read access to that bucket only',
  ],
  bigIdea: "AWS offers compute at several levels: EC2 virtual machines you manage, containers that Amazon ECS runs for you on Fargate, and Lambda functions that run only when triggered. Storage comes in three shapes: S3 for files as objects, EBS for disks attached to one machine, and EFS for shared file systems. For Study Tracker, that means containers for the app and S3 for the notes.",
  whyItMatters: "Study Tracker's notes have lived in a `notes` folder beside the code. In the cloud the app may run as several copies, started and stopped at any time, each with its own short-lived disk. Notes saved there would differ between copies and vanish on restart. An S3 bucket gives every copy the same notes, kept safely in one place, and lets you control exactly who can read them.",
  goalSections: [
    {
      heading: 'Choosing compute on AWS',
      paragraphs: [
        "Amazon EC2 rents virtual machines. You choose the operating system, apply updates and handle failures yourself, which suits special software or full control.",
        "Amazon ECS, the Elastic Container Service, runs Docker images. With Fargate, AWS also provides the machines underneath, so you never manage a server. For new web apps, AWS now recommends ECS Express Mode, which adds a public HTTPS address, a load balancer and scaling for you, and lesson 5 uses it. Amazon EKS runs Kubernetes, with more control and more to manage, which lesson 8 weighs up.",
        "AWS Lambda runs functions when triggered, such as on a schedule or a new file, and costs nothing while idle. Study Tracker's API runs on ECS, because it already has a Docker image, and the weekly summary in lesson 9 uses Lambda.",
      ],
      example: {
        language: 'text',
        code: code`
          Option                  You manage                   Good for
          EC2                     OS, updates, scaling         full control, unusual software
          ECS on Fargate          your image and settings      web APIs like Study Tracker
          EKS (Kubernetes)        cluster, nodes, add-ons      many services, large teams
          Lambda                  your code only               small jobs on a schedule or event
        `,
      },
    },
    {
      heading: 'Choosing storage on AWS',
      paragraphs: [
        "Amazon S3, the Simple Storage Service, stores files as objects in buckets, reached over HTTPS by key, such as `biology.md`. Amazon EBS provides disks for one EC2 machine, and Amazon EFS is a shared file system several machines can mount. Databases are a separate choice, covered in lesson 7.",
        "New S3 buckets start locked down. AWS's documentation states that new buckets do not allow public access, and that every new object is encrypted at rest automatically. Confirm both on your bucket rather than assuming, because older buckets and copied settings may differ.",
        "Bucket names are global across every AWS account, so this track names it `study-notes-` followed by your `SUFFIX`.",
      ],
      example: {
        language: 'text',
        code: code`
          Bucket study-notes-jd4821            one per app, globally unique name
            biology.md                         one object
            algebra.md
            history.md
          Public access: blocked     Encryption at rest: SSE-S3, automatic
        `,
      },
    },
    {
      heading: 'Read-only access for the app',
      paragraphs: [
        "Study Tracker's role gets an inline policy, one attached directly to the role, with two statements: `s3:ListBucket` on the bucket, so the app can see which notes exist, and `s3:GetObject` on the objects inside, so it can read them. It cannot write, delete or see any other bucket.",
        "Your daily user can already upload, because `studyadmin` has administrator access in this learning account.",
        "In Python, boto3's S3 client lists and downloads the notes. Study Tracker gets an AWS version of `sync_notes.py`, which reads the bucket name from `NOTES_BUCKET` and saves the notes into the local `notes` folder that the indexing from AI Engineering already reads.",
      ],
      example: {
        language: 'text',
        code: code`
          Who                        Can                              On
          studyadmin (you)           everything, as administrator     this learning account
          study-tracker-task-role    s3:ListBucket, s3:GetObject      study-notes-jd4821 only
          The internet               nothing: public access blocked
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Putting Study Tracker\'s notes in S3',
    intro: "Run these as `studyadmin` from your `study-tracker` folder, which has the `notes` folder from AI Engineering. Save `read-notes-policy.json` from Try it yourself first, replacing `jd4821` with your own suffix in both places. In PowerShell, keep the single quotes around the tag set exactly as shown.",
    example: {
      language: 'bash',
      code: code`
        aws s3api create-bucket --bucket study-notes-$SUFFIX --region $REGION
        aws s3api put-bucket-tagging --bucket study-notes-$SUFFIX --tagging 'TagSet=[{Key=project,Value=study-tracker}]'
        aws s3api get-public-access-block --bucket study-notes-$SUFFIX --query PublicAccessBlockConfiguration --output table
        aws s3api get-bucket-encryption --bucket study-notes-$SUFFIX --query "ServerSideEncryptionConfiguration.Rules[0].ApplyServerSideEncryptionByDefault.SSEAlgorithm" --output text

        aws s3 sync notes s3://study-notes-$SUFFIX/
        aws s3 ls s3://study-notes-$SUFFIX/
        aws iam put-role-policy --role-name study-tracker-task-role --policy-name read-notes --policy-document file://read-notes-policy.json
      `,
      output: code`
        AES256
        2026-11-15 10:02:11         57 algebra.md
        2026-11-15 10:02:11        112 biology.md
        2026-11-15 10:02:11         55 history.md
      `,
    },
    steps: [
      { code: 'aws s3api create-bucket --bucket study-notes-$SUFFIX --region $REGION', explanation: "Creates the bucket. In any region other than `us-east-1`, also add `--create-bucket-configuration LocationConstraint=$REGION`, which AWS requires." },
      { code: '--tagging \'TagSet=[{Key=project,Value=study-tracker}]\'', explanation: "Tags the bucket so it appears in the `study-tracker` resource group. Note that S3 takes tags in a different format from IAM." },
      { code: 'aws s3api get-public-access-block ...', explanation: "Shows the four Block Public Access settings. All four should be `True`, meaning no policy or setting can make the bucket public." },
      { code: '...SSEAlgorithm" --output text', explanation: "`AES256` means SSE-S3 encryption: every object is encrypted at rest with keys AWS manages." },
      { code: 'aws s3 sync notes s3://study-notes-$SUFFIX/', explanation: "Uploads every file in `notes` that is missing or changed in the bucket. Run it again after editing notes." },
      { code: 'aws iam put-role-policy ... --policy-name read-notes --policy-document file://read-notes-policy.json', explanation: "Gives Study Tracker's role read access to this bucket only." },
      { code: '$ NOTES_BUCKET=study-notes-jd4821 python sync_notes.py\nDownloaded 3 notes', explanation: "Run in a fresh folder, the AWS `sync_notes.py` downloads the notes using your `aws sso login` session. Install boto3 first with `python -m pip install boto3`. In PowerShell, set `$env:NOTES_BUCKET` first." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above, then open the bucket in the S3 console and look at its Permissions and Properties tabs.',
      'Add `sync_notes.py` and `test_sync_notes.py` below, add `boto3` to `requirements.txt`, and run `python -m pytest`.',
      'Delete your local `notes` folder, run `sync_notes.py` with `NOTES_BUCKET` set, then run `index_notes.py` from AI Engineering.',
      'Clean up: storing a few small notes costs very little, so keep the bucket for the following lessons. To remove it, run `aws s3 rb s3://study-notes-$SUFFIX --force`, which deletes its objects too.',
    ],
    files: [
      { language: 'text', filename: 'read-notes-policy.json', code: readNotesPolicyJson },
      { language: 'python', filename: 'sync_notes.py', code: syncNotesAws, runnable: false },
      { language: 'python', filename: 'test_sync_notes.py', code: testSyncNotesAws, files: { 'sync_notes.py': syncNotesAws }, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Saving files on the container\'s own disk.', fix: 'Containers come and go. Keep files in S3, where every copy of the app sees the same data.' },
    { mistake: 'Turning off Block Public Access to make something work.', fix: 'Keep it on and grant access through IAM roles and policies instead.' },
    { mistake: 'Giving the app `s3:*` on `*`.', fix: 'Allow only `s3:ListBucket` and `s3:GetObject`, on the one bucket it reads.' },
    { mistake: 'Starting with EC2 out of habit.', fix: 'Use the most managed option that fits. An EC2 machine means patching and repairing an operating system yourself.' },
  ],
  quiz: [
    {
      question: 'Study Tracker\'s role has the read-notes policy. The app tries to upload a new note to the bucket. What happens?',
      options: [
        { text: 'It works, because the role can access the bucket', explanation: 'Access is per action, and only listing and reading are allowed.' },
        { text: 'It works if the note is a Markdown file', explanation: 'File type does not affect permissions.' },
        { text: 'It is denied, because `s3:PutObject` is not allowed', explanation: 'AWS denies anything not explicitly allowed, and writing was never granted.' },
        { text: 'It works, because Block Public Access is on', explanation: 'Block Public Access limits public access. It grants nothing.' },
      ],
      answer: 2,
    },
    {
      question: 'Which AWS service fits Study Tracker\'s web API best?',
      options: [
        { text: 'Amazon ECS, running the existing Docker image on Fargate', explanation: 'It runs containers without managing servers, and Express Mode adds HTTPS and scaling.' },
        { text: 'Amazon EBS', explanation: 'EBS provides disks for EC2 machines. It runs nothing.' },
        { text: 'Amazon S3', explanation: 'S3 stores files. It cannot run a Python API.' },
        { text: 'An EC2 machine with Docker installed by hand', explanation: 'It works, but you would patch, secure and scale the machine yourself.' },
      ],
      answer: 0,
    },
    {
      question: '`aws s3api get-bucket-encryption` prints `AES256` for your new bucket. What does that mean?',
      options: [
        { text: 'The bucket is public but encrypted', explanation: 'Encryption and public access are separate settings. New buckets block public access too.' },
        { text: 'Objects are encrypted at rest with SSE-S3, using keys AWS manages', explanation: 'AWS applies this to new buckets automatically.' },
        { text: 'Only files with the .aes extension are encrypted', explanation: 'Every object is encrypted, whatever its name.' },
        { text: 'Uploads must be encrypted by your code first', explanation: 'S3 encrypts objects itself when they are stored.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Run the app on the most managed compute that fits, keep its files in a private, encrypted S3 bucket, and let its role list and read that one bucket and nothing else.',
  resources: [
    { title: 'Choosing an AWS compute service', provider: 'AWS', description: 'A decision guide for EC2, containers, Lambda and more.', url: 'https://docs.aws.amazon.com/decision-guides/latest/compute-on-aws-how-to-choose/choosing-aws-compute-service.html' },
    { title: 'What is Amazon S3?', provider: 'AWS Documentation', description: 'Buckets, objects and how access works.', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html' },
    { title: 'Blocking public access to S3', provider: 'AWS Documentation', description: 'The four Block Public Access settings and their defaults.', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html' },
    { title: 'Default encryption FAQ', provider: 'AWS Documentation', description: 'How S3 encrypts new objects automatically.', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-encryption-faq.html' },
  ],
  underTheHood: {
    heading: 'Why S3 needs two different permissions',
    paragraphs: [
      "The read-notes policy grants `s3:ListBucket` on `arn:aws:s3:::study-notes-jd4821` and `s3:GetObject` on `arn:aws:s3:::study-notes-jd4821/*`. They look almost the same, but they target different things.",
      "Listing is an action on the bucket itself: \"what keys exist in here?\" So its resource is the bucket's ARN, with nothing after the name. Reading is an action on an object: \"give me the contents of `biology.md`\". So its resource is the object's ARN, which is the bucket name, a slash and the key, and `/*` means every key.",
      "Get them backwards and the policy grants nothing useful, because neither action matches its resource. This is one of the most common S3 permission mistakes, and the error messages rarely make it obvious. It is also a good example of why least privilege takes care: the narrowest policy that works must match exactly how the service checks each action.",
    ],
  },
}

export default lesson
