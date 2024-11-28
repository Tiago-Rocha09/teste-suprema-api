import express from "express";
import "dotenv/config";
import dotenv from "dotenv";
import cors from "cors";

import pageRoutes from "./routes/page.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("API Desafio Suprema");
});

app.use(express.json());
app.use("/pages", pageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
