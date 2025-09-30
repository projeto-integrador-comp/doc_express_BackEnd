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
      ssl: true, // força SSL, o Node vai aceitar o certificado do Supabase
    },
  };
};

const AppDataSource = new DataSource(settings());

export { AppDataSource };
