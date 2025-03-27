import "reflect-metadata";
import "express-async-errors";
import express, { Application, json } from "express";
import { handleAppError } from "./middlewares/handleAppError.middleware";
import cors from "cors";
import { routes } from "./routes";

const app: Application = express();

app.use(json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/", routes);

app.use(handleAppError);

export default app;
