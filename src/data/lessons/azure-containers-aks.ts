import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { k8sManifest } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Deploy an Azure workload, with Study Tracker\'s image in your registry. Set the track variables and `ACR`. The hands-on part is optional: it costs more per hour than anything else in this track and needs more processor quota than some free subscriptions have.',
  goals: [
    'Decide when Kubernetes is worth its extra work and when Container Apps is enough',
    'Describe a Kubernetes deployment and service in a YAML file',
    'Run Study Tracker on a small AKS cluster, watch Kubernetes repair it, then delete the cluster',
  ],
  bigIdea: "Kubernetes is an open-source system that runs containers across a group of machines, called a cluster, and keeps them in the state you describe. Azure Kubernetes Service, or AKS, runs the Kubernetes control plane for you, while you pay for the machines the containers run on. It is powerful and widely used, but it brings far more to learn and operate than Container Apps, which is itself built on Kubernetes behind the scenes.",
  whyItMatters: "Job adverts often ask for Kubernetes, so it is worth knowing how it works. But a team that runs Study Tracker on Kubernetes because it sounds professional takes on node upgrades, cluster security, networking add-ons and higher bills, for an app that Container Apps already runs well. Knowing both, and when each fits, is the skill employers actually need.",
  goalSections: [
    {
      heading: 'When Kubernetes is worth it',
      paragraphs: [
        "Kubernetes earns its cost when you run many services that need fine control: custom networking between them, special hardware such as graphics processors, add-ons from its large ecosystem, or the same platform across several clouds and your own data center. Large organizations often have a platform team whose job is to run it.",
        "For one web API and a few background jobs, Container Apps gives you most of the same benefits, scaling, rolling updates and private networking, without managing a cluster. In fact, Container Apps runs on Kubernetes, with Microsoft operating it.",
        "AKS also has a minimum size. According to Microsoft's documentation, a cluster's system node pool needs at least two nodes, each with at least 4 virtual processors, and the small B-series sizes are not allowed. Those nodes cost money every hour, whether or not any app runs on them.",
      ],
      example: {
        language: 'text',
        code: code`
                               Container Apps              AKS
          You manage           your app's settings         cluster version, node pools,
                                                           add-ons, upgrades
          Idle cost            can scale to zero           nodes charged every hour
          Fine control         limited                     almost everything
          Fits Study Tracker   yes                         only to learn Kubernetes
        `,
      },
    },
    {
      heading: 'Deployments and services',
      paragraphs: [
        "In Kubernetes you describe what you want in YAML files, and Kubernetes makes it happen. The smallest unit it runs is a pod, one or more containers that run together. A deployment says which image to run and how many copies, called replicas, to keep. If a pod crashes or a node fails, the deployment starts a replacement.",
        "A service gives the pods one stable address, because pods come and go. A service of type `LoadBalancer` asks Azure for a public IP address and spreads requests across the healthy pods.",
        "The labels connect them. The deployment stamps every pod with `app: study-tracker`, and the service sends traffic to any pod with that label. A readiness probe tells Kubernetes when a pod is ready for traffic, by calling one of its endpoints.",
      ],
      example: {
        language: 'text',
        code: code`
          Service study-tracker (LoadBalancer, public IP, port 80)
             | selects pods labeled app: study-tracker
          Deployment study-tracker, replicas: 2
             |-- pod 1: container from the image, port 8000, ready when /totals answers
             |-- pod 2: same
        `,
      },
    },
    {
      heading: 'Running and repairing',
      paragraphs: [
        "`kubectl` is the command-line tool for Kubernetes. Docker Desktop includes it, or `az aks install-cli` installs it. `az aks get-credentials` saves the cluster's connection details so `kubectl` can talk to it, and `kubectl apply -f` sends your YAML.",
        "Kubernetes keeps comparing what is running with what you asked for. Delete a pod by hand and a new one appears within seconds, because the deployment still wants two. Change `replicas` and apply again, and it adds or removes pods to match.",
        "This demo uses SQLite inside each pod, so the two pods do not share data. Connecting to the private PostgreSQL server would need the cluster inside your virtual network and a new network rule, which is more than a short experiment is worth.",
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
          study-tracker-6d9f8b7c5b-4kq2x   1/1     Running   0          3m
          study-tracker-6d9f8b7c5b-p8m7w   1/1     Running   0          3m
          pod "study-tracker-6d9f8b7c5b-4kq2x" deleted
          NAME                             READY   STATUS    RESTARTS   AGE
          study-tracker-6d9f8b7c5b-p8m7w   1/1     Running   0          3m
          study-tracker-6d9f8b7c5b-xz7tq   0/1     Running   0          4s
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A short-lived AKS cluster for Study Tracker',
    intro: "Optional and billed by the hour: plan to create, test and delete the cluster in one sitting. Register the service with your sign-up account, then run the rest as `studyadmin`. Save the YAML from Try it yourself as `k8s.yaml`, with your registry's name in the image line. The pod names in the output will differ.",
    example: {
      language: 'bash',
      code: code`
        az provider register --namespace Microsoft.ContainerService

        az aks create --name aks-study-tracker --resource-group $RG --location $LOCATION --tier free --node-count 2 --node-vm-size Standard_D4s_v5 --enable-managed-identity --generate-ssh-keys --attach-acr $ACR --tags project=study-tracker
        az aks get-credentials --name aks-study-tracker --resource-group $RG

        kubectl apply -f k8s.yaml
        kubectl get service study-tracker
      `,
      output: code`
        NAME            TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
        study-tracker   LoadBalancer   10.0.123.45   203.0.113.10   80:31234/TCP   2m
      `,
    },
    steps: [
      { code: '--tier free', explanation: "The free tier of the AKS control plane, with no uptime guarantee. You still pay for the nodes, which is most of the cost." },
      { code: '--node-count 2 --node-vm-size Standard_D4s_v5', explanation: "The smallest system node pool Microsoft's documentation allows: two nodes, each with 4 virtual processors. If you get a quota error, your subscription cannot run this size yet, so read on and skip the build." },
      { code: '--attach-acr $ACR', explanation: "Gives the cluster's nodes the AcrPull role on your registry, so they can pull Study Tracker's image without a password." },
      { code: 'az aks get-credentials --name aks-study-tracker --resource-group $RG', explanation: "Saves the cluster's connection details for `kubectl`, in a file in your home folder." },
      { code: 'kubectl apply -f k8s.yaml', explanation: "Creates the deployment and the service. Applying the same file again later only changes what is different." },
      { code: 'EXTERNAL-IP 203.0.113.10', explanation: "The public address Azure gave the service, shown as `<pending>` for the first minute or two. Open `http://` followed by your address and `/docs`. This demo uses plain HTTP, unlike Container Apps, which set up HTTPS for you." },
    ],
  },
  tryIt: {
    instructions: [
      'Without creating anything, compare running Study Tracker on Container Apps and on AKS: write three things AKS would make you manage that Container Apps does not.',
      'Optional, billed hourly: create the cluster with the commands above, apply the YAML below, open the app, then delete one pod and watch a replacement appear.',
      'Change `replicas` to 3 in the YAML, run `kubectl apply -f k8s.yaml` again and check `kubectl get pods`.',
      'Clean up straight away: `az aks delete --name aks-study-tracker --resource-group $RG --yes --no-wait`. This also removes the nodes, the public IP and the extra resource group AKS created for them. Check the portal an hour later to confirm they are gone.',
    ],
    files: [{ language: 'text', filename: 'k8s.yaml', code: k8sManifest }],
  },
  mistakes: [
    { mistake: 'Choosing Kubernetes because it is popular.', fix: 'Start from requirements. For a single API, a managed container service is usually simpler and cheaper.' },
    { mistake: 'Leaving a cluster running after an experiment.', fix: 'Nodes are charged every hour. Delete the cluster as soon as you are done.' },
    { mistake: 'Fixing a broken pod by hand.', fix: 'Change the YAML and apply it again. Kubernetes replaces pods, so manual fixes vanish.' },
    { mistake: 'A service selector that does not match the pod labels.', fix: 'Use the same label in the deployment\'s template and the service\'s selector, or the service will send traffic nowhere.' },
  ],
  quiz: [
    {
      question: 'A deployment asks for 2 replicas. You delete one of the pods. What happens?',
      options: [
        { text: 'The app runs with 1 pod until you redeploy', explanation: 'The deployment still wants 2, so Kubernetes acts without you.' },
        { text: 'The whole deployment is deleted', explanation: 'Deleting a pod does not delete the deployment that created it.' },
        { text: 'Kubernetes starts a new pod so that 2 are running again', explanation: 'It keeps comparing what is running with what the deployment asks for, and fixes the difference.' },
        { text: 'The service stops working completely', explanation: 'The other pod keeps serving while the replacement starts.' },
      ],
      answer: 2,
    },
    {
      question: 'Your service shows an external IP, but every request times out. The deployment labels pods `app: study-tracker`. The service selector says `app: studytracker`. What is wrong?',
      options: [
        { text: 'The selector does not match the pod labels, so the service has no pods to send traffic to', explanation: 'Labels must match exactly. The missing hyphen means the service selects nothing.' },
        { text: 'The image is missing from the registry', explanation: 'Then the pods would fail to start, which `kubectl get pods` would show.' },
        { text: 'LoadBalancer services only work with Container Apps', explanation: 'LoadBalancer is a standard Kubernetes service type.' },
        { text: 'The cluster needs more nodes', explanation: 'Node count does not affect whether a service finds its pods.' },
      ],
      answer: 0,
    },
    {
      question: 'Study Tracker is one API plus a weekly job, run by one developer. Which platform fits best?',
      options: [
        { text: 'AKS, because Kubernetes is the industry standard', explanation: 'Being standard does not make it the right size. It adds a cluster to manage and pay for.' },
        { text: 'A virtual machine running Kubernetes installed by hand', explanation: 'That combines the work of Kubernetes with the work of a VM.' },
        { text: 'One AKS cluster per feature', explanation: 'Each cluster multiplies the cost and the work.' },
        { text: 'Container Apps for the API and Functions for the weekly job', explanation: 'Managed services that scale to zero match the size of the job.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Kubernetes keeps containers matching the state you describe, which is powerful for large platforms, but for an app like Study Tracker a managed container service gives most of the benefit at a fraction of the cost and work.',
  resources: [
    { title: 'Kubernetes basics', provider: 'Kubernetes', description: 'The official interactive tutorial on clusters, deployments and services.', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' },
    { title: 'What is Azure Kubernetes Service?', provider: 'Microsoft Learn', description: 'What AKS manages for you and what you manage yourself.', url: 'https://learn.microsoft.com/en-us/azure/aks/what-is-aks' },
    { title: 'System node pools', provider: 'Microsoft Learn', description: 'The minimum node size and count rules mentioned in this lesson.', url: 'https://learn.microsoft.com/en-us/azure/aks/use-system-pools' },
    { title: 'Compare container options in Azure', provider: 'Microsoft Learn', description: 'Container Apps, AKS and other services side by side.', url: 'https://learn.microsoft.com/en-us/azure/container-apps/compare-options' },
  ],
  underTheHood: {
    heading: 'Desired state and the control loop',
    paragraphs: [
      "Kubernetes never runs a list of steps like a script. You give it a desired state, such as two replicas of this image, stored in its database by the API server. Separate programs called controllers then run a loop forever: look at what actually exists, compare it with what is wanted, and act to close the gap.",
      "When you deleted a pod, the deployment's controller noticed only one existed, created a new pod object, and the scheduler picked a node for it. On that node, a program called the kubelet saw a pod assigned to it, pulled the image and started the container. No single command made that happen: several loops each did their small part.",
      "This design is why Kubernetes heals itself and why `kubectl apply` is safe to repeat: applying the same file twice describes the same state, so the second time nothing needs to change. It is also why changes made by hand get undone. The controllers are always pulling reality back toward what the YAML says.",
    ],
  },
}

export default lesson
