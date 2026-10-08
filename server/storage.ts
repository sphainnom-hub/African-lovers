import { db } from "./db";
import {
  users, matches, messages,
  type User, type InsertUser, type UpdateProfileRequest,
  type Match, type InsertMatch,
  type Message, type InsertMessage
} from "@shared/schema";
import { eq, or, and, ne } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  updateUser(id: string, updates: UpdateProfileRequest): Promise<User>;
  getUsers(currentUserId: string, filters?: { gender?: string; minAge?: number; maxAge?: number }): Promise<User[]>;
  
  // Matches
  createMatch(user1Id: string, user2Id: string): Promise<Match>;
  getMatch(user1Id: string, user2Id: string): Promise<Match | undefined>;
  getMatches(userId: string): Promise<(Match & { partner: User })[]>;
  updateMatchStatus(id: number, status: string): Promise<Match>;
  
  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(user1Id: string, user2Id: string): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUser(id: string, updates: UpdateProfileRequest): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getUsers(currentUserId: string, filters?: { gender?: string; minAge?: number; maxAge?: number }): Promise<User[]> {
    // Simple filter for now. In a real app, we'd exclude already swiped users.
    const conditions = [ne(users.id, currentUserId)];
    
    if (filters?.gender) {
      conditions.push(eq(users.gender, filters.gender));
    }
    
    // Age filtering would require SQL logic on the 'age' column or date of birth. 
    // Assuming 'age' is an integer column for simplicity.
    if (filters?.minAge) {
      // db.select()...where(gte(users.age, filters.minAge))
    }
    
    return await db.select().from(users).where(and(...conditions));
  }

  async createMatch(user1Id: string, user2Id: string): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values({ user1Id, user2Id, status: "pending" })
      .returning();
    return match;
  }

  async getMatch(user1Id: string, user2Id: string): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(
      or(
        and(eq(matches.user1Id, user1Id), eq(matches.user2Id, user2Id)),
        and(eq(matches.user1Id, user2Id), eq(matches.user2Id, user1Id))
      )
    );
    return match;
  }

  async getMatches(userId: string): Promise<(Match & { partner: User })[]> {
    // Get confirmed matches
    const allMatches = await db.select().from(matches).where(
      and(
        or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)),
        eq(matches.status, "accepted")
      )
    );

    const results = [];
    for (const m of allMatches) {
      const partnerId = m.user1Id === userId ? m.user2Id : m.user1Id;
      const partner = await this.getUser(partnerId);
      if (partner) {
        results.push({ ...m, partner });
      }
    }
    return results;
  }

  async updateMatchStatus(id: number, status: string): Promise<Match> {
    const [updated] = await db
      .update(matches)
      .set({ status })
      .where(eq(matches.id, id))
      .returning();
    return updated;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [msg] = await db.insert(messages).values(message).returning();
    return msg;
  }

  async getMessages(user1Id: string, user2Id: string): Promise<Message[]> {
    return await db.select().from(messages).where(
      or(
        and(eq(messages.senderId, user1Id), eq(messages.receiverId, user2Id)),
        and(eq(messages.senderId, user2Id), eq(messages.receiverId, user1Id))
      )
    ).orderBy(messages.createdAt);
  }
}

export const storage = new DatabaseStorage();
