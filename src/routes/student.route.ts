import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { validateToken } from "../middlewares/validatetoken.middleware";
import { validateBody } from "../middlewares/validateBody.middleware";
import {
  studentCreateSchema,
  studentUpdateSchema,
} from "../schemas/student.schema";

const studentRouter = Router();
const studentController = new StudentController();

studentRouter.use(verifyToken, validateToken);

studentRouter.post("/", validateBody(studentCreateSchema), (req, res) =>
  studentController.create(req, res),
);

studentRouter.get("/", (req, res) => studentController.findAll(req, res));

studentRouter.get("/classroom/:classroomId", (req, res) =>
  studentController.findByClassroom(req, res),
);

studentRouter.get("/:id", (req, res) => studentController.findById(req, res));

studentRouter.patch("/:id", validateBody(studentUpdateSchema), (req, res) =>
  studentController.update(req, res),
);

studentRouter.delete("/:id", (req, res) => studentController.delete(req, res));

export { studentRouter };
