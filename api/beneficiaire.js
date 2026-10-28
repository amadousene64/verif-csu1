// Relais protégé vers l'API CSU.
// Sur Vercel : servi à /api/beneficiaire. En local : utilisé par server.js.
// Mot de passe FACULTATIF : défini dans la variable d'environnement ACCES_MOT_DE_PASSE.
// Si la variable est absente ou vide, l'accès est libre (aucun mot de passe demandé).
const crypto = require("crypto");

const API = "https://scancarte.sunucsu.sn/api/beneficiairess/codeImmatriculation?code=";

function motDePasseOk(fourni) {
  const attendu = process.env.ACCES_MOT_DE_PASSE || "";
  if (!attendu) return false; // aucun mot de passe configuré → tout est refusé
  const a = crypto.createHash("sha256").update(String(fourni || "")).digest();
  const b = crypto.createHash("sha256").update(attendu).digest();
  return crypto.timingSafeEqual(a, b);
}

function repondre(res, status, corps) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(typeof corps === "string" ? corps : JSON.stringify(corps));
}

module.exports = async (req, res) => {
  if (process.env.ACCES_MOT_DE_PASSE && !motDePasseOk(req.headers["x-code-acces"])) {
    return repondre(res, 401, { erreur: "Mot de passe incorrect." });
  }

  const code = String((req.query && req.query.code) || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{4,20}$/.test(code)) {
    return repondre(res, 400, { erreur: "Code invalide." });
  }

  try {
    const r = await fetch(API + encodeURIComponent(code), { headers: { Accept: "application/json" } });
    const texte = await r.text();
    return repondre(res, r.status, texte);
  } catch (e) {
    return repondre(res, 502, { erreur: "API CSU injoignable." });
  }
};
