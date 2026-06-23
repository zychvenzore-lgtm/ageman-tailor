"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createBespokeOrderAction(formData: {
  clientName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  location: string;
  notes?: string;
  garmentType: string;
  motif: string;
  accents: string;
  collar: string;
}) {
  try {
    // Generate order ID AGM-XXX where XXX is a 3-digit number
    let orderId = "";
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 15) {
      const num = Math.floor(100 + Math.random() * 900);
      orderId = `AGM-${num}`;
      
      const existing = await db.order.findUnique({
        where: { id: orderId },
      });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error("Could not generate a unique order ID. Please try again.");
    }

    // 1. Create the booking appointment
    const booking = await db.booking.create({
      data: {
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        timeSlot: formData.timeSlot,
        location: formData.location,
        notes: formData.notes || `Bespoke customization order fitting.`,
      },
    });

    // 2. Create the actual tracking order with customized specifications
    const order = await db.order.create({
      data: {
        id: orderId,
        clientName: formData.clientName,
        email: formData.email,
        garmentType: formData.garmentType,
        motif: formData.motif,
        accents: formData.accents,
        collar: formData.collar,
        status: "WAXING",
        statusStep: 1,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/tracker");

    return { success: true, orderId, bookingId: booking.id };
  } catch (error) {
    console.error("Failed to create bespoke order and fitting:", error);
    return { success: false, error: String(error) };
  }
}
