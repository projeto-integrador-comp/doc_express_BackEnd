import { Router } from "express";
import { ClassroomController } from "../controllers/classroom.controller";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { validateToken } from "../middlewares/validatetoken.middleware";
import { validateBody } from "../middlewares/validateBody.middleware";
import {
  classroomCreateSchema,
  classroomUpdateSchema,
} from "../schemas/classroom.schema";

const classroomRouter = Router();
const classroomController = new ClassroomController();

classroomRouter.use(verifyToken, validateToken);

classroomRouter.post("/", validateBody(classroomCreateSchema), (req, res) =>
  classroomController.create(req, res),
);

classroomRouter.get("/", (req, res) => classroomController.findAll(req, res));

classroomRouter.get("/:id", (req, res) =>
  classroomController.findById(req, res),
);

classroomRouter.patch("/:id", validateBody(classroomUpdateSchema), (req, res) =>
  classroomController.update(req, res),
);

classroomRouter.delete("/:id", (req, res) =>
  classroomController.delete(req, res),
);

export { classroomRouter };
