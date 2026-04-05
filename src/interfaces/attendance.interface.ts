import { z } from "zod";
import {
  attendanceCheckInSchema,
  attendanceCheckOutSchema,
  attendanceReturnSchema,
} from "../schemas/attendance.schema";

export type TAttendanceCheckIn = z.infer<typeof attendanceCheckInSchema>;
export type TAttendanceCheckOut = z.infer<typeof attendanceCheckOutSchema>;
export type TAttendanceReturn = z.infer<typeof attendanceReturnSchema>;
