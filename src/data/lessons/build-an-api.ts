import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { appInMemory } from './study-tracker'

const lesson: StructuredLesson = {
  goals: [
    'Create a FastAPI app with GET and POST endpoints',
    'Check incoming data with a Pydantic model',
    'Run the app on your computer and try it in the automatic docs page',
  ],
  bigIdea: "An API is a program that waits for HTTP requests and answers them with data. FastAPI is a Python library that turns ordinary functions into API endpoints, checks incoming data for you and builds an interactive test page automatically. In this lesson Study Tracker becomes a real API that can save and list study sessions.",
  whyItMatters: "Say you want Study Tracker on your phone, in a browser and in a small script that logs your study time automatically. Without an API, each one needs its own copy of the logic and its own copy of the data. With an API, all three send requests to one place, which holds the rules and the data, and they all stay in sync.",
  goalSections: [
    {
      heading: 'Endpoints with FastAPI',
      paragraphs: [
        "An endpoint is one method and path that your API answers, such as `GET /sessions`. In FastAPI you create one by writing a normal function and putting a decorator above it: a line starting with `@` that registers the function, such as `@app.get(\"/hello\")`.",
        "Whatever the function returns, FastAPI turns into JSON for the response. Return a dictionary and the client receives a JSON object. Return a list and it receives a JSON list.",
        "First install the two packages into your activated virtual environment: `python -m pip install fastapi uvicorn`. FastAPI builds the app, and Uvicorn is the server that runs it and listens for requests. Then list both names, one per line, in a `requirements.txt` file so others can install them too.",
      ],
      example: {
        language: 'python',
        filename: 'app.py',
        code: code`
          from fastapi import FastAPI

          app = FastAPI(title="Study Tracker")


          @app.get("/hello")
          def hello():
              return {"message": "Study Tracker is running"}
        `,
      },
    },
    {
      heading: 'Checking data with Pydantic',
      paragraphs: [
        "Never trust incoming data. A client could send negative minutes, an empty subject or the word \"forty\" instead of a number. Pydantic, which comes with FastAPI, lets you describe the shape of valid data as a class, called a model.",
        "Each field has a type, such as `int` or `date`, and `Field(...)` adds rules: `gt=0` means greater than 0, `le=600` means at most 600, `min_length=1` means not empty. Pydantic converts data where it safely can, such as the text \"40\" into the number 40, and rejects everything else with a clear message.",
        "When an endpoint takes a model as a parameter, FastAPI checks every request against it before your function runs. Bad data never reaches your code, and the client gets status 422 with a list of exactly what was wrong.",
      ],
      example: {
        language: 'python',
        code: code`
          from datetime import date

          from pydantic import BaseModel, Field, ValidationError


          class SessionIn(BaseModel):
              subject: str = Field(min_length=1, max_length=50)
              minutes: int = Field(gt=0, le=600)
              studied_on: date


          good = SessionIn(subject="algebra", minutes="40", studied_on="2026-03-02")
          print(good.minutes + 5, good.studied_on.year)

          try:
              SessionIn(subject="algebra", minutes=-5, studied_on="2026-03-02")
          except ValidationError as error:
              print(error.errors()[0]["msg"])
        `,
        output: '45 2026\nInput should be greater than 0',
      },
    },
    {
      heading: 'Running it and using the docs page',
      paragraphs: [
        "Start the server from the `study-tracker` folder with `python -m uvicorn app:app --reload`. `app:app` means \"in the file `app.py`, use the object called `app`\". `--reload` restarts the server whenever you save a file, so your changes show up straight away.",
        "Uvicorn prints the address it is listening on. Open `http://127.0.0.1:8000/docs` in your browser. FastAPI builds this page automatically from your code: every endpoint is listed, and Try it out lets you send real requests and see the responses, with no extra tools.",
        "Stop the server with Ctrl+C in the terminal.",
      ],
      example: {
        language: 'bash',
        code: code`
          $ python -m uvicorn app:app --reload
          INFO:     Will watch for changes in these directories: ['/home/sam/study-tracker']
          INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
          INFO:     Started reloader process [4211] using StatReload
          INFO:     Application startup complete.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s first two endpoints',
    intro: "This is the whole of `app.py` for now. It lets clients list sessions and save new ones, with every new session checked by Pydantic. Sessions are kept in a Python list, which the Databases lesson will replace.",
    example: { language: 'python', filename: 'app.py', code: appInMemory },
    steps: [
      { code: 'app = FastAPI(title="Study Tracker")', explanation: "Creates the app. The title appears at the top of the docs page." },
      { code: 'class SessionIn(BaseModel):', explanation: "The shape of a session a client may send: a subject of 1 to 50 characters, between 1 and 600 minutes, and a real date such as `2026-03-02`." },
      { code: 'class Session(SessionIn):\n    id: int', explanation: "A saved session is everything in `SessionIn` plus an `id`. Inheriting means the three fields are written only once." },
      { code: 'sessions: list[Session] = []', explanation: "The storage for now: a plain list in memory. It empties every time the server restarts." },
      { code: '@app.get("/sessions")\ndef get_sessions() -> list[Session]:', explanation: "`GET /sessions` returns every saved session. The return type hint tells FastAPI the shape of the response, and the docs page shows it." },
      { code: '@app.post("/sessions", status_code=201)', explanation: "`POST /sessions` creates a session. `status_code=201` returns 201 Created instead of the default 200, which is the correct code for something new." },
      { code: 'def create_session(new: SessionIn) -> Session:', explanation: "Because `new` is a `SessionIn`, FastAPI reads the JSON body and validates it before this function runs. Invalid data gets a 422 response automatically." },
      { code: 'session = Session(id=len(sessions) + 1, **new.model_dump())', explanation: "`model_dump()` turns the model into a dictionary, and `**` passes its fields in by name. The new session gets the next number as its `id`, is added to the list and is sent back." },
    ],
  },
  tryIt: {
    instructions: [
      'In your activated environment, run `python -m pip install fastapi uvicorn`, save the code above as `app.py`, and start the server with `python -m uvicorn app:app --reload`.',
      'Open `http://127.0.0.1:8000/docs`, use POST /sessions to save two sessions, then GET /sessions to list them.',
      'Send `"minutes": "forty"` and read the 422 response. Which field and which rule does it name?',
      'Add a `GET /totals` endpoint that returns a dictionary of total minutes per subject, such as `{"algebra": 70}`. Commit it on a branch and open a pull request.',
    ],
  },
  mistakes: [
    { mistake: 'Starting the server without `--reload`, then wondering why your changes do not show.', fix: 'Use `--reload` while developing, or stop the server with Ctrl+C and start it again after every change.' },
    { mistake: 'Returning 200 when a POST creates something.', fix: 'Set `status_code=201` on create endpoints, so clients know a new item exists.' },
    { mistake: 'Accepting raw dictionaries and trusting them.', fix: 'Describe every input as a Pydantic model with types and limits, so bad data is rejected before your code runs.' },
    { mistake: 'Expecting sessions to survive a restart.', fix: 'A Python list lives in memory and is lost when the server stops. The Databases lesson saves sessions to a file instead.' },
  ],
  quiz: [
    {
      question: 'A client sends `POST /sessions` with `"minutes": "forty"` to the Study Tracker API above. What does it get back?',
      options: [
        { text: '201 Created, with minutes set to 0', explanation: 'Pydantic never guesses a value for text it cannot read as a number. It rejects the request.' },
        { text: '500 Internal Server Error', explanation: 'Nothing crashes. Validation catches the problem before your function runs.' },
        { text: '422, with a message saying minutes must be a valid integer', explanation: 'FastAPI checks the body against `SessionIn`, and "forty" cannot be turned into an `int`.' },
        { text: '201 Created, with minutes stored as the text "forty"', explanation: 'The model says `minutes: int`, so text that is not a number is never stored.' },
      ],
      answer: 2,
    },
    {
      question: 'You change the message in an endpoint, save `app.py` and refresh the browser, but the old message still appears. What is the most likely reason?',
      options: [
        { text: 'The server was started without `--reload`, so it is still running the old code', explanation: 'Without `--reload`, Uvicorn keeps the code it loaded at start-up until you restart it.' },
        { text: 'FastAPI only reads `app.py` once a day', explanation: 'FastAPI reads the code when the server starts. There is no daily schedule.' },
        { text: 'The browser cannot show JSON', explanation: 'Browsers display JSON fine. The response itself is out of date.' },
        { text: 'The endpoint needs `status_code=201`', explanation: 'Status codes do not affect whether new code is loaded.' },
      ],
      answer: 0,
    },
    {
      question: 'You save three sessions, stop the server with Ctrl+C, start it again and call `GET /sessions`. What do you get?',
      options: [
        { text: 'The three sessions', explanation: 'They were stored in a Python list, which disappears when the program stops.' },
        { text: 'A 404 Not Found', explanation: 'The endpoint still exists. It just has nothing to return.' },
        { text: 'An error, because the list file is missing', explanation: 'There is no file yet. The list lives only in memory.' },
        { text: 'An empty list, `[]`', explanation: 'The in-memory list starts empty every time the server starts. The Databases lesson fixes this.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'FastAPI turns decorated Python functions into endpoints, Pydantic models reject bad data before your code runs, and `/docs` lets you try every endpoint from the browser.',
  resources: [
    { title: 'FastAPI tutorial: first steps', provider: 'FastAPI', description: 'The official tutorial, starting from a single endpoint.', url: 'https://fastapi.tiangolo.com/tutorial/first-steps/' },
    { title: 'Request body', provider: 'FastAPI', description: 'How FastAPI uses Pydantic models to read and validate JSON bodies.', url: 'https://fastapi.tiangolo.com/tutorial/body/' },
  ],
  underTheHood: {
    heading: 'How FastAPI builds the docs page from your code',
    paragraphs: [
      "When Python reads `@app.post(\"/sessions\")`, the decorator records the method, the path and your function in a list of routes. When a request arrives, FastAPI finds the matching route and calls your function.",
      "Before calling it, FastAPI reads your function's type hints. Because `new` is typed as `SessionIn`, it knows to read the JSON body and validate it with Pydantic. The return type, `Session`, tells it how to shape and check the response.",
      "FastAPI also turns all of that into an OpenAPI document: a standard JSON description of every endpoint, its inputs and its outputs. You can see it at `/openapi.json`. The `/docs` page is a ready-made web page, called Swagger UI, that reads that document and draws a form for each endpoint. That is why the docs never go out of date: they come from the same code that runs.",
    ],
  },
}

export default lesson
