import { db } from "./db";
import { ThemeConfigSchema, ThemeConfig } from "./schema";

export async function getThemeConfig(): Promise<ThemeConfig> {
  try {
    const config = await db.themeConfig.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    
    if (!config) {
      return ThemeConfigSchema.parse({});
    }
    
    return ThemeConfigSchema.parse(config);
  } catch (error) {
    console.error("Error loading theme config from database:", error);
    // Fall back to schema defaults
    return ThemeConfigSchema.parse({});
  }
}
