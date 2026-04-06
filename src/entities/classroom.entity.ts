import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Student } from "./student.entity";

@Entity("classrooms")
export class Classroom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 120 })
  name: string;

  @ManyToOne(() => User, { nullable: false })
  teacher: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: "classroom_monitors",
    joinColumn: { name: "classroom_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "monitor_id", referencedColumnName: "id" },
  })
  monitors: User[];

  @OneToMany(() => Student, (s) => s.classroom)
  students: Student[];
}
