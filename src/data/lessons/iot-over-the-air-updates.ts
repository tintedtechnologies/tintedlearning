import type { StructuredLesson } from '../../types/lesson'
import { code } from './helpers'

const lesson: StructuredLesson = {
  goals: [
    'Explain why devices in the field need updates, and what can go wrong without them',
    'Describe how signed firmware and a safe update process protect a device',
    'Plan a rollout that catches a bad update before it reaches every device',
  ],
  bigIdea: 'Devices in the field cannot be recalled for every fix, so they need a way to receive new firmware safely over the air. A safe update is signed so the device accepts only genuine code, it keeps the old version until the new one is proven, and it reaches devices in stages so a bad release is caught early.',
  whyItMatters: 'A company ships ten thousand thermostats. A bug in the next firmware makes some units reboot in a loop. Without a safe update process, the company must visit every home. With a staged rollout and a rollback, only a small group is affected, and the rest of the fleet stays on the working version.',
  goalSections: [
    {
      heading: 'Why devices need updates',
      paragraphs: [
        'Software has bugs, and security problems are discovered after products are sold. A device that cannot be updated keeps those problems for its whole life. The ability to update is part of what makes a connected product safe to own for years.',
        'Updates also add features and fix compatibility, such as a change to a cloud service or a new type of connection. A device that stops getting updates may still work, but it may stop being able to talk to the services it depends on.',
        'Plan the update before buying the device. Ask the vendor how long updates will be provided, how they are delivered, and whether they are signed. A device with no update path is a long-term risk, even if it works today.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          Device firmware 1.4 -> 1.5 update arrives
          Device checks the signature -> valid, from the vendor
          Device writes 1.5 to a spare slot -> keeps 1.4 as a fallback
          Device restarts on 1.5 -> runs a self-test -> confirms success
        `,
      },
    },
    {
      heading: 'Signing and safe installation',
      paragraphs: [
        'A signed update carries a digital signature made with the vendor\'s private key. The device holds the matching public key and checks the signature before it installs anything. An update with an invalid or missing signature is rejected, which stops an attacker from installing their own code.',
        'Install the new version in a separate slot, not over the old one. If the new version fails to start or fails its self-test, the device goes back to the working version. This rollback is what makes updates safe enough to send to devices that cannot be touched.',
        'Protect the signing key as carefully as any secret. Anyone who has the key can sign code that devices will trust, so the key should be stored away from everyday development systems and used only in a controlled release process.',
      ],
      example: {
        language: 'text',
        runnable: false,
        code: code`
          1. The device receives firmware 1.5 and its signature.
          2. The device checks the signature with the vendor's public key. It is valid.
          3. The device writes 1.5 to the spare slot and keeps 1.4 in the active slot.
          4. The device switches to 1.5 and runs its self-test.
          5. If the self-test fails, the device switches back to 1.4 and reports the failure.
        `,
      },
    },
    {
      heading: 'Rolling out in stages',
      paragraphs: [
        'Do not send a new update to every device at once. Send it first to a small group, such as employees or a few test sites. Watch the health numbers, such as restarts and errors, for a set period. Only then send it to the next group.',
        'Set a clear stop rule before the rollout begins. For example, stop the rollout if the restart rate is more than double the normal rate, or if more than one percent of a group fails its self-test. A clear rule prevents a team from talking itself into continuing.',
        'Keep records of which version each device runs. When a problem appears, the team needs to know which devices have the bad version, and which ones can be rolled back.',
      ],
      example: {
        language: 'python',
        runnable: true,
        code: code`
          groups = [("staff test", 20, 0), ("pilot homes", 500, 4), ("all homes", 9480, 300)]
          for name, devices, failures in groups:
              rate = failures / devices * 100
              decision = "continue" if rate <= 1.0 else "stop and roll back"
              print(name, "failure rate:", round(rate, 2), "% ->", decision)
              if decision != "continue":
                  break
        `,
        output: 'staff test failure rate: 0.0 % -> continue\npilot homes failure rate: 0.8 % -> continue\nall homes failure rate: 3.16 % -> stop and roll back',
      },
    },
  ],
  seeItInAction: {
    title: 'A staged rollout with a stop rule',
    intro: 'The program above sends an update to groups in order and stops as soon as a group\'s failure rate passes the limit. Run it, then change the failures in the pilot group to 12 and predict where the rollout stops.',
    example: {
      language: 'python',
      runnable: true,
      code: code`
        groups = [("staff test", 20, 0), ("pilot homes", 500, 12), ("all homes", 9480, 300)]
        limit_percent = 1.0
        for name, devices, failures in groups:
            rate = failures / devices * 100
            if rate > limit_percent:
                print(name, "failed at", round(rate, 2), "% - rollout stopped")
                break
            print(name, "passed at", round(rate, 2), "%")
      `,
      output: 'staff test passed at 0.0 %\npilot homes failed at 2.4 % - rollout stopped',
    },
    steps: [
      { code: 'groups = [...]', explanation: 'The rollout order, from the smallest and safest group to the whole fleet.' },
      { code: 'rate = failures / devices * 100', explanation: 'Turns the count of failures into a percentage the stop rule can use.' },
      { code: 'if rate > limit_percent:', explanation: 'The stop rule is written before the rollout begins, not decided during it.' },
      { code: 'break', explanation: 'Stops the rollout, so the remaining devices keep the working version.' },
    ],
  },
  tryIt: {
    instructions: [
      'Change the pilot failures in the seeItInAction example to 4, and predict whether the rollout continues. Run it to check.',
      'Write a three-stage rollout plan for a product with 5000 devices, including the size of each stage and the stop rule.',
      'Find out how long a device you own will receive updates, from the vendor page or the manual. Write down whether it can be updated over the air.',
    ],
  },
  mistakes: [
    { mistake: 'Sending a new firmware version to every device at once.', fix: 'Roll out in stages, starting with a small group, and watch the health numbers between stages.' },
    { mistake: 'Installing updates over the only working copy.', fix: 'Install into a separate slot and keep a rollback to the previous version.' },
    { mistake: 'Storing the signing key on everyday development machines.', fix: 'Protect the key in a controlled release process, and limit who can use it.' },
  ],
  quiz: [
    {
      question: 'Why does a device check the signature of an update before installing it?',
      options: [
        { text: 'So that code not signed by the trusted vendor is rejected', explanation: 'Yes. The signature proves the update came from the vendor and was not changed.' },
        { text: 'So that the update downloads faster', explanation: 'Signature checks are about trust, not speed.' },
        { text: 'So that the device can skip its self-test', explanation: 'The self-test still runs, and the signature does not replace it.' },
        { text: 'So that the battery lasts longer', explanation: 'Checking a signature does not change battery life in a way this lesson is about.' },
      ],
      answer: 0,
    },
    {
      question: 'What does this program print for the pilot group with 4 failures out of 500?',
      code: { language: 'python', runnable: true, code: code`
        devices, failures = 500, 4
        rate = failures / devices * 100
        print("continue" if rate <= 1.0 else "stop and roll back")
      ` },
      options: [
        { text: 'continue', explanation: 'Yes. Four failures in five hundred is 0.8 percent, which is under the one percent limit.' },
        { text: 'stop and roll back', explanation: 'The rate is 0.8 percent, which does not pass the 1 percent limit.' },
        { text: '0.8', explanation: 'The program prints the decision, not the rate.' },
        { text: 'An error', explanation: 'The code is valid Python and runs without an error.' },
      ],
      answer: 0,
      answerIsOutput: true,
    },
    {
      question: 'Why keep the previous firmware version on the device after an update?',
      options: [
        { text: 'So the device can roll back if the new version fails to start or fails its self-test', explanation: 'Yes. A rollback keeps a failed update from leaving the device unusable.' },
        { text: 'So the device stores more photos', explanation: 'The fallback is for firmware, not for user data.' },
        { text: 'So the vendor can sell the old version again', explanation: 'The purpose is device safety, not resale.' },
        { text: 'So the device never needs another update', explanation: 'The device still needs future updates, and the fallback does not replace them.' },
      ],
      answer: 0,
    },
  ],
  takeaway: 'Field devices need signed updates, a separate install slot with rollback, and staged rollouts with a stop rule written before the release, so a bad update is caught while only a few devices are affected.',
  resources: [
    { title: 'IoT device firmware updates', provider: 'NIST', description: 'Guidance on secure updates and device lifecycle for connected products.', url: 'https://www.nist.gov/' },
    { title: 'Over-the-air updates', provider: 'Mender', description: 'A practical explanation of staged rollouts, rollback, and signing for embedded devices.', url: 'https://mender.io/' },
  ],
}

export default lesson
