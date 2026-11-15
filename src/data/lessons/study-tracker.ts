/**
 * The canonical Study Tracker code, shared by every Software Engineering lesson so the files always match.
 * Names are fixed by CLAUDE.md: folder study-tracker, app.py, study.db, table sessions,
 * fields id, subject, minutes, studied_on.
 *
 * Versions build on each other:
 *   build-an-api      -> appInMemory
 *   config-and-secrets -> config, envExample
 *   databases-sql     -> db, appWithDatabase
 *   testing-debugging -> testApp, workflow
 *   logging           -> app (final)
 *   docker            -> dockerfile, dockerignore
 *   capstone          -> everything, plus requirements and readme
 */
import { code } from './helpers'

export const gitignore = code`
  .venv/
  .env
  study.db
  __pycache__/
`

export const requirements = code`
  fastapi
  uvicorn
  python-dotenv
  pytest
  httpx
`

export const appInMemory = code`
  from datetime import date

  from fastapi import FastAPI
  from pydantic import BaseModel, Field

  app = FastAPI(title="Study Tracker")


  class SessionIn(BaseModel):
      subject: str = Field(min_length=1, max_length=50)
      minutes: int = Field(gt=0, le=600)
      studied_on: date


  class Session(SessionIn):
      id: int


  sessions: list[Session] = []


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return sessions


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      session = Session(id=len(sessions) + 1, **new.model_dump())
      sessions.append(session)
      return session
`

export const config = code`
  import os

  from dotenv import load_dotenv

  load_dotenv()

  DATABASE_PATH = os.environ.get("DATABASE_PATH", "study.db")
  LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
`

export const envExample = code`
  # Copy this file to .env and change the values. Never commit .env.
  DATABASE_PATH=study.db
  LOG_LEVEL=INFO
  # Used later, in AI Engineering. Get a real key from your provider.
  AI_API_KEY=your-key-here
`

export const db = code`
  import sqlite3

  import config

  SCHEMA = """
  CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      minutes INTEGER NOT NULL,
      studied_on TEXT NOT NULL
  )
  """


  def connect():
      conn = sqlite3.connect(config.DATABASE_PATH)
      conn.row_factory = sqlite3.Row
      conn.execute(SCHEMA)
      return conn


  def add_session(subject, minutes, studied_on):
      conn = connect()
      try:
          cursor = conn.execute(
              "INSERT INTO sessions (subject, minutes, studied_on) VALUES (?, ?, ?)",
              (subject, minutes, studied_on),
          )
          conn.commit()
          return cursor.lastrowid
      finally:
          conn.close()


  def list_sessions():
      conn = connect()
      try:
          rows = conn.execute("SELECT id, subject, minutes, studied_on FROM sessions ORDER BY id").fetchall()
          return [dict(row) for row in rows]
      finally:
          conn.close()


  def totals():
      conn = connect()
      try:
          rows = conn.execute(
              "SELECT subject, SUM(minutes) AS minutes FROM sessions GROUP BY subject ORDER BY subject"
          ).fetchall()
          return {row["subject"]: row["minutes"] for row in rows}
      finally:
          conn.close()
`

export const appWithDatabase = code`
  from datetime import date

  from fastapi import FastAPI
  from pydantic import BaseModel, Field

  import db

  app = FastAPI(title="Study Tracker")


  class SessionIn(BaseModel):
      subject: str = Field(min_length=1, max_length=50)
      minutes: int = Field(gt=0, le=600)
      studied_on: date


  class Session(SessionIn):
      id: int


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      return Session(id=session_id, **new.model_dump())


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

export const testApp = code`
  import pytest
  from fastapi.testclient import TestClient

  import config
  from app import app


  @pytest.fixture
  def client(tmp_path, monkeypatch):
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))
      return TestClient(app)


  def test_create_session_returns_201(client):
      response = client.post("/sessions", json={"subject": "algebra", "minutes": 40, "studied_on": "2026-03-02"})
      assert response.status_code == 201
      assert response.json()["id"] == 1


  def test_totals_add_up_per_subject(client):
      for minutes in (30, 45):
          client.post("/sessions", json={"subject": "python", "minutes": minutes, "studied_on": "2026-03-02"})
      assert client.get("/totals").json() == {"python": 75}


  def test_rejects_negative_minutes(client):
      response = client.post("/sessions", json={"subject": "python", "minutes": -5, "studied_on": "2026-03-02"})
      assert response.status_code == 422
`

export const workflow = code`
  name: tests
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v5
          with:
            python-version: "3.12"
        - run: python -m pip install -r requirements.txt
        - run: python -m pytest
`

export const app = code`
  import logging
  from datetime import date

  from fastapi import FastAPI, HTTPException
  from pydantic import BaseModel, Field

  import config
  import db

  logging.basicConfig(
      level=config.LOG_LEVEL,
      format="%(asctime)s %(levelname)s %(name)s: %(message)s",
  )
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  class SessionIn(BaseModel):
      subject: str = Field(min_length=1, max_length=50)
      minutes: int = Field(gt=0, le=600)
      studied_on: date


  class Session(SessionIn):
      id: int


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

export const dockerfile = code`
  FROM python:3.12-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  EXPOSE 8000
  CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
`

export const dockerignore = code`
  .venv/
  .env
  .git/
  study.db
  __pycache__/
`

/*
 * AI Engineering builds on the finished app above:
 *   ai-apis -> configAi, envExampleAi, ai (ask_model), tryAi
 */

export const configAi = code`
  import os

  from dotenv import load_dotenv

  load_dotenv()

  DATABASE_PATH = os.environ.get("DATABASE_PATH", "study.db")
  LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

  # Where to send AI requests. The default is Ollama running on this computer.
  AI_BASE_URL = os.environ.get("AI_BASE_URL", "http://localhost:11434/v1")
  AI_MODEL = os.environ.get("AI_MODEL", "")
  AI_API_KEY = os.environ.get("AI_API_KEY", "")
`

export const envExampleAi = code`
  # Copy this file to .env and change the values. Never commit .env.
  DATABASE_PATH=study.db
  LOG_LEVEL=INFO

  # Free and local: Ollama. No key needed.
  AI_BASE_URL=http://localhost:11434/v1
  AI_MODEL=your-model-name
  AI_API_KEY=

  # Hosted instead: use your provider's compatible URL, model and key.
  # AI_BASE_URL=https://api.example-provider.com/v1
  # AI_MODEL=provider-model-name
  # AI_API_KEY=your-key-here
`

export const ai = code`
  import logging
  import time

  import httpx

  import config

  logger = logging.getLogger("study_tracker.ai")

  RETRY_STATUSES = {429, 500, 502, 503, 504}


  class AIError(Exception):
      """The model could not give an answer."""


  def ask_model(prompt, system="You are a helpful study assistant.", retries=2):
      """Send one prompt to the model and return its reply as text."""
      headers = {}
      if config.AI_API_KEY:
          headers["Authorization"] = f"Bearer {config.AI_API_KEY}"
      body = {
          "model": config.AI_MODEL,
          "messages": [
              {"role": "system", "content": system},
              {"role": "user", "content": prompt},
          ],
      }
      for attempt in range(retries + 1):
          try:
              response = httpx.post(
                  f"{config.AI_BASE_URL}/chat/completions",
                  json=body,
                  headers=headers,
                  timeout=60,
              )
          except httpx.TransportError as error:
              problem = f"could not reach the model at {config.AI_BASE_URL}: {error}"
          else:
              if response.status_code == 200:
                  return response.json()["choices"][0]["message"]["content"]
              problem = f"the model service returned status {response.status_code}"
              if response.status_code not in RETRY_STATUSES:
                  break
          if attempt < retries:
              wait = 2 ** attempt
              logger.warning("AI request failed (%s), retrying in %s s", problem, wait)
              time.sleep(wait)
      raise AIError(problem)
`

export const tryAi = code`
  from ai import ask_model

  reply = ask_model("In one sentence, why does spaced practice help memory?")
  print(reply)
`

/*
 *   structured-outputs -> aiChat (chat + ask_model with options), schemas, extract, appParse, testExtract
 */

export const aiChat = code`
  import logging
  import time

  import httpx

  import config

  logger = logging.getLogger("study_tracker.ai")

  RETRY_STATUSES = {429, 500, 502, 503, 504}


  class AIError(Exception):
      """The model could not give an answer."""


  def chat(messages, retries=2, **options):
      """Send a list of messages and return the model's reply message as a dict."""
      headers = {}
      if config.AI_API_KEY:
          headers["Authorization"] = f"Bearer {config.AI_API_KEY}"
      body = {"model": config.AI_MODEL, "messages": messages, **options}
      for attempt in range(retries + 1):
          try:
              response = httpx.post(
                  f"{config.AI_BASE_URL}/chat/completions",
                  json=body,
                  headers=headers,
                  timeout=60,
              )
          except httpx.TransportError as error:
              problem = f"could not reach the model at {config.AI_BASE_URL}: {error}"
          else:
              if response.status_code == 200:
                  return response.json()["choices"][0]["message"]
              problem = f"the model service returned status {response.status_code}"
              if response.status_code not in RETRY_STATUSES:
                  break
          if attempt < retries:
              wait = 2 ** attempt
              logger.warning("AI request failed (%s), retrying in %s s", problem, wait)
              time.sleep(wait)
      raise AIError(problem)


  def ask_model(prompt, system="You are a helpful study assistant.", **options):
      """Send one prompt to the model and return its reply as text."""
      messages = [
          {"role": "system", "content": system},
          {"role": "user", "content": prompt},
      ]
      return chat(messages, **options)["content"]
`

export const schemas = code`
  from datetime import date

  from pydantic import BaseModel, Field


  class SessionIn(BaseModel):
      subject: str = Field(min_length=1, max_length=50)
      minutes: int = Field(gt=0, le=600)
      studied_on: date


  class Session(SessionIn):
      id: int
`

export const extract = code`
  from datetime import date

  from pydantic import ValidationError

  from ai import AIError, ask_model
  from schemas import SessionIn

  PROMPT = """Turn the learner's note into one study session.
  Today's date is {today}.
  Reply with only a JSON object with exactly these keys:
    "subject": a short lowercase subject name, such as "algebra"
    "minutes": the number of minutes as a whole number
    "studied_on": the date in YYYY-MM-DD format
  If the note does not mention a date, use today's date.

  Note: {note}"""


  def session_from_text(note, today=None):
      """Ask the model to read a note and return a validated SessionIn."""
      today = today or date.today()
      prompt = PROMPT.format(today=today.isoformat(), note=note)
      reply = ask_model(prompt, response_format={"type": "json_object"}, temperature=0)
      try:
          return SessionIn.model_validate_json(reply)
      except ValidationError as error:
          raise AIError(f"the reply was not a valid session ({error.error_count()} problem(s))") from error
`

export const appParse = code`
  import logging
  from datetime import date

  from fastapi import FastAPI, HTTPException
  from pydantic import BaseModel, Field

  import config
  import db
  import extract
  from ai import AIError
  from schemas import Session, SessionIn

  logging.basicConfig(
      level=config.LOG_LEVEL,
      format="%(asctime)s %(levelname)s %(name)s: %(message)s",
  )
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  class NoteIn(BaseModel):
      text: str = Field(min_length=1, max_length=500)


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.post("/sessions/parse")
  def parse_session(note: NoteIn) -> SessionIn:
      """Turn a sentence into a draft session. Nothing is saved until the learner confirms."""
      try:
          draft = extract.session_from_text(note.text)
      except AIError as error:
          logger.warning("Could not parse note: %s", error)
          raise HTTPException(status_code=422, detail="Could not read a session from that note")
      logger.info("Parsed note into draft: %s, %s minutes", draft.subject, draft.minutes)
      return draft


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

export const testExtract = code`
  from datetime import date

  import pytest

  import extract
  from ai import AIError

  TODAY = date(2026, 3, 6)


  def fake_reply(text):
      """Replace the real model with one that always returns text."""
      return lambda prompt, **options: text


  def test_valid_reply_becomes_a_session(monkeypatch):
      monkeypatch.setattr(extract, "ask_model", fake_reply(
          '{"subject": "algebra", "minutes": 40, "studied_on": "2026-03-06"}'
      ))
      session = extract.session_from_text("I studied algebra for 40 minutes", today=TODAY)
      assert session.minutes == 40
      assert session.studied_on == TODAY


  def test_minutes_out_of_range_are_rejected(monkeypatch):
      monkeypatch.setattr(extract, "ask_model", fake_reply(
          '{"subject": "algebra", "minutes": 900, "studied_on": "2026-03-06"}'
      ))
      with pytest.raises(AIError):
          extract.session_from_text("algebra all day", today=TODAY)


  def test_reply_that_is_not_json_is_rejected(monkeypatch):
      monkeypatch.setattr(extract, "ask_model", fake_reply("Sure! You studied algebra."))
      with pytest.raises(AIError):
          extract.session_from_text("algebra 40 min", today=TODAY)
`

/*
 *   tool-calling -> assistant, appAssistant, testAssistant
 */

export const assistant = code`
  import json
  import logging
  from datetime import date

  from pydantic import ValidationError

  import db
  from ai import AIError, chat
  from schemas import SessionIn

  logger = logging.getLogger("study_tracker.assistant")

  MAX_STEPS = 5

  SYSTEM = """You are the study assistant inside Study Tracker.
  Today's date is {today}.
  Use get_totals to answer questions about time studied. Never guess numbers.
  Use log_session only when the learner says they finished a study session.
  After using a tool, tell the learner exactly what happened in one or two sentences."""

  TOOLS = [
      {
          "type": "function",
          "function": {
              "name": "get_totals",
              "description": "Get the total minutes studied per subject, across all saved sessions.",
              "parameters": {"type": "object", "properties": {}},
          },
      },
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
      },
  ]


  def get_totals():
      return db.totals()


  def log_session(subject, minutes, studied_on):
      session = SessionIn(subject=subject, minutes=minutes, studied_on=studied_on)
      if session.studied_on > date.today():
          raise ValueError("studied_on cannot be in the future")
      session_id = db.add_session(session.subject, session.minutes, session.studied_on.isoformat())
      return {"saved": True, "id": session_id, **session.model_dump(mode="json")}


  FUNCTIONS = {"get_totals": get_totals, "log_session": log_session}


  def run_tool(call):
      """Run one tool call from the model and return a result it can read."""
      name = call["function"]["name"]
      if name not in FUNCTIONS:
          return {"error": f"there is no tool called {name}"}
      try:
          arguments = json.loads(call["function"]["arguments"] or "{}")
          result = FUNCTIONS[name](**arguments)
      except (json.JSONDecodeError, TypeError, ValueError, ValidationError) as error:
          logger.warning("Tool %s failed: %s", name, error)
          return {"error": str(error)}
      logger.info("Tool %s ran with %s", name, arguments)
      return result


  def ask_assistant(message):
      """Answer one learner message, running tools as the model requests them."""
      messages = [
          {"role": "system", "content": SYSTEM.format(today=date.today().isoformat())},
          {"role": "user", "content": message},
      ]
      for _ in range(MAX_STEPS):
          reply = chat(messages, tools=TOOLS, temperature=0)
          messages.append(reply)
          if not reply.get("tool_calls"):
              return reply["content"]
          for call in reply["tool_calls"]:
              result = run_tool(call)
              messages.append({"role": "tool", "tool_call_id": call["id"], "content": json.dumps(result)})
      raise AIError(f"the assistant did not finish within {MAX_STEPS} steps")
`

export const testAssistant = code`
  import json

  import pytest

  import assistant
  import config
  import db


  @pytest.fixture(autouse=True)
  def test_database(tmp_path, monkeypatch):
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))


  def tool_call(name, arguments):
      return {
          "role": "assistant",
          "content": None,
          "tool_calls": [{"id": "call_1", "type": "function",
                          "function": {"name": name, "arguments": json.dumps(arguments)}}],
      }


  def scripted_model(*replies):
      """A fake chat() that returns the given replies in order and records what it was sent."""
      sent = []

      def fake_chat(messages, **options):
          sent.append(list(messages))
          return replies[len(sent) - 1]

      return fake_chat, sent


  def test_log_session_saves_and_reports(monkeypatch):
      fake_chat, sent = scripted_model(
          tool_call("log_session", {"subject": "python", "minutes": 30, "studied_on": "2026-03-06"}),
          {"role": "assistant", "content": "Saved 30 minutes of python."},
      )
      monkeypatch.setattr(assistant, "chat", fake_chat)
      assert assistant.ask_assistant("I just did 30 minutes of python") == "Saved 30 minutes of python."
      assert db.totals() == {"python": 30}
      tool_message = sent[1][-1]
      assert tool_message["role"] == "tool"
      assert json.loads(tool_message["content"])["saved"] is True


  def test_invalid_arguments_are_refused(monkeypatch):
      fake_chat, sent = scripted_model(
          tool_call("log_session", {"subject": "python", "minutes": 900, "studied_on": "2026-03-06"}),
          {"role": "assistant", "content": "That session could not be saved."},
      )
      monkeypatch.setattr(assistant, "chat", fake_chat)
      assistant.ask_assistant("log 900 minutes of python")
      assert db.totals() == {}
      assert "error" in json.loads(sent[1][-1]["content"])


  def test_endless_tool_calls_are_stopped(monkeypatch):
      monkeypatch.setattr(assistant, "chat", lambda messages, **options: tool_call("get_totals", {}))
      with pytest.raises(assistant.AIError):
          assistant.ask_assistant("how much have I studied?")
`

export const appAssistant = code`
  import logging
  from datetime import date

  from fastapi import FastAPI, HTTPException
  from pydantic import BaseModel, Field

  import assistant
  import config
  import db
  import extract
  from ai import AIError
  from schemas import Session, SessionIn

  logging.basicConfig(
      level=config.LOG_LEVEL,
      format="%(asctime)s %(levelname)s %(name)s: %(message)s",
  )
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  class NoteIn(BaseModel):
      text: str = Field(min_length=1, max_length=500)


  class MessageIn(BaseModel):
      message: str = Field(min_length=1, max_length=1000)


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.post("/sessions/parse")
  def parse_session(note: NoteIn) -> SessionIn:
      """Turn a sentence into a draft session. Nothing is saved until the learner confirms."""
      try:
          draft = extract.session_from_text(note.text)
      except AIError as error:
          logger.warning("Could not parse note: %s", error)
          raise HTTPException(status_code=422, detail="Could not read a session from that note")
      logger.info("Parsed note into draft: %s, %s minutes", draft.subject, draft.minutes)
      return draft


  @app.post("/assistant")
  def talk_to_assistant(incoming: MessageIn) -> dict[str, str]:
      try:
          return {"reply": assistant.ask_assistant(incoming.message)}
      except AIError as error:
          logger.warning("Assistant failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

/*
 *   embeddings -> configEmbed, aiEmbed (shared post_json, chat, ask_model, embed), notesV1, tryNotes, sample notes, testNotes
 */

export const configEmbed = code`
  import os

  from dotenv import load_dotenv

  load_dotenv()

  DATABASE_PATH = os.environ.get("DATABASE_PATH", "study.db")
  LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

  # Where to send AI requests. The default is Ollama running on this computer.
  AI_BASE_URL = os.environ.get("AI_BASE_URL", "http://localhost:11434/v1")
  AI_MODEL = os.environ.get("AI_MODEL", "")
  AI_EMBED_MODEL = os.environ.get("AI_EMBED_MODEL", "")
  AI_API_KEY = os.environ.get("AI_API_KEY", "")
`

export const aiEmbed = code`
  import logging
  import time

  import httpx

  import config

  logger = logging.getLogger("study_tracker.ai")

  RETRY_STATUSES = {429, 500, 502, 503, 504}


  class AIError(Exception):
      """The model could not give an answer."""


  def post_json(path, body, retries=2):
      """POST to the model service, retrying failures that may fix themselves."""
      headers = {}
      if config.AI_API_KEY:
          headers["Authorization"] = f"Bearer {config.AI_API_KEY}"
      for attempt in range(retries + 1):
          try:
              response = httpx.post(f"{config.AI_BASE_URL}{path}", json=body, headers=headers, timeout=60)
          except httpx.TransportError as error:
              problem = f"could not reach the model at {config.AI_BASE_URL}: {error}"
          else:
              if response.status_code == 200:
                  return response.json()
              problem = f"the model service returned status {response.status_code}"
              if response.status_code not in RETRY_STATUSES:
                  break
          if attempt < retries:
              wait = 2 ** attempt
              logger.warning("AI request failed (%s), retrying in %s s", problem, wait)
              time.sleep(wait)
      raise AIError(problem)


  def chat(messages, **options):
      """Send a list of messages and return the model's reply message as a dict."""
      body = {"model": config.AI_MODEL, "messages": messages, **options}
      return post_json("/chat/completions", body)["choices"][0]["message"]


  def ask_model(prompt, system="You are a helpful study assistant.", **options):
      """Send one prompt to the model and return its reply as text."""
      messages = [
          {"role": "system", "content": system},
          {"role": "user", "content": prompt},
      ]
      return chat(messages, **options)["content"]


  def embed(texts):
      """Turn a list of texts into a list of embedding vectors, in the same order."""
      data = post_json("/embeddings", {"model": config.AI_EMBED_MODEL, "input": texts})["data"]
      return [item["embedding"] for item in sorted(data, key=lambda item: item["index"])]
`

export const notesV1 = code`
  from pathlib import Path

  from ai import embed

  NOTES_DIR = Path("notes")


  def load_chunks():
      """Split every notes file into paragraphs, remembering which file each came from."""
      chunks = []
      for path in sorted(NOTES_DIR.glob("*.md")):
          paragraphs = [part.strip() for part in path.read_text(encoding="utf-8").split("\n\n")]
          # Skip empty paragraphs and heading lines such as "# Biology".
          chunks += [{"source": path.name, "text": text} for text in paragraphs if text and not text.startswith("#")]
      return chunks


  def cosine_similarity(a, b):
      dot = sum(x * y for x, y in zip(a, b))
      length_a = sum(x * x for x in a) ** 0.5
      length_b = sum(x * x for x in b) ** 0.5
      return dot / (length_a * length_b)


  def find_similar(question, top=3):
      """Return the note paragraphs closest in meaning to the question, best first."""
      chunks = load_chunks()
      vectors = embed([question] + [chunk["text"] for chunk in chunks])
      question_vector = vectors[0]
      for chunk, vector in zip(chunks, vectors[1:]):
          chunk["score"] = cosine_similarity(question_vector, vector)
      return sorted(chunks, key=lambda chunk: chunk["score"], reverse=True)[:top]
`

export const tryNotes = code`
  from notes import find_similar

  for chunk in find_similar("How do cells get energy?"):
      print(f"{chunk['score']:.2f}  {chunk['source']}: {chunk['text']}")
`

export const notesBiology = code`
  # Biology

  Mitochondria turn glucose into ATP, the cell's energy currency.

  Photosynthesis happens in the chloroplasts of plant cells.
`

export const notesAlgebra = code`
  # Algebra

  To add fractions, make the denominators the same first.
`

export const notesHistory = code`
  # History

  The Peace of Westphalia was signed in 1648.
`

export const testNotes = code`
  import pytest

  import notes


  @pytest.fixture
  def notes_folder(tmp_path, monkeypatch):
      (tmp_path / "biology.md").write_text("# Biology\n\nCells make energy.\n\nPlants use light.", encoding="utf-8")
      (tmp_path / "algebra.md").write_text("Fractions need a common denominator.", encoding="utf-8")
      monkeypatch.setattr(notes, "NOTES_DIR", tmp_path)


  def test_files_are_split_into_paragraphs(notes_folder):
      chunks = notes.load_chunks()
      assert [chunk["source"] for chunk in chunks] == ["algebra.md", "biology.md", "biology.md"]
      assert chunks[1]["text"] == "Cells make energy."


  def test_cosine_similarity():
      assert notes.cosine_similarity([1, 0], [2, 0]) == pytest.approx(1.0)
      assert notes.cosine_similarity([1, 0], [0, 3]) == pytest.approx(0.0)


  def test_closest_paragraph_comes_first(notes_folder, monkeypatch):
      fake_vectors = {
          "How do cells get energy?": [1.0, 0.0],
          "Cells make energy.": [0.9, 0.1],
          "Plants use light.": [0.5, 0.5],
          "Fractions need a common denominator.": [0.0, 1.0],
      }
      monkeypatch.setattr(notes, "embed", lambda texts: [fake_vectors[text] for text in texts])
      results = notes.find_similar("How do cells get energy?", top=2)
      assert [chunk["text"] for chunk in results] == ["Cells make energy.", "Plants use light."]
`

/*
 *   vector-databases -> notesStore (index_notes, search), indexNotes script, appSearch, testNotesStore
 */

export const notesStore = code`
  import json
  from pathlib import Path

  import db
  from ai import embed

  NOTES_DIR = Path("notes")

  CHUNKS_SCHEMA = """
  CREATE TABLE IF NOT EXISTS note_chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      text TEXT NOT NULL,
      embedding TEXT NOT NULL
  )
  """


  def load_chunks():
      """Split every notes file into paragraphs, remembering which file each came from."""
      chunks = []
      for path in sorted(NOTES_DIR.glob("*.md")):
          paragraphs = [part.strip() for part in path.read_text(encoding="utf-8").split("\n\n")]
          # Skip empty paragraphs and heading lines such as "# Biology".
          chunks += [{"source": path.name, "text": text} for text in paragraphs if text and not text.startswith("#")]
      return chunks


  def cosine_similarity(a, b):
      dot = sum(x * y for x, y in zip(a, b))
      length_a = sum(x * x for x in a) ** 0.5
      length_b = sum(x * x for x in b) ** 0.5
      return dot / (length_a * length_b)


  def index_notes():
      """Embed every paragraph once and store the vectors in study.db, replacing the old index."""
      chunks = load_chunks()
      vectors = embed([chunk["text"] for chunk in chunks]) if chunks else []
      conn = db.connect()
      try:
          conn.execute(CHUNKS_SCHEMA)
          conn.execute("DELETE FROM note_chunks")
          conn.executemany(
              "INSERT INTO note_chunks (source, text, embedding) VALUES (?, ?, ?)",
              [(chunk["source"], chunk["text"], json.dumps(vector)) for chunk, vector in zip(chunks, vectors)],
          )
          conn.commit()
      finally:
          conn.close()
      return len(chunks)


  def search(question, top=3, source=None):
      """Return the stored paragraphs closest to the question, best first.

      Pass source="biology.md" to search only one file.
      """
      question_vector = embed([question])[0]
      sql = "SELECT source, text, embedding FROM note_chunks"
      params = ()
      if source:
          sql += " WHERE source = ?"
          params = (source,)
      conn = db.connect()
      try:
          conn.execute(CHUNKS_SCHEMA)
          rows = conn.execute(sql, params).fetchall()
      finally:
          conn.close()
      results = [
          {"source": row["source"], "text": row["text"],
           "score": cosine_similarity(question_vector, json.loads(row["embedding"]))}
          for row in rows
      ]
      return sorted(results, key=lambda result: result["score"], reverse=True)[:top]
`

export const indexNotesScript = code`
  import logging

  import notes

  logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")

  count = notes.index_notes()
  print(f"Indexed {count} paragraphs from {notes.NOTES_DIR}/")
`

export const testNotesStore = code`
  import pytest

  import config
  import notes

  FAKE_VECTORS = {
      "Cells make energy.": [0.9, 0.1],
      "Plants use light.": [0.5, 0.5],
      "Fractions need a common denominator.": [0.0, 1.0],
      "How do cells get energy?": [1.0, 0.0],
  }


  @pytest.fixture(autouse=True)
  def setup(tmp_path, monkeypatch):
      notes_dir = tmp_path / "notes"
      notes_dir.mkdir()
      (notes_dir / "biology.md").write_text("# Biology\n\nCells make energy.\n\nPlants use light.", encoding="utf-8")
      (notes_dir / "algebra.md").write_text("Fractions need a common denominator.", encoding="utf-8")
      monkeypatch.setattr(notes, "NOTES_DIR", notes_dir)
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))
      monkeypatch.setattr(notes, "embed", lambda texts: [FAKE_VECTORS[text] for text in texts])


  def test_index_stores_every_paragraph():
      assert notes.index_notes() == 3


  def test_search_ranks_by_meaning():
      notes.index_notes()
      results = notes.search("How do cells get energy?", top=2)
      assert [result["text"] for result in results] == ["Cells make energy.", "Plants use light."]


  def test_search_can_filter_by_source():
      notes.index_notes()
      results = notes.search("How do cells get energy?", source="algebra.md")
      assert [result["source"] for result in results] == ["algebra.md"]


  def test_reindexing_replaces_old_rows():
      notes.index_notes()
      notes.index_notes()
      assert len(notes.search("How do cells get energy?", top=10)) == 3
`

export const appSearch = code`
  import logging
  from datetime import date

  from fastapi import FastAPI, HTTPException, Query
  from pydantic import BaseModel, Field

  import assistant
  import config
  import db
  import extract
  import notes
  from ai import AIError
  from schemas import Session, SessionIn

  logging.basicConfig(
      level=config.LOG_LEVEL,
      format="%(asctime)s %(levelname)s %(name)s: %(message)s",
  )
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  class NoteIn(BaseModel):
      text: str = Field(min_length=1, max_length=500)


  class MessageIn(BaseModel):
      message: str = Field(min_length=1, max_length=1000)


  class NoteMatch(BaseModel):
      source: str
      text: str
      score: float


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.post("/sessions/parse")
  def parse_session(note: NoteIn) -> SessionIn:
      """Turn a sentence into a draft session. Nothing is saved until the learner confirms."""
      try:
          draft = extract.session_from_text(note.text)
      except AIError as error:
          logger.warning("Could not parse note: %s", error)
          raise HTTPException(status_code=422, detail="Could not read a session from that note")
      logger.info("Parsed note into draft: %s, %s minutes", draft.subject, draft.minutes)
      return draft


  @app.post("/assistant")
  def talk_to_assistant(incoming: MessageIn) -> dict[str, str]:
      try:
          return {"reply": assistant.ask_assistant(incoming.message)}
      except AIError as error:
          logger.warning("Assistant failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.get("/notes/search")
  def search_notes(q: str = Query(min_length=1, max_length=500), source: str | None = None) -> list[NoteMatch]:
      try:
          return notes.search(q, source=source)
      except AIError as error:
          logger.warning("Note search failed: %s", error)
          raise HTTPException(status_code=503, detail="Note search is unavailable")


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

/*
 *   rag -> rag, appRag, testRag
 */

export const rag = code`
  import logging

  import notes
  from ai import ask_model

  logger = logging.getLogger("study_tracker.rag")

  # The lowest similarity that counts as a match. Tune it for your embedding model
  # by trying questions your notes can and cannot answer.
  MIN_SCORE = 0.35
  NOT_FOUND = "I couldn't find that in your notes."

  SYSTEM = f"""You answer questions using only the learner's notes, given between <notes> tags.
  Each note starts with a number in square brackets. After each fact you use, cite its note, like [1].
  If the notes do not answer the question, reply exactly: {NOT_FOUND}"""


  def build_prompt(question, matches):
      numbered = "\n".join(
          f"[{number}] ({match['source']}) {match['text']}" for number, match in enumerate(matches, start=1)
      )
      return f"<notes>\n{numbered}\n</notes>\n\nQuestion: {question}"


  def answer_from_notes(question):
      """Search the notes, then answer only from what was found, with numbered sources."""
      matches = [match for match in notes.search(question, top=3) if match["score"] >= MIN_SCORE]
      if not matches:
          logger.info("No note scored above %s, answering not found", MIN_SCORE)
          return {"answer": NOT_FOUND, "sources": []}
      answer = ask_model(build_prompt(question, matches), system=SYSTEM, temperature=0)
      sources = [
          {"number": number, "source": match["source"], "text": match["text"]}
          for number, match in enumerate(matches, start=1)
      ]
      logger.info("Answered from %s note paragraph(s)", len(sources))
      return {"answer": answer, "sources": sources}
`

export const testRag = code`
  from fastapi.testclient import TestClient

  import rag
  from app import app

  MATCHES = [
      {"source": "biology.md", "text": "Mitochondria turn glucose into ATP.", "score": 0.63},
      {"source": "biology.md", "text": "Photosynthesis happens in chloroplasts.", "score": 0.43},
      {"source": "algebra.md", "text": "Make the denominators the same first.", "score": 0.07},
  ]


  def test_weak_matches_are_left_out(monkeypatch):
      sent = []
      monkeypatch.setattr(rag.notes, "search", lambda question, top: MATCHES)
      monkeypatch.setattr(rag, "ask_model", lambda prompt, **options: sent.append(prompt) or "ATP [1].")
      result = rag.answer_from_notes("How do cells get energy?")
      assert [source["number"] for source in result["sources"]] == [1, 2]
      assert "[1] (biology.md) Mitochondria" in sent[0]
      assert "denominators" not in sent[0]


  def test_no_match_skips_the_model(monkeypatch):
      monkeypatch.setattr(rag.notes, "search", lambda question, top: MATCHES[2:])

      def model_should_not_run(prompt, **options):
          raise AssertionError("the model was called")

      monkeypatch.setattr(rag, "ask_model", model_should_not_run)
      result = rag.answer_from_notes("Who won the 1998 World Cup?")
      assert result == {"answer": rag.NOT_FOUND, "sources": []}


  def test_ask_endpoint_returns_answer_and_sources(monkeypatch):
      monkeypatch.setattr(rag, "answer_from_notes", lambda question: {
          "answer": "Mitochondria turn glucose into ATP [1].",
          "sources": [{"number": 1, "source": "biology.md", "text": "Mitochondria turn glucose into ATP."}],
      })
      response = TestClient(app).post("/notes/ask", json={"question": "How do cells get energy?"})
      assert response.status_code == 200
      assert response.json()["sources"][0]["source"] == "biology.md"
`

export const appRag = code`
  import logging
  from datetime import date

  from fastapi import FastAPI, HTTPException, Query
  from pydantic import BaseModel, Field

  import assistant
  import config
  import db
  import extract
  import notes
  import rag
  from ai import AIError
  from schemas import Session, SessionIn

  logging.basicConfig(
      level=config.LOG_LEVEL,
      format="%(asctime)s %(levelname)s %(name)s: %(message)s",
  )
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  class NoteIn(BaseModel):
      text: str = Field(min_length=1, max_length=500)


  class MessageIn(BaseModel):
      message: str = Field(min_length=1, max_length=1000)


  class QuestionIn(BaseModel):
      question: str = Field(min_length=1, max_length=500)


  class Source(BaseModel):
      number: int
      source: str
      text: str


  class Answer(BaseModel):
      answer: str
      sources: list[Source]


  class NoteMatch(BaseModel):
      source: str
      text: str
      score: float


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.post("/sessions/parse")
  def parse_session(note: NoteIn) -> SessionIn:
      """Turn a sentence into a draft session. Nothing is saved until the learner confirms."""
      try:
          draft = extract.session_from_text(note.text)
      except AIError as error:
          logger.warning("Could not parse note: %s", error)
          raise HTTPException(status_code=422, detail="Could not read a session from that note")
      logger.info("Parsed note into draft: %s, %s minutes", draft.subject, draft.minutes)
      return draft


  @app.post("/assistant")
  def talk_to_assistant(incoming: MessageIn) -> dict[str, str]:
      try:
          return {"reply": assistant.ask_assistant(incoming.message)}
      except AIError as error:
          logger.warning("Assistant failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.get("/notes/search")
  def search_notes(q: str = Query(min_length=1, max_length=500), source: str | None = None) -> list[NoteMatch]:
      try:
          return notes.search(q, source=source)
      except AIError as error:
          logger.warning("Note search failed: %s", error)
          raise HTTPException(status_code=503, detail="Note search is unavailable")


  @app.post("/notes/ask")
  def ask_notes(incoming: QuestionIn) -> Answer:
      try:
          return rag.answer_from_notes(incoming.question)
      except AIError as error:
          logger.warning("Answering from notes failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

/*
 *   mcp -> mcpServer, testMcpServer, mcpHostConfig
 */

export const mcpServer = code`
  import logging

  from mcp.server import MCPServer
  from mcp.server.mcpserver.exceptions import ToolError

  import assistant

  logging.basicConfig(level=logging.INFO)

  mcp = MCPServer("Study Tracker")


  @mcp.tool()
  def get_totals() -> dict[str, int]:
      """Get the total minutes studied per subject, across all saved sessions."""
      return assistant.get_totals()


  @mcp.tool()
  def log_session(subject: str, minutes: int, studied_on: str) -> dict[str, str | int | bool]:
      """Save one study session the learner says they finished.

      subject is short and lowercase, such as algebra. minutes is from 1 to 600.
      studied_on is the date in YYYY-MM-DD format.
      """
      try:
          return assistant.log_session(subject, minutes, studied_on)
      except ValueError as error:
          raise ToolError(f"The session was not saved: {error}") from error


  if __name__ == "__main__":
      mcp.run()
`

export const testMcpServer = code`
  import pytest
  from mcp import Client

  import config
  from mcp_server import mcp


  @pytest.fixture
  def anyio_backend():
      return "asyncio"


  @pytest.fixture
  async def client(tmp_path, monkeypatch):
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))
      async with Client(mcp, raise_exceptions=True) as connected:
          yield connected


  @pytest.mark.anyio
  async def test_both_tools_are_listed(client):
      tools = await client.list_tools()
      assert sorted(tool.name for tool in tools.tools) == ["get_totals", "log_session"]


  @pytest.mark.anyio
  async def test_log_session_then_totals(client):
      saved = await client.call_tool("log_session", {"subject": "python", "minutes": 30, "studied_on": "2026-03-06"})
      assert saved.structured_content["id"] == 1
      totals = await client.call_tool("get_totals", {})
      assert totals.structured_content == {"python": 30}


  @pytest.mark.anyio
  async def test_invalid_session_is_an_error_the_model_can_read(client):
      result = await client.call_tool("log_session", {"subject": "python", "minutes": 900, "studied_on": "2026-03-06"})
      assert result.is_error
      assert "not saved" in result.content[0].text
`

export const mcpHostConfig = code`
  {
    "mcpServers": {
      "study-tracker": {
        "command": "/full/path/to/study-tracker/.venv/bin/python",
        "args": ["/full/path/to/study-tracker/mcp_server.py"],
        "env": {
          "DATABASE_PATH": "/full/path/to/study-tracker/study.db"
        }
      }
    }
  }
`

/*
 *   ai-agents -> planner, appPlanner, testPlanner
 */

export const planner = code`
  import json
  import logging
  from datetime import date, timedelta

  from pydantic import BaseModel, Field, ValidationError

  import db
  from ai import AIError, chat

  logger = logging.getLogger("study_tracker.planner")

  MAX_STEPS = 6
  MAX_MINUTES_PER_DAY = 90


  class PlannedSession(BaseModel):
      subject: str = Field(min_length=1, max_length=50)
      minutes: int = Field(gt=0, le=MAX_MINUTES_PER_DAY)
      planned_on: date


  class Plan(BaseModel):
      sessions: list[PlannedSession] = Field(min_length=1, max_length=7)


  SYSTEM = """You are the study planner inside Study Tracker. Today is {today}.
  Plan study sessions for the 7 days from {start} to {end}.
  First call get_totals to see what the learner has studied so far.
  Then call submit_plan with at most one session per day, each at most {limit} minutes.
  Give more time to subjects with fewer minutes so far.
  If submit_plan returns problems, fix every problem and call submit_plan again."""

  TOOLS = [
      {
          "type": "function",
          "function": {
              "name": "get_totals",
              "description": "Get the total minutes studied per subject so far.",
              "parameters": {"type": "object", "properties": {}},
          },
      },
      {
          "type": "function",
          "function": {
              "name": "submit_plan",
              "description": "Submit the finished plan for checking. It is shown to the learner, not saved.",
              "parameters": {
                  "type": "object",
                  "properties": {
                      "sessions": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "properties": {
                                  "subject": {"type": "string"},
                                  "minutes": {"type": "integer"},
                                  "planned_on": {"type": "string", "description": "YYYY-MM-DD"},
                              },
                              "required": ["subject", "minutes", "planned_on"],
                          },
                      }
                  },
                  "required": ["sessions"],
              },
          },
      },
  ]


  def plan_problems(plan, start, end):
      """Check the rules a plan must follow. Returns a list of problems, empty if it is fine."""
      problems = []
      days = [session.planned_on for session in plan.sessions]
      if len(days) != len(set(days)):
          problems.append("more than one session on the same day")
      for day in days:
          if not start <= day <= end:
              problems.append(f"{day} is outside {start} to {end}")
      return problems


  def check_submission(arguments, start, end):
      """Validate a submit_plan call. Returns (plan, problems)."""
      try:
          plan = Plan.model_validate_json(arguments)
      except ValidationError as error:
          return None, [f"{'.'.join(map(str, item['loc']))}: {item['msg']}" for item in error.errors()]
      return plan, plan_problems(plan, start, end)


  def draft_plan(today=None):
      """Run the agent loop until it submits a plan that passes every check."""
      today = today or date.today()
      start, end = today + timedelta(days=1), today + timedelta(days=7)
      system = SYSTEM.format(today=today, start=start, end=end, limit=MAX_MINUTES_PER_DAY)
      messages = [{"role": "system", "content": system}, {"role": "user", "content": "Plan my study week."}]
      for step in range(1, MAX_STEPS + 1):
          reply = chat(messages, tools=TOOLS, temperature=0)
          messages.append(reply)
          calls = reply.get("tool_calls") or []
          if not calls:
              messages.append({"role": "user", "content": "Please submit the plan with submit_plan."})
              continue
          for call in calls:
              name = call["function"]["name"]
              if name == "get_totals":
                  result = db.totals()
              elif name == "submit_plan":
                  plan, problems = check_submission(call["function"]["arguments"], start, end)
                  if not problems:
                      logger.info("Plan ready after %s step(s): %s sessions", step, len(plan.sessions))
                      return plan
                  logger.info("Plan sent back at step %s: %s", step, problems)
                  result = {"problems": problems}
              else:
                  result = {"error": f"there is no tool called {name}"}
              messages.append({"role": "tool", "tool_call_id": call["id"], "content": json.dumps(result)})
      raise AIError(f"no acceptable plan within {MAX_STEPS} steps")


  PLANS_SCHEMA = """
  CREATE TABLE IF NOT EXISTS planned_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      minutes INTEGER NOT NULL,
      planned_on TEXT NOT NULL
  )
  """


  def save_plan(plan):
      """Save an approved plan. Only called after the learner approves it."""
      conn = db.connect()
      try:
          conn.execute(PLANS_SCHEMA)
          conn.executemany(
              "INSERT INTO planned_sessions (subject, minutes, planned_on) VALUES (?, ?, ?)",
              [(session.subject, session.minutes, session.planned_on.isoformat()) for session in plan.sessions],
          )
          conn.commit()
      finally:
          conn.close()
      return len(plan.sessions)
`

export const testPlanner = code`
  import json
  from datetime import date

  import pytest

  import config
  import db
  import planner

  TODAY = date(2026, 3, 6)


  @pytest.fixture(autouse=True)
  def test_database(tmp_path, monkeypatch):
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))


  def call(name, arguments):
      return {"role": "assistant", "content": None, "tool_calls": [
          {"id": f"call_{name}", "type": "function", "function": {"name": name, "arguments": json.dumps(arguments)}}
      ]}


  def plan_on(*days):
      return {"sessions": [{"subject": "biology", "minutes": 45, "planned_on": day} for day in days]}


  def test_agent_fixes_a_rejected_plan(monkeypatch):
      replies = iter([
          call("get_totals", {}),
          call("submit_plan", plan_on("2026-03-07", "2026-03-07")),
          call("submit_plan", plan_on("2026-03-07", "2026-03-08")),
      ])
      sent = []
      monkeypatch.setattr(planner, "chat", lambda messages, **options: sent.append(list(messages)) or next(replies))
      plan = planner.draft_plan(today=TODAY)
      assert [session.planned_on.day for session in plan.sessions] == [7, 8]
      assert "same day" in sent[2][-1]["content"]


  def test_drafting_saves_nothing(monkeypatch):
      monkeypatch.setattr(planner, "chat", lambda messages, **options: call("submit_plan", plan_on("2026-03-07")))
      planner.draft_plan(today=TODAY)
      conn = db.connect()
      conn.execute(planner.PLANS_SCHEMA)
      assert conn.execute("SELECT COUNT(*) FROM planned_sessions").fetchone()[0] == 0
      conn.close()


  def test_step_limit_stops_the_loop(monkeypatch):
      monkeypatch.setattr(planner, "chat", lambda messages, **options: call("submit_plan", plan_on("2030-01-01")))
      with pytest.raises(planner.AIError):
          planner.draft_plan(today=TODAY)


  def test_too_many_minutes_are_reported():
      plan, problems = planner.check_submission(json.dumps({"sessions": [
          {"subject": "algebra", "minutes": 120, "planned_on": "2026-03-07"}]}), TODAY, TODAY)
      assert plan is None
      assert problems == ["sessions.0.minutes: Input should be less than or equal to 90"]
`

export const appPlanner = code`
  import logging
  from datetime import date, timedelta

  from fastapi import FastAPI, HTTPException, Query
  from pydantic import BaseModel, Field

  import assistant
  import config
  import db
  import extract
  import notes
  import planner
  import rag
  from ai import AIError
  from schemas import Session, SessionIn

  logging.basicConfig(
      level=config.LOG_LEVEL,
      format="%(asctime)s %(levelname)s %(name)s: %(message)s",
  )
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  class NoteIn(BaseModel):
      text: str = Field(min_length=1, max_length=500)


  class MessageIn(BaseModel):
      message: str = Field(min_length=1, max_length=1000)


  class QuestionIn(BaseModel):
      question: str = Field(min_length=1, max_length=500)


  class Source(BaseModel):
      number: int
      source: str
      text: str


  class Answer(BaseModel):
      answer: str
      sources: list[Source]


  class NoteMatch(BaseModel):
      source: str
      text: str
      score: float


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.post("/sessions/parse")
  def parse_session(note: NoteIn) -> SessionIn:
      """Turn a sentence into a draft session. Nothing is saved until the learner confirms."""
      try:
          draft = extract.session_from_text(note.text)
      except AIError as error:
          logger.warning("Could not parse note: %s", error)
          raise HTTPException(status_code=422, detail="Could not read a session from that note")
      logger.info("Parsed note into draft: %s, %s minutes", draft.subject, draft.minutes)
      return draft


  @app.post("/assistant")
  def talk_to_assistant(incoming: MessageIn) -> dict[str, str]:
      try:
          return {"reply": assistant.ask_assistant(incoming.message)}
      except AIError as error:
          logger.warning("Assistant failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.get("/notes/search")
  def search_notes(q: str = Query(min_length=1, max_length=500), source: str | None = None) -> list[NoteMatch]:
      try:
          return notes.search(q, source=source)
      except AIError as error:
          logger.warning("Note search failed: %s", error)
          raise HTTPException(status_code=503, detail="Note search is unavailable")


  @app.post("/notes/ask")
  def ask_notes(incoming: QuestionIn) -> Answer:
      try:
          return rag.answer_from_notes(incoming.question)
      except AIError as error:
          logger.warning("Answering from notes failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.post("/plans/draft")
  def draft_plan() -> planner.Plan:
      """Ask the planning agent for next week's plan. Nothing is saved."""
      try:
          return planner.draft_plan()
      except AIError as error:
          logger.warning("Planner failed: %s", error)
          raise HTTPException(status_code=503, detail="The planner could not make a plan")


  @app.post("/plans/approve", status_code=201)
  def approve_plan(plan: planner.Plan) -> dict[str, int]:
      """Save a plan the learner has reviewed and approved."""
      start = date.today() + timedelta(days=1)
      problems = planner.plan_problems(plan, start, start + timedelta(days=6))
      if problems:
          raise HTTPException(status_code=400, detail=problems)
      saved = planner.save_plan(plan)
      logger.info("Learner approved a plan with %s sessions", saved)
      return {"saved": saved}


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

/*
 *   inference-and-deployment -> aiStream (stream_model), ragStream, appStream, testRagStream
 */

export const aiStream = code`
  import json
  import logging
  import time

  import httpx

  import config

  logger = logging.getLogger("study_tracker.ai")

  RETRY_STATUSES = {429, 500, 502, 503, 504}


  class AIError(Exception):
      """The model could not give an answer."""


  def auth_headers():
      return {"Authorization": f"Bearer {config.AI_API_KEY}"} if config.AI_API_KEY else {}


  def post_json(path, body, retries=2):
      """POST to the model service, retrying failures that may fix themselves."""
      headers = auth_headers()
      for attempt in range(retries + 1):
          try:
              response = httpx.post(f"{config.AI_BASE_URL}{path}", json=body, headers=headers, timeout=60)
          except httpx.TransportError as error:
              problem = f"could not reach the model at {config.AI_BASE_URL}: {error}"
          else:
              if response.status_code == 200:
                  return response.json()
              problem = f"the model service returned status {response.status_code}"
              if response.status_code not in RETRY_STATUSES:
                  break
          if attempt < retries:
              wait = 2 ** attempt
              logger.warning("AI request failed (%s), retrying in %s s", problem, wait)
              time.sleep(wait)
      raise AIError(problem)


  def chat(messages, **options):
      """Send a list of messages and return the model's reply message as a dict."""
      body = {"model": config.AI_MODEL, "messages": messages, **options}
      return post_json("/chat/completions", body)["choices"][0]["message"]


  def ask_model(prompt, system="You are a helpful study assistant.", **options):
      """Send one prompt to the model and return its reply as text."""
      messages = [
          {"role": "system", "content": system},
          {"role": "user", "content": prompt},
      ]
      return chat(messages, **options)["content"]


  def embed(texts):
      """Turn a list of texts into a list of embedding vectors, in the same order."""
      data = post_json("/embeddings", {"model": config.AI_EMBED_MODEL, "input": texts})["data"]
      return [item["embedding"] for item in sorted(data, key=lambda item: item["index"])]


  def stream_model(prompt, system="You are a helpful study assistant.", **options):
      """Yield the model's reply in small pieces, as soon as each one is generated."""
      body = {
          "model": config.AI_MODEL,
          "messages": [
              {"role": "system", "content": system},
              {"role": "user", "content": prompt},
          ],
          "stream": True,
          **options,
      }
      try:
          with httpx.stream(
              "POST", f"{config.AI_BASE_URL}/chat/completions", json=body, headers=auth_headers(), timeout=60
          ) as response:
              if response.status_code != 200:
                  raise AIError(f"the model service returned status {response.status_code}")
              for line in response.iter_lines():
                  if not line.startswith("data: ") or line == "data: [DONE]":
                      continue
                  choices = json.loads(line.removeprefix("data: ")).get("choices") or []
                  piece = choices[0]["delta"].get("content") if choices else None
                  if piece:
                      yield piece
      except httpx.TransportError as error:
          raise AIError(f"the stream from {config.AI_BASE_URL} failed: {error}") from error
`

export const ragStream = code`
  import logging

  import notes
  from ai import AIError, ask_model, stream_model

  logger = logging.getLogger("study_tracker.rag")

  # The lowest similarity that counts as a match. Tune it for your embedding model
  # by trying questions your notes can and cannot answer.
  MIN_SCORE = 0.35
  NOT_FOUND = "I couldn't find that in your notes."

  SYSTEM = f"""You answer questions using only the learner's notes, given between <notes> tags.
  Each note starts with a number in square brackets. After each fact you use, cite its note, like [1].
  If the notes do not answer the question, reply exactly: {NOT_FOUND}"""


  def build_prompt(question, matches):
      numbered = "\n".join(
          f"[{number}] ({match['source']}) {match['text']}" for number, match in enumerate(matches, start=1)
      )
      return f"<notes>\n{numbered}\n</notes>\n\nQuestion: {question}"


  def answer_from_notes(question):
      """Search the notes, then answer only from what was found, with numbered sources."""
      matches = [match for match in notes.search(question, top=3) if match["score"] >= MIN_SCORE]
      if not matches:
          logger.info("No note scored above %s, answering not found", MIN_SCORE)
          return {"answer": NOT_FOUND, "sources": []}
      answer = ask_model(build_prompt(question, matches), system=SYSTEM, temperature=0)
      sources = [
          {"number": number, "source": match["source"], "text": match["text"]}
          for number, match in enumerate(matches, start=1)
      ]
      logger.info("Answered from %s note paragraph(s)", len(sources))
      return {"answer": answer, "sources": sources}


  def stream_answer(question):
      """Like answer_from_notes, but yields the answer piece by piece, then the sources."""
      try:
          matches = [match for match in notes.search(question, top=3) if match["score"] >= MIN_SCORE]
          if not matches:
              yield NOT_FOUND
              return
          yield from stream_model(build_prompt(question, matches), system=SYSTEM, temperature=0)
      except AIError as error:
          logger.warning("Streaming answer failed: %s", error)
          yield "\n\nSorry, the answer was cut off. Please try again."
          return
      listed = ", ".join(f"[{number}] {match['source']}" for number, match in enumerate(matches, start=1))
      yield f"\n\nSources: {listed}"
`

export const appStream = code`
  import logging
  from datetime import date, timedelta

  from fastapi import FastAPI, HTTPException, Query
  from fastapi.responses import StreamingResponse
  from pydantic import BaseModel, Field

  import assistant
  import config
  import db
  import extract
  import notes
  import planner
  import rag
  from ai import AIError
  from schemas import Session, SessionIn

  logging.basicConfig(
      level=config.LOG_LEVEL,
      format="%(asctime)s %(levelname)s %(name)s: %(message)s",
  )
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  class NoteIn(BaseModel):
      text: str = Field(min_length=1, max_length=500)


  class MessageIn(BaseModel):
      message: str = Field(min_length=1, max_length=1000)


  class QuestionIn(BaseModel):
      question: str = Field(min_length=1, max_length=500)


  class Source(BaseModel):
      number: int
      source: str
      text: str


  class Answer(BaseModel):
      answer: str
      sources: list[Source]


  class NoteMatch(BaseModel):
      source: str
      text: str
      score: float


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.post("/sessions/parse")
  def parse_session(note: NoteIn) -> SessionIn:
      """Turn a sentence into a draft session. Nothing is saved until the learner confirms."""
      try:
          draft = extract.session_from_text(note.text)
      except AIError as error:
          logger.warning("Could not parse note: %s", error)
          raise HTTPException(status_code=422, detail="Could not read a session from that note")
      logger.info("Parsed note into draft: %s, %s minutes", draft.subject, draft.minutes)
      return draft


  @app.post("/assistant")
  def talk_to_assistant(incoming: MessageIn) -> dict[str, str]:
      try:
          return {"reply": assistant.ask_assistant(incoming.message)}
      except AIError as error:
          logger.warning("Assistant failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.get("/notes/search")
  def search_notes(q: str = Query(min_length=1, max_length=500), source: str | None = None) -> list[NoteMatch]:
      try:
          return notes.search(q, source=source)
      except AIError as error:
          logger.warning("Note search failed: %s", error)
          raise HTTPException(status_code=503, detail="Note search is unavailable")


  @app.post("/notes/ask")
  def ask_notes(incoming: QuestionIn) -> Answer:
      try:
          return rag.answer_from_notes(incoming.question)
      except AIError as error:
          logger.warning("Answering from notes failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.post("/notes/ask/stream")
  def ask_notes_streaming(incoming: QuestionIn) -> StreamingResponse:
      """Answer from the notes, sending the text as it is written."""
      return StreamingResponse(rag.stream_answer(incoming.question), media_type="text/plain")


  @app.post("/plans/draft")
  def draft_plan() -> planner.Plan:
      """Ask the planning agent for next week's plan. Nothing is saved."""
      try:
          return planner.draft_plan()
      except AIError as error:
          logger.warning("Planner failed: %s", error)
          raise HTTPException(status_code=503, detail="The planner could not make a plan")


  @app.post("/plans/approve", status_code=201)
  def approve_plan(plan: planner.Plan) -> dict[str, int]:
      """Save a plan the learner has reviewed and approved."""
      start = date.today() + timedelta(days=1)
      problems = planner.plan_problems(plan, start, start + timedelta(days=6))
      if problems:
          raise HTTPException(status_code=400, detail=problems)
      saved = planner.save_plan(plan)
      logger.info("Learner approved a plan with %s sessions", saved)
      return {"saved": saved}


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

export const testRagStream = code`
  from fastapi.testclient import TestClient

  import rag
  from ai import AIError
  from app import app

  MATCH = [{"source": "biology.md", "text": "Mitochondria turn glucose into ATP.", "score": 0.63}]


  def test_pieces_arrive_in_order_then_sources(monkeypatch):
      monkeypatch.setattr(rag.notes, "search", lambda question, top: MATCH)
      monkeypatch.setattr(rag, "stream_model", lambda prompt, **options: iter(["Cells use ", "ATP [1]."]))
      pieces = list(rag.stream_answer("How do cells get energy?"))
      assert pieces == ["Cells use ", "ATP [1].", "\n\nSources: [1] biology.md"]


  def test_failure_mid_stream_ends_politely(monkeypatch):
      def broken_stream(prompt, **options):
          yield "Cells use "
          raise AIError("connection lost")

      monkeypatch.setattr(rag.notes, "search", lambda question, top: MATCH)
      monkeypatch.setattr(rag, "stream_model", broken_stream)
      text = "".join(rag.stream_answer("How do cells get energy?"))
      assert text.startswith("Cells use ")
      assert text.endswith("Please try again.")


  def test_stream_endpoint(monkeypatch):
      monkeypatch.setattr(rag.notes, "search", lambda question, top: [])
      response = TestClient(app).post("/notes/ask/stream", json={"question": "Who won the 1998 World Cup?"})
      assert response.status_code == 200
      assert response.text == rag.NOT_FOUND
`

export const watchStream = code`
  import httpx

  question = {"question": "How do cells get energy?"}
  with httpx.stream("POST", "http://127.0.0.1:8000/notes/ask/stream", json=question, timeout=60) as response:
      for piece in response.iter_text():
          print(piece, end="", flush=True)
  print()
`

/*
 *   ai-observability -> aiObserved, observability, appObserved, testObservability
 */

export const aiObserved = code`
  import json
  import logging
  import time

  import httpx

  import config

  logger = logging.getLogger("study_tracker.ai")

  RETRY_STATUSES = {429, 500, 502, 503, 504}


  class AIError(Exception):
      """The model could not give an answer."""


  def auth_headers():
      return {"Authorization": f"Bearer {config.AI_API_KEY}"} if config.AI_API_KEY else {}


  def post_json(path, body, retries=2):
      """POST to the model service, retrying failures that may fix themselves."""
      headers = auth_headers()
      for attempt in range(retries + 1):
          started = time.perf_counter()
          try:
              response = httpx.post(f"{config.AI_BASE_URL}{path}", json=body, headers=headers, timeout=60)
          except httpx.TransportError as error:
              problem = f"could not reach the model at {config.AI_BASE_URL}: {error}"
          else:
              elapsed_ms = round((time.perf_counter() - started) * 1000)
              if response.status_code == 200:
                  data = response.json()
                  usage = data.get("usage") or {}
                  # Log what happened, never what was said: no prompts, no replies.
                  logger.info(
                      "call=%s model=%s status=200 ms=%s input_tokens=%s output_tokens=%s",
                      path.strip("/"), body.get("model"), elapsed_ms,
                      usage.get("prompt_tokens"), usage.get("completion_tokens"),
                  )
                  return data
              problem = f"the model service returned status {response.status_code}"
              logger.warning("call=%s model=%s status=%s ms=%s", path.strip("/"), body.get("model"), response.status_code, elapsed_ms)
              if response.status_code not in RETRY_STATUSES:
                  break
          if attempt < retries:
              wait = 2 ** attempt
              logger.warning("AI request failed (%s), retrying in %s s", problem, wait)
              time.sleep(wait)
      raise AIError(problem)


  def chat(messages, **options):
      """Send a list of messages and return the model's reply message as a dict."""
      body = {"model": config.AI_MODEL, "messages": messages, **options}
      return post_json("/chat/completions", body)["choices"][0]["message"]


  def ask_model(prompt, system="You are a helpful study assistant.", **options):
      """Send one prompt to the model and return its reply as text."""
      messages = [
          {"role": "system", "content": system},
          {"role": "user", "content": prompt},
      ]
      return chat(messages, **options)["content"]


  def embed(texts):
      """Turn a list of texts into a list of embedding vectors, in the same order."""
      data = post_json("/embeddings", {"model": config.AI_EMBED_MODEL, "input": texts})["data"]
      return [item["embedding"] for item in sorted(data, key=lambda item: item["index"])]


  def stream_model(prompt, system="You are a helpful study assistant.", **options):
      """Yield the model's reply in small pieces, as soon as each one is generated."""
      body = {
          "model": config.AI_MODEL,
          "messages": [
              {"role": "system", "content": system},
              {"role": "user", "content": prompt},
          ],
          "stream": True,
          **options,
      }
      try:
          with httpx.stream(
              "POST", f"{config.AI_BASE_URL}/chat/completions", json=body, headers=auth_headers(), timeout=60
          ) as response:
              if response.status_code != 200:
                  raise AIError(f"the model service returned status {response.status_code}")
              for line in response.iter_lines():
                  if not line.startswith("data: ") or line == "data: [DONE]":
                      continue
                  choices = json.loads(line.removeprefix("data: ")).get("choices") or []
                  piece = choices[0]["delta"].get("content") if choices else None
                  if piece:
                      yield piece
      except httpx.TransportError as error:
          raise AIError(f"the stream from {config.AI_BASE_URL} failed: {error}") from error
`

export const observability = code`
  import contextvars
  import logging

  # The ID of the web request being handled right now, or "-" outside a request.
  request_id = contextvars.ContextVar("request_id", default="-")


  class RequestIdFilter(logging.Filter):
      """Adds the current request ID to every log record, so its lines can be grouped."""

      def filter(self, record):
          record.request_id = request_id.get()
          return True


  def setup_logging(level):
      logging.basicConfig(
          level=level,
          format="%(asctime)s %(levelname)s %(name)s [%(request_id)s] %(message)s",
      )
      for handler in logging.getLogger().handlers:
          handler.addFilter(RequestIdFilter())
`

export const appObserved = code`
  import logging
  import time
  import uuid
  from datetime import date, timedelta

  from fastapi import FastAPI, HTTPException, Query, Request
  from fastapi.responses import StreamingResponse
  from pydantic import BaseModel, Field

  import assistant
  import config
  import db
  import extract
  import notes
  import observability
  import planner
  import rag
  from ai import AIError
  from schemas import Session, SessionIn

  observability.setup_logging(config.LOG_LEVEL)
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  @app.middleware("http")
  async def trace_request(request: Request, call_next):
      """Give each request an ID, log how long it took, and return the ID to the client."""
      token = observability.request_id.set(uuid.uuid4().hex[:8])
      started = time.perf_counter()
      try:
          response = await call_next(request)
          elapsed_ms = round((time.perf_counter() - started) * 1000)
          logger.info("%s %s -> %s in %s ms", request.method, request.url.path, response.status_code, elapsed_ms)
          response.headers["X-Request-ID"] = observability.request_id.get()
          return response
      finally:
          observability.request_id.reset(token)


  class NoteIn(BaseModel):
      text: str = Field(min_length=1, max_length=500)


  class MessageIn(BaseModel):
      message: str = Field(min_length=1, max_length=1000)


  class QuestionIn(BaseModel):
      question: str = Field(min_length=1, max_length=500)


  class Source(BaseModel):
      number: int
      source: str
      text: str


  class Answer(BaseModel):
      answer: str
      sources: list[Source]


  class NoteMatch(BaseModel):
      source: str
      text: str
      score: float


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.post("/sessions/parse")
  def parse_session(note: NoteIn) -> SessionIn:
      """Turn a sentence into a draft session. Nothing is saved until the learner confirms."""
      try:
          draft = extract.session_from_text(note.text)
      except AIError as error:
          logger.warning("Could not parse note: %s", error)
          raise HTTPException(status_code=422, detail="Could not read a session from that note")
      logger.info("Parsed note into draft: %s, %s minutes", draft.subject, draft.minutes)
      return draft


  @app.post("/assistant")
  def talk_to_assistant(incoming: MessageIn) -> dict[str, str]:
      try:
          return {"reply": assistant.ask_assistant(incoming.message)}
      except AIError as error:
          logger.warning("Assistant failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.get("/notes/search")
  def search_notes(q: str = Query(min_length=1, max_length=500), source: str | None = None) -> list[NoteMatch]:
      try:
          return notes.search(q, source=source)
      except AIError as error:
          logger.warning("Note search failed: %s", error)
          raise HTTPException(status_code=503, detail="Note search is unavailable")


  @app.post("/notes/ask")
  def ask_notes(incoming: QuestionIn) -> Answer:
      try:
          return rag.answer_from_notes(incoming.question)
      except AIError as error:
          logger.warning("Answering from notes failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.post("/notes/ask/stream")
  def ask_notes_streaming(incoming: QuestionIn) -> StreamingResponse:
      """Answer from the notes, sending the text as it is written."""
      return StreamingResponse(rag.stream_answer(incoming.question), media_type="text/plain")


  @app.post("/plans/draft")
  def draft_plan() -> planner.Plan:
      """Ask the planning agent for next week's plan. Nothing is saved."""
      try:
          return planner.draft_plan()
      except AIError as error:
          logger.warning("Planner failed: %s", error)
          raise HTTPException(status_code=503, detail="The planner could not make a plan")


  @app.post("/plans/approve", status_code=201)
  def approve_plan(plan: planner.Plan) -> dict[str, int]:
      """Save a plan the learner has reviewed and approved."""
      start = date.today() + timedelta(days=1)
      problems = planner.plan_problems(plan, start, start + timedelta(days=6))
      if problems:
          raise HTTPException(status_code=400, detail=problems)
      saved = planner.save_plan(plan)
      logger.info("Learner approved a plan with %s sessions", saved)
      return {"saved": saved}


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

export const testObservability = code`
  import logging

  import httpx
  from fastapi.testclient import TestClient

  import ai
  import config
  from app import app


  def test_every_response_has_a_request_id():
      response = TestClient(app).get("/totals")
      assert len(response.headers["X-Request-ID"]) == 8


  def test_model_calls_log_numbers_but_not_text(monkeypatch, caplog):
      reply = {"choices": [{"message": {"role": "assistant", "content": "SECRET REPLY"}}],
               "usage": {"prompt_tokens": 120, "completion_tokens": 30}}
      monkeypatch.setattr(ai.httpx, "post", lambda *args, **kwargs: httpx.Response(200, json=reply))
      monkeypatch.setattr(config, "AI_MODEL", "test-model")
      with caplog.at_level(logging.INFO, logger="study_tracker.ai"):
          ai.ask_model("SECRET PROMPT")
      line = caplog.records[-1].getMessage()
      assert "input_tokens=120 output_tokens=30" in line
      assert "SECRET" not in line
`

/*
 *   ai-cost-and-performance -> embedCache, notesCached, testEmbedCache
 */

export const embedCache = code`
  import hashlib
  import json
  import logging

  import config
  import db
  from ai import embed

  logger = logging.getLogger("study_tracker.cache")

  CACHE_SCHEMA = """
  CREATE TABLE IF NOT EXISTS embedding_cache (
      key TEXT PRIMARY KEY,
      embedding TEXT NOT NULL
  )
  """


  def cache_key(text):
      """The model and the exact text decide an embedding, so both go into the key."""
      return hashlib.sha256(f"{config.AI_EMBED_MODEL}\n{text}".encode("utf-8")).hexdigest()


  def cached_embed(texts):
      """Like embed(), but only sends texts that have never been embedded with this model."""
      keys = [cache_key(text) for text in texts]
      conn = db.connect()
      try:
          conn.execute(CACHE_SCHEMA)
          found = {}
          for key in set(keys):
              row = conn.execute("SELECT embedding FROM embedding_cache WHERE key = ?", (key,)).fetchone()
              if row:
                  found[key] = json.loads(row["embedding"])
          missing = list(dict.fromkeys(text for text, key in zip(texts, keys) if key not in found))
          if missing:
              for text, vector in zip(missing, embed(missing)):
                  found[cache_key(text)] = vector
                  conn.execute(
                      "INSERT OR REPLACE INTO embedding_cache (key, embedding) VALUES (?, ?)",
                      (cache_key(text), json.dumps(vector)),
                  )
              conn.commit()
      finally:
          conn.close()
      logger.info("Embeddings: %s from cache, %s new", len(texts) - len(missing), len(missing))
      return [found[key] for key in keys]
`

export const testEmbedCache = code`
  import pytest

  import config
  import embed_cache


  @pytest.fixture
  def calls(tmp_path, monkeypatch):
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))
      monkeypatch.setattr(config, "AI_EMBED_MODEL", "model-a")
      sent = []

      def fake_embed(texts):
          sent.append(list(texts))
          return [[float(len(text)), 1.0] for text in texts]

      monkeypatch.setattr(embed_cache, "embed", fake_embed)
      return sent


  def test_second_run_sends_nothing(calls):
      first = embed_cache.cached_embed(["Cells make energy.", "Plants use light."])
      second = embed_cache.cached_embed(["Cells make energy.", "Plants use light."])
      assert first == second
      assert calls == [["Cells make energy.", "Plants use light."]]


  def test_only_edited_text_is_sent(calls):
      embed_cache.cached_embed(["Cells make energy.", "Plants use light."])
      embed_cache.cached_embed(["Cells make energy.", "Plants use sunlight."])
      assert calls[-1] == ["Plants use sunlight."]


  def test_changing_model_misses_the_cache(calls, monkeypatch):
      embed_cache.cached_embed(["Cells make energy."])
      monkeypatch.setattr(config, "AI_EMBED_MODEL", "model-b")
      embed_cache.cached_embed(["Cells make energy."])
      assert len(calls) == 2
`

export const notesCached = code`
  import json
  from pathlib import Path

  import db
  from embed_cache import cached_embed

  NOTES_DIR = Path("notes")

  CHUNKS_SCHEMA = """
  CREATE TABLE IF NOT EXISTS note_chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      text TEXT NOT NULL,
      embedding TEXT NOT NULL
  )
  """


  def load_chunks():
      """Split every notes file into paragraphs, remembering which file each came from."""
      chunks = []
      for path in sorted(NOTES_DIR.glob("*.md")):
          paragraphs = [part.strip() for part in path.read_text(encoding="utf-8").split("\n\n")]
          # Skip empty paragraphs and heading lines such as "# Biology".
          chunks += [{"source": path.name, "text": text} for text in paragraphs if text and not text.startswith("#")]
      return chunks


  def cosine_similarity(a, b):
      dot = sum(x * y for x, y in zip(a, b))
      length_a = sum(x * x for x in a) ** 0.5
      length_b = sum(x * x for x in b) ** 0.5
      return dot / (length_a * length_b)


  def index_notes():
      """Embed every paragraph once and store the vectors in study.db, replacing the old index."""
      chunks = load_chunks()
      vectors = cached_embed([chunk["text"] for chunk in chunks]) if chunks else []
      conn = db.connect()
      try:
          conn.execute(CHUNKS_SCHEMA)
          conn.execute("DELETE FROM note_chunks")
          conn.executemany(
              "INSERT INTO note_chunks (source, text, embedding) VALUES (?, ?, ?)",
              [(chunk["source"], chunk["text"], json.dumps(vector)) for chunk, vector in zip(chunks, vectors)],
          )
          conn.commit()
      finally:
          conn.close()
      return len(chunks)


  def search(question, top=3, source=None):
      """Return the stored paragraphs closest to the question, best first.

      Pass source="biology.md" to search only one file.
      """
      question_vector = cached_embed([question])[0]
      sql = "SELECT source, text, embedding FROM note_chunks"
      params = ()
      if source:
          sql += " WHERE source = ?"
          params = (source,)
      conn = db.connect()
      try:
          conn.execute(CHUNKS_SCHEMA)
          rows = conn.execute(sql, params).fetchall()
      finally:
          conn.close()
      results = [
          {"source": row["source"], "text": row["text"],
           "score": cosine_similarity(question_vector, json.loads(row["embedding"]))}
          for row in rows
      ]
      return sorted(results, key=lambda result: result["score"], reverse=True)[:top]
`

export const testNotesCached = code`
  import pytest

  import config
  import notes

  FAKE_VECTORS = {
      "Cells make energy.": [0.9, 0.1],
      "Plants use light.": [0.5, 0.5],
      "Fractions need a common denominator.": [0.0, 1.0],
      "How do cells get energy?": [1.0, 0.0],
  }


  @pytest.fixture(autouse=True)
  def setup(tmp_path, monkeypatch):
      notes_dir = tmp_path / "notes"
      notes_dir.mkdir()
      (notes_dir / "biology.md").write_text("# Biology\n\nCells make energy.\n\nPlants use light.", encoding="utf-8")
      (notes_dir / "algebra.md").write_text("Fractions need a common denominator.", encoding="utf-8")
      monkeypatch.setattr(notes, "NOTES_DIR", notes_dir)
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))
      monkeypatch.setattr(notes, "cached_embed", lambda texts: [FAKE_VECTORS[text] for text in texts])


  def test_index_stores_every_paragraph():
      assert notes.index_notes() == 3


  def test_search_ranks_by_meaning():
      notes.index_notes()
      results = notes.search("How do cells get energy?", top=2)
      assert [result["text"] for result in results] == ["Cells make energy.", "Plants use light."]


  def test_search_can_filter_by_source():
      notes.index_notes()
      results = notes.search("How do cells get energy?", source="algebra.md")
      assert [result["source"] for result in results] == ["algebra.md"]


  def test_reindexing_replaces_old_rows():
      notes.index_notes()
      notes.index_notes()
      assert len(notes.search("How do cells get energy?", top=10)) == 3
`

/*
 *   ai-product-design -> feedback, appFeedback, testFeedback
 */

export const feedback = code`
  import db

  FEEDBACK_SCHEMA = """
  CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT NOT NULL,
      feature TEXT NOT NULL,
      helpful INTEGER NOT NULL,
      reason TEXT
  )
  """


  def save_feedback(request_id, feature, helpful, reason=None):
      conn = db.connect()
      try:
          conn.execute(FEEDBACK_SCHEMA)
          conn.execute(
              "INSERT INTO feedback (request_id, feature, helpful, reason) VALUES (?, ?, ?, ?)",
              (request_id, feature, int(helpful), reason),
          )
          conn.commit()
      finally:
          conn.close()


  def summary():
      """How many ratings each feature got, and how many said it helped."""
      conn = db.connect()
      try:
          conn.execute(FEEDBACK_SCHEMA)
          rows = conn.execute(
              "SELECT feature, COUNT(*) AS total, SUM(helpful) AS helpful FROM feedback GROUP BY feature ORDER BY feature"
          ).fetchall()
      finally:
          conn.close()
      return {row["feature"]: {"total": row["total"], "helpful": row["helpful"]} for row in rows}
`

export const testFeedback = code`
  import pytest
  from fastapi.testclient import TestClient

  import config
  from app import app


  @pytest.fixture
  def client(tmp_path, monkeypatch):
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))
      return TestClient(app)


  def test_feedback_is_summarized_per_feature(client):
      for helpful in (True, True, False):
          response = client.post("/feedback", json={"request_id": "acefdd03", "feature": "notes", "helpful": helpful})
          assert response.status_code == 201
      client.post("/feedback", json={"request_id": "48d9f062", "feature": "planner", "helpful": False,
                                     "reason": "Planned a session on my work day"})
      assert client.get("/feedback/summary").json() == {
          "notes": {"total": 3, "helpful": 2},
          "planner": {"total": 1, "helpful": 0},
      }


  def test_unknown_feature_is_rejected(client):
      response = client.post("/feedback", json={"request_id": "acefdd03", "feature": "weather", "helpful": True})
      assert response.status_code == 422
`

export const appFeedback = code`
  import logging
  import time
  import uuid
  from datetime import date, timedelta
  from typing import Literal

  from fastapi import FastAPI, HTTPException, Query, Request
  from fastapi.responses import StreamingResponse
  from pydantic import BaseModel, Field

  import assistant
  import config
  import db
  import extract
  import feedback
  import notes
  import observability
  import planner
  import rag
  from ai import AIError
  from schemas import Session, SessionIn

  observability.setup_logging(config.LOG_LEVEL)
  logger = logging.getLogger("study_tracker")

  app = FastAPI(title="Study Tracker")


  @app.middleware("http")
  async def trace_request(request: Request, call_next):
      """Give each request an ID, log how long it took, and return the ID to the client."""
      token = observability.request_id.set(uuid.uuid4().hex[:8])
      started = time.perf_counter()
      try:
          response = await call_next(request)
          elapsed_ms = round((time.perf_counter() - started) * 1000)
          logger.info("%s %s -> %s in %s ms", request.method, request.url.path, response.status_code, elapsed_ms)
          response.headers["X-Request-ID"] = observability.request_id.get()
          return response
      finally:
          observability.request_id.reset(token)


  class NoteIn(BaseModel):
      text: str = Field(min_length=1, max_length=500)


  class MessageIn(BaseModel):
      message: str = Field(min_length=1, max_length=1000)


  class QuestionIn(BaseModel):
      question: str = Field(min_length=1, max_length=500)


  class Source(BaseModel):
      number: int
      source: str
      text: str


  class Answer(BaseModel):
      answer: str
      sources: list[Source]


  class NoteMatch(BaseModel):
      source: str
      text: str
      score: float


  @app.get("/sessions")
  def get_sessions() -> list[Session]:
      return db.list_sessions()


  @app.post("/sessions", status_code=201)
  def create_session(new: SessionIn) -> Session:
      if new.studied_on > date.today():
          logger.warning("Rejected session dated in the future: %s", new.studied_on)
          raise HTTPException(status_code=400, detail="studied_on cannot be in the future")
      session_id = db.add_session(new.subject, new.minutes, new.studied_on.isoformat())
      logger.info("Saved session %s: %s, %s minutes", session_id, new.subject, new.minutes)
      return Session(id=session_id, **new.model_dump())


  @app.post("/sessions/parse")
  def parse_session(note: NoteIn) -> SessionIn:
      """Turn a sentence into a draft session. Nothing is saved until the learner confirms."""
      try:
          draft = extract.session_from_text(note.text)
      except AIError as error:
          logger.warning("Could not parse note: %s", error)
          raise HTTPException(status_code=422, detail="Could not read a session from that note")
      logger.info("Parsed note into draft: %s, %s minutes", draft.subject, draft.minutes)
      return draft


  @app.post("/assistant")
  def talk_to_assistant(incoming: MessageIn) -> dict[str, str]:
      try:
          return {"reply": assistant.ask_assistant(incoming.message)}
      except AIError as error:
          logger.warning("Assistant failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.get("/notes/search")
  def search_notes(q: str = Query(min_length=1, max_length=500), source: str | None = None) -> list[NoteMatch]:
      try:
          return notes.search(q, source=source)
      except AIError as error:
          logger.warning("Note search failed: %s", error)
          raise HTTPException(status_code=503, detail="Note search is unavailable")


  @app.post("/notes/ask")
  def ask_notes(incoming: QuestionIn) -> Answer:
      try:
          return rag.answer_from_notes(incoming.question)
      except AIError as error:
          logger.warning("Answering from notes failed: %s", error)
          raise HTTPException(status_code=503, detail="The study assistant is unavailable")


  @app.post("/notes/ask/stream")
  def ask_notes_streaming(incoming: QuestionIn) -> StreamingResponse:
      """Answer from the notes, sending the text as it is written."""
      return StreamingResponse(rag.stream_answer(incoming.question), media_type="text/plain")


  @app.post("/plans/draft")
  def draft_plan() -> planner.Plan:
      """Ask the planning agent for next week's plan. Nothing is saved."""
      try:
          return planner.draft_plan()
      except AIError as error:
          logger.warning("Planner failed: %s", error)
          raise HTTPException(status_code=503, detail="The planner could not make a plan")


  @app.post("/plans/approve", status_code=201)
  def approve_plan(plan: planner.Plan) -> dict[str, int]:
      """Save a plan the learner has reviewed and approved."""
      start = date.today() + timedelta(days=1)
      problems = planner.plan_problems(plan, start, start + timedelta(days=6))
      if problems:
          raise HTTPException(status_code=400, detail=problems)
      saved = planner.save_plan(plan)
      logger.info("Learner approved a plan with %s sessions", saved)
      return {"saved": saved}


  class FeedbackIn(BaseModel):
      request_id: str = Field(min_length=1, max_length=32)
      feature: Literal["assistant", "notes", "parse", "planner"]
      helpful: bool
      reason: str | None = Field(default=None, max_length=300)


  @app.post("/feedback", status_code=201)
  def give_feedback(entry: FeedbackIn) -> dict[str, bool]:
      """Record whether an AI answer helped. The request ID links it to the logs."""
      feedback.save_feedback(entry.request_id, entry.feature, entry.helpful, entry.reason)
      logger.info("Feedback on %s request %s: %s", entry.feature, entry.request_id,
                  "helpful" if entry.helpful else "not helpful")
      return {"saved": True}


  @app.get("/feedback/summary")
  def feedback_summary() -> dict[str, dict[str, int]]:
      return feedback.summary()


  @app.get("/totals")
  def get_totals() -> dict[str, int]:
      return db.totals()
`

/*
 * Cloud Engineering (Azure track) builds on the AI Engineering version.
 *   azure-compute-storage -> syncNotesAzure, testSyncNotesAzure
 */

export const syncNotesAzure = code`
  import os
  from pathlib import Path

  from azure.identity import DefaultAzureCredential
  from azure.storage.blob import ContainerClient


  def notes_container():
      """Connect to the notes container, signing in as your az login or the app's managed identity."""
      account = os.environ["STORAGE_ACCOUNT"]
      return ContainerClient(
          account_url=f"https://{account}.blob.core.windows.net",
          container_name="notes",
          credential=DefaultAzureCredential(),
      )


  def sync_notes(container, folder=Path("notes")):
      """Download every .md file from the container into the local notes folder."""
      folder.mkdir(exist_ok=True)
      count = 0
      for blob in container.list_blobs():
          if blob.name.endswith(".md"):
              data = container.download_blob(blob.name).readall()
              (folder / Path(blob.name).name).write_bytes(data)
              count += 1
      return count


  if __name__ == "__main__":
      print(f"Downloaded {sync_notes(notes_container())} notes")
`

export const testSyncNotesAzure = code`
  from types import SimpleNamespace

  import sync_notes


  class FakeContainer:
      """Stands in for ContainerClient, so the test needs no Azure account."""

      def __init__(self, files):
          self.files = files

      def list_blobs(self):
          return [SimpleNamespace(name=name) for name in self.files]

      def download_blob(self, name):
          return SimpleNamespace(readall=lambda: self.files[name])


  def test_only_markdown_files_are_downloaded(tmp_path):
      container = FakeContainer({"biology.md": b"# Biology", "photo.jpg": b"...", "algebra.md": b"# Algebra"})
      assert sync_notes.sync_notes(container, tmp_path) == 2
      assert (tmp_path / "biology.md").read_bytes() == b"# Biology"
      assert not (tmp_path / "photo.jpg").exists()
`

/*
 *   azure-data-platforms -> configDb, dbPortable, embedCachePortable, requirementsCloud
 */

export const configDb = code`
  import os

  from dotenv import load_dotenv

  load_dotenv()

  # Set DATABASE_URL to use PostgreSQL. Without it, Study Tracker uses the SQLite file below.
  DATABASE_URL = os.environ.get("DATABASE_URL", "")
  DATABASE_PATH = os.environ.get("DATABASE_PATH", "study.db")
  LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

  # Where to send AI requests. The default is Ollama running on this computer.
  AI_BASE_URL = os.environ.get("AI_BASE_URL", "http://localhost:11434/v1")
  AI_MODEL = os.environ.get("AI_MODEL", "")
  AI_EMBED_MODEL = os.environ.get("AI_EMBED_MODEL", "")
  AI_API_KEY = os.environ.get("AI_API_KEY", "")
`

export const dbPortable = code`
  import sqlite3

  import config

  SCHEMA = """
  CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      minutes INTEGER NOT NULL,
      studied_on TEXT NOT NULL
  )
  """


  class PostgresConnection:
      """Runs Study Tracker's SQLite-style SQL on PostgreSQL.

      Only two things differ in the SQL Study Tracker uses: PostgreSQL writes
      placeholders as %s instead of ?, and makes automatic ids with an identity column.
      """

      def __init__(self, url):
          import psycopg
          from psycopg.rows import dict_row

          self.conn = psycopg.connect(url, row_factory=dict_row)

      @staticmethod
      def translate(sql):
          sql = sql.replace("INTEGER PRIMARY KEY AUTOINCREMENT", "INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY")
          return sql.replace("?", "%s")

      def execute(self, sql, params=()):
          return self.conn.execute(self.translate(sql), params)

      def executemany(self, sql, rows):
          with self.conn.cursor() as cursor:
              cursor.executemany(self.translate(sql), rows)

      def commit(self):
          self.conn.commit()

      def close(self):
          self.conn.close()


  def connect():
      if config.DATABASE_URL:
          conn = PostgresConnection(config.DATABASE_URL)
      else:
          conn = sqlite3.connect(config.DATABASE_PATH)
          conn.row_factory = sqlite3.Row
      conn.execute(SCHEMA)
      conn.commit()
      return conn


  def add_session(subject, minutes, studied_on):
      conn = connect()
      try:
          row = conn.execute(
              "INSERT INTO sessions (subject, minutes, studied_on) VALUES (?, ?, ?) RETURNING id",
              (subject, minutes, studied_on),
          ).fetchone()
          conn.commit()
          return row["id"]
      finally:
          conn.close()


  def list_sessions():
      conn = connect()
      try:
          rows = conn.execute("SELECT id, subject, minutes, studied_on FROM sessions ORDER BY id").fetchall()
          return [dict(row) for row in rows]
      finally:
          conn.close()


  def totals():
      conn = connect()
      try:
          rows = conn.execute(
              "SELECT subject, SUM(minutes) AS minutes FROM sessions GROUP BY subject ORDER BY subject"
          ).fetchall()
          return {row["subject"]: row["minutes"] for row in rows}
      finally:
          conn.close()
`

export const requirementsCloud = code`
  fastapi
  uvicorn
  python-dotenv
  pytest
  httpx
  mcp[cli]>=2,<3
  azure-identity
  azure-storage-blob
  psycopg[binary]
`

export const embedCachePortable = code`
  import hashlib
  import json
  import logging

  import config
  import db
  from ai import embed

  logger = logging.getLogger("study_tracker.cache")

  CACHE_SCHEMA = """
  CREATE TABLE IF NOT EXISTS embedding_cache (
      key TEXT PRIMARY KEY,
      embedding TEXT NOT NULL
  )
  """


  def cache_key(text):
      """The model and the exact text decide an embedding, so both go into the key."""
      return hashlib.sha256(f"{config.AI_EMBED_MODEL}\n{text}".encode("utf-8")).hexdigest()


  def cached_embed(texts):
      """Like embed(), but only sends texts that have never been embedded with this model."""
      keys = [cache_key(text) for text in texts]
      conn = db.connect()
      try:
          conn.execute(CACHE_SCHEMA)
          found = {}
          for key in set(keys):
              row = conn.execute("SELECT embedding FROM embedding_cache WHERE key = ?", (key,)).fetchone()
              if row:
                  found[key] = json.loads(row["embedding"])
          missing = list(dict.fromkeys(text for text, key in zip(texts, keys) if key not in found))
          if missing:
              for text, vector in zip(missing, embed(missing)):
                  found[cache_key(text)] = vector
                  conn.execute(
                      "INSERT INTO embedding_cache (key, embedding) VALUES (?, ?) "
                      "ON CONFLICT (key) DO UPDATE SET embedding = excluded.embedding",
                      (cache_key(text), json.dumps(vector)),
                  )
              conn.commit()
      finally:
          conn.close()
      logger.info("Embeddings: %s from cache, %s new", len(texts) - len(missing), len(missing))
      return [found[key] for key in keys]
`

export const testDbPortable = code`
  import config
  import db


  def test_sqlite_sql_is_translated_for_postgres():
      sql = "INSERT INTO sessions (subject, minutes, studied_on) VALUES (?, ?, ?) RETURNING id"
      assert db.PostgresConnection.translate(sql) == (
          "INSERT INTO sessions (subject, minutes, studied_on) VALUES (%s, %s, %s) RETURNING id"
      )


  def test_without_database_url_sqlite_is_used(tmp_path, monkeypatch):
      monkeypatch.setattr(config, "DATABASE_URL", "")
      monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))
      assert db.add_session("algebra", 40, "2026-03-02") == 1
      assert db.totals() == {"algebra": 40}
`

/*
 *   azure-containers-aks -> k8sManifest
 */

export const k8sManifest = code`
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: study-tracker
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: study-tracker
    template:
      metadata:
        labels:
          app: study-tracker
      spec:
        containers:
          - name: study-tracker
            image: acrstudyjd4821.azurecr.io/study-tracker:v3
            ports:
              - containerPort: 8000
            env:
              - name: LOG_LEVEL
                value: INFO
            resources:
              requests:
                cpu: 250m
                memory: 256Mi
              limits:
                memory: 512Mi
            readinessProbe:
              httpGet:
                path: /totals
                port: 8000
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: study-tracker
  spec:
    type: LoadBalancer
    selector:
      app: study-tracker
    ports:
      - port: 80
        targetPort: 8000
`

/*
 *   azure-serverless-events -> functionApp, functionHostJson, functionRequirements, testFunctionApp
 */

export const functionApp = code`
  import datetime
  import logging
  import os

  import azure.functions as func
  import httpx
  from azure.identity import DefaultAzureCredential
  from azure.storage.blob import BlobClient

  app = func.FunctionApp()


  def weekly_summary(sessions, today):
      """Turn Study Tracker's sessions into a short Markdown summary of the last 7 days."""
      week_ago = today - datetime.timedelta(days=7)
      totals = {}
      for session in sessions:
          if week_ago < datetime.date.fromisoformat(session["studied_on"]) <= today:
              totals[session["subject"]] = totals.get(session["subject"], 0) + session["minutes"]
      lines = [f"# Study summary for the week ending {today}", ""]
      lines += [f"- {subject}: {minutes} minutes" for subject, minutes in sorted(totals.items())] or ["- No sessions this week"]
      lines += ["", f"Total: {sum(totals.values())} minutes"]
      return "\n".join(lines) + "\n"


  @app.timer_trigger(schedule="%SUMMARY_SCHEDULE%", arg_name="timer", run_on_startup=False)
  def send_weekly_summary(timer: func.TimerRequest) -> None:
      today = datetime.date.today()
      response = httpx.get(f"{os.environ['STUDY_TRACKER_URL']}/sessions", timeout=60)
      response.raise_for_status()
      blob = BlobClient(
          account_url=f"https://{os.environ['STORAGE_ACCOUNT']}.blob.core.windows.net",
          container_name="summaries",
          blob_name=f"{today}.md",
          credential=DefaultAzureCredential(),
      )
      blob.upload_blob(weekly_summary(response.json(), today), overwrite=True)
      logging.info("Saved weekly summary %s.md", today)
`

export const functionHostJson = code`
  {
    "version": "2.0",
    "extensionBundle": {
      "id": "Microsoft.Azure.Functions.ExtensionBundle",
      "version": "[4.0.0, 5.0.0)"
    }
  }
`

export const functionRequirements = code`
  azure-functions
  azure-identity
  azure-storage-blob
  httpx
`

export const testFunctionApp = code`
  from datetime import date

  from function_app import weekly_summary

  SESSIONS = [
      {"id": 1, "subject": "algebra", "minutes": 40, "studied_on": "2026-03-02"},
      {"id": 2, "subject": "biology", "minutes": 25, "studied_on": "2026-03-04"},
      {"id": 3, "subject": "algebra", "minutes": 20, "studied_on": "2026-03-06"},
      {"id": 4, "subject": "history", "minutes": 30, "studied_on": "2026-02-20"},
  ]


  def test_only_the_last_seven_days_count():
      summary = weekly_summary(SESSIONS, date(2026, 3, 8))
      assert "- algebra: 60 minutes" in summary
      assert "history" not in summary
      assert summary.endswith("Total: 85 minutes\n")


  def test_an_empty_week_says_so():
      assert "- No sessions this week" in weekly_summary(SESSIONS, date(2026, 4, 1))
`

/*
 *   azure-enterprise-capstone -> mainBicep, bicepParams
 */

export const mainBicep = code`
  // Study Tracker on Azure: every resource from the Azure track, in one file.
  // Deploy twice: first with deployApp=false, push the image, then with deployApp=true.

  @description('Azure region for every resource.')
  param location string = resourceGroup().location

  @description('Your initials and 4 digits, for names that must be unique.')
  @minLength(3)
  @maxLength(8)
  param suffix string

  @description('Container image tag to run, such as v3.')
  param imageTag string = 'v3'

  @description('Set to true after the image has been pushed to the registry.')
  param deployApp bool = false

  @description('Administrator password for PostgreSQL.')
  @secure()
  param dbPassword string

  @description('Email address for error alerts.')
  param alertEmail string

  var tags = { project: 'study-tracker', environment: 'learning', owner: 'studyadmin' }
  var dbAdmin = 'studyadmin'
  var roleIds = {
    acrPull: '7f951dda-4ed3-4680-a7ca-43fe172d538d'
    blobReader: '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1'
    secretsUser: '4633458b-17de-408a-b874-0445c86b69e6'
  }

  resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
    name: 'id-study-tracker'
    location: location
    tags: tags
  }

  resource logs 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
    name: 'log-study-tracker'
    location: location
    tags: tags
    properties: {
      sku: { name: 'PerGB2018' }
      retentionInDays: 30
      workspaceCapping: { dailyQuotaGb: json('0.1') }
    }
  }

  resource dbNsg 'Microsoft.Network/networkSecurityGroups@2024-05-01' = {
    name: 'nsg-study-db'
    location: location
    tags: tags
    properties: {
      securityRules: [
        {
          name: 'allow-postgres-from-apps'
          properties: {
            priority: 100
            direction: 'Inbound'
            access: 'Allow'
            protocol: 'Tcp'
            sourceAddressPrefix: '10.0.0.0/23'
            sourcePortRange: '*'
            destinationAddressPrefix: '*'
            destinationPortRange: '5432'
          }
        }
        {
          name: 'deny-other-vnet'
          properties: {
            priority: 200
            direction: 'Inbound'
            access: 'Deny'
            protocol: '*'
            sourceAddressPrefix: 'VirtualNetwork'
            sourcePortRange: '*'
            destinationAddressPrefix: '*'
            destinationPortRange: '*'
          }
        }
      ]
    }
  }

  resource vnet 'Microsoft.Network/virtualNetworks@2024-05-01' = {
    name: 'vnet-study-tracker'
    location: location
    tags: tags
    properties: {
      addressSpace: { addressPrefixes: ['10.0.0.0/16'] }
      subnets: [
        {
          name: 'snet-apps'
          properties: {
            addressPrefix: '10.0.0.0/23'
            delegations: [{ name: 'apps', properties: { serviceName: 'Microsoft.App/environments' } }]
          }
        }
        {
          name: 'snet-db'
          properties: {
            addressPrefix: '10.0.2.0/24'
            networkSecurityGroup: { id: dbNsg.id }
            delegations: [{ name: 'db', properties: { serviceName: 'Microsoft.DBforPostgreSQL/flexibleServers' } }]
          }
        }
      ]
    }
  }

  resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
    name: 'ststudy${'$'}{suffix}'
    location: location
    tags: tags
    sku: { name: 'Standard_LRS' }
    kind: 'StorageV2'
    properties: {
      allowBlobPublicAccess: false
      allowSharedKeyAccess: false
      minimumTlsVersion: 'TLS1_2'
    }
  }

  resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
    parent: storage
    name: 'default'
    properties: {
      deleteRetentionPolicy: { enabled: true, days: 7 }
      isVersioningEnabled: true
    }
  }

  resource notesContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
    parent: blobService
    name: 'notes'
  }

  resource registry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
    name: 'acrstudy${'$'}{suffix}'
    location: location
    tags: tags
    sku: { name: 'Basic' }
    properties: { adminUserEnabled: false }
  }

  resource vault 'Microsoft.KeyVault/vaults@2023-07-01' = {
    name: 'kv-study-${'$'}{suffix}'
    location: location
    tags: tags
    properties: {
      tenantId: subscription().tenantId
      sku: { family: 'A', name: 'standard' }
      enableRbacAuthorization: true
      softDeleteRetentionInDays: 7
    }
  }

  resource dnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
    name: 'study-tracker.private.postgres.database.azure.com'
    location: 'global'
    tags: tags
  }

  resource dnsLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
    parent: dnsZone
    name: 'vnet-study-tracker-link'
    location: 'global'
    tags: tags
    properties: {
      registrationEnabled: false
      virtualNetwork: { id: vnet.id }
    }
  }

  resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' = {
    name: 'psql-study-${'$'}{suffix}'
    location: location
    tags: tags
    sku: { name: 'Standard_B1ms', tier: 'Burstable' }
    properties: {
      version: '17'
      administratorLogin: dbAdmin
      administratorLoginPassword: dbPassword
      storage: { storageSizeGB: 32 }
      backup: { backupRetentionDays: 7, geoRedundantBackup: 'Disabled' }
      network: {
        delegatedSubnetResourceId: vnet.properties.subnets[1].id
        privateDnsZoneArmResourceId: dnsZone.id
        publicNetworkAccess: 'Disabled'
      }
    }
    dependsOn: [dnsLink]
  }

  resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-08-01' = {
    parent: postgres
    name: 'studytracker'
  }

  resource databaseUrl 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
    parent: vault
    name: 'database-url'
    properties: {
      value: 'postgresql://${'$'}{dbAdmin}:${'$'}{dbPassword}@${'$'}{postgres.properties.fullyQualifiedDomainName}:5432/studytracker?sslmode=require'
    }
  }

  resource acrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
    name: guid(registry.id, identity.id, roleIds.acrPull)
    scope: registry
    properties: {
      principalId: identity.properties.principalId
      principalType: 'ServicePrincipal'
      roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleIds.acrPull)
    }
  }

  resource blobReader 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
    name: guid(storage.id, identity.id, roleIds.blobReader)
    scope: storage
    properties: {
      principalId: identity.properties.principalId
      principalType: 'ServicePrincipal'
      roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleIds.blobReader)
    }
  }

  resource secretsUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
    name: guid(vault.id, identity.id, roleIds.secretsUser)
    scope: vault
    properties: {
      principalId: identity.properties.principalId
      principalType: 'ServicePrincipal'
      roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', roleIds.secretsUser)
    }
  }

  resource environment 'Microsoft.App/managedEnvironments@2024-03-01' = {
    name: 'cae-study-tracker'
    location: location
    tags: tags
    properties: {
      vnetConfiguration: { infrastructureSubnetId: vnet.properties.subnets[0].id }
      workloadProfiles: [{ name: 'Consumption', workloadProfileType: 'Consumption' }]
      appLogsConfiguration: {
        destination: 'log-analytics'
        logAnalyticsConfiguration: {
          customerId: logs.properties.customerId
          sharedKey: logs.listKeys().primarySharedKey
        }
      }
    }
  }

  resource app 'Microsoft.App/containerApps@2024-03-01' = if (deployApp) {
    name: 'ca-study-tracker'
    location: location
    tags: tags
    identity: {
      type: 'UserAssigned'
      userAssignedIdentities: { '${'$'}{identity.id}': {} }
    }
    properties: {
      environmentId: environment.id
      workloadProfileName: 'Consumption'
      configuration: {
        ingress: { external: true, targetPort: 8000 }
        registries: [{ server: registry.properties.loginServer, identity: identity.id }]
        secrets: [{ name: 'database-url', keyVaultUrl: '${'$'}{vault.properties.vaultUri}secrets/database-url', identity: identity.id }]
      }
      template: {
        containers: [
          {
            name: 'study-tracker'
            image: '${'$'}{registry.properties.loginServer}/study-tracker:${'$'}{imageTag}'
            resources: { cpu: json('0.25'), memory: '0.5Gi' }
            env: [
              { name: 'LOG_LEVEL', value: 'INFO' }
              { name: 'DATABASE_URL', secretRef: 'database-url' }
              { name: 'STORAGE_ACCOUNT', value: storage.name }
              { name: 'AZURE_CLIENT_ID', value: identity.properties.clientId }
            ]
          }
        ]
        scale: { minReplicas: 0, maxReplicas: 2 }
      }
    }
    dependsOn: [acrPull, secretsUser, blobReader, databaseUrl]
  }

  resource actionGroup 'Microsoft.Insights/actionGroups@2023-01-01' = {
    name: 'ag-study-tracker'
    location: 'global'
    tags: tags
    properties: {
      groupShortName: 'studytrk'
      enabled: true
      emailReceivers: [{ name: 'me', emailAddress: alertEmail, useCommonAlertSchema: true }]
    }
  }

  resource errorAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = if (deployApp) {
    name: 'alert-study-5xx'
    location: 'global'
    tags: tags
    properties: {
      description: 'More than 5 server errors in 5 minutes'
      severity: 2
      enabled: true
      scopes: [app.id]
      evaluationFrequency: 'PT1M'
      windowSize: 'PT5M'
      criteria: {
        'odata.type': 'Microsoft.Azure.Monitor.SingleResourceMultipleMetricCriteria'
        allOf: [
          {
            name: 'server-errors'
            criterionType: 'StaticThresholdCriterion'
            metricName: 'Requests'
            operator: 'GreaterThan'
            threshold: 5
            timeAggregation: 'Total'
            dimensions: [{ name: 'statusCodeCategory', operator: 'Include', values: ['5xx'] }]
          }
        ]
      }
      actions: [{ actionGroupId: actionGroup.id }]
    }
  }

  output appUrl string = deployApp ? 'https://${'$'}{app!.properties.configuration.ingress.fqdn}' : ''
  output registry string = registry.properties.loginServer
`

export const bicepParams = code`
  using 'main.bicep'

  param suffix = 'jd4821'
  param alertEmail = 'you@example.com'
  param dbPassword = readEnvironmentVariable('DB_PASSWORD')
  param deployApp = bool(readEnvironmentVariable('DEPLOY_APP', 'false'))
`

/*
 * Cloud Engineering (AWS track)
 *   aws-compute-storage -> syncNotesAws, testSyncNotesAws
 */

export const syncNotesAws = code`
  import os
  from pathlib import Path

  import boto3


  def sync_notes(s3, bucket, folder=Path("notes")):
      """Download every .md file in the bucket into the local notes folder."""
      folder.mkdir(exist_ok=True)
      count = 0
      for page in s3.get_paginator("list_objects_v2").paginate(Bucket=bucket):
          for item in page.get("Contents", []):
              if item["Key"].endswith(".md"):
                  s3.download_file(bucket, item["Key"], str(folder / Path(item["Key"]).name))
                  count += 1
      return count


  if __name__ == "__main__":
      # boto3 finds credentials itself: your aws sso login, or the app's role in ECS.
      print(f"Downloaded {sync_notes(boto3.client('s3'), os.environ['NOTES_BUCKET'])} notes")
`

export const testSyncNotesAws = code`
  import sync_notes


  class FakeS3:
      """Stands in for boto3's S3 client, so the test needs no AWS account."""

      def __init__(self, files):
          self.files = files

      def get_paginator(self, name):
          assert name == "list_objects_v2"
          return self

      def paginate(self, Bucket):
          return [{"Contents": [{"Key": key} for key in self.files]}]

      def download_file(self, bucket, key, filename):
          with open(filename, "wb") as handle:
              handle.write(self.files[key])


  def test_only_markdown_files_are_downloaded(tmp_path):
      s3 = FakeS3({"biology.md": b"# Biology", "photo.jpg": b"...", "algebra.md": b"# Algebra"})
      assert sync_notes.sync_notes(s3, "study-notes-test", tmp_path) == 2
      assert (tmp_path / "biology.md").read_bytes() == b"# Biology"
      assert not (tmp_path / "photo.jpg").exists()
`

/*
 *   aws-containers-eks -> k8sManifestAws
 */

export const k8sManifestAws = code`
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: study-tracker
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: study-tracker
    template:
      metadata:
        labels:
          app: study-tracker
      spec:
        containers:
          - name: study-tracker
            image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/study-tracker:v3
            ports:
              - containerPort: 8000
            env:
              - name: LOG_LEVEL
                value: INFO
            resources:
              requests:
                cpu: 250m
                memory: 256Mi
              limits:
                memory: 512Mi
            readinessProbe:
              httpGet:
                path: /totals
                port: 8000
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: study-tracker
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
  spec:
    type: LoadBalancer
    loadBalancerClass: eks.amazonaws.com/nlb
    selector:
      app: study-tracker
    ports:
      - port: 80
        targetPort: 8000
`

/*
 *   aws-serverless-events -> lambdaSummary, testLambdaSummary
 */

export const lambdaSummary = code`
  import datetime
  import json
  import os
  import urllib.request

  import boto3


  def weekly_summary(sessions, today):
      """Turn Study Tracker's sessions into a short Markdown summary of the last 7 days."""
      week_ago = today - datetime.timedelta(days=7)
      totals = {}
      for session in sessions:
          if week_ago < datetime.date.fromisoformat(session["studied_on"]) <= today:
              totals[session["subject"]] = totals.get(session["subject"], 0) + session["minutes"]
      lines = [f"# Study summary for the week ending {today}", ""]
      lines += [f"- {subject}: {minutes} minutes" for subject, minutes in sorted(totals.items())] or ["- No sessions this week"]
      lines += ["", f"Total: {sum(totals.values())} minutes"]
      return "\n".join(lines) + "\n"


  def handler(event, context):
      """Called by EventBridge Scheduler: fetch sessions, save this week's summary to S3."""
      today = datetime.date.today()
      with urllib.request.urlopen(f"{os.environ['STUDY_TRACKER_URL']}/sessions", timeout=60) as response:
          sessions = json.load(response)
      key = f"{today}.md"
      boto3.client("s3").put_object(
          Bucket=os.environ["SUMMARIES_BUCKET"],
          Key=key,
          Body=weekly_summary(sessions, today).encode("utf-8"),
          ContentType="text/markdown",
      )
      print(f"Saved weekly summary {key}")
      return {"saved": key}
`

export const testLambdaSummary = code`
  from datetime import date

  from lambda_function import weekly_summary

  SESSIONS = [
      {"id": 1, "subject": "algebra", "minutes": 40, "studied_on": "2026-03-02"},
      {"id": 2, "subject": "biology", "minutes": 25, "studied_on": "2026-03-04"},
      {"id": 3, "subject": "algebra", "minutes": 20, "studied_on": "2026-03-06"},
      {"id": 4, "subject": "history", "minutes": 30, "studied_on": "2026-02-20"},
  ]


  def test_only_the_last_seven_days_count():
      summary = weekly_summary(SESSIONS, date(2026, 3, 8))
      assert "- algebra: 60 minutes" in summary
      assert "history" not in summary
      assert summary.endswith("Total: 85 minutes\n")


  def test_an_empty_week_says_so():
      assert "- No sessions this week" in weekly_summary(SESSIONS, date(2026, 4, 1))
`

export const requirementsAws = code`
  fastapi
  uvicorn
  python-dotenv
  pytest
  httpx
  mcp[cli]>=2,<3
  boto3
  psycopg[binary]
`

export const configAws = code`
  import os

  from dotenv import load_dotenv

  load_dotenv()

  # Set DATABASE_URL to use PostgreSQL. Without it, Study Tracker uses the SQLite file below.
  DATABASE_URL = os.environ.get("DATABASE_URL", "")
  DATABASE_PATH = os.environ.get("DATABASE_PATH", "study.db")
  LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

  # Where to send AI requests. The default is Ollama running on this computer.
  AI_BASE_URL = os.environ.get("AI_BASE_URL", "http://localhost:11434/v1")
  AI_MODEL = os.environ.get("AI_MODEL", "")
  AI_EMBED_MODEL = os.environ.get("AI_EMBED_MODEL", "")
  AI_API_KEY = os.environ.get("AI_API_KEY", "")

  # AI_AUTH=aws signs requests with the app's AWS role instead of a key, for Amazon Bedrock.
  AI_AUTH = os.environ.get("AI_AUTH", "key")
  AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
`

export const aiAws = code`
  import json
  import logging
  import time

  import httpx

  import config

  logger = logging.getLogger("study_tracker.ai")

  RETRY_STATUSES = {429, 500, 502, 503, 504}


  class AIError(Exception):
      """The model could not give an answer."""


  def aws_session():
      import boto3

      return boto3.Session(region_name=config.AWS_REGION)


  def request_headers(url, content):
      """Headers for one request: a signature from the AWS role, a key, or nothing."""
      headers = {"Content-Type": "application/json"}
      if config.AI_AUTH == "aws":
          from botocore.auth import SigV4Auth
          from botocore.awsrequest import AWSRequest

          request = AWSRequest(method="POST", url=url, data=content, headers=headers)
          SigV4Auth(aws_session().get_credentials(), "bedrock", config.AWS_REGION).add_auth(request)
          return dict(request.headers)
      if config.AI_API_KEY:
          headers["Authorization"] = f"Bearer {config.AI_API_KEY}"
      return headers


  def post_json(path, body, retries=2):
      """POST to the model service, retrying failures that may fix themselves."""
      url = f"{config.AI_BASE_URL}{path}"
      content = json.dumps(body).encode()
      for attempt in range(retries + 1):
          started = time.perf_counter()
          try:
              response = httpx.post(url, content=content, headers=request_headers(url, content), timeout=60)
          except httpx.TransportError as error:
              problem = f"could not reach the model at {config.AI_BASE_URL}: {error}"
          else:
              elapsed_ms = round((time.perf_counter() - started) * 1000)
              if response.status_code == 200:
                  data = response.json()
                  usage = data.get("usage") or {}
                  # Log what happened, never what was said: no prompts, no replies.
                  logger.info(
                      "call=%s model=%s status=200 ms=%s input_tokens=%s output_tokens=%s",
                      path.strip("/"), body.get("model"), elapsed_ms,
                      usage.get("prompt_tokens"), usage.get("completion_tokens"),
                  )
                  return data
              problem = f"the model service returned status {response.status_code}"
              logger.warning("call=%s model=%s status=%s ms=%s", path.strip("/"), body.get("model"), response.status_code, elapsed_ms)
              if response.status_code not in RETRY_STATUSES:
                  break
          if attempt < retries:
              wait = 2 ** attempt
              logger.warning("AI request failed (%s), retrying in %s s", problem, wait)
              time.sleep(wait)
      raise AIError(problem)


  def chat(messages, **options):
      """Send a list of messages and return the model's reply message as a dict."""
      body = {"model": config.AI_MODEL, "messages": messages, **options}
      return post_json("/chat/completions", body)["choices"][0]["message"]


  def ask_model(prompt, system="You are a helpful study assistant.", **options):
      """Send one prompt to the model and return its reply as text."""
      messages = [
          {"role": "system", "content": system},
          {"role": "user", "content": prompt},
      ]
      return chat(messages, **options)["content"]


  def embed_bedrock(texts):
      """Amazon Titan text embeddings take one text per request, through boto3."""
      client = aws_session().client("bedrock-runtime")
      vectors = []
      for text in texts:
          try:
              response = client.invoke_model(modelId=config.AI_EMBED_MODEL, body=json.dumps({"inputText": text}))
          except Exception as error:
              raise AIError(f"Bedrock embeddings failed: {error}") from error
          vectors.append(json.loads(response["body"].read())["embedding"])
      logger.info("call=embeddings model=%s texts=%s", config.AI_EMBED_MODEL, len(texts))
      return vectors


  def embed(texts):
      """Turn a list of texts into a list of embedding vectors, in the same order."""
      if config.AI_AUTH == "aws":
          return embed_bedrock(texts)
      data = post_json("/embeddings", {"model": config.AI_EMBED_MODEL, "input": texts})["data"]
      return [item["embedding"] for item in sorted(data, key=lambda item: item["index"])]


  def stream_model(prompt, system="You are a helpful study assistant.", **options):
      """Yield the model's reply in small pieces, as soon as each one is generated."""
      body = {
          "model": config.AI_MODEL,
          "messages": [
              {"role": "system", "content": system},
              {"role": "user", "content": prompt},
          ],
          "stream": True,
          **options,
      }
      url = f"{config.AI_BASE_URL}/chat/completions"
      content = json.dumps(body).encode()
      try:
          with httpx.stream("POST", url, content=content, headers=request_headers(url, content), timeout=60) as response:
              if response.status_code != 200:
                  raise AIError(f"the model service returned status {response.status_code}")
              for line in response.iter_lines():
                  if not line.startswith("data: ") or line == "data: [DONE]":
                      continue
                  choices = json.loads(line.removeprefix("data: ")).get("choices") or []
                  piece = choices[0]["delta"].get("content") if choices else None
                  if piece:
                      yield piece
      except httpx.TransportError as error:
          raise AIError(f"the stream from {config.AI_BASE_URL} failed: {error}") from error
`

export const testAiAws = code`
  import io
  import json

  import boto3
  import httpx

  import ai
  import config


  class FakeBedrock:
      """Stands in for boto3's bedrock-runtime client, so the test needs no AWS account."""

      def __init__(self):
          self.calls = []

      def invoke_model(self, modelId, body):
          self.calls.append((modelId, json.loads(body)["inputText"]))
          return {"body": io.BytesIO(json.dumps({"embedding": [len(self.calls), 0.5]}).encode())}


  def use_bedrock(monkeypatch):
      monkeypatch.setattr(config, "AI_AUTH", "aws")
      monkeypatch.setattr(config, "AI_BASE_URL", "https://bedrock-runtime.us-east-1.amazonaws.com/openai/v1")
      monkeypatch.setattr(config, "AI_MODEL", "chat-model-id")
      monkeypatch.setattr(config, "AI_EMBED_MODEL", "embed-model-id")
      # Clearly fake credentials: signing works offline, and nothing is sent to AWS.
      session = boto3.Session(aws_access_key_id="testing", aws_secret_access_key="testing", region_name="us-east-1")
      monkeypatch.setattr(ai, "aws_session", lambda: session)
      return session


  def test_chat_requests_are_signed_with_the_aws_role(monkeypatch):
      use_bedrock(monkeypatch)
      sent = {}

      def fake_post(url, content, headers, timeout):
          sent.update(url=url, body=json.loads(content), headers=headers)
          reply = {"choices": [{"message": {"role": "assistant", "content": "Hi"}}], "usage": {}}
          return httpx.Response(200, json=reply)

      monkeypatch.setattr(ai.httpx, "post", fake_post)
      assert ai.ask_model("Hello") == "Hi"
      assert sent["url"].endswith("/openai/v1/chat/completions")
      assert sent["body"]["model"] == "chat-model-id"
      assert sent["headers"]["Authorization"].startswith("AWS4-HMAC-SHA256 Credential=testing/")
      assert "/us-east-1/bedrock/aws4_request" in sent["headers"]["Authorization"]


  def test_embeddings_use_bedrock_one_text_at_a_time(monkeypatch):
      session = use_bedrock(monkeypatch)
      fake = FakeBedrock()
      monkeypatch.setattr(session, "client", lambda name: fake)
      assert ai.embed(["cells", "photosynthesis"]) == [[1, 0.5], [2, 0.5]]
      assert fake.calls == [("embed-model-id", "cells"), ("embed-model-id", "photosynthesis")]


  def test_key_mode_still_sends_a_bearer_token(monkeypatch):
      monkeypatch.setattr(config, "AI_AUTH", "key")
      monkeypatch.setattr(config, "AI_API_KEY", "your-key-here")
      headers = ai.request_headers("http://localhost:11434/v1/chat/completions", b"{}")
      assert headers["Authorization"] == "Bearer your-key-here"
`

export const cfnTemplate = code`
  AWSTemplateFormatVersion: "2010-09-09"
  Description: Study Tracker on AWS, built from one template.

  Parameters:
    AlertEmail:
      Type: String
      Description: Where alarm emails go.
    DeployApp:
      Type: String
      AllowedValues: ["false", "true"]
      Default: "false"
      Description: Set to true after pushing the image, to add the app and its alarm.
    ImageTag:
      Type: String
      Default: v4

  Conditions:
    WithApp: !Equals [!Ref DeployApp, "true"]

  Resources:
    # Network: two public subnets for the app, two private subnets for the database.
    Vpc:
      Type: AWS::EC2::VPC
      Properties:
        CidrBlock: 10.0.0.0/16
        EnableDnsHostnames: true
        EnableDnsSupport: true
        Tags: [{ Key: Name, Value: vpc-study-tracker }, { Key: project, Value: study-tracker }]
    PublicSubnetA:
      Type: AWS::EC2::Subnet
      Properties:
        VpcId: !Ref Vpc
        CidrBlock: 10.0.0.0/24
        AvailabilityZone: !Select [0, !GetAZs ""]
        MapPublicIpOnLaunch: true
        Tags: [{ Key: Name, Value: public-a }, { Key: project, Value: study-tracker }]
    PublicSubnetB:
      Type: AWS::EC2::Subnet
      Properties:
        VpcId: !Ref Vpc
        CidrBlock: 10.0.1.0/24
        AvailabilityZone: !Select [1, !GetAZs ""]
        MapPublicIpOnLaunch: true
        Tags: [{ Key: Name, Value: public-b }, { Key: project, Value: study-tracker }]
    PrivateSubnetA:
      Type: AWS::EC2::Subnet
      Properties:
        VpcId: !Ref Vpc
        CidrBlock: 10.0.2.0/24
        AvailabilityZone: !Select [0, !GetAZs ""]
        Tags: [{ Key: Name, Value: private-a }, { Key: project, Value: study-tracker }]
    PrivateSubnetB:
      Type: AWS::EC2::Subnet
      Properties:
        VpcId: !Ref Vpc
        CidrBlock: 10.0.3.0/24
        AvailabilityZone: !Select [1, !GetAZs ""]
        Tags: [{ Key: Name, Value: private-b }, { Key: project, Value: study-tracker }]
    InternetGateway:
      Type: AWS::EC2::InternetGateway
      Properties:
        Tags: [{ Key: project, Value: study-tracker }]
    GatewayAttachment:
      Type: AWS::EC2::VPCGatewayAttachment
      Properties:
        VpcId: !Ref Vpc
        InternetGatewayId: !Ref InternetGateway
    PublicRouteTable:
      Type: AWS::EC2::RouteTable
      Properties:
        VpcId: !Ref Vpc
        Tags: [{ Key: project, Value: study-tracker }]
    PublicRoute:
      Type: AWS::EC2::Route
      DependsOn: GatewayAttachment
      Properties:
        RouteTableId: !Ref PublicRouteTable
        DestinationCidrBlock: 0.0.0.0/0
        GatewayId: !Ref InternetGateway
    PublicRouteA:
      Type: AWS::EC2::SubnetRouteTableAssociation
      Properties:
        SubnetId: !Ref PublicSubnetA
        RouteTableId: !Ref PublicRouteTable
    PublicRouteB:
      Type: AWS::EC2::SubnetRouteTableAssociation
      Properties:
        SubnetId: !Ref PublicSubnetB
        RouteTableId: !Ref PublicRouteTable
    AppSecurityGroup:
      Type: AWS::EC2::SecurityGroup
      Properties:
        GroupDescription: Study Tracker app tasks
        VpcId: !Ref Vpc
        Tags: [{ Key: project, Value: study-tracker }]
    DbSecurityGroup:
      Type: AWS::EC2::SecurityGroup
      Properties:
        GroupDescription: Study Tracker database, reachable only from the app
        VpcId: !Ref Vpc
        SecurityGroupIngress:
          - IpProtocol: tcp
            FromPort: 5432
            ToPort: 5432
            SourceSecurityGroupId: !Ref AppSecurityGroup
        Tags: [{ Key: project, Value: study-tracker }]

    # Storage, images and logs.
    NotesBucket:
      Type: AWS::S3::Bucket
      Properties:
        VersioningConfiguration: { Status: Enabled }
        PublicAccessBlockConfiguration:
          BlockPublicAcls: true
          BlockPublicPolicy: true
          IgnorePublicAcls: true
          RestrictPublicBuckets: true
        Tags: [{ Key: project, Value: study-tracker }]
    Repository:
      Type: AWS::ECR::Repository
      Properties:
        RepositoryName: study-tracker
        EmptyOnDelete: true
        Tags: [{ Key: project, Value: study-tracker }]
    LogGroup:
      Type: AWS::Logs::LogGroup
      Properties:
        LogGroupName: /ecs/study-tracker
        RetentionInDays: 30
        Tags: [{ Key: project, Value: study-tracker }]

    # The database, private and encrypted, with 7 days of point-in-time backups.
    # Secrets Manager generates the password, so it never appears in a file or command.
    DbPasswordSecret:
      Type: AWS::SecretsManager::Secret
      Properties:
        Name: study-tracker/db-password
        GenerateSecretString: { PasswordLength: 32, ExcludePunctuation: true }
        Tags: [{ Key: project, Value: study-tracker }]
    DbSubnetGroup:
      Type: AWS::RDS::DBSubnetGroup
      Properties:
        DBSubnetGroupDescription: Private subnets for Study Tracker
        SubnetIds: [!Ref PrivateSubnetA, !Ref PrivateSubnetB]
        Tags: [{ Key: project, Value: study-tracker }]
    Database:
      Type: AWS::RDS::DBInstance
      DeletionPolicy: Delete
      UpdateReplacePolicy: Delete
      Properties:
        DBInstanceIdentifier: study-tracker-db
        Engine: postgres
        DBInstanceClass: db.t4g.micro
        AllocatedStorage: "20"
        StorageType: gp3
        StorageEncrypted: true
        MasterUsername: studyadmin
        MasterUserPassword: !Sub "{{resolve:secretsmanager:${'$'}{DbPasswordSecret}}}"
        DBName: studytracker
        DBSubnetGroupName: !Ref DbSubnetGroup
        VPCSecurityGroups: [!Ref DbSecurityGroup]
        PubliclyAccessible: false
        BackupRetentionPeriod: 7
        DeleteAutomatedBackups: true
        Tags: [{ Key: project, Value: study-tracker }]
    DatabaseUrlSecret:
      Type: AWS::SecretsManager::Secret
      Properties:
        Name: study-tracker/database-url
        SecretString: !Sub "postgresql://studyadmin:{{resolve:secretsmanager:${'$'}{DbPasswordSecret}}}@${'$'}{Database.Endpoint.Address}:5432/studytracker?sslmode=require"
        Tags: [{ Key: project, Value: study-tracker }]

    # Roles: ECS itself, Express Mode's infrastructure, and the app's own code.
    ExecutionRole:
      Type: AWS::IAM::Role
      Properties:
        AssumeRolePolicyDocument:
          Version: "2012-10-17"
          Statement:
            - Effect: Allow
              Principal: { Service: ecs-tasks.amazonaws.com }
              Action: sts:AssumeRole
        ManagedPolicyArns:
          - arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
        Policies:
          - PolicyName: read-database-secret
            PolicyDocument:
              Version: "2012-10-17"
              Statement:
                - Effect: Allow
                  Action: secretsmanager:GetSecretValue
                  Resource: !Ref DatabaseUrlSecret
        Tags: [{ Key: project, Value: study-tracker }]
    InfrastructureRole:
      Type: AWS::IAM::Role
      Properties:
        AssumeRolePolicyDocument:
          Version: "2012-10-17"
          Statement:
            - Effect: Allow
              Principal: { Service: ecs.amazonaws.com }
              Action: sts:AssumeRole
        ManagedPolicyArns:
          - arn:aws:iam::aws:policy/service-role/AmazonECSInfrastructureRoleforExpressGatewayServices
        Tags: [{ Key: project, Value: study-tracker }]
    TaskRole:
      Type: AWS::IAM::Role
      Properties:
        AssumeRolePolicyDocument:
          Version: "2012-10-17"
          Statement:
            - Effect: Allow
              Principal: { Service: ecs-tasks.amazonaws.com }
              Action: sts:AssumeRole
        Policies:
          - PolicyName: read-notes
            PolicyDocument:
              Version: "2012-10-17"
              Statement:
                - Effect: Allow
                  Action: s3:ListBucket
                  Resource: !GetAtt NotesBucket.Arn
                - Effect: Allow
                  Action: s3:GetObject
                  Resource: !Sub "${'$'}{NotesBucket.Arn}/*"
        Tags: [{ Key: project, Value: study-tracker }]

    # Alerts by email.
    AlertTopic:
      Type: AWS::SNS::Topic
      Properties:
        TopicName: study-tracker-alerts
        Subscription: [{ Protocol: email, Endpoint: !Ref AlertEmail }]
        Tags: [{ Key: project, Value: study-tracker }]

    # Second pass only: the app, once its image is in the repository, and its alarm.
    App:
      Type: AWS::ECS::ExpressGatewayService
      Condition: WithApp
      DependsOn: LogGroup
      Properties:
        ServiceName: study-tracker
        ExecutionRoleArn: !GetAtt ExecutionRole.Arn
        InfrastructureRoleArn: !GetAtt InfrastructureRole.Arn
        TaskRoleArn: !GetAtt TaskRole.Arn
        HealthCheckPath: /totals
        Cpu: "256"
        Memory: "512"
        PrimaryContainer:
          Image: !Sub "${'$'}{Repository.RepositoryUri}:${'$'}{ImageTag}"
          ContainerPort: 8000
          AwsLogsConfiguration: { LogGroup: /ecs/study-tracker, LogStreamPrefix: app }
          Environment:
            - { Name: LOG_LEVEL, Value: INFO }
            - { Name: NOTES_BUCKET, Value: !Ref NotesBucket }
            - { Name: AWS_REGION, Value: !Ref "AWS::Region" }
          Secrets:
            - { Name: DATABASE_URL, ValueFrom: !Ref DatabaseUrlSecret }
        NetworkConfiguration:
          Subnets: [!Ref PublicSubnetA, !Ref PublicSubnetB]
          SecurityGroups: [!Ref AppSecurityGroup]
        ScalingTarget: { MinTaskCount: 1, MaxTaskCount: 2 }
        Tags: [{ Key: project, Value: study-tracker }]
    ServerErrorAlarm:
      Type: AWS::CloudWatch::Alarm
      Condition: WithApp
      Properties:
        AlarmName: study-tracker-5xx
        AlarmDescription: More than 5 server errors in 5 minutes
        Namespace: AWS/ApplicationELB
        MetricName: HTTPCode_Target_5XX_Count
        Dimensions:
          - Name: LoadBalancer
            Value: !Select [1, !Split ["loadbalancer/", !GetAtt App.ECSManagedResourceArns.IngressPath.LoadBalancerArn]]
        Statistic: Sum
        Period: 300
        EvaluationPeriods: 1
        Threshold: 5
        ComparisonOperator: GreaterThanThreshold
        TreatMissingData: notBreaching
        AlarmActions: [!Ref AlertTopic]
        Tags: [{ Key: project, Value: study-tracker }]

  Outputs:
    RepositoryUri:
      Value: !GetAtt Repository.RepositoryUri
    NotesBucketName:
      Value: !Ref NotesBucket
    AppUrl:
      Condition: WithApp
      Value: !Sub "https://${'$'}{App.Endpoint}"
`

/*
 *   gcp-compute-storage -> syncNotesGcp, testSyncNotesGcp
 */

export const syncNotesGcp = code`
  import os
  from pathlib import Path


  def sync_notes(client, bucket, folder=Path("notes")):
      """Download every .md file in the bucket into the local notes folder."""
      folder.mkdir(exist_ok=True)
      count = 0
      for blob in client.list_blobs(bucket):
          if blob.name.endswith(".md"):
              blob.download_to_filename(str(folder / Path(blob.name).name))
              count += 1
      return count


  if __name__ == "__main__":
      from google.cloud import storage

      # The library finds credentials itself: your application-default login, or the app's service account.
      print(f"Downloaded {sync_notes(storage.Client(), os.environ['NOTES_BUCKET'])} notes")
`

export const testSyncNotesGcp = code`
  import sync_notes


  class FakeBlob:
      def __init__(self, name, data):
          self.name, self.data = name, data

      def download_to_filename(self, filename):
          with open(filename, "wb") as handle:
              handle.write(self.data)


  class FakeClient:
      """Stands in for google-cloud-storage's client, so the test needs no Google Cloud account."""

      def __init__(self, files):
          self.files = files

      def list_blobs(self, bucket):
          return [FakeBlob(name, data) for name, data in self.files.items()]


  def test_only_markdown_files_are_downloaded(tmp_path):
      client = FakeClient({"biology.md": b"# Biology", "photo.jpg": b"...", "algebra.md": b"# Algebra"})
      assert sync_notes.sync_notes(client, "study-notes-test", tmp_path) == 2
      assert (tmp_path / "biology.md").read_bytes() == b"# Biology"
      assert not (tmp_path / "photo.jpg").exists()
`

export const requirementsGcp = code`
  fastapi
  uvicorn
  python-dotenv
  pytest
  httpx
  mcp[cli]>=2,<3
  google-cloud-storage
  psycopg[binary]
`

/*
 *   gcp-containers-gke -> k8sManifestGcp
 */

export const k8sManifestGcp = code`
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: study-tracker
  spec:
    replicas: 2
    selector:
      matchLabels:
        app: study-tracker
    template:
      metadata:
        labels:
          app: study-tracker
      spec:
        containers:
          - name: study-tracker
            image: us-central1-docker.pkg.dev/study-tracker-jd4821/study-tracker/study-tracker:v3
            ports:
              - containerPort: 8000
            env:
              - name: LOG_LEVEL
                value: INFO
            resources:
              requests:
                cpu: 250m
                memory: 512Mi
            readinessProbe:
              httpGet:
                path: /totals
                port: 8000
  ---
  apiVersion: v1
  kind: Service
  metadata:
    name: study-tracker
  spec:
    type: LoadBalancer
    selector:
      app: study-tracker
    ports:
      - port: 80
        targetPort: 8000
`

/*
 *   gcp-serverless-events -> functionSummaryGcp, testFunctionSummaryGcp, functionRequirementsGcp
 */

export const functionSummaryGcp = code`
  import datetime
  import json
  import os
  import urllib.request

  import functions_framework
  from google.cloud import storage


  def weekly_summary(sessions, today):
      """Turn Study Tracker's sessions into a short Markdown summary of the last 7 days."""
      week_ago = today - datetime.timedelta(days=7)
      totals = {}
      for session in sessions:
          if week_ago < datetime.date.fromisoformat(session["studied_on"]) <= today:
              totals[session["subject"]] = totals.get(session["subject"], 0) + session["minutes"]
      lines = [f"# Study summary for the week ending {today}", ""]
      lines += [f"- {subject}: {minutes} minutes" for subject, minutes in sorted(totals.items())] or ["- No sessions this week"]
      lines += ["", f"Total: {sum(totals.values())} minutes"]
      return "\n".join(lines) + "\n"


  @functions_framework.http
  def handler(request):
      """Called by Cloud Scheduler: fetch sessions, save this week's summary to Cloud Storage."""
      today = datetime.date.today()
      with urllib.request.urlopen(f"{os.environ['STUDY_TRACKER_URL']}/sessions", timeout=60) as response:
          sessions = json.load(response)
      name = f"{today}.md"
      blob = storage.Client().bucket(os.environ["SUMMARIES_BUCKET"]).blob(name)
      blob.upload_from_string(weekly_summary(sessions, today), content_type="text/markdown")
      print(f"Saved weekly summary {name}")
      return {"saved": name}
`

export const functionRequirementsGcp = code`
  functions-framework
  google-cloud-storage
`

export const testFunctionSummaryGcp = code`
  from datetime import date

  from main import weekly_summary

  SESSIONS = [
      {"id": 1, "subject": "algebra", "minutes": 40, "studied_on": "2026-03-02"},
      {"id": 2, "subject": "biology", "minutes": 25, "studied_on": "2026-03-04"},
      {"id": 3, "subject": "algebra", "minutes": 20, "studied_on": "2026-03-06"},
      {"id": 4, "subject": "history", "minutes": 30, "studied_on": "2026-02-20"},
  ]


  def test_only_the_last_seven_days_count():
      summary = weekly_summary(SESSIONS, date(2026, 3, 8))
      assert "- algebra: 60 minutes" in summary
      assert "history" not in summary
      assert summary.endswith("Total: 85 minutes\n")


  def test_an_empty_week_says_so():
      assert "- No sessions this week" in weekly_summary(SESSIONS, date(2026, 4, 1))
`

/*
 *   gcp-governance-landing-zones -> checkLabelsGcp, testCheckLabelsGcp
 */

export const checkLabelsGcp = code`
  import json
  import shutil
  import subprocess
  import sys

  REQUIRED = "project"
  # Resource types in this track that support labels.
  ASSET_TYPES = [
      "storage.googleapis.com/Bucket",
      "run.googleapis.com/Service",
      "sqladmin.googleapis.com/Instance",
      "artifactregistry.googleapis.com/Repository",
      "secretmanager.googleapis.com/Secret",
  ]


  def unlabeled(resources):
      """Return the names of resources that lack the required label, sorted."""
      return sorted(r["name"] for r in resources if REQUIRED not in (r.get("labels") or {}))


  def search(project):
      gcloud = shutil.which("gcloud") or "gcloud"
      result = subprocess.run(
          [gcloud, "asset", "search-all-resources", f"--scope=projects/{project}",
           f"--asset-types={','.join(ASSET_TYPES)}", "--format=json"],
          capture_output=True, text=True, check=True,
      )
      return json.loads(result.stdout or "[]")


  if __name__ == "__main__":
      resources = search(sys.argv[1])
      missing = unlabeled(resources)
      for name in missing:
          print(f"missing label '{REQUIRED}': {name}")
      print(f"{len(resources) - len(missing)} of {len(resources)} resources have the '{REQUIRED}' label")
      sys.exit(1 if missing else 0)
`

export const testCheckLabelsGcp = code`
  from check_labels import unlabeled


  def test_resources_without_the_project_label_are_reported():
      resources = [
          {"name": "//storage.googleapis.com/study-notes-jd4821", "labels": {"project": "study-tracker"}},
          {"name": "//storage.googleapis.com/test2", "labels": {"owner": "jd"}},
          {"name": "//run.googleapis.com/projects/p/locations/us-central1/services/demo"},
      ]
      assert unlabeled(resources) == [
          "//run.googleapis.com/projects/p/locations/us-central1/services/demo",
          "//storage.googleapis.com/test2",
      ]


  def test_a_fully_labeled_project_passes():
      assert unlabeled([{"name": "//sqladmin.googleapis.com/projects/p/instances/db", "labels": {"project": "study-tracker"}}]) == []
`

/*
 *   gcp-ai-ml-platforms -> configGcp, aiGcp, testAiGcp
 */

export const configGcp = code`
  import os

  from dotenv import load_dotenv

  load_dotenv()

  # Set DATABASE_URL to use PostgreSQL. Without it, Study Tracker uses the SQLite file below.
  DATABASE_URL = os.environ.get("DATABASE_URL", "")
  DATABASE_PATH = os.environ.get("DATABASE_PATH", "study.db")
  LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

  # Where to send AI requests. The default is Ollama running on this computer.
  AI_BASE_URL = os.environ.get("AI_BASE_URL", "http://localhost:11434/v1")
  AI_MODEL = os.environ.get("AI_MODEL", "")
  AI_EMBED_MODEL = os.environ.get("AI_EMBED_MODEL", "")
  AI_API_KEY = os.environ.get("AI_API_KEY", "")

  # AI_AUTH=google sends a token for the app's service account instead of a key, for Google's Agent Platform.
  AI_AUTH = os.environ.get("AI_AUTH", "key")
  GOOGLE_CLOUD_PROJECT = os.environ.get("GOOGLE_CLOUD_PROJECT", "")
  AI_EMBED_LOCATION = os.environ.get("AI_EMBED_LOCATION", "us-central1")
`

export const aiGcp = code`
  import json
  import logging
  import time

  import httpx

  import config

  logger = logging.getLogger("study_tracker.ai")

  RETRY_STATUSES = {429, 500, 502, 503, 504}


  class AIError(Exception):
      """The model could not give an answer."""


  _credentials = None


  def google_token():
      """A short-lived access token for the app's service account, refreshed when it expires."""
      global _credentials
      import google.auth
      import google.auth.transport.requests

      if _credentials is None:
          _credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
      if not _credentials.valid:
          _credentials.refresh(google.auth.transport.requests.Request())
      return _credentials.token


  def request_headers(url, content):
      """Headers for one request: a Google access token, a key, or nothing."""
      headers = {"Content-Type": "application/json"}
      if config.AI_AUTH == "google":
          headers["Authorization"] = f"Bearer {google_token()}"
      elif config.AI_API_KEY:
          headers["Authorization"] = f"Bearer {config.AI_API_KEY}"
      return headers


  def post_json(path, body, retries=2):
      """POST to the model service, retrying failures that may fix themselves."""
      url = f"{config.AI_BASE_URL}{path}"
      content = json.dumps(body).encode()
      for attempt in range(retries + 1):
          started = time.perf_counter()
          try:
              response = httpx.post(url, content=content, headers=request_headers(url, content), timeout=60)
          except httpx.TransportError as error:
              problem = f"could not reach the model at {config.AI_BASE_URL}: {error}"
          else:
              elapsed_ms = round((time.perf_counter() - started) * 1000)
              if response.status_code == 200:
                  data = response.json()
                  usage = data.get("usage") or {}
                  # Log what happened, never what was said: no prompts, no replies.
                  logger.info(
                      "call=%s model=%s status=200 ms=%s input_tokens=%s output_tokens=%s",
                      path.strip("/"), body.get("model"), elapsed_ms,
                      usage.get("prompt_tokens"), usage.get("completion_tokens"),
                  )
                  return data
              problem = f"the model service returned status {response.status_code}"
              logger.warning("call=%s model=%s status=%s ms=%s", path.strip("/"), body.get("model"), response.status_code, elapsed_ms)
              if response.status_code not in RETRY_STATUSES:
                  break
          if attempt < retries:
              wait = 2 ** attempt
              logger.warning("AI request failed (%s), retrying in %s s", problem, wait)
              time.sleep(wait)
      raise AIError(problem)


  def chat(messages, **options):
      """Send a list of messages and return the model's reply message as a dict."""
      body = {"model": config.AI_MODEL, "messages": messages, **options}
      return post_json("/chat/completions", body)["choices"][0]["message"]


  def ask_model(prompt, system="You are a helpful study assistant.", **options):
      """Send one prompt to the model and return its reply as text."""
      messages = [
          {"role": "system", "content": system},
          {"role": "user", "content": prompt},
      ]
      return chat(messages, **options)["content"]


  def embed_google(texts):
      """Agent Platform's embedding models take one text per predict request."""
      location = config.AI_EMBED_LOCATION
      url = (
          f"https://{location}-aiplatform.googleapis.com/v1/projects/{config.GOOGLE_CLOUD_PROJECT}"
          f"/locations/{location}/publishers/google/models/{config.AI_EMBED_MODEL}:predict"
      )
      vectors = []
      for text in texts:
          content = json.dumps({"instances": [{"content": text}]}).encode()
          try:
              response = httpx.post(url, content=content, headers=request_headers(url, content), timeout=60)
          except httpx.TransportError as error:
              raise AIError(f"could not reach Agent Platform: {error}") from error
          if response.status_code != 200:
              raise AIError(f"Agent Platform embeddings returned status {response.status_code}")
          vectors.append(response.json()["predictions"][0]["embeddings"]["values"])
      logger.info("call=embeddings model=%s texts=%s", config.AI_EMBED_MODEL, len(texts))
      return vectors


  def embed(texts):
      """Turn a list of texts into a list of embedding vectors, in the same order."""
      if config.AI_AUTH == "google":
          return embed_google(texts)
      data = post_json("/embeddings", {"model": config.AI_EMBED_MODEL, "input": texts})["data"]
      return [item["embedding"] for item in sorted(data, key=lambda item: item["index"])]


  def stream_model(prompt, system="You are a helpful study assistant.", **options):
      """Yield the model's reply in small pieces, as soon as each one is generated."""
      body = {
          "model": config.AI_MODEL,
          "messages": [
              {"role": "system", "content": system},
              {"role": "user", "content": prompt},
          ],
          "stream": True,
          **options,
      }
      url = f"{config.AI_BASE_URL}/chat/completions"
      content = json.dumps(body).encode()
      try:
          with httpx.stream("POST", url, content=content, headers=request_headers(url, content), timeout=60) as response:
              if response.status_code != 200:
                  raise AIError(f"the model service returned status {response.status_code}")
              for line in response.iter_lines():
                  if not line.startswith("data: ") or line == "data: [DONE]":
                      continue
                  choices = json.loads(line.removeprefix("data: ")).get("choices") or []
                  piece = choices[0]["delta"].get("content") if choices else None
                  if piece:
                      yield piece
      except httpx.TransportError as error:
          raise AIError(f"the stream from {config.AI_BASE_URL} failed: {error}") from error
`

export const testAiGcp = code`
  import json

  import httpx

  import ai
  import config


  class FakeCredentials:
      """Stands in for google.auth credentials, so the test needs no Google Cloud account."""

      def __init__(self):
          self.valid, self.token, self.refreshes = False, None, 0

      def refresh(self, request):
          self.refreshes += 1
          self.valid, self.token = True, f"test-token-{self.refreshes}"


  def use_agent_platform(monkeypatch):
      monkeypatch.setattr(config, "AI_AUTH", "google")
      monkeypatch.setattr(config, "AI_BASE_URL", "https://aiplatform.googleapis.com/v1/projects/p/locations/global/endpoints/openapi")
      monkeypatch.setattr(config, "AI_MODEL", "google/chat-model")
      monkeypatch.setattr(config, "AI_EMBED_MODEL", "embed-model")
      monkeypatch.setattr(config, "GOOGLE_CLOUD_PROJECT", "p")
      monkeypatch.setattr(config, "AI_EMBED_LOCATION", "us-central1")
      credentials = FakeCredentials()
      monkeypatch.setattr(ai, "_credentials", credentials)
      return credentials


  def test_chat_sends_a_google_access_token(monkeypatch):
      credentials = use_agent_platform(monkeypatch)
      sent = []

      def fake_post(url, content, headers, timeout):
          sent.append((url, json.loads(content), headers))
          reply = {"choices": [{"message": {"role": "assistant", "content": "Hi"}}], "usage": {}}
          return httpx.Response(200, json=reply)

      monkeypatch.setattr(ai.httpx, "post", fake_post)
      assert ai.ask_model("Hello") == "Hi"
      assert ai.ask_model("Again") == "Hi"
      url, body, headers = sent[0]
      assert url.endswith("/endpoints/openapi/chat/completions")
      assert body["model"] == "google/chat-model"
      assert headers["Authorization"] == "Bearer test-token-1"
      assert credentials.refreshes == 1  # the token is reused while it is still valid


  def test_embeddings_use_agent_platform_predict_one_text_at_a_time(monkeypatch):
      use_agent_platform(monkeypatch)
      urls, texts = [], []

      def fake_post(url, content, headers, timeout):
          urls.append(url)
          texts.append(json.loads(content)["instances"][0]["content"])
          return httpx.Response(200, json={"predictions": [{"embeddings": {"values": [len(texts), 0.5]}}]})

      monkeypatch.setattr(ai.httpx, "post", fake_post)
      assert ai.embed(["cells", "photosynthesis"]) == [[1, 0.5], [2, 0.5]]
      assert texts == ["cells", "photosynthesis"]
      assert urls[0] == "https://us-central1-aiplatform.googleapis.com/v1/projects/p/locations/us-central1/publishers/google/models/embed-model:predict"


  def test_key_mode_still_sends_a_bearer_key(monkeypatch):
      monkeypatch.setattr(config, "AI_AUTH", "key")
      monkeypatch.setattr(config, "AI_API_KEY", "your-key-here")
      assert ai.request_headers("http://localhost:11434/v1/chat/completions", b"{}")["Authorization"] == "Bearer your-key-here"
`

/*
 *   gcp-enterprise-capstone -> terraformMainGcp, terraformVarsGcp, gitignoreTerraform
 */

export const terraformMainGcp = code`
  terraform {
    required_version = ">= 1.9"
    required_providers {
      google = { source = "hashicorp/google", version = "~> 8.0" }
      random = { source = "hashicorp/random", version = "~> 3.6" }
    }
  }

  variable "project_id" { type = string }
  variable "suffix" { type = string }
  variable "alert_email" { type = string }
  variable "region" {
    type    = string
    default = "us-central1"
  }
  variable "image_tag" {
    type    = string
    default = "v4"
  }
  variable "deploy_app" {
    description = "Set to true after pushing the image, to add the app and its alert."
    type        = bool
    default     = false
  }

  locals {
    labels = { project = "study-tracker" }
    image  = "${'$'}{var.region}-docker.pkg.dev/${'$'}{var.project_id}/study-tracker/study-tracker:${'$'}{var.image_tag}"
  }

  provider "google" {
    project        = var.project_id
    region         = var.region
    default_labels = local.labels
  }

  resource "google_project_service" "apis" {
    for_each = toset([
      "artifactregistry.googleapis.com", "compute.googleapis.com", "monitoring.googleapis.com", "run.googleapis.com",
      "secretmanager.googleapis.com", "servicenetworking.googleapis.com", "sqladmin.googleapis.com", "storage.googleapis.com",
    ])
    service            = each.value
    disable_on_destroy = false
  }

  # Network: a subnet for the app, and a reserved range for Cloud SQL's private address.
  resource "google_compute_network" "vpc" {
    name                    = "vpc-study-tracker"
    auto_create_subnetworks = false
    depends_on              = [google_project_service.apis]
  }

  resource "google_compute_subnetwork" "apps" {
    name                     = "snet-apps"
    network                  = google_compute_network.vpc.id
    region                   = var.region
    ip_cidr_range            = "10.0.0.0/24"
    private_ip_google_access = true
  }

  resource "google_compute_global_address" "services" {
    name          = "google-managed-services-study"
    network       = google_compute_network.vpc.id
    purpose       = "VPC_PEERING"
    address_type  = "INTERNAL"
    address       = "10.100.0.0"
    prefix_length = 16
  }

  resource "google_service_networking_connection" "services" {
    network                 = google_compute_network.vpc.id
    service                 = "servicenetworking.googleapis.com"
    reserved_peering_ranges = [google_compute_global_address.services.name]
    deletion_policy         = "ABANDON"
  }

  # The app's identity, its notes bucket and its image repository.
  resource "google_service_account" "app" {
    account_id   = "study-tracker"
    display_name = "Study Tracker app"
  }

  resource "google_storage_bucket" "notes" {
    name                        = "study-notes-${'$'}{var.suffix}"
    location                    = var.region
    uniform_bucket_level_access = true
    public_access_prevention    = "enforced"
    force_destroy               = true
    depends_on                  = [google_project_service.apis]
  }

  resource "google_storage_bucket_iam_member" "app_reads_notes" {
    bucket = google_storage_bucket.notes.name
    role   = "roles/storage.objectViewer"
    member = google_service_account.app.member
  }

  resource "google_artifact_registry_repository" "images" {
    repository_id = "study-tracker"
    location      = var.region
    format        = "DOCKER"
    depends_on    = [google_project_service.apis]
  }

  # The database: private address only, encrypted connections, 7 days of point-in-time recovery.
  resource "random_password" "db" {
    length  = 32
    special = false
  }

  resource "google_sql_database_instance" "db" {
    name                = "study-tracker-db"
    database_version    = "POSTGRES_17"
    region              = var.region
    deletion_protection = false
    depends_on          = [google_service_networking_connection.services]

    settings {
      edition     = "ENTERPRISE"
      tier        = "db-f1-micro"
      user_labels = local.labels
      ip_configuration {
        ipv4_enabled    = false
        private_network = google_compute_network.vpc.id
        ssl_mode        = "ENCRYPTED_ONLY"
      }
      backup_configuration {
        enabled                        = true
        point_in_time_recovery_enabled = true
        start_time                     = "03:00"
        backup_retention_settings {
          retained_backups = 7
        }
      }
    }
  }

  resource "google_sql_database" "studytracker" {
    name     = "studytracker"
    instance = google_sql_database_instance.db.name
  }

  resource "google_sql_user" "app" {
    name     = "studyadmin"
    instance = google_sql_database_instance.db.name
    password = random_password.db.result
  }

  resource "google_secret_manager_secret" "database_url" {
    secret_id = "database-url"
    replication {
      auto {}
    }
    depends_on = [google_project_service.apis]
  }

  resource "google_secret_manager_secret_version" "database_url" {
    secret      = google_secret_manager_secret.database_url.id
    secret_data = "postgresql://studyadmin:${'$'}{random_password.db.result}@${'$'}{google_sql_database_instance.db.private_ip_address}:5432/studytracker?sslmode=require"
  }

  resource "google_secret_manager_secret_iam_member" "app_reads_database_url" {
    secret_id = google_secret_manager_secret.database_url.id
    role      = "roles/secretmanager.secretAccessor"
    member    = google_service_account.app.member
  }

  resource "google_monitoring_notification_channel" "email" {
    display_name = "Study Tracker alerts"
    type         = "email"
    labels       = { email_address = var.alert_email }
    depends_on   = [google_project_service.apis]
  }

  # Second pass only: the app, once its image is in the repository, and its alert.
  resource "google_cloud_run_v2_service" "app" {
    count               = var.deploy_app ? 1 : 0
    name                = "study-tracker"
    location            = var.region
    deletion_protection = false
    ingress             = "INGRESS_TRAFFIC_ALL"

    template {
      service_account = google_service_account.app.email
      scaling {
        min_instance_count = 0
        max_instance_count = 2
      }
      vpc_access {
        egress = "PRIVATE_RANGES_ONLY"
        network_interfaces {
          network    = google_compute_network.vpc.id
          subnetwork = google_compute_subnetwork.apps.id
        }
      }
      containers {
        image = local.image
        ports {
          container_port = 8000
        }
        env {
          name  = "LOG_LEVEL"
          value = "INFO"
        }
        env {
          name  = "NOTES_BUCKET"
          value = google_storage_bucket.notes.name
        }
        env {
          name = "DATABASE_URL"
          value_source {
            secret_key_ref {
              secret  = google_secret_manager_secret.database_url.secret_id
              version = google_secret_manager_secret_version.database_url.version
            }
          }
        }
      }
    }
    depends_on = [google_secret_manager_secret_iam_member.app_reads_database_url]
  }

  resource "google_cloud_run_v2_service_iam_member" "public" {
    count    = var.deploy_app ? 1 : 0
    name     = google_cloud_run_v2_service.app[0].name
    location = var.region
    role     = "roles/run.invoker"
    member   = "allUsers"
  }

  resource "google_monitoring_alert_policy" "server_errors" {
    count                 = var.deploy_app ? 1 : 0
    display_name          = "study-tracker server errors"
    combiner              = "OR"
    notification_channels = [google_monitoring_notification_channel.email.id]
    user_labels           = local.labels
    conditions {
      display_name = "More than 5 server errors in 5 minutes"
      condition_threshold {
        filter          = "resource.type = \"cloud_run_revision\" AND resource.labels.service_name = \"study-tracker\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class = \"5xx\""
        comparison      = "COMPARISON_GT"
        threshold_value = 5
        duration        = "0s"
        aggregations {
          alignment_period     = "300s"
          per_series_aligner   = "ALIGN_SUM"
          cross_series_reducer = "REDUCE_SUM"
        }
      }
    }
    depends_on = [google_cloud_run_v2_service.app]
  }

  output "repository" {
    value = "${'$'}{var.region}-docker.pkg.dev/${'$'}{var.project_id}/${'$'}{google_artifact_registry_repository.images.repository_id}"
  }

  output "notes_bucket" {
    value = google_storage_bucket.notes.name
  }

  output "app_url" {
    value = one(google_cloud_run_v2_service.app[*].uri)
  }
`

export const terraformVarsGcp = code`
  project_id  = "study-tracker-jd4821c"
  suffix      = "jd4821c"
  alert_email = "you@example.com"
`

export const gitignoreTerraform = code`
  # Terraform: downloaded providers, and state, which contains the database password
  .terraform/
  *.tfstate
  *.tfstate.*
  *.tfplan
`
