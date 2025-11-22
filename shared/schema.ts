import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles: admin, security_officer, student_staff, visitor
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // admin, security_officer, student_staff, visitor
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  licensePlate: text("license_plate").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  color: text("color").notNull(),
  rfidTag: text("rfid_tag").unique(), // virtual RFID tag ID
  qrCode: text("qr_code").unique(), // QR code identifier
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gates = pgTable("gates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // e.g., "Main Gate", "East Gate"
  location: text("location").notNull(),
  status: text("status").notNull(), // online, offline, maintenance
  isOpen: boolean("is_open").default(false).notNull(),
  lastActivity: timestamp("last_activity"),
  assignedOfficer: varchar("assigned_officer").references(() => users.id),
});

export const accessLogs = pgTable("access_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull().references(() => vehicles.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  gateId: varchar("gate_id").notNull().references(() => gates.id),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  action: text("action").notNull(), // entry, exit
  authMethod: text("auth_method").notNull(), // rfid, qr_code, manual_override
  status: text("status").notNull(), // authorized, denied, manual_override
  reason: text("reason"), // for denials or manual overrides
  processedBy: varchar("processed_by").references(() => users.id), // security officer who processed
});

export const visitors = pgTable("visitors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  purpose: text("purpose").notNull(),
  hostName: text("host_name").notNull(),
  hostContact: text("host_contact").notNull(),
  vehiclePlate: text("vehicle_plate"),
  qrCode: text("qr_code").unique(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  rfidTag: true,
  qrCode: true,
  createdAt: true,
});

export const insertGateSchema = createInsertSchema(gates).omit({
  id: true,
});

export const insertAccessLogSchema = createInsertSchema(accessLogs).omit({
  id: true,
  timestamp: true,
});

export const insertVisitorSchema = createInsertSchema(visitors).omit({
  id: true,
  qrCode: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export type InsertGate = z.infer<typeof insertGateSchema>;
export type Gate = typeof gates.$inferSelect;

export type InsertAccessLog = z.infer<typeof insertAccessLogSchema>;
export type AccessLog = typeof accessLogs.$inferSelect;

export type InsertVisitor = z.infer<typeof insertVisitorSchema>;
export type Visitor = typeof visitors.$inferSelect;

// Extended types for API responses
export type VehicleWithUser = Vehicle & { user: User };
export type AccessLogWithDetails = AccessLog & {
  vehicle: Vehicle;
  user: User;
  gate: Gate;
  processedByUser?: User;
};
export type GateWithOfficer = Gate & { officer?: User };
