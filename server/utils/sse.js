export const clients = [];

export const sendEventToClients = (eventData) => {
  clients.forEach((client) => {
    client.write(`data: ${eventData}\n\n`);
  });
}
