import { OAuth2Client, auth } from "google-auth-library";
import { gmail_v1, google } from "googleapis";

export const getMessages = async (auth: OAuth2Client) => {
  try {
    const gmail = google.gmail({
      version: "v1",
      auth,
    });

    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 15,
      labelIds: ["INBOX", "UNREAD"],
      q: "-labels:AUTO-REPLIED AND after:2024/01/10",
    });

    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
      console.log("No messages");
      return [];
    }
    console.log(messages.length, "Unread Messages");
    return messages;
  } catch (error) {
    console.error(error);
  }
};

export const getMailSender = (
  headers: Array<gmail_v1.Schema$MessagePartHeader>
) => {
  try {
    if (
      headers ||
      (headers as gmail_v1.Schema$MessagePartHeader[]).length !== 0
    ) {
      return headers[0].value;
    } else {
      throw "No new Messages";
    }
  } catch (error) {
    console.error(error);
  }
};

export const prepareEmail = (
  to: string,
  threadId: string,
  message_id: string
) => {
  try {
    const messageBody = {
      to,
      subject: "Re: Test Vacation automation",
      text: "Testing an automated reply coz I am going on vacation.",
    };

    const emailFormat = [
      `To:${messageBody.to}`,
      `Content-Type:text/html;charset=utf-8`,
      "MIME-version:1.0",
      `Subject: ${messageBody.subject}`,
      `In-Reply-To:${message_id}`,
      `References:${message_id}`,
      "",
      `${messageBody.text}`,
    ];

    return Buffer.from(emailFormat.join("\n")).toString("base64");
  } catch (error) {
    console.error(error);
  }
};

export const sendMessage = async (
  auth: OAuth2Client,
  threadId: string,
  reciever: string,
  message_id: string
) => {
  try {
    const gmail = google.gmail({
      version: "v1",
      auth,
    });

    const raw = prepareEmail(reciever, threadId, message_id);

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
        threadId,
      },
    });

    console.log(`Email sent to ${reciever}\n`);

    const messageId = res.data;
    return messageId;
  } catch (error) {
    console.error(error);
  }
};
