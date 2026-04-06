import { AppDataSource } from "./data-source";
import { Classroom } from "./entities/classroom.entity";
import { Student } from "./entities/student.entity";
import { Attendance } from "./entities/attendance.entity";

const classroomRepository = AppDataSource.getRepository(Classroom);
const studentRepository = AppDataSource.getRepository(Student);
const attendanceRepository = AppDataSource.getRepository(Attendance);

export { classroomRepository, studentRepository, attendanceRepository };
