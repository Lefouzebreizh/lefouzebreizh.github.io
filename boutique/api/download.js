const { Readable } = require("stream");

async function retrieveSession(id, secret) {
  const url = new URL("https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(id));
  url.searchParams.append("expand[]", "line_items");
  const response = await fetch(url, { headers: { Authorization: "Bearer " + secret } });
  if (!response.ok) return null;
  return response.json();
}

async function retrievePrivateBlob(url) {
  const { get } = await import("@vercel/blob");
  return get(url, { access: "private" });
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end("Méthode non autorisée.");
  const secret = process.env.STRIPE_SECRET_KEY;
  const id = typeof req.query.session_id === "string" ? req.query.session_id : "";
  if (!secret || !id || !/^cs_(test|live)_[A-Za-z0-9_]+$/.test(id)) return res.status(400).end("Lien de téléchargement invalide.");
  try {
    const session = await retrieveSession(id, secret);
    const expectedLive = secret.startsWith("sk_live_");
    if (!session || session.status !== "complete" || session.payment_status !== "paid" || session.livemode !== expectedLive) return res.status(403).end("Paiement confirmé introuvable.");
    const purchased = session.line_items && session.line_items.data && session.line_items.data.map(item => item.price && item.price.id);
    const albumPrice = process.env.PRICE_ALBUM_ID;
    const editionPrice = process.env.PRICE_EDITION_ID;
    let fileUrl, filename;
    if (purchased && purchased.includes(editionPrice)) {
      fileUrl = process.env.EDITION_BLOB_URL;
      filename = "Souffler_sur_les_Breizh_avec_livret.zip";
    } else if (purchased && purchased.includes(albumPrice)) {
      fileUrl = process.env.ALBUM_BLOB_URL;
      filename = "Souffler_sur_les_Breizh_album.zip";
    }
    if (!fileUrl) return res.status(503).end("Le téléchargement est en cours de préparation.");
    const parsed = new URL(fileUrl);
    if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".private.blob.vercel-storage.com")) return res.status(503).end("Le stockage privé n’est pas configuré.");
    const file = await retrievePrivateBlob(parsed.toString());
    if (!file || file.statusCode !== 200 || !file.stream) return res.status(502).end("Le fichier n’est pas disponible pour le moment.");
    res.setHeader("Content-Type", file.blob.contentType || "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="' + filename + '"');
    res.setHeader("Cache-Control", "private, no-store, max-age=0");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (typeof file.blob.size === "number") res.setHeader("Content-Length", String(file.blob.size));
    Readable.fromWeb(file.stream).pipe(res);
  } catch {
    if (!res.headersSent) return res.status(502).end("Téléchargement momentanément indisponible.");
    res.end();
  }
};
