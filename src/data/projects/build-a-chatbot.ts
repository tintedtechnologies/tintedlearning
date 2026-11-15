import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'build-a-chatbot',
  whatYouBuild: "A small chat program that keeps a conversation going, streams its replies as they are written and stays within a limit on how much history it sends. The model is chosen by one setting, so you can start with a free local model and switch to a hosted provider later without changing the chat code.",
  diagram: code`
    You type a message
      -> chat.py adds it to the history (the last few exchanges only)
      -> the model is chosen by CHAT_PROVIDER in config.py
          local   : a model on your computer, free to run
          hosted  : a provider's API, with your own key
      -> the reply is streamed back word by word
      -> the history keeps the new exchange
  `,
  lessons: ['ai-apis', 'context-windows', 'system-prompts', 'large-language-models', 'inference-and-deployment'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'A text editor and a terminal', 'Optional: a local model server, such as Ollama, for a free default'],
  time: 'about 4 hours, including setup',
  requirements: [
    'Keeps a conversation going, so a follow-up question sees the earlier messages',
    'Sends only the most recent exchanges, so the prompt stays within a set size',
    'Streams the reply, so the first words appear before the whole answer is ready',
    'Refuses overly long messages and shows a friendly message when the model does not answer',
    'Chooses the provider from one setting, with a local model as the free default',
    'Never stores an API key in the code or in Git',
  ],
  milestones: [
    {
      title: 'Set up the project and read your settings',
      goal: 'Create the project folder, and read the provider and address from environment variables with safe defaults.',
      hints: [
        'Create a folder called chatbot, a virtual environment and an empty chat.py.',
        'Use os.environ.get with a default, so the program still starts when a variable is missing.',
        'Never put a real key in the code. Keep it in a .env file that Git ignores.',
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
      title: 'Keep a conversation',
      goal: 'Remember earlier messages, and send only the most recent ones with each new question.',
      hints: [
        'Store each message as a dictionary with a role ("user" or "assistant") and the content.',
        'Count exchanges, not characters. Keeping six exchanges is a simple way to stay within the context window.',
        'A FakeModel stands in for a real model, so this step runs without a server. Replace it in milestone 5.',
      ],
      code: {
        language: 'python',
        filename: 'chat.py',
        code: code`
          MAX_EXCHANGES = 6

          class FakeModel:
              """A stand-in for a real model, so the loop runs without a server."""
              def reply(self, messages):
                  return f"You said: {messages[-1]['content']}"

          def chat_turn(model, history, user_text):
              history.append({"role": "user", "content": user_text})
              recent = history[-(MAX_EXCHANGES * 2):]
              answer = model.reply([{"role": "system", "content": "You are a helpful assistant."}] + recent)
              history.append({"role": "assistant", "content": answer})
              return answer

          history = []
          model = FakeModel()
          for text in ["Hello", "What is a context window?"]:
              print(chat_turn(model, history, text))
          print("messages kept:", len(history))
        `,
        output: 'You said: Hello\nYou said: What is a context window?\nmessages kept: 4',
      },
      checkpoint: 'The output shows both replies and the history holds four messages.',
    },
    {
      title: 'Stream the reply',
      goal: 'Print the reply as it arrives, one word at a time, instead of waiting for the whole answer.',
      hints: [
        'A generator function uses yield, so each piece of the answer is handed over as soon as it exists.',
        'Use print with end="" and flush=True, so the words appear on the same line as they arrive.',
        'Real providers can stream too. Their API lets you read chunks in the same way.',
      ],
      code: {
        language: 'python',
        filename: 'stream.py',
        code: code`
          def stream(text):
              for word in text.split():
                  yield word + " "

          pieces = []
          for piece in stream("Streaming shows the answer as it is made."):
              print(piece, end="", flush=True)
              pieces.append(piece)
          print()
          print("pieces:", len(pieces))
        `,
        output: 'Streaming shows the answer as it is made. \npieces: 8',
      },
      checkpoint: 'The words print one at a time, and the program reports eight pieces, one for each word.',
    },
    {
      title: 'Handle limits and failures',
      goal: 'Refuse overly long messages, and turn a failed model call into a clear message instead of a crash.',
      hints: [
        'Check the length before you call the model, so a refused message costs nothing.',
        'Catch the specific error you expect, not every error, so bugs still show up.',
        'Log the error type with no message text, so private content does not reach the logs.',
      ],
      code: {
        language: 'python',
        filename: 'safe_reply.py',
        code: code`
          MAX_CHARS = 2000

          class BrokenModel:
              def reply(self, messages):
                  raise TimeoutError("no answer in time")

          def safe_reply(model, text):
              if len(text) > MAX_CHARS:
                  return "Please shorten your message."
              try:
                  return model.reply([{"role": "user", "content": text}])
              except TimeoutError:
                  return "The model did not answer. Try again."

          print(safe_reply(BrokenModel(), "Hello"))
          print(safe_reply(BrokenModel(), "x" * 2500))
        `,
        output: 'The model did not answer. Try again.\nPlease shorten your message.',
      },
      checkpoint: 'Both messages print a friendly reply, and neither one stops the program.',
    },
    {
      title: 'Connect a real model',
      goal: 'Replace the FakeModel with a client for an OpenAI-compatible endpoint, and choose the provider with one setting.',
      hints: [
        'Start a local model server first, then set CHAT_BASE_URL to its address. The local default in config.py matches Ollama.',
        'Use the same chat loop from milestone 2. Only the model object changes.',
        'For a hosted provider, set CHAT_PROVIDER and CHAT_API_KEY in your environment or .env file, and never in the code.',
        'Ask the same question with each provider. The answers will differ, so judge them by the same checklist, not by exact words.',
      ],
      checkpoint: 'You can ask a question, get a reply from a real model and switch providers by changing one setting.',
    },
  ],
  finishedMeans: [
    'python chat.py runs from a fresh clone after you create the virtual environment and install the requirements',
    'No API key appears in the code, the README or the Git history',
    'A follow-up question uses the earlier messages, and an old message drops out after six exchanges',
    'Overly long messages and failed model calls show a friendly message',
    'The README explains how to switch providers with one setting',
  ],
  readmeTemplate: code`
    # [Project name]

    [One sentence: what the chatbot does and who it is for.]

    ## Run it
    1. python -m venv .venv, then activate it
    2. pip install -r requirements.txt
    3. Optional: set CHAT_PROVIDER and CHAT_BASE_URL (see config.py)
    4. python chat.py

    ## How it works
    [Three sentences on history, streaming and the provider setting.]

    ## Limits
    [Message length, history size, and what happens when the model fails.]

    ## What I would improve next
    [One or two honest next steps.]
  `,
  portfolioText: "Describe this as a chat program with memory, streaming and a provider switch. Say which provider you tested with, what limit you chose for history and why, and one failure you handled. Interviewers look for the choices behind the code, so explain the trade-off between history size and cost.",
  stretchGoals: [
    'Save the conversation to a file, and load it at the next start',
    'Add a system prompt that you can change without editing the code',
    'Count tokens with the model\'s own tokenizer, and show the count after each reply',
  ],
}

export default plan
