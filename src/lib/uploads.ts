import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

/* ============================================================
   PDF UPLOADS — files live outside the app so they survive
   redeploys. On Railway that is the /data volume, locally the
   project's uploads/ folder (gitignored).
   ============================================================ */

export function uploadDir(): string {
  const env = process.env.UPLOAD_DIR;
  if (env) return env;
  // Railway mounts the persistent volume at /data
  if (existsSync("/data")) return "/data/uploads";
  return path.join(process.cwd(), "uploads");
}

export function ensureUploadDir(): string {
  const dir = uploadDir();
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function guidePdfPath(id: string): string {
  return path.join(ensureUploadDir(), `${id}.pdf`);
}

export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB
