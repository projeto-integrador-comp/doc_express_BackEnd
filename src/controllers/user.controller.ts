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
}
