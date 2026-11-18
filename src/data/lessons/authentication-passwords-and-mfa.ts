import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why passwords should be stored as salted, slow hashes, never as plain text',
    'Compare multi-factor methods, and explain why phishing-resistant options are stronger',
    'Describe the login protections an app needs: rate limits, clear errors, and safe recovery',
  ],
  bigIdea: 'Authentication proves that a person is who they claim to be. Passwords are the weakest common method, so a secure system stores them in a way that stays safe after a leak, adds a second factor, and limits guessing. The aim is that a stolen password alone is not enough to get in.',
  whyItMatters: 'A website stores its users\' passwords as plain text in a database. A backup file leaks, and every account is exposed on other sites too, because people reuse passwords. If the site had stored salted hashes and required a second factor, the leak would have been far less harmful. The decisions that prevent this happen before the first user signs up.',
  goalSections: [
    {
      heading: 'Storing passwords safely',
      paragraphs: [
        'Never store a password as plain text. Store a hash instead, which is a one-way transformation: you can check a password against it, but you cannot recover the password from it. A good hash is designed to be slow, because a slow hash makes guessing millions of passwords expensive for an attacker.',
        'A salt is a random value added to each password before hashing. Two users with the same password get different hashes, so an attacker cannot use one precomputed table for every account. The salt is stored with the hash and does not need to be secret.',
        'Use a standard algorithm built for passwords, such as Argon2, scrypt, bcrypt, or PBKDF2, and use the library that comes with your framework rather than writing your own. Ordinary fast hashes like plain SHA-256 are the wrong tool for passwords, because they are too quick to guess against.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import hashlib
          import hmac

          salt = b"demo-salt-for-this-example"
          stored = hashlib.pbkdf2_hmac("sha256", b"correct horse", salt, 100_000)

          def check(attempt):
              candidate = hashlib.pbkdf2_hmac("sha256", attempt.encode(), salt, 100_000)
              return hmac.compare_digest(candidate, stored)

          print(check("correct horse"))
          print(check("battery staple"))
        `,
        output: 'True\nFalse',
      },
    },
    {
      heading: 'Multi-factor login',
      paragraphs: [
        'Multi-factor authentication asks for a second kind of proof. The three common kinds are something you know, such as a password, something you have, such as a phone or security key, and something you are, such as a fingerprint. Two kinds together are much harder to fake than one.',
        'Not all second factors are equal. A one-time code sent by text message can be stolen by a fake login page that relays it in real time. Authenticator apps are better. Passkeys and hardware security keys are phishing-resistant, because they check the website address before they respond, so a copy of the page on another domain gets nothing useful.',
        'Offer phishing-resistant options first, and make the second factor easy to set up. Give users recovery codes at setup time, and store them somewhere safe, because a locked-out user will otherwise look for a shortcut.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Factor 1, something you know: the password.
          Factor 2, something you have: a passkey on your phone, or a security key you plug in.
          A stolen password alone fails. A fake page can ask for a code, but a passkey will not respond to a page on another domain.
        `,
      },
    },
    {
      heading: 'Protecting the login itself',
      paragraphs: [
        'Limit the number of attempts. Repeated guesses against one account, or many guesses across many accounts, should slow down or lock out the attacker. Rate limits should count both per account and per address, so an attacker cannot simply rotate through either one.',
        'Make error messages the same whether the username or the password was wrong. A message that says "no account with that email" tells an attacker which emails are registered. Use one general message and let the rate limit do the protecting.',
        'Treat password reset as a login. A reset link sent to an email address that has been hijacked gives the attacker the account, so reset links should expire quickly, be used once, and trigger a notice to the account owner.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Attempts: five failures for one account in ten minutes slows the next try.
          Errors: "email or password is wrong" for every failed login, never "no account with that email".
          Reset: a link that expires in fifteen minutes, works once, and sends a notice to the account owner.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Checking a password against its stored hash',
    intro: 'The program above stores one salted hash and checks two attempts against it. The comparison uses a constant-time function, so the time taken does not reveal how much of the hash matched. Run it, then change the salt and predict what happens to the first check.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        import hashlib
        import hmac

        def hash_password(password, salt):
            return hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 100_000)

        salt = b"user-42-salt"
        stored = hash_password("S3cure-passphrase", salt)

        attempts = ["S3cure-passphrase", "password123"]
        for attempt in attempts:
            ok = hmac.compare_digest(hash_password(attempt, salt), stored)
            print(attempt, "accepted" if ok else "rejected")
      `,
      output: 'S3cure-passphrase accepted\npassword123 rejected',
    },
    steps: [
      { code: 'def hash_password(password, salt):', explanation: 'A slow, salted hash. The same password with a different salt produces a different value.' },
      { code: 'stored = hash_password("S3cure-passphrase", salt)', explanation: 'Only the hash is kept, never the password itself.' },
      { code: 'hmac.compare_digest(...)', explanation: 'Compares the two values in a way that takes the same time whether they match or not.' },
    ],
  },
  tryIt: {
    instructions: [
      'Check the login settings of one account you use. Write down which second factors it offers, and whether a passkey or security key is among them.',
      'Change the salt in the seItInAction example and predict whether the first attempt is still accepted. Run it to check.',
      'Write the message a login page should show for a wrong password, and one reason it should not say which part was wrong.',
    ],
  },
  mistakes: [
    { mistake: 'Storing passwords as plain text or with a fast hash such as SHA-256 alone.', fix: 'Use a password hashing function such as Argon2, scrypt, bcrypt, or PBKDF2 with a unique salt.' },
    { mistake: 'Relying on SMS codes as the only second factor.', fix: 'Offer authenticator apps, passkeys, or security keys, and treat SMS as the weakest option.' },
    { mistake: 'Telling people which email addresses have accounts.', fix: 'Use one general error message and limit attempts.' },
  ],
  quiz: [
    {
      question: 'Why is a salt added to each password before hashing?',
      options: [
        { text: 'So two users with the same password get different hashes, which defeats precomputed tables', explanation: 'Yes. A unique salt stops one table of hashes from working against every account.' },
        { text: 'So the password can be recovered later', explanation: 'A hash is one-way. The salt does not make it reversible.' },
        { text: 'So the password becomes longer for the user', explanation: 'The salt is added inside the hashing step. The user never types it.' },
        { text: 'So the login page runs faster', explanation: 'Salting adds a little work. Its purpose is protection, not speed.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for a wrong attempt?',
      code: { language: 'python', runnable: true, code: code`
        import hashlib
        import hmac
        salt = b"s"
        stored = hashlib.pbkdf2_hmac("sha256", b"right", salt, 1000)
        attempt = hashlib.pbkdf2_hmac("sha256", b"wrong", salt, 1000)
        print("accepted" if hmac.compare_digest(attempt, stored) else "rejected")
      ` },
      options: [
        { text: 'accepted', explanation: 'The two hashes come from different passwords, so they do not match.' },
        { text: 'rejected', explanation: 'Yes. The attempt hashes to a different value, so the check fails.' },
        { text: 'right', explanation: 'The program prints the decision, not the stored password.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 1,
      answerIsOutput: true,
    },
    {
      question: 'Which second factor is most resistant to a fake login page?',
      options: [
        { text: 'A code sent by text message', explanation: 'A fake page can ask for the code and pass it on in real time.' },
        { text: 'A passkey or hardware security key', explanation: 'These check the website address, so a copy of the page on another domain receives nothing useful.' },
        { text: 'A security question about a pet', explanation: 'Answers to such questions are often guessable or public.' },
        { text: 'No second factor', explanation: 'Having no second factor leaves the login exposed to a stolen password.' },
      ],
      answer: 1,
    },
  ],
  takeaway: 'Store passwords as unique salted hashes from a slow, purpose-built function, add a phishing-resistant second factor, and limit guessing without revealing which accounts exist.',
  resources: [
    { title: 'Digital Identity Guidelines', provider: 'NIST', description: 'NIST SP 800-63B, the standard guidance on passwords, authenticators, and multi-factor login.', url: 'https://pages.nist.gov/800-63-4/sp800-63b.html' },
    { title: 'Password Storage Cheat Sheet', provider: 'OWASP', description: 'Practical guidance on password hashing, salts, and algorithm choice.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
  ],
}

export default lesson
