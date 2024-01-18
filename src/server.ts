import { gmail_v1 } from "googleapis";
import { authorize } from "./services/auth/authorize";
import { createLabel } from "./services/labels/createLabel";
import { getMailSender, getMessages } from "./services/messages/message";
import { getThreads } from "./services/threads/getThreads";
import { autoReply } from "./services/messages/autoSendMessage";

export const checkIfAlreadyReplied = (
  threadMessages: gmail_v1.Schema$Message[]
) => {
  try {
    let replied = false;
    threadMessages.forEach((threadMessage) => {
      threadMessage.payload?.headers?.forEach((header) => {
        if (header.name === "From" && header.value === "hrimesomec@gmail.com") {
          replied = true;
        }
      });
    });

    return replied;
  } catch (error) {
    console.error(error);
  }
};

export const sendAutoMails = async () => {
  try {
    const auth = await authorize();

    // create new label 'AUTO-REPLIED'
    const automationLabel = await createLabel(auth, "AUTO-REPLIED");

    //Getting latest, unread messages from inbox and also exluding the messages from 'AUTO-REPLIED' Label
    const listMessages = await getMessages(auth);
    console.log(listMessages);

    listMessages?.map(async (message) => {
      //Getting message threads from all messages
      const threadMessages = await getThreads(
        auth,
        message?.threadId as string
      );

      //Extracting the sender's Email
      if (!threadMessages) {
        throw new Error("Cant fetch messages");
      }

      const senderHeaders = threadMessages[0].payload?.headers?.filter(
        (header) => header.name === "From"
      );

      if (!senderHeaders) {
        throw new Error("Cant find Sender");
      }

      console.log(senderHeaders);

      let message_id_array = threadMessages[0].payload?.headers?.filter(
        (header) => header.name === "Message-Id" || header.name === "Message-ID"
      );

      if (!message_id_array) {
        throw new Error("Cant find messageIDs");
      }

      const message_id = message_id_array[0].value;
      if (!message_id) {
        throw new Error("Cant find message ID");
      }

      const reciever = getMailSender(senderHeaders);

      if (threadMessages.length === 1) {
        //First message of the thread

        await autoReply(
          auth,
          message.threadId as string,
          reciever as string,
          automationLabel as string,
          message_id
        );
      } else if (threadMessages.length > 1) {
        const alreadyReplied = checkIfAlreadyReplied(threadMessages);

        if (!alreadyReplied) {
          await autoReply(
            auth,
            message.threadId as string,
            reciever as string,
            automationLabel as string,
            message_id
          );
        } else console.log("Already Replied...");
      } else console.log("No new updates....");
    });
  } catch (error) {}
};

export const executeAutomation = async () => {
  try {
    const randomRepetition = Math.floor(Math.random() * (120 - 45 + 1)) + 45;
    console.log(randomRepetition);
    setInterval(sendAutoMails, randomRepetition * 1e3);
  } catch (error) {
    console.error(error);
  }
};
