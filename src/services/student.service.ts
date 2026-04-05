import { studentRepository } from "../repositories-new";
import { Student } from "../entities/student.entity";
import { AppError } from "../errors/AppError.error";
import {
  TStudentCreate,
  TStudentUpdate,
} from "../interfaces/student.interface";
import { classroomRepository } from "../repositories-new";

export class StudentService {
  async create(payload: TStudentCreate): Promise<Student> {
    const classroom = await classroomRepository.findOne({
      where: { id: payload.classroomId },
    });

    if (!classroom) {
      throw new AppError("Classroom not found.", 404);
    }

    const student = studentRepository.create({
      name: payload.name,
      classroom,
    });

    await studentRepository.save(student);
    return student;
  }

  async findAll(): Promise<Student[]> {
    return await studentRepository.find({
      relations: ["classroom"],
    });
  }

  async findById(id: string): Promise<Student> {
    const student = await studentRepository.findOne({
      where: { id },
      relations: ["classroom"],
    });

    if (!student) {
      throw new AppError("Student not found.", 404);
    }

    return student;
  }

  async findByClassroom(classroomId: string): Promise<Student[]> {
    return await studentRepository.find({
      where: { classroom: { id: classroomId } },
      relations: ["classroom"],
    });
  }

  async update(id: string, payload: TStudentUpdate): Promise<Student> {
    const student = await this.findById(id);

    if (payload.name) student.name = payload.name;

    await studentRepository.save(student);

    return student;
  }

  async delete(id: string): Promise<void> {
    const student = await this.findById(id);
    await studentRepository.remove(student);
  }
}
