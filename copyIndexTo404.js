import { copyFileSync } from "fs";

try {
  copyFileSync("dist/index.html", "dist/404.html");
  console.log("✅ 404.html created successfully from index.html");
} catch (err) {
  console.error("❌ Failed to create 404.html:", err);
  process.exit(1);
}
