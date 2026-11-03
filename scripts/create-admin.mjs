import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnv(path) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator);
      if (!process.env[key]) process.env[key] = trimmed.slice(separator + 1);
    }
  } catch {
    // Missing env files are reported below.
  }
}

loadEnv(".env.local");
loadEnv(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceRoleKey || !email || !password) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: { role: "admin" },
});

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Created admin ${data.user?.id ?? ""}`);
