const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const password = String(body.password || "");
  const guestName = String(body.guestName || "").trim().slice(0, 64);

  // Host authentication — checked server-side on every single call.
  // ADMIN_PASSWORD is set as a Netlify environment variable, never shipped to the client.
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: "Incorrect password" }) };
  }

  if (!guestName) {
    return { statusCode: 400, body: JSON.stringify({ error: "Guest name is required" }) };
  }

  // Cryptographically random token — not derived from the name, not guessable.
  const token = crypto.randomBytes(9).toString("base64url"); // ~12 chars, URL-safe

  const store = getStore("invites");
  await store.setJSON(token, {
    name: guestName,
    createdAt: new Date().toISOString(),
  });

  const origin = `https://${event.headers.host}`;
  const url = `${origin}/invite/${token}`;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, url }),
  };
};
