import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// RSVP Submissions
export const rsvps = pgTable("rsvps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guestName: text("guest_name").notNull(),
  attending: boolean("attending").notNull().default(false),
  plusOneName: text("plus_one_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRsvpSchema = createInsertSchema(rsvps).omit({
  id: true,
  createdAt: true,
});

export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
export type Rsvp = typeof rsvps.$inferSelect;

// Bridal Party Members
export const bridalPartyMembers = pgTable("bridal_party_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(), // "groomsman" or "bridesmaid"
  title: text("title").notNull(), // e.g., "Best Man", "Maid of Honor"
  photoUrl: text("photo_url"),
  story: text("story").notNull(), // How they met the couple
  relationTo: text("relation_to").notNull(), // "bride" or "groom"
  displayOrder: text("display_order").default("99"), // Controls display order
});

export const insertBridalPartyMemberSchema = createInsertSchema(bridalPartyMembers).omit({
  id: true,
});

export type InsertBridalPartyMember = z.infer<typeof insertBridalPartyMemberSchema>;
export type BridalPartyMember = typeof bridalPartyMembers.$inferSelect;

// Guest Messages (Digital Guestbook)
export const guestMessages = pgTable("guest_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guestName: text("guest_name").notNull(),
  messageType: text("message_type").notNull(), // "text" or "video"
  content: text("content").notNull(), // Text message or video URL
  hearts: text("hearts").default("0"), // Number of heart reactions
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGuestMessageSchema = createInsertSchema(guestMessages).omit({
  id: true,
  hearts: true,
  createdAt: true,
});

export type InsertGuestMessage = z.infer<typeof insertGuestMessageSchema>;
export type GuestMessage = typeof guestMessages.$inferSelect;

// Photo Gallery Items
export const galleryPhotos = pgTable("gallery_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  photoUrl: text("photo_url").notNull(),
  category: text("category").notNull(), // "engagement", "pre-wedding", "events"
  caption: text("caption"),
  uploadedBy: text("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGalleryPhotoSchema = createInsertSchema(galleryPhotos).omit({
  id: true,
  createdAt: true,
});

export type InsertGalleryPhoto = z.infer<typeof insertGalleryPhotoSchema>;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;

// Story Milestones (Our Story Timeline)
export const storyMilestones = pgTable("story_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  photoUrl: text("photo_url"),
  order: text("order").notNull(), // For sorting
});

export const insertStoryMilestoneSchema = createInsertSchema(storyMilestones).omit({
  id: true,
});

export type InsertStoryMilestone = z.infer<typeof insertStoryMilestoneSchema>;
export type StoryMilestone = typeof storyMilestones.$inferSelect;
