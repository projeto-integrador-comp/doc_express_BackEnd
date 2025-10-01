import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "date" })
  submissionDate: Date;

  @Column({ length: 50 })
  documentName: string;

  @Column({ length: 50, default: "" })
  note: string;

  @Column({ default: false })
  delivered: boolean;

  @ManyToOne(() => User, (u) => u.documents, {
    onDelete: "CASCADE",
  })
  user: User;

  // === Attachment fields ===
  @Column({ type: "text", nullable: true })
  fileUrl: string | null = null;

  @Column({ type: "varchar", length: 255, nullable: true })
  fileName: string | null = null;

  @Column({ type: "varchar", length: 100, nullable: true })
  mimeType: string | null = null;

  @Column({ type: "int", nullable: true })
  fileSize: number | null = null;

  @Column({ type: "timestamp", nullable: true })
  fileUploadedAt: Date | null = null;
}
