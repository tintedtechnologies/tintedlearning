import { code } from './helpers'

/** Variables every Google Cloud lesson starts with. The suffix and IDs are examples: use your own. */
export const gcpVariablesBash = code`
  PROJECT_ID=study-tracker-jd4821
  REGION=us-central1
  SUFFIX=jd4821
  gcloud config set project $PROJECT_ID
`

export const gcpVariablesPowerShell = code`
  $PROJECT_ID = "study-tracker-jd4821"
  $REGION = "us-central1"
  $SUFFIX = "jd4821"
  gcloud config set project $PROJECT_ID
`

export const gcpAlertPolicyJson = code`
  {
    "displayName": "study-tracker server errors",
    "combiner": "OR",
    "conditions": [
      {
        "displayName": "More than 5 server errors in 5 minutes",
        "conditionThreshold": {
          "filter": "resource.type = \"cloud_run_revision\" AND resource.labels.service_name = \"study-tracker\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class = \"5xx\"",
          "aggregations": [
            { "alignmentPeriod": "300s", "perSeriesAligner": "ALIGN_SUM", "crossSeriesReducer": "REDUCE_SUM" }
          ],
          "comparison": "COMPARISON_GT",
          "thresholdValue": 5,
          "duration": "0s"
        }
      }
    ],
    "userLabels": { "project": "study-tracker" }
  }
`
