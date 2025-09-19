import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("templates")
export class Template {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 255 })
  description: string;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column("int")
  fileSize: number;

  @Column("varchar")
  mimeType: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
