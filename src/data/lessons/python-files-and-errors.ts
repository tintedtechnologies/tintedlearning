import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Build a file path with `pathlib` that works on any computer',
    'Write text to a file and read it back',
    'Open files with `with` so they are always closed properly',
  ],
  bigIdea: "Variables disappear when a program ends, but files stay on disk. To use a file, Python needs to know where it is, called its path, and what you want to do with it: read it, overwrite it or add to it. Python's `pathlib` module handles paths, and a `with` block makes sure every file you open gets closed again.",
  whyItMatters: "Say you write a script that keeps a daily log of your expenses. On your laptop it works. You send it to a friend on Windows, and it crashes because the folder path was typed for your computer, such as /Users/you/logs, which does not exist on theirs. Building paths properly and opening files safely is what makes a script work on someone else's computer, not just yours.",
  goalSections: [
    {
      heading: 'Paths with pathlib',
      paragraphs: [
        "A path is the address of a file, such as `reports/2026/march.txt`. Windows separates folders with a backslash and Mac and Linux use a forward slash, so typing paths as plain text causes trouble.",
        "The `pathlib` module solves this. Create a `Path` object, then join parts with the `/` operator. Python uses the correct separator for whatever computer the code runs on. A `Path` also tells you useful things: `.name` is the file name, `.suffix` is the extension such as `.txt`, and `.parent` is the folder it sits in.",
        "A path that starts from the current folder, like `data/notes.txt`, is called a relative path. It depends on which folder you ran the program from, which is the most common reason a script cannot find its file.",
      ],
      example: {
        language: 'python',
        code: code`
          from pathlib import Path

          path = Path("data") / "2026" / "notes.txt"
          print(path)
          print(path.name)
          print(path.suffix)
          print(path.parent)
        `,
        output: 'data/2026/notes.txt\nnotes.txt\n.txt\ndata/2026',
      },
    },
    {
      heading: 'Writing and reading text',
      paragraphs: [
        "For small files, a `Path` can do the whole job in one line. `path.write_text(\"...\")` creates the file, or replaces everything in it if it already exists. `path.read_text()` reads the whole file back as one string.",
        "Always say which encoding to use, with `encoding=\"utf-8\"`. The encoding is the rule for turning letters into bytes on disk. UTF-8 handles every language and emoji, and naming it means the file reads the same on every computer.",
        "`path.exists()` checks whether a file is there before you try to read it, and `.mkdir(exist_ok=True)` creates a folder if it is missing.",
      ],
      example: {
        language: 'python',
        code: code`
          from pathlib import Path

          path = Path("greeting.txt")
          path.write_text("Hello from Python!", encoding="utf-8")

          print(path.exists())
          print(path.read_text(encoding="utf-8"))
        `,
        output: 'True\nHello from Python!',
      },
    },
    {
      heading: 'Opening files safely with with',
      paragraphs: [
        "For more control, use `open()`. Its second argument is the mode: `\"r\"` to read (the default), `\"w\"` to write, which wipes the file first, and `\"a\"` to append, which adds to the end.",
        "An open file holds on to a resource from your operating system, and it must be closed when you are finished. If you forget, your writes may not be saved. Wrapping `open()` in a `with` block closes the file automatically when the indented block ends, even if an error happens inside it. This kind of helper is called a context manager.",
        "When reading, you can loop over the file object directly, and you get one line at a time. Each line ends with a newline character, written `\\n`, which `.strip()` removes.",
      ],
      example: {
        language: 'python',
        code: code`
          with open("log.txt", "w", encoding="utf-8") as file:
              file.write("started\n")
              file.write("finished\n")

          with open("log.txt", encoding="utf-8") as file:
              for line in file:
                  print(line.strip())
        `,
        output: 'started\nfinished',
      },
    },
  ],
  seeItInAction: {
    title: 'Saving and reloading a shopping list',
    intro: "This program creates a folder, writes a list, adds to it later, and reads it back with line numbers. Run it twice and you get the same result, because the first write replaces the file.",
    example: {
      language: 'python',
      code: code`
        from pathlib import Path

        folder = Path("lists")
        folder.mkdir(exist_ok=True)
        path = folder / "shopping.txt"

        with open(path, "w", encoding="utf-8") as file:
            file.write("eggs\n")
            file.write("bread\n")

        with open(path, "a", encoding="utf-8") as file:
            file.write("milk\n")

        with open(path, encoding="utf-8") as file:
            for number, line in enumerate(file, start=1):
                print(number, line.strip())

        print(path.exists(), path.name)
      `,
      output: '1 eggs\n2 bread\n3 milk\nTrue shopping.txt',
    },
    steps: [
      { code: 'folder.mkdir(exist_ok=True)', explanation: "Creates a folder called `lists`. `exist_ok=True` means no error if it is already there, so the script can run again safely." },
      { code: 'path = folder / "shopping.txt"', explanation: "Joins the folder and file name into one path, using the right separator for your computer." },
      { code: 'with open(path, "w", encoding="utf-8") as file:', explanation: "Mode `\"w\"` starts the file fresh. Inside the block, `file` is the open file. Python adds no newlines for you, so each line ends with `\\n`." },
      { code: 'with open(path, "a", encoding="utf-8") as file:', explanation: "Mode `\"a\"` opens the same file and adds milk after the existing lines instead of wiping them." },
      { code: 'for number, line in enumerate(file, start=1):', explanation: "Looping over the file gives one line at a time. `enumerate()` also hands you a counter, here starting at 1." },
      { code: 'print(path.exists(), path.name)', explanation: "After the `with` blocks end, every file is closed. The file is still on disk, so `exists()` is `True`." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground. It uses a temporary folder inside your browser, so nothing touches your computer.',
      'Change the second `\"a\"` to `\"w\"`. Predict what the numbered list looks like now, then run it.',
      'Add a line that prints `path.read_text(encoding=\"utf-8\")` at the end, and look at how the newlines appear.',
    ],
    playground: 'python',
    starterCode: code`
      from pathlib import Path

      folder = Path("lists")
      folder.mkdir(exist_ok=True)
      path = folder / "shopping.txt"

      with open(path, "w", encoding="utf-8") as file:
          file.write("eggs\n")
          file.write("bread\n")

      with open(path, "a", encoding="utf-8") as file:
          file.write("milk\n")

      with open(path, encoding="utf-8") as file:
          for number, line in enumerate(file, start=1):
              print(number, line.strip())

      print(path.exists(), path.name)
    `,
  },
  mistakes: [
    { mistake: 'Opening a file with `"w"` when you meant to add to it.', fix: '`"w"` erases the file the moment it opens. Use `"a"` to append, and keep a copy of anything important.' },
    { mistake: 'Running the script from a different folder and getting `FileNotFoundError`.', fix: 'Relative paths start from the folder you ran Python in. Build paths from the script\'s own location with `Path(__file__).parent / "data.txt"`.' },
    { mistake: 'Leaving out `encoding="utf-8"`.', fix: 'Without it, Python uses the computer\'s default, which differs on Windows. Accented letters then come back garbled.' },
  ],
  quiz: [
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        from pathlib import Path

        path = Path("photos") / "trip" / "beach.jpg"
        print(path.suffix, path.parent.name)
      ` },
      options: [
        { text: 'beach.jpg photos', explanation: '`.suffix` is only the extension, and `.parent` is the folder directly containing the file.' },
        { text: '.jpg trip', explanation: 'The extension is `.jpg`, and the file sits directly inside the folder called trip.' },
        { text: 'jpg photos/trip', explanation: '`.suffix` includes the dot, and `.parent.name` is just the last folder name, not the whole path.' },
        { text: '.jpg photos', explanation: '`photos` is the grandparent folder. The parent is the folder one level up from the file.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'A file `notes.txt` contains three lines. You run this code. What does the file contain afterwards?',
      code: { language: 'python', code: code`
        with open("notes.txt", "w", encoding="utf-8") as file:
            file.write("new line\n")
      ` },
      options: [
        { text: 'The three old lines, then "new line"', explanation: 'That is what mode `"a"` does. Mode `"w"` empties the file first.' },
        { text: '"new line", then the three old lines', explanation: 'Neither mode adds text at the top of a file.' },
        { text: 'Only "new line"', explanation: 'Mode `"w"` erases the file when it opens, so only the newly written text remains.' },
        { text: 'Nothing, because the file was not closed', explanation: 'The `with` block closes the file automatically, so the write is saved.' },
      ],
      answer: 2,
    },
    {
      question: 'Why is `with open(...) as file:` better than `file = open(...)` on its own?',
      options: [
        { text: 'It closes the file automatically when the block ends, even if an error happens', explanation: 'That is the point of the `with` block: closing happens no matter how the block ends.' },
        { text: 'It reads the file faster', explanation: 'Speed is the same. The difference is who is responsible for closing the file.' },
        { text: 'It creates the file if it does not exist', explanation: 'That depends on the mode, such as `"w"` or `"a"`, not on whether you use `with`.' },
        { text: 'It stops other programs from ever reading the file', explanation: 'A `with` block does not lock the file for other programs.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Build paths with `pathlib`, choose the mode carefully, and open files inside a `with` block so they are always closed.',
  resources: [
    { title: 'Reading and writing files', provider: 'Python.org', description: 'The official tutorial section on open, modes and with.', url: 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files' },
    { title: 'pathlib', provider: 'Python.org', description: 'Reference for every Path method, with a table of common tasks.', url: 'https://docs.python.org/3/library/pathlib.html' },
  ],
  underTheHood: {
    heading: 'Why writes can go missing without close',
    paragraphs: [
      "Writing to a disk is slow compared with everything else a program does, so Python does not send every `write()` straight to the disk. It collects the text in a small area of memory called a buffer, and sends it in larger chunks.",
      "The buffer is emptied, or flushed, when it fills up or when the file is closed. If your program crashes or ends before that, whatever was still in the buffer never reaches the disk. The file looks shorter than expected, or even empty.",
      "Closing the file flushes the buffer and hands the file back to the operating system, which only lets each program keep a limited number of files open. A `with` block guarantees the close happens. Behind the scenes it calls the file's special `__exit__` method as the block ends, whether it ends normally or because of an error.",
    ],
  },
}

export default lesson
