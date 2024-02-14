import { Manifest } from "deno-slack-sdk/mod.ts";
// Functions
import { CreateSupportTicket } from "./functions/create_support_ticket.ts";
import { ReplyWhenTicketCreated } from "./functions/reply_when_ticket_created.ts";
import { ExtractTicketDataMessage } from "./functions/extract_ticket_data_from_message.ts";
import { ReactWhenTicketIsInProgress } from "./functions/react_when_ticket_is_in_progress.ts";
import { ReplyWhenTicketResolved } from "./functions/reply_when_ticket_resolved.ts";
// Workflows
import { CreateTicketOnMessage } from "./workflows/create_ticket_on_message.ts";
import { ReplyToMessageOnTicketCreation } from "./workflows/reply_to_message_on_ticket_creation.ts";
import { ReactToMessageOnTicketProgress } from "./workflows/react_to_message_on_ticket_progress.ts";
import { ReplyToMessageOnTicketResolution } from "./workflows/reply_to_message_on_ticket_resolution.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "lumofy-support-bot",
  displayName: "Lumofy - Support Bot",
  description:
    "Workflows for integrating the #support channel with our Jira board.",
  icon: "assets/default_new_app_icon.png",
  functions: [
    CreateSupportTicket,
    ExtractTicketDataMessage,
    ReplyWhenTicketCreated,
    ReactWhenTicketIsInProgress,
    ReplyWhenTicketResolved,
  ],
  workflows: [
    CreateTicketOnMessage,
    ReplyToMessageOnTicketCreation,
    ReactToMessageOnTicketProgress,
    ReplyToMessageOnTicketResolution,
  ],
  outgoingDomains: ["automation.atlassian.com"],
  botScopes: [
    "channels:history",
    "chat:write",
    "groups:history",
    "reactions:write",
  ],
});
