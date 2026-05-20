import { z } from "zod";

// Schema for user registration
export const registerSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" })
    .trim(),
  email: z.string()
    .email({ message: "Invalid email address format" })
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  role: z.enum(["student", "recruiter"], {
    errorMap: () => ({ message: "Role must be either 'student' or 'recruiter'" })
  })
});

// Schema for user login
export const loginSchema = z.object({
  email: z.string()
    .email({ message: "Invalid email address format" })
    .trim()
    .toLowerCase(),
  password: z.string()
    .min(1, { message: "Password is required" })
});

// Schema for job postings
export const jobSchema = z.object({
  title: z.string()
    .min(3, { message: "Job title must be at least 3 characters long" })
    .max(100, { message: "Job title cannot exceed 100 characters" })
    .trim(),
  company: z.string()
    .min(1, { message: "Company name is required" })
    .trim(),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .trim(),
  skillsRequired: z.array(z.string().trim()).default([]),
  location: z.string()
    .min(1, { message: "Location is required" })
    .trim(),
  stipend: z.string().optional().default(""),
  status: z.enum(["active", "closed"]).optional().default("active"),
  responsibilities: z.array(z.string().trim()).optional().default([]),
  requirements: z.array(z.string().trim()).optional().default([])
});
