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
        story: "Hiiyyyyyyaaaaa😘😘😘 My name is Oyebimpe, but everyone calls me Bibi. the bride's best girl and favorite person to argue with. 😜 We met at work ,and from day one, we've been the definition of love and war ,and between all the laughter, eye rolls, and \"don't talk to me\" moments, a beautiful friendship was born. Through it all, she's my sister at heart, and I couldn't be prouder to see her marry the love of her life! 💕",
        relationTo: "bride",
      },
      {
        name: "Kofoworola Rabiu",
        role: "bridesmaid",
        title: "Bride's Cousin",
        photoUrl: "/attached_assets/kofo_1759828085583.jpg",
        story: "My name is Kofoworola Rabiu, I am the brides cousin. I'm related to her through my mum's side of the family. I live in London, I work in Tech and my favorite hobby is eating and minding my business",
        relationTo: "bride",
      },
      {
        name: "Bimpe (Bimpizzle)",
        role: "bridesmaid",
        title: "Bride's Cousin",
        photoUrl: "/attached_assets/bimpizzle_1759829102989.jpg",
        story: "Hi, I'm Bimpe to family and friends — Bimpizzle on social media! I'm an introverted fashionista who loves to travel and has a favorite color that's the perfect combo of black and white. Growing up with the beautiful bride as little cousins to now watching her step into this new chapter is such a full-circle moment, and I'm so honored to be part of it!",
        relationTo: "bride",
      },
      {
        name: "Sherifah",
        role: "bridesmaid",
        title: "Bride's Sister",
        photoUrl: "/attached_assets/sherifah_1759829289654.jpg",
        story: "Hi! My name is Sherifah. I'm a nurse and the bride's sister. I'm thrilled to see her marry someone who truly completes her and brings out the best in her. Wishing them a lifetime of love and laughter! 💚",
        relationTo: "bride",
      },
      {
        name: "Hameedah",
        role: "bridesmaid",
        title: "Chief Bridesmaid",
        photoUrl: "/attached_assets/hameda_1759829493052.jpg",
        story: "Hi! My name is Hameedah, I am a lawyer and I live and work in Manchester. I am the bride's cousin and her chief bridesmaid. I wish Yemisi and Bisoye unlimited happiness and a very very happy marriage blessed with all the good things ❤️",
        relationTo: "bride",
      },
      {
        name: "Uju",
        role: "bridesmaid",
        title: "Bridesmaid",
        photoUrl: "/attached_assets/uju_1759829840451.jpg",
        story: "My name is Uju, and I'm a proud bridesmaid for Yemisi! We met in 2021 and became close friends while living together. Having shared those memories, it's a true joy to now celebrate this chapter with her and Abisoye whom I met around the same time. I'm so happy my girl found her soul mate and I wish them all the very best in their union.",
        relationTo: "bride",
      },
      {
        name: "Omosomhi",
        role: "bridesmaid",
        title: "Maid of Honor",
        photoUrl: "/attached_assets/WhatsApp Image 2025-10-24 at 12.23.37_1761493154587.jpeg",
        story: "My name is Omosomhi and I'm proudly serving as the maid of honor🎉🍷🫶- basically the unpaid assistant, emotional support, and emergency problem-solver for the day 😉😭😂. Watching her find someone who truly makes her happy means a lot to me. I've seen her laugh, love, and care with her whole heart - and seeing that same love reflected back today makes this day extra special. Wishing you both a lifetime of laughter, peace, and late-night gist sessions that never end.",
        relationTo: "bride",
      },
      {
        name: "Yinka",
        role: "groomsman",
        title: "Best Man",
        photoUrl: "/attached_assets/6754765r76374_1759830696151.jpg",
        story: "My name is Olayinka a very proud Chelsea supporter that dislikes Liverpool FC. I am sure the groom knows better. I am a friend of Abisoye from our MSC Days at Teesside University...and we have kept in touch ever since we played FIFA then, even though I have never won any game against him. I guess I would get one over Him after he gets Married. But just know Abisoye is a sure Guy #facts I met Yemisi, the bride also during our Msc days through some group of friends at Teesside then in a shared accommodation; and ever since we have been very good friends till date. Looking forward to the Big Day ...e go loud.......gege",
        relationTo: "groom",
      },
      {
        name: "Damilare (Dre)",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/damilare_1759830070988.jpg",
        story: "My name is Damilare but people call me Dre. I am very very lively and chilled. I am a close friend to the groom. I've known the couple since Uni days and I wish them a home filled with love and happiness.",
        relationTo: "groom",
      },
      {
        name: "Ayo",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/ayopiipi_1759830275007.jpg",
        story: "My name is Ayo ,Bisoye is an excellent friend and one of my favorite teammates, both in life and on the PS5! I've known him since 2021, when we were both students at Teesside University. We quickly bonded over countless hours playing. He's the guy who's always up for a challenging match and always ready to celebrate. Bisoye and Yemisi have been great friends to both me and Uju over the years. We couldn't imagine celebrating this day without him standing by her side. We're so incredibly happy to celebrate their union",
        relationTo: "groom",
      },
      {
        name: "Ridwan (Rio)",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/ridwan_1759926895327.jpg",
        story: "My name is Ridwan, but everyone calls me Rio. I'm a friend of Yemisi and Abisoye. I'm really happy to be part of your special day and can't wait to celebrate with you both! Warm regards, Rio.",
        relationTo: "groom",
      },
      {
        name: "Taiwo",
        role: "groomsman",
        title: "Groom's Brother",
        photoUrl: "/attached_assets/taiwo_1759927004175.jpg",
        story: "I'm Taiwo, the younger brother of the groom. An extroverted introvert who's very adventurous and enjoys learning new things. I'm proud of the groom's growth and accomplishments over the years. It's an honor to be a part of this wonderful celebration as the bride and groom embark on this new journey. Cheers to love, laughter, and a happily ever after",
        relationTo: "groom",
      },
      {
        name: "Michael",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/gft_1761491769783.jpg",
        story: "My name is Michael. I met Mr. Bisoye during his friend's wedding last year, and since then, we've grown to become very good friends more like brothers. It's truly an honour and a pleasure to stand by him as one of his groomsmen for his wedding.",
        relationTo: "groom",
      },
      {
        name: "Blessing Babalola",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/WhatsApp Image 2025-10-22 at 13.33.15_1761492602589.jpeg",
        story: "My name is Blessing Babalola — an unapologetic Arsenal FC supporter who enjoys a good game of FIFA on the console. I'm a mutual friend of both the bride and groom, and it's a joy to celebrate with two amazing people I've known for quite some time.",
        relationTo: "groom",
      },
    ];

    await this.db.insert(bridalPartyMembers).values(members);
  }

  private async seedStoryMilestones() {
    const milestones: InsertStoryMilestone[] = [
      {
        date: "March 2020",
        title: "First Meeting",
        description: "Our paths crossed at a mutual friend's gathering, and we instantly connected over our shared love for music and adventure.",
        order: "1",
      },
      {
        date: "August 2020",
        title: "First Date",
        description: "A simple coffee date turned into hours of conversation and laughter. We both knew this was something special.",
        order: "2",
      },
      {
        date: "December 2021",
        title: "Relationship Official",
        description: "After a year of growing closer, we made it official during a romantic beach sunset walk.",
        order: "3",
      },
      {
        date: "May 2023",
        title: "The Proposal",
        description: "Under the stars at our favorite restaurant, Tambari got down on one knee and asked the question that changed our lives forever.",
        order: "4",
      },
      {
        date: "July 2024",
        title: "Forever Begins",
        description: "And now we're getting married! Join us as we celebrate the beginning of our forever.",
        order: "5",
      },
    ];

    await this.db.insert(storyMilestones).values(milestones);
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const [rsvp] = await this.db.insert(rsvps).values(insertRsvp).returning();
    return rsvp;
  }

  async getAllRsvps(): Promise<Rsvp[]> {
    return await this.db.select().from(rsvps).orderBy(desc(rsvps.createdAt));
  }

  async getBridalPartyMembers(): Promise<BridalPartyMember[]> {
    return await this.db.select().from(bridalPartyMembers);
  }

  async createBridalPartyMember(insertMember: InsertBridalPartyMember): Promise<BridalPartyMember> {
    const [member] = await this.db.insert(bridalPartyMembers).values(insertMember).returning();
    return member;
  }

  async createGuestMessage(insertMessage: InsertGuestMessage): Promise<GuestMessage> {
    const [message] = await this.db.insert(guestMessages).values(insertMessage).returning();
    return message;
  }

  async getAllGuestMessages(): Promise<GuestMessage[]> {
    return await this.db.select().from(guestMessages).orderBy(desc(guestMessages.createdAt));
  }

  async incrementMessageHearts(id: string): Promise<GuestMessage | undefined> {
    const [message] = await this.db
      .update(guestMessages)
      .set({ hearts: sql`CAST(CAST(${guestMessages.hearts} AS INTEGER) + 1 AS TEXT)` })
      .where(eq(guestMessages.id, id))
      .returning();
    return message;
  }

  async createGalleryPhoto(insertPhoto: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const [photo] = await this.db.insert(galleryPhotos).values(insertPhoto).returning();
    return photo;
  }

  async getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
    return await this.db.select().from(galleryPhotos).orderBy(desc(galleryPhotos.createdAt));
  }

  async getStoryMilestones(): Promise<StoryMilestone[]> {
    return await this.db.select().from(storyMilestones);
  }

  async createStoryMilestone(insertMilestone: InsertStoryMilestone): Promise<StoryMilestone> {
    const [milestone] = await this.db.insert(storyMilestones).values(insertMilestone).returning();
    return milestone;
  }
}

export class MemStorage implements IStorage {
  private rsvps: Map<string, Rsvp>;
  private bridalPartyMembers: Map<string, BridalPartyMember>;
  private guestMessages: Map<string, GuestMessage>;
  private galleryPhotos: Map<string, GalleryPhoto>;
  private storyMilestones: Map<string, StoryMilestone>;

  constructor() {
    this.rsvps = new Map();
    this.bridalPartyMembers = new Map();
    this.guestMessages = new Map();
    this.galleryPhotos = new Map();
    this.storyMilestones = new Map();
    
    this.seedBridalParty();
    this.seedStoryMilestones();
  }

  private seedBridalParty() {
    const members: InsertBridalPartyMember[] = [
      {
        name: "Oyebimpe (Bibi)",
        role: "bridesmaid",
        title: "Bride's Best Girl",
        photoUrl: "/attached_assets/bimpe_1759827170279.jpg",
        story: "Hiiyyyyyyaaaaa😘😘😘 My name is Oyebimpe, but everyone calls me Bibi. the bride's best girl and favorite person to argue with. 😜 We met at work ,and from day one, we've been the definition of love and war ,and between all the laughter, eye rolls, and \"don't talk to me\" moments, a beautiful friendship was born. Through it all, she's my sister at heart, and I couldn't be prouder to see her marry the love of her life! 💕",
        relationTo: "bride",
      },
      {
        name: "Kofoworola Rabiu",
        role: "bridesmaid",
        title: "Bride's Cousin",
        photoUrl: "/attached_assets/kofo_1759828085583.jpg",
        story: "My name is Kofoworola Rabiu, I am the brides cousin. I'm related to her through my mum's side of the family. I live in London, I work in Tech and my favorite hobby is eating and minding my business",
        relationTo: "bride",
      },
      {
        name: "Bimpe (Bimpizzle)",
        role: "bridesmaid",
        title: "Bride's Cousin",
        photoUrl: "/attached_assets/bimpizzle_1759829102989.jpg",
        story: "Hi, I'm Bimpe to family and friends — Bimpizzle on social media! I'm an introverted fashionista who loves to travel and has a favorite color that's the perfect combo of black and white. Growing up with the beautiful bride as little cousins to now watching her step into this new chapter is such a full-circle moment, and I'm so honored to be part of it!",
        relationTo: "bride",
      },
      {
        name: "Hameedah",
        role: "bridesmaid",
        title: "Chief Bridesmaid",
        photoUrl: "/attached_assets/hameda_1759829493052.jpg",
        story: "Hi! My name is Hameedah, I am a lawyer and I live and work in Manchester. I am the bride's cousin and her chief bridesmaid. I wish Yemisi and Bisoye unlimited happiness and a very very happy marriage blessed with all the good things ❤️",
        relationTo: "bride",
      },
      {
        name: "Uju",
        role: "bridesmaid",
        title: "Bridesmaid",
        photoUrl: "/attached_assets/uju_1759829840451.jpg",
        story: "My name is Uju, and I'm a proud bridesmaid for Yemisi! We met in 2021 and became close friends while living together. Having shared those memories, it's a true joy to now celebrate this chapter with her and Abisoye whom I met around the same time. I'm so happy my girl found her soul mate and I wish them all the very best in their union.",
        relationTo: "bride",
      },
      {
        name: "Omosomhi",
        role: "bridesmaid",
        title: "Maid of Honor",
        photoUrl: "/attached_assets/WhatsApp Image 2025-10-24 at 12.23.37_1761493154587.jpeg",
        story: "My name is Omosomhi and I'm proudly serving as the maid of honor🎉🍷🫶- basically the unpaid assistant, emotional support, and emergency problem-solver for the day 😉😭😂. Watching her find someone who truly makes her happy means a lot to me. I've seen her laugh, love, and care with her whole heart - and seeing that same love reflected back today makes this day extra special. Wishing you both a lifetime of laughter, peace, and late-night gist sessions that never end.",
        relationTo: "bride",
      },
      {
        name: "Yinka",
        role: "groomsman",
        title: "Best Man",
        photoUrl: "/attached_assets/6754765r76374_1759830696151.jpg",
        story: "My name is Olayinka a very proud Chelsea supporter that dislikes Liverpool FC. I am sure the groom knows better. I am a friend of Abisoye from our MSC Days at Teesside University...and we have kept in touch ever since we played FIFA then, even though I have never won any game against him. I guess I would get one over Him after he gets Married. But just know Abisoye is a sure Guy #facts I met Yemisi, the bride also during our Msc days through some group of friends at Teesside then in a shared accommodation; and ever since we have been very good friends till date. Looking forward to the Big Day ...e go loud.......gege",
        relationTo: "groom",
      },
      {
        name: "Damilare (Dre)",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/damilare_1759830070988.jpg",
        story: "My name is Damilare but people call me Dre. I am very very lively and chilled. I am a close friend to the groom. I've known the couple since Uni days and I wish them a home filled with love and happiness.",
        relationTo: "groom",
      },
      {
        name: "Ayo",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/ayopiipi_1759830275007.jpg",
        story: "My name is Ayo ,Bisoye is an excellent friend and one of my favorite teammates, both in life and on the PS5! I've known him since 2021, when we were both students at Teesside University. We quickly bonded over countless hours playing. He's the guy who's always up for a challenging match and always ready to celebrate. Bisoye and Yemisi have been great friends to both me and Uju over the years. We couldn't imagine celebrating this day without him standing by her side. We're so incredibly happy to celebrate their union",
        relationTo: "groom",
      },
      {
        name: "Ridwan (Rio)",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/ridwan_1759926895327.jpg",
        story: "My name is Ridwan, but everyone calls me Rio. I'm a friend of Yemisi and Abisoye. I'm really happy to be part of your special day and can't wait to celebrate with you both! Warm regards, Rio.",
        relationTo: "groom",
      },
      {
        name: "Taiwo",
        role: "groomsman",
        title: "Groom's Brother",
        photoUrl: "/attached_assets/taiwo_1759927004175.jpg",
        story: "I'm Taiwo, the younger brother of the groom. An extroverted introvert who's very adventurous and enjoys learning new things. I'm proud of the groom's growth and accomplishments over the years. It's an honor to be a part of this wonderful celebration as the bride and groom embark on this new journey. Cheers to love, laughter, and a happily ever after",
        relationTo: "groom",
      },
      {
        name: "Michael",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/gft_1761491769783.jpg",
        story: "My name is Michael. I met Mr. Bisoye during his friend's wedding last year, and since then, we've grown to become very good friends more like brothers. It's truly an honour and a pleasure to stand by him as one of his groomsmen for his wedding.",
        relationTo: "groom",
      },
      {
        name: "Blessing Babalola",
        role: "groomsman",
        title: "Groomsman",
        photoUrl: "/attached_assets/WhatsApp Image 2025-10-22 at 13.33.15_1761492602589.jpeg",
        story: "My name is Blessing Babalola — an unapologetic Arsenal FC supporter who enjoys a good game of FIFA on the console. I'm a mutual friend of both the bride and groom, and it's a joy to celebrate with two amazing people I've known for quite some time.",
        relationTo: "groom",
      },
    ];

    members.forEach(member => {
      const id = randomUUID();
      this.bridalPartyMembers.set(id, { 
        name: member.name,
        role: member.role,
        title: member.title,
        photoUrl: member.photoUrl ?? null,
        story: member.story,
        relationTo: member.relationTo,
        id 
      });
    });
  }

  private seedStoryMilestones() {
    const milestones: InsertStoryMilestone[] = [
      {
        date: "March 2020",
        title: "First Meeting",
        description: "Our paths crossed at a mutual friend's gathering, and we instantly connected over our shared love for music and adventure.",
        order: "1",
      },
      {
        date: "August 2020",
        title: "First Date",
        description: "A simple coffee date turned into hours of conversation and laughter. We both knew this was something special.",
        order: "2",
      },
      {
        date: "December 2021",
        title: "Relationship Official",
        description: "After a year of growing closer, we made it official during a romantic beach sunset walk.",
        order: "3",
      },
      {
        date: "May 2023",
        title: "The Proposal",
        description: "Under the stars at our favorite restaurant, Tambari got down on one knee and asked the question that changed our lives forever.",
        order: "4",
      },
      {
        date: "July 2024",
        title: "Forever Begins",
        description: "And now we're getting married! Join us as we celebrate the beginning of our forever.",
        order: "5",
      },
    ];

    milestones.forEach(milestone => {
      const id = randomUUID();
      this.storyMilestones.set(id, { 
        date: milestone.date,
        title: milestone.title,
        description: milestone.description,
        photoUrl: milestone.photoUrl ?? null,
        order: milestone.order,
        id 
      });
    });
  }

  async createRsvp(insertRsvp: InsertRsvp): Promise<Rsvp> {
    const id = randomUUID();
    const rsvp: Rsvp = { 
      guestName: insertRsvp.guestName,
      attending: insertRsvp.attending ?? false,
      plusOneName: insertRsvp.plusOneName ?? null,
      id,
      createdAt: new Date(),
    };
    this.rsvps.set(id, rsvp);
    return rsvp;
  }

  async getAllRsvps(): Promise<Rsvp[]> {
    return Array.from(this.rsvps.values());
  }

  async getBridalPartyMembers(): Promise<BridalPartyMember[]> {
    return Array.from(this.bridalPartyMembers.values());
  }

  async createBridalPartyMember(insertMember: InsertBridalPartyMember): Promise<BridalPartyMember> {
    const id = randomUUID();
    const member: BridalPartyMember = { 
      name: insertMember.name,
      role: insertMember.role,
      title: insertMember.title,
      photoUrl: insertMember.photoUrl ?? null,
      story: insertMember.story,
      relationTo: insertMember.relationTo,
      id 
    };
    this.bridalPartyMembers.set(id, member);
    return member;
  }

  async createGuestMessage(insertMessage: InsertGuestMessage): Promise<GuestMessage> {
    const id = randomUUID();
    const message: GuestMessage = {
      ...insertMessage,
      id,
      hearts: "0",
      createdAt: new Date(),
    };
    this.guestMessages.set(id, message);
    return message;
  }

  async getAllGuestMessages(): Promise<GuestMessage[]> {
    return Array.from(this.guestMessages.values())
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async incrementMessageHearts(id: string): Promise<GuestMessage | undefined> {
    const message = this.guestMessages.get(id);
    if (message) {
      const currentHearts = parseInt(message.hearts || "0");
      message.hearts = (currentHearts + 1).toString();
      this.guestMessages.set(id, message);
      return message;
    }
    return undefined;
  }

  async createGalleryPhoto(insertPhoto: InsertGalleryPhoto): Promise<GalleryPhoto> {
    const id = randomUUID();
    const photo: GalleryPhoto = {
      photoUrl: insertPhoto.photoUrl,
      category: insertPhoto.category,
      caption: insertPhoto.caption ?? null,
      uploadedBy: insertPhoto.uploadedBy ?? null,
      id,
      createdAt: new Date(),
    };
    this.galleryPhotos.set(id, photo);
    return photo;
  }

  async getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
    return Array.from(this.galleryPhotos.values())
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getStoryMilestones(): Promise<StoryMilestone[]> {
    return Array.from(this.storyMilestones.values())
      .sort((a, b) => parseInt(a.order) - parseInt(b.order));
  }

  async createStoryMilestone(insertMilestone: InsertStoryMilestone): Promise<StoryMilestone> {
    const id = randomUUID();
    const milestone: StoryMilestone = { 
      date: insertMilestone.date,
      title: insertMilestone.title,
      description: insertMilestone.description,
      photoUrl: insertMilestone.photoUrl ?? null,
      order: insertMilestone.order,
      id 
    };
    this.storyMilestones.set(id, milestone);
    return milestone;
  }
}

// Use database storage for production
export const storage = new DBStorage();
