const adminClients = new Set();

/**
 * Register an SSE response stream for connected admin clients.
 */
export const addAdminClient = (res) => {
  adminClients.add(res);
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      adminClients.delete(res);
    }
  }, 25000);

  return () => {
    clearInterval(heartbeat);
    adminClients.delete(res);
  };
};

/**
 * Broadcast a real-time event to all connected admin dashboard sessions.
 */
export const broadcastAdminEvent = (eventName, payload) => {
  const data = JSON.stringify(payload);
  const frame = `event: ${eventName}\ndata: ${data}\n\n`;
  for (const client of adminClients) {
    try {
      client.write(frame);
    } catch {
      adminClients.delete(client);
    }
  }
};
