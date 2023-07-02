import { eventEmitter } from "../utils/eventEmitter.js";

export const sendServerEvents = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(": connection established\n\n");
  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  eventEmitter.on("event", sendEvent);

  req.on("close", () => {
    eventEmitter.off("event", sendEvent);
  });
};
