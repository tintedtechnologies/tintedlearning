import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe what happens when a browser or app sends a request',
    'Read a request and a response: method, path, status code, headers and JSON body',
    'Explain the common status codes: 200, 201, 400, 401, 404 and 500',
  ],
  bigIdea: "Apps talk to servers by sending short text messages called requests and getting responses back. The rules for those messages are HTTP, short for Hypertext Transfer Protocol. Once you can read a request and a response, you can understand and debug any web app, including the Study Tracker API you will build next.",
  whyItMatters: "Your Study Tracker app shows \"Something went wrong\" when you save a session. Is the server down? Is your data invalid? Are you not logged in? The response already contains the answer, in a three-digit status code and a short message. Developers who read it fix the problem in minutes. Everyone else guesses.",
  goalSections: [
    {
      heading: 'The journey of a request',
      paragraphs: [
        "The app that sends a request is called the client: a browser, a phone app or a Python script. The program that answers is the server. A URL, such as `https://api.example.com/sessions`, says which server to contact and which resource you want.",
        "First, the client looks up the server's IP address through DNS, the internet's address book. Then it opens a connection. With `https`, that connection is encrypted, so nobody in between can read it. With plain `http`, everything travels as readable text.",
        "The client sends the request. The server runs some code, often reading or writing a database, and sends back a response. Then the client decides what to show you. Every click that loads data repeats this round trip.",
      ],
      example: {
        language: 'text',
        code: code`
          Study Tracker app                            Study Tracker server
          1. look up api.example.com in DNS  -> 203.0.113.10
          2. open an encrypted connection    ------------------>
          3. send:  GET /sessions            ------------------>
                                                       4. read sessions from the database
          5. receive: 200 OK + JSON list     <------------------
          6. show the list on screen
        `,
      },
    },
    {
      heading: 'Reading a request and a response',
      paragraphs: [
        "A request starts with a method and a path. The method says what you want to do: `GET` reads data, `POST` creates something, `PUT` or `PATCH` updates, `DELETE` removes. The path, like `/sessions`, says which resource.",
        "Headers come next: extra details written as `name: value` lines, such as `Content-Type: application/json`, which says the body is JSON. JSON, short for JavaScript Object Notation, is the text format you met in Python's APIs lesson. Finally comes the body, the data itself. `GET` requests have no body.",
        "A response has the same shape: a status line with a number and a short phrase, headers, then a body.",
      ],
      example: {
        language: 'text',
        code: code`
          POST /sessions HTTP/1.1                       <- method, path, version
          Host: 127.0.0.1:8000                          <- header: which server
          Content-Type: application/json                <- header: the body is JSON

          {"subject": "algebra", "minutes": 40, "studied_on": "2026-03-02"}

          HTTP/1.1 201 Created                          <- status code and phrase
          content-type: application/json

          {"subject":"algebra","minutes":40,"studied_on":"2026-03-02","id":1}
        `,
      },
    },
    {
      heading: 'Status codes',
      paragraphs: [
        "The status code tells you how it went before you read anything else. The first digit is the group: 2 means success, 4 means the client sent something wrong, 5 means the server failed.",
        "Learn these six first. 200 OK: it worked. 201 Created: it worked and something new was made. 400 Bad Request: the request itself was wrong. 401 Unauthorized: the server does not know who you are, so log in. 404 Not Found: there is nothing at that path. 500 Internal Server Error: the server's own code crashed, and resending will not help.",
        "Two more you will meet soon: 403 Forbidden means the server knows who you are but you are not allowed, and 422 is what FastAPI returns when the data has the wrong shape, such as text where a number belongs.",
      ],
      example: {
        language: 'text',
        code: code`
          Code  Meaning                   What to do
          200   OK                        use the body
          201   Created                   the new item is in the body
          400   Bad Request               fix what you sent
          401   Unauthorized              log in, or check your key
          403   Forbidden                 you are known but not allowed
          404   Not Found                 check the path or the ID
          500   Internal Server Error     the server has a bug: report it
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'One GET /sessions request, end to end',
    intro: "Here is a real exchange with the Study Tracker API you will build in the next lesson, captured with `curl -i`, which shows the response headers as well as the body.",
    example: {
      language: 'text',
      code: code`
        $ curl -i http://127.0.0.1:8000/sessions
        HTTP/1.1 200 OK
        date: Mon, 02 Mar 2026 18:30:00 GMT
        server: uvicorn
        content-length: 67
        content-type: application/json

        [{"subject":"algebra","minutes":40,"studied_on":"2026-03-02","id":1}]
      `,
    },
    steps: [
      { code: 'curl -i http://127.0.0.1:8000/sessions', explanation: "`curl` sends a request from the terminal. With no other options it uses `GET`. `127.0.0.1` means this same computer, and `8000` is the port the server is listening on. `-i` asks curl to include the response headers." },
      { code: 'HTTP/1.1 200 OK', explanation: "The status line. 200 means the request worked. Always read this line first." },
      { code: 'date: ...\nserver: uvicorn', explanation: "Headers that say when the response was sent and which server software sent it. Study Tracker runs on Uvicorn, as you will see in the next lesson." },
      { code: 'content-length: 67\ncontent-type: application/json', explanation: "The body is 67 bytes long and is JSON, so the client knows how to read it." },
      { code: '[{"subject":"algebra","minutes":40,"studied_on":"2026-03-02","id":1}]', explanation: "The body: a JSON list with one session. The square brackets mean list, and each curly-bracket object is one session with its four fields." },
    ],
  },
  tryIt: {
    instructions: [
      'In a terminal, run `curl -i https://jsonplaceholder.typicode.com/todos/1`, a free public test API. On Windows, type `curl.exe` instead of `curl`.',
      'Find the status line, the `content-type` header and the JSON body. Write down what each one tells you.',
      'Run it again with `/todos/99999` at the end. Predict the status code before you look.',
      'Do the same in Python: `python -m pip install requests`, then `response = requests.get("https://jsonplaceholder.typicode.com/todos/1", timeout=10)` and print `response.status_code`, `response.headers["content-type"]` and `response.json()`.',
    ],
  },
  mistakes: [
    { mistake: 'Treating every non-200 response as "the server is broken".', fix: 'Read the first digit. A 4xx code means fix the request you sent. Only a 5xx code means the server failed.' },
    { mistake: 'Mixing up 401 and 403.', fix: '401 means the server does not know who you are. 403 means it knows, and the answer is no.' },
    { mistake: 'Sending data in a GET request.', fix: 'GET reads. Send new data with POST and a JSON body. Many servers and tools ignore a GET body entirely.' },
    { mistake: 'Sending passwords or personal data over plain `http`.', fix: 'Anyone on the network can read plain HTTP. Use `https` for anything real. Plain `http` is fine only on your own computer, like `127.0.0.1`.' },
  ],
  quiz: [
    {
      question: 'Your API returns status 404. What does that most likely mean?',
      options: [
        { text: 'The server crashed', explanation: 'A crash is a 500-range code. 404 means the server ran fine but found nothing.' },
        { text: 'You need to log in', explanation: 'That is 401. A 404 is about the path, not about who you are.' },
        { text: 'Nothing exists at that path, so check the URL or the ID', explanation: 'Not Found usually means a typo in the path, or an ID that does not exist.' },
        { text: 'The request worked but returned no data', explanation: 'A successful request with an empty result is still a 200, often with `[]` as the body.' },
      ],
      answer: 2,
    },
    {
      question: 'You send `POST /sessions` with a new session and get back status 201. What happened?',
      options: [
        { text: 'The session was created, and the new item is usually in the response body', explanation: '201 Created is the standard reply when a POST makes something new.' },
        { text: 'The request was received but has not been processed yet', explanation: 'That is 202 Accepted, which is used for slow background work.' },
        { text: 'Something went wrong, because only 200 means success', explanation: 'Every code in the 200s means success. 201 is more specific than 200.' },
        { text: 'The session already existed', explanation: 'A duplicate would usually be a 4xx error, such as 409 Conflict.' },
      ],
      answer: 0,
    },
    {
      question: 'You are logged in to a school portal, but opening another student\'s grades returns an error. Which status code fits best?',
      options: [
        { text: '401 Unauthorized', explanation: 'You are logged in, so the server knows who you are. 401 means it does not.' },
        { text: '500 Internal Server Error', explanation: 'Nothing crashed. The server made a deliberate decision.' },
        { text: '404 Not Found', explanation: 'Some servers do hide private pages this way, but the standard code for "known, but not allowed" is 403.' },
        { text: '403 Forbidden', explanation: 'The server knows exactly who you are and refuses because you lack permission.' },
      ],
      answer: 3,
    },
  ],
  takeaway: 'Every web request is a method, a path, headers and an optional body, and every response starts with a status code that tells you whether to fix your request or report a server problem.',
  resources: [
    { title: 'An overview of HTTP', provider: 'MDN Web Docs', description: 'A clear reference on requests, responses and how the web uses them.', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
    { title: 'HTTP response status codes', provider: 'MDN Web Docs', description: 'Every status code with a short description.', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
  ],
  underTheHood: {
    heading: 'What the s in https does',
    paragraphs: [
      "HTTPS is HTTP sent inside an encrypted connection set up by a protocol called TLS, short for Transport Layer Security. Before any request is sent, the client and server agree on encryption keys in a short exchange called a handshake.",
      "During the handshake, the server presents a certificate: a file that says \"I am api.example.com\", signed by a certificate authority that browsers and operating systems already trust. The client checks the signature and the name. If they do not match, the browser shows a warning page and refuses to continue, because someone may be pretending to be the server.",
      "After that, every request and response travels encrypted. People on the same cafe Wi-Fi can see which server you connected to, but not the path, the headers or the body. That is why passwords, keys and personal data must only ever travel over HTTPS.",
    ],
  },
}

export default lesson
