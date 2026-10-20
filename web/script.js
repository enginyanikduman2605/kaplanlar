/* =================================
   BKM TIGERS - CODEPEN SCRIPT
================================= */

(() => {
  "use strict";

  // HTML hazır değilse bekle; hazırsa hemen çalıştır.
  function initBkmTigers() {
    if (document.documentElement.dataset.bkmInitialized === "true") {
      return;
    }

    document.documentElement.dataset.bkmInitialized = "true";

    const $ = (selector) => document.querySelector(selector);
    const byId = (id) => document.getElementById(id);

    const menuBtn = byId("menuBtn");
    const navLinks = $(".nav-links");
    const topBtn = byId("topBtn");
    const contactForm = byId("contactForm");
    const formStatus = byId("formStatus");
    const yearElement = byId("year");

    const loader = byId("loader");
    const loaderProgress = byId("loaderProgress");
    const loaderPercent = byId("loaderPercent");
    const particles = byId("particles");

    /* 1. MOBİL MENÜ */

    if (menuBtn && navLinks) {
      menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuBtn.textContent = isOpen ? "✕" : "☰";
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
          "aria-label",
          isOpen ? "Menüyü kapat" : "Menüyü aç"
        );
      });

      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("open");
          menuBtn.textContent = "☰";
          menuBtn.setAttribute("aria-expanded", "false");
          menuBtn.setAttribute("aria-label", "Menüyü aç");
        });
      });
    }

    /* 2. YUKARI ÇIK BUTONU */

    function updateTopButton() {
      if (!topBtn) return;

      topBtn.classList.toggle("show", window.scrollY > 400);
    }

    if (topBtn) {
      window.addEventListener("scroll", updateTopButton, {
        passive: true
      });

      updateTopButton();

      topBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    }

    /* 3. OTOMATİK YIL */

    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    /* 4. İLETİŞİM FORMU */

    if (contactForm && formStatus) {
      contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = byId("name");
        const emailInput = byId("email");
        const messageInput = byId("message");

        const name = nameInput?.value.trim() || "";
        const email = emailInput?.value.trim() || "";
        const message = messageInput?.value.trim() || "";

        if (!name || !email || !message) {
          formStatus.textContent =
            "Lütfen tüm alanları doldur. 💙";
          return;
        }

        if (emailInput && !emailInput.checkValidity()) {
          formStatus.textContent =
            "Lütfen geçerli bir e-posta adresi gir. 💙";
          emailInput.focus();
          return;
        }

        formStatus.textContent =
          "Mesajın hazır! Gerçek gönderim için bir iletişim servisi bağlanmalı. 💌";
      });
    }

    /* 5. YÜKLEME EKRANI */

    function hideLoader() {
      if (loader) {
        loader.classList.add("hide");
      }

      document.body.classList.add("page-loaded");
    }

    if (loader && loaderProgress && loaderPercent) {
      let progress = 0;
      let loaderFinished = false;
      let progressTimer = null;

      function finishLoader() {
        if (loaderFinished) return;

        loaderFinished = true;
        progress = 100;

        loaderProgress.style.width = "100%";
        loaderPercent.textContent = "100%";

        if (progressTimer !== null) {
          clearInterval(progressTimer);
        }

        setTimeout(hideLoader, 350);
      }

      // Sayfa daha önce yüklenmişse yükleme ekranını bekletme.
      if (document.readyState === "complete") {
        finishLoader();
      } else {
        window.addEventListener("load", finishLoader, {
          once: true
        });

        progressTimer = setInterval(() => {
          // Gerçek yükleme tamamlanana kadar %90'ı geçme.
          if (progress < 90) {
            progress = Math.min(
              90,
              progress + Math.random() * 8 + 2
            );

            loaderProgress.style.width = `${progress}%`;
            loaderPercent.textContent =
              `${Math.floor(progress)}%`;
          }
        }, 150);

        // Beklenmeyen durumlarda ekranın sonsuza kadar kalmasını önle.
        setTimeout(finishLoader, 8000);
      }
    } else {
      hideLoader();
    }

    /* 6. UÇUŞAN MAVİ PARÇACIKLAR */

    if (particles) {
      const symbols = ["✦", "✧", "♡", "🐾", "·"];
      let particleTimer = null;

      function createParticle() {
        if (document.hidden) return;
        if (particles.childElementCount >= 24) return;

        const particle = document.createElement("span");

        particle.className = "particle";
        particle.setAttribute("aria-hidden", "true");

        particle.textContent =
          symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.fontSize =
          `${12 + Math.random() * 22}px`;

        particle.style.animationDuration =
          `${6 + Math.random() * 8}s`;

        particles.appendChild(particle);

        particle.addEventListener("animationend", () => {
          particle.remove();
        }, { once: true });
      }

      function startParticles() {
        if (particleTimer !== null || document.hidden) return;

        particleTimer = setInterval(createParticle, 650);
      }

      function stopParticles() {
        if (particleTimer !== null) {
          clearInterval(particleTimer);
          particleTimer = null;
        }
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopParticles();
        } else {
          startParticles();
        }
      });

      startParticles();
    }

    /* 7. KAYDIRMA ANİMASYONLARI */

    const revealElements = document.querySelectorAll(
      ".section .tag, .section h2, .section-text, " +
      ".card, .gallery-grid img, .contact-form, .gallery-note"
    );

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12
        }
      );

      revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add("visible");
      });
    }

    /* 8. BUTON TIKLAMA EFEKTİ */

    document.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("click", () => {
        if (typeof button.animate !== "function") return;

        button.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(.96)" },
            { transform: "scale(1)" }
          ],
          {
            duration: 220,
            easing: "ease-out"
          }
        );
      });
    });

    console.log("🐯 BKM Tigers JavaScript başarıyla başlatıldı!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBkmTigers, {
      once: true
    });
  } else {
    initBkmTigers();
  }
})();
