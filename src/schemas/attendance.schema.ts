import { z } from "zod";

export const attendanceCheckInSchema = z.object({
  studentId: z.string().uuid("Student ID must be a valid UUID"),
  date: z.string().date("Date must be in YYYY-MM-DD format"),
  status: z.string().max(1).optional(),
  checkIn: z.string().optional(),
  observation: z.string().max(255).optional(),
});

export const attendanceCheckOutSchema = z.object({
  studentId: z.string().uuid("Student ID must be a valid UUID"),
  date: z.string().date("Date must be in YYYY-MM-DD format"),
  checkOut: z.string().optional(),
  observation: z.string().max(255).optional(),
});

export const attendanceReturnSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  date: z.string(),
  status: z.string().nullable(),
  checkIn: z.string().datetime().nullable(),
  checkOut: z.string().datetime().nullable(),
  observation: z.string().nullable(),
});
