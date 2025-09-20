import { DataSource } from "typeorm";
import { Template } from "../src/entities/template.entity";

describe("Template Entity - SQLite Integration", () => {
  let dataSource: DataSource;

  // Configuração antes de todos os testes
  beforeAll(async () => {
    dataSource = new DataSource({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "myuser",
      password: "mypass",
      database: "docexpress",
      entities: [Template],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();
    console.log("✅ Banco de dados SQLite inicializado em memória");
  });

  // Limpa os dados após cada teste
  afterEach(async () => {
    await dataSource.getRepository(Template).clear();
  });

  // Fecha a conexão após todos os testes
  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log("✅ Conexão com banco de dados fechada");
    }
  });

  // Teste de Criação (CREATE)
  describe("Create Operation", () => {
    it("deve criar um novo Template com sucesso", async () => {
      const templateRepo = dataSource.getRepository(Template);

      const templateData = {
        name: "Contrato de Prestação de Serviços",
        description: "Modelo padrão para contratos de serviços",
        fileName: "contrato_servicos.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 10240,
        filePath: "SUPABASE_BUCKET_TEMPLATES",
      };

      const template = templateRepo.create(templateData);
      const savedTemplate = await templateRepo.save(template);

      // Verificações
      expect(savedTemplate).toHaveProperty("id");
      expect(savedTemplate.id).toBeTruthy();
      expect(savedTemplate.name).toBe(templateData.name);
      expect(savedTemplate.description).toBe(templateData.description);
      expect(savedTemplate.fileName).toBe(templateData.fileName);
      expect(savedTemplate.mimeType).toBe(templateData.mimeType);
      expect(savedTemplate.fileSize).toBe(templateData.fileSize);
      expect(savedTemplate.filePath).toBe(templateData.filePath);
      expect(savedTemplate.createdAt).toBeInstanceOf(Date);
      expect(savedTemplate.updatedAt).toBeInstanceOf(Date);
    });

    it("deve falhar ao criar um Template sem nome", async () => {
      const templateRepo = dataSource.getRepository(Template);

      const templateData = {
        // name: 'Campo obrigatório faltando',
        description: "Descrição do template",
        fileName: "documento.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 2048,
        filePath: "/templates/documento.docx",
      };

      let errorOccurred = false;

      try {
        const template = templateRepo.create(templateData as any);
        await templateRepo.save(template);
      } catch (error) {
        errorOccurred = true;
        expect(error).toBeDefined();
      }

      expect(errorOccurred).toBe(true);
    });
  });

  // Teste de Leitura (READ)
  describe("Read Operations", () => {
    it("deve buscar um Template por ID", async () => {
      const templateRepo = dataSource.getRepository(Template);

      const templateData = {
        name: "Modelo para Teste de Leitura",
        description: "Descrição para teste de busca",
        fileName: "teste_leitura.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 2048,
        filePath: "/templates/teste_leitura.docx",
      };

      const template = templateRepo.create(templateData);
      const savedTemplate = await templateRepo.save(template);

      const foundTemplate = await templateRepo.findOneBy({
        id: savedTemplate.id,
      });

      expect(foundTemplate).toBeDefined();
      expect(foundTemplate?.id).toBe(savedTemplate.id);
      expect(foundTemplate?.name).toBe(templateData.name);
      expect(foundTemplate?.description).toBe(templateData.description);
      expect(foundTemplate?.fileName).toBe(templateData.fileName);
    });

    it("deve retornar null ao buscar por ID inexistente", async () => {
      const templateRepo = dataSource.getRepository(Template);

      const foundTemplate = await templateRepo.findOneBy({
        id: "id-inexistente",
      });

      expect(foundTemplate).toBeNull();
    });

    it("deve buscar todos os Templates", async () => {
      const templateRepo = dataSource.getRepository(Template);

      // Cria alguns templates
      const template1 = templateRepo.create({
        name: "Template 1",
        description: "Descrição 1",
        fileName: "template1.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 1024,
        filePath: "/templates/template1.docx",
      });

      const template2 = templateRepo.create({
        name: "Template 2",
        description: "Descrição 2",
        fileName: "template2.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 2048,
        filePath: "/templates/template2.docx",
      });

      await templateRepo.save([template1, template2]);

      // Busca todos
      const allTemplates = await templateRepo.find();

      expect(allTemplates).toHaveLength(2);
      expect(allTemplates[0].name).toBe("Template 1");
      expect(allTemplates[1].name).toBe("Template 2");
    });
  });

  // Teste de Atualização (UPDATE)
  describe("Update Operation", () => {
    it("deve atualizar o nome e descrição de um Template", async () => {
      const templateRepo = dataSource.getRepository(Template);

      const templateData = {
        name: "Nome Original",
        description: "Descrição Original",
        fileName: "original.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 1024,
        filePath: "/templates/original.docx",
      };

      const template = templateRepo.create(templateData);
      const savedTemplate = await templateRepo.save(template);

      // Aguarda um pouco para garantir que o timestamp será diferente
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Atualiza o nome e descrição
      await templateRepo.update(savedTemplate.id, {
        name: "Nome Atualizado",
        description: "Descrição Atualizada",
      });

      const updatedTemplate = await templateRepo.findOneBy({
        id: savedTemplate.id,
      });

      expect(updatedTemplate?.name).toBe("Nome Atualizado");
      expect(updatedTemplate?.description).toBe("Descrição Atualizada");
      expect(updatedTemplate?.fileName).toBe(templateData.fileName); // Não mudou

      // Verifica que updatedAt foi atualizado
      expect(updatedTemplate?.updatedAt.getTime()).toBeGreaterThan(
        savedTemplate.updatedAt.getTime()
      );
    });
  });

  // Teste de Exclusão (DELETE)
  describe("Delete Operation", () => {
    it("deve deletar um Template existente", async () => {
      const templateRepo = dataSource.getRepository(Template);

      const templateData = {
        name: "Template para Deletar",
        description: "Este template será deletado",
        fileName: "deletar.docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 1024,
        filePath: "/templates/deletar.docx",
      };

      const template = templateRepo.create(templateData);
      const savedTemplate = await templateRepo.save(template);

      // Verifica que foi salvo
      const foundBeforeDelete = await templateRepo.findOneBy({
        id: savedTemplate.id,
      });
      expect(foundBeforeDelete).toBeDefined();

      // Deleta o template
      const deleteResult = await templateRepo.delete(savedTemplate.id);
      expect(deleteResult.affected).toBe(1);

      // Verifica que foi deletado
      const foundAfterDelete = await templateRepo.findOneBy({
        id: savedTemplate.id,
      });
      expect(foundAfterDelete).toBeNull();
    });

    it("deve retornar affected 0 ao tentar deletar Template inexistente", async () => {
      const templateRepo = dataSource.getRepository(Template);

      const deleteResult = await templateRepo.delete("id-inexistente");
      expect(deleteResult.affected).toBe(0);
    });
  });
});
