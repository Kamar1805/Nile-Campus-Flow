import {
  type User,
  type InsertUser,
  type Vehicle,
  type InsertVehicle,
  type Gate,
  type InsertGate,
  type AccessLog,
  type InsertAccessLog,
  type Visitor,
  type InsertVisitor,
  type VehicleWithUser,
  type AccessLogWithDetails,
  type GateWithOfficer,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Vehicles
  getVehicle(id: string): Promise<Vehicle | undefined>;
  getVehicleByPlate(plate: string): Promise<Vehicle | undefined>;
  getVehicleByQRCode(qrCode: string): Promise<Vehicle | undefined>;
  getVehicleByRFID(rfidTag: string): Promise<Vehicle | undefined>;
  getVehiclesByUserId(userId: string): Promise<Vehicle[]>;
  getAllVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<boolean>;

  // Gates
  getGate(id: string): Promise<Gate | undefined>;
  getAllGates(): Promise<Gate[]>;
  getGatesWithOfficers(): Promise<GateWithOfficer[]>;
  createGate(gate: InsertGate): Promise<Gate>;
  updateGate(id: string, gate: Partial<Gate>): Promise<Gate | undefined>;
  deleteGate(id: string): Promise<boolean>;

  // Access Logs
  getAccessLog(id: string): Promise<AccessLog | undefined>;
  getAllAccessLogs(): Promise<AccessLog[]>;
  getAccessLogsWithDetails(): Promise<AccessLogWithDetails[]>;
  getRecentAccessLogs(limit: number): Promise<AccessLogWithDetails[]>;
  getAccessLogsByUserId(userId: string): Promise<AccessLogWithDetails[]>;
  createAccessLog(log: InsertAccessLog): Promise<AccessLog>;

  // Visitors
  getVisitor(id: string): Promise<Visitor | undefined>;
  getVisitorByQRCode(qrCode: string): Promise<Visitor | undefined>;
  getAllVisitors(): Promise<Visitor[]>;
  createVisitor(visitor: InsertVisitor): Promise<Visitor>;
  updateVisitor(id: string, visitor: Partial<Visitor>): Promise<Visitor | undefined>;

  // Stats
  getStats(): Promise<{
    totalUsers: number;
    totalVehicles: number;
    activeGates: number;
    todayAccess: number;
  }>;

  getUserStats(userId: string): Promise<{
    totalAccess: number;
    lastAccess: string | null;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vehicles: Map<string, Vehicle>;
  private gates: Map<string, Gate>;
  private accessLogs: Map<string, AccessLog>;
  private visitors: Map<string, Visitor>;

  constructor() {
    this.users = new Map();
    this.vehicles = new Map();
    this.gates = new Map();
    this.accessLogs = new Map();
    this.visitors = new Map();
    this.seedData();
  }

  private seedData() {
    // Create demo users
    const demoUsers = [
      {
        username: "admin",
        password: "password",
        role: "admin",
        fullName: "Admin User",
        email: "admin@nileuniversity.edu",
        phoneNumber: "+234 123 456 7890",
      },
      {
        username: "security",
        password: "password",
        role: "security_officer",
        fullName: "Security Officer",
        email: "security@nileuniversity.edu",
        phoneNumber: "+234 123 456 7891",
      },
      {
        username: "student",
        password: "password",
        role: "student_staff",
        fullName: "John Student",
        email: "john.student@nileuniversity.edu",
        phoneNumber: "+234 123 456 7892",
      },
      {
        username: "visitor",
        password: "password",
        role: "visitor",
        fullName: "Jane Visitor",
        email: "jane.visitor@example.com",
        phoneNumber: "+234 123 456 7893",
      },
    ];

    demoUsers.forEach((userData) => {
      const id = randomUUID();
      const user: User = {
        ...userData,
        id,
        createdAt: new Date(),
      };
      this.users.set(id, user);
    });

    // Create demo gates
    const demoGates = [
      { name: "Main Gate", location: "University Main Entrance", status: "online", isOpen: false },
      { name: "East Gate", location: "East Campus Entrance", status: "online", isOpen: false },
      { name: "West Gate", location: "West Campus Entrance", status: "online", isOpen: false },
      { name: "North Gate", location: "North Campus Entrance", status: "maintenance", isOpen: false },
    ];

    const securityOfficer = Array.from(this.users.values()).find(u => u.role === "security_officer");
    
    demoGates.forEach((gateData) => {
      const id = randomUUID();
      const gate: Gate = {
        ...gateData,
        id,
        lastActivity: new Date(),
        assignedOfficer: securityOfficer?.id || null,
      };
      this.gates.set(id, gate);
    });

    // Create demo vehicle for student
    const student = Array.from(this.users.values()).find(u => u.role === "student_staff");
    if (student) {
      const vehicleId = randomUUID();
      const vehicle: Vehicle = {
        id: vehicleId,
        userId: student.id,
        licensePlate: "ABC-123-XY",
        make: "Toyota",
        model: "Camry",
        color: "Silver",
        rfidTag: `RFID-${randomUUID().substring(0, 8)}`,
        qrCode: `QR-${vehicleId}`,
        isActive: true,
        createdAt: new Date(),
      };
      this.vehicles.set(vehicleId, vehicle);

      // Create some demo access logs
      const mainGate = Array.from(this.gates.values()).find(g => g.name === "Main Gate");
      if (mainGate) {
        for (let i = 0; i < 5; i++) {
          const logId = randomUUID();
          const log: AccessLog = {
            id: logId,
            vehicleId: vehicle.id,
            userId: student.id,
            gateId: mainGate.id,
            timestamp: new Date(Date.now() - i * 3600000), // Each hour back
            action: i % 2 === 0 ? "entry" : "exit",
            authMethod: i % 3 === 0 ? "rfid" : "qr_code",
            status: "authorized",
            reason: null,
            processedBy: null,
          };
          this.accessLogs.set(logId, log);
        }
      }
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Vehicles
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getVehicleByPlate(plate: string): Promise<Vehicle | undefined> {
    return Array.from(this.vehicles.values()).find((v) => v.licensePlate === plate);
  }

  async getVehicleByQRCode(qrCode: string): Promise<Vehicle | undefined> {
    return Array.from(this.vehicles.values()).find((v) => v.qrCode === qrCode);
  }

  async getVehicleByRFID(rfidTag: string): Promise<Vehicle | undefined> {
    return Array.from(this.vehicles.values()).find((v) => v.rfidTag === rfidTag);
  }

  async getVehiclesByUserId(userId: string): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter((v) => v.userId === userId);
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = randomUUID();
    const vehicle: Vehicle = {
      ...insertVehicle,
      id,
      rfidTag: `RFID-${randomUUID().substring(0, 8)}`,
      qrCode: `QR-${id}`,
      isActive: true,
      createdAt: new Date(),
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;
    const updated = { ...vehicle, ...updates };
    this.vehicles.set(id, updated);
    return updated;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  // Gates
  async getGate(id: string): Promise<Gate | undefined> {
    return this.gates.get(id);
  }

  async getAllGates(): Promise<Gate[]> {
    return Array.from(this.gates.values());
  }

  async getGatesWithOfficers(): Promise<GateWithOfficer[]> {
    const gates = Array.from(this.gates.values());
    return Promise.all(
      gates.map(async (gate) => {
        const officer = gate.assignedOfficer ? await this.getUser(gate.assignedOfficer) : undefined;
        return { ...gate, officer };
      })
    );
  }

  async createGate(insertGate: InsertGate): Promise<Gate> {
    const id = randomUUID();
    const gate: Gate = { ...insertGate, id };
    this.gates.set(id, gate);
    return gate;
  }

  async updateGate(id: string, updates: Partial<Gate>): Promise<Gate | undefined> {
    const gate = this.gates.get(id);
    if (!gate) return undefined;
    const updated = { ...gate, ...updates, lastActivity: new Date() };
    this.gates.set(id, updated);
    return updated;
  }

  async deleteGate(id: string): Promise<boolean> {
    return this.gates.delete(id);
  }

  // Access Logs
  async getAccessLog(id: string): Promise<AccessLog | undefined> {
    return this.accessLogs.get(id);
  }

  async getAllAccessLogs(): Promise<AccessLog[]> {
    return Array.from(this.accessLogs.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getAccessLogsWithDetails(): Promise<AccessLogWithDetails[]> {
    const logs = await this.getAllAccessLogs();
    return Promise.all(
      logs.map(async (log) => {
        const vehicle = (await this.getVehicle(log.vehicleId))!;
        const user = (await this.getUser(log.userId))!;
        const gate = (await this.getGate(log.gateId))!;
        const processedByUser = log.processedBy ? await this.getUser(log.processedBy) : undefined;
        return { ...log, vehicle, user, gate, processedByUser };
      })
    );
  }

  async getRecentAccessLogs(limit: number): Promise<AccessLogWithDetails[]> {
    const logs = await this.getAccessLogsWithDetails();
    return logs.slice(0, limit);
  }

  async getAccessLogsByUserId(userId: string): Promise<AccessLogWithDetails[]> {
    const logs = await this.getAccessLogsWithDetails();
    return logs.filter((log) => log.userId === userId);
  }

  async createAccessLog(insertLog: InsertAccessLog): Promise<AccessLog> {
    const id = randomUUID();
    const log: AccessLog = { ...insertLog, id, timestamp: new Date() };
    this.accessLogs.set(id, log);
    return log;
  }

  // Visitors
  async getVisitor(id: string): Promise<Visitor | undefined> {
    return this.visitors.get(id);
  }

  async getVisitorByQRCode(qrCode: string): Promise<Visitor | undefined> {
    return Array.from(this.visitors.values()).find((v) => v.qrCode === qrCode);
  }

  async getAllVisitors(): Promise<Visitor[]> {
    return Array.from(this.visitors.values());
  }

  async createVisitor(insertVisitor: InsertVisitor): Promise<Visitor> {
    const id = randomUUID();
    const visitor: Visitor = {
      ...insertVisitor,
      id,
      qrCode: `VISITOR-${id}`,
      createdAt: new Date(),
    };
    this.visitors.set(id, visitor);
    return visitor;
  }

  async updateVisitor(id: string, updates: Partial<Visitor>): Promise<Visitor | undefined> {
    const visitor = this.visitors.get(id);
    if (!visitor) return undefined;
    const updated = { ...visitor, ...updates };
    this.visitors.set(id, updated);
    return updated;
  }

  // Stats
  async getStats(): Promise<{
    totalUsers: number;
    totalVehicles: number;
    activeGates: number;
    todayAccess: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalUsers: this.users.size,
      totalVehicles: this.vehicles.size,
      activeGates: Array.from(this.gates.values()).filter((g) => g.status === "online").length,
      todayAccess: Array.from(this.accessLogs.values()).filter(
        (log) => log.timestamp >= today
      ).length,
    };
  }

  async getUserStats(userId: string): Promise<{
    totalAccess: number;
    lastAccess: string | null;
  }> {
    const userLogs = Array.from(this.accessLogs.values()).filter((log) => log.userId === userId);
    const sorted = userLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      totalAccess: userLogs.length,
      lastAccess: sorted.length > 0 ? sorted[0].timestamp.toISOString() : null,
    };
  }
}

export const storage = new MemStorage();
