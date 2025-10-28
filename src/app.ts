import "reflect-metadata";
import "express-async-errors";
import express, { Application, json } from "express";
import cors from "cors";
import { loginRouter } from "./routes/login.route";
import { userRouter } from "./routes/user.route";
import { handleAppError } from "./middlewares/handleAppError.middleware";
import { profileRouter } from "./routes/profile.route";
import { documentRouter } from "./routes/document.route";
import templateRouter from "./routes/template.route";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const app: Application = express();

// -------------------------
// CONFIGURAÇÃO DO SUPABASE
// -------------------------
function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn(
      "⚠️ Supabase não configurado. Conexões reais não funcionarão."
    );
    return null;
  }

  return createClient(url, anonKey);
}

const supabase = getSupabaseClient();

// -------------------------
// CORS
// -------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      /\.vercel\.app$/, // aceita deploys no Vercel
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// -------------------------
// Middlewares
// -------------------------
app.use(json());

// -------------------------
// Health checks
// -------------------------
app.get("/ping", (req, res) => {
  res.status(200).json({
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(200).json({
        status: "healthy",
        database: "skipped",
        timestamp: new Date().toISOString(),
      });
    }

    // Teste simples de conexão com Supabase
    const { data, error } = await supabase
      .from("users") // qualquer tabela existente
      .select("id")
      .limit(1);

    if (error) throw error;

    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// -------------------------
// Rotas
// -------------------------
app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/profile", profileRouter);
app.use("/documents", documentRouter);
app.use("/templates", templateRouter);

// -------------------------
// Tratamento de erros
// -------------------------
app.use(handleAppError);

export default app;
export { supabase }; // exporta para usar em outras rotas se quiser
