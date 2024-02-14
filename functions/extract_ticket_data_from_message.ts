import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const ExtractTicketDataMessage = DefineFunction({
  callback_id: "extract_ticket_data_from_message",
  title: "Extract ticket data from message",
  source_file: "functions/extract_ticket_data_from_message.ts",
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
  output_parameters: {
    properties: {
      issuetype: {
        type: Schema.types.string,
      },
      summary: {
        type: Schema.types.string,
      },
      description: {
        type: Schema.types.string,
      },
      priority: {
        type: Schema.types.string,
      },
    },
    required: [
      "issuetype",
      "summary",
      "description",
      "priority",
    ],
  },
});

const invalidFormatErrorMessage =
  "Invalid message format. The message should look like this:\n" +
  "`Type:` [One of: Bug - Change-Request]\n" +
  "`Severity:` [One of: :large_green_circle: - :large_yellow_circle: - :red_circle:]\n" +
  "`Reporter:` [Reporter Name]\n" +
  "`Title:`  [Title Of The Issue - must be one line]\n" +
  "`Description:` [Long description of the issue, with steps to reproduce it, and any attachments that can help us reproduce the error - can be over multiple lines]\n" +
  "\n" +
  "Please also note that the report *must* a top level message, i.e don't reply in a thread with the corrected format, delete this message and post a new one";

const issuetypeEnvKeys: Record<string, string> = {
  "bug": "ISSUE_TYPE_BUG",
  "change-request": "ISSUE_TYPE_ENHANCEMENT",
};
const priorityEnvKeys: Record<string, string> = {
  ":large_green_circle:": "PRIORITY_LOW",
  ":large_yellow_circle:": "PRIORITY_MEDIUM",
  ":red_circle:": "PRIORITY_HIGHEST",
};

const messageRegexp = new RegExp(
  "`?type:`? *(?<type>.+)\\r?\\n" +
    "`?severity:`? *(?<severity>.+)\\r?\\n" +
    "`?reporter:`?.+\\r?\\n" +
    "`?title:`? *(?<title>.+)\\r?\\n" +
    "`?description:`?.*",
  "im",
);

export default SlackFunction(
  ExtractTicketDataMessage,
  async (
    {
      inputs: { channel_id, message_ts, message },
      client,
      env,
    },
  ) => {
    const { permalink: slackMessageURL } = await client.chat.getPermalink({
      channel: channel_id,
      message_ts: message_ts,
    });

    const regexpExecResult = messageRegexp.exec(message);

    if (!regexpExecResult) {
      await client.chat.postMessage({
        channel: channel_id,
        thread_ts: message_ts,
        text: invalidFormatErrorMessage,
      });

      return {
        error:
          `Invalid message format was posted in the channel. Message link: ${slackMessageURL}`,
      };
    }

    // We're sure that "groups" is not undefined, because if it is, `regexpExecResult` would've been null
    const { groups: { type, title, severity } } =
      regexpExecResult as unknown as {
        groups: {
          type: string;
          severity: string;
          title: string;
          description: string;
        };
      };

    const issuetype = env[issuetypeEnvKeys[type.toLowerCase()]];
    const priority = env[priorityEnvKeys[severity.toLowerCase()]];
    if (!issuetype || !priority) {
      await client.chat.postMessage({
        channel: channel_id,
        thread_ts: message_ts,
        text: invalidFormatErrorMessage,
      });

      return {
        error:
          `Invalid message format was posted in the channel. Message link: ${slackMessageURL}`,
      };
    }

    return {
      outputs: {
        issuetype,
        summary: `[Ticket] ${title}`,
        description: `Please refer to slack message: ${slackMessageURL}`,
        priority,
      },
    };
  },
);
