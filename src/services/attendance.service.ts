import { attendanceRepository, studentRepository } from "../repositories-new";
import { Attendance } from "../entities/attendance.entity";
import { Student } from "../entities/student.entity";
import { AppError } from "../errors/AppError.error";
import {
  TAttendanceCheckIn,
  TAttendanceCheckOut,
} from "../interfaces/attendance.interface";

export class AttendanceService {
  async checkIn(payload: TAttendanceCheckIn | any): Promise<Attendance> {
    const student = await studentRepository.findOne({
      where: { id: payload.studentId },
    });

    if (!student) {
      throw new AppError("Student not found.", 404);
    }

    
    const dateStr = typeof payload.date === 'string' ? payload.date.split('T')[0] : payload.date;

    
    let attendance = await attendanceRepository.findOne({
      where: {
        student: { id: payload.studentId },
        date: dateStr as any, 
      },
    });

    
    if (!attendance) {
      attendance = attendanceRepository.create({
        student,
        date: dateStr,
      });
    }

    
    attendance.status = payload.status; 
    attendance.observation = payload.observation || attendance.observation || "";

    
    if (payload.status === 'F') {
      
      attendance.checkIn = null;
      attendance.checkOut = null;
    } else {      
      
      attendance.checkIn = payload.checkIn ? new Date(payload.checkIn) : (attendance.checkIn || new Date());
    }

    
    await attendanceRepository.save(attendance);
    return attendance;
  }

  async checkOut(payload: TAttendanceCheckOut | any): Promise<Attendance> {
    const student = await studentRepository.findOne({
      where: { id: payload.studentId },
    });

    if (!student) {
      throw new AppError("Student not found.", 404);
    }

    
    const dateStr = typeof payload.date === 'string' ? payload.date.split('T')[0] : payload.date;

    const attendance = await attendanceRepository.findOne({
      where: {
        student: { id: payload.studentId },
        date: dateStr as any,
      },
    });

    if (!attendance) {
      throw new AppError("Attendance record not found for this date. Register check-in first.", 404);
    }

    if (attendance.status === 'F') {
      throw new AppError("Cannot check-out a student marked as absent.", 400);
    }

    
    attendance.checkOut = payload.checkOut ? new Date(payload.checkOut) : new Date();
    
    if (payload.observation !== undefined) {
      attendance.observation = payload.observation;
    }

    await attendanceRepository.save(attendance);
    return attendance;
  }

  async getByStudent(studentId: string): Promise<Attendance[]> {
    return await attendanceRepository.find({
      where: { student: { id: studentId } },
      relations: ["student"],
      order: { date: "DESC" } 
    });
  }

  async getByClassroom(classroomId: string, date: Date): Promise<Attendance[]> {
    const students = await studentRepository.find({
      where: { classroom: { id: classroomId } },
    });

    const studentIds = students.map((s: Student) => s.id);

    if (studentIds.length === 0) {
      return [];
    }

    const formattedDate = typeof date === 'string' ? date : date.toISOString().split("T")[0];

    return await attendanceRepository
      .createQueryBuilder("attendance")
      .leftJoinAndSelect("attendance.student", "student")
      .where("attendance.date = :date", { date: formattedDate })
      .andWhere("student.id IN (:...studentIds)", { studentIds })
      .orderBy("attendance.checkIn", "ASC")
      .getMany();
  }
}