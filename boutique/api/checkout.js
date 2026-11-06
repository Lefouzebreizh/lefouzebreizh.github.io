const PRICES = { album: process.env.PRICE_ALBUM_ID, edition: process.env.PRICE_EDITION_ID };

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée." });
  const secret = process.env.STRIPE_SECRET_KEY;
  const filesReady = process.env.ALBUM_BLOB_URL && process.env.EDITION_BLOB_URL;
  if (!secret || !PRICES.album || !PRICES.edition || !filesReady) return res.status(503).json({ error: "Le paiement et le téléchargement sont encore en préparation." });
  const offer = req.body && req.body.offer;
  const price = PRICES[offer];
  if (!price) return res.status(400).json({ error: "Cette édition n’existe pas." });
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const base = (process.env.PUBLIC_SITE_URL || protocol + "://" + host).replace(/\/$/, "");
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("line_items[0][price]", price);
  body.set("line_items[0][quantity]", "1");
  body.set("success_url", base + "/merci.html?session_id={CHECKOUT_SESSION_ID}");
  body.set("cancel_url", base + "/#editions");
  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: "Bearer " + secret, "Content-Type": "application/x-www-form-urlencoded" }, body });
    const result = await response.json();
    if (!response.ok || !result.url) return res.status(502).json({ error: "Stripe n’a pas pu ouvrir le paiement." });
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ url: result.url });
  } catch {
    return res.status(502).json({ error: "Connexion momentanément impossible." });
  }
};
