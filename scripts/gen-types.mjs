import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const envText = readFileSync(".env", "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const projectId = env.PROJECT_ID;
if (!projectId) {
  console.error("PROJECT_ID is not set in .env");
  process.exit(1);
}

const output = execSync(
  `npx supabase gen types typescript --project-id ${projectId} --schema public`,
  { encoding: "utf8" }
);

writeFileSync("core/supabase/database.types.ts", output, "utf8");
console.log("Types generated → core/supabase/database.types.ts");
