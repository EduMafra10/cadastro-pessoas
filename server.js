const express = require("express");
const jsonServer = require("json-server");

const path = require("path");

const app = express();
const porta = process.env.PORT || 3000;

const pastaPublica = path.join(__dirname, "public");
const arquivoBanco = path.join(__dirname, "db.json");

app.use(express.json());

app.use(express.static(pastaPublica));

app.use("/api", jsonServer.router(arquivoBanco));

app.listen(porta, "0.0.0.0", () => {
  console.log(`Servidor iniciado na porta ${porta}`);
});