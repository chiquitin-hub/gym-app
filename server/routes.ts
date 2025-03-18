import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authSchema, 
  registerSchema, 
  insertBookingSchema, 
  insertProgressSchema, 
  insertNutritionGoalSchema 
} from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "gym_app_secret_key";

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: "Authentication token required" });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    (req as any).user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const newUser = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user data (without password) and token
      const { password, ...userData } = newUser;
      return res.status(201).json({ user: userData, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = authSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user data (without password) and token
      const { password, ...userData } = user;
      return res.json({ user: userData, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Server error. Please try again later." });
    }
  });
  
  // Workout routines routes
  app.get("/api/routines", async (req, res) => {
    try {
      const routines = await storage.getRoutines();
      return res.json(routines);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch routines" });
    }
  });
  
  app.get("/api/routines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid routine ID" });
      }
      
      const routine = await storage.getRoutine(id);
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      const exercises = await storage.getExercisesByRoutine(id);
      
      return res.json({ ...routine, exercises });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch routine details" });
    }
  });
  
  // Classes routes
  app.get("/api/classes", async (req, res) => {
    try {
      const classes = await storage.getClasses();
      return res.json(classes);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch classes" });
    }
  });
  
  // Bookings routes
  app.get("/api/bookings", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      const bookings = await storage.getBookingsByUser(userId);
      
      // Get full class details for each booking
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
          const classDetails = await storage.getClass(booking.classId);
          return { ...booking, class: classDetails };
        })
      );
      
      return res.json(bookingsWithDetails);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });
  
  app.post("/api/bookings", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      const validatedData = insertBookingSchema.parse({
        ...req.body,
        userId
      });
      
      // Check if class exists and has available spots
      const classData = await storage.getClass(validatedData.classId);
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }
      
      if (classData.spotsLeft === 0) {
        return res.status(400).json({ message: "Class is full" });
      }
      
      // Create booking
      const booking = await storage.createBooking(validatedData);
      
      // Create notification
      await storage.createNotification({
        userId,
        title: "Booking confirmed",
        message: `Your ${classData.name} class has been confirmed`,
        type: "confirmation"
      });
      
      return res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Failed to create booking" });
    }
  });
  
  app.delete("/api/bookings/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const success = await storage.cancelBooking(id);
      if (!success) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Failed to cancel booking" });
    }
  });
  
  // Trainers routes
  app.get("/api/trainers", async (req, res) => {
    try {
      const trainers = await storage.getTrainers();
      return res.json(trainers);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch trainers" });
    }
  });
  
  // Progress routes
  app.get("/api/progress", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      const progress = await storage.getProgressByUser(userId);
      return res.json(progress);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch progress data" });
    }
  });
  
  app.post("/api/progress", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      const validatedData = insertProgressSchema.parse({
        ...req.body,
        userId
      });
      
      const progress = await storage.createProgress(validatedData);
      return res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Failed to record progress" });
    }
  });
  
  // Nutrition routes
  app.get("/api/nutrition", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      const nutritionGoal = await storage.getNutritionGoalByUser(userId);
      
      if (!nutritionGoal) {
        // Create default nutrition goals if none exist
        const defaultGoal = await storage.createNutritionGoal({
          userId,
          dailyCalories: 2100,
          proteinPercentage: 30,
          carbsPercentage: 50,
          fatsPercentage: 20,
          waterIntake: 2000
        });
        
        return res.json(defaultGoal);
      }
      
      return res.json(nutritionGoal);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch nutrition data" });
    }
  });
  
  app.post("/api/nutrition", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      const validatedData = insertNutritionGoalSchema.parse({
        ...req.body,
        userId
      });
      
      // Check if user already has nutrition goals
      const existingGoal = await storage.getNutritionGoalByUser(userId);
      
      if (existingGoal) {
        // Update existing goal (in a real DB, this would be an update operation)
        // For in-memory storage, we're creating a new record
        const updatedGoal = await storage.createNutritionGoal({
          ...validatedData,
          userId
        });
        return res.json(updatedGoal);
      }
      
      // Create new goal
      const goal = await storage.createNutritionGoal(validatedData);
      return res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      return res.status(500).json({ message: "Failed to update nutrition goals" });
    }
  });
  
  // Notifications routes
  app.get("/api/notifications", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      const notifications = await storage.getNotificationsByUser(userId);
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  
  app.patch("/api/notifications/:id/read", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }
      
      const success = await storage.markNotificationAsRead(id);
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
