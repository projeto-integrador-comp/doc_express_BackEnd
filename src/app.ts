import "reflect-metadata";
import "express-async-errors";
import express, { Application, json } from "express";
import cors from "cors";
import { loginRouter } from "./routes/login.route";
import { userRouter } from "./routes/user.route";
import { handleAppError } from "./middlewares/handleAppError.middleware";
import { profileRouter } from "./routes/profile.route";

const app: Application = express();

app.use(json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/profile",profileRouter)

app.use(handleAppError);

export default app;
