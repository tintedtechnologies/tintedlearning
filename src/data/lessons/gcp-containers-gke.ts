import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { k8sManifestGcp } from './study-tracker'

const lesson: StructuredLesson = {
  assumes: 'Deploy a Google Cloud workload, with Study Tracker\'s image in Artifact Registry, and the network from lesson 4. Set the track variables. The hands-on part is optional: it costs more per hour than anything else in this track.',
  goals: [
    'Decide when Kubernetes on GKE is worth its extra work, and when Cloud Run is enough',
    'Describe a Kubernetes deployment and a load-balanced service in YAML',
    'Run Study Tracker on a short-lived GKE Autopilot cluster, then delete it',
  ],
  bigIdea: "Kubernetes runs containers across a group of machines, a cluster, and keeps them matching the state you describe in YAML files. GKE, Google Kubernetes Engine, runs the Kubernetes control plane for you, and Autopilot mode also manages the machines, called nodes, charging for what your pods request. It is widely used and very flexible, but for one API, Cloud Run does the same job with far less to learn and run.",
  whyItMatters: "Kubernetes appears in many job adverts, and Google created it, so GKE is a natural place to see how it works. But putting Study Tracker on GKE because it sounds professional means paying for a cluster every hour, keeping it updated and learning a second set of tools, for an app Cloud Run already runs well and scales to zero. Knowing when each one fits is the skill that matters.",
  goalSections: [
    {
      heading: 'When GKE is worth it',
      paragraphs: [
        "Kubernetes pays off for many services that need fine control: custom networking between them, special hardware such as graphics processors, long-running background workers, its huge ecosystem of add-ons, or the same platform across several clouds and your own data centers. Organizations that run it usually have a platform team for it.",
        "For one web API and a few jobs, Cloud Run gives you scaling, safe revisions and private networking without a cluster, and it scales to zero. Cloud Run itself is built on Kubernetes ideas, without asking you to manage them.",
        "GKE charges a management fee for each cluster, by the hour, plus Autopilot's charge for the CPU and memory your pods request. Check Google's GKE pricing page for current amounts and free-tier details, and plan to delete a learning cluster the same day.",
      ],
      example: {
        language: 'text',
        code: code`
                               Cloud Run                   GKE Autopilot
          You manage           image and settings          YAML, cluster version, add-ons
          Idle cost            near zero (scales to zero)  cluster fee, plus running pods
          Fine control         limited                     almost everything
          Fits Study Tracker   yes                         only to learn Kubernetes
        `,
      },
    },
    {
      heading: 'Deployments and load-balanced services',
      paragraphs: [
        "A deployment says which image to run and how many copies, called replicas, to keep. Kubernetes runs each copy as a pod and replaces any that fail. A readiness probe tells it when a pod can receive traffic, and resource requests tell Autopilot how much CPU and memory each pod needs, which is also what you pay for.",
        "A service of type `LoadBalancer` gives the pods one address. On GKE it creates an external passthrough Network Load Balancer with a public IP address by default. An annotation, `networking.gke.io/load-balancer-type: \"Internal\"`, would make it reachable only inside the VPC instead.",
        "Labels connect the two: the deployment marks pods with `app: study-tracker`, and the service sends traffic to pods with that label.",
      ],
      example: {
        language: 'text',
        code: code`
          Service study-tracker   type LoadBalancer, external by default, port 80
             | selects pods labeled app: study-tracker
          Deployment study-tracker, replicas: 2
             |-- pod 1: the image from Artifact Registry, port 8000, ready when /totals answers
             |-- pod 2: same
        `,
      },
    },
    {
      heading: 'gcloud and kubectl',
      paragraphs: [
        "`gcloud container clusters create-auto` creates an Autopilot cluster in one command, here in `vpc-study-tracker` with a new subnet of its own. `get-credentials` then saves the connection details for `kubectl`, the Kubernetes tool that comes with Docker Desktop, which signs in through a small plugin, `gke-gcloud-auth-plugin`.",
        "Delete a pod by hand and Kubernetes starts a replacement within seconds, because the deployment still asks for two. On Autopilot, the first pods can take a few minutes while Google adds nodes to fit them.",
        "This demo keeps SQLite inside each pod, so the two pods do not share data. Connecting pods to Cloud SQL and giving them their own service account, through Workload Identity Federation for GKE, is more work than a short experiment needs.",
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
          study-tracker-6b8f7c9d4f-5kq2v   1/1     Running   0          4m
          study-tracker-6b8f7c9d4f-tz8wn   1/1     Running   0          4m
          pod "study-tracker-6b8f7c9d4f-5kq2v" deleted
          NAME                             READY   STATUS    RESTARTS   AGE
          study-tracker-6b8f7c9d4f-tz8wn   1/1     Running   0          4m
          study-tracker-6b8f7c9d4f-x7m4r   0/1     Running   0          5s
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'A short-lived GKE cluster for Study Tracker',
    intro: "Optional and billed by the hour: create, test and delete the cluster in one sitting. Save the YAML from Try it yourself as `k8s.yaml`, with your project ID in the image line. Creating the cluster takes several minutes.",
    example: {
      language: 'bash',
      code: code`
        gcloud services enable container.googleapis.com
        gcloud components install gke-gcloud-auth-plugin
        gcloud container clusters create-auto study-tracker --region $REGION --network vpc-study-tracker --create-subnetwork name=snet-gke --labels project=study-tracker
        gcloud container clusters get-credentials study-tracker --region $REGION
        kubectl apply -f k8s.yaml
        kubectl get service study-tracker
      `,
      output: code`
        NAME            TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE
        study-tracker   LoadBalancer   34.118.229.104   203.0.113.25    80:31544/TCP   2m
      `,
    },
    steps: [
      { code: 'gcloud components install gke-gcloud-auth-plugin', explanation: "Installs the plugin `kubectl` uses to sign in to GKE with your Google login. If you installed the CLI with a package manager, install the plugin with the same package manager instead." },
      { code: 'gcloud container clusters create-auto study-tracker --region $REGION', explanation: "Creates an Autopilot cluster, with Google managing the control plane and the nodes. A regional cluster spreads across the region's zones." },
      { code: '--network vpc-study-tracker --create-subnetwork name=snet-gke', explanation: "Places the cluster in Study Tracker's network, in a new subnet with ranges for nodes, pods and services chosen automatically." },
      { code: 'gcloud container clusters get-credentials study-tracker --region $REGION', explanation: "Writes the connection details `kubectl` needs into its configuration file." },
      { code: 'kubectl apply -f k8s.yaml', explanation: "Creates the deployment and service. If pods show `ImagePullBackOff`, the nodes' service account needs the Artifact Registry Reader role on the repository." },
      { code: 'EXTERNAL-IP 203.0.113.25', explanation: "The load balancer's public address, yours will differ, which can take a minute to appear. Open `http://` followed by the address and `/docs`. This demo uses plain HTTP." },
    ],
  },
  tryIt: {
    instructions: [
      'Without creating anything, list three things GKE would make you manage that Cloud Run does not.',
      'Optional, billed hourly: create the cluster, apply the YAML below and open the app. Delete one pod and watch it come back.',
      'Change `replicas` to 3, apply the file again and check `kubectl get pods`.',
      'Clean up straight away: delete the service first so its load balancer is removed, with `kubectl delete -f k8s.yaml`, then `gcloud container clusters delete study-tracker --region $REGION --quiet`. If `snet-gke` remains afterward, delete it with `gcloud compute networks subnets delete snet-gke --region $REGION --quiet`.',
    ],
    files: [{ language: 'text', filename: 'k8s.yaml', code: k8sManifestGcp }],
  },
  mistakes: [
    { mistake: 'Choosing GKE because Kubernetes is popular.', fix: 'Start from requirements. For a single API, Cloud Run is usually simpler and cheaper.' },
    { mistake: 'Leaving a cluster running after an experiment.', fix: 'The cluster fee and pods are charged every hour. Delete the cluster the same day.' },
    { mistake: 'Forgetting that GKE load balancers are public by default.', fix: 'Add the internal annotation to services that should only be reachable inside the VPC.' },
    { mistake: 'Requesting far more CPU and memory than pods use.', fix: 'Autopilot charges for requests, so size them to what the app really needs.' },
  ],
  quiz: [
    {
      question: 'You apply a GKE service of type `LoadBalancer` with no annotations. Who can reach its address?',
      options: [
        { text: 'Only pods in the same cluster', explanation: 'That describes a ClusterIP service, not a LoadBalancer.' },
        { text: 'Anyone on the internet, because GKE creates an external load balancer by default', explanation: 'Add the internal annotation to keep it inside the VPC.' },
        { text: 'Only resources in the same VPC', explanation: 'That needs the internal load balancer annotation.' },
        { text: 'Nobody until you add a firewall rule in the console', explanation: 'GKE configures what the load balancer needs.' },
      ],
      answer: 1,
    },
    {
      question: 'A deployment asks for 2 replicas. A node fails and one pod is lost. What happens?',
      options: [
        { text: 'The app runs with one pod until you redeploy', explanation: 'The deployment still wants 2, so Kubernetes acts without you.' },
        { text: 'The whole cluster stops', explanation: 'Losing one node does not stop the cluster.' },
        { text: 'The service is deleted', explanation: 'Services stay. They send traffic to whichever pods are ready.' },
        { text: 'Kubernetes starts a replacement pod, on another node if needed, to get back to 2', explanation: 'It keeps comparing what is running with what the deployment asks for.' },
      ],
      answer: 3,
    },
    {
      question: 'Study Tracker is one API and a weekly job, run by one person. Which Google Cloud setup fits best?',
      options: [
        { text: 'Cloud Run for the API and a Cloud Run function for the weekly job', explanation: 'Managed services sized to the job, both able to scale to zero.' },
        { text: 'A GKE cluster, because Google created Kubernetes', explanation: 'Who created it does not make it the right size for one API.' },
        { text: 'One GKE cluster per feature', explanation: 'Each cluster multiplies the hourly cost and the work.' },
        { text: 'Compute Engine machines with Kubernetes installed by hand', explanation: 'That combines the work of Kubernetes with the work of managing servers.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Kubernetes on GKE keeps containers matching the state you describe, which suits large platforms, but for an app like Study Tracker, Cloud Run gives most of the benefit, scales to zero and needs far less work.',
  resources: [
    { title: 'GKE overview', provider: 'Google Cloud Documentation', description: 'What GKE manages and what you manage.', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview' },
    { title: 'Autopilot overview', provider: 'Google Cloud Documentation', description: 'How Autopilot manages nodes and charges for pod requests.', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview' },
    { title: 'LoadBalancer Service concepts', provider: 'Google Cloud Documentation', description: 'External and internal load balancers for GKE services.', url: 'https://docs.cloud.google.com/kubernetes-engine/docs/concepts/service-load-balancer' },
    { title: 'GKE pricing', provider: 'Google Cloud', description: 'The cluster management fee, Autopilot charges and free tier.', url: 'https://cloud.google.com/kubernetes-engine/pricing' },
  ],
  underTheHood: {
    heading: 'What Autopilot changes',
    paragraphs: [
      "A Kubernetes cluster has two halves. The control plane holds the desired state and runs the controllers that keep reality matching it. GKE always manages that half for you. The nodes are the machines where pods actually run.",
      "In GKE Standard mode, you create node pools yourself: you choose machine types, how many nodes to run and when to upgrade them, and you pay for the machines whether pods fill them or not.",
      "In Autopilot mode, Google manages the nodes too. When a pod cannot be placed, Autopilot adds a suitable node, and removes nodes that sit empty. You pay for the CPU and memory your pods request rather than for whole machines, so oversized requests waste money directly. Autopilot also applies security defaults and blocks some risky settings, such as privileged containers.",
      "That narrows the gap with Cloud Run, but it does not close it: you still write Kubernetes YAML, keep up with cluster versions and pay the cluster fee while it exists, even with no traffic.",
    ],
  },
}

export default lesson
