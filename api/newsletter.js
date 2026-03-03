/**
 * Vercel Serverless Function — Newsletter subscription via Brevo
 *
 * Required env vars (set in Vercel dashboard):
 *   BREVO_API_KEY   — your Brevo API key (v3)
 *   BREVO_LIST_ID   — numeric ID of the Brevo contact list
 *
 * POST /api/newsletter
 * Body: { email: string }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body ?? {};
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID ? parseInt(process.env.BREVO_LIST_ID, 10) : null;

  // If API key is not yet configured, log a warning and succeed silently
  if (!apiKey) {
    console.warn("[newsletter] BREVO_API_KEY not set — skipping Brevo call");
    return res.status(200).json({ success: true });
  }

  try {
    const payload = {
      email,
      updateEnabled: true,
      ...(listId ? { listIds: [listId] } : {}),
    };

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!brevoRes.ok) {
      const data = await brevoRes.json().catch(() => ({}));
      // "Contact already exist" (sic) is a Brevo 400 — treat as success
      if (brevoRes.status === 400 && data.message?.toLowerCase().includes("contact already exist")) {
        return res.status(200).json({ success: true });
      }
      console.error("[newsletter] Brevo error:", brevoRes.status, data);
      return res.status(500).json({ error: "Subscription failed" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[newsletter] Unexpected error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
