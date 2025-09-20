import { DataSource } from 'typeorm';
import { Template } from '../src/entities/template.entity';

// Helper function to introduce a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Template Entity', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
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
  it('should perform CRUD operations on Template entity', async () => {
    const repository = dataSource.getRepository(Template);

    // CRIAÇÃO
    const newTemplate = repository.create({
      name: 'Termo de Aceite',
      description: 'Documento para aceite de termos de uso.',
      fileName: 'termo-aceite.pdf',
      filePath: '/docs/termo-aceite.pdf',
      fileSize: 10240,
      mimeType: 'application/pdf',
    });
    await repository.save(newTemplate);
    expect(newTemplate.id).toBeDefined();

    // LEITURA
    const foundTemplate = await repository.findOneBy({ id: newTemplate.id });
    expect(foundTemplate).toBeDefined();
    expect(foundTemplate?.name).toBe('Termo de Aceite');
    
    // ATUALIZAÇÃO
    await repository.update(foundTemplate!.id, { description: 'Nova descrição.' });
    const updatedTemplate = await repository.findOneBy({ id: newTemplate.id });
    expect(updatedTemplate?.description).toBe('Nova descrição.');

    // DELEÇÃO
    await repository.delete(newTemplate.id);
    const deletedTemplate = await repository.findOneBy({ id: newTemplate.id });
    expect(deletedTemplate).toBeNull();
  });

  // Teste 2: Verificar se um template é criado com valores padrão
  it('should create a template with default values', async () => {
    const repository = dataSource.getRepository(Template);
    const newTemplate = repository.create({
      name: 'Documento Padrão',
      fileName: 'default.txt',
      filePath: '/docs/default.txt',
      fileSize: 512,
      mimeType: 'text/plain',
    });
    await repository.save(newTemplate);
    
    expect(newTemplate.isActive).toBe(true);
    expect(newTemplate.createdAt).toBeInstanceOf(Date);
    expect(newTemplate.updatedAt).toBeInstanceOf(Date);
  });
  
  // Teste 3: Verificar se a data de atualização é alterada
  it('should update updatedAt on record change', async () => {
      const repository = dataSource.getRepository(Template);
      const newTemplate = repository.create({
          name: 'Template para atualização',
          description: 'Desc',
          fileName: 'file.txt',
          filePath: 'path',
          fileSize: 100,
          mimeType: 'text/plain',
      });

      await repository.save(newTemplate);
      const initialUpdatedAt = newTemplate.updatedAt;
      
      // CORREÇÃO FINAL: Espera 10ms para garantir que o timestamp do banco de dados mude.
      await sleep(4000);
      
      await repository.update(newTemplate.id, { name: 'Nome atualizado' });
      
      const updatedTemplate = await repository.findOneBy({ id: newTemplate.id });
      
      // A data de atualização deve ser maior que a data de atualização inicial
      expect(updatedTemplate).toBeDefined();
      expect(updatedTemplate!.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
  });

  // Teste 4: Verificar se o campo `name` não pode ser nulo
  it('should not allow creating a template with a null name', async () => {
    const repository = dataSource.getRepository(Template);
    
    // Omitindo 'name' intencionalmente para causar o erro
    const newTemplate = repository.create({
      description: 'Documento sem nome.',
      fileName: 'no-name.pdf',
      filePath: '/docs/no-name.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    } as Template);
    
    await expect(repository.save(newTemplate)).rejects.toThrow();
  });
});

