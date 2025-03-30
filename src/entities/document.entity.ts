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

  @ManyToOne(() => User, (u) => u.documents, {
    onDelete: "CASCADE",
  })
  user: User;
}
