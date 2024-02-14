import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ReplyToMessageOnTicketCreation } from "../workflows/reply_to_message_on_ticket_creation.ts";

const onTicketCreated: Trigger<
  typeof ReplyToMessageOnTicketCreation.definition
> = {
  type: TriggerTypes.Webhook,
  name: "On Ticket Created",
  workflow:
    `#/workflows/${ReplyToMessageOnTicketCreation.definition.callback_id}`,
  inputs: {
    ticket_key: {
      value: "{{data.ticket_key}}",
    },
    ticket_url: {
      value: "{{data.ticket_url}}",
    },
    description: {
      value: "{{data.description}}",
    },
  },
};

export default onTicketCreated;
