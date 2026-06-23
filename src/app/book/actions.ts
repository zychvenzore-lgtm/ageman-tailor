"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createBookingAction(formData: {
  clientName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  location: string;
  notes?: string;
}) {
  try {
    const booking = await db.booking.create({
      data: {
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        timeSlot: formData.timeSlot,
        location: formData.location,
        notes: formData.notes,
      },
    });

    revalidatePath("/admin");

    return { success: true, booking };
  } catch (error) {
    console.error("Failed to create appointment booking:", error);
    return { success: false, error: String(error) };
  }
}
