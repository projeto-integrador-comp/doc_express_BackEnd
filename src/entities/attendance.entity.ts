import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./student.entity";

@Entity("attendances")
export class Attendance {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Student, (s) => s.attendances, { nullable: false })
  student: Student;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "timestamp", nullable: true })
  checkIn: Date | null;

  @Column({ type: "timestamp", nullable: true })
  checkOut: Date | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  observation: string | null;

  @Column({ type: "varchar", length: 1, nullable: true })
  status: string;
}
