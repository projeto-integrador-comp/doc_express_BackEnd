import { Request, Response } from "express";
import { StudentService } from "../services/student.service";
import {
  studentUpdateSchema,
  studentCreateSchema,
} from "../schemas/student.schema";
import { Role } from "../entities/user.entity";
import { AppError } from "../errors/AppError.error"; // Importado para manter o padrão do projeto

const studentService = new StudentService();

export class StudentController {
  async create(req: Request, res: Response): Promise<Response> {
    const userRole = res.locals.decoded.role;
    if (userRole !== Role.ADMIN && userRole !== Role.TEACHER) {
      throw new AppError("Insufficient permission.", 403);
    }

    const payload = studentCreateSchema.parse(req.body);
    const student = await studentService.create(payload);

    return res.status(201).json(student);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const students = await studentService.findAll();
    return res.status(200).json(students);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;

    // Type Guard para garantir que o ID é uma string
    if (typeof id !== "string") {
      throw new AppError("Invalid ID", 400);
    }

    const student = await studentService.findById(id);
    return res.status(200).json(student);
  }

  async findByClassroom(req: Request, res: Response): Promise<Response> {
    const classroomId = req.params.classroomId;

    // Type Guard para o classroomId
    if (typeof classroomId !== "string") {
      throw new AppError("Invalid Classroom ID", 400);
    }

    const students = await studentService.findByClassroom(classroomId);
    return res.status(200).json(students);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError("Invalid ID", 400);
    }

    const payload = studentUpdateSchema.parse(req.body);
    const updated = await studentService.update(id, payload);

    return res.status(200).json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError("Invalid ID", 400);
    }

    await studentService.delete(id);
    return res.status(204).send();
  }
}