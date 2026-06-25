/**
 * Double You Coaching — GSAP scroll animations + Three.js ambient background
 */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function waitForSite(callback) {
    const root = document.querySelector('[data-screen-label="Double You Coaching — Site"]');
    if (root) {
      callback(root);
      return;
    }
    const observer = new MutationObserver(() => {
      const el = document.querySelector('[data-screen-label="Double You Coaching — Site"]');
      if (el) {
        observer.disconnect();
        callback(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function initThreeBackground(container) {
    if (prefersReducedMotion || typeof THREE === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.id = "dyc-three-bg";
    canvas.setAttribute("aria-hidden", "true");
    container.prepend(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 14;

    const gold = new THREE.Color("#D4AF37");
    const warm = new THREE.Color("#a07846");
    const count = window.innerWidth < 880 ? 120 : 220;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const c = Math.random() > 0.55 ? gold : warm;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = Math.random() * 2.2 + 0.4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec3 p = position;
          p.x += sin(uTime * 0.35 + position.y * 0.4) * 0.35;
          p.y += cos(uTime * 0.28 + position.x * 0.3) * 0.28;
          p.x += uMouse.x * 0.6;
          p.y += uMouse.y * 0.4;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = size * (220.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.05, d) * 0.55;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0 };
    window.addEventListener("pointermove", (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    let rafId = 0;
    const animate = (t) => {
      material.uniforms.uTime.value = t * 0.001;
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouse.x, mouse.y),
        0.04,
      );
      points.rotation.y = t * 0.00004;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }

  function initGsapAnimations(root) {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    if (!prefersReducedMotion) {
      gsap.to("header", {
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "120px top",
          scrub: 0.4,
        },
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(16,13,10,0.82)",
        ease: "none",
      });
    }

    const heroLabel = root.querySelector("#home [style*='Restoring']");
    const heroTitle = root.querySelector("#home h1");
    const heroCopy = root.querySelector("#home p");
    const heroActions = root.querySelector(".dyc-stack-sm");
    const heroImage = root.querySelector(".dyc-hero-img")?.closest(".dyc-hide-mobile");

    if (!prefersReducedMotion && heroTitle) {
      gsap.set([heroLabel, heroTitle, heroCopy, heroActions, heroImage].filter(Boolean), {
        opacity: 0,
        y: 36,
      });
      gsap.timeline({ defaults: { ease: "power3.out", duration: 1.05 } })
        .to(heroLabel, { opacity: 1, y: 0 })
        .to(heroTitle, { opacity: 1, y: 0 }, "-=0.75")
        .to(heroCopy, { opacity: 1, y: 0 }, "-=0.7")
        .to(heroActions, { opacity: 1, y: 0 }, "-=0.65")
        .to(heroImage, { opacity: 1, y: 0, scale: 1 }, "-=0.85");
    }

    const revealSections = root.querySelectorAll(
      "section, footer, .dyc-glass, .dyc-glass-feat",
    );
    revealSections.forEach((el) => {
      if (el.closest("#home")) return;
      if (prefersReducedMotion) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(el, {
        opacity: 0,
        y: 48,
        duration: 0.95,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    });

    const bentoCards = root.querySelectorAll(".dyc-bento > *");
    if (!prefersReducedMotion && bentoCards.length) {
      gsap.from(bentoCards, {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.querySelector(".dyc-bento"),
          start: "top 82%",
        },
      });
    }

    const priceCards = root.querySelectorAll(".dyc-price-grid > *");
    if (!prefersReducedMotion && priceCards.length) {
      gsap.from(priceCards, {
        opacity: 0,
        scale: 0.94,
        y: 30,
        stagger: 0.14,
        duration: 0.8,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: root.querySelector(".dyc-price-grid"),
          start: "top 85%",
        },
      });
    }

    const galleryCards = root.querySelectorAll("#gallery [aspect-ratio], #gallery > div > div");
    if (!prefersReducedMotion) {
      gsap.utils.toArray("#gallery > div > div").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          rotate: i % 2 === 0 ? -1.5 : 1.5,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
        });
      });
    }

    root.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = root.querySelector(id);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          duration: prefersReducedMotion ? 0 : 1.1,
          scrollTo: { y: target, offsetY: 80 },
          ease: "power3.inOut",
        });
      });
    });

    const floatCard = root.querySelector(".dyc-float-card");
    if (floatCard && !prefersReducedMotion) {
      gsap.to(floatCard, {
        y: -8,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }

  function hideDesignChrome() {
    const style = document.createElement("style");
    style.textContent = `
      #dyc-three-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }
      [data-screen-label="Double You Coaching — Site"] {
        position: relative;
        z-index: 1;
      }
      image-slot::part(empty),
      image-slot::part(toolbar) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const hideSlotUi = () => {
      document.querySelectorAll("image-slot").forEach((slot) => {
        const root = slot.shadowRoot;
        if (!root) return;
        root.querySelectorAll("button, .hint, .empty, [data-empty]").forEach((el) => {
          el.style.display = "none";
        });
      });
    };
    hideSlotUi();
    setTimeout(hideSlotUi, 500);
    setTimeout(hideSlotUi, 1500);
  }

  waitForSite((root) => {
    hideDesignChrome();
    initThreeBackground(root);
    initGsapAnimations(root);
  });
})();
