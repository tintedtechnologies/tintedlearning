import type { ProjectPlan } from '../../types/project'
import { code } from '../lessons/helpers'

const plan: ProjectPlan = {
  id: 'capstone-agent',
  whatYouBuild: "A support-ticket helper for a made-up online shop, Brightway. It reads a customer's ticket, looks up the order with a tool, drafts a reply and waits for a person to approve before anything is sent. It has a step limit, so a confused run stops, and each tool has only the rights its job needs.",
  diagram: code`
    Ticket arrives: "Where is my order 1042?"
      -> step 1: lookup_order("1042") -> status, carrier, dispatch date
      -> step 2: draft_reply(ticket, order) -> a reply text, not yet sent
      -> step 3: request_approval(reply) -> waits for a person
      -> a person clicks Approve -> send_reply runs once, and the log records it
      -> a person clicks Reject -> nothing is sent, and the ticket is marked for review
    Limit: 4 steps. Each tool can only read orders, or write one reply after approval.
  `,
  lessons: ['tool-calling', 'ai-agents', 'mcp', 'responsible-ai', 'ai-observability'],
  tools: ['Python 3.12 or newer, with a virtual environment', 'The sample orders and tickets supplied with the project as Python data', 'Optional: a model provider from Build a Chatbot, to choose the next step'],
  time: 'about 6 hours',
  requirements: [
    'Reads a ticket and looks up the order with a tool, not from memory',
    'Drafts a reply, but never sends it without a person\'s approval',
    'Stops after four steps, and says so when it stops',
    'Each tool has only the rights its job needs, and cannot change an order',
    'Logs each step with the ticket id, the tool name and the outcome',
  ],
  milestones: [
    {
      title: 'Write the tools and their limits',
      goal: 'Create one tool that reads an order and one that drafts a reply. Neither can change an order or send a message.',
      hints: [
        'Keep the sample orders in a dictionary, keyed by order number, so a lookup is simple.',
        'Return "not found" for an unknown order, rather than raising an error the agent cannot read.',
        'Give each tool a short description, so the model knows when to use it in a later step.',
      ],
      code: {
        language: 'python',
        filename: 'tools.py',
        code: code`
          ORDERS = {
              "1042": {"status": "shipped", "carrier": "Northway", "dispatched": "2026-11-10"},
              "1043": {"status": "processing", "carrier": None, "dispatched": None},
          }

          def lookup_order(order_id):
              return ORDERS.get(order_id, {"error": "order not found"})

          def draft_reply(order_id):
              order = lookup_order(order_id)
              if "error" in order:
                  return "We could not find that order. Could you check the number?"
              if order["status"] == "shipped":
                  return f"Your order {order_id} left us on {order['dispatched']} with {order['carrier']}."
              return f"Your order {order_id} is still being prepared."

          if __name__ == "__main__":
              print(lookup_order("1042")["status"])
              print(draft_reply("1043"))
        `,
        output: 'shipped\nYour order 1043 is still being prepared.',
      },
      checkpoint: 'The lookup returns the status, and the draft reply matches the order status.',
    },
    {
      title: 'Add the approval gate',
      goal: 'Hold every reply until a person approves it, and send it at most once.',
      hints: [
        'Store each reply as a pending action with an id and a status of "waiting".',
        'Only the approve function may change a status to "sent", and it must check the status first.',
        'A model cannot approve. The approval comes from a button in the app, which calls approve with the action id.',
      ],
      code: {
        language: 'python',
        filename: 'approval.py',
        code: code`
          pending = {}
          sent = []

          def request_approval(action_id, text):
              pending[action_id] = {"text": text, "status": "waiting"}
              return f"action {action_id} is waiting for approval"

          def approve(action_id):
              action = pending.get(action_id)
              if action is None or action["status"] != "waiting":
                  return "nothing to approve"
              action["status"] = "sent"
              sent.append(action["text"])
              return "sent"

          if __name__ == "__main__":
              print(request_approval("a1", "Your order has shipped."))
              print(approve("a1"))
              print(approve("a1"))
              print(len(sent))
        `,
        output: 'action a1 is waiting for approval\nsent\nnothing to approve\n1',
      },
      checkpoint: 'The reply is sent once, and a second approval does nothing.',
    },
    {
      title: 'Run the steps with a limit',
      goal: 'Run the agent\'s steps in order, stop after four steps and report why it stopped.',
      hints: [
        'Keep the step count in code. Do not ask the model whether it has finished.',
        'Refuse any tool name that is not in your list of tools.',
        'Write every step to the log with the ticket id, the tool name and the outcome.',
      ],
      code: {
        language: 'python',
        filename: 'agent.py',
        code: code`
          from tools import lookup_order, draft_reply

          TOOLS = {"lookup_order": lookup_order, "draft_reply": draft_reply}
          MAX_STEPS = 4

          def run(ticket_id, plan):
              log = []
              for step, (name, argument) in enumerate(plan[:MAX_STEPS], start=1):
                  if name not in TOOLS:
                      log.append(f"{ticket_id} step {step}: refused unknown tool {name}")
                      continue
                  result = TOOLS[name](argument)
                  log.append(f"{ticket_id} step {step}: {name} ok")
              if len(plan) > MAX_STEPS:
                  log.append(f"{ticket_id}: stopped after {MAX_STEPS} steps")
              return log

          plan = [("lookup_order", "1042"), ("delete_account", "1042"), ("draft_reply", "1042"), ("draft_reply", "1042"), ("draft_reply", "1042")]
          for line in run("T-7", plan):
              print(line)
        `,
        output: 'T-7 step 1: lookup_order ok\nT-7 step 2: refused unknown tool delete_account\nT-7 step 3: draft_reply ok\nT-7 step 4: draft_reply ok\nT-7: stopped after 4 steps',
      },
      checkpoint: 'The unknown tool is refused, the run stops after four steps, and the log says why.',
    },
    {
      title: 'Connect a model to choose the next step',
      goal: 'Let a model choose the next tool, while the code still checks each choice against the tool list, the limit and the approval gate.',
      hints: [
        'Give the model the tool names and descriptions only. It should not see the approval code.',
        'Parse its reply into one tool name and one argument, and reject anything else.',
        'Keep the same step limit from the previous milestone, whatever the model asks for.',
      ],
      checkpoint: 'The model chooses steps, and every step still passes the tool list, the step limit and the approval gate.',
    },
  ],
  finishedMeans: [
    'A reply is never sent without an approval recorded for that exact reply',
    'The run stops after four steps, and the log says so',
    'No tool can change an order or delete data',
    'The log records each step, and contains no customer names or addresses',
    'The project runs from a fresh clone, with the sample data included',
  ],
  readmeTemplate: code`
    # Brightway Ticket Helper

    [One sentence: an agent that drafts support replies and waits for approval.]

    ## Run it
    [Setup steps, and how to run the sample tickets.]

    ## Tools and their limits
    [Each tool, what it can read, and what it can never change.]

    ## Approval and the step limit
    [How approval works, and what happens after four steps.]

    ## What I would test next
    [Two failure cases you have not handled yet.]
  `,
  portfolioText: "Describe this as an agent that works on support tickets, with narrow tools, an approval gate and a step limit. Explain why a model can suggest a reply but cannot send it, and show the log of one run. Employers want to see that you limited what an automated system can do.",
  stretchGoals: [
    'Add a refund tool that requires a second approver',
    'Show the approval queue in a simple web page',
    'Test the agent with a set of tickets that try to trick it into a forbidden step',
  ],
}

export default plan
