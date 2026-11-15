import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Describe an API request and response: address, method, status code and body',
    'Turn JSON text into Python dictionaries and lists and pull out the values you need',
    'Keep an API key out of your code by reading it from an environment variable',
  ],
  bigIdea: "An API, short for application programming interface, is a way for one program to ask another for data or to do something, usually over the internet. Your code sends a request to a web address and gets back a response, most often written in a text format called JSON. Python turns that JSON into dictionaries and lists you already know how to use.",
  whyItMatters: "Say you want a script that texts you each morning if it will rain. You are not going to run your own weather satellites. A weather service offers an API: send it a city, and it sends back the forecast. Almost every AI feature works the same way, because calling a hosted language model is just another API request, with a secret key that must never end up in your code.",
  goalSections: [
    {
      heading: 'Requests and responses',
      paragraphs: [
        "A request has an address, called a URL or endpoint, such as `https://api.example.com/forecast`. It has a method: `GET` asks for data and `POST` sends data. Extra details, like which city you want, go in parameters or in the request body.",
        "The response comes back with a status code, a number that says how it went. 200 means OK. Codes in the 400s mean your request was wrong: 401 means you are not authorized, 404 means not found, 429 means you sent too many requests. Codes in the 500s mean the server had a problem.",
        "In Python, the popular `requests` package sends requests. Always set a `timeout`, so your program does not hang forever if the server never answers. The example below needs the internet and the `requests` package, so it will not run in the browser playground.",
      ],
      example: {
        language: 'python',
        runnable: false,
        code: code`
          import requests

          response = requests.get(
              "https://api.example.com/forecast",
              params={"city": "Lagos"},
              timeout=10,
          )
          print(response.status_code)
          data = response.json()
        `,
      },
    },
    {
      heading: 'Reading JSON in Python',
      paragraphs: [
        "JSON, short for JavaScript Object Notation, is text that looks almost exactly like Python dictionaries and lists. Curly brackets hold key and value pairs, square brackets hold lists. The `json` module's `json.loads()` turns JSON text into Python objects.",
        "Real responses are nested: a dictionary containing a list of dictionaries. Walk into them one step at a time, such as `data[\"daily\"][0][\"high\"]`. When a field might be missing, use `.get()` with a default so one absent field does not crash your program.",
        "To build the message you print, an f-string is handy. Put `f` before the quotes and write any value inside curly brackets: `f\"{city} is {temp}C\"` fills in both variables.",
      ],
      example: {
        language: 'python',
        code: code`
          import json

          body = '{"city": "Lagos", "daily": [{"high": 31}, {"high": 30}]}'
          data = json.loads(body)

          print(type(data))
          print(data["daily"][0]["high"])
          print(data.get("country", "not given"))
          print(f"{data['city']} has {len(data['daily'])} days of forecast")
        `,
        output: "<class 'dict'>\n31\nnot given\nLagos has 2 days of forecast",
      },
    },
    {
      heading: 'Keeping API keys secret',
      paragraphs: [
        "Most APIs need a key: a long secret string that proves who is calling and gets billed for it. Anyone who sees your key can use it as you, and run up your bill.",
        "So never type a key into your code. People accidentally publish keys on GitHub every day, and automated bots find them within minutes. Instead, store the key in an environment variable, a named value kept by your operating system outside your code, and read it with `os.environ.get()`.",
        "For local projects, people often keep keys in a file called `.env` and load it with a package such as `python-dotenv`. Add `.env` to `.gitignore` so it is never committed.",
      ],
      example: {
        language: 'python',
        code: code`
          import os

          api_key = os.environ.get("WEATHER_API_KEY")

          if api_key is None:
              print("Set WEATHER_API_KEY before running.")
          else:
              print("Key loaded, ending in", api_key[-4:])
        `,
        output: 'Set WEATHER_API_KEY before running.',
      },
    },
  ],
  seeItInAction: {
    title: 'A reusable function that reads a forecast response',
    intro: "This function takes a response's status code and body, checks them, and returns a sentence. It is tested here on three saved responses, so it runs anywhere. In a real app you would pass in `response.status_code` and `response.text`.",
    example: {
      language: 'python',
      code: code`
        import json

        def describe_forecast(status, body):
            if status != 200:
                return f"Request failed with status {status}"
            data = json.loads(body)
            city = data.get("city", "unknown city")
            days = data.get("daily", [])
            if not days:
                return f"No forecast for {city}"
            today = days[0]
            return f"{city}: high of {today['high']}C, {today['rain']}% chance of rain"

        good = '{"city": "Lagos", "daily": [{"high": 31, "rain": 60}]}'
        print(describe_forecast(200, good))
        print(describe_forecast(200, '{"city": "Oslo"}'))
        print(describe_forecast(429, ""))
      `,
      output: 'Lagos: high of 31C, 60% chance of rain\nNo forecast for Oslo\nRequest failed with status 429',
    },
    steps: [
      { code: 'def describe_forecast(status, body):', explanation: "Wrapping the logic in a function means every part of your app handles responses the same way, and you can test it without the internet." },
      { code: 'if status != 200:\n    return f"Request failed with status {status}"', explanation: "Check the status before touching the body. A 429 or 500 response may not contain JSON at all." },
      { code: 'data = json.loads(body)', explanation: "Turns the JSON text into a Python dictionary." },
      { code: 'days = data.get("daily", [])\nif not days:', explanation: "The Oslo response has no `daily` field. `.get` returns an empty list instead of crashing, and `if not days` catches it." },
      { code: "today = days[0]", explanation: "The first day in the list is today. Walking into nested data one step at a time keeps each line readable." },
      { code: 'print(describe_forecast(429, ""))', explanation: "Too many requests. The function returns a clear message instead of crashing on an empty body." },
    ],
  },
  tryIt: {
    instructions: [
      'Run the code in the playground.',
      'Add `"rain": 85` to a second day in the Lagos response. Predict whether the output changes, then run it.',
      'Remove `"rain": 60` from the Lagos response. Predict what happens, then change the function to use `today.get(\'rain\', \'unknown\')` so it copes.',
    ],
    playground: 'python',
    starterCode: code`
      import json

      def describe_forecast(status, body):
          if status != 200:
              return f"Request failed with status {status}"
          data = json.loads(body)
          city = data.get("city", "unknown city")
          days = data.get("daily", [])
          if not days:
              return f"No forecast for {city}"
          today = days[0]
          return f"{city}: high of {today['high']}C, {today['rain']}% chance of rain"

      good = '{"city": "Lagos", "daily": [{"high": 31, "rain": 60}]}'
      print(describe_forecast(200, good))
      print(describe_forecast(200, '{"city": "Oslo"}'))
      print(describe_forecast(429, ""))
    `,
  },
  mistakes: [
    { mistake: 'Pasting an API key directly into your code.', fix: 'Read it from an environment variable, and keep `.env` files out of version control with `.gitignore`.' },
    { mistake: 'Reading the body without checking the status code.', fix: 'Check for 200 first. Error responses often have a different shape, or no JSON at all.' },
    { mistake: 'Calling an API with no timeout.', fix: 'Always pass `timeout=` so a slow or dead server cannot freeze your program.' },
    { mistake: 'Assuming every field is always present.', fix: 'Use `.get()` with a sensible default for any field the API documentation says is optional.' },
  ],
  quiz: [
    {
      question: 'Your request comes back with status 401. What is the most likely cause?',
      options: [
        { text: 'The server crashed', explanation: 'Server problems use codes in the 500s.' },
        { text: 'Your API key is missing or wrong', explanation: '401 means unauthorized: the server does not accept who you say you are. Check that the key was loaded.' },
        { text: 'The data you asked for does not exist', explanation: 'That is usually 404, not found.' },
        { text: 'Everything worked', explanation: 'Success is 200. Anything in the 400s means the request had a problem.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this code print?',
      code: { language: 'python', code: code`
        import json

        data = json.loads('{"user": {"name": "Ana", "tags": ["admin", "beta"]}}')
        print(data["user"]["tags"][1])
      ` },
      options: [
        { text: 'admin', explanation: 'That is index 0. Lists count from 0, so index 1 is the second tag.' },
        { text: 'Ana', explanation: 'The code walks into `tags`, not `name`.' },
        { text: '["admin", "beta"]', explanation: 'The final `[1]` picks one item out of the list.' },
        { text: 'beta', explanation: 'Into `user`, then into its `tags` list, then the item at index 1.' },
      ],
      answer: 3,
      answerIsOutput: true,
    },
    {
      question: 'You want to share your project on GitHub, and it uses an API key. What should you do?',
      options: [
        { text: 'Read the key from an environment variable and add `.env` to `.gitignore`', explanation: 'The code works for anyone who sets their own key, and your key never leaves your computer.' },
        { text: 'Put the key in the code but make the repository private', explanation: 'Private repositories get shared, forked and made public by mistake. The key should never be in the code.' },
        { text: 'Split the key into two variables so bots cannot spot it', explanation: 'Anyone reading the code can join them back together. Hiding is not the same as keeping it out.' },
        { text: 'Write the key in a comment instead of a variable', explanation: 'Comments are published along with the code, so the key is just as exposed.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Send requests with a timeout, check the status before reading the JSON body, use `.get()` for optional fields, and keep keys in environment variables.',
  resources: [
    { title: 'Requests quickstart', provider: 'Requests', description: 'How to send requests, pass parameters and read JSON with Python.', url: 'https://requests.readthedocs.io/en/latest/user/quickstart/' },
    { title: 'HTTP response status codes', provider: 'MDN Web Docs', description: 'What every status code means, with examples.', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
  ],
  underTheHood: {
    heading: 'Retries and backoff',
    paragraphs: [
      "Networks fail in passing. A request can time out, or a server can reply 503 because it is briefly overloaded. Trying once and giving up makes your program fragile, but retrying instantly in a tight loop makes things worse, because thousands of clients hammering a struggling server keep it down.",
      "The standard answer is exponential backoff. Wait 1 second before the first retry, then 2, then 4, doubling each time, and give up after a few attempts. Adding a little randomness to each wait, called jitter, stops all clients retrying at the same moment.",
      "Only retry requests that are safe to repeat. Fetching a forecast twice is harmless. Sending a payment twice is not, which is why payment APIs ask you to attach a unique idempotency key: if the same key arrives twice, the server knows it is a retry and does the work only once.",
    ],
  },
}

export default lesson
