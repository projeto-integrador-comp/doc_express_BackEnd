import { Request, Response } from "express";
import { StudentService } from "../services/student.service";
import {
  studentUpdateSchema,
  studentCreateSchema,
} from "../schemas/student.schema";
import { Role } from "../entities/user.entity";

const studentService = new StudentService();

export class StudentController {
  async create(req: Request, res: Response): Promise<Response> {
    const userRole = res.locals.decoded.role;
    if (userRole !== Role.ADMIN && userRole !== Role.TEACHER) {
      throw new Error("Insufficient permission.");
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
    const { id } = req.params;
    const student = await studentService.findById(id);

    return res.status(200).json(student);
  }

  async findByClassroom(req: Request, res: Response): Promise<Response> {
    const { classroomId } = req.params;
    const students = await studentService.findByClassroom(classroomId);

    return res.status(200).json(students);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const payload = studentUpdateSchema.parse(req.body);
    const updated = await studentService.update(id, payload);

    return res.status(200).json(updated);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    await studentService.delete(id);

    return res.status(204).send();
  }
}
