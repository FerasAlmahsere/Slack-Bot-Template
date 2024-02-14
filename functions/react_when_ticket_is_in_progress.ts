import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import getSlackMessageDetailsFromDescription from "../helpers/getSlackMessageDetailsFromDescription.ts";

export const ReactWhenTicketIsInProgress = DefineFunction({
  callback_id: "react_when_ticket_is_in_progress",
  title: "React to message when it's ticket is resolved.",
  source_file: "functions/react_when_ticket_is_in_progress.ts",
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

export default SlackFunction(
  ReactWhenTicketIsInProgress,
  async (
    {
      inputs: { ticket_url, description },
      client,
    },
  ) => {
    try {
      const { channelID, messageTS } = getSlackMessageDetailsFromDescription(
        description,
      );

      await client.reactions.add({
        channel: channelID,
        timestamp: Number(messageTS),
        name: "mag",
      });

      return {
        outputs: {},
      };
    } catch {
      return {
        error:
          `Couldn't get slack message url from ticket. Ticket URL: ${ticket_url}`,
      };
    }
  },
);
