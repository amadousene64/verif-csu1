// Serveur local (facultatif) : même comportement que sur Vercel.
// Sans mot de passe : node server.js
// Avec mot de passe (Windows) : set ACCES_MOT_DE_PASSE=monmotdepasse&& node server.js
// puis ouvrir http://localhost:3000
const http = require("http");
const fs = require("fs");
const path = require("path");
const relais = require("./api/beneficiaire");

const PORT = process.env.PORT || 3000;
const PAGE = path.join(__dirname, "index.html");

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/beneficiaire") {
    req.query = Object.fromEntries(url.searchParams);
    return relais(req, res);
  }

  if (url.pathname === "/" || url.pathname === "/index.html") {
    return fs.readFile(PAGE, (err, data) => {
      if (err) { res.writeHead(500); return res.end("index.html introuvable"); }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  }

  res.writeHead(404); res.end("Introuvable");
}).listen(PORT, () => {
  console.log(`Vérification CSU prête : http://localhost:${PORT}`);
  console.log(process.env.ACCES_MOT_DE_PASSE ? "Accès protégé par mot de passe." : "Accès libre (aucun mot de passe).");
});
