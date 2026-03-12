const roles = [
  "Java Developer",
  "Fast Learner",
  "Team Player"
];

const typingText = document.getElementById("typingText");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-fill");
const skillsSection = document.getElementById("skills");
const backToTop = document.getElementById("backToTop");
const siteHeader = document.getElementById("siteHeader");
const tiltCards = document.querySelectorAll(".tilt-card");
const projectTrack = document.getElementById("projectTrack");
const projectPrev = document.getElementById("projectPrev");
const projectNext = document.getElementById("projectNext");
const projectSlides = document.querySelectorAll(".project-slide");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let activeSection = "";
let ticking = false;
let currentSlide = 0;
let touchStartX = 0;
let touchCurrentX = 0;
let tiltEnabled = window.innerWidth > 1024;

function runTypingEffect() {
  const currentRole = roles[roleIndex];
  typingText.textContent = currentRole.slice(0, charIndex);

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex += 1;
    setTimeout(runTypingEffect, 120);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(runTypingEffect, 70);
    return;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    setTimeout(runTypingEffect, 1200);
    return;
  }

  isDeleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(runTypingEffect, 260);
}

function openMenu() {
  navToggle.classList.add("active");
  navMenu.classList.add("open");
  navMenu.classList.remove("hidden");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  navToggle.classList.remove("active");
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  if (window.innerWidth < 768) {
    navMenu.classList.add("hidden");
  }
}

function toggleMenu() {
  if (navMenu.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

function updateActiveLink() {
  const position = window.scrollY + 140;
  let nextActiveSection = activeSection;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (position >= top && position < top + height) {
      nextActiveSection = id;
    }
  });

  if (nextActiveSection === activeSection) {
    return;
  }

  activeSection = nextActiveSection;
  navLinks.forEach((navLink) => navLink.classList.remove("active"));

  const activeLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -36px 0px"
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      skillBars.forEach((bar) => {
        bar.style.width = `${bar.dataset.progress}%`;
      });
      skillObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.3
  }
);

if (skillsSection) {
  skillObserver.observe(skillsSection);
}

function resetTilt(card) {
  card.style.transform = "";
}

function syncTiltMode() {
  tiltEnabled = window.innerWidth > 1024;
  if (!tiltEnabled) {
    tiltCards.forEach((card) => resetTilt(card));
  }
}

function initializeTiltEffects() {
  tiltCards.forEach((card) => {
    let frameRequested = false;

    card.addEventListener("mousemove", (event) => {
      if (!tiltEnabled || frameRequested) {
        return;
      }

      frameRequested = true;
      window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -2.6;
        const rotateY = ((x / rect.width) - 0.5) * 2.6;
        card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        frameRequested = false;
      });
    });

    card.addEventListener("mouseleave", () => {
      resetTilt(card);
      frameRequested = false;
    });
  });
}

function getSlidesPerView() {
  if (window.innerWidth <= 768) {
    return 1;
  }

  if (window.innerWidth <= 1200) {
    return 2;
  }

  return 3;
}

function updateSlider() {
  if (!projectTrack || !projectSlides.length) {
    return;
  }

  const perView = getSlidesPerView();
  const maxIndex = Math.max(projectSlides.length - perView, 0);
  currentSlide = Math.min(currentSlide, maxIndex);

  const slideWidth = projectSlides[0].getBoundingClientRect().width;
  const gap = 20;
  const offset = currentSlide * (slideWidth + gap);
  projectTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;

  if (projectPrev) {
    projectPrev.disabled = currentSlide === 0;
    projectPrev.style.opacity = currentSlide === 0 ? "0.45" : "1";
  }

  if (projectNext) {
    projectNext.disabled = currentSlide >= maxIndex;
    projectNext.style.opacity = currentSlide >= maxIndex ? "0.45" : "1";
  }
}

function showNextSlide() {
  const maxIndex = Math.max(projectSlides.length - getSlidesPerView(), 0);
  currentSlide = Math.min(currentSlide + 1, maxIndex);
  updateSlider();
}

function showPrevSlide() {
  currentSlide = Math.max(currentSlide - 1, 0);
  updateSlider();
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchCurrentX = touchStartX;
}

function handleTouchMove(event) {
  touchCurrentX = event.touches[0].clientX;
}

function handleTouchEnd() {
  const distance = touchStartX - touchCurrentX;

  if (Math.abs(distance) < 45) {
    return;
  }

  if (distance > 0) {
    showNextSlide();
  } else {
    showPrevSlide();
  }
}

function handleScroll() {
  updateActiveLink();

  if (window.scrollY > 24) {
    siteHeader.classList.add("shadow-[0_14px_28px_rgba(2,6,23,0.25)]", "backdrop-blur-xl", "bg-slate-950/72");
  } else {
    siteHeader.classList.remove("shadow-[0_14px_28px_rgba(2,6,23,0.25)]", "backdrop-blur-xl", "bg-slate-950/72");
  }

  if (backToTop) {
    if (window.scrollY > 420) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }

  ticking = false;
}

navToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      closeMenu();
    }
  });
});

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });

window.addEventListener("resize", () => {
  syncTiltMode();
  if (window.innerWidth >= 768) {
    navMenu.classList.remove("hidden", "open");
  } else if (!navMenu.classList.contains("open")) {
    navMenu.classList.add("hidden");
  }
  updateSlider();
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

if (projectPrev) {
  projectPrev.addEventListener("click", showPrevSlide);
}

if (projectNext) {
  projectNext.addEventListener("click", showNextSlide);
}

if (projectTrack) {
  projectTrack.addEventListener("touchstart", handleTouchStart, { passive: true });
  projectTrack.addEventListener("touchmove", handleTouchMove, { passive: true });
  projectTrack.addEventListener("touchend", handleTouchEnd, { passive: true });
}

skillBars.forEach((bar) => {
  bar.style.width = "0%";
});

if (window.innerWidth < 768) {
  navMenu.classList.add("hidden");
}

syncTiltMode();
updateActiveLink();
updateSlider();
runTypingEffect();
initializeTiltEffects();
