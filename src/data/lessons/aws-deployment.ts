import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { expressServiceJson, trustEcsJson, updateServiceJson } from './aws-shared'

const lesson: StructuredLesson = {
  assumes: 'AWS networking, with `vpc-study-tracker`, its public subnets and `sg-study-app`, and the Docker lesson from Software Engineering, with Docker Desktop running. Set the track variables, plus `PUB1`, `PUB2` and `SG_APP` from lesson 4.',
  goals: [
    'Push Study Tracker\'s image to a private Amazon ECR repository',
    'Run it with Amazon ECS Express Mode in your own VPC, with roles instead of passwords',
    'Reach the running app over HTTPS and explain where its data lives for now',
  ],
  bigIdea: "Deploying a container takes a registry that stores the image and a service that runs it. Amazon ECR, the Elastic Container Registry, stores Study Tracker's image privately, and Amazon ECS Express Mode runs it on Fargate with a load balancer, an HTTPS address and scaling set up for you. Three IAM roles connect the pieces, so no password or key appears anywhere.",
  whyItMatters: "Until now Study Tracker has run only on your own computer. After this lesson it has a public HTTPS address that anyone you share it with can open, built from the same image you tested locally. That is when a project becomes a service, and when cost and security start to matter every hour, which is why the account, roles and network came first.",
  goalSections: [
    {
      heading: 'A private repository for the image',
      paragraphs: [
        "An ECR repository holds versions of one image, identified by tags such as `v1`. Turning on scan on push makes ECR check each new image for known vulnerabilities in its software packages.",
        "`aws ecr get-login-password` creates a short-lived password, which Docker uses to sign in to your registry, so nothing permanent is stored. Your registry's address is your account number, `dkr.ecr`, the region and `amazonaws.com`.",
        "On a Mac with an Apple processor, Docker builds ARM images by default. Express Mode runs x86 processors unless you choose otherwise, so build with `--platform linux/amd64`, or the task will fail to start.",
      ],
      example: {
        language: 'text',
        code: code`
          docker build  ->  image on your laptop
          docker push   ->  123456789012.dkr.ecr.us-east-1.amazonaws.com/study-tracker:v1
          ECS pulls it  ->  using study-tracker-execution-role
        `,
      },
    },
    {
      heading: 'Express Mode and its three roles',
      paragraphs: [
        "ECS Express Mode needs only an image and roles, then creates the rest: a Fargate service, an Application Load Balancer, an HTTPS address, scaling and monitoring. AWS's documentation says it costs nothing extra beyond the resources it creates, such as Fargate time and the load balancer, which are charged by the hour.",
        "Three roles have three different jobs. The execution role lets ECS pull the image and write logs. The infrastructure role lets Express Mode create the load balancer and networking on your behalf. The task role, `study-tracker-task-role` from lesson 2, is what the app itself uses, for example to read the notes bucket.",
        "Given your public subnets, Express Mode creates an internet-facing load balancer and gives tasks public IP addresses, as the networking lesson planned. Adding `sg-study-app` to the service puts the tasks in the group the database will trust in lesson 7.",
      ],
      example: {
        language: 'text',
        code: code`
          Role                               Used by          To
          study-tracker-execution-role       ECS              pull the image, write logs
          study-tracker-infrastructure-role  Express Mode     create the load balancer and networking
          study-tracker-task-role            the app          read the notes bucket, and later secrets
        `,
      },
    },
    {
      heading: 'Where the data lives, for now',
      paragraphs: [
        "Study Tracker still saves sessions to SQLite on the task's own disk, which disappears whenever a task is replaced, such as on a new deployment or when a task fails a health check. Sessions saved now are temporary. Lesson 7 adds a managed database.",
        "Express Mode keeps at least one task running, plus the load balancer, so unlike the Azure track's scale-to-zero setup this deployment costs money every hour it exists. Plan to delete it the same day unless you continue straight on.",
        "The AI features have no model yet, so they return the unavailable message from Designing AI Products, while sessions and totals work. Lesson 13 connects Amazon Bedrock.",
      ],
      example: {
        language: 'text',
        code: code`
          Works now                         Temporary or unavailable until later
          GET /docs, POST /sessions          sessions lost when a task is replaced (lesson 7)
          GET /totals                        notes assistant and planner: 503 until lesson 13
          Running cost: one Fargate task and one load balancer, every hour
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying Study Tracker with Express Mode',
    intro: "Run these as `studyadmin` from your `study-tracker` folder, with `trust-ecs-tasks.json` from lesson 2 and `trust-ecs.json` from Try it yourself. Edit `express-service.json` first: replace `123456789012` with your account number, `jd4821` with your suffix, and the `REPLACE-WITH` values with your subnet and security group IDs. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
        REGISTRY=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com
        aws ecr create-repository --repository-name study-tracker --image-scanning-configuration scanOnPush=true --tags Key=project,Value=study-tracker
        aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REGISTRY
        docker build --platform linux/amd64 -t $REGISTRY/study-tracker:v1 .
        docker push $REGISTRY/study-tracker:v1

        aws iam create-role --role-name study-tracker-execution-role --assume-role-policy-document file://trust-ecs-tasks.json --tags Key=project,Value=study-tracker
        aws iam attach-role-policy --role-name study-tracker-execution-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
        aws iam create-role --role-name study-tracker-infrastructure-role --assume-role-policy-document file://trust-ecs.json --tags Key=project,Value=study-tracker
        aws iam attach-role-policy --role-name study-tracker-infrastructure-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSInfrastructureRoleforExpressGatewayServices
        aws logs create-log-group --log-group-name /ecs/study-tracker --tags project=study-tracker
        aws logs put-retention-policy --log-group-name /ecs/study-tracker --retention-in-days 30

        SERVICE_ARN=$(aws ecs create-express-gateway-service --cli-input-json file://express-service.json --query service.serviceArn --output text)
        aws ecs describe-express-gateway-service --service-arn $SERVICE_ARN --query "service.activeConfigurations[0].ingressPaths[0].endpoint" --output text
      `,
      output: 'st-1a2b3c4d5e.ecs.us-east-1.on.aws',
    },
    steps: [
      { code: '--image-scanning-configuration scanOnPush=true', explanation: "ECR scans every pushed image for known vulnerabilities. See the findings in the ECR console or with `aws ecr describe-image-scan-findings`." },
      { code: 'aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REGISTRY', explanation: "Signs Docker in with a temporary password piped straight into it, so it never appears on screen or in your history." },
      { code: '--policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy', explanation: "An AWS managed policy that allows exactly what the execution role needs: pulling images from ECR and writing logs." },
      { code: '--policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSInfrastructureRoleforExpressGatewayServices', explanation: "Lets Express Mode create and manage the load balancer, target groups and related networking for your service." },
      { code: '"awsLogsConfiguration": { "logGroup": "/ecs/study-tracker", ... }', explanation: "In `express-service.json`. Sends the app's log lines to the log group created just before, kept for 30 days. Lesson 6 searches them." },
      { code: '"scalingTarget": { "minTaskCount": 1, "maxTaskCount": 2 }', explanation: "One task normally, two at most under load. Express Mode does not scale to zero, so the service costs money while it exists." },
      { code: 'st-1a2b3c4d5e.ecs.us-east-1.on.aws', explanation: "Your app's address will look like this. It can take several minutes to start answering. Open it with `https://` and `/docs` on the end." },
    ],
  },
  tryIt: {
    instructions: [
      'Save `trust-ecs.json` and `express-service.json` below, edit the placeholders, and run the commands above. Then open your app\'s `/docs` and save a session.',
      'Open the service in the ECS console and find the load balancer, the task and its logs that Express Mode created.',
      'Push a `v2` image after a small change to `app.py`. Save `update-service.json` below with your service ARN, account and suffix, then run `aws ecs update-express-gateway-service --cli-input-json file://update-service.json`. The update replaces the container settings, so it repeats every one you want to keep, not just the image. Check `/docs` again.',
      'Clean up: the load balancer and task cost money every hour. Unless you continue today, delete the service with `aws ecs delete-express-gateway-service --service-arn $SERVICE_ARN`. Keep the repository and roles, which cost little or nothing, or delete the repository with `aws ecr delete-repository --repository-name study-tracker --force`.',
    ],
    files: [
      { language: 'text', filename: 'trust-ecs.json', code: trustEcsJson },
      { language: 'text', filename: 'express-service.json', code: expressServiceJson },
      { language: 'text', filename: 'update-service.json', code: updateServiceJson },
    ],
  },
  mistakes: [
    { mistake: 'Building on an Apple-processor Mac without `--platform linux/amd64`.', fix: 'Build for linux/amd64 when deploying, or the task fails to start with an image format error.' },
    { mistake: 'Mixing up the execution role and the task role.', fix: 'The execution role is for ECS itself: images and logs. The task role is what your app\'s code uses.' },
    { mistake: 'Treating data in the task as saved.', fix: 'Tasks are replaced often. Use a database or S3 for anything that must last.' },
    { mistake: 'Leaving the service running after a lab.', fix: 'The load balancer and task are charged every hour. Delete the service when you stop.' },
  ],
  quiz: [
    {
      question: 'The task fails to start with an error about the image format. You built the image on a Mac with an Apple processor. What is the most likely fix?',
      options: [
        { text: 'Add more memory to the task', explanation: 'Memory does not change which processor an image was built for.' },
        { text: 'Rebuild with `--platform linux/amd64` and push again', explanation: 'The image was built for ARM, and the task runs on x86 by default.' },
        { text: 'Turn off image scanning', explanation: 'Scanning reports vulnerabilities. It does not stop an image running.' },
        { text: 'Change the health check path', explanation: 'A wrong health check fails a running task. It does not cause an image format error.' },
      ],
      answer: 1,
    },
    {
      question: 'Which role does Study Tracker\'s own code use when it reads the notes bucket?',
      options: [
        { text: 'The execution role', explanation: 'That role is used by ECS to pull images and write logs, not by your code.' },
        { text: 'The infrastructure role', explanation: 'That role lets Express Mode manage the load balancer and networking.' },
        { text: 'Your `studyadmin` user', explanation: 'Your sign-in is not available inside the task.' },
        { text: 'The task role, `study-tracker-task-role`', explanation: 'The task role is the identity your application code runs as.' },
      ],
      answer: 3,
    },
    {
      question: 'You save sessions in the deployed app, deploy `v2`, and the sessions are gone. Why?',
      options: [
        { text: 'The new deployment replaced the task, and SQLite\'s file lived on the old task\'s disk', explanation: 'Task storage is temporary. Lesson 7 moves the data to a managed database.' },
        { text: 'ECR deleted the old image', explanation: 'Images stay in ECR, and sessions were never in the image.' },
        { text: 'The budget alert reset the app', explanation: 'Budgets only send emails.' },
        { text: 'Express Mode clears databases on every deployment', explanation: 'Express Mode knows nothing about your data. The file was on temporary storage.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Push the image to ECR, run it with ECS Express Mode in your own subnets using an execution role, an infrastructure role and a task role, and remember that task storage is temporary and the service costs money every hour.',
  resources: [
    { title: 'Amazon ECS Express Mode', provider: 'AWS Documentation', description: 'What Express Mode creates and how it is priced.', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html' },
    { title: 'Pushing an image to ECR', provider: 'AWS Documentation', description: 'Signing Docker in to ECR and pushing images.', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html' },
    { title: 'Task execution IAM role', provider: 'AWS Documentation', description: 'What the execution role does and needs.', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html' },
    { title: 'AWS Fargate pricing', provider: 'AWS', description: 'Current prices for Fargate tasks, which change over time.', url: 'https://aws.amazon.com/fargate/pricing/' },
  ],
  underTheHood: {
    heading: 'What happens when a request reaches the load balancer',
    paragraphs: [
      "Express Mode's Application Load Balancer receives every HTTPS request at your service's address. It handles the encryption itself, using a certificate AWS manages, then forwards the request to a healthy task over the VPC's private network.",
      "The load balancer decides which tasks are healthy by calling the health check path, `/totals` for Study Tracker, every few seconds. A task that fails several checks in a row stops receiving traffic, and ECS starts a replacement. That is also why the task's SQLite file is lost: replacement tasks start from the image, with a fresh disk.",
      "When you deploy `v2`, ECS starts new tasks, waits until they pass health checks, moves traffic to them, then stops the old ones. Learners never see an error during the change. This rolling deployment is one of the things you get for free by choosing a managed service instead of running containers by hand.",
    ],
  },
}

export default lesson
