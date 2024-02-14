import { Trigger } from "deno-slack-api/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import "std/dotenv/load.ts";
import { CreateTicketOnMessage } from "../workflows/create_ticket_on_message.ts";

const channelIds = (Deno.env.get("SLACK_CHANNEL_IDS") || "").split(",");
console.log("channelIds", channelIds);
if (channelIds.length == 0) {
  throw new Error(
    "SLACK_CHANNEL_IDS environment variable must contain at least one ID",
  );
}

const OnMessagePosted: Trigger<
  typeof CreateTicketOnMessage.definition
> = {
  type: TriggerTypes.Event,
  name: "On Message Posted",
  workflow: `#/workflows/${CreateTicketOnMessage.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.MessagePosted,
    channel_ids: channelIds as [string, ...string[]],
    filter: {
      version: 1,
      root: {
        operator: "AND",
        inputs: [{
          operator: "NOT",
          inputs: [{
            // Filter out posts by apps
            statement: "{{data.user_id}} == null",
          }],
        }, {
          // Filter out thread replies
          statement: "{{data.thread_ts}} == null",
        }],
      },
    },
  },
  inputs: {
    channel_id: {
      value: TriggerContextData.Event.MessagePosted.channel_id,
    },
    message_ts: {
      value: TriggerContextData.Event.MessagePosted.message_ts,
    },
    message: {
      value: TriggerContextData.Event.MessagePosted.text,
    },
  },
};

export default OnMessagePosted;
