import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain the difference between encryption, hashing, and encoding',
    'Describe symmetric and asymmetric encryption, and where each is used',
    'Protect data in transit and at rest, and manage keys so that encryption actually helps',
  ],
  bigIdea: 'Encryption makes data unreadable to anyone without the key, hashing turns data into a fixed fingerprint that cannot be reversed, and encoding only changes the format so that it can be carried safely. Security depends on using the right one for the job and on keeping the keys secret, because encryption without good key management protects very little.',
  whyItMatters: 'A company stores customer records in a database file and encrypts the disk. A stolen laptop shows nothing useful. But the encryption key is saved in a text file next to the database, so anyone who copies the folder can read everything. The encryption worked, and the key handling failed. Knowing where keys live matters as much as choosing the algorithm.',
  goalSections: [
    {
      heading: 'Encoding, hashing, and encryption are different',
      paragraphs: [
        'Encoding changes the format of data so that it can travel through a system, such as Base64, which turns binary data into plain text characters. Anyone can decode it, and it gives no protection. Treat encoding as packaging, never as secrecy.',
        'Hashing turns data into a fixed-length fingerprint. The same input always gives the same output, and the process cannot be reversed. Hashing is used to check integrity, such as confirming a downloaded file matches the published fingerprint, and to store passwords safely.',
        'Encryption is reversible by design. With the right key, encrypted data becomes readable again. Without the key, it should be useless. Encryption protects confidentiality, which means keeping data secret from people who should not see it.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          import base64
          import hashlib

          message = "hello"
          print(base64.b64encode(message.encode()).decode())
          print(base64.b64decode("aGVsbG8=").decode())
          print(hashlib.sha256(message.encode()).hexdigest()[:8])
        `,
        output: 'aGVsbG8=\nhello\n2cf24dba',
      },
    },
    {
      heading: 'Symmetric and asymmetric keys',
      paragraphs: [
        'Symmetric encryption uses the same key to lock and unlock data. It is fast, so it protects large amounts of data such as files, disks, and the body of a connection. The difficulty is sharing the key safely with everyone who needs it.',
        'Asymmetric encryption uses a pair of keys: a public key that anyone can have and a private key that stays secret. Data encrypted with the public key can only be opened with the private key. It is slower, so it is usually used to set up a shared symmetric key, which then protects the rest of the conversation.',
        'Digital signatures use the same pair in reverse. A signature made with the private key can be checked with the public key, which proves who made it and that it has not changed. Software updates and certificates depend on this.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Symmetric (same key both ways): AES, used to encrypt a whole file or disk.
          Asymmetric (public and private keys): RSA or elliptic curve, used to share a symmetric key safely.
          Signature: the vendor signs an update with its private key, and every device checks it with the public key.
        `,
      },
    },
    {
      heading: 'Protecting data in transit and at rest',
      paragraphs: [
        'Data in transit is data moving across a network. Use TLS for every connection that carries personal data or passwords, as covered in the HTTPS lesson. A connection that is only partly encrypted, or that accepts an invalid certificate, is not protected.',
        'Data at rest is data stored on a disk, in a database, or in a backup. Encrypt it with keys that are stored separately from the data, in a key management service or a secure key store, rather than beside it. Rotate keys on a schedule and when someone with access leaves.',
        'Do not invent your own encryption. Use established libraries and well-known modes, because small mistakes in a home-made scheme can break it completely. Your job is to choose the right tool, use it correctly, and protect its keys.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          In transit: every page and API call uses HTTPS, with certificates checked.
          At rest: the database and backups are encrypted, and the key lives in a key management service.
          Rotation: the key is replaced on a schedule, and immediately if an administrator with access leaves.
        `,
      },
    },
  ],
  seeItInAction: {
    title: 'Seeing that a hash is not encryption',
    intro: 'The program below encodes a message and hashes it. The encoded text can be decoded by anyone, and the hash cannot be turned back into the message. Run it, then change the message and predict whether the encoded text or the hash changes its length.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        import base64
        import hashlib

        secret = "meet at noon"
        encoded = base64.b64encode(secret.encode()).decode()
        digest = hashlib.sha256(secret.encode()).hexdigest()

        print("encoded:", encoded)
        print("decoded by anyone:", base64.b64decode(encoded).decode())
        print("hash length:", len(digest))
      `,
      output: 'encoded: bWVldCBhdCBub29u\ndecoded by anyone: meet at noon\nhash length: 64',
    },
    steps: [
      { code: 'encoded = base64.b64encode(secret.encode()).decode()', explanation: 'Changes the format only. Anyone can reverse it with a standard function, so it is not secrecy.' },
      { code: 'print("decoded by anyone:", ...)', explanation: 'Shows that the encoded value is readable to any reader who knows the format.' },
      { code: 'digest = hashlib.sha256(...).hexdigest()', explanation: 'A fixed-length fingerprint. Its length does not depend on the message, and no function reverses it.' },
    ],
  },
  tryIt: {
    instructions: [
      'Find out whether the website you use most has a secure connection, and what kind of certificate it presents. Write down the name on the certificate.',
      'Change the message in the seItInAction example to a longer sentence and predict whether the hash length changes. Run it to check.',
      'List three places your own data is stored, such as a phone, a cloud account, or a backup, and write whether each is encrypted at rest.',
    ],
  },
  mistakes: [
    { mistake: 'Calling encoded or obfuscated data encrypted.', fix: 'Encoding is reversible by anyone. Use real encryption with a key for confidentiality.' },
    { mistake: 'Storing the encryption key next to the encrypted data.', fix: 'Keep keys in a key management service or secure key store, separate from the data.' },
    { mistake: 'Writing a custom encryption scheme.', fix: 'Use established libraries and standard modes, and follow their guidance exactly.' },
  ],
  quiz: [
    {
      question: 'Which operation can anyone reverse without a secret?',
      options: [
        { text: 'Encryption with a key', explanation: 'Encryption needs the key to reverse it, so it is not open to everyone.' },
        { text: 'Encoding such as Base64', explanation: 'Yes. Encoding changes the format and any standard decoder reverses it.' },
        { text: 'A cryptographic hash', explanation: 'A hash cannot be reversed at all, so it is not the answer here.' },
        { text: 'Asymmetric key signing', explanation: 'Signing and verifying need keys, so they are not reversible by anyone.' },
      ],
      answer: 1,
    },
    {
      question: 'What does this program print for the length of the hash?',
      code: { language: 'python', runnable: true, code: code`
        import hashlib
        print(len(hashlib.sha256(b"a much longer message than before").hexdigest()))
      ` },
      options: [
        { text: '64', explanation: 'Yes. SHA-256 always produces 64 hexadecimal characters, whatever the input length.' },
        { text: '36', explanation: 'That is the length of the message, not the hash.' },
        { text: '256', explanation: 'That is the number of bits. The hexadecimal text is 64 characters long.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why do systems often encrypt the bulk of data with a symmetric key but protect that key with asymmetric encryption?',
      options: [
        { text: 'Symmetric encryption is fast for bulk data, and asymmetric encryption shares the key safely', explanation: 'Yes. Each method is used where its strength matters.' },
        { text: 'Asymmetric encryption is faster for large files', explanation: 'Asymmetric encryption is slower, which is why it is used for small items like keys.' },
        { text: 'Symmetric keys are always public', explanation: 'Symmetric keys must be kept secret. The public key belongs to the asymmetric pair.' },
        { text: 'Both methods are identical in every way', explanation: 'They work differently, with different speed and key-sharing properties.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Encoding changes format, hashing fingerprints data irreversibly, and encryption protects secrecy only when the keys are stored and rotated separately from the data they protect.',
  resources: [
    { title: 'Cryptographic Storage Cheat Sheet', provider: 'OWASP', description: 'Guidance on encrypting data at rest, key management, and avoiding common mistakes.', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html' },
    { title: 'hashlib and base64 in Python', provider: 'Python.org', description: 'The standard library reference for hashing and encoding functions.', url: 'https://docs.python.org/3/library/hashlib.html' },
  ],
}

export default lesson
