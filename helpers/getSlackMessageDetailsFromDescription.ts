const descriptionRegexp = new RegExp(
  // Start of slack url
  "https:\\/\\/[a-z]*\\.slack\\.com" +
    // Start of the route
    "\\/.+" +
    // The segment before the last will be the channel ID
    "\\/(?<channelID>[a-zA-Z0-9]+)" +
    // The last segment will be the message TS prepended by the letter `p`
    "\\/p(?<messageTS>\\d+)",
);

export default function getSlackMessageDetailsFromDescription(description: string): {channelID: string, messageTS: string} {
  const regexpExecResult = descriptionRegexp.exec(description);

  if (!regexpExecResult) {
    throw new Error(`Couldn't extract message details from description.\nDescription: ${description}`)
  }

  // We're sure that "groups" is not undefined, because if it is, `regexpExecResult` would've been null
  const { groups: { channelID, messageTS: messageTSWithoutDot } } =
    regexpExecResult as unknown as {
      groups: {
        channelID: string;
        messageTS: string;
      };
    };
  const messageTS = messageTSWithoutDot.slice(0, 10) + "." +
    messageTSWithoutDot.slice(10);

    return {
      channelID,
      messageTS
    }
}
