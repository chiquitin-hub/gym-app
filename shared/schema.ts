import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  memberSince: timestamp("member_since").defaultNow(),
  level: integer("level").default(1),
  isPremium: boolean("is_premium").default(false)
});

export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  category: text("category"), // strength, cardio, flexibility, etc.
  imageUrl: text("image_url")
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  routineId: integer("routine_id").notNull(),
  name: text("name").notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  order: integer("order")
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  instructor: text("instructor"),
  location: text("location"),
  capacity: integer("capacity"),
  spotsLeft: integer("spots_left")
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  classId: integer("class_id").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const trainers = pgTable("trainers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty"),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true)
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  weight: integer("weight"), // in kg
  bodyFat: integer("body_fat"), // in percentage
  classesAttended: integer("classes_attended"),
  calories: integer("calories")
});

export const nutritionGoals = pgTable("nutrition_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dailyCalories: integer("daily_calories"),
  proteinPercentage: integer("protein_percentage"),
  carbsPercentage: integer("carbs_percentage"),
  fatsPercentage: integer("fats_percentage"),
  waterIntake: integer("water_intake") // in ml
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type"), // reminder, update, confirmation, etc.
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false)
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertRoutineSchema = createInsertSchema(routines).omit({ id: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertClassSchema = createInsertSchema(classes).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true });
export const insertTrainerSchema = createInsertSchema(trainers).omit({ id: true });
export const insertProgressSchema = createInsertSchema(progress).omit({ id: true });
export const insertNutritionGoalSchema = createInsertSchema(nutritionGoals).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });

// Auth schema
export const authSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
});

export const registerSchema = authSchema.extend({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" })
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Routine = typeof routines.$inferSelect;
export type InsertRoutine = z.infer<typeof insertRoutineSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Trainer = typeof trainers.$inferSelect;
export type InsertTrainer = z.infer<typeof insertTrainerSchema>;
export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type NutritionGoal = typeof nutritionGoals.$inferSelect;
export type InsertNutritionGoal = z.infer<typeof insertNutritionGoalSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Auth = z.infer<typeof authSchema>;
export type Register = z.infer<typeof registerSchema>;
