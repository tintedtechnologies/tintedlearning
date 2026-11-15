import type { StageAssessment } from '../types/curriculum'

export const stageAssessments: Record<string, StageAssessment> = {
  foundation: {
    title: 'Foundations assessment',
    instructions: 'Each question is a realistic situation from the Foundations lessons. Pick what you would do or expect.',
    questions: [
      {
        question: 'A spam filter was trained on last year\'s emails and scored 98% on a test set made from those same emails. This month it misses most new scam messages. What is the most likely reason?',
        options: ['The filter is working, since it scored 98%', 'The test set was too similar to the training emails, so the score did not show how the filter handles new messages', 'Spam filters stop learning after their first year', 'The filter needs a rule for every word, written by hand'],
        answer: 'The test set was too similar to the training emails, so the score did not show how the filter handles new messages',
        correctFeedback: 'Correct. A test only means something on examples the model did not learn from. Here the test repeated the training emails, so the high score hid the problem.',
        incorrectFeedback: 'Not quite. A high score on repeated examples does not prove the filter handles new ones. Check the score on fresh examples that the filter did not learn from.',
      },
      {
        question: 'A model predicts whether a loan will be repaid and scores 95%. One input column is the date the loan was closed, which is only known after repayment. What should the team do first?',
        options: ['Report the 95% result, since higher accuracy is always better', 'Train a larger model, which will make the score more reliable', 'Remove the column that leaks the answer, then measure again and compare with a simple baseline', 'Keep the column and collect more rows'],
        answer: 'Remove the column that leaks the answer, then measure again and compare with a simple baseline',
        correctFeedback: 'Correct. Data that is unavailable at prediction time makes the result look better than it will be in real use. Removing it and comparing with a simple baseline gives an honest picture.',
        incorrectFeedback: 'Not quite. A column from the future makes the score misleading, and a bigger model or more rows cannot fix that. Remove the leak first, then measure.',
      },
      {
        question: 'Your team runs Study Tracker on a cloud server. A teammate pushes its Docker image to a public registry, and the image contains the database password. Who is responsible for fixing this?',
        options: ['The cloud provider, because it runs the registry', 'Nobody, because registries encrypt their images', 'The container runtime, because it runs the image', 'Your team, because you chose what the image contains and who can read it'],
        answer: 'Your team, because you chose what the image contains and who can read it',
        correctFeedback: 'Correct. The provider secures the infrastructure, but you control your code, your settings and who can see what you publish. Rotate the password and keep secrets out of images.',
        incorrectFeedback: 'Not quite. The provider secures its platform, but it does not decide what you publish. Encryption does not hide a password from anyone who can pull a public image.',
      },
    ],
  },
  'software-engineering': {
    title: 'Software Engineering assessment',
    instructions: 'Each question is a situation from building Study Tracker. Pick what you would do or expect.',
    questions: [
      {
        question: 'Study Tracker returns 422 when a user saves a session with "minutes": "forty". What does that tell you?',
        options: ['The server crashed and needs restarting', 'The Pydantic model rejected the data before the endpoint ran', 'The session was saved with 0 minutes', 'The user is not logged in'],
        answer: 'The Pydantic model rejected the data before the endpoint ran',
        correctFeedback: 'Correct. FastAPI checks the body against SessionIn, and "forty" cannot become an int, so the request never reaches your code.',
        incorrectFeedback: 'Not quite. 422 means the request body broke the model\'s rules. A crash would be 500, a missing login 401, and nothing was saved.',
      },
      {
        question: 'A test that posts one session and expects id 1 passes alone but fails when the whole suite runs. What is the fix?',
        options: ['Run the tests one at a time', 'Remove the id check from the test', 'Give every test its own temporary database through a fixture', 'Delete study.db before each run by hand'],
        answer: 'Give every test its own temporary database through a fixture',
        correctFeedback: 'Correct. With tmp_path and monkeypatch, each test starts empty, so the id is always 1 and tests never touch real data.',
        incorrectFeedback: 'Not quite. The tests share data. Running them separately or deleting files by hand hides the problem, and dropping the check weakens the test.',
      },
      {
        question: 'You run Study Tracker with docker run --rm -p 8000:8000 study-tracker, save sessions, stop it and start it again. The sessions are gone. What should you change?',
        options: ['Store the database on a volume and point DATABASE_PATH at it', 'Add EXPOSE 8000 to the Dockerfile', 'Call conn.commit() in db.py', 'Rebuild the image after every session'],
        answer: 'Store the database on a volume and point DATABASE_PATH at it',
        correctFeedback: 'Correct. Files written inside a container vanish with it. -v study-data:/data with DATABASE_PATH=/data/study.db keeps them.',
        incorrectFeedback: 'Not quite. Study Tracker already commits, EXPOSE only documents a port, and rebuilding does not save data. The file must live on a volume.',
      },
    ],
  },
  'ai-engineering': {
    title: 'AI Engineering assessment',
    instructions: 'Each question is a situation from adding AI features to Study Tracker. Pick what you would do or expect.',
    questions: [
      {
        question: 'Study Tracker\'s notes assistant gives a wrong answer about the Krebs cycle, although the learner\'s notes cover it correctly. What should you check first?',
        options: ['Switch to a larger model', 'Which paragraphs the search returned for that question', 'Raise the temperature', 'Add "be accurate" to the system prompt'],
        answer: 'Which paragraphs the search returned for that question',
        correctFeedback: 'Correct. Most RAG failures start in the search. If the right note never reached the prompt, no model or wording can use it.',
        incorrectFeedback: 'Not quite. A bigger model, more randomness or a stricter prompt cannot use a note it was never given. Check what the search returned first.',
      },
      {
        question: 'The model asks to call log_session with minutes set to 900. In Study Tracker\'s assistant.py, what happens?',
        options: ['Validation refuses it, the model gets an error result, and nothing is saved', 'The session is saved, because the model asked for it', 'The minutes are quietly changed to 600 and saved', 'The whole request crashes with a ValidationError'],
        answer: 'Validation refuses it, the model gets an error result, and nothing is saved',
        correctFeedback: 'Correct. Tool arguments go through the same SessionIn rules as the form, and errors go back to the model as results instead of crashing.',
        incorrectFeedback: 'Not quite. A model\'s request is not permission: the code validates every argument, never changes values on its own and catches the error.',
      },
      {
        question: 'You want a model to answer only from a learner\'s notes. Which instruction does most to prevent made-up answers?',
        options: ['"Answer confidently and in detail."', '"Be very accurate."', 'Setting the temperature to 0', '"If the notes do not contain the answer, reply: I couldn\'t find that in your notes."'],
        answer: '"If the notes do not contain the answer, reply: I couldn\'t find that in your notes."',
        correctFeedback: 'Correct. Giving the model an approved way to say it does not know makes it far less likely to fill gaps with invented details.',
        incorrectFeedback: 'Not quite. Asking for confidence encourages guessing, "be accurate" adds no information, and temperature 0 only makes a wrong answer consistent.',
      },
    ],
  },
  'cloud-engineering': {
    title: 'Cloud Engineering assessment',
    instructions: 'Each question is a situation from running Study Tracker in the cloud, on whichever provider you chose. Pick what you would do or expect.',
    questions: [
      {
        question: 'You finish a lab late at night. Your budget alert is set. What actually protects you from a surprise bill tomorrow?',
        options: ['The budget, because it stops spending at the limit', 'Logging out of the console', 'Running the lab\'s Clean up step to delete what it created', 'Turning off the budget email so it cannot fire'],
        answer: 'Running the lab\'s Clean up step to delete what it created',
        correctFeedback: 'Correct. Budgets only send alerts, often hours later. Resources keep costing money until you delete them.',
        incorrectFeedback: 'Not quite. A budget never stops anything, and signing out leaves every resource running. Only deleting what you created stops the cost.',
      },
      {
        question: 'Study Tracker needs to read its notes bucket. Which setup is best on Azure, AWS or Google Cloud?',
        options: ['An identity attached to the app, a managed identity, IAM role or service account, with read access to that one bucket', 'An access key in the app\'s environment variables', 'An administrator role for the app, so nothing fails', 'Making the bucket public so no credentials are needed'],
        answer: 'An identity attached to the app, a managed identity, IAM role or service account, with read access to that one bucket',
        correctFeedback: 'Correct. The provider gives the app short-lived credentials, and the narrow grant limits the damage if anything goes wrong.',
        incorrectFeedback: 'Not quite. Stored keys leak, administrator rights turn a small bug into a big incident, and a public bucket exposes every learner\'s notes.',
      },
      {
        question: 'Automatic database backups have run every night for months. How do you know you can recover Study Tracker\'s data?',
        options: ['The console lists the backups', 'High availability keeps a second copy', 'The provider guarantees backups always work', 'You restored one into a new database, checked the data and timed it'],
        answer: 'You restored one into a new database, checked the data and timed it',
        correctFeedback: 'Correct. A backup only counts once you have restored it, and the timing tells you whether you meet your recovery time objective.',
        incorrectFeedback: 'Not quite. A list of backups proves nothing about restoring them, and a high-availability copy receives the same mistakes as the original.',
      },
    ],
  },
  'ai-architecture': {
    title: 'AI Architecture assessment',
    instructions: 'Each question comes from designing Study Tracker for a university of 20,000 students. Pick the strongest decision.',
    questions: [
      {
        question: 'You add a second copy of Study Tracker behind a load balancer, but each copy still keeps study.db on its own disk. What happens?',
        options: ['The load is shared and everything works normally', 'The two SQLite files keep each other in sync', 'Students see different sessions depending on which copy answers', 'The load balancer refuses to start'],
        answer: 'Students see different sessions depending on which copy answers',
        correctFeedback: 'Correct. The database is local state, so each copy has its own data. Move state to a shared database before scaling out.',
        incorrectFeedback: 'Not quite. SQLite files never synchronize themselves, and nothing stops the copies from starting. The problem only shows when students use the app.',
      },
      {
        question: 'The model provider has an outage during exam week. Which design keeps Study Tracker most useful?',
        options: ['A circuit breaker fails AI calls fast with a clear message, while sessions, totals and history keep working', 'Every AI call waits 60 seconds, then retries three times', 'The whole app shows a maintenance page until the provider recovers', 'The app shows each student the last answer they received'],
        answer: 'A circuit breaker fails AI calls fast with a clear message, while sessions, totals and history keep working',
        correctFeedback: 'Correct. Failing fast and protecting the core features keeps the outage limited to the AI features.',
        incorrectFeedback: 'Not quite. Long waits and retries pile load onto a failing provider, a maintenance page blocks features that work fine, and an old answer to a different question is misleading.',
      },
      {
        question: 'A year after launch, the team switches note search from exact search to an indexed vector database. What should happen to ADR 0003, which chose exact search?',
        options: ['Rewrite it to describe the new design', 'Write a new ADR for the new decision and mark 0003 as superseded by it', 'Delete it, since it is no longer true', 'Leave it unchanged as Accepted'],
        answer: 'Write a new ADR for the new decision and mark 0003 as superseded by it',
        correctFeedback: 'Correct. Both decisions and their reasons stay readable, and the old record points to the new one.',
        incorrectFeedback: 'Not quite. Rewriting or deleting it loses why the first choice made sense, and leaving it as Accepted tells readers the old design is still current.',
      },
    ],
  },
  'professional-practice': {
    title: 'Technical Leadership assessment',
    instructions: 'Each question is a situation from the Riverside pilot. Pick what you would do first.',
    questions: [
      {
        question: 'The IT manager tells you the access plan is too loose. What do you do first?',
        options: ['Defend the plan, since the team already reviewed it', 'Ask which part worries them and what would make them comfortable', 'Rewrite the whole plan that night', 'Ask the dean to tell the IT manager to accept it'],
        answer: 'Ask which part worries them and what would make them comfortable',
        correctFeedback: 'Correct. The question shows the real concern, and the answer tells you what to change. Defending or rewriting before you understand the concern usually fixes the wrong thing.',
        incorrectFeedback: 'Not quite. Defending the plan shuts the conversation down, rewriting it may fix the wrong part, and pressure through the dean damages trust with the person you need.',
      },
      {
        question: 'The dean asks for a lower fee for the pilot. Which response keeps the most value on both sides?',
        options: ['Cut the fee and say nothing else changed', 'Refuse, because the price is final', 'Ask the student representative to decide', 'Trade a smaller scope or a later payment for the lower fee, and record the change with its reason'],
        answer: 'Trade a smaller scope or a later payment for the lower fee, and record the change with its reason',
        correctFeedback: 'Correct. A visible trade keeps the support matched to the work, and the written record protects both sides at audit.',
        incorrectFeedback: 'Not quite. A silent cut leaves the support unchanged, and a flat refusal ends the negotiation. The student representative does not hold this decision.',
      },
      {
        question: 'The pilot date and the security review conflict. The dean wants the pilot in March, and the IT manager wants the full review first. What is the best next step?',
        options: ['Choose the date halfway between the two', 'Name the trade-off, find an option that serves both interests, and write it down with an owner and a date', 'Let the review run without telling the dean', 'Wait until the review is finished and then decide'],
        answer: 'Name the trade-off, find an option that serves both interests, and write it down with an owner and a date',
        correctFeedback: 'Correct. Finding the interests behind each position makes an option possible, and a written agreement with an owner and a date keeps it from being reopened.',
        incorrectFeedback: 'Not quite. Splitting the difference usually meets neither interest, and hiding or delaying the conflict turns it into a late surprise.',
      },
    ],
  },
}
