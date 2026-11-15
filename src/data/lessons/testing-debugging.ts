import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { appWithDatabase, config, db, requirements, testApp, workflow } from './study-tracker'

const appFiles = { 'config.py': config, 'db.py': db, 'app.py': appWithDatabase }

const lesson: StructuredLesson = {
  goals: [
    'Test API endpoints with FastAPI\'s `TestClient`',
    'Give tests their own database so they never touch real data',
    'Run the tests automatically on every push with GitHub Actions',
  ],
  bigIdea: "Python's Testing lesson checked single functions. A whole app also needs tests that send real requests to every endpoint and check the status code and the JSON, exactly as a client would. Run against a throwaway database and repeated automatically on every push, they tell you within minutes whether a change broke anything.",
  whyItMatters: "You change the SQL in `db.py` to make totals faster, try one request in `/docs`, and it looks fine. Two days later you notice that creating a session now returns 500, because of a typo in a part you did not try. A test for each endpoint, run on every push, would have caught it before the change was even merged.",
  goalSections: [
    {
      heading: 'Sending requests with TestClient',
      paragraphs: [
        "`TestClient` comes with FastAPI. It sends requests straight into your app without starting a server or using the network, so tests run in a fraction of a second. It needs two packages: `python -m pip install pytest httpx`. Add both to `requirements.txt`.",
        "You use it like the `requests` library: `client.get(\"/totals\")` or `client.post(\"/sessions\", json={...})`. The response has `.status_code` and `.json()`, which your tests check with `assert`.",
        "Run this script twice and the `id` goes from 1 to 2, because it is writing to your real `study.db`. That is the problem the next section solves.",
      ],
      example: {
        language: 'python',
        filename: 'try_client.py',
        files: appFiles,
        code: code`
          from fastapi.testclient import TestClient

          from app import app

          client = TestClient(app)
          response = client.post("/sessions", json={"subject": "algebra", "minutes": 40, "studied_on": "2026-03-02"})
          print(response.status_code, response.json())
        `,
        output: "201 {'subject': 'algebra', 'minutes': 40, 'studied_on': '2026-03-02', 'id': 1}",
      },
    },
    {
      heading: 'A separate database for every test',
      paragraphs: [
        "Tests that use your real database are dangerous and unreliable. They can delete or change your own study history, and their results depend on whatever happens to be in the file.",
        "pytest gives every test two helpers, called fixtures. `tmp_path` is a brand-new empty folder that pytest removes afterwards. `monkeypatch` changes a value for the length of one test and then puts it back. Together they point `config.DATABASE_PATH` at a fresh file for every single test.",
        "This works because `db.py` reads `config.DATABASE_PATH` each time it connects, instead of copying it once at start-up. Writing code so tests can swap a setting easily is part of designing an app to be testable.",
      ],
      example: {
        language: 'python',
        filename: 'test_app.py',
        code: code`
          @pytest.fixture
          def client(tmp_path, monkeypatch):
              monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))
              return TestClient(app)
        `,
        runnable: false,
      },
    },
    {
      heading: 'Running tests on every push',
      paragraphs: [
        "Continuous integration, or CI, means a service runs your tests automatically whenever code changes. GitHub's built-in CI is called GitHub Actions. You describe what to do in a file inside the `.github/workflows/` folder of your repository.",
        "After you push, GitHub starts a fresh machine, installs your requirements and runs pytest. The result appears next to the commit and on the pull request as a green tick or a red cross.",
        "In your repository settings, you can require the check to pass before a pull request can be merged, so broken code cannot reach `main` by accident.",
      ],
      example: { language: 'text', filename: '.github/workflows/tests.yml', code: workflow },
    },
  ],
  seeItInAction: {
    title: 'Three endpoint tests for Study Tracker',
    intro: "This is `test_app.py`, saved next to `app.py`. Each test gets its own empty database, sends real requests and checks both the status code and the JSON. Run it with `python -m pytest`.",
    example: { language: 'python', filename: 'test_app.py', code: testApp, files: appFiles, runWith: 'pytest' },
    steps: [
      { code: 'import config\nfrom app import app', explanation: "Imports the settings module, so the fixture can change it, and the app to test." },
      { code: '@pytest.fixture\ndef client(tmp_path, monkeypatch):', explanation: "A fixture is a function pytest runs before each test that asks for it. Any test with a `client` parameter gets a fresh client and a fresh database." },
      { code: 'monkeypatch.setattr(config, "DATABASE_PATH", str(tmp_path / "test.db"))', explanation: "Points the app at `test.db` in a temporary folder for this test only. Your real `study.db` is never opened." },
      { code: 'assert response.status_code == 201\nassert response.json()["id"] == 1', explanation: "Checks the status code and the body. The `id` is reliably 1 because every test starts with an empty database." },
      { code: 'assert client.get("/totals").json() == {"python": 75}', explanation: "Saves two sessions, then checks the totals endpoint adds them up. This tests `db.py`, the SQL and the endpoint together." },
      { code: 'assert response.status_code == 422', explanation: "An unhappy-path test: negative minutes must be rejected. Tests for bad input catch the bugs users actually hit." },
      { code: '$ python -m pytest\n3 passed', explanation: "pytest finds every file named `test_*.py` and every function starting with `test_`. Depending on your library versions, it may also print a warnings summary. Warnings are notes about libraries, not failures. The result line is what counts." },
    ],
  },
  tryIt: {
    instructions: [
      'Run `python -m pip install pytest httpx`, add both to `requirements.txt` as below, save `test_app.py` from this lesson and run `python -m pytest` until all 3 pass.',
      'Add a fourth test: save two sessions, call `GET /sessions` and check that it returns a list of 2.',
      'Create `.github/workflows/tests.yml` as shown above. Commit everything on a branch, push it and open a pull request. Watch the check run.',
      'Break something on purpose, such as changing `status_code=201` to `200`, push again and see the check turn red. Then fix it.',
    ],
    files: [{ language: 'text', filename: 'requirements.txt', code: requirements }],
  },
  mistakes: [
    { mistake: 'Writing tests that depend on each other\'s order.', fix: 'Give every test its own fresh database through a fixture, so each one passes or fails on its own.' },
    { mistake: 'Testing against the real `study.db`.', fix: 'Point `config.DATABASE_PATH` at a file in `tmp_path` with `monkeypatch`, so tests never touch real data.' },
    { mistake: 'Testing only the happy path.', fix: 'For each endpoint, add at least one test for bad input, such as negative minutes or a missing field.' },
    { mistake: 'Merging while the CI check is red.', fix: 'A red check means a test failed on a clean machine. Read the log and fix it first, and require the check in your repository settings.' },
  ],
  quiz: [
    {
      question: 'A test posts one session and asserts `id == 1`. It passes on its own but fails when the whole suite runs. What is the most likely cause?',
      options: [
        { text: 'pytest runs tests in a random order on purpose', explanation: 'pytest runs them in file order by default. The problem is shared data, not the order itself.' },
        { text: 'The `id` column needs `AUTOINCREMENT` removed', explanation: 'The ids work correctly. They just continue from rows another test left behind.' },
        { text: 'The tests share one database, so earlier tests already created sessions', explanation: 'With shared data, results depend on what ran before. A fresh database per test fixes it.' },
        { text: 'TestClient only works for one test at a time', explanation: 'You can create as many clients as you like. The database is what is shared.' },
      ],
      answer: 2,
    },
    {
      question: 'pytest reports `assert 422 == 201` for `test_create_session_returns_201`. What does that tell you?',
      options: [
        { text: 'The app accepted the session but returned the wrong code', explanation: 'A 422 means FastAPI rejected the request body before the endpoint ran.' },
        { text: 'The test file has a syntax error', explanation: 'A syntax error stops pytest before any test runs. This is a normal failed assertion.' },
        { text: 'The server is not running', explanation: 'TestClient does not need a running server. It calls the app directly.' },
        { text: 'The API rejected the data the test sent, so the test data or the model rules need checking', explanation: 'The actual value, 422, is on the left. The JSON in the test probably breaks one of the `SessionIn` rules.' },
      ],
      answer: 3,
    },
    {
      question: 'Your pull request shows a red cross from GitHub Actions, but the tests pass on your laptop. What should you do?',
      options: [
        { text: 'Open the failed run\'s log and find the first error before merging', explanation: 'The log shows exactly what failed on a clean machine, often a package missing from `requirements.txt`.' },
        { text: 'Merge it, because it works on your computer', explanation: 'Your laptop may have packages or files that are not in the repository. CI shows what a fresh setup sees.' },
        { text: 'Delete the workflow file so the check disappears', explanation: 'That hides the problem from everyone, including you.' },
        { text: 'Push the same commit again until it turns green', explanation: 'A real failure fails every time. Read the log instead of retrying blindly.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Test every endpoint with `TestClient` against a fresh temporary database, check both status codes and JSON including bad input, and let GitHub Actions run the suite on every push.',
  resources: [
    { title: 'Testing', provider: 'FastAPI', description: 'The official guide to TestClient and writing tests for FastAPI apps.', url: 'https://fastapi.tiangolo.com/tutorial/testing/' },
    { title: 'Building and testing Python', provider: 'GitHub Docs', description: 'Ready-made GitHub Actions workflows for Python projects.', url: 'https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-python' },
  ],
  underTheHood: {
    heading: 'How monkeypatch puts things back',
    paragraphs: [
      "Python modules are objects, and their variables are attributes you can change while the program runs. `monkeypatch.setattr(config, \"DATABASE_PATH\", ...)` saves the current value of `config.DATABASE_PATH`, then sets the new one.",
      "pytest remembers every change it made. When the test finishes, whether it passed or failed, it restores each saved value in reverse order. The next test sees the original setting, then its own fixture changes it again. The same tool can set environment variables with `monkeypatch.setenv` or replace a function that would call the internet.",
      "There is one catch. If a module copies a value at import time, such as `from config import DATABASE_PATH`, it keeps its own copy, and patching `config` later does not affect it. That is why `db.py` imports the module and reads `config.DATABASE_PATH` every time it connects.",
    ],
  },
}

export default lesson
