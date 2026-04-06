import { attendanceRepository, studentRepository } from "../repositories-new";
import { Attendance } from "../entities/attendance.entity";
import { Student } from "../entities/student.entity";
import { AppError } from "../errors/AppError.error";
import {
  TAttendanceCheckIn,
  TAttendanceCheckOut,
} from "../interfaces/attendance.interface";

export class AttendanceService {
  async checkIn(payload: TAttendanceCheckIn): Promise<Attendance> {
    const student = await studentRepository.findOne({
      where: { id: payload.studentId },
    });

    if (!student) {
      throw new AppError("Student not found.", 404);
    }

    const dateObj = new Date(payload.date);

    // Check if there's already a check-in for this date
    const existingAttendance = await attendanceRepository.findOne({
      where: {
        student: { id: payload.studentId },
        date: dateObj,
      },
    });

    if (existingAttendance && existingAttendance.checkIn) {
      throw new AppError("Student already checked in today.", 400);
    }

    let attendance: Attendance;

    if (existingAttendance) {
      attendance = existingAttendance;
      attendance.checkIn = new Date();
    } else {
      attendance = attendanceRepository.create({
        student,
        date: dateObj,
        checkIn: new Date(),
      });
    }

    if (payload.observation) {
      attendance.observation = payload.observation;
    }

    await attendanceRepository.save(attendance);
    return attendance;
  }

  async checkOut(payload: TAttendanceCheckOut): Promise<Attendance> {
    const student = await studentRepository.findOne({
      where: { id: payload.studentId },
    });

    if (!student) {
      throw new AppError("Student not found.", 404);
    }

    const dateObj = new Date(payload.date);

    const attendance = await attendanceRepository.findOne({
      where: {
        student: { id: payload.studentId },
        date: dateObj,
      },
    });

    if (!attendance) {
      throw new AppError("Attendance record not found.", 404);
    }

    if (!attendance.checkIn) {
      throw new AppError("Cannot check out without check in.", 400);
    }

    if (attendance.checkOut) {
      throw new AppError("Student already checked out today.", 400);
    }

    attendance.checkOut = new Date();
    if (payload.observation) {
      attendance.observation = payload.observation;
    }

    await attendanceRepository.save(attendance);
    return attendance;
  }

  async getByStudent(studentId: string): Promise<Attendance[]> {
    return await attendanceRepository.find({
      where: { student: { id: studentId } },
      relations: ["student"],
    });
  }

  async getByClassroom(classroomId: string, date: Date): Promise<Attendance[]> {
    // Get all students in classroom
    const students = await studentRepository.find({
      where: { classroom: { id: classroomId } },
    });

    const studentIds = students.map((s: Student) => s.id);

    if (studentIds.length === 0) {
      return [];
    }

    const formattedDate = date.toISOString().split("T")[0];

    return await attendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.student", "student")
      .where("attendance.date = :date", { date: formattedDate })
      .andWhere("student.id IN (:...studentIds)", { studentIds })
      .orderBy("attendance.checkIn", "ASC")
      .getMany();
  }
}
