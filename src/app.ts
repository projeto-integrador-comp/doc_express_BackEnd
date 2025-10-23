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
// import path from "path";
import { createClient } from "@supabase/supabase-js";

const app: Application = express();

// ✅ CORS PRIMEIRO - antes de qualquer middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      /\.vercel\.app$/, // ← Isso aqui aceita pi-creche.vercel.app, doc-express-frontend-1cbeeypwb.vercel.app, etc.
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Health check que mantém o banco vivo
app.get("/health", async (req, res) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    // Query simples para testar conexão com o banco
    const { data, error } = await supabase
      .from("users") // use qualquer tabela que exista
      .select("id")
      .limit(1);

    if (error) throw error;

    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      region: process.env.REGION || "unknown",
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

// Health check simples (fallback)
app.get("/ping", (req, res) => {
  res.status(200).json({
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Handler explícito para requisições OPTIONS (Preflight)
app.options("*", cors());

// ✅ Depois os outros middlewares
app.use(json());

app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/profile", profileRouter);
app.use("/documents", documentRouter);
app.use("/templates", templateRouter);
// app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(handleAppError);

export default app;
