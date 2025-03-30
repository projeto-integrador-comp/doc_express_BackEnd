import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";

export class ProfileController {
  constructor(private profileService: ProfileService) {}
  read(req: Request, res: Response) {
    const user = this.profileService.read(res.locals.foundUser);

    return res.json(user);
  }
}
