export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const API_URL = process.env.API_URL;  // URL de tu Apps Script /exec
    const API_KEY = process.env.API_KEY;  // Clave secreta

    if (!API_URL || !API_KEY) {
      return res.status(500).json({ ok: false, error: "Missing API_URL or API_KEY" });
    }

    const params = new URLSearchParams(req.query);
    params.set("key", API_KEY);  // añade la clave secreta
    params.delete("callback");   // elimina callback si lo hubiera

    const upstream = await fetch(`${API_URL}?${params.toString()}`);
    const data = await upstream.json();

    return res.status(upstream.ok ? 200 : upstream.status).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || "proxy_error" });
  }
}
