import type { Lesson } from '../types/curriculum'

/**
 * The order, titles, descriptions and levels of each Cloud Engineering provider track, as set by the
 * section plan in CLAUDE.md. Every track follows the same 16-lesson structure.
 */
type TrackLesson = Pick<Lesson, 'id' | 'title' | 'description' | 'difficulty'>

export const cloudTrackPlan: Record<'azure' | 'aws' | 'gcp', TrackLesson[]> = {
  azure: [
    { id: 'azure-track', title: 'Azure Cloud Engineering Overview', description: 'How Azure is organized, and setting up an account safely with MFA, a budget alert and the Azure CLI.', difficulty: 'Beginner' },
    { id: 'azure-identity-resources', title: 'Azure Identity and Resource Organization', description: 'Roles, scopes and least privilege, with a limited daily account and a managed identity for Study Tracker.', difficulty: 'Intermediate' },
    { id: 'azure-compute-storage', title: 'Azure Compute and Storage', description: 'Choose compute and storage, and keep Study Tracker\'s notes in a locked-down Blob Storage account.', difficulty: 'Intermediate' },
    { id: 'azure-networking', title: 'Azure Networking', description: 'A virtual network with separate subnets, so only the app is public and the database stays private.', difficulty: 'Intermediate' },
    { id: 'azure-deployment', title: 'Deploy an Azure Workload', description: 'Push Study Tracker\'s image to a private registry and run it on Azure Container Apps.', difficulty: 'Intermediate' },
    { id: 'azure-infrastructure-as-code', title: 'Describe Azure Infrastructure as Code', description: 'Describe Study Tracker\'s Azure resources in a Bicep template, preview every change with what-if, and decide on drift.', difficulty: 'Intermediate' },
    { id: 'azure-troubleshooting', title: 'Troubleshoot a Failed Azure Deployment', description: 'Find the first failed operation, match its error to a cause, and fix one thing with least privilege.', difficulty: 'Intermediate' },
    { id: 'azure-operations-cost', title: 'Monitoring, Reliability, and Cost on Azure', description: 'Search Study Tracker\'s logs, get an email when errors start, and read what each part costs.', difficulty: 'Intermediate' },
    { id: 'azure-data-platforms', title: 'Azure Databases and Data Platforms', description: 'Move Study Tracker from SQLite to a private, managed PostgreSQL server with automatic backups.', difficulty: 'Intermediate' },
    { id: 'azure-containers-aks', title: 'Containers and Kubernetes on Azure', description: 'When AKS is worth it, and running Study Tracker on a short-lived Kubernetes cluster.', difficulty: 'Advanced' },
    { id: 'azure-serverless-events', title: 'Serverless and Event-Driven Systems on Azure', description: 'An Azure Function on a timer that writes Study Tracker\'s weekly summary.', difficulty: 'Intermediate' },
    { id: 'azure-security-engineering', title: 'Azure Security Engineering', description: 'Secrets in Key Vault, encryption at rest and in transit, and Defender for Cloud recommendations.', difficulty: 'Advanced' },
    { id: 'azure-resilience-disaster-recovery', title: 'Azure Resilience and Disaster Recovery', description: 'Recovery targets, redundancy choices and a timed restore of Study Tracker\'s database.', difficulty: 'Advanced' },
    { id: 'azure-governance-landing-zones', title: 'Azure Governance and Landing Zones', description: 'Tag every resource, enforce the rule with Azure Policy, and see how landing zones scale it up.', difficulty: 'Advanced' },
    { id: 'azure-ai-ml-platforms', title: 'AI and Machine Learning Platforms on Azure', description: 'Deploy models in Microsoft Foundry and point Study Tracker\'s ask_model() at them.', difficulty: 'Advanced' },
    { id: 'azure-enterprise-capstone', title: 'Azure Enterprise Architecture Capstone', description: 'Rebuild Study Tracker from one Bicep file, prove every requirement, document it and clean up.', difficulty: 'Advanced' },
  ],
  aws: [
    { id: 'aws-track', title: 'AWS Cloud Engineering Overview', description: 'How AWS is organized, and setting up an account safely with root MFA, a daily Identity Center user, a budget alert and the AWS CLI.', difficulty: 'Beginner' },
    { id: 'aws-identity-resources', title: 'AWS Identity and Resource Organization', description: 'IAM roles, policies and least privilege, with a task role for Study Tracker and a tag-based resource group.', difficulty: 'Intermediate' },
    { id: 'aws-compute-storage', title: 'AWS Compute and Storage', description: 'Choose compute and storage, and keep Study Tracker\'s notes in a private S3 bucket its role can read.', difficulty: 'Intermediate' },
    { id: 'aws-networking', title: 'AWS Networking', description: 'A VPC with public and private subnets and security groups, so only the app is public and the database stays private.', difficulty: 'Intermediate' },
    { id: 'aws-deployment', title: 'Deploy an AWS Workload', description: 'Push Study Tracker\'s image to Amazon ECR and run it on ECS Express Mode with public HTTPS.', difficulty: 'Intermediate' },
    { id: 'aws-infrastructure-as-code', title: 'Describe AWS Infrastructure as Code', description: 'Describe Study Tracker\'s AWS resources in a CloudFormation template, preview updates with change sets, and handle drift.', difficulty: 'Intermediate' },
    { id: 'aws-troubleshooting', title: 'Troubleshoot a Failed AWS Deployment', description: 'Read stack events in time order, find the first failed resource, and use CloudTrail to explain what changed.', difficulty: 'Intermediate' },
    { id: 'aws-operations-cost', title: 'Monitoring, Reliability, and Cost on AWS', description: 'Search Study Tracker\'s logs in CloudWatch, get an email when errors start, and read what each part costs.', difficulty: 'Intermediate' },
    { id: 'aws-data-platforms', title: 'AWS Databases and Data Platforms', description: 'Move Study Tracker from SQLite to a private, encrypted RDS for PostgreSQL database with automatic backups.', difficulty: 'Intermediate' },
    { id: 'aws-containers-eks', title: 'Containers and Kubernetes on AWS', description: 'When EKS is worth it, and running Study Tracker on a short-lived EKS Auto Mode cluster.', difficulty: 'Advanced' },
    { id: 'aws-serverless-events', title: 'Serverless and Event-Driven Systems on AWS', description: 'A Lambda function, started by EventBridge Scheduler, that writes Study Tracker\'s weekly summary.', difficulty: 'Intermediate' },
    { id: 'aws-security-engineering', title: 'AWS Security Engineering', description: 'Secrets in Secrets Manager, encryption at rest and in transit, and IAM Access Analyzer findings.', difficulty: 'Advanced' },
    { id: 'aws-resilience-disaster-recovery', title: 'AWS Resilience and Disaster Recovery', description: 'Recovery targets, redundancy choices, S3 versioning and a timed point-in-time restore of Study Tracker\'s database.', difficulty: 'Advanced' },
    { id: 'aws-governance-landing-zones', title: 'AWS Governance and Landing Zones', description: 'Tag every resource, deny untagged creation with a guardrail, and see how Organizations and SCPs scale it up.', difficulty: 'Advanced' },
    { id: 'aws-ai-ml-platforms', title: 'AI and Machine Learning Platforms on AWS', description: 'Call Amazon Bedrock models with Study Tracker\'s own role and point ask_model() at them, with no API key.', difficulty: 'Advanced' },
    { id: 'aws-enterprise-capstone', title: 'AWS Enterprise Architecture Capstone', description: 'Rebuild Study Tracker from one CloudFormation template, prove every requirement, document it and clean up.', difficulty: 'Advanced' },
  ],
  gcp: [
    { id: 'gcp-track', title: 'Google Cloud Engineering Overview', description: 'How Google Cloud is organized, and setting up safely with 2-Step Verification, a dedicated project, a budget alert and the gcloud CLI.', difficulty: 'Beginner' },
    { id: 'gcp-identity-resources', title: 'Google Cloud Identity and Resource Organization', description: 'IAM roles, allow policies and least privilege, with a service account for Study Tracker and no key files.', difficulty: 'Intermediate' },
    { id: 'gcp-compute-storage', title: 'Google Cloud Compute and Storage', description: 'Choose compute and storage, and keep Study Tracker\'s notes in a private Cloud Storage bucket its service account can read.', difficulty: 'Intermediate' },
    { id: 'gcp-networking', title: 'Google Cloud Networking', description: 'A custom VPC network, firewall rules and private services access, so the database will have no public address.', difficulty: 'Intermediate' },
    { id: 'gcp-deployment', title: 'Deploy a Google Cloud Workload', description: 'Push Study Tracker\'s image to Artifact Registry and run it on Cloud Run with its own service account.', difficulty: 'Intermediate' },
    { id: 'gcp-infrastructure-as-code', title: 'Describe Google Cloud Infrastructure as Code', description: 'Describe Study Tracker\'s Google Cloud resources in Terraform, save and apply reviewed plans, and keep state safe.', difficulty: 'Intermediate' },
    { id: 'gcp-troubleshooting', title: 'Troubleshoot a Failed Google Cloud Deployment', description: 'Filter Cloud Logging by severity and time, read the first error, and confirm the fix with a full deployment.', difficulty: 'Intermediate' },
    { id: 'gcp-operations-cost', title: 'Monitoring, Reliability, and Cost on Google Cloud', description: 'Search Study Tracker\'s logs in Cloud Logging, get an email when errors start, and read what each part costs.', difficulty: 'Intermediate' },
    { id: 'gcp-data-platforms', title: 'Google Cloud Databases and Data Platforms', description: 'Move Study Tracker to a private Cloud SQL for PostgreSQL instance, with its URL in Secret Manager.', difficulty: 'Intermediate' },
    { id: 'gcp-containers-gke', title: 'Containers and Kubernetes on Google Cloud', description: 'When GKE is worth it, and running Study Tracker on a short-lived GKE Autopilot cluster.', difficulty: 'Advanced' },
    { id: 'gcp-serverless-events', title: 'Serverless and Event-Driven Systems on Google Cloud', description: 'A private Cloud Run function, called by Cloud Scheduler, that writes Study Tracker\'s weekly summary.', difficulty: 'Intermediate' },
    { id: 'gcp-security-engineering', title: 'Google Cloud Security Engineering', description: 'Rotate the database password with Secret Manager versions, check encryption, and find public access.', difficulty: 'Advanced' },
    { id: 'gcp-resilience-disaster-recovery', title: 'Google Cloud Resilience and Disaster Recovery', description: 'Recovery targets, redundancy choices, soft delete and a timed point-in-time recovery of Study Tracker\'s database.', difficulty: 'Advanced' },
    { id: 'gcp-governance-landing-zones', title: 'Google Cloud Governance and Landing Zones', description: 'Label every resource, check the rule with a script in CI, and see how organizations and policies scale it up.', difficulty: 'Advanced' },
    { id: 'gcp-ai-ml-platforms', title: 'AI and Machine Learning Platforms on Google Cloud', description: 'Call Gemini models on Agent Platform with Study Tracker\'s own service account and point ask_model() at them.', difficulty: 'Advanced' },
    { id: 'gcp-enterprise-capstone', title: 'Google Cloud Enterprise Architecture Capstone', description: 'Rebuild Study Tracker from one Terraform configuration in a fresh project, prove every requirement, document it and clean up.', difficulty: 'Advanced' },
  ],
}

const planned = new Map(Object.values(cloudTrackPlan).flatMap((track) => track.map((lesson, index) => [lesson.id, { ...lesson, order: index + 1 }] as const)))

/** Applies the plan's title, description, level and position to a provider lesson, if it has one. */
export function applyCloudTrackPlan(lesson: Lesson): Lesson {
  const plan = planned.get(lesson.id)
  return plan ? { ...lesson, ...plan } : lesson
}

export function cloudTrackOrder(id: string) {
  return planned.get(id)?.order ?? Number.MAX_SAFE_INTEGER
}
