import { Request, Response } from "express";
import { ClassroomService } from "../services/classroom.service";
import { validateBody } from "../middlewares/validateBody.middleware";
import {
  classroomUpdateSchema,
  classroomCreateSchema,
} from "../schemas/classroom.schema";
import { Role } from "../entities/user.entity";
import { AppError } from "../errors/AppError.error";

const classroomService = new ClassroomService();

export class ClassroomController {
  async create(req: Request, res: Response): Promise<Response> {
    const userRole = res.locals.decoded.role;
    if (userRole !== Role.ADMIN && userRole !== Role.TEACHER) {
      throw new Error("Only admins and teachers can create classrooms.");
    }

    const payload = classroomCreateSchema.parse(req.body);
    const classroom = await classroomService.create(payload);

    return res.status(201).json(classroom);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const classrooms = await classroomService.findAll();
    return res.status(200).json(classrooms);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof id !== 'string') {
   throw new AppError("Classroom not found.", 404);
 }

    const classroom = await classroomService.findById(id);

    return res.status(200).json(classroom);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const userRole = res.locals.decoded.role;
    const { id } = req.params;

    // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof id !== 'string') {
   throw new AppError("Classroom not found.", 404);
 }

    // Only admin or the teacher of the classroom can update
    const classroom = await classroomService.findById(id);
    const userId = res.locals.decoded.sub;
    if (userRole !== Role.ADMIN && classroom.teacher.id !== userId) {
      throw new Error("Insufficient permission.");
    }

    const payload = classroomUpdateSchema.parse(req.body);
    const updated = await classroomService.update(id, payload);

    return res.status(200).json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const userRole = res.locals.decoded.role;
    if (userRole !== Role.ADMIN) {
      throw new Error("Only admins can delete classrooms.");
    }

    const { id } = req.params;

    // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof id !== 'string') {
   throw new AppError("User not found.", 404);
 }
    
    await classroomService.delete(id);

    return res.status(204).send();
  }
}
