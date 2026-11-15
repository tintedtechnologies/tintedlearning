import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'
import { aiEmbed, assistant, configEmbed, db, mcpHostConfig, mcpServer, schemas, testMcpServer } from './study-tracker'

const serverFiles = { 'config.py': configEmbed, 'ai.py': aiEmbed, 'db.py': db, 'schemas.py': schemas, 'assistant.py': assistant, 'mcp_server.py': mcpServer }

const lesson: StructuredLesson = {
  assumes: 'Tool Calling, with `assistant.py` and its `log_session()` and `get_totals()` functions. This lesson uses version 2 of the official MCP Python SDK.',
  goals: [
    'Explain what MCP standardizes and how hosts, clients and servers fit together',
    'Build an MCP server that offers Study Tracker\'s tools to any MCP app',
    'Decide when MCP is worth adding and when plain tool calling is enough',
  ],
  bigIdea: "The Model Context Protocol, or MCP, is an open standard for connecting AI applications to tools and data. You describe your tools once, in an MCP server, and any AI application that speaks MCP, such as a desktop assistant or a code editor, can use them. It does for AI tools what a standard plug shape does for electrical devices.",
  whyItMatters: "In Tool Calling, Study Tracker's tools only worked inside its own `/assistant` endpoint. Now suppose you want to log a session from the AI assistant in your code editor, or ask a desktop chat app for your totals. Without a standard, every app needs its own custom connection. With MCP, one small file lets every MCP-capable app use the same `log_session` and `get_totals`, with exactly the same validation.",
  goalSections: [
    {
      heading: 'Hosts, clients and servers',
      paragraphs: [
        "A host is the AI application a person uses, such as a desktop assistant or an editor. Inside it, a client speaks MCP, one client per server. A server is the program you write, which offers capabilities. The server never talks to the model. The host's model decides to call a tool, and the host passes the call to your server.",
        "A server can offer three kinds of thing. Tools are actions the model chooses to call. Resources are data, such as a file's text, that the application loads into the context. Prompts are ready-made message templates a user picks by name.",
        "What MCP standardizes is the conversation between client and server: how to list the tools, describe their parameters, call them and return results or errors. It runs over two transports. With stdio, the host starts your server as a program on the same computer and talks through its input and output. With Streamable HTTP, the server runs at a web address, so it can be shared or deployed.",
      ],
      example: {
        language: 'text',
        code: code`
          Desktop assistant (host)          Code editor (host)
            model decides to call a tool      model decides to call a tool
            MCP client                        MCP client
                    \                         /
                     \     MCP over stdio     /
                      mcp_server.py (your server)
                        get_totals    log_session
                                 |
                              study.db
        `,
      },
    },
    {
      heading: 'An MCP server for Study Tracker',
      paragraphs: [
        "Install the SDK with `python -m pip install \"mcp[cli]>=2,<3\"` and add the same line to `requirements.txt`. The version limit matters, because version 2 changed how servers are written, and many older tutorials still show version 1.",
        "Each tool is a Python function with the `@mcp.tool()` decorator. The SDK builds the tool's name from the function name, its description from the docstring and its parameters from the type hints. Compare that with the JSON Schema you wrote by hand in Tool Calling: the example shows what the SDK generated for `log_session`.",
        "When a tool fails, raise `ToolError` with a clear message. The host shows the model an error result it can read and act on. Returning an error message as ordinary text would look like success.",
      ],
      example: {
        language: 'text',
        code: code`
          What a host receives for log_session, generated from the type hints:
          {
            "type": "object",
            "properties": {
              "subject":    {"title": "Subject", "type": "string"},
              "minutes":    {"title": "Minutes", "type": "integer"},
              "studied_on": {"title": "Studied On", "type": "string"}
            },
            "required": ["subject", "minutes", "studied_on"]
          }
        `,
      },
    },
    {
      heading: 'When MCP is worth it',
      paragraphs: [
        "MCP earns its place when the same tools should work in several AI applications, such as your editor, a desktop assistant and a teammate's agent, or when you publish an integration for other people. It also lets you plug ready-made servers, for files, code hosting or databases, into the apps you already use.",
        "It is not needed when one app talks to its own model. Study Tracker's `/assistant` endpoint keeps calling its tools directly, because adding a protocol between two parts of the same program adds moving parts and nothing else.",
        "Treat MCP servers as programs, because they are. A stdio server runs with your permissions, so only install servers you trust. Keep the host's approval prompts on for tools that change data, and protect any server you expose over HTTP with authentication. The security lessons go deeper.",
      ],
      example: {
        language: 'text',
        code: code`
          Situation                                          Use
          Study Tracker's own /assistant endpoint            plain tool calling
          Log sessions from your editor's AI assistant       an MCP server
          Share your tools with teammates' AI apps           an MCP server over HTTP
          Use a ready-made integration someone published     install their MCP server, if trusted
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Study Tracker\'s mcp_server.py',
    intro: "The whole server is about 30 lines, because it reuses the functions from `assistant.py`. Below it are a host configuration and the results from calling the tools, both checked by connecting to the server.",
    example: { language: 'python', filename: 'mcp_server.py', code: mcpServer, runnable: false, files: serverFiles },
    steps: [
      { code: 'mcp = MCPServer("Study Tracker")', explanation: "Creates the server and gives it the name hosts will display. In version 2 of the SDK, the import is `from mcp.server import MCPServer`." },
      { code: '@mcp.tool()\ndef get_totals() -> dict[str, int]:', explanation: "One decorator registers the tool. The return type hint lets the SDK send a structured result as well as text." },
      { code: 'return assistant.log_session(subject, minutes, studied_on)', explanation: "The server reuses the same function as the `/assistant` endpoint, so both paths apply the same `SessionIn` rules and the same future-date check." },
      { code: 'raise ToolError(f"The session was not saved: {error}") from error', explanation: "Asked to save 900 minutes, the host receives an error result reading `Error executing tool log_session: The session was not saved: 1 validation error for SessionIn ...`, which the model can explain to the learner." },
      { code: 'if __name__ == "__main__":\n    mcp.run()', explanation: "With no arguments, `run()` uses stdio: it waits silently for a host to start talking. The guard stops the server from starting when tests import the file." },
      { code: '"env": {"DATABASE_PATH": "/full/path/to/study-tracker/study.db"}', explanation: "From the host configuration in Try it yourself. Hosts start servers from their own folder and pass only a few environment variables, so a relative `study.db` silently creates a new, empty database. Tested: without this line, `get_totals` returned `{}`. With it, the real totals." },
    ],
  },
  tryIt: {
    instructions: [
      'Install the SDK with `python -m pip install "mcp[cli]>=2,<3"`, add that line to `requirements.txt`, and save `mcp_server.py` in your `study-tracker` folder.',
      'Add `test_mcp_server.py` and run `python -m pytest`. It connects to the server in memory, with no host needed.',
      'If you have Node.js installed, run `mcp dev mcp_server.py` to open the MCP Inspector, a test host in your browser. Call both tools.',
      'Optional: add the server to an MCP-capable desktop assistant or code editor using its configuration file. Many use the shape below, but check that host\'s documentation. Use full paths, then ask the host "How much have I studied?" and approve the tool call.',
    ],
    files: [
      { language: 'python', filename: 'test_mcp_server.py', code: testMcpServer, files: serverFiles, runWith: 'pytest' },
      { language: 'text', filename: 'host configuration (example)', code: mcpHostConfig },
    ],
  },
  mistakes: [
    { mistake: 'Using relative paths in a host\'s configuration.', fix: 'Hosts start servers from their own folder. Use full paths for the command, the script and `DATABASE_PATH`.' },
    { mistake: 'Returning an error message as a normal result.', fix: 'Raise `ToolError`, so the result is marked as an error and the model knows the call failed.' },
    { mistake: 'Installing MCP servers from sources you do not trust.', fix: 'A server runs with your permissions. Use servers from publishers you trust, and read the code of small ones.' },
    { mistake: 'Turning off approval prompts for tools that change data.', fix: 'Keep approvals on for actions such as saving or deleting, so a person confirms each one.' },
  ],
  quiz: [
    {
      question: 'You use a desktop assistant connected to Study Tracker\'s `mcp_server.py`. When you type "log 30 minutes of python", what decides to call `log_session`?',
      options: [
        { text: '`mcp_server.py`, after reading your message', explanation: 'The server never sees your message. It only receives tool calls.' },
        { text: 'The MCP client inside the host', explanation: 'The client carries messages between the host and the server. It does not choose tools.' },
        { text: 'The model in the host, after reading the tool descriptions', explanation: 'The host\'s model chooses the tool, and the client sends the call to your server.' },
        { text: '`study.db`', explanation: 'The database only stores data. It makes no decisions.' },
      ],
      answer: 2,
    },
    {
      question: 'A host shows `get_totals` returning `{}`, though your `study.db` has sessions. The host configuration has the full path to `mcp_server.py` but no `env` section. What is the most likely cause?',
      options: [
        { text: 'The server started in the host\'s folder and created a new, empty study.db there', explanation: 'A relative `DATABASE_PATH` is resolved from wherever the host starts the server. Set it to the full path in `env`.' },
        { text: 'MCP cannot read SQLite databases', explanation: 'The server is ordinary Python, so it can read any database Python can.' },
        { text: 'The model refused to share the totals', explanation: 'The tool result itself was empty, before the model saw it.' },
        { text: 'get_totals needs to be called twice', explanation: 'One call reads the database. The problem is which database file it opened.' },
      ],
      answer: 0,
    },
    {
      question: 'Which situation best justifies adding an MCP server to Study Tracker?',
      options: [
        { text: 'You want Study Tracker\'s own `/assistant` endpoint to call its tools', explanation: 'One app calling its own model is simpler with plain tool calling.' },
        { text: 'You want the model to give smarter answers', explanation: 'MCP connects tools to apps. It does not change how capable the model is.' },
        { text: 'You want replies to arrive faster', explanation: 'An extra protocol layer adds steps, not speed.' },
        { text: 'You want to log sessions from both your code editor\'s AI assistant and a desktop chat app', explanation: 'Several apps sharing the same tools is exactly what the standard is for.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'MCP lets you describe your tools once in a small server so any MCP-capable app can use them, which is worth it when several apps need the same tools, as long as you use full paths, raise clear errors and only trust servers you would trust as programs.',
  resources: [
    { title: 'What is the Model Context Protocol?', provider: 'Model Context Protocol', description: 'The official introduction to MCP, its architecture and the apps that support it.', url: 'https://modelcontextprotocol.io/docs/getting-started/intro' },
    { title: 'MCP Python SDK', provider: 'Model Context Protocol', description: 'The official documentation for the SDK used in this lesson, including testing and deployment.', url: 'https://py.sdk.modelcontextprotocol.io/' },
    { title: 'MCP Inspector', provider: 'GitHub', description: 'A browser-based test host for calling a server\'s tools by hand.', url: 'https://github.com/modelcontextprotocol/inspector' },
    { title: 'MCP specification', provider: 'Model Context Protocol', description: 'The full protocol, for when you want to see exactly what is sent.', url: 'https://modelcontextprotocol.io/specification/latest' },
  ],
  underTheHood: {
    heading: 'What travels between a host and a server',
    paragraphs: [
      "MCP messages use JSON-RPC, a simple format in which each request is a JSON object naming a method and its parameters, plus an `id` so the reply can be matched to it. A tool call from a host looks like this: `{\"jsonrpc\": \"2.0\", \"id\": 7, \"method\": \"tools/call\", \"params\": {\"name\": \"get_totals\", \"arguments\": {}}}`.",
      "A connection follows a fixed order. First an `initialize` exchange, where both sides agree on a protocol version and say what they support. Then `tools/list`, which returns every tool's name, description and input schema. Then any number of `tools/call` requests, each answered with the tool's content, an optional structured result and an `isError` flag.",
      "Over stdio, these messages are the only thing allowed on the server's standard output. That is why a stray `print()` in a stdio server could corrupt the stream, and why servers log to standard error instead, as Python's `logging` does by default. The official SDK now guards against most accidental prints, but logging remains the safe habit.",
    ],
  },
}

export default lesson
