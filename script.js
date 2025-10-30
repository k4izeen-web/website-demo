let currentLang = "ar";
let currentTheme = "light";

document.addEventListener("DOMContentLoaded", () => {
  // لغة + اتجاه
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  // ثيم
  document.documentElement.setAttribute("data-theme", currentTheme);

  // ترجمة
  updateLanguage();

  // أحداث عامة
  setupEventListeners();

  // سكرول سلس
  setupSmoothScroll();

  // أنيميشن عند الظهور
  setupScrollAnimations();

  // FAQ
  setupFAQ(); // تأكد تُستدعى مرة واحدة فقط
});

function setupEventListeners() {
  const langToggle = document.getElementById("langToggle");
  if (langToggle) langToggle.addEventListener("click", toggleLanguage);

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });

    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => mobileMenu.classList.remove("active"));
    });

    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove("active");
      }
    });
  }
}

function toggleLanguage() {
  currentLang = currentLang === "ar" ? "en" : "ar";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  updateLanguage();
}

function updateLanguage() {
  document.querySelectorAll("[data-en][data-ar]").forEach((el) => {
    el.textContent = currentLang === "ar" ? el.getAttribute("data-ar") : el.getAttribute("data-en");
  });
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      const headerHeight = 72;
      window.scrollTo({ top: target.offsetTop - headerHeight, behavior: "smooth" });
    });
  });
}

function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(
    ".service-card, .feature-card, .stat-card, .team-member, .contact-card"
  ).forEach((el) => observer.observe(el));
}

// ظل الهيدر عند السحب
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;
  header.style.boxShadow = window.pageYOffset > 100 ? "0 2px 16px rgba(0,0,0,0.08)" : "none";
});

/* ===== FAQ ===== */
function setupFAQ() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item, idx) => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!btn || !answer) return;

    const answerId = answer.id || `faq-answer-${idx + 1}`;
    answer.id = answerId;

    btn.setAttribute("type", "button");
    btn.setAttribute("aria-controls", answerId);
    btn.setAttribute("aria-expanded", "false");

    // أغلق افتراضيًا
    answer.classList.remove("is-open");
    answer.style.maxHeight = null;

    btn.addEventListener("click", () => {
      const isOpen = answer.classList.contains("is-open");

      // أغلق البقية (أكورديون)
      document.querySelectorAll(".faq-answer.is-open").forEach((openAns) => {
        if (openAns !== answer) {
          openAns.classList.remove("is-open");
          openAns.style.maxHeight = null;
          const openBtn = openAns.closest(".faq-item")?.querySelector(".faq-question");
          if (openBtn) openBtn.setAttribute("aria-expanded", "false");
          openAns.closest(".faq-item")?.classList.remove("active");
        }
      });

      // بدّل الحالي
      if (!isOpen) {
        answer.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
        item.classList.add("active");
      } else {
        answer.classList.remove("is-open");
        answer.style.maxHeight = null;
        btn.setAttribute("aria-expanded", "false");
        item.classList.remove("active");
      }
    });
  });

  // لو تغيّر مقاس المحتوى، حدّث maxHeight
  window.addEventListener("resize", () => {
    document.querySelectorAll(".faq-answer.is-open").forEach((ans) => {
      ans.style.maxHeight = ans.scrollHeight + "px";
    });
  });
}
