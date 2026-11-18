import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Azure networking, with `vnet-study-tracker` and its subnets, and the Docker lesson from Software Engineering, with Docker Desktop running. Set the track variables, plus `STORAGE` from lesson 3.',
  goals: [
    'Push Study Tracker\'s image to a private container registry',
    'Run the image on Azure Container Apps inside your virtual network, pulling it with a managed identity',
    'Reach the running app from a browser and explain where its data lives for now',
  ],
  bigIdea: "Deploying a container takes two places: a registry that stores the image, and a service that runs it. Azure Container Registry stores Study Tracker's image privately, and Azure Container Apps runs it with HTTPS, scaling and logs handled for you. The app pulls its own image with the managed identity from lesson 2, so no registry password exists anywhere.",
  whyItMatters: "Until now Study Tracker has run only where you were sitting. After this lesson it has a public HTTPS address that anyone you choose can open on their phone, built from the same image you tested locally. That is the moment a project becomes a service, and it is also the moment costs and security start to matter, which is why the earlier lessons came first.",
  goalSections: [
    {
      heading: 'A private registry for the image',
      paragraphs: [
        "Azure Container Registry, or ACR, stores container images. Study Tracker uses the Basic tier, the smallest, with the admin account turned off, so the only way in is through Microsoft Entra ID and roles. A registry's name must be unique across Azure, so it uses your `SUFFIX`.",
        "Build the image with Docker and push it with `az acr login`, which signs Docker in to the registry with your Azure identity. ACR can also build in the cloud with `az acr build`, but Microsoft's documentation says those builds are paused for free-credit subscriptions, so this track builds locally.",
        "On a Mac with an Apple processor, Docker builds images for ARM processors by default, while Container Apps runs standard x86 processors. Add `--platform linux/amd64` to the build, or the app will fail to start with an error about the image format.",
      ],
      example: {
        language: 'text',
        code: code`
          docker build  ->  image on your laptop
          docker push   ->  acrstudyjd4821.azurecr.io/study-tracker:v1
          Container App ->  pulls the image using id-study-tracker (AcrPull role)
        `,
      },
    },
    {
      heading: 'Running it on Container Apps',
      paragraphs: [
        "Container Apps groups apps into an environment, which is attached to `snet-apps`, the subnet you created for it, and sends container logs to a Log Analytics workspace, Azure's log store. Lesson 8 queries those logs.",
        "The container app itself says which image to run, which port the app listens on, 8000 for Study Tracker, and that ingress is external, meaning it gets a public HTTPS address. It uses `id-study-tracker` both as its identity and to pull from the registry, after that identity is given the AcrPull role.",
        "Scaling settings control cost. With a minimum of 0 copies, called replicas, the app scales to zero when nobody uses it and starts again on the next request, which takes a few seconds. Small sizes, a quarter of a processor core and half a gigabyte of memory, are plenty for Study Tracker.",
      ],
      example: {
        language: 'text',
        code: code`
          Environment cae-study-tracker      in snet-apps, logs to log-study-tracker
            Container app ca-study-tracker
              image       acrstudyjd4821.azurecr.io/study-tracker:v1
              port        8000, external HTTPS ingress
              identity    id-study-tracker (also used to pull the image)
              replicas    0 to 2
              size        0.25 CPU, 0.5 GiB memory
        `,
      },
    },
    {
      heading: 'Where the data lives, for now',
      paragraphs: [
        "Study Tracker still saves sessions to SQLite, now on the container's own disk. That disk disappears whenever the container stops, which happens every time the app scales to zero. So sessions you save now are temporary, exactly the problem the Docker lesson solved with a volume.",
        "The real fix is a managed database, which lesson 9 adds. Until then, treat this deployment as a test of the pipeline from image to public address.",
        "The AI features need a model. With no `AI_MODEL` set they return the friendly unavailable message from Designing AI Products, while sessions and totals keep working. Lesson 15 connects a model hosted in Azure.",
      ],
      example: {
        language: 'text',
        code: code`
          Works now                         Temporary or unavailable until later
          GET /docs, POST /sessions          sessions vanish when the app scales to zero (lesson 9)
          GET /totals                        notes assistant and planner: 503 until lesson 15
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Deploying Study Tracker',
    intro: "Run these from your `study-tracker` folder. The first three commands register Azure services for the subscription, which only the subscription owner can do, so run them with your sign-up account, then sign in again as `studyadmin` for the rest. In PowerShell, set variables as `$NAME = ...`.",
    example: {
      language: 'bash',
      code: code`
        az provider register --namespace Microsoft.App
        az provider register --namespace Microsoft.OperationalInsights
        az provider register --namespace Microsoft.ContainerRegistry

        ACR=acrstudy$SUFFIX
        az acr create --name $ACR --resource-group $RG --location $LOCATION --sku Basic --admin-enabled false --tags project=study-tracker
        az acr login --name $ACR
        docker build --platform linux/amd64 -t $ACR.azurecr.io/study-tracker:v1 .
        docker push $ACR.azurecr.io/study-tracker:v1

        IDENTITY_ID=$(az identity show --name id-study-tracker --resource-group $RG --query id -o tsv)
        APP_ID=$(az identity show --name id-study-tracker --resource-group $RG --query principalId -o tsv)
        az role assignment create --assignee-object-id $APP_ID --assignee-principal-type ServicePrincipal --role AcrPull --scope $(az acr show --name $ACR --query id -o tsv)

        az monitor log-analytics workspace create --resource-group $RG --workspace-name log-study-tracker --location $LOCATION
        LOG_ID=$(az monitor log-analytics workspace show --resource-group $RG --workspace-name log-study-tracker --query customerId -o tsv)
        LOG_KEY=$(az monitor log-analytics workspace get-shared-keys --resource-group $RG --workspace-name log-study-tracker --query primarySharedKey -o tsv)
        SUBNET_ID=$(az network vnet subnet show --resource-group $RG --vnet-name vnet-study-tracker --name snet-apps --query id -o tsv)
        az containerapp env create --name cae-study-tracker --resource-group $RG --location $LOCATION --infrastructure-subnet-resource-id $SUBNET_ID --logs-destination log-analytics --logs-workspace-id $LOG_ID --logs-workspace-key $LOG_KEY --tags project=study-tracker

        az containerapp create --name ca-study-tracker --resource-group $RG --environment cae-study-tracker --image $ACR.azurecr.io/study-tracker:v1 --target-port 8000 --ingress external --user-assigned $IDENTITY_ID --registry-server $ACR.azurecr.io --registry-identity $IDENTITY_ID --cpu 0.25 --memory 0.5Gi --min-replicas 0 --max-replicas 2 --env-vars LOG_LEVEL=INFO STORAGE_ACCOUNT=$STORAGE --tags project=study-tracker
        az containerapp show --name ca-study-tracker --resource-group $RG --query properties.configuration.ingress.fqdn -o tsv
      `,
      output: 'ca-study-tracker.example-1a2b3c4d.eastus.azurecontainerapps.io',
    },
    steps: [
      { code: 'az provider register --namespace Microsoft.App', explanation: "Turns on Container Apps for your subscription. It runs once per subscription and can take a minute or two. Check with `az provider show --namespace Microsoft.App --query registrationState`." },
      { code: '--sku Basic --admin-enabled false', explanation: "The smallest registry tier, with the shared admin username and password turned off. Basic is charged per day while the registry exists, so the Clean up step matters." },
      { code: 'docker build --platform linux/amd64 -t $ACR.azurecr.io/study-tracker:v1 .', explanation: "Builds for the processor type Azure runs. The tag includes the registry's address, so `docker push` knows where to send it, and `v1` lets you deploy new versions later." },
      { code: '--role AcrPull --scope $(az acr show --name $ACR --query id -o tsv)', explanation: "Lets the app's identity pull images from this registry only. It cannot push or delete anything." },
      { code: '--logs-destination log-analytics --logs-workspace-id $LOG_ID --logs-workspace-key $LOG_KEY', explanation: "Sends container logs to the workspace you just created. The CLI's default for this setting is changing in a newer version, so the lesson sets it explicitly." },
      { code: '--registry-server $ACR.azurecr.io --registry-identity $IDENTITY_ID', explanation: "Pulls the image with the managed identity. No registry password is stored in the app." },
      { code: '--min-replicas 0 --max-replicas 2', explanation: "Scales to zero when idle, which keeps costs low, and to at most two copies under load." },
      { code: 'ca-study-tracker.example-1a2b3c4d.eastus.azurecontainerapps.io', explanation: "Your app's public address will look like this. Open it with `https://` and `/docs` on the end, and try saving a session." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the commands above. Then open `https://` followed by your app\'s address and `/docs`, save a session and call `GET /totals`.',
      'Wait about ten minutes without using the app, then call `GET /totals` again. Note the empty result: the app scaled to zero and the SQLite file went with it.',
      'Change something small in `app.py`, such as the title in `FastAPI(title=...)`, build and push it as `v2`, then run `az containerapp update --name ca-study-tracker --resource-group $RG --image $ACR.azurecr.io/study-tracker:v2` and check `/docs`.',
      'Clean up: the container app costs almost nothing while scaled to zero, but the registry is charged daily. If you will not continue within a day, delete them: `az containerapp delete --name ca-study-tracker --resource-group $RG --yes`, `az containerapp env delete --name cae-study-tracker --resource-group $RG --yes` and `az acr delete --name $ACR --resource-group $RG --yes`.',
    ],
  },
  mistakes: [
    { mistake: 'Building on an Apple-processor Mac without `--platform linux/amd64`.', fix: 'Always build for linux/amd64 when deploying to Azure, or the container fails to start.' },
    { mistake: 'Turning on the registry admin account to get things working.', fix: 'Keep it off. Give the app\'s managed identity AcrPull and sign in yourself with `az acr login`.' },
    { mistake: 'Treating data in the container as saved.', fix: 'Anything written inside a container disappears when it stops. Use a database or storage service for anything that must last.' },
    { mistake: 'Leaving the registry and app running after a lab.', fix: 'Delete what you do not need. The registry is charged every day it exists, whether used or not.' },
  ],
  quiz: [
    {
      question: 'The container app starts, then fails with an error about the image format. You built it on a Mac with an Apple processor. What is the most likely fix?',
      options: [
        { text: 'Turn on the registry admin account', explanation: 'Authentication worked, since the image was pulled. The image itself is the problem.' },
        { text: 'Rebuild with `--platform linux/amd64` and push it again', explanation: 'The image was built for ARM processors, and Container Apps runs x86 processors.' },
        { text: 'Increase the memory to 2 GiB', explanation: 'Memory does not change which processor an image was built for.' },
        { text: 'Change the target port to 80', explanation: 'A wrong port causes failed requests, not an image format error.' },
      ],
      answer: 1,
    },
    {
      question: 'You save sessions in the deployed app, come back the next day and they are gone. Why?',
      options: [
        { text: 'Azure deletes data every night', explanation: 'Azure does not delete your data. It was never stored somewhere lasting.' },
        { text: 'The registry removed the image', explanation: 'The image is still there. Sessions are not stored in the image.' },
        { text: 'The budget alert stopped the app', explanation: 'Budgets only send emails.' },
        { text: 'The app scaled to zero, and SQLite\'s file lived on the container\'s temporary disk', explanation: 'With a minimum of 0 replicas, the container stops when idle and its disk goes with it, until lesson 9 adds a database.' },
      ],
      answer: 3,
    },
    {
      question: 'How does Study Tracker\'s container app get permission to pull its image from the registry?',
      options: [
        { text: 'Its managed identity has the AcrPull role on the registry', explanation: 'The identity gets a token from Azure, and the role allows pulling, so no password is involved.' },
        { text: 'The registry admin password is stored in the app\'s settings', explanation: 'The admin account is turned off, so there is no such password.' },
        { text: 'Registries in the same resource group are always readable', explanation: 'Being in the same group gives no access by itself. Roles do.' },
        { text: 'It uses your `az login` session', explanation: 'Your laptop\'s sign-in is not available inside Azure.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Push the image to a private registry, run it on Container Apps in your own subnet, pull it with a managed identity instead of a password, and remember that anything written inside a container is temporary.',
  resources: [
    { title: 'Azure Container Apps overview', provider: 'Microsoft Learn', description: 'What Container Apps does, and how environments, revisions and scaling work.', url: 'https://learn.microsoft.com/en-us/azure/container-apps/overview' },
    { title: 'Push your first image', provider: 'Microsoft Learn', description: 'Building, tagging and pushing images to Azure Container Registry.', url: 'https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-docker-cli' },
    { title: 'Managed identity image pull', provider: 'Microsoft Learn', description: 'Pulling from a registry with a managed identity instead of a password.', url: 'https://learn.microsoft.com/en-us/azure/container-apps/managed-identity-image-pull' },
    { title: 'Azure Container Apps pricing', provider: 'Microsoft Azure', description: 'Current prices and the monthly free allowance, which change over time.', url: 'https://azure.microsoft.com/en-us/pricing/details/container-apps/' },
  ],
  underTheHood: {
    heading: 'What happens when a request wakes the app',
    paragraphs: [
      "With a minimum of zero replicas, Study Tracker has no running container while idle. A shared front door for the environment, an HTTP proxy run by Azure, still accepts requests for your app's address.",
      "When a request arrives, the proxy holds it and asks the scaler for a replica. Azure starts a container from your image, pulling it from the registry if that machine does not already have it, waits until the app is listening on port 8000, then forwards the waiting request. This first request is slower, often several seconds, and is called a cold start.",
      "Later requests go straight to the running replica. If traffic grows, the scaler adds replicas up to the maximum, and after a period with no requests it removes them again, back to zero. Cold starts are the price of paying nothing while idle. Setting the minimum to 1 removes them, at the cost of paying for one replica all the time, a trade-off the Cost Optimization lesson describes.",
    ],
  },
}

export default lesson
