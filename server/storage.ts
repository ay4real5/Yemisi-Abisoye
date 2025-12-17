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
        photoUrl: "/attached_assets/bimpe_1759827170279.jpg",
        story: "Hiiyyyyyyaaaaa😘😘😘 My name is Oyebimpe, but everyone calls me Bibi. the bride's best girl and favorite person to argue with. 😜 We met at work ,and from day one, we've been t[...]
        relationTo: "bride",
      },
      {
        name: "Yinka",
        role: "groomsman",
        title: "Best Man",
        photoUrl: "/attached_assets/6754765r76374_1759830696151.jpg",
        story: "My name is Olayinka a very proud Chelsea supporter that dislikes Liverpool FC. I am sure the groom knows better😁 \nI am a friend of Abisoye from our MSC Days at Teesside University...and we have kept in touch ever since we played FIFA then, even though I have never won any game against him. I guess I would get one over Him after he gets Married. But just know Abisoye is a sure Guy #facts\nI met Yemisi, the bride also during our Msc days through some group of friends at Teesside then in a shared accommodation; and ever since we have been very good friends till date.\nLooking forward to the Big Day ...e go loud.......gege",
        relationTo: "groom",
      },
    ]
  
    await this.db.insert(bridalPartyMembers).values(members);
  }

/* Remaining file content unchanged */