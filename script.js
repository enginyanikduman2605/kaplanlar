const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

// Mobil menü
menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Menüyü kapat" : "Menüyü aç"
    );
});

// Menü bağlantısına basılınca menüyü kapat
navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Menüyü aç");
    });
});

// Sayfa açılış ve kaydırma animasyonları
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("visible"));
}

// Otomatik yıl
document.getElementById("year").textContent =
    new Date().getFullYear();

// Mavi hareketli parçacıklar
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let animationId;
let width = 0;
let height = 0;

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
        65,
        Math.floor((width * height) / 15000)
    );

    particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.35 + 0.12,
        opacity: Math.random() * 0.55 + 0.15,
        drift: (Math.random() - 0.5) * 0.35
    }));

    if (reduceMotion) drawParticles();
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(64, 174, 255, ${p.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#168cff";
        ctx.fill();
        ctx.shadowBlur = 0;

        if (!reduceMotion) {
            p.y -= p.speed;
            p.x += p.drift;

            if (p.y < -5) {
                p.y = height + 5;
                p.x = Math.random() * width;
            }

            if (p.x < -5) p.x = width + 5;
            if (p.x > width + 5) p.x = -5;
        }
    });

    if (!reduceMotion) {
        animationId = requestAnimationFrame(drawParticles);
    }
}

resizeCanvas();
if (!reduceMotion) drawParticles();

let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        cancelAnimationFrame(animationId);
        resizeCanvas();

        if (!reduceMotion) drawParticles();
    }, 150);
});
