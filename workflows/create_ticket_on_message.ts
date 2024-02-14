import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ExtractTicketDataMessage } from "../functions/extract_ticket_data_from_message.ts";
import { CreateSupportTicket } from "../functions/create_support_ticket.ts";

export const CreateTicketOnMessage = DefineWorkflow({
  callback_id: "create_ticket_on_message",
  title: "Create a ticket when a support message is posted.",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      message_ts: {
        type: Schema.slack.types.message_ts,
      },
      message: {
        type: Schema.types.string,
      },
    },
    required: [
      "channel_id",
      "message_ts",
      "message",
    ],
  },
});

const extractionOutput = CreateTicketOnMessage.addStep(
  ExtractTicketDataMessage,
  {
    channel_id: CreateTicketOnMessage.inputs.channel_id,
    message_ts: CreateTicketOnMessage.inputs.message_ts,
    message: CreateTicketOnMessage.inputs.message,
  },
);

CreateTicketOnMessage.addStep(
  CreateSupportTicket,
  {
    issuetype: extractionOutput.outputs.issuetype,
    summary: extractionOutput.outputs.summary,
    description: extractionOutput.outputs.description,
    priority: extractionOutput.outputs.priority,
  },
);
