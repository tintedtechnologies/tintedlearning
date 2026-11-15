import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'build-a-chatbot',
  whatYouBuild: "A chatbot that other people can open in a browser. It has a simple chat page, streams its replies as they are written, keeps a conversation within a limit, shows a clear message when something fails, limits how often each person can ask, logs what happened without logging private text, records feedback on each reply, and runs in a container.",
  diagram: code`
    Browser: a plain chat page (HTML, CSS and a little JavaScript)
      -> POST /chat or /chat/stream (FastAPI)
      -> per-user limit: too many questions -> friendly message, no model call
      -> chat turn: the last few exchanges only
      -> the model is chosen by one setting: local (free) or hosted (your key)
      -> reply streamed back word by word; the log records the status, never the text
      -> feedback: thumbs up or down, saved against the request id
    Packaged in a container, configured by environment variables
  `,
  lessons: ['ai-apis', 'context-windows', 'system-prompts', 'build-an-api', 'config-and-secrets', 'logging', 'docker', 'ai-observability'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'FastAPI and Uvicorn, installed from requirements.txt', 'A browser', 'Optional: a local model server, such as Ollama, for a free default', 'Docker Desktop, for the container step'],
  time: 'about 8 hours, plus the deploy',
  requirements: [
    'Opens in a browser at one address, with a chat box and a clear error message',
    'Streams the reply, so the first words appear before the whole answer is ready',
    'Keeps the conversation within a set number of exchanges',
    'Limits each user to a set number of questions per minute, and refuses the rest before any model call',
    'Logs the request id, user, status and time, and never the message or the reply',
    'Records a thumbs up or down against any reply',
    'Chooses the provider from one setting, with a local model as the free default, and never stores a key in code',
    'Runs in a container, and is deployed so someone else can try it',
  ],
  milestones: [
    {
      title: 'Set up the project and read your settings',
      goal: 'Create the project, and read the provider and address from environment variables with safe defaults.',
      hints: [
        'Use os.environ.get with a default, so the program still starts when a variable is missing.',
        'Keep any real key in a .env file that Git ignores, never in the code.',
      ],
      code: {
        language: 'python',
        filename: 'config.py',
        code: code`
          import os

          PROVIDER = os.environ.get("CHAT_PROVIDER", "local")
          BASE_URL = os.environ.get("CHAT_BASE_URL", "http://localhost:11434/v1")
          API_KEY = os.environ.get("CHAT_API_KEY", "")

          print(PROVIDER, BASE_URL)
        `,
        output: 'local http://localhost:11434/v1',
      },
      checkpoint: 'Running python config.py prints the provider and the address, with no key shown.',
    },
    {
      title: 'Keep a conversation within a limit',
      goal: 'Remember earlier messages, and send only the most recent ones, so the history stays small.',
      hints: [
        'Count exchanges, not characters, and trim the stored history as well as the history you send.',
        'FakeModel stands in for a real model, so this step runs without a server. You replace it in the last milestone.',
      ],
      code: {
        language: 'python',
        filename: 'chat.py',
        code: code`
          MAX_EXCHANGES = 6

          class FakeModel:
              """A stand-in for a real model, so the code runs without a server."""
              def reply(self, messages):
                  return f"You said: {messages[-1]['content']}"

          def chat_turn(model, history, user_text):
              history.append({"role": "user", "content": user_text})
              recent = history[-(MAX_EXCHANGES * 2):]
              answer = model.reply([{"role": "system", "content": "You are a helpful assistant."}] + recent)
              history.append({"role": "assistant", "content": answer})
              del history[:-(MAX_EXCHANGES * 2)]
              return answer

          if __name__ == "__main__":
              history = []
              model = FakeModel()
              for text in ["Hello", "What is a context window?"]:
                  print(chat_turn(model, history, text))
              print("messages kept:", len(history))
        `,
        output: 'You said: Hello\nYou said: What is a context window?\nmessages kept: 4',
      },
      checkpoint: 'The output shows both replies, and the history holds four messages.',
    },
    {
      title: 'Serve a chat page',
      goal: 'Serve one page with a chat box, and answer a message with a JSON reply. Show a clear error message when the reply fails.',
      hints: [
        'Keep the page plain: HTML, a little JavaScript and no framework. This is the one new piece in this project.',
        'Return a 503 status with a short message when the model fails, and show that message in the page.',
      ],
      code: {
        language: 'python',
        filename: 'app.py',
        code: code`
          from fastapi import FastAPI, HTTPException
          from fastapi.responses import HTMLResponse
          from pydantic import BaseModel
          from chat import FakeModel, chat_turn

          app = FastAPI()
          model = FakeModel()
          history = []

          class Message(BaseModel):
              text: str

          PAGE = """<!doctype html>
          <html lang="en">
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Chat</title></head>
          <body>
          <main>
          <h1>Chat</h1>
          <div id="log" aria-live="polite"></div>
          <form id="form"><input id="text" autocomplete="off" required><button>Send</button></form>
          <p id="error" role="alert"></p>
          </main>
          <script>
          document.getElementById("form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const input = document.getElementById("text");
            const log = document.getElementById("log");
            const error = document.getElementById("error");
            error.textContent = "";
            try {
              const response = await fetch("/chat", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({text: input.value})});
              if (!response.ok) throw new Error((await response.json()).detail);
              const data = await response.json();
              log.insertAdjacentHTML("beforeend", "<p>You: " + input.value + "</p><p>Bot: " + data.answer + "</p>");
              input.value = "";
            } catch (failure) {
              error.textContent = "The chatbot could not answer. " + failure.message;
            }
          });
          </script>
          </body>
          </html>"""

          @app.get("/", response_class=HTMLResponse)
          def page():
              return PAGE

          @app.post("/chat")
          def chat(message: Message):
              try:
                  return {"answer": chat_turn(model, history, message.text)}
              except Exception:
                  raise HTTPException(status_code=503, detail="Try again in a moment.")
        `,
      },
      checkpoint: 'Run uvicorn app:app, open http://127.0.0.1:8000 and send a message. The reply appears under your question.',
    },
    {
      title: 'Stream the reply',
      goal: 'Send the reply as it is made, so the first words appear before the whole answer is ready.',
      hints: [
        'Use a generator and StreamingResponse, the same idea as the streaming lesson.',
        'The page reads the stream chunk by chunk and shows the text so far. Check that the page still works without streaming.',
      ],
      code: {
        language: 'python',
        filename: 'app.py (add to the file from the last step)',
        code: code`
          from fastapi.responses import StreamingResponse

          def stream(text):
              for word in text.split():
                  yield word + " "

          @app.post("/chat/stream")
          def chat_stream(message: Message):
              answer = model.reply([{"role": "user", "content": message.text}])
              return StreamingResponse(stream(answer), media_type="text/plain")
        `,
      },
      checkpoint: 'Calling /chat/stream returns the words one after another, and the page shows them as they arrive.',
    },
    {
      title: 'Limit questions, log safely and record feedback',
      goal: 'Refuse questions above the per-user limit before any model call, log one line per request without the text, and save feedback against the request id.',
      hints: [
        'Check the limit before the model is called, so a refused question costs nothing.',
        'Log the status rather than the message, since the message may contain private information.',
      ],
      code: {
        language: 'python',
        filename: 'limits_log_feedback.py',
        code: code`
          import json

          LIMIT = 3
          WINDOW_SECONDS = 60
          VALID_FEEDBACK = {"up", "down"}

          class RateLimiter:
              def __init__(self):
                  self.asked = {}

              def allow(self, user, now):
                  times = [t for t in self.asked.get(user, []) if now - t < WINDOW_SECONDS]
                  if len(times) >= LIMIT:
                      self.asked[user] = times
                      return False
                  times.append(now)
                  self.asked[user] = times
                  return True

          def log_turn(request_id, user, status, ms):
              return json.dumps({"request_id": request_id, "user": user, "status": status, "ms": ms}, sort_keys=True)

          feedback = []

          def record_feedback(request_id, value):
              if value not in VALID_FEEDBACK:
                  raise ValueError("feedback must be up or down")
              feedback.append({"request_id": request_id, "value": value})

          limiter = RateLimiter()
          print([limiter.allow("ana", t) for t in [0, 10, 20, 30, 70]])
          print(log_turn("req-0001", "ana", "ok", 412))
          record_feedback("req-0001", "up")
          record_feedback("req-0002", "down")
          print(len(feedback), sum(1 for item in feedback if item["value"] == "down"))
        `,
        output: '[True, True, True, False, True]\n{"ms": 412, "request_id": "req-0001", "status": "ok", "user": "ana"}\n2 1',
      },
      checkpoint: 'The fourth question within a minute is refused, the log line has no message text, and two feedback records are counted.',
    },
    {
      title: 'Run it in a container and deploy it',
      goal: 'Package the app so it runs the same way anywhere, and deploy it with its settings passed in from outside the image.',
      hints: [
        'Write a Dockerfile and a .dockerignore that leaves out .env and .venv, then pass the provider and key with -e when you run it.',
        'Choose a platform that runs containers, and follow its own guide for the deploy, because its commands change over time.',
      ],
      checkpoint: 'The container starts, a message gets a reply from the deployed address, and no key appears in the image or the logs.',
    },
  ],
  finishedMeans: [
    'The page opens in a browser, and a message gets a reply with streaming',
    'Sending too many questions in a minute shows a friendly message, and other users are not affected',
    'Searching the logs for a message you typed finds nothing',
    'Feedback can be recorded and counted by value',
    'python -m venv, pip install -r requirements.txt and uvicorn app:app run from a fresh clone',
    'No API key appears in the code, the README, the Git history or the container image',
    'The deployed address works, and you have written down what it costs to run each month',
  ],
  readmeTemplate: code`
    # [Project name]

    [One sentence: who uses the chatbot and what it helps with.]

    ## Try it
    [The address of the deployed chatbot, and the local steps.]

    ## Run it locally
    [Setup steps, the environment variables and the uvicorn command.]

    ## How it works
    [The page, the chat history, streaming, and the provider setting.]

    ## Limits, logs and feedback
    [The per-user limit, what the logs record and do not record, and how feedback is counted.]

    ## Run it in a container
    [The build and run commands, with a placeholder for the key.]
  `,
  writeUpPrompts: [
    'The problem: who uses the chatbot, and what they need it for.',
    'One decision you made, and why. For example, why the logs leave out the message text, or why the page uses no framework.',
    'One thing that went wrong, and how you fixed it.',
    'What you would do next, and what you would test first.',
  ],
  demoGuidance: 'Record the page working: send a question, watch the reply stream in, then show a refused question after the limit. Keep it under 60 seconds. Free tools include the screen recorder built into macOS and Windows, OBS Studio, and a GIF converter such as ScreenToGif on Windows or a free online converter. Save the GIF in the repository as demo.gif and link it from the README.',
  interviewGuidance: "Lead with the choice behind the code, not the feature list. For example: 'I kept the page framework-free so the app had fewer moving parts to deploy, and I logged the status but not the text because messages can contain private information.' Then name one thing that went wrong and what you changed.",
  stretchGoals: [
    'Save the conversation to a file, and load it at the next start',
    'Count tokens with the model\'s tokenizer, and show the count after each reply',
    'Add a second provider and test that both give a reply to the same question',
  ],
}

export default plan
