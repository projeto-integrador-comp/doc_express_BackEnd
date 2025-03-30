import { TLoginRequest } from "../interfaces/login.interface";
import { userRepository } from "../repositories";
import { sign } from "jsonwebtoken";
import { loginReturnSchema } from "../schemas/login.schema";
import { compare } from "bcryptjs";

export class LoginService {
  async generateToken(data: TLoginRequest): Promise<any> {
    const { email, password } = data;

    const foundUser = await userRepository.findOne({
      where: { email },
      relations: ["documents"],
    });
    if (!foundUser) {
      const content = {
        statusCode: 401,
        res: { message: "Invalid credentials." },
      };
      return content;
    }
    const matchPassword = await compare(password, foundUser.password);
    if (!matchPassword) {
      const content = {
        statusCode: 401,
        res: { message: "Invalid credentials." },
      };
      return content;
    }

    const token: string = sign(
      { admin: foundUser.admin },
      process.env.SECRET_KEY!,
      {
        subject: foundUser.id,
        expiresIn: "3h",
      }
    );
    const content = {
      statusCode: 200,
      res: loginReturnSchema.parse({ token, user: foundUser }),
    };
    return content;
  }
}
