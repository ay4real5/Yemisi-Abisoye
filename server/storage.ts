import {
  type Rsvp,
  type InsertRsvp,
  type BridalPartyMember,
  type InsertBridalPartyMember,
  type GuestMessage,
  type InsertGuestMessage,
  type GalleryPhoto,
  type InsertGalleryPhoto,
  type StoryMilestone,
  type InsertStoryMilestone,
  rsvps,
  bridalPartyMembers,
  guestMessages,
  galleryPhotos,
  storyMilestones,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";
import { sql } from "drizzle-orm";

export interface IStorage {
  createRsvp(rsvp: InsertRsvp): Promise<Rsvp>;
  getAllRsvps(): Promise<Rsvp[]>;
  
  getBridalPartyMembers(): Promise<BridalPartyMember[]>;
  createBridalPartyMember(member: InsertBridalPartyMember): Promise<BridalPartyMember>;
  
  createGuestMessage(message: InsertGuestMessage): Promise<GuestMessage>;
  getAllGuestMessages(): Promise<GuestMessage[]>;
  incrementMessageHearts(id: string): Promise<GuestMessage | undefined>;
  
  createGalleryPhoto(photo: InsertGalleryPhoto): Promise<GalleryPhoto>;
  getAllGalleryPhotos(): Promise<GalleryPhoto[]>;
  
  getStoryMilestones(): Promise<StoryMilestone[]>;
  createStoryMilestone(milestone: InsertStoryMilestone): Promise<StoryMilestone>;
}

// Database Storage using PostgreSQL
export class DBStorage implements IStorage {
  private db;
  private seeded = false;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not set");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
    
    // Seed data on startup
    this.seedData();
  }

  private async seedData() {
    if (this.seeded) return;
    
    try {
      // Check if bridal party is already seeded
      const existingMembers = await this.db.select().from(bridalPartyMembers).limit(1);
      if (existingMembers.length === 0) {
        await this.seedBridalParty();
      }
      
      // Check if story milestones are already seeded
      const existingMilestones = await this.db.select().from(storyMilestones).limit(1);
      if (existingMilestones.length === 0) {
        await this.seedStoryMilestones();
      }
      
      this.seeded = true;
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  private async seedBridalParty() {
    const members: InsertBridalPartyMember[] = [
      {
        name: "Oyebimpe (Bibi)",
        role: "bridesmaid",
        title: "Bride's Best Girl",
          ToastLet Possible แทงบอล Down...
....