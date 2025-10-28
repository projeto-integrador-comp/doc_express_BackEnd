import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import bcrypt from "bcryptjs";

async function createAdminUser() {
  try {
    // --------- Conectar ao banco ---------
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Conexão com banco estabelecida.");
    }

    const userRepo = AppDataSource.getRepository(User);

    // --------- Criar hash da senha ---------
    const passwordHash = await bcrypt.hash("admin123", 10);

    // --------- Usuário admin ---------
    const adminUser = userRepo.create({
      name: "Administrador",
      email: "admin@docexpress.com",
      password: passwordHash,
      admin: true,
    });

    // --------- Upsert: cria ou atualiza se já existir ---------
    await userRepo
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(adminUser)
      .orUpdate(["name", "password", "admin"], ["email"])
      .execute();

    console.log(
      "Usuário administrador criado ou atualizado com sucesso:",
      adminUser.email
    );
  } catch (err: any) {
    console.error("❌ Erro ao criar usuário administrador:", err.message);
  } finally {
    await AppDataSource.destroy();
  }
}

createAdminUser();
