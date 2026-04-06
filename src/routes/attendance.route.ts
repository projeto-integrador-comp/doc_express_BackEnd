import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { validateToken } from "../middlewares/validatetoken.middleware";
import { validateBody } from "../middlewares/validateBody.middleware";
import {
  attendanceCheckInSchema,
  attendanceCheckOutSchema,
} from "../schemas/attendance.schema";

const attendanceRouter = Router();
const attendanceController = new AttendanceController();

attendanceRouter.use(verifyToken, validateToken);

attendanceRouter.post(
  "/check-in",
  validateBody(attendanceCheckInSchema),
  (req, res) => attendanceController.checkIn(req, res),
);

attendanceRouter.post(
  "/check-out",
  validateBody(attendanceCheckOutSchema),
  (req, res) => attendanceController.checkOut(req, res),
);

attendanceRouter.get("/student/:studentId", (req, res) =>
  attendanceController.getByStudent(req, res),
);

attendanceRouter.get("/classroom/:classroomId", (req, res) =>
  attendanceController.getByClassroom(req, res),
);

export { attendanceRouter };
