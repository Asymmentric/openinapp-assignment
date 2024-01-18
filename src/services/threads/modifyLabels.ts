import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export const addAutomationLabel = async (
  auth: OAuth2Client,
  threadId: string,
  label: string
) => {
  try {
    const gmail = google.gmail({ version: "v1", auth });

    const res = await gmail.users.threads.modify({
      userId: "me",
      id: threadId,
      requestBody: {
        addLabelIds: [label],
        removeLabelIds: ["UNREAD"],
      },
    });

    console.log(`Added Lable: ${label} to Thread`);

    const threads = res.data.messages;
    if (!threads || threads.length === 0) {
      console.log("No prior replies");
    }

    return threads;
  } catch (error) {
    console.error(error);
  }
};
