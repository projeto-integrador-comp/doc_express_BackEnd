import "dotenv/config";
import { AppDataSource } from "./data-source";
import app from "./app";

AppDataSource.initialize()
  .then((): void => {
    console.log("Database connected.");

    const PORT: number = Number(process.env.PORT) || 3000;
    app.listen(PORT, "0.0.0.0", (): void => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err: unknown): void => {
    console.error("Error during Data Source initialization.", err);
  });
