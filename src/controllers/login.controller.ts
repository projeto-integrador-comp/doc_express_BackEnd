import { Request, Response } from "express";
import { LoginService } from "../services/login.service";

export class LoginController {
  constructor(private loginService: LoginService) {}
  async login(req: Request, res: Response) {
    const content = await this.loginService.generateToken(req.body);

    return res.status(content.statusCode).json(content.res);
  }
}
