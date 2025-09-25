import { DataSource } from "typeorm";
import { Template } from "../src/entities/template.entity";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Template Entity", () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [Template],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  // Teste 1: Validação completa de CRUD
  it("should perform CRUD operations on Template entity", async () => {
    const repository = dataSource.getRepository(Template);

    // CRIAÇÃO - COM OS CAMPOS CORRETOS
    const newTemplate = repository.create({
      name: "Termo de Aceite",
      description: "Documento para aceite de termos de uso.",
      fileName: "termo-aceite.pdf",
      fileUrl: "https://supabase.com/templates/termo-aceite.pdf", // ✅ filePath → fileUrl
      fileSize: 10240,
      mimeType: "application/pdf",
    });
    await repository.save(newTemplate);
    expect(newTemplate.id).toBeDefined();

    // LEITURA
    const foundTemplate = await repository.findOneBy({ id: newTemplate.id });
    expect(foundTemplate).toBeDefined();
    expect(foundTemplate?.name).toBe("Termo de Aceite");

    // ATUALIZAÇÃO
    await repository.update(foundTemplate!.id, {
      description: "Nova descrição.",
    });
    const updatedTemplate = await repository.findOneBy({ id: newTemplate.id });
    expect(updatedTemplate?.description).toBe("Nova descrição.");

    // DELEÇÃO
    await repository.delete(newTemplate.id);
    const deletedTemplate = await repository.findOneBy({ id: newTemplate.id });
    expect(deletedTemplate).toBeNull();
  });

  // Teste 2: Verificar se um template é criado com valores padrão
  it("should create a template with default values", async () => {
    const repository = dataSource.getRepository(Template);
    const newTemplate = repository.create({
      name: "Documento Padrão",
      fileName: "default.txt",
      fileUrl: "https://supabase.com/templates/default.txt", // ✅ filePath → fileUrl
      fileSize: 512,
      mimeType: "text/plain",
    });
    await repository.save(newTemplate);

    expect(newTemplate.isActive).toBe(true);
    expect(newTemplate.createdAt).toBeInstanceOf(Date);
    expect(newTemplate.updatedAt).toBeInstanceOf(Date);
  });

  // Teste 3: Verificar se a data de atualização é alterada (CORRIGIDO)
  it("should update updatedAt on record change", async () => {
    const repository = dataSource.getRepository(Template);

    // Salva o template
    const newTemplate = repository.create({
      name: "Template para atualização",
      description: "Desc",
      fileName: "file.txt",
      fileUrl: "https://supabase.com/templates/file.txt",
      fileSize: 100,
      mimeType: "text/plain",
    });
    await repository.save(newTemplate);

    // ✅ CORREÇÃO: Recarrega do banco para pegar o timestamp exato
    const savedTemplate = await repository.findOneBy({ id: newTemplate.id });
    const initialUpdatedAt = savedTemplate!.updatedAt;

    // ✅ CORREÇÃO: Espera mais tempo (500ms) e usa transaction
    await new Promise((resolve) => setTimeout(resolve, 500));

    // ✅ CORREÇÃO: Atualiza com transaction para forçar o updatedAt
    await repository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update(Template, newTemplate.id, {
        name: "Nome atualizado",
      });
    });

    // ✅ CORREÇÃO: Recarrega o template atualizado
    const updatedTemplate = await repository.findOneBy({ id: newTemplate.id });

    expect(updatedTemplate).toBeDefined();
    expect(updatedTemplate!.updatedAt.getTime()).toBeGreaterThan(
      initialUpdatedAt.getTime()
    );
  });

  // Teste 4: Verificar se o campo `name` não pode ser nulo (CORRIGIDO)
  it("should not allow creating a template with a null name", async () => {
    const repository = dataSource.getRepository(Template);

    // ✅ CORREÇÃO: Use any ou omita a tipagem
    const templateData: any = {
      description: "Documento sem nome.",
      fileName: "no-name.pdf",
      fileUrl: "https://supabase.com/templates/no-name.pdf", // ✅ filePath → fileUrl
      fileSize: 1024,
      mimeType: "application/pdf",
    };

    const newTemplate = repository.create(templateData);
    await expect(repository.save(newTemplate)).rejects.toThrow();
  });
});
