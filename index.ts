import { executeAutomation } from "./src/server";

(async () => {
  try {
    console.log("...Activated");
    const activate = await executeAutomation();
  } catch (error) {
    console.error(error);
  }
})();
