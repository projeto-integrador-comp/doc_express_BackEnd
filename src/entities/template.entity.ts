import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("templates")
export class Template {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ nullable: false })
  fileName: string;

  // @Column({ nullable: false })
  // filePath: string;
  @Column({ length: 500, nullable:true})
  fileUrl: string;

  @Column("int")
  fileSize: number;

  @Column("varchar")
  mimeType: string;

  @Column({ default: true })
  isActive: boolean;

  // CORREÇÃO: Usando @CreateDateColumn para garantir que a data
  // seja adicionada automaticamente apenas na criação.
  @CreateDateColumn()
  createdAt: Date;

  // CORREÇÃO: Usando @UpdateDateColumn para garantir que a data
  // seja atualizada automaticamente em qualquer alteração do registro.
  @UpdateDateColumn()
  updatedAt: Date;
}

