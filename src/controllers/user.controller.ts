import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { TUserCreate } from "../interfaces/user.interface";

export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Criação Única de Usuários
   * O Admin envia o role (TEACHER ou MONITOR) no payload.
   */
  async create(req: Request, res: Response) {
    const reqBody: TUserCreate = req.body;
    const newUser = await this.userService.create(reqBody);

    return res.status(201).json(newUser);
  }

  /**
   * Listagem Geral (Acesso restrito ao Admin via Rota)
   */
  async read(req: Request, res: Response) {
    const users = await this.userService.read();
    return res.json(users);
  }

  /**
   * Busca Específica
   * Utiliza o foundUser já validado pelo middleware verifyId.
   */
  readOne(req: Request, res: Response) {
    // res.locals.foundUser foi definido no middleware verifyId
    const user = this.userService.readOne(res.locals.foundUser);
    return res.json(user);
  }

  /**
   * Atualização de Perfil
   * Pode ser feita pelo Admin ou pelo Próprio Usuário (Owner).
   */
  async update(req: Request, res: Response) {
    const user = await this.userService.update(res.locals.foundUser, req.body);
    return res.json(user);
  }

  /**
   * Remoção de Usuário
   */
  async remove(req: Request, res: Response) {
    await this.userService.remove(res.locals.foundUser);
    return res.status(204).json();
  }
}