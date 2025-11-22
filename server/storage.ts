// server/storage.ts
import { randomUUID } from "crypto";

export type UserRole = "admin" | "security_officer" | "student_staff" | "visitor";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  rfidTag: string;
  qrCode: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Gate {
  id: string;
  name: string;
  location: string;
  status: string;
  isOpen: boolean;
  lastActivity: Date | null;
  assignedOfficer: string | null;
}

export interface AccessLog {
  id: string;
  vehicleId: string;
  userId: string;
  gateId: string;
  timestamp: Date;
  action: string;
  authMethod: string;
  status: string;
  reason: string | null;
  processedBy: string | null;
}

export interface Visitor {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  purpose: string;
  hostName: string;
  hostContact: string;
  vehiclePlate: string | null;
  qrCode: string;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
}

export class MemStorage {
  users = new Map<string, User>();
  vehicles = new Map<string, Vehicle>();
  gates = new Map<string, Gate>();
  accessLogs = new Map<string, AccessLog>();
  visitors = new Map<string, Visitor>();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Users
    const demoUsers: Omit<User, "id" | "createdAt">[] = [
      {
        username: "admin",
        password: "password",
        role: "admin",
        fullName: "Admin User",
        email: "admin@nileuniversity.edu",
        phoneNumber: "+2341234567890",
      },
      {
        username: "security",
        password: "password",
        role: "security_officer",
        fullName: "Security Officer",
        email: "security@nileuniversity.edu",
        phoneNumber: "+2341234567891",
      },
      {
        username: "student",
        password: "password",
        role: "student_staff",
        fullName: "John Student",
        email: "john.student@nileuniversity.edu",
        phoneNumber: "+2341234567892",
      },
      {
        username: "visitor",
        password: "password",
        role: "visitor",
        fullName: "Jane Visitor",
        email: "jane.visitor@example.com",
        phoneNumber: "+2341234567893",
      },
    ];

    demoUsers.forEach((u) => {
      const id = randomUUID();
      this.users.set(id, { ...u, id, createdAt: new Date() });
    });

    // Gates
    const securityOfficer = Array.from(this.users.values()).find(
      (u) => u.role === "security_officer"
    );

    const demoGates: Omit<Gate, "id" | "lastActivity">[] = [
      { name: "Main Gate Entrance", location: "University Main Entrance", status: "online", isOpen: false, assignedOfficer: securityOfficer?.id ?? null },
      { name: "Main Gate Exit", location: "University Main Exit", status: "online", isOpen: false, assignedOfficer: securityOfficer?.id ?? null },
      { name: "Hostel Gate", location: "Student Hostel Entrance", status: "online", isOpen: false, assignedOfficer: securityOfficer?.id ?? null },
    ];

    demoGates.forEach((g) => {
      const id = randomUUID();
      this.gates.set(id, { ...g, id, lastActivity: new Date() });
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(u: Omit<User, "id" | "createdAt">): Promise<User> {
    const id = randomUUID();
    const user: User = { ...u, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return;
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

  async createVehicle(v: Omit<Vehicle, "id" | "qrCode" | "rfidTag" | "createdAt">): Promise<Vehicle> {
    const id = randomUUID();
    const vehicle: Vehicle = {
      ...v,
      id,
      qrCode: `QR-${id}`,
      rfidTag: `RFID-${randomUUID().substring(0, 8)}`,
      isActive: true,
      createdAt: new Date(),
    };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return;
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

  async createGate(g: Omit<Gate, "id" | "lastActivity">): Promise<Gate> {
    const id = randomUUID();
    const gate: Gate = { ...g, id, lastActivity: new Date() };
    this.gates.set(id, gate);
    return gate;
  }

  async updateGate(id: string, updates: Partial<Gate>): Promise<Gate | undefined> {
    const gate = this.gates.get(id);
    if (!gate) return;
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

  async createAccessLog(a: Omit<AccessLog, "id" | "timestamp">): Promise<AccessLog> {
    const id = randomUUID();
    const log: AccessLog = {
      ...a,
      id,
      timestamp: new Date(),
      reason: a.reason ?? null,
      processedBy: a.processedBy ?? null,
    };
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

  async createVisitor(v: Omit<Visitor, "id" | "qrCode" | "createdAt"> & { qrCode?: string }): Promise<Visitor> {
    const id = randomUUID();
    const visitor: Visitor = {
      ...v,
      id,
      qrCode: v.qrCode ?? `VISITOR-${id}`,
      vehiclePlate: v.vehiclePlate ?? null,
      isActive: v.isActive ?? true,
      createdAt: new Date(),
    };
    this.visitors.set(id, visitor);
    return visitor;
  }

  async updateVisitor(id: string, updates: Partial<Visitor>): Promise<Visitor | undefined> {
    const visitor = this.visitors.get(id);
    if (!visitor) return;
    const updated = { ...visitor, ...updates };
    this.visitors.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
