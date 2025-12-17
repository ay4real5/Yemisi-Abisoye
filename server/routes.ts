import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRsvpSchema,
  insertGuestMessageSchema,
  insertGalleryPhotoSchema,
} from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // RSVP Routes
  app.post("/api/rsvps", async (req, res) => {
    try {
      const validatedData = insertRsvpSchema.parse(req.body);
      const rsvp = await storage.createRsvp(validatedData);
      res.status(201).json(rsvp);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/rsvps", async (_req, res) => {
    try {
      const rsvps = await storage.getAllRsvps();
      res.json(rsvps);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Bridal Party Routes
  app.get("/api/bridal-party", async (_req, res) => {
    try {
      const members = await storage.getBridalPartyMembers();
      res.json(members || []);
    } catch (error: any) {
      console.error("Error fetching bridal party members:", error);
      res.json([]);
    }
  });

  // Guest Messages Routes
  app.post("/api/guest-messages", async (req, res) => {
    try {
      const validatedData = insertGuestMessageSchema.parse(req.body);
      const message = await storage.createGuestMessage(validatedData);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/guest-messages", async (_req, res) => {
    try {
      const messages = await storage.getAllGuestMessages();
      res.json(messages || []);
    } catch (error: any) {
      console.error("Error fetching guest messages:", error);
      res.json([]);
    }
  });

  app.post("/api/guest-messages/:id/heart", async (req, res) => {
    try {
      const message = await storage.incrementMessageHearts(req.params.id);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Gallery Photos Routes
  app.post("/api/gallery-photos", async (req, res) => {
    try {
      const validatedData = insertGalleryPhotoSchema.parse(req.body);
      const photo = await storage.createGalleryPhoto(validatedData);
      res.status(201).json(photo);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/gallery-photos", async (_req, res) => {
    try {
      const photos = await storage.getAllGalleryPhotos();
      res.json(photos || []);
    } catch (error: any) {
      console.error("Error fetching gallery photos:", error);
      res.json([]);
    }
  });

  // Story Milestones Routes
  app.get("/api/story-milestones", async (_req, res) => {
    try {
      const milestones = await storage.getStoryMilestones();
      res.json(milestones);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Password Verification Route
  app.post("/api/verify-password", async (req, res) => {
    try {
      const { password } = req.body;
      if (password && password.trim().toLowerCase() === "tlc4ever") {
        res.json({ valid: true });
      } else {
        res.status(401).json({ valid: false });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Object Storage Routes
  app.post("/api/photos/upload", async (_req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/photos/complete", async (req, res) => {
    try {
      const { photoUrl, caption, uploadedBy, category } = req.body;
      
      if (!photoUrl) {
        return res.status(400).json({ error: "photoUrl is required" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(photoUrl);
      
      const photo = await storage.createGalleryPhoto({
        photoUrl: `/objects${objectPath}`,
        caption: caption || "",
        uploadedBy: uploadedBy || "Guest",
        category: category || "events",
      });

      res.status(201).json(photo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
