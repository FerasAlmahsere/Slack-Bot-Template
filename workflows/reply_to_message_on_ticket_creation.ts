import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ReplyWhenTicketCreated } from "../functions/reply_when_ticket_created.ts";

export const ReplyToMessageOnTicketCreation = DefineWorkflow({
  callback_id: "reply_to_message_on_ticket_creation",
  title: "Reply to a support message when a ticket is created for it",
  input_parameters: {
    properties: {
      ticket_key: {
        type: Schema.types.string,
      },
      ticket_url: {
        type: Schema.types.string,
        format: "url",
      },
      description: {
        type: Schema.types.string,
      },
    },
    required: [
      "ticket_key",
      "ticket_url",
      "description",
    ],
  },
});

ReplyToMessageOnTicketCreation.addStep(
  ReplyWhenTicketCreated,
  {
    ticket_key: ReplyToMessageOnTicketCreation.inputs.ticket_key,
    ticket_url: ReplyToMessageOnTicketCreation.inputs.ticket_url,
    description: ReplyToMessageOnTicketCreation.inputs.description,
  },
);
