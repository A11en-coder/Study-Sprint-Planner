import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = path.join(rootDir, "server");
const clientDir = path.join(rootDir, "client");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function run(args, cwd, env = process.env) {
  const result = spawnSync(npm, args, {
    cwd,
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error("CLERK_PUBLISHABLE_KEY is required to build the client");
}

run(["ci", "--include=dev"], serverDir);
run(["ci", "--include=dev"], clientDir);
run(["run", "generate"], serverDir);
run(["run", "typecheck"], serverDir);

const clientEnv = {
  ...process.env,
  VITE_CLERK_PUBLISHABLE_KEY: publishableKey,
};
delete clientEnv.CLERK_SECRET_KEY;
delete clientEnv.DATABASE_URL;
run(["run", "build"], clientDir, clientEnv);
