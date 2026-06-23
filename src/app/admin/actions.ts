"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ThemeConfigSchema } from "@/lib/schema";

export async function updateThemeConfig(formData: {
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  activeBatikPattern: string;
  enableAnimations: boolean;
  customStylesJson?: string;
}) {
  try {
    // Validate config with Zod
    const validated = ThemeConfigSchema.parse({
      ...formData,
      customStylesJson: formData.customStylesJson || "{}",
    });

    const latest = await db.themeConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (latest) {
      await db.themeConfig.update({
        where: { id: latest.id },
        data: {
          heroTitle: validated.heroTitle,
          heroSubtitle: validated.heroSubtitle,
          primaryColor: validated.primaryColor,
          secondaryColor: validated.secondaryColor,
          accentColor: validated.accentColor,
          activeBatikPattern: validated.activeBatikPattern,
          enableAnimations: validated.enableAnimations,
          customStylesJson: validated.customStylesJson,
        },
      });
    } else {
      await db.themeConfig.create({
        data: {
          heroTitle: validated.heroTitle,
          heroSubtitle: validated.heroSubtitle,
          primaryColor: validated.primaryColor,
          secondaryColor: validated.secondaryColor,
          accentColor: validated.accentColor,
          activeBatikPattern: validated.activeBatikPattern,
          enableAnimations: validated.enableAnimations,
          customStylesJson: validated.customStylesJson,
        },
      });
    }

    // Revalidate routes
    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to update theme configuration:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateProductAction(formData: {
  id: string;
  name: string;
  description: string;
  philosophy: string;
  price: number;
  image: string;
  category: string;
}) {
  try {
    const product = await db.product.update({
      where: { id: formData.id },
      data: {
        name: formData.name,
        description: formData.description,
        philosophy: formData.philosophy,
        price: Number(formData.price),
        image: formData.image,
        category: formData.category,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, product };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: String(error) };
  }
}

export async function createProductAction(formData: {
  name: string;
  description: string;
  philosophy: string;
  price: number;
  image: string;
  category: string;
}) {
  try {
    const product = await db.product.create({
      data: {
        name: formData.name,
        description: formData.description,
        philosophy: formData.philosophy,
        price: Number(formData.price),
        image: formData.image,
        category: formData.category,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: String(error) };
  }
}

export async function updateOrderStatusAction(orderId: string, statusStep: number) {
  try {
    const statusMap = ["PENDING_APPROVAL", "WAXING", "DYEING", "STRIPPING", "CUTTING", "STITCHING", "COMPLETED"];
    const statusText = statusStep === 5 ? "COMPLETED" : statusMap[statusStep];

    const order = await db.order.update({
      where: { id: orderId },
      data: {
        statusStep: Number(statusStep),
        status: statusText,
      },
    });

    revalidatePath("/");
    revalidatePath("/tracker");
    revalidatePath("/admin");

    return { success: true, order };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: String(error) };
  }
}

export async function approveOrderWithSpecsAction(formData: {
  orderId: string;
  measurements: string;
  clothType: string;
  liningColor: string;
  tailorNotes?: string;
}) {
  try {
    const order = await db.order.update({
      where: { id: formData.orderId },
      data: {
        statusStep: 1, // Start production (1. Waxing)
        status: "WAXING",
        measurements: formData.measurements,
        clothType: formData.clothType,
        liningColor: formData.liningColor,
        tailorNotes: formData.tailorNotes || "",
      },
    });

    revalidatePath("/");
    revalidatePath("/tracker");
    revalidatePath("/admin");

    return { success: true, order };
  } catch (error) {
    console.error("Failed to approve and initialize tailored order specs:", error);
    return { success: false, error: String(error) };
  }
}

export async function deleteBookingAction(bookingId: string) {
  try {
    await db.booking.delete({
      where: { id: bookingId },
    });

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Failed to cancel fitting booking:", error);
    return { success: false, error: String(error) };
  }
}
