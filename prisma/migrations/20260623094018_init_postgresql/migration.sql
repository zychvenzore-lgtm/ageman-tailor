-- CreateTable
CREATE TABLE "ThemeConfig" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'Ageman',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Refined Javanese Craftsmanship',
    "primaryColor" TEXT NOT NULL DEFAULT '#1C1917',
    "secondaryColor" TEXT NOT NULL DEFAULT '#44403C',
    "accentColor" TEXT NOT NULL DEFAULT '#CA8A04',
    "activeBatikPattern" TEXT NOT NULL DEFAULT 'PARANG',
    "enableAnimations" BOOLEAN NOT NULL DEFAULT true,
    "customStylesJson" TEXT NOT NULL DEFAULT '{}',

    CONSTRAINT "ThemeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "philosophy" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "garmentType" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "accents" TEXT NOT NULL,
    "collar" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusStep" INTEGER NOT NULL,
    "measurements" TEXT,
    "clothType" TEXT,
    "liningColor" TEXT,
    "tailorNotes" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
