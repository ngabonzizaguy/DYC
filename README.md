# Double You Coaching — Design Prototype

Client-facing design prototype for **Double You Coaching** (Nana Bonsra).

## Live preview

**https://dyc-sable.vercel.app**

Built from `UI - html-design-files/Double You Coaching Site Main-design.dc.html` (mobile-responsive final design) with GSAP scroll animations and a Three.js ambient particle background.

## Rebuild

After editing the Main-design source file:

```bash
node scripts/build-index.js
```

## Project structure

| Path | Description |
|------|-------------|
| `index.html` | Production site (built from Main-design) |
| `js/support.js` | Claude Design Canvas runtime |
| `js/image-slot.js` | Image slot web component |
| `js/site-enhancements.js` | GSAP + Three.js enhancements |
| `UI - html-design-files/Double You Coaching Site Main-design.dc.html` | **Source of truth** — final design with mobile breakpoints |
| `image-assets/` | Brand images |
