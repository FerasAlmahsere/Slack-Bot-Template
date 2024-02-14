import { Trigger } from "deno-slack-api/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import { ReactToMessageOnTicketProgress } from "../workflows/react_to_message_on_ticket_progress.ts";

const onTicketProgress: Trigger<
  typeof ReactToMessageOnTicketProgress.definition
> = {
  type: TriggerTypes.Webhook,
  name: "On Ticket Progress",
  workflow:
    `#/workflows/${ReactToMessageOnTicketProgress.definition.callback_id}`,
  inputs: {
    ticket_url: {
      value: "{{data.ticket_url}}",
    },
    description: {
      value: "{{data.description}}",
    },
  },
};

export default onTicketProgress;
