import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import axiod from "axiod/mod.ts";

export const CreateSupportTicket = DefineFunction({
  callback_id: "create_support_ticket",
  title: "Create Jira Ticket.",
  source_file: "functions/create_support_ticket.ts",
  input_parameters: {
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

export default SlackFunction(
  CreateSupportTicket,
  async (
    {
      inputs: { issuetype, summary, description, priority },
    },
  ) => {
    try {
      await axiod.post(
        "https://automation.atlassian.com/pro/hooks/ab79348c35660129a046141012d54402b0102b6c",
        {
          issuetype,
          summary,
          description,
          priority,
          sprint: {
            type: "REFERENCE",
            value: "CURRENT",
          },
        },
      );
    } catch (error) {
      return {
        error: "Error while send request to Jira.\n" +
          `Error message: ${error.message}`,
      };
    }

    return {
      outputs: {},
    };
  },
);
