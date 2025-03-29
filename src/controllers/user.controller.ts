import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { TUserCreate } from "../interfaces/user.interface";

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response) {
    const reqBody: TUserCreate = req.body;
    const newUser = await this.userService.create(reqBody);

    return res.status(201).json(newUser);
  }

  async read(req: Request, res: Response) {
    const users = await this.userService.read();
    return res.json(users);
  }

  readOne(req: Request, res: Response) {
    const user = this.userService.readOne(res.locals.foundUser);
    return res.json(user);
  }

  async update(req: Request, res: Response) {
    const user = await this.userService.update(res.locals.foundUser, req.body);
    return res.json(user);
  }

  async remove(req: Request, res: Response) {
    await this.userService.remove(res.locals.foundUser);
    return res.status(204).json();
  }
}
