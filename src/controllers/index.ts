import { LoginService } from "../services/login.service";
import { UserService } from "../services/user.service";
import { LoginController } from "./login.controller";
import { UserController } from "./user.controller";

const userService = new UserService();
export const userController = new UserController(userService);

const loginService = new LoginService();
export const loginController = new LoginController(loginService);
