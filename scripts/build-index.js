const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(
  path.join(__dirname, "../UI - html-design-files/Double You Coaching Site Main-design.dc.html"),
  "utf8",
);

const imageMap = {
  "dyc-hero": "/image-assets/nana-bonsra.png",
  "dyc-hero-portrait": "/image-assets/nana-bonsra.png",
  "dyc-av1": "/image-assets/nana-2.avif",
  "dyc-av2": "/image-assets/images.jpg",
  "dyc-av3": "/image-assets/lotus-silhouette-logo_361591-2211.avif",
  "dyc-about": "/image-assets/nana-blue.png",
  "dyc-pillar-1": "/image-assets/sunday-good-reads.png",
  "dyc-nextsteps": "/image-assets/nana-blue.png",
  "dyc-rwanda-1": "/image-assets/sunday-good-reads.png",
  "dyc-proj-1": "/image-assets/nana-bonsra.png",
  "dyc-proj-2": "/image-assets/sunday-good-reads.png",
  "dyc-proj-3": "/image-assets/nana-blue.png",
  "dyc-proj-4": "/image-assets/nana-2.avif",
  "dyc-video": "/image-assets/nana-bonsra.png",
};

let html = src
  .replace('<script src="./support.js"></script>', '<script src="/js/support.js"></script>')
  .replace('<script src="image-slot.js"></script>', '<script src="/js/image-slot.js"></script>')
  .replace(
    /<script data-cfasync="false" src="\/cdn-cgi\/scripts[^"]*"><\/script>/,
    "",
  )
  .replace(
    /<a href="\/cdn-cgi\/l\/email-protection" class="__cf_email__" data-cfemail="1c7f6e736f6f6e756a7d5c747368717d7570327f7371">\[email&#160;protected\]<\/a>/g,
    '<a href="mailto:crossriva@hotmail.com" style="color:#D4AF37;text-decoration:none;">crossriva@hotmail.com</a>',
  )
  .replace(
    /<a href="\/cdn-cgi\/l\/email-protection" class="__cf_email__" data-cfemail="5e3d2c312d2d2c37283f1e273f363131703d3f">\[email&#160;protected\]<\/a>/g,
    '<a href="mailto:crossriva@yahoo.ca" style="color:#D4AF37;text-decoration:none;">crossriva@yahoo.ca</a>',
  )
  .replace(
    /<a href="\/cdn-cgi\/l\/email-protection" class="__cf_email__" data-cfemail="b2d1c0ddc1c1c0dbc4d3f2daddc6dfd3dbde9cd1dddf">\[email&#160;protected\]<\/a>/g,
    '<a href="mailto:crossriva@hotmail.com" style="color:#a89a86;text-decoration:none;">crossriva@hotmail.com</a>',
  )
  .replace(
    /<a href="\/cdn-cgi\/l\/email-protection" class="__cf_email__" data-cfemail="096a7b667a7a7b607f68497068616666276a68">\[email&#160;protected\]<\/a>/g,
    '<a href="mailto:crossriva@yahoo.ca" style="color:#a89a86;text-decoration:none;">crossriva@yahoo.ca</a>',
  );

for (const [id, srcUrl] of Object.entries(imageMap)) {
  html = html.replace(
    new RegExp(`(<image-slot id="${id}"[^>]*)(>)`, "g"),
    `$1 src="${srcUrl}"$2`,
  );
}

const headInject = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<style>
  html { scroll-behavior: auto; }
  .gsap-reveal { will-change: transform, opacity; }
</style>`;

html = html.replace("</helmet>", headInject + "\n</helmet>");

const bodyScripts = `
<script src="https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollToPlugin.min.js"></script>
<script src="/js/site-enhancements.js"></script>`;

html = html.replace("</body>", bodyScripts + "\n</body>");

const title = "<title>Double You Coaching — Nana Bonsra</title>\n";
html = html.replace("<head>", "<head>\n" + title);

fs.writeFileSync(path.join(__dirname, "../index.html"), html);
console.log("Built index.html", html.length, "bytes");
