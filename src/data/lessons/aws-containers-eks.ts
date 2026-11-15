import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { k8sManifestAws } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Deploy an AWS workload, with Study Tracker\'s image in ECR. Set the track variables. The hands-on part is optional: it costs more per hour than anything else in this track.',
  goals: [
    'Decide when Kubernetes on EKS is worth its extra work, and when ECS is enough',
    'Describe a Kubernetes deployment and a load-balanced service in YAML',
    'Run Study Tracker on a short-lived EKS Auto Mode cluster, then delete it',
  ],
  bigIdea: "Kubernetes runs containers across a group of machines, a cluster, and keeps them matching the state you describe in YAML files. Amazon EKS, the Elastic Kubernetes Service, runs the Kubernetes control plane for you, and EKS Auto Mode also manages the machines, called nodes. It is widely used and very flexible, but for one API ECS does the same job with far less to learn and run.",
  whyItMatters: "Kubernetes appears in many job adverts, so it is worth seeing how it works. But putting Study Tracker on EKS because it sounds professional means paying for a cluster every hour, keeping its version up to date and learning a second set of tools, for an app ECS Express Mode already runs well. Knowing when each one fits is the skill that matters.",
  goalSections: [
    {
      heading: 'When EKS is worth it',
      paragraphs: [
        "Kubernetes pays off for many services that need fine control: custom networking between them, special hardware such as graphics processors, its huge ecosystem of add-ons, or the same platform across several clouds and your own data centers. Organizations that run it usually have a platform team for it.",
        "For one web API and a few jobs, ECS gives you scaling, rolling deployments and private networking without a cluster to manage. ECS is AWS's own container system, simpler and tightly integrated with other AWS services.",
        "EKS has a fixed hourly charge for each cluster's control plane, and Auto Mode adds a management charge on top of the machines it runs. Check AWS's EKS pricing page for current amounts, and plan to delete a learning cluster the same day.",
      ],
      example: {
        language: 'text',
        code: code`
                               ECS Express Mode            EKS Auto Mode
          You manage           image and settings          YAML, cluster version, add-ons
          Fixed hourly cost    load balancer, one task     control plane, plus nodes
          Fine control         limited                     almost everything
          Fits Study Tracker   yes                         only to learn Kubernetes
        `,
      },
    },
    {
      heading: 'Deployments and load-balanced services',
      paragraphs: [
        "A deployment says which image to run and how many copies, called replicas, to keep. Kubernetes runs each copy as a pod and replaces any that fail. A readiness probe tells it when a pod can receive traffic.",
        "A service of type `LoadBalancer` gives the pods one address. On EKS Auto Mode, it creates an AWS Network Load Balancer automatically. That load balancer is internal by default, so the annotation `service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing` asks for a public one.",
        "Labels connect the two: the deployment marks pods with `app: study-tracker`, and the service sends traffic to pods with that label.",
      ],
      example: {
        language: 'text',
        code: code`
          Service study-tracker   type LoadBalancer, internet-facing NLB, port 80
             | selects pods labeled app: study-tracker
          Deployment study-tracker, replicas: 2
             |-- pod 1: the image from ECR, port 8000, ready when /totals answers
             |-- pod 2: same
        `,
      },
    },
    {
      heading: 'eksctl and kubectl',
      paragraphs: [
        "`eksctl` is a command-line tool, documented by AWS, that creates EKS clusters with sensible defaults. With `--enable-auto-mode`, one command creates the cluster, its own VPC and the roles it needs. Install it from eksctl.io. `kubectl`, the Kubernetes tool, comes with Docker Desktop.",
        "`eksctl` also saves the cluster's connection details for `kubectl`, so you can apply your YAML straight away. Delete a pod by hand and Kubernetes starts a replacement within seconds, because the deployment still asks for two.",
        "This demo keeps SQLite inside each pod, so the two pods do not share data. The cluster runs in its own VPC, separate from Study Tracker's database, and connecting them is more work than a short experiment needs.",
      ],
      example: {
        language: 'bash',
        code: code`
          kubectl get pods
          kubectl delete pod <one-pod-name>
          kubectl get pods
        `,
        output: code`
          NAME                             READY   STATUS    RESTARTS   AGE
          study-tracker-5c7d9b8f6d-2xk4p   1/1     Running   0          4m
          study-tracker-5c7d9b8f6d-r9t7m   1/1     Running   0          4m
          pod "study-tracker-5c7d9b8f6d-2xk4p" deleted
          NAME                             READY   STATUS    RESTARTS   AGE
          study-tracker-5c7d9b8f6d-r9t7m   1/1     Running   0          4m
          study-tracker-5c7d9b8f6d-w8q2n   0/1     Running   0          5s
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A short-lived EKS cluster for Study Tracker',
    intro: "Optional and billed by the hour: create, test and delete the cluster in one sitting. Save the YAML from Try it yourself as `k8s.yaml`, with your account number in the image line. Creating the cluster takes about 15 minutes.",
    example: {
      language: 'bash',
      code: code`
        eksctl create cluster --name study-tracker --region $REGION --enable-auto-mode --tags project=study-tracker
        kubectl apply -f k8s.yaml
        kubectl get service study-tracker
      `,
      output: code`
        NAME            TYPE           CLUSTER-IP      EXTERNAL-IP                                                  PORT(S)        AGE
        study-tracker   LoadBalancer   172.20.81.143   k8s-default-studytra-0a1b2c3d4e-0123456789.elb.us-east-1.amazonaws.com   80:31544/TCP   2m
      `,
    },
    steps: [
      { code: 'eksctl create cluster --name study-tracker --region $REGION --enable-auto-mode', explanation: "Creates the cluster, a VPC for it and the IAM roles, with Auto Mode managing the nodes. It also writes the connection details `kubectl` needs." },
      { code: '--tags project=study-tracker', explanation: "Tags the AWS resources eksctl creates, so they appear in the `study-tracker` resource group and cost reports." },
      { code: 'service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing', explanation: "In `k8s.yaml`. Without it, Auto Mode creates an internal load balancer that only the VPC can reach." },
      { code: 'loadBalancerClass: eks.amazonaws.com/nlb', explanation: "Tells EKS Auto Mode to create the load balancer. Auto Mode sets this as the default, and writing it makes the file clear about what it depends on." },
      { code: 'kubectl apply -f k8s.yaml', explanation: "Creates the deployment and service. Auto Mode starts nodes as needed to fit the two pods." },
      { code: 'EXTERNAL-IP k8s-default-studytra-....elb.us-east-1.amazonaws.com', explanation: "The load balancer's address, which can take a few minutes to start answering. Open `http://` followed by the address and `/docs`. This demo uses plain HTTP." },
    ],
  },
  tryIt: {
    instructions: [
      'Without creating anything, list three things EKS would make you manage that ECS Express Mode does not.',
      'Optional, billed hourly: install `eksctl`, create the cluster, apply the YAML below and open the app. Delete one pod and watch it come back.',
      'Change `replicas` to 3, apply the file again and check `kubectl get pods`.',
      'Clean up straight away: delete the service first so its load balancer is removed, with `kubectl delete -f k8s.yaml`, then `eksctl delete cluster --name study-tracker --region $REGION`. Check the EC2 and load balancer consoles later to confirm nothing remains.',
    ],
    files: [{ language: 'text', filename: 'k8s.yaml', code: k8sManifestAws }],
  },
  mistakes: [
    { mistake: 'Choosing EKS because it is popular.', fix: 'Start from requirements. For a single API, ECS is usually simpler and cheaper.' },
    { mistake: 'Leaving a cluster running after an experiment.', fix: 'The control plane and nodes are charged every hour. Delete the cluster the same day.' },
    { mistake: 'Forgetting the internet-facing annotation.', fix: 'Add it to services that must be public. Without it, the load balancer is internal.' },
    { mistake: 'Deleting the cluster before its load-balanced services.', fix: 'Delete the services first, so their load balancers are cleaned up, then the cluster.' },
  ],
  quiz: [
    {
      question: 'Your EKS service shows an address, but it cannot be reached from your laptop. The YAML has no scheme annotation. What is the most likely cause?',
      options: [
        { text: 'The pods are not ready', explanation: 'Then requests would fail, but the address would still be reachable.' },
        { text: 'EKS cannot run Python apps', explanation: 'EKS runs any container image.' },
        { text: 'The load balancer is internal by default, reachable only from inside the VPC', explanation: 'Add the internet-facing annotation to get a public load balancer.' },
        { text: 'The cluster needs more nodes', explanation: 'Node count does not decide whether a load balancer is public.' },
      ],
      answer: 2,
    },
    {
      question: 'A deployment asks for 2 replicas. A node fails and one pod is lost. What happens?',
      options: [
        { text: 'Kubernetes starts a replacement pod, on another node if needed, to get back to 2', explanation: 'It keeps comparing what is running with what the deployment asks for.' },
        { text: 'The app runs with one pod until you redeploy', explanation: 'The deployment still wants 2, so Kubernetes acts without you.' },
        { text: 'The whole cluster stops', explanation: 'Losing one node does not stop the cluster.' },
        { text: 'The service is deleted', explanation: 'Services stay. They send traffic to whichever pods are healthy.' },
      ],
      answer: 0,
    },
    {
      question: 'Study Tracker is one API and a weekly job, run by one person. Which AWS platform fits best?',
      options: [
        { text: 'EKS, because Kubernetes is the industry standard', explanation: 'Being standard does not make it the right size for one API.' },
        { text: 'One EKS cluster per feature', explanation: 'Each cluster multiplies the hourly cost and the work.' },
        { text: 'EC2 machines with Kubernetes installed by hand', explanation: 'That combines the work of Kubernetes with the work of managing servers.' },
        { text: 'ECS Express Mode for the API and Lambda for the weekly job', explanation: 'Managed services sized to the job, with nothing extra to run.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Kubernetes on EKS keeps containers matching the state you describe, which suits large platforms, but for an app like Study Tracker, ECS gives most of the benefit with far less cost and work.',
  resources: [
    { title: 'What is Amazon EKS?', provider: 'AWS Documentation', description: 'What EKS manages and what you manage.', url: 'https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html' },
    { title: 'Create an EKS Auto Mode cluster with eksctl', provider: 'AWS Documentation', description: 'The command used in this lesson, with its options.', url: 'https://docs.aws.amazon.com/eks/latest/userguide/automode-get-started-eksctl.html' },
    { title: 'Network load balancers in Auto Mode', provider: 'AWS Documentation', description: 'Service annotations, including internet-facing.', url: 'https://docs.aws.amazon.com/eks/latest/userguide/auto-configure-nlb.html' },
    { title: 'Installing eksctl', provider: 'eksctl', description: 'Install instructions for every operating system.', url: 'https://eksctl.io/installation/' },
  ],
  underTheHood: {
    heading: 'What Auto Mode adds',
    paragraphs: [
      "A Kubernetes cluster has two halves. The control plane holds the desired state and runs the controllers that keep reality matching it. Plain EKS manages that half for you. The data plane is the worker machines, or nodes, where pods actually run, and in plain EKS you choose, launch and update them yourself in node groups.",
      "Auto Mode takes over the nodes too. When a pod cannot be placed because no node has room, Auto Mode starts a suitable EC2 machine. When nodes sit empty, it removes them. It also keeps them updated and runs the add-ons needed for networking, storage and load balancers.",
      "That closes much of the gap with ECS, which never asked you to manage servers on Fargate. The trade-off remains: Kubernetes gives you its full flexibility and ecosystem, in exchange for a control plane charge and a much larger set of concepts, while ECS stays simpler for teams that only need to run containers.",
    ],
  },
}

export default lesson
