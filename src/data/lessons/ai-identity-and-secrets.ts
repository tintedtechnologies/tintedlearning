import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  assumes: 'Configuration and Secrets from Software Engineering, where keys live in environment variables, and AI Agents and Agent and Tool Security from this section. Run every example only on your own local copy of Study Tracker.',
  goals: [
    'Explain whose rights an AI action carries, and why it must be the signed-in learner\'s rights',
    'Check the learner\'s permissions in every tool, using identity from the request and never from the model',
    'Choose short-lived credentials for the model provider, and plan what to do when one leaks',
  ],
  bigIdea: "An AI feature acts on someone's behalf, so every action must carry the rights of the learner who asked for it, not the rights of the whole app. The model can suggest what to do, but identity must come from the signed-in request, and each tool must check it again. Credentials should be short-lived, so a leaked one stops working quickly.",
  whyItMatters: "Study Tracker's assistant writes sessions and reads notes. If it runs with the app's full database rights, then one prompt that persuades it to name another learner would read or change that learner's records. The database would happily obey, because the app asked. Identity has to be checked where the data is touched.",
  goalSections: [
    {
      heading: 'Acting on behalf of a learner',
      paragraphs: [
        "When Ana asks the assistant to log a session, the action should carry Ana's rights: her notes, her sessions and nothing else. The app itself, the server running Study Tracker, should not be able to read every learner's data just because it is running. Each request is a small piece of work done for one learner.",
        "This is called delegated access. The learner signs in, the app receives a token that proves who they are, and every tool call carries that identity. Your code can then ask one question at every step: may this learner do this to this record?",
      ],
      example: {
        language: 'text',
        code: code`
          Ana signs in -> request carries Ana's token -> identity: ana
            assistant asks: log_session for ana      -> allowed, Ana's sessions
            assistant asks: read ben's notes         -> refused, not Ana's data
          The server's own rights do not decide anything here.
        `,
      },
    },
    {
      heading: 'Check the learner in every tool',
      paragraphs: [
        "The model may suggest a learner name in its tool call, because the tool schema can include one. That suggestion is untrusted text, like any other. The rule is simple: the tool takes the learner from the signed-in request, and any learner value the model supplies is thrown away.",
        "Checking once at the front door is not enough. Each tool, and each query inside it, should confirm that the record belongs to the learner who asked. A check in one place is easy to skip when a new tool is added later.",
        "Write a test for each tool that tries to act for a second learner. A test like that fails the moment someone forgets a check, which is far better than discovering the gap from a complaint. Run these tests in continuous integration too, so no change can merge without them.",
      ],
      example: {
        language: 'text',
        code: code`
          Order of checks inside every tool
            1. identity comes from the signed-in request, never from the model's arguments
            2. the record is loaded with its owner
            3. the owner must equal the identity, or the call is refused
            4. only then is the change made and logged
        `,
      },
    },
    {
      heading: 'Credentials that expire',
      paragraphs: [
        "The app also needs a credential to call the model provider. A long-lived key, pasted into code or a file, is the easiest kind to leak and the hardest to notice when it leaks. Configuration and Secrets covers keeping it out of Git. This lesson asks what the key is allowed to do and how long it stays valid.",
        "Prefer credentials that expire on their own. Where your cloud platform supports it, the app can use the identity of the service it runs on, so no stored key exists at all. Where it does not, use a key with the smallest allowed scope, and rotate it on a schedule, so a leaked key stops working.",
      ],
      example: {
        language: 'text',
        code: code`
          Credential                        If it leaks
          key pasted into code              anyone can use it until someone notices
          key in an environment variable    anyone who reads the server can use it
          key with a spending limit         abuse stops at the limit, but still happens
          short-lived token for the app     abuse stops when the token expires
          no stored key (the app's identity) nothing to copy
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'The model cannot choose whose data it changes',
    intro: "The tool below receives a request that names two learners: Ana, who is signed in, and Ben, whom the model suggested. The code keeps Ana and throws away the model's choice. The output shows the tool saving the session for the signed-in learner only.",
    example: {
      language: 'python',
      filename: 'identity_tools.py',
      code: code`
        SAVED = []

        def log_session(learner, subject, minutes):
            SAVED.append({"learner": learner, "subject": subject, "minutes": minutes})
            return {"saved_for": learner}

        TOOLS = {"log_session": log_session}

        def run_tool(name, model_arguments, current_learner):
            # The model may suggest arguments, but the learner comes only from the signed-in request.
            arguments = {key: value for key, value in model_arguments.items() if key != "learner"}
            arguments["learner"] = current_learner
            return TOOLS[name](**arguments)

        print(run_tool("log_session", {"subject": "algebra", "minutes": 40, "learner": "ben"}, current_learner="ana"))
        print(SAVED)
      `,
      output: "{'saved_for': 'ana'}\n[{'learner': 'ana', 'subject': 'algebra', 'minutes': 40}]",
    },
    steps: [
      { code: '{"subject": "algebra", "minutes": 40, "learner": "ben"}', explanation: "The model's request names Ben. Whether this came from a bug, a poisoned note or a mistake, the code must not trust it." },
      { code: 'if key != "learner"', explanation: "Any learner value the model supplied is removed before the tool sees the arguments." },
      { code: 'arguments["learner"] = current_learner', explanation: "The learner is added from the signed-in request, which the server established when Ana logged in." },
      { code: 'print(SAVED)', explanation: "The saved row belongs to Ana. Ben's records were never touched, because the tool never received his name." },
    ],
  },
  tryIt: {
    instructions: [
      'Find every tool in `assistant.py` and `planner.py`. Make each one take the learner from the request context, and remove any `learner` field from the schemas the model sees.',
      'Add a check inside `db.py` that every read and write of a session matches the learner. Run `python -m pytest` after each change.',
      'Add `test_identity.py`. Ask as Ana for Ben\'s totals and check that the answer contains none of Ben\'s data. Then check that a tool call naming Ben saves the session for Ana.',
    ],
  },
  mistakes: [
    { mistake: 'Letting the model choose the learner in a tool call.', fix: 'Take the learner from the signed-in request, and drop any learner value the model supplies.' },
    { mistake: 'Giving the assistant the app\'s administrator database rights.', fix: 'Use a database user with rights only to the tables and rows the assistant needs, and check ownership in code too.' },
    { mistake: 'Writing a provider key or a learner\'s token into a log.', fix: 'Log the learner\'s id and the action, never the credential itself.' },
    { mistake: 'Using one shared key with no limits for every learner.', fix: 'Set a spending limit and a scope on the key, and rotate it on a schedule.' },
  ],
  quiz: [
    {
      question: 'Ana is signed in. The model\'s tool call names learner "ben" for a session. What should the tool do?',
      options: [
        { text: 'Save it for Ben, since the model asked for him', explanation: 'The model\'s choice is untrusted. Saving for Ben would change another learner\'s record.' },
        { text: 'Save it for Ana, ignoring the learner value the model supplied', explanation: 'The learner comes from the signed-in request, so Ana\'s identity decides.' },
        { text: 'Crash, because the names do not match', explanation: 'A mismatch is a reason to ignore the model\'s value, not to crash.' },
        { text: 'Save it for both learners to be fair', explanation: 'Each record must belong to the learner who asked, so writing for Ben is never correct.' },
      ],
      answer: 1,
    },
    {
      question: 'Which credential for the model provider does the least harm if it leaks?',
      options: [
        { text: 'A permanent key pasted into the source code', explanation: 'A pasted key lasts until someone notices, and it sits in version history.' },
        { text: 'A key shared in a spreadsheet so the whole team can use it', explanation: 'Sharing it widens who can copy it and makes leaks harder to trace.' },
        { text: 'A short-lived credential issued to the app\'s identity, with no key stored in code', explanation: 'It expires on its own, and there is no stored key to copy.' },
        { text: 'The administrator key of the provider account', explanation: 'An administrator key can do everything the account can do, which makes a leak far worse.' },
      ],
      answer: 2,
    },
    {
      question: 'A provider key is found in a shared log file. What should you do first?',
      options: [
        { text: 'Delete the log line and carry on', explanation: 'Anyone who copied the key already has it. Deleting the line does not revoke it.' },
        { text: 'Wait for the bill to show whether it was used', explanation: 'Waiting lets anyone who found the key keep using it at your expense.' },
        { text: 'Change the temperature so the key is less useful', explanation: 'Temperature has nothing to do with who can use a key.' },
        { text: 'Revoke or rotate the key now, then check its usage for abuse', explanation: 'Revoking stops the key at once, and the usage check shows whether it was already misused.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Every AI action should carry the signed-in learner\'s rights, checked again inside each tool, and the credentials behind it should be short-lived or scoped so a leak does little harm.',
  resources: [
    { title: 'OWASP Top 10 for Large Language Model Applications', provider: 'OWASP GenAI Security Project', description: 'Covers excessive agency and the risks of granting an AI feature more access than it needs.', url: 'https://genai.owasp.org/llm-top-10/' },
  ],
  underTheHood: {
    heading: 'Why the request, not the model, carries identity',
    paragraphs: [
      "A web request carries identity in a signed token that the server issued after sign-in. The server can check the signature, so the token cannot be changed by the browser without detection. The model never sees this token and cannot rewrite it, which is why identity has to travel with the request and not with the text of the conversation.",
      "Passing identity through a model is a common mistake. If the learner's name appears in the prompt, the model could be persuaded to name someone else, and the tool would trust the name it was given. Keeping identity out of the model's hands means a persuaded model can only ask for things the learner could ask for.",
      "Tokens for services work on the same principle. The provider checks a short-lived token against a trusted issuer, and the token expires after a short time. A token that is copied from a log is useful only until it expires, which is why short lifetimes limit the damage of a leak.",
    ],
  },
}

export default lesson
