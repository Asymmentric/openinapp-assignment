import { OAuth2Client } from "google-auth-library";
import { sendMessage } from "./message";
import { addAutomationLabel } from "../threads/modifyLabels";

export const autoReply = async (
  auth: OAuth2Client,
  threadId: string,
  reciever: string,
  label: string,
  messageId: string
) => {
  try {
    const autoResponse = await sendMessage(auth, threadId, reciever, messageId);

    await addAutomationLabel(auth, threadId, label);
  } catch (error) {
    console.error(error);
  }
};
