import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import getSlackMessageDetailsFromDescription from "../helpers/getSlackMessageDetailsFromDescription.ts";

export const ReplyWhenTicketResolved = DefineFunction({
  callback_id: "reply_when_ticket_resolved",
  title: "Reply to message when it's ticket is resolved.",
  source_file: "functions/reply_when_ticket_resolved.ts",
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
  ReplyWhenTicketResolved,
  async (
    {
      inputs: { ticket_url, description },
      client,
      env,
    },
  ) => {
    const namesToTag = (env["USER_IDS_TO_TAG_IN_REPLIES"] || "").split(",");
    const tags = namesToTag.map((name) => `<@${name}>`).join(" ");
    try {
      const { channelID, messageTS } = getSlackMessageDetailsFromDescription(
        description,
      );

      await client.chat.postMessage({
        channel: channelID,
        thread_ts: messageTS,
        text: `${tags} Fixed`,
      });

      await client.reactions.add({
        channel: channelID,
        timestamp: Number(messageTS),
        name: "white_check_mark",
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
