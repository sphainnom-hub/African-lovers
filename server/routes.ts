import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // User Routes
  app.get(api.users.list.path, isAuthenticated, async (req, res) => {
    const currentUserId = (req.user as any).claims.sub;
    const users = await storage.getUsers(currentUserId);
    res.json(users);
  });

  app.get(api.users.get.path, isAuthenticated, async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.put(api.users.update.path, isAuthenticated, async (req, res) => {
    const currentUserId = (req.user as any).claims.sub;
    if (req.params.id !== currentUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    try {
      const input = api.users.update.input.parse(req.body);
      const updated = await storage.updateUser(currentUserId, input);
      res.json(updated);
    } catch (error) {
       if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Match Routes
  app.get(api.matches.list.path, isAuthenticated, async (req, res) => {
    const currentUserId = (req.user as any).claims.sub;
    const matches = await storage.getMatches(currentUserId);
    res.json(matches);
  });

  app.post(api.matches.create.path, isAuthenticated, async (req, res) => {
    const currentUserId = (req.user as any).claims.sub;
    const { targetUserId, action } = api.matches.create.input.parse(req.body);

    if (action === 'pass') {
      // Logic for pass (maybe record it to not show again)
      return res.status(201).json({ status: "passed" });
    }

    // Check if target user already liked current user
    const existingReverseMatch = await storage.getMatch(targetUserId, currentUserId);
    
    if (existingReverseMatch) {
       // It's a match!
       const updated = await storage.updateMatchStatus(existingReverseMatch.id, "accepted");
       return res.status(201).json({ status: "matched", match: updated });
    }

    // Create pending match
    const newMatch = await storage.createMatch(currentUserId, targetUserId);
    res.status(201).json({ status: "liked", match: newMatch });
  });

  // Message Routes
  app.get(api.messages.list.path, isAuthenticated, async (req, res) => {
     const currentUserId = (req.user as any).claims.sub;
     const otherUserId = req.params.userId;
     
     // Verify they are matched? For now, allow if matched.
     const match = await storage.getMatch(currentUserId, otherUserId);
     if (!match || match.status !== 'accepted') {
       return res.status(403).json({ message: "Must be matched to message" });
     }

     const messages = await storage.getMessages(currentUserId, otherUserId);
     res.json(messages);
  });

  app.post(api.messages.create.path, isAuthenticated, async (req, res) => {
    const currentUserId = (req.user as any).claims.sub;
    const input = api.messages.create.input.parse(req.body);

    const message = await storage.createMessage({
      senderId: currentUserId,
      receiverId: input.receiverId,
      content: input.content,
      read: false
    });
    
    res.status(201).json(message);
  });

  return httpServer;
}
