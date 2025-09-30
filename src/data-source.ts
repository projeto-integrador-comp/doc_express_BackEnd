import "dotenv/config";
import { DataSource, DataSourceOptions } from "typeorm";
import path from "path";

const settings = (): DataSourceOptions => {
  const entitiesPath: string = path.join(__dirname, "./entities/**.{ts,js}");
  const migrationPath: string = path.join(__dirname, "./migrations/**.{ts,js}");

  const databaseUrl: string | undefined = process.env.DATABASE_URL;

  if (!databaseUrl) throw new Error("Missing env var: 'DATABASE_URL'");

  return {
    type: "postgres",
    url: databaseUrl,
    synchronize: false,
    logging: true,
    entities: [entitiesPath],
    migrations: [migrationPath],
    extra: {
      ssl: {
        rejectUnauthorized: false, // garante que o certificado self-signed será aceito
      },
    },
  };
};

const AppDataSource = new DataSource(settings());

export { AppDataSource };
