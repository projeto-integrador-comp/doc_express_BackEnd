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
import path from "path";

const app: Application = express();

app.use(json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://pi-creche.vercel.app"],
    credentials: true,
  })
);

app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/profile", profileRouter);
app.use("/documents", documentRouter);
app.use("/templates", templateRouter);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(handleAppError);

export default app;
