import { classroomRepository } from "../repositories-new";
import { User, Role } from "../entities/user.entity";
import { Classroom } from "../entities/classroom.entity";
import { AppError } from "../errors/AppError.error";
import {
  TClassroomCreate,
  TClassroomUpdate,
} from "../interfaces/classroom.interface";
import { userRepository } from "../repositories";

export class ClassroomService {
  async create(payload: TClassroomCreate): Promise<Classroom> {
    // Buscar o professor pelo ID
    const teacher = await userRepository.findOneBy({ id: payload.teacherId });
    if (!teacher) {
      throw new AppError("Teacher not found.", 404);
    }

    if (teacher.role !== Role.TEACHER) {
      throw new AppError("User must be a teacher.", 400);
    }

    // Buscar os monitores pelos IDs fornecidos
    let monitors: User[] = [];
    if (payload.monitorIds && payload.monitorIds.length > 0) {
      monitors = await userRepository.find({
        where: payload.monitorIds.map((id) => ({ id })),
      });

      // Validar se todos os monitores existem
      if (monitors.length !== payload.monitorIds.length) {
        throw new AppError("One or more monitors not found.", 404);
      }

      // Validar se todos são realmente monitores
      for (const monitor of monitors) {
        if (monitor.role !== Role.MONITOR && monitor.role !== Role.TEACHER) {
          throw new AppError(
            "User must have role MONITOR or TEACHER to be added as monitor.",
            400,
          );
        }
      }
    }

    const classroom = classroomRepository.create({
      name: payload.name,
      teacher,
      monitors,
    });

    await classroomRepository.save(classroom);
    return classroom;
  }

  async findAll(): Promise<Classroom[]> {
    return await classroomRepository.find({
      relations: ["teacher", "monitors", "students"],
    });
  }

  async findById(id: string): Promise<Classroom> {
    const classroom = await classroomRepository.findOne({
      where: { id },
      relations: ["teacher", "monitors", "students"],
    });

    if (!classroom) {
      throw new AppError("Classroom not found.", 404);
    }

    return classroom;
  }

  async update(id: string, payload: TClassroomUpdate): Promise<Classroom> {
    // 1. Busca a turma existente (já traz as relações via findById)
    const classroom = await this.findById(id);

    // 2. Atualiza o nome se fornecido
    if (payload.name) {
      classroom.name = payload.name;
    }

    // 3. Lógica para atualizar o professor
    if (payload.teacherId) {
      const newTeacher = await userRepository.findOneBy({ id: payload.teacherId });

      if (!newTeacher) {
        throw new AppError("Teacher not found.", 404);
      }

      // Validação de cargo (seguindo o padrão que você já usa no create)
      if (newTeacher.role !== Role.TEACHER && newTeacher.role !== Role.ADMIN) {
        throw new AppError("User must be a teacher or admin to lead a classroom.", 400);
      }

      // Atribui a nova entidade à relação
      classroom.teacher = newTeacher;
    }

    // 4. Salva a turma com o novo vínculo
    await classroomRepository.save(classroom);

    return classroom;
  }

  async delete(id: string): Promise<void> {
    const classroom = await this.findById(id);
    await classroomRepository.remove(classroom);
  }

  async addMonitor(classroomId: string, monitorId: string): Promise<Classroom> {
    // This will be handled through relations update
    const classroom = await this.findById(classroomId);
    return classroom;
  }
}
