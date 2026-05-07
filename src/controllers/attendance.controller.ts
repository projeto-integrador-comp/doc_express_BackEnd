import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service";
import {
  attendanceCheckInSchema,
  attendanceCheckOutSchema,
} from "../schemas/attendance.schema";
import { AppError } from "../errors/AppError.error";

const attendanceService = new AttendanceService();

export class AttendanceController {
  async checkIn(req: Request, res: Response): Promise<Response> {
    const payload = attendanceCheckInSchema.parse(req.body);
    const attendance = await attendanceService.checkIn(payload);

    return res.status(201).json(attendance);
  }

  async checkOut(req: Request, res: Response): Promise<Response> {
    const payload = attendanceCheckOutSchema.parse(req.body);
    const attendance = await attendanceService.checkOut(payload);

    return res.status(200).json(attendance);
  }

  async getByStudent(req: Request, res: Response): Promise<Response> {
    const { studentId } = req.params;

    // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof studentId !== 'string') {
   throw new AppError("Student not found.", 404);
 }


    const attendances = await attendanceService.getByStudent(studentId);

    return res.status(200).json(attendances);
  }

  async getByClassroom(req: Request, res: Response): Promise<Response> {
    const { classroomId } = req.params;

    // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof classroomId !== 'string') {
   throw new AppError("Classroom ID isnot found.", 404);
 }


    const { date } = req.query;

    if (!date || typeof date !== "string") {
      throw new Error("Date query parameter is required (YYYY-MM-DD).");
    }

    const attendances = await attendanceService.getByClassroom(
      classroomId,
      new Date(date),
    );

    return res.status(200).json(attendances);
  }
}
