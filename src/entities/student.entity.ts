import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Classroom } from "./classroom.entity";
import { Attendance } from "./attendance.entity";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 120 })
  name: string;

  @ManyToOne(() => Classroom, (c) => c.students, { nullable: false })
  classroom: Classroom;

  @OneToMany(() => Attendance, (a) => a.student)
  attendances: Attendance[];
}
