/**
 * Shared Azure commands and files for the Azure Cloud Engineering track, so every lesson uses
 * the same names. Every az command here is checked against the Azure CLI's own help.
 */
import { code } from './helpers'

export const azureVariablesBash = code`
  RG=rg-study-tracker
  LOCATION=eastus
  SUFFIX=jd4821
`

export const azureVariablesPowerShell = code`
  $RG = "rg-study-tracker"
  $LOCATION = "eastus"
  $SUFFIX = "jd4821"
`

export const budgetJson = code`
  {
    "properties": {
      "category": "Cost",
      "amount": 10,
      "timeGrain": "Monthly",
      "timePeriod": {
        "startDate": "2026-11-01T00:00:00Z",
        "endDate": "2027-10-31T00:00:00Z"
      },
      "notifications": {
        "actual-50-percent": {
          "enabled": true,
          "operator": "GreaterThanOrEqualTo",
          "threshold": 50,
          "thresholdType": "Actual",
          "contactEmails": ["you@example.com"]
        },
        "actual-100-percent": {
          "enabled": true,
          "operator": "GreaterThanOrEqualTo",
          "threshold": 100,
          "thresholdType": "Actual",
          "contactEmails": ["you@example.com"]
        },
        "forecast-100-percent": {
          "enabled": true,
          "operator": "GreaterThanOrEqualTo",
          "threshold": 100,
          "thresholdType": "Forecasted",
          "contactEmails": ["you@example.com"]
        }
      }
    }
  }
`

export const policyParamsJson = code`
  {
    "tagName": { "value": "project" }
  }
`

export const tagLoopPowerShell = code`
  foreach ($ID in az resource list --resource-group $RG --query "[].id" -o tsv) {
    az tag update --resource-id $ID --operation merge --tags project=study-tracker environment=learning owner=studyadmin --output none
  }
`
