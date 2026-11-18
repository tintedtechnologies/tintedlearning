import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain what HTTPS protects and what it does not protect',
    'Describe how a certificate proves that a server is the site it claims to be',
    'Recognize the warning signs of a certificate problem before you enter a password',
  ],
  bigIdea: 'HTTPS encrypts the traffic between your device and a website, so people on the same network cannot read or change it. A certificate issued by a trusted authority proves that the server really belongs to the name you typed. Encryption protects the conversation, and the certificate tells you who you are talking to.',
  whyItMatters: 'A café offers free Wi-Fi with a login page. A visitor enters an email password on a page that looks right, but the address starts with http and the browser shows a warning about the certificate. The page was a copy set up on the café network. Knowing what HTTPS and certificates do is what lets the visitor stop before the password is sent.',
  goalSections: [
    {
      heading: 'What encryption protects',
      paragraphs: [
        'Without HTTPS, data travels across the network as plain text. Anyone on the same network, such as the café Wi-Fi or a router along the way, could read it or change it. A password, a message, or a payment sent this way is exposed.',
        'HTTPS, which is HTTP over TLS, wraps the traffic in encryption. The data can still be seen to be going to a certain server, and the size of each message can sometimes be guessed. What it hides is the content, and it also detects if someone changes the content in transit.',
        'Encryption is not the same as trust. A fully encrypted connection to a fake site is still a connection to a fake site. Encryption protects the wire. Something else is needed to check the identity of the server at the other end.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Plain HTTP:   password=hunter2 travels as readable text
          HTTPS (TLS):  the same data travels as unreadable ciphertext
          HTTPS does not tell you whether the site itself is genuine.
        `,
      },
    },
    {
      heading: 'Certificates: proving who the server is',
      paragraphs: [
        'A certificate is a signed document. It names a domain, such as example.com, holds the server\'s public key, and says when it is valid. A trusted certificate authority signs it after checking that the requester controls that domain.',
        'Your browser and operating system keep a list of trusted authorities. When you connect, the server presents its certificate. The browser checks three things: the name matches the address you typed, the date is valid, and the signature comes from an authority on the trusted list.',
        'If any check fails, the browser warns you. The warning is a signal that the server cannot prove its identity. Do not click through it on a page where you enter a password or payment details. Close the page and type the address yourself, or use a known bookmark.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          certificate = {"name": "bank.example", "valid": True, "signed_by_trusted_authority": True}
          typed = "bank.example"
          ok = certificate["name"] == typed and certificate["valid"] and certificate["signed_by_trusted_authority"]
          print("trust this page" if ok else "do not enter a password")
        `,
        output: 'trust this page',
      },
    },
    {
      heading: 'Warning signs and safe habits',
      paragraphs: [
        'Check the address bar. Look at the domain name carefully, because attackers use names that look similar, such as paypa1 with a number one, or a long name that hides the real domain at the end. Read the host name from right to left: the end of it, just before the first slash, is the domain that matters, and every label to its left can be chosen by anyone.',
        'Be wary of a certificate warning, an expired certificate, or a name that does not match. A site that asks for a password after a warning is a common trap. A legitimate service will not ask you to accept a broken certificate to log in.',
        'Use a password manager. It fills in a password only on the exact domain it was saved for, so a copy of the page on another name will not receive it. That simple check blocks many phishing attempts.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          https://bank.example/login               real domain: bank.example
          https://bank.example.login-check.net/      real domain: login-check.net
          https://bank-example.net/login             real domain: bank-example.net, not bank.example
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a certificate before entering a password',
    intro: 'The program below checks three things a browser checks: the name matches, the certificate is valid, and it was signed by a trusted authority. Run it, then change the typed name to a lookalike and predict the result.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        certificate = {"name": "bank.example", "valid": True, "signed_by_trusted_authority": True}
        typed = "bank-example.net"

        checks = {
            "name matches": certificate["name"] == typed,
            "certificate is valid": certificate["valid"],
            "signed by a trusted authority": certificate["signed_by_trusted_authority"],
        }
        for check, passed in checks.items():
            print(check, "-", "yes" if passed else "no")
        print("safe to enter a password" if all(checks.values()) else "stop: do not enter a password")
      `,
      output: 'name matches - no\ncertificate is valid - yes\nsigned by a trusted authority - yes\nstop: do not enter a password',
    },
    steps: [
      { code: 'certificate = {...}', explanation: 'The details the server presented, in a form that can be checked.' },
      { code: 'checks = {...}', explanation: 'Each check a browser makes is written as a named yes or no, so none is skipped.' },
      { code: 'print("safe to enter a password" if all(checks.values()) else ...)', explanation: 'Every check must pass. One failure is enough to stop, which is the safe default.' },
    ],
  },
  tryIt: {
    instructions: [
      'Open a secure website you use and click the padlock or site information. Find the name on the certificate and the date it expires.',
      'Change the typed name in the example to bank.example and predict the output. Then try a lookalike name of your own.',
      'Write a rule you will follow for certificate warnings on a site where you would enter a password.',
    ],
  },
  mistakes: [
    { mistake: 'Believing a padlock means the site is trustworthy.', fix: 'The padlock means the connection is encrypted. Check the exact domain name too.' },
    { mistake: 'Clicking through a certificate warning to log in.', fix: 'Close the page and go to the site by an address you know is correct.' },
    { mistake: 'Reading only the start of a long domain name.', fix: 'Read the host name from the right. The domain at its end, just before the first slash, is the one that matters.' },
  ],
  quiz: [
    {
      question: 'What does HTTPS protect?',
      options: [
        { text: 'The content of the traffic between your device and the server', explanation: 'Yes. Encryption hides the content from anyone watching the network.' },
        { text: 'Your computer from every virus', explanation: 'HTTPS protects traffic, not every risk on your computer.' },
        { text: 'The website from ever being hacked', explanation: 'HTTPS does not secure the server itself.' },
        { text: 'The domain name from being registered by someone else', explanation: 'HTTPS does not control who owns a domain.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print when the typed name is "bank.example"?',
      code: { language: 'python', runnable: true, code: code`
        certificate = {"name": "bank.example", "valid": True}
        typed = "bank.example"
        print("trust" if certificate["name"] == typed and certificate["valid"] else "do not enter a password")
      ` },
      options: [
        { text: 'trust', explanation: 'Yes. The name matches and the certificate is marked valid.' },
        { text: 'do not enter a password', explanation: 'Both checks pass here, so the page is not blocked.' },
        { text: 'bank.example', explanation: 'The program prints a decision, not the name.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'In the address https://bank.example.com.evil-site.net/login, which domain does the site actually belong to?',
      options: [
        { text: 'bank.example.com', explanation: 'That is the text at the front of the name. Anyone can put a name like this on the front of their own domain.' },
        { text: 'evil-site.net', explanation: 'Yes. The domain belongs to whoever owns the name at the end, just before the path.' },
        { text: 'login', explanation: 'The login is a path on the site, not the name of the site.' },
        { text: 'https', explanation: 'https is the protocol, not the site name.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'HTTPS encrypts the conversation and a valid certificate tells you the server is who it claims to be, so check the exact domain and never enter a password past a certificate warning.',
  resources: [
    { title: 'How HTTPS works', provider: 'Cloudflare', description: 'A plain explanation of TLS, encryption, and certificates for everyday readers.', url: 'https://www.cloudflare.com/learning/ssl/what-is-https/' },
    { title: 'Avoiding phishing scams', provider: 'CISA', description: 'Practical guidance on spotting fake login pages and suspicious links.', url: 'https://www.cisa.gov/' },
  ],
}

export default lesson
