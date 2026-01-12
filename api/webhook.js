export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  let raw = "";
  for await (const c of req) raw += c;
  const body = raw ? JSON.parse(raw) : {};
  const event = body.events?.[0];

  console.log("EVENT:", JSON.stringify(event));

  if (!event || !event.replyToken) {
    console.log("NO EVENT OR REPLY TOKEN");
    return res.status(200).send("NO_EVENT");
  }

  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken: event.replyToken,
      messages: [{ type: "text", text: "つながりました！" }],
    }),
  });

  const text = await response.text();
  console.log("LINE RESPONSE STATUS:", response.status);
  console.log("LINE RESPONSE BODY:", text);

  return res.status(200).send("REPLIED");
}