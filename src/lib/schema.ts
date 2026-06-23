import { z } from "zod";

export const ThemeConfigSchema = z.object({
  heroTitle: z.string().default("Ageman"),
  heroSubtitle: z.string().default("Refined Javanese Craftsmanship"),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).default("#1C1917"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).default("#44403C"),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).default("#CA8A04"),
  activeBatikPattern: z.enum(["PARANG", "KAWUNG", "MEGAMENDUNG", "NONE"]).default("PARANG"),
  enableAnimations: z.boolean().default(true),
  customStylesJson: z.string().default("{}"),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;
