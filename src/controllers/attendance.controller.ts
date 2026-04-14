import { Request, Response } from "express";
import { AttendanceService } from "../services/attendance.service";
import {
  attendanceCheckInSchema,
  attendanceCheckOutSchema,
} from "../schemas/attendance.schema";
import { AppError } from "../errors/AppError.error"; // Importado para manter o padrão de erros do projeto

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
    const studentId = req.params.studentId;

    // Type Guard para garantir que studentId seja uma string única
    if (typeof studentId !== "string") {
      throw new AppError("Invalid Student ID", 400);
    }

    const attendances = await attendanceService.getByStudent(studentId);

    return res.status(200).json(attendances);
  }

  async getByClassroom(req: Request, res: Response): Promise<Response> {
    const classroomId = req.params.classroomId;
    const { date } = req.query;

    // Type Guard para o classroomId (Resolve o erro TS2345)
    if (typeof classroomId !== "string") {
      throw new AppError("Invalid Classroom ID", 400);
    }

    if (!date || typeof date !== "string") {
      // Usando AppError em vez de Error genérico para consistência com o projeto
      throw new AppError("Date query parameter is required (YYYY-MM-DD).", 400);
    }

    const attendances = await attendanceService.getByClassroom(
      classroomId,
      new Date(date),
    );

    return res.status(200).json(attendances);
  }
}