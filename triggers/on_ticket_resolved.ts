import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ReplyToMessageOnTicketResolution } from "../workflows/reply_to_message_on_ticket_resolution.ts";

const OnTicketResolved: Trigger<
  typeof ReplyToMessageOnTicketResolution.definition
> = {
  type: TriggerTypes.Webhook,
  name: "On Ticket Resolved",
  workflow:
    `#/workflows/${ReplyToMessageOnTicketResolution.definition.callback_id}`,
  inputs: {
    ticket_url: {
      value: "{{data.ticket_url}}",
    },
    description: {
      value: "{{data.description}}",
    },
  },
};

export default OnTicketResolved;
