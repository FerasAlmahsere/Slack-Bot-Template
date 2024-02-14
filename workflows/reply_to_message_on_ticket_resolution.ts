import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ReplyWhenTicketResolved } from "../functions/reply_when_ticket_resolved.ts";

export const ReplyToMessageOnTicketResolution = DefineWorkflow({
  callback_id: "reply_to_message_on_ticket_resolution",
  title: "Reply to support message when it's ticket is released to production",
  input_parameters: {
    properties: {
      ticket_url: {
        type: Schema.types.string,
        format: "url",
      },
      description: {
        type: Schema.types.string,
      },
    },
    required: [
      "ticket_url",
      "description",
    ],
  },
});

ReplyToMessageOnTicketResolution.addStep(
  ReplyWhenTicketResolved,
  {
    ticket_url: ReplyToMessageOnTicketResolution.inputs.ticket_url,
    description: ReplyToMessageOnTicketResolution.inputs.description,
  },
);
