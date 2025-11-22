import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertVehicleSchema, insertGateSchema, insertAccessLogSchema, insertVisitorSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication - Mock login (any credentials work)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      // Mock authentication - check if user exists or create demo user
      let user = await storage.getUserByUsername(username);

      if (!user) {
        // For demo, any username works - create user with appropriate role
        const role = username === "admin" ? "admin" :
                    username === "security" ? "security_officer" :
                    username === "student" || username === "staff" ? "student_staff" :
                    "visitor";

        user = await storage.createUser({
          username,
          password,
          role,
          fullName: `${username.charAt(0).toUpperCase() + username.slice(1)} User`,
          email: `${username}@nileuniversity.edu`,
          phoneNumber: `+234 ${Math.floor(Math.random() * 1000000000)}`,
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/my-stats", async (req, res) => {
    try {
      // In a real app, get user ID from session
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("User stats error:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  // Gates
  app.get("/api/gates", async (req, res) => {
    try {
      const gates = await storage.getGatesWithOfficers();
      res.json(gates);
    } catch (error) {
      console.error("Gates fetch error:", error);
      res.status(500).json({ error: "Failed to fetch gates" });
    }
  });

  app.post("/api/gates", async (req, res) => {
    try {
      const validated = insertGateSchema.parse(req.body);
      const gate = await storage.createGate(validated);
      res.json(gate);
    } catch (error) {
      console.error("Gate creation error:", error);
      res.status(400).json({ error: "Invalid gate data" });
    }
  });

  app.patch("/api/gates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const gate = await storage.updateGate(id, req.body);
      if (!gate) {
        return res.status(404).json({ error: "Gate not found" });
      }
      res.json(gate);
    } catch (error) {
      console.error("Gate update error:", error);
      res.status(500).json({ error: "Failed to update gate" });
    }
  });

  app.post("/api/gates/override", async (req, res) => {
    try {
      const { gateId, action, reason } = req.body;

      const gate = await storage.getGate(gateId);
      if (!gate) {
        return res.status(404).json({ error: "Gate not found" });
      }

      // Update gate status
      await storage.updateGate(gateId, {
        isOpen: action === "open",
      });

      // Log the manual override
      const log = await storage.createAccessLog({
        vehicleId: "", // Manual override may not have vehicle
        userId: req.body.userId || "", // Should be security officer
        gateId,
        action: action === "open" ? "entry" : "exit",
        authMethod: "manual_override",
        status: "manual_override",
        reason,
        processedBy: req.body.userId || null,
      });

      res.json({ success: true, gate, log });
    } catch (error) {
      console.error("Gate override error:", error);
      res.status(500).json({ error: "Failed to override gate" });
    }
  });

  // Vehicles
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Vehicles fetch error:", error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/my-vehicles", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const vehicles = await storage.getVehiclesByUserId(userId);
      res.json(vehicles);
    } catch (error) {
      console.error("User vehicles fetch error:", error);
      res.status(500).json({ error: "Failed to fetch user vehicles" });
    }
  });

  app.post("/api/vehicles", async (req, res) => {
    try {
      const validated = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validated);
      res.json(vehicle);
    } catch (error) {
      console.error("Vehicle creation error:", error);
      res.status(400).json({ error: "Invalid vehicle data" });
    }
  });

  app.patch("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await storage.updateVehicle(id, req.body);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Vehicle update error:", error);
      res.status(500).json({ error: "Failed to update vehicle" });
    }
  });

  app.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteVehicle(id);
      if (!success) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Vehicle deletion error:", error);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // Access Logs
  app.get("/api/access-logs", async (req, res) => {
    try {
      const logs = await storage.getAccessLogsWithDetails();
      res.json(logs);
    } catch (error) {
      console.error("Access logs fetch error:", error);
      res.status(500).json({ error: "Failed to fetch access logs" });
    }
  });

  app.get("/api/access-logs/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const logs = await storage.getRecentAccessLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Recent logs fetch error:", error);
      res.status(500).json({ error: "Failed to fetch recent logs" });
    }
  });

  app.get("/api/my-access-history", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }
      const logs = await storage.getAccessLogsByUserId(userId);
      res.json(logs);
    } catch (error) {
      console.error("User access history error:", error);
      res.status(500).json({ error: "Failed to fetch access history" });
    }
  });

  // Access Scan (QR/RFID)
  app.post("/api/access/scan", async (req, res) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({ error: "Code required" });
      }

      // Try to find vehicle by QR code or RFID
      let vehicle = await storage.getVehicleByQRCode(code);
      if (!vehicle) {
        vehicle = await storage.getVehicleByRFID(code);
      }

      // If not a vehicle, check if it's a visitor code
      if (!vehicle) {
        const visitor = await storage.getVisitorByQRCode(code);
        if (visitor) {
          // Check if visitor pass is valid
          const now = new Date();
          if (visitor.isActive && visitor.validFrom <= now && visitor.validUntil >= now) {
            return res.json({
              type: "visitor",
              authorized: true,
              visitor,
              message: "Visitor access granted",
            });
          } else {
            return res.status(403).json({
              type: "visitor",
              authorized: false,
              message: "Visitor pass expired or inactive",
            });
          }
        }
      }

      if (!vehicle) {
        return res.status(404).json({ error: "Invalid code" });
      }

      if (!vehicle.isActive) {
        return res.status(403).json({ error: "Vehicle access denied - inactive" });
      }

      // Create access log
      const gates = await storage.getAllGates();
      const onlineGate = gates.find((g) => g.status === "online");

      if (onlineGate) {
        await storage.createAccessLog({
          vehicleId: vehicle.id,
          userId: vehicle.userId,
          gateId: onlineGate.id,
          action: "entry",
          authMethod: code.startsWith("QR-") ? "qr_code" : "rfid",
          status: "authorized",
          reason: null,
          processedBy: null,
        });

        // Simulate opening gate
        await storage.updateGate(onlineGate.id, { isOpen: true });

        // Close gate after 3 seconds (in a real system)
        setTimeout(async () => {
          await storage.updateGate(onlineGate.id, { isOpen: false });
        }, 3000);
      }

      res.json({
        type: "vehicle",
        authorized: true,
        licensePlate: vehicle.licensePlate,
        vehicle,
        message: "Access granted",
      });
    } catch (error) {
      console.error("Scan error:", error);
      res.status(500).json({ error: "Scan failed" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Users fetch error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validated);
      res.json(user);
    } catch (error) {
      console.error("User creation error:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("User update error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("User deletion error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Visitors
  app.get("/api/visitors", async (req, res) => {
    try {
      const visitors = await storage.getAllVisitors();
      res.json(visitors);
    } catch (error) {
      console.error("Visitors fetch error:", error);
      res.status(500).json({ error: "Failed to fetch visitors" });
    }
  });

  app.get("/api/my-visitor-passes", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }
      const allVisitors = await storage.getAllVisitors();
      const userVisitors = allVisitors.filter((v) => v.email === email);
      res.json(userVisitors);
    } catch (error) {
      console.error("User visitor passes error:", error);
      res.status(500).json({ error: "Failed to fetch visitor passes" });
    }
  });

  app.post("/api/visitors/register", async (req, res) => {
    try {
      const validated = insertVisitorSchema.parse(req.body);
      const visitor = await storage.createVisitor(validated);
      res.json(visitor);
    } catch (error) {
      console.error("Visitor registration error:", error);
      res.status(400).json({ error: "Invalid visitor data" });
    }
  });

  // Reports
  app.get("/api/reports", async (req, res) => {
    try {
      const period = req.query.period as string || "week";
      const logs = await storage.getAllAccessLogs();

      // Generate hourly traffic pattern
      const hourlyTraffic = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour.toString().padStart(2, "0")}:00`,
        entries: Math.floor(Math.random() * 50),
        exits: Math.floor(Math.random() * 50),
      }));

      // Generate daily traffic
      const daysToShow = period === "month" ? 30 : period === "week" ? 7 : 1;
      const dailyTraffic = Array.from({ length: daysToShow }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (daysToShow - 1 - i));
        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          total: Math.floor(Math.random() * 200) + 50,
        };
      });

      // Gate usage
      const gates = await storage.getAllGates();
      const gateUsage = gates.map((gate) => ({
        gate: gate.name,
        count: Math.floor(Math.random() * 100) + 20,
      }));

      // Status distribution
      const statusDistribution = [
        { status: "authorized", count: logs.filter((l) => l.status === "authorized").length || 150 },
        { status: "denied", count: logs.filter((l) => l.status === "denied").length || 5 },
        { status: "manual_override", count: logs.filter((l) => l.status === "manual_override").length || 10 },
      ];

      res.json({
        hourlyTraffic,
        dailyTraffic,
        gateUsage,
        statusDistribution,
      });
    } catch (error) {
      console.error("Reports error:", error);
      res.status(500).json({ error: "Failed to generate reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
