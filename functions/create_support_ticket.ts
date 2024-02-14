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
        "https://automation.atlassian.com/pro/hooks/bb8ac172e902556ef5977e4613ef1ab7ef81dd46",
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
