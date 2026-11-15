/**
 * Shared AWS commands and files for the AWS Cloud Engineering track, so every lesson uses the same names.
 * Every aws command is checked against the AWS CLI's own help, and JSON files against the AWS API models.
 */
import { code } from './helpers'

export const awsVariablesBash = code`
  export AWS_PROFILE=study
  REGION=us-east-1
  SUFFIX=jd4821
`

export const awsVariablesPowerShell = code`
  $env:AWS_PROFILE = "study"
  $REGION = "us-east-1"
  $SUFFIX = "jd4821"
`

export const awsBudgetJson = code`
  {
    "BudgetName": "study-tracker-budget",
    "BudgetLimit": { "Amount": "10", "Unit": "USD" },
    "BudgetType": "COST",
    "TimeUnit": "MONTHLY"
  }
`

export const awsNotificationsJson = code`
  [
    {
      "Notification": { "NotificationType": "ACTUAL", "ComparisonOperator": "GREATER_THAN", "Threshold": 50, "ThresholdType": "PERCENTAGE" },
      "Subscribers": [{ "SubscriptionType": "EMAIL", "Address": "you@example.com" }]
    },
    {
      "Notification": { "NotificationType": "ACTUAL", "ComparisonOperator": "GREATER_THAN", "Threshold": 100, "ThresholdType": "PERCENTAGE" },
      "Subscribers": [{ "SubscriptionType": "EMAIL", "Address": "you@example.com" }]
    },
    {
      "Notification": { "NotificationType": "FORECASTED", "ComparisonOperator": "GREATER_THAN", "Threshold": 100, "ThresholdType": "PERCENTAGE" },
      "Subscribers": [{ "SubscriptionType": "EMAIL", "Address": "you@example.com" }]
    }
  ]
`

export const trustEcsTasksJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": { "Service": "ecs-tasks.amazonaws.com" },
        "Action": "sts:AssumeRole"
      }
    ]
  }
`

export const resourceQueryJson = code`
  {
    "Type": "TAG_FILTERS_1_0",
    "Query": "{\"ResourceTypeFilters\":[\"AWS::AllSupported\"],\"TagFilters\":[{\"Key\":\"project\",\"Values\":[\"study-tracker\"]}]}"
  }
`

export const readNotesPolicyJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      { "Effect": "Allow", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::study-notes-jd4821" },
      { "Effect": "Allow", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::study-notes-jd4821/*" }
    ]
  }
`

export const trustEcsJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": { "Service": "ecs.amazonaws.com" },
        "Action": "sts:AssumeRole"
      }
    ]
  }
`

export const expressServiceJson = code`
  {
    "serviceName": "study-tracker",
    "executionRoleArn": "arn:aws:iam::123456789012:role/study-tracker-execution-role",
    "infrastructureRoleArn": "arn:aws:iam::123456789012:role/study-tracker-infrastructure-role",
    "taskRoleArn": "arn:aws:iam::123456789012:role/study-tracker-task-role",
    "healthCheckPath": "/totals",
    "primaryContainer": {
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/study-tracker:v1",
      "containerPort": 8000,
      "awsLogsConfiguration": { "logGroup": "/ecs/study-tracker", "logStreamPrefix": "app" },
      "environment": [
        { "name": "LOG_LEVEL", "value": "INFO" },
        { "name": "NOTES_BUCKET", "value": "study-notes-jd4821" }
      ]
    },
    "networkConfiguration": {
      "subnets": ["REPLACE-WITH-PUB1", "REPLACE-WITH-PUB2"],
      "securityGroups": ["REPLACE-WITH-SG_APP"]
    },
    "cpu": "256",
    "memory": "512",
    "scalingTarget": { "minTaskCount": 1, "maxTaskCount": 2 },
    "tags": [{ "key": "project", "value": "study-tracker" }]
  }
`

export const updateServiceJson = code`
  {
    "serviceArn": "REPLACE-WITH-SERVICE_ARN",
    "primaryContainer": {
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/study-tracker:v2",
      "containerPort": 8000,
      "awsLogsConfiguration": { "logGroup": "/ecs/study-tracker", "logStreamPrefix": "app" },
      "environment": [
        { "name": "LOG_LEVEL", "value": "INFO" },
        { "name": "NOTES_BUCKET", "value": "study-notes-jd4821" }
      ]
    }
  }
`

export const readDatabaseUrlPolicyJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "ssm:GetParameters",
        "Resource": "arn:aws:ssm:us-east-1:123456789012:parameter/study-tracker/database-url"
      }
    ]
  }
`

export const updateServiceDbJson = code`
  {
    "serviceArn": "REPLACE-WITH-SERVICE_ARN",
    "primaryContainer": {
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/study-tracker:v3",
      "containerPort": 8000,
      "awsLogsConfiguration": { "logGroup": "/ecs/study-tracker", "logStreamPrefix": "app" },
      "environment": [
        { "name": "LOG_LEVEL", "value": "INFO" },
        { "name": "NOTES_BUCKET", "value": "study-notes-jd4821" }
      ],
      "secrets": [
        { "name": "DATABASE_URL", "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/study-tracker/database-url" }
      ]
    }
  }
`

export const trustLambdaJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": { "Service": "lambda.amazonaws.com" },
        "Action": "sts:AssumeRole"
      }
    ]
  }
`

export const writeSummariesPolicyJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      { "Effect": "Allow", "Action": "s3:PutObject", "Resource": "arn:aws:s3:::study-summaries-jd4821/*" }
    ]
  }
`

export const trustSchedulerJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": { "Service": "scheduler.amazonaws.com" },
        "Action": "sts:AssumeRole"
      }
    ]
  }
`

export const invokeLambdaPolicyJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "lambda:InvokeFunction",
        "Resource": "arn:aws:lambda:us-east-1:123456789012:function:study-tracker-weekly-summary"
      }
    ]
  }
`

export const scheduleTargetJson = code`
  {
    "Arn": "arn:aws:lambda:us-east-1:123456789012:function:study-tracker-weekly-summary",
    "RoleArn": "arn:aws:iam::123456789012:role/study-tracker-scheduler-role"
  }
`

export const readDatabaseSecretPolicyJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "secretsmanager:GetSecretValue",
        "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:study-tracker/database-url-*"
      }
    ]
  }
`

export const updateServiceSecretJson = code`
  {
    "serviceArn": "REPLACE-WITH-SERVICE_ARN",
    "primaryContainer": {
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/study-tracker:v3",
      "containerPort": 8000,
      "awsLogsConfiguration": { "logGroup": "/ecs/study-tracker", "logStreamPrefix": "app" },
      "environment": [
        { "name": "LOG_LEVEL", "value": "INFO" },
        { "name": "NOTES_BUCKET", "value": "study-notes-jd4821" }
      ],
      "secrets": [
        { "name": "DATABASE_URL", "valueFrom": "REPLACE-WITH-SECRET_ARN" }
      ]
    }
  }
`

export const requireProjectTagPolicyJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "RequireProjectTag",
        "Effect": "Deny",
        "Action": ["secretsmanager:CreateSecret", "ecr:CreateRepository", "lambda:CreateFunction"],
        "Resource": "*",
        "Condition": { "Null": { "aws:RequestTag/project": "true" } }
      }
    ]
  }
`

export const awsTagLoopPowerShell = code`
  $ARNS = (aws resourcegroupstaggingapi get-resources --tag-filters Key=project,Values=study-tracker --query "ResourceTagMappingList[].ResourceARN" --output text) -split '\s+'
  foreach ($ARN in $ARNS) {
    aws resourcegroupstaggingapi tag-resources --resource-arn-list $ARN --tags environment=learning,owner=studyadmin --query "FailedResourcesMap" --output text
  }
`

export const invokeModelsPolicyJson = code`
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"],
        "Resource": [
          "arn:aws:bedrock:us-east-1::foundation-model/REPLACE-WITH-CHAT_MODEL",
          "arn:aws:bedrock:us-east-1::foundation-model/REPLACE-WITH-EMBED_MODEL"
        ]
      }
    ]
  }
`

export const updateServiceAiJson = code`
  {
    "serviceArn": "REPLACE-WITH-SERVICE_ARN",
    "primaryContainer": {
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/study-tracker:v4",
      "containerPort": 8000,
      "awsLogsConfiguration": { "logGroup": "/ecs/study-tracker", "logStreamPrefix": "app" },
      "environment": [
        { "name": "LOG_LEVEL", "value": "INFO" },
        { "name": "NOTES_BUCKET", "value": "study-notes-jd4821" },
        { "name": "AI_AUTH", "value": "aws" },
        { "name": "AWS_REGION", "value": "us-east-1" },
        { "name": "AI_BASE_URL", "value": "https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1" },
        { "name": "AI_MODEL", "value": "REPLACE-WITH-CHAT_MODEL" },
        { "name": "AI_EMBED_MODEL", "value": "REPLACE-WITH-EMBED_MODEL" }
      ],
      "secrets": [
        { "name": "DATABASE_URL", "valueFrom": "REPLACE-WITH-SECRET_ARN" }
      ]
    }
  }
`

export const indexOverridesJson = code`
  {
    "containerOverrides": [
      {
        "name": "REPLACE-WITH-CONTAINER_NAME",
        "command": ["sh", "-c", "python sync_notes.py && python index_notes.py"]
      }
    ]
  }
`
