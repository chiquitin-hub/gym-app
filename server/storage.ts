import { 
  users, type User, type InsertUser,
  routines, type Routine, type InsertRoutine,
  exercises, type Exercise, type InsertExercise,
  classes, type Class, type InsertClass,
  bookings, type Booking, type InsertBooking,
  trainers, type Trainer, type InsertTrainer,
  progress, type Progress, type InsertProgress,
  nutritionGoals, type NutritionGoal, type InsertNutritionGoal,
  notifications, type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Routine operations
  getRoutines(): Promise<Routine[]>;
  getRoutine(id: number): Promise<Routine | undefined>;
  createRoutine(routine: InsertRoutine): Promise<Routine>;
  
  // Exercise operations
  getExercisesByRoutine(routineId: number): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // Class operations
  getClasses(): Promise<Class[]>;
  getClass(id: number): Promise<Class | undefined>;
  createClass(classData: InsertClass): Promise<Class>;
  
  // Booking operations
  getBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  cancelBooking(id: number): Promise<boolean>;
  
  // Trainer operations
  getTrainers(): Promise<Trainer[]>;
  getTrainer(id: number): Promise<Trainer | undefined>;
  createTrainer(trainer: InsertTrainer): Promise<Trainer>;
  
  // Progress operations
  getProgressByUser(userId: number): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  
  // Nutrition operations
  getNutritionGoalByUser(userId: number): Promise<NutritionGoal | undefined>;
  createNutritionGoal(goal: InsertNutritionGoal): Promise<NutritionGoal>;
  
  // Notification operations
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private routines: Map<number, Routine>;
  private exercises: Map<number, Exercise>;
  private classes: Map<number, Class>;
  private bookings: Map<number, Booking>;
  private trainers: Map<number, Trainer>;
  private progress: Map<number, Progress>;
  private nutritionGoals: Map<number, NutritionGoal>;
  private notifications: Map<number, Notification>;
  
  private userIdCounter: number;
  private routineIdCounter: number;
  private exerciseIdCounter: number;
  private classIdCounter: number;
  private bookingIdCounter: number;
  private trainerIdCounter: number;
  private progressIdCounter: number;
  private nutritionGoalIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.routines = new Map();
    this.exercises = new Map();
    this.classes = new Map();
    this.bookings = new Map();
    this.trainers = new Map();
    this.progress = new Map();
    this.nutritionGoals = new Map();
    this.notifications = new Map();
    
    this.userIdCounter = 1;
    this.routineIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.classIdCounter = 1;
    this.bookingIdCounter = 1;
    this.trainerIdCounter = 1;
    this.progressIdCounter = 1;
    this.nutritionGoalIdCounter = 1;
    this.notificationIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // Initialize sample data for demonstration
  private initializeData() {
    // Add sample routines
    this.createRoutine({
      name: "Upper Body Strength",
      description: "Complete upper body workout",
      duration: 45,
      difficulty: "Intermediate",
      category: "Strength",
      imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createRoutine({
      name: "Core Workout",
      description: "Strengthen your core muscles",
      duration: 30,
      difficulty: "Beginner",
      category: "Strength",
      imageUrl: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createRoutine({
      name: "Cardio Blast",
      description: "High intensity cardio workout",
      duration: 50,
      difficulty: "Advanced",
      category: "Cardio",
      imageUrl: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    });
    
    // Add exercises to routines
    this.createExercise({
      routineId: 1,
      name: "Bench Press",
      sets: 3,
      reps: 12,
      order: 1
    });
    
    this.createExercise({
      routineId: 1,
      name: "Shoulder Press",
      sets: 3,
      reps: 10,
      order: 2
    });
    
    this.createExercise({
      routineId: 1,
      name: "Tricep Extensions",
      sets: 3,
      reps: 15,
      order: 3
    });
    
    // Add classes
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    this.createClass({
      name: "Yoga Basics",
      description: "Beginner friendly yoga class",
      startTime: new Date(tomorrow.setHours(10, 30, 0, 0)),
      endTime: new Date(tomorrow.setHours(11, 30, 0, 0)),
      instructor: "Sarah Johnson",
      location: "Studio 2",
      capacity: 15,
      spotsLeft: 5
    });
    
    this.createClass({
      name: "HIIT Training",
      description: "High intensity interval training",
      startTime: new Date(dayAfterTomorrow.setHours(18, 0, 0, 0)),
      endTime: new Date(dayAfterTomorrow.setHours(19, 0, 0, 0)),
      instructor: "Mike Torres",
      location: "Studio 1",
      capacity: 12,
      spotsLeft: 2
    });
    
    this.createClass({
      name: "Spin Class",
      description: "High energy cycling workout",
      startTime: new Date(dayAfterTomorrow.setHours(19, 30, 0, 0)),
      endTime: new Date(dayAfterTomorrow.setHours(20, 30, 0, 0)),
      instructor: "Jessica Kim",
      location: "Studio 3",
      capacity: 20,
      spotsLeft: 0
    });
    
    // Add trainers
    this.createTrainer({
      name: "Mike Torres",
      specialty: "Strength & Conditioning",
      imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      isAvailable: true
    });
    
    this.createTrainer({
      name: "Sarah Johnson",
      specialty: "Yoga & Flexibility",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      isAvailable: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, memberSince: now, level: 1, isPremium: false };
    this.users.set(id, user);
    return user;
  }
  
  async getRoutines(): Promise<Routine[]> {
    return Array.from(this.routines.values());
  }
  
  async getRoutine(id: number): Promise<Routine | undefined> {
    return this.routines.get(id);
  }
  
  async createRoutine(insertRoutine: InsertRoutine): Promise<Routine> {
    const id = this.routineIdCounter++;
    const routine: Routine = { ...insertRoutine, id };
    this.routines.set(id, routine);
    return routine;
  }
  
  async getExercisesByRoutine(routineId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.routineId === routineId)
      .sort((a, b) => a.order - b.order);
  }
  
  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseIdCounter++;
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }
  
  async getClasses(): Promise<Class[]> {
    return Array.from(this.classes.values());
  }
  
  async getClass(id: number): Promise<Class | undefined> {
    return this.classes.get(id);
  }
  
  async createClass(insertClass: InsertClass): Promise<Class> {
    const id = this.classIdCounter++;
    const classData: Class = { ...insertClass, id };
    this.classes.set(id, classData);
    return classData;
  }
  
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId);
  }
  
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const now = new Date();
    const booking: Booking = { ...insertBooking, id, createdAt: now };
    this.bookings.set(id, booking);
    
    // Update spots left in the class
    const classData = this.classes.get(insertBooking.classId);
    if (classData && classData.spotsLeft) {
      classData.spotsLeft -= 1;
      this.classes.set(classData.id, classData);
    }
    
    return booking;
  }
  
  async cancelBooking(id: number): Promise<boolean> {
    const booking = this.bookings.get(id);
    if (!booking) return false;
    
    this.bookings.delete(id);
    
    // Update spots left in the class
    const classData = this.classes.get(booking.classId);
    if (classData) {
      classData.spotsLeft = (classData.spotsLeft || 0) + 1;
      this.classes.set(classData.id, classData);
    }
    
    return true;
  }
  
  async getTrainers(): Promise<Trainer[]> {
    return Array.from(this.trainers.values());
  }
  
  async getTrainer(id: number): Promise<Trainer | undefined> {
    return this.trainers.get(id);
  }
  
  async createTrainer(insertTrainer: InsertTrainer): Promise<Trainer> {
    const id = this.trainerIdCounter++;
    const trainer: Trainer = { ...insertTrainer, id };
    this.trainers.set(id, trainer);
    return trainer;
  }
  
  async getProgressByUser(userId: number): Promise<Progress[]> {
    return Array.from(this.progress.values())
      .filter(progress => progress.userId === userId);
  }
  
  async createProgress(insertProgress: InsertProgress): Promise<Progress> {
    const id = this.progressIdCounter++;
    const now = new Date();
    const progress: Progress = { ...insertProgress, id, date: now };
    this.progress.set(id, progress);
    return progress;
  }
  
  async getNutritionGoalByUser(userId: number): Promise<NutritionGoal | undefined> {
    return Array.from(this.nutritionGoals.values())
      .find(goal => goal.userId === userId);
  }
  
  async createNutritionGoal(insertGoal: InsertNutritionGoal): Promise<NutritionGoal> {
    const id = this.nutritionGoalIdCounter++;
    const goal: NutritionGoal = { ...insertGoal, id };
    this.nutritionGoals.set(id, goal);
    return goal;
  }
  
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const notification: Notification = { ...insertNotification, id, createdAt: now, isRead: false };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }
}

export const storage = new MemStorage();
