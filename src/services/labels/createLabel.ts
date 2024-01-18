import { OAuth2Client, auth } from "google-auth-library";
import { google } from "googleapis";

export const checkIfLabelExists = async (
  auth: OAuth2Client,
  labelName: string
) => {
  try {
    const gmail = google.gmail({
      version: "v1",
      auth,
    });

    const res = await gmail.users.labels.list({
      userId: "me",
    });

    const labelList = res.data.labels;

    const userLabel = labelList?.filter((label) => label.name === labelName);

    if (!userLabel || userLabel.length === 0) {
      return false;
    }
    return userLabel[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createLabel = async (auth: OAuth2Client, labelName: string) => {
  try {
    const gmail = google.gmail({
      version: "v1",
      auth,
    });

    const labelAlreadyExists = await checkIfLabelExists(auth, labelName);

    if (labelAlreadyExists) {
      return labelAlreadyExists.id;
    }

    const res = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        messageListVisibility: "show",
        labelListVisibility: "labelShow",
        type: "user",
      },
    });

    const labels = res.data;
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
    if (!labels) {
      console.log("Error creating label");
      return [];
    }
    return labels.id;
  } catch (error) {}
};
