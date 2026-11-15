import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { dockerfile, dockerignore } from './study-tracker'

const lesson: StructuredLesson = {
  goals: [
    'Explain what a container is and why "it works on my machine" happens',
    'Write a Dockerfile for a Python app',
    'Build and run an image, passing settings in as environment variables',
  ],
  bigIdea: "A container packs your app together with the exact Python version and packages it needs, so it runs the same way on any computer. You describe how to build it in a short file called a Dockerfile. Docker builds an image from that file and runs it as a container.",
  whyItMatters: "Study Tracker runs on your laptop. A friend clones it and gets an error, because they have a different Python version and forgot to install one package. Later, a cloud server fails for yet another reason. With Docker, everyone runs the same image, and the Cloud Engineering section can deploy that exact image without surprises.",
  goalSections: [
    {
      heading: 'What a container is',
      paragraphs: [
        "\"It works on my machine\" happens because every computer is set up differently: a different Python version, a missing package, a different operating system. Your app quietly depends on all of them.",
        "An image is a package that contains your code plus everything it depends on: a small Linux system, Python, and your installed requirements. A container is a running copy of an image. It is isolated from the computer around it, so it only sees what the image contains.",
        "Install Docker Desktop to follow along. It works on macOS, Windows and Linux, and the `docker` commands in this lesson are the same in every terminal, including PowerShell.",
      ],
      example: {
        language: 'text',
        code: code`
          Without Docker                     With Docker
          your laptop:  Python 3.12          your laptop:  runs image study-tracker
                        fastapi installed    friend's PC:  runs image study-tracker
          friend's PC:  Python 3.10          cloud server: runs image study-tracker
                        fastapi missing      -> the same Python and packages everywhere
          -> "it works on my machine"
        `,
      },
    },
    {
      heading: 'Writing a Dockerfile',
      paragraphs: [
        "A Dockerfile is a recipe, read from top to bottom. `FROM` picks a starting image, such as an official Python image. `WORKDIR` sets the folder inside the image where the next commands run. `COPY` copies files from your project into the image. `RUN` runs a command while building, such as installing packages. `CMD` says what to run when a container starts.",
        "Pick a small base image. `python:3.12-slim` contains Python and little else, which keeps your image small and quick to download.",
        "A `.dockerignore` file works like `.gitignore`. It lists what must never be copied into the image: your `.venv`, your `.env` secrets and your local `study.db`.",
      ],
      example: {
        language: 'text',
        filename: 'Dockerfile',
        code: code`
          FROM python:3.12-slim
          WORKDIR /app
          COPY hello.py .
          CMD ["python", "hello.py"]
        `,
      },
    },
    {
      heading: 'Building and running with settings',
      paragraphs: [
        "`docker build -t study-tracker .` builds an image from the Dockerfile in the current folder and names it, or tags it, `study-tracker`. The final `.` means \"use this folder\".",
        "`docker run` starts a container from the image. A container has its own network, so add `-p 8000:8000` to connect port 8000 on your computer to port 8000 inside the container. Add `-e NAME=value` to set an environment variable, which `config.py` reads exactly as before.",
        "Files written inside a container vanish when the container is removed. To keep `study.db`, attach a volume, storage that Docker keeps separately: `-v study-data:/data` mounts a volume called `study-data` at `/data`, and `DATABASE_PATH` tells the app to save there.",
      ],
      example: {
        language: 'bash',
        code: code`
          docker build -t study-tracker .
          docker run --rm -p 8000:8000 -e LOG_LEVEL=DEBUG study-tracker
          docker run --rm -p 8000:8000 -v study-data:/data -e DATABASE_PATH=/data/study.db study-tracker
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s Dockerfile, line by line',
    intro: "Save this as `Dockerfile`, with no extension, in your `study-tracker` folder next to `app.py` and `requirements.txt`. Then build and run it with the commands in the last two steps.",
    example: { language: 'text', filename: 'Dockerfile', code: dockerfile },
    steps: [
      { code: 'FROM python:3.12-slim', explanation: "Starts from the official slim Python 3.12 image, so the container has exactly that Python version, whatever is on your computer." },
      { code: 'WORKDIR /app', explanation: "Creates and moves into `/app` inside the image. Everything after this happens there." },
      { code: 'COPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt', explanation: "Copies only the requirements list first and installs it. `--no-cache-dir` skips pip's download cache, which would only make the image bigger. Doing this before copying the code means Docker can reuse this slow step when only your code changes." },
      { code: 'COPY . .', explanation: "Copies the rest of the project into `/app`, except anything listed in `.dockerignore`." },
      { code: 'EXPOSE 8000', explanation: "Documents that the app listens on port 8000. It does not open the port by itself. `-p` does that." },
      { code: 'CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]', explanation: "Starts Uvicorn when the container runs. `--host 0.0.0.0` means accept connections from outside the container. The default, `127.0.0.1`, would only accept connections from inside it." },
      { code: 'docker build -t study-tracker .', explanation: "Builds the image, running each Dockerfile line in order. The first build downloads the base image and takes a minute. Later builds reuse what has not changed." },
      { code: 'docker run --rm -p 8000:8000 study-tracker', explanation: "Runs it. Open `http://127.0.0.1:8000/docs` and Study Tracker answers from inside the container. `--rm` removes the container when you stop it with Ctrl+C." },
    ],
  },
  tryIt: {
    instructions: [
      'Install Docker Desktop and start it. Check it works with `docker --version`.',
      'Add the `Dockerfile` from this lesson and the `.dockerignore` below to your `study-tracker` folder.',
      'Build the image and run it with `-p 8000:8000`. Save a session through `/docs`.',
      'Stop the container, run it again and notice the session is gone. Then run it with the volume and `DATABASE_PATH` from this lesson, save a session, restart, and confirm it survives. Commit both files.',
    ],
    files: [{ language: 'text', filename: '.dockerignore', code: dockerignore }],
  },
  mistakes: [
    { mistake: 'Copying `.venv` or `.env` into the image.', fix: 'List them in `.dockerignore`. The image installs its own packages, and secrets should be passed in with `-e` when the container runs.' },
    { mistake: 'Forgetting `-p` and wondering why the browser cannot connect.', fix: 'A container\'s ports are private until you publish them. Use `-p 8000:8000`.' },
    { mistake: 'Losing the database every time the container is removed.', fix: 'Store `study.db` on a volume with `-v study-data:/data` and set `DATABASE_PATH=/data/study.db`.' },
    { mistake: 'Building from a full-size base image.', fix: 'Use a slim image such as `python:3.12-slim`. Smaller images build, upload and start faster.' },
  ],
  quiz: [
    {
      question: 'You run `docker run study-tracker`. The logs say Uvicorn is running, but `http://127.0.0.1:8000` will not load in your browser. What is missing?',
      options: [
        { text: '`EXPOSE 8000` in the Dockerfile', explanation: '`EXPOSE` only documents the port. It does not connect it to your computer.' },
        { text: 'A rebuild of the image', explanation: 'The image is fine, because the app is running inside the container.' },
        { text: 'A `.dockerignore` file', explanation: '`.dockerignore` controls what gets copied in. It has nothing to do with network access.' },
        { text: '`-p 8000:8000` on the `docker run` command', explanation: 'Publishing the port connects your computer\'s port 8000 to the container\'s.' },
      ],
      answer: 3,
    },
    {
      question: 'You save sessions, stop the container with `--rm`, and start a new one from the same image. The sessions are gone. Why?',
      options: [
        { text: 'The image was built wrongly', explanation: 'The image is just the starting point. Data written while running is not saved into it.' },
        { text: '`study.db` was inside the removed container, not on a volume', explanation: 'Files written in a container disappear with it. A volume keeps them between containers.' },
        { text: 'SQLite does not work inside Docker', explanation: 'SQLite works fine. It saved to a place that was thrown away.' },
        { text: 'The app forgot to call `conn.commit()`', explanation: 'Study Tracker commits every insert. The file itself was removed with the container.' },
      ],
      answer: 1,
    },
    {
      question: 'Your image is huge, and you find `.venv` and `.env` inside it. What is the best fix?',
      options: [
        { text: 'Add them to `.dockerignore` so `COPY . .` skips them', explanation: 'The image installs its own packages, and secrets should never be baked into an image.' },
        { text: 'Delete `.venv` from your computer before every build', explanation: 'That breaks your local setup and is easy to forget.' },
        { text: 'Add them to `.gitignore`', explanation: '`.gitignore` controls Git. Docker only reads `.dockerignore`.' },
        { text: 'Switch to a bigger base image', explanation: 'A bigger base makes the image larger, not smaller.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'A Dockerfile turns Study Tracker and everything it needs into one image that runs the same everywhere, as long as you publish its port with `-p`, pass settings with `-e` and keep data on a volume.',
  resources: [
    { title: 'Docker overview', provider: 'Docker Docs', description: 'What images and containers are, with a guided first example.', url: 'https://docs.docker.com/get-started/docker-overview/' },
    { title: 'Dockerfile reference', provider: 'Docker Docs', description: 'Every Dockerfile instruction, including FROM, COPY, RUN and CMD.', url: 'https://docs.docker.com/reference/dockerfile/' },
  ],
  underTheHood: {
    heading: 'Layers and the build cache',
    paragraphs: [
      "Each instruction in a Dockerfile creates a layer: a saved snapshot of the files it changed. An image is a stack of these layers. When you rebuild, Docker checks each instruction in order. If the instruction and the files it uses are unchanged, it reuses the saved layer instead of running it again.",
      "The moment one layer changes, every layer after it must be rebuilt. That is why Study Tracker's Dockerfile copies `requirements.txt` and installs packages before copying the rest of the code. Editing `app.py` only invalidates the final `COPY . .` layer, so a rebuild takes seconds. If the code were copied first, every small edit would reinstall every package.",
      "Layers are also shared. Ten images built from `python:3.12-slim` store that base only once on your disk, and only download it once.",
    ],
  },
}

export default lesson
