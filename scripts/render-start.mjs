import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = path.join(rootDir, "server");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const migration = spawnSync(npm, ["run", "migrate:deploy"], {
  cwd: serverDir,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (migration.error) throw migration.error;
if (migration.status !== 0) process.exit(migration.status ?? 1);

await import("../server/src/app.ts");
