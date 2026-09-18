const { getStore } = require("@netlify/blobs");

exports.handler = async function (event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const token = String((event.queryStringParameters || {}).token || "").trim();
  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing token" }) };
  }

  const store = getStore("invites");
  const invite = await store.get(token, { type: "json" });

  if (!invite) {
    // Unknown / tampered token — never reflect anything back from the URL itself.
    return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify({ name: invite.name }),
  };
};
