// Simple seed runner — avoids PowerShell JSON quoting issues
// Run with: node prisma/run-seed.mjs
import { execSync } from "child_process";

execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
