import { OAuth2Client, auth } from "google-auth-library";
import { Auth, google } from "googleapis";

export const getThreads = async (auth: OAuth2Client, messageId: string) => {
  try {
    const gmail = google.gmail({ version: "v1", auth });

    const res = await gmail.users.threads.get({
      userId: "me",
      id: messageId,
      format: "metadata",
    });

    const threads = res.data.messages;
    if (!threads || threads.length === 0) {
      console.log("No prior replies");
    }

    return threads;
  } catch (error) {
    console.error(error);
  }
};
