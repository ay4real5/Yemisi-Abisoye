import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { eq } from "drizzle-orm";
import {
  rsvps,
  bridalPartyMembers,
  guestMessages,
  galleryPhotos,
  storyMilestones,
  type InsertRsvp,
  type InsertGuestMessage,
  type InsertGalleryPhoto,
  type Rsvp,
  type BridalPartyMember,
  type GuestMessage,
  type GalleryPhoto,
  type StoryMilestone,
} from "@shared/schema";

// Configure neon for WebSocket
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export const storage = {
  // RSVP Operations
  async createRsvp(data: InsertRsvp): Promise<Rsvp> {
    const [rsvp] = await db.insert(rsvps).values(data).returning();
    return rsvp;
  },

  async getAllRsvps(): Promise<Rsvp[]> {
    return await db.select().from(rsvps);
  },

  // Bridal Party Operations
  async getBridalPartyMembers(): Promise<BridalPartyMember[]> {
    return await db.select().from(bridalPartyMembers);
  },

  // Guest Messages Operations
  async createGuestMessage(data: InsertGuestMessage): Promise<GuestMessage> {
    const [message] = await db.insert(guestMessages).values(data).returning();
    return message;
  },

  async getAllGuestMessages(): Promise<GuestMessage[]> {
    return await db.select().from(guestMessages);
  },

  async incrementMessageHearts(id: string): Promise<GuestMessage | undefined> {
    const [message] = await db.select().from(guestMessages).where(eq(guestMessages.id, id));
    if (!message) {
      return undefined;
    }
    
    const currentHearts = parseInt(message.hearts || "0");
    const [updatedMessage] = await db
      .update(guestMessages)
      .set({ hearts: String(currentHearts + 1) })
      .where(eq(guestMessages.id, id))
      .returning();
    
    return updatedMessage;
  },

  // Gallery Photos Operations
  async createGalleryPhoto(data: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const [photo] = await db.insert(galleryPhotos).values(data).returning();
    return photo;
  },

  async getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
    return await db.select().from(galleryPhotos);
  },

  // Story Milestones Operations
  async getStoryMilestones(): Promise<StoryMilestone[]> {
    return await db.select().from(storyMilestones);
  },
};

// Seed initial data
export async function seedData() {
  try {
    console.log("Starting database seeding...");

    // Check if data already exists
    const existingMembers = await storage.getBridalPartyMembers();
    if (existingMembers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Seed Bridal Party Members
    const bridalPartyData = [
      {
        name: "Michael Chen",
        role: "groomsman",
        title: "Best Man",
        photoUrl: "/attached_assets/bridalparty-placeholder.jpg",
        story: "Michael has been my closest friend since college. We've shared countless adventures, late-night conversations, and have supported each other through life's ups and downs. He's the brother I chose.",
        relationTo: "groom",
      },
      {
        name: "James Williams",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/bridalparty-placeholder.jpg",
        story: "James and I grew up together in the same neighborhood. From playing basketball every weekend to being there for each other's biggest life moments, he's been a constant source of friendship and loyalty.",
        relationTo: "groom",
      },
      {
        name: "Sarah Thompson",
        role: "bridesmaid",
        title: "Maid of Honor",
        photoUrl: "/attached_assets/bridalparty-placeholder.jpg",
        story: "Sarah has been my best friend since high school. Through every triumph and challenge, she's been my rock. I can't imagine celebrating this special day without her by my side.",
        relationTo: "bride",
      },
      {
        name: "Emily Rodriguez",
        role: "bridesmaid",
        title: "Bridesmaid",
        photoUrl: "/attached_assets/bridalparty-placeholder.jpg",
        story: "Emily and I met in college and instantly became inseparable. Her kindness, humor, and unwavering support have made her not just a friend, but family. I'm so grateful to have her with me on this journey.",
        relationTo: "bride",
      },
    ];

    for (const member of bridalPartyData) {
      await db.insert(bridalPartyMembers).values(member);
    }
    console.log(`✓ Seeded ${bridalPartyData.length} bridal party members`);

    // Seed Guest Messages
    const guestMessageData = [
      {
        guestName: "Aunt Patricia",
        messageType: "text",
        content: "Congratulations to the beautiful couple! Wishing you both a lifetime of love, happiness, and endless adventures together. Can't wait to celebrate with you!",
      },
      {
        guestName: "Uncle David",
        messageType: "text",
        content: "So proud to witness this special moment. May your love continue to grow stronger with each passing day. Congratulations!",
      },
      {
        guestName: "Cousin Maria",
        messageType: "text",
        content: "Two hearts, one love! Wishing you all the best as you begin this wonderful journey together. Congratulations!",
      },
    ];

    for (const message of guestMessageData) {
      await db.insert(guestMessages).values(message);
    }
    console.log(`✓ Seeded ${guestMessageData.length} guest messages`);

    // Seed Gallery Photos
    const galleryPhotoData = [
      {
        photoUrl: "/attached_assets/gallery-placeholder-1.jpg",
        category: "engagement",
        caption: "The moment we said yes to forever",
        uploadedBy: "Professional Photographer",
      },
      {
        photoUrl: "/attached_assets/gallery-placeholder-2.jpg",
        category: "pre-wedding",
        caption: "Celebrating with our favorite people",
        uploadedBy: "Wedding Planner",
      },
      {
        photoUrl: "/attached_assets/gallery-placeholder-3.jpg",
        category: "events",
        caption: "Making memories that will last a lifetime",
        uploadedBy: "Guest",
      },
    ];

    for (const photo of galleryPhotoData) {
      await db.insert(galleryPhotos).values(photo);
    }
    console.log(`✓ Seeded ${galleryPhotoData.length} gallery photos`);

    console.log("✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    // Don't throw - allow app to continue even if seeding fails
  }
}
