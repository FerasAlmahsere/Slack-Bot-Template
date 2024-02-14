import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import getSlackMessageDetailsFromDescription from "../helpers/getSlackMessageDetailsFromDescription.ts";

export const ReplyWhenTicketCreated = DefineFunction({
  callback_id: "reply_when_ticket_created",
  title: "Reply to message when it's ticket is created.",
  source_file: "functions/reply_when_ticket_created.ts",
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

export default SlackFunction(
  ReplyWhenTicketCreated,
  async (
    {
      inputs: { ticket_key, ticket_url, description },
      client,
      env,
    },
  ) => {
    console.log("===========================");
    console.log({ ticket_key, ticket_url, description });
    console.log("===========================");
    const namesToTag = (env["USER_IDS_TO_TAG_IN_REPLIES"] || "").split(",");
    const tags = namesToTag.map((name) => `<@${name}>`).join(" ");

    try {
      const { channelID, messageTS } = getSlackMessageDetailsFromDescription(
        description,
      );

      console.log("===========================");
      console.log({ channelID, messageTS });
      console.log("===========================");

      const result1 = await client.chat.postMessage({
        channel: channelID,
        thread_ts: messageTS,
        text: `${tags} Ticket created. <${ticket_url}|${
          ticket_key || ticket_url
        }>`,
      });

      console.log("===========================");
      console.log(result1);
      console.log("===========================");

      const result2 = await client.reactions.add({
        channel: channelID,
        timestamp: Number(messageTS),
        name: "memo",
      });

      console.log("===========================");
      console.log(result2);
      console.log("===========================");

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
