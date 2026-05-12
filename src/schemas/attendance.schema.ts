import { z } from "zod";

export const attendanceCheckInSchema = z.object({
  studentId: z.string().uuid("Student ID must be a valid UUID"),  
  date: z.string(), 
  status: z.string().max(1),   
  checkIn: z.string().nullable().optional(), 
  observation: z.string().max(255).nullable().optional(),
});

export const attendanceCheckOutSchema = z.object({
  studentId: z.string().uuid("Student ID must be a valid UUID"),
  date: z.string(),
  checkOut: z.string().nullable().optional(),
  observation: z.string().max(255).nullable().optional(),
});

export const attendanceReturnSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  date: z.string(),
  status: z.string().nullable().optional(),
  checkIn: z.any().nullable(),
  checkOut: z.any().nullable(),
  observation: z.any().nullable(),
});
