"use server";

import { db } from "@/lib/db";

export async function getOrderTrackerAction(orderId: string) {
  try {
    if (!orderId || typeof orderId !== "string") {
      return { success: false, error: "Invalid order ID format." };
    }

    const order = await db.order.findUnique({
      where: { id: orderId.trim().toUpperCase() },
    });

    if (!order) {
      return { success: false, error: "No order found matching this ID. Please check the spelling (e.g., AGM-770)." };
    }

    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("Error retrieving order tracker info:", error);
    return { success: false, error: String(error) };
  }
}
