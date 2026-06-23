import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "crypto";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");

  // 1. Clean database
  await prisma.product.deleteMany({});
  await prisma.themeConfig.deleteMany({});
  await prisma.adminUser.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.order.deleteMany({});

  // 2. Create default ThemeConfig
  const theme = await prisma.themeConfig.create({
    data: {
      heroTitle: "Ageman",
      heroSubtitle: "Refined Javanese Craftsmanship",
      primaryColor: "#1C1917", // Stone 900
      secondaryColor: "#44403C", // Stone 700
      accentColor: "#CA8A04", // Gold 600
      activeBatikPattern: "PARANG",
      enableAnimations: true,
      customStylesJson: JSON.stringify({}),
    },
  });
  console.log("Created ThemeConfig:", theme);

  // 3. Create default AdminUser (admin / adminageman123)
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync("adminageman123", salt, 1000, 64, "sha512").toString("hex");
  const passwordHash = `${salt}:${hash}`;

  const admin = await prisma.adminUser.create({
    data: {
      username: "admin",
      passwordHash: passwordHash,
    },
  });
  console.log("Created Admin:", admin);

  // 4. Create products
  const products = [
    // Men's Suit Collection
    {
      name: "Prada Kencana Jas Batik",
      description: "Premium Javanese suit jacket with embossed gold batik details and royal Prada motifs, tailored for ceremonies.",
      philosophy: "Batik Prada symbolizes luxury, nobility, and status, historically reserved for Javanese royalty during official ceremonies.",
      price: 1850000.0,
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600",
      category: "SUITS",
    },
    {
      name: "Parang Gendreh Shirt",
      description: "Elegant long-sleeved silk shirt showcasing the bold diagonal Parang lines, representing relentless strength.",
      philosophy: "Parang represents a wave crashing against rocks, symbolizing struggle, resilience, and the power that guides leaders.",
      price: 950000.0,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600",
      category: "SHIRTS",
    },
    {
      name: "Sekar Jagad Bespoke Suit",
      description: "A tailored wool-silk blend suit jacket with embossed Sekar Jagad patterns representing a harmonious tapestry of Javanese art.",
      philosophy: "Sekar Jagad translates to 'flowers of the universe', representing world harmony, beauty, and diversity in unity.",
      price: 2200000.0,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600",
      category: "SUITS",
    },
    {
      name: "Kawung Picis Royal Suit",
      description: "Structured double-breasted suit jacket printed in geometric Kawung circular motifs on rich charcoal linen.",
      philosophy: "Kawung depicts palm fruit circles in a four-fold pattern, representing purity of heart, self-control, and cosmic balance.",
      price: 2150000.0,
      image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600",
      category: "SUITS",
    },
    // Accessories
    {
      name: "Sogan Silk Pocket Square",
      description: "Hand-dyed pure silk pocket square and neck tie set featuring the classic brown-yellowish Sogan palette.",
      philosophy: "Sogan represents earth, fertility, and humility. Its warm brown tones reflect connection to Javanese soil and ancestors.",
      price: 450000.0,
      image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=600",
      category: "ACCESSORIES",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log("Seeded product catalog.");

  // 5. Create mock Bookings
  await prisma.booking.create({
    data: {
      clientName: "Budi Santoso",
      email: "budi@gmail.com",
      phone: "+6281234567890",
      date: "2026-06-28",
      timeSlot: "10:00 - 11:30",
      location: "YOGYAKARTA",
      notes: "First fitting for custom wedding suit.",
    }
  });
  await prisma.booking.create({
    data: {
      clientName: "Rian Wibowo",
      email: "rian@gmail.com",
      phone: "+6287765432109",
      date: "2026-06-29",
      timeSlot: "14:00 - 15:30",
      location: "SURAKARTA",
      notes: "Measurements for custom Javanese heritage Jas Batik.",
    }
  });
  console.log("Seeded mock bookings.");

  // 6. Create mock Orders
  await prisma.order.create({
    data: {
      id: "AGM-770",
      clientName: "Pranata Wijaya",
      email: "pranata@wijaya.co",
      garmentType: "SINGLE_BREASTED",
      motif: "PARANG",
      accents: "GOLD",
      collar: "CLASSIC",
      status: "PENDING_APPROVAL",
      statusStep: 0,
    }
  });
  await prisma.order.create({
    data: {
      id: "AGM-101",
      clientName: "Satria Wibawa",
      email: "satria.w@yahoo.com",
      garmentType: "BESKAP_HERITAGE",
      motif: "KAWUNG",
      accents: "BRONZE",
      collar: "MANDARIN",
      status: "COMPLETED",
      statusStep: 5,
      measurements: "Chest: 104cm, Waist: 92cm, Shoulder: 46cm, Sleeve: 62cm",
      clothType: "Embossed Silk Velvet",
      liningColor: "Golden Sogan",
      tailorNotes: "Heritage double-vent back, custom gold crest lining monogram.",
    }
  });
  console.log("Seeded mock orders.");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
