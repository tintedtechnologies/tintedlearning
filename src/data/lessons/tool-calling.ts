import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiChat, appAssistant, assistant, configAi, db, schemas, testAssistant } from './study-tracker'

const assistantFiles = { 'config.py': configAi, 'ai.py': aiChat, 'schemas.py': schemas, 'db.py': db, 'assistant.py': assistant }

const lesson: StructuredLesson = {
  assumes: 'Structured Outputs, with `ai.py`, `schemas.py` and `extract.py` in place, and Databases and SQL for `db.py`. Tool calling needs a model that supports tools. Most hosted models do, and Ollama\'s library marks the models that do.',
  goals: [
    'Describe a tool to a model with a name, a description and parameters',
    'Run the tool calls a model asks for and send the results back',
    'Keep your code in control by checking every argument and limiting the number of steps',
  ],
  bigIdea: "Tool calling lets a model ask your code to run a function, such as looking up totals or saving a session. The model never runs anything itself: it replies with a function name and arguments as JSON, your code decides whether to run it, and the result goes back so the model can answer. The model chooses, and your code acts and checks.",
  whyItMatters: "Ask Study Tracker's assistant \"How much have I studied?\" with only a system prompt, and it can only guess. Give it a `get_totals` tool and it fetches the real figures from `study.db`. Give it `log_session`, and \"I just did 30 minutes of python\" becomes a saved session. That is the step from a chatbot that talks about your data to an assistant that works with it, and it is exactly where things go wrong if your code trusts the model blindly.",
  goalSections: [
    {
      heading: 'Describing a tool',
      paragraphs: [
        "Each request can include a list of tools. A tool has a name, a description and its parameters, written in JSON Schema, a standard way to describe JSON: each parameter's type, what it means and which ones are required.",
        "The model decides whether to call a tool by reading its description, so the description is really a prompt. Say what the tool does and when to use it, as you would to a new colleague. Name parameters clearly and describe their format, such as YYYY-MM-DD for dates.",
        "Offer a small number of focused tools. A model picks well between two clear tools and less reliably between twenty similar ones.",
      ],
      example: {
        language: 'python',
        runnable: false,
        code: code`
          {
              "type": "function",
              "function": {
                  "name": "log_session",
                  "description": "Save one study session that the learner says they finished.",
                  "parameters": {
                      "type": "object",
                      "properties": {
                          "subject": {"type": "string", "description": "Short lowercase subject, such as algebra"},
                          "minutes": {"type": "integer", "description": "Minutes studied, from 1 to 600"},
                          "studied_on": {"type": "string", "description": "Date studied, in YYYY-MM-DD format"},
                      },
                      "required": ["subject", "minutes", "studied_on"],
                  },
              },
          }
        `,
      },
    },
    {
      heading: 'The tool-calling loop',
      paragraphs: [
        "You send the messages and the tools. The reply is one of two things: ordinary text, which means the model is done, or a list called `tool_calls`. Each tool call has an `id`, the function's name and its arguments as a JSON string.",
        "For each call, your code runs the matching Python function. Then it adds two things to the message list: the model's reply that asked for the tools, and a message with the role `tool` holding the result and the matching `tool_call_id`. It sends everything back, and the model continues.",
        "This repeats until the model replies with text. One learner message can take a few rounds, for example looking up totals and then answering. This loop is the same one AI agents are built on.",
      ],
      example: {
        language: 'text',
        code: code`
          system     You are the study assistant inside Study Tracker. ...
          user       I just finished 30 minutes of python
          assistant  tool_calls: log_session({"subject": "python", "minutes": 30,
                                              "studied_on": "2026-03-06"})
          tool       {"saved": true, "id": 1, "subject": "python", "minutes": 30,
                      "studied_on": "2026-03-06"}
          assistant  Saved: 30 minutes of python on 2026-03-06.
        `,
      },
    },
    {
      heading: 'Keeping your code in control',
      paragraphs: [
        "Treat a tool call like a form filled in by a stranger. The model can ask for a tool that does not exist, send a word where a number belongs or ask for 900 minutes. So `log_session` validates its arguments with the same `SessionIn` rules as the API, and unknown tools are refused.",
        "When a tool fails, send the error back as the tool's result instead of crashing. The model reads it and can tell the learner what went wrong. Cap the loop with a step limit, so a confused model cannot keep calling tools forever and running up costs.",
        "Only offer the tools a feature needs. Here, `log_session` saves without asking first because the learner asked directly, the arguments pass the form's rules and the reply reports exactly what was saved. Tools with bigger effects, such as deleting data, need an approval step, which the lesson AI Agents adds.",
      ],
      example: {
        language: 'text',
        code: code`
          Model asks for                          run_tool returns
          log_session(minutes=30, ...)            {"saved": true, "id": 1, ...}
          log_session(minutes=900, ...)           {"error": "1 validation error for SessionIn ..."}
          log_session(minutes="lots")             {"error": "...valid integer..."}
          delete_everything()                     {"error": "there is no tool called delete_everything"}
          a 6th round of tool calls               AIError: did not finish within 5 steps
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s assistant.py',
    intro: "This file gives the assistant two tools and runs the loop. The responses at the end came from the running app with a model connected and show typical replies. Your wording will differ, but the saved data will not.",
    example: { language: 'python', filename: 'assistant.py', code: assistant, runnable: false, files: assistantFiles },
    steps: [
      { code: 'Use log_session only when the learner says they finished a study session.', explanation: "The system prompt tells the model when each tool is appropriate. It guides the model, while the code below enforces the rules." },
      { code: 'def log_session(subject, minutes, studied_on):\n    session = SessionIn(...)', explanation: "The arguments go through the same validation as the form, and future dates are refused, so the assistant cannot save anything the API would reject." },
      { code: 'FUNCTIONS = {"get_totals": get_totals, "log_session": log_session}', explanation: "Your code, not the model, decides which functions exist. A name that is not in this dictionary is never run." },
      { code: 'except (json.JSONDecodeError, TypeError, ValueError, ValidationError) as error:\n    return {"error": str(error)}', explanation: "Bad JSON, missing or extra arguments and failed validation all become an error result the model can read, and a warning in the log." },
      { code: 'reply = chat(messages, tools=TOOLS, temperature=0)\nmessages.append(reply)', explanation: "The new `chat()` from the last lesson sends the whole message list with the tools. The reply is kept in the list, because the next request must include the tool calls it made." },
      { code: 'messages.append({"role": "tool", "tool_call_id": call["id"], "content": json.dumps(result)})', explanation: "Each result goes back as a `tool` message matched to its call by `id`, so the model knows which answer belongs to which request." },
      { code: 'POST /assistant {"message": "I just finished 30 minutes of python"}\n{"reply": "Saved: 30 minutes of python on 2026-11-14."}', explanation: "A typical success. The session really is in `study.db`, and `GET /totals` now shows it." },
      { code: 'POST /assistant {"message": "log 900 minutes of python"}\n{"reply": "I couldn\'t save that session: 1 validation error for SessionIn"}', explanation: "The model asked for 900 minutes. Validation refused it, the model passed the reason on, and nothing was saved." },
    ],
  },
  tryIt: {
    instructions: [
      'Add `assistant.py` and replace `app.py` with the version below, which adds `POST /assistant`. Run the app.',
      'In `/docs`, send three messages: one that logs a session, one asking how much you have studied, and one asking for an impossible session. Check `GET /totals` and read the tool lines in the terminal log.',
      'Add `test_assistant.py` and run `python -m pytest`. These tests script the model\'s replies, so they run without a model.',
      'Add a third tool, `list_recent_sessions`, that returns the last 5 sessions from `db.list_sessions()`. Write its description, add it to `TOOLS` and `FUNCTIONS`, and add a test for it. Then open the AI agents playground to see a tool request that waits for approval, which the AI Agents lesson builds.',
    ],
    playground: 'agents',
    files: [
      { language: 'python', filename: 'app.py', code: appAssistant, runnable: false },
      { language: 'python', filename: 'test_assistant.py', code: testAssistant, files: assistantFiles, runWith: 'pytest' },
    ],
  },
  mistakes: [
    { mistake: 'Running whatever function name and arguments the model sends.', fix: 'Look the name up in your own dictionary of allowed functions, and validate every argument as you would form input.' },
    { mistake: 'Letting a tool error crash the request.', fix: 'Catch the error and return it as the tool\'s result, so the model can explain the problem to the user.' },
    { mistake: 'Looping until the model stops calling tools.', fix: 'Set a step limit and raise a clear error when it is reached, so a confused model cannot loop and run up costs.' },
    { mistake: 'Writing vague tool descriptions.', fix: 'Say what the tool does, when to use it and each parameter\'s format. The model chooses tools by reading those words.' },
  ],
  quiz: [
    {
      question: 'The model replies with `tool_calls: log_session({"subject": "python", "minutes": 30, "studied_on": "2026-03-06"})`. What has happened so far?',
      options: [
        { text: 'The session has been saved to study.db', explanation: 'The model cannot touch your database. It has only asked.' },
        { text: 'The model has asked your code to run log_session, and nothing is saved until your code runs it', explanation: 'A tool call is a request. Your code decides whether to run it, after checking the arguments.' },
        { text: 'The provider ran log_session on its own servers', explanation: 'The function lives in your code, which the provider never sees.' },
        { text: 'The conversation is finished', explanation: 'The model is waiting for the tool\'s result before it writes its answer.' },
      ],
      answer: 1,
    },
    {
      question: 'After running a tool, what must your code send back to the model?',
      options: [
        { text: 'Only the tool\'s result, as a new user message', explanation: 'The model also needs its own tool-call reply in the list, and the result must use the `tool` role.' },
        { text: 'Nothing, because the model already knows what the tool returns', explanation: 'The model has no idea what your function returned until you tell it.' },
        { text: 'A new system prompt describing the result', explanation: 'System prompts set standing rules. Results go in `tool` messages.' },
        { text: 'The full message list, including the model\'s tool-call reply and a `tool` message with the result and matching `tool_call_id`', explanation: 'The model needs the whole exchange to connect each result to the call that asked for it.' },
      ],
      answer: 3,
    },
    {
      question: 'The model calls `log_session` with `minutes` set to 900. With this lesson\'s `assistant.py`, what happens?',
      options: [
        { text: 'Validation refuses it, the model receives an error result, and nothing is saved', explanation: '`SessionIn` allows at most 600 minutes, and `run_tool` returns the error instead of crashing.' },
        { text: 'The session is saved, because the model asked for it', explanation: 'Your code validates every argument. A model\'s request is not permission.' },
        { text: 'The app crashes with a ValidationError', explanation: '`run_tool` catches validation errors and returns them as results.' },
        { text: 'The minutes are quietly changed to 600 and saved', explanation: 'The code never changes values on its own. It refuses invalid input.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A model can only ask for a tool, so your code decides which tools exist, validates every argument, returns errors as results and limits the steps, keeping every action under your control.',
  resources: [
    { title: 'Tool calling', provider: 'Ollama', description: 'How to send tools to a local model and handle its tool calls in Python.', url: 'https://docs.ollama.com/capabilities/tool-calling' },
    { title: 'Function calling', provider: 'Google AI for Developers', description: 'A hosted provider\'s guide to the same idea, with examples of good tool descriptions.', url: 'https://ai.google.dev/gemini-api/docs/function-calling' },
    { title: 'JSON Schema objects', provider: 'JSON Schema', description: 'How to describe properties, types and required fields for tool parameters.', url: 'https://json-schema.org/understanding-json-schema/reference/object' },
  ],
  underTheHood: {
    heading: 'How a model "calls" a tool',
    paragraphs: [
      "A language model can only produce tokens, so a tool call is just text in a special format. Before your request reaches the model, the service converts your tools list into text the model was trained to read, often added near the system prompt: here are the functions you may use, with their names, descriptions and parameters.",
      "During training, the model saw many conversations where answering well meant writing a special marker followed by a function name and JSON arguments, then waiting for a result. So when your question looks like one of those situations, writing a tool call becomes the most likely continuation. The service spots the marker, stops generation and returns the call to you in the `tool_calls` field instead of as text.",
      "This explains the rules in this lesson. The arguments are predicted text, which is why they can be wrong. Descriptions shape the predictions, which is why they matter. And nothing ever runs unless your code chooses to run it.",
    ],
  },
}

export default lesson
