import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ReactWhenTicketIsInProgress } from "../functions/react_when_ticket_is_in_progress.ts";

export const ReactToMessageOnTicketProgress = DefineWorkflow({
  callback_id: "react_to_message_on_ticket_progress",
  title: "React to support message when it's ticket is moved to 'in progress'",
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

ReactToMessageOnTicketProgress.addStep(
  ReactWhenTicketIsInProgress,
  {
    ticket_url: ReactToMessageOnTicketProgress.inputs.ticket_url,
    description: ReactToMessageOnTicketProgress.inputs.description,
  },
);
