const fs = require("fs");
const zlib = require("zlib");

const html = fs.readFileSync(
  "C:/Users/G/Desktop/2025/Projects/DYC/image-assets/dyc-design.html",
  "utf8",
);
const match = html.match(
  /<script type="__bundler\/manifest">([\s\S]*?)<\/script>/,
);
if (!match) {
  console.error("manifest not found");
  process.exit(1);
}

const manifest = JSON.parse(match[1]);
const outDir = "C:/Users/G/Desktop/2025/Projects/DYC/public/js";
fs.mkdirSync(outDir, { recursive: true });

for (const [uuid, entry] of Object.entries(manifest)) {
  const bytes = Buffer.from(entry.data, "base64");
  const finalBytes = entry.compressed ? zlib.gunzipSync(bytes) : bytes;
  const ext =
    entry.mime === "text/javascript"
      ? ".js"
      : entry.mime === "text/css"
        ? ".css"
        : entry.mime.startsWith("font/")
          ? ".woff2"
          : entry.mime.startsWith("image/")
            ? ".bin"
            : ".dat";
  const outPath = `${outDir}/${uuid}${ext}`;
  fs.writeFileSync(outPath, finalBytes);
  console.log(uuid, entry.mime, finalBytes.length, "->", outPath);
  if (entry.mime === "text/javascript") {
    const preview = finalBytes.toString("utf8", 0, 120);
    console.log("  preview:", preview.replace(/\n/g, " "));
  }
}
