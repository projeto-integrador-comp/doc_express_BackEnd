import { Request, Response } from "express";
import { ClassroomService } from "../services/classroom.service";
import {
  classroomUpdateSchema,
  classroomCreateSchema,
} from "../schemas/classroom.schema";
import { Role } from "../entities/user.entity";
import { AppError } from "../errors/AppError.error"; // Importante para manter o padrão de erros

const classroomService = new ClassroomService();

export class ClassroomController {
  async create(req: Request, res: Response): Promise<Response> {
    const userRole = res.locals.decoded.role;
    if (userRole !== Role.ADMIN && userRole !== Role.TEACHER) {
      // Usando AppError para o seu projeto entender o erro
      throw new AppError("Only admins and teachers can create classrooms.", 403);
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
    const id = req.params.id;

    // A PROTEÇÃO DE TIPO: Resolve o erro TS2345
    if (typeof id !== "string") {
      throw new AppError("Invalid ID", 400);
    }

    const classroom = await classroomService.findById(id);
    return res.status(200).json(classroom);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const userRole = res.locals.decoded.role;
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new AppError("Invalid ID", 400);
    }

    // Mantendo sua regra: Only admin or the teacher of the classroom can update
    const classroom = await classroomService.findById(id);
    const userId = res.locals.decoded.sub;
    
    if (userRole !== Role.ADMIN && classroom.teacher.id !== userId) {
      throw new AppError("Insufficient permission.", 403);
    }

    const payload = classroomUpdateSchema.parse(req.body);
    const updated = await classroomService.update(id, payload);

    return res.status(200).json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const userRole = res.locals.decoded.role;
    if (userRole !== Role.ADMIN) {
      throw new AppError("Only admins can delete classrooms.", 403);
    }

    const id = req.params.id;
    if (typeof id !== "string") {
      throw new AppError("Invalid ID", 400);
    }

    await classroomService.delete(id);
    return res.status(204).send();
  }
}