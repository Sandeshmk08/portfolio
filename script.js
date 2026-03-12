const roles = [
  "MCA Student",
  "Java Developer",
  "Web Developer"
];

const typingText = document.getElementById("typingText");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const tiltCards = document.querySelectorAll(".tilt-card");
const skillProgressBars = document.querySelectorAll(".skill-progress-fill");
const skillsSection = document.getElementById("skills");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let activeSection = "";
let ticking = false;
let tiltEnabled = window.innerWidth > 1024;

function runTypingEffect() {
  const currentRole = roles[roleIndex];
  typingText.textContent = currentRole.slice(0, charIndex);

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex += 1;
    setTimeout(runTypingEffect, 130);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(runTypingEffect, 80);
    return;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    setTimeout(runTypingEffect, 1250);
    return;
  }

  isDeleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(runTypingEffect, 280);
}

function openMenu() {
  navToggle.classList.add("active");
  navMenu.classList.add("open");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  navToggle.classList.remove("active");
  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
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

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setFieldError(field, message) {
  const group = field.parentElement;
  const error = group.querySelector(".error-message");
  group.classList.add("error");
  error.textContent = message;
}

function clearFieldError(field) {
  const group = field.parentElement;
  const error = group.querySelector(".error-message");
  group.classList.remove("error");
  error.textContent = "";
}

function validateForm() {
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");
  let isValid = true;

  if (!nameField || !emailField || !messageField) {
    return false;
  }

  if (nameField.value.trim().length < 3) {
    setFieldError(nameField, "Please enter at least 3 characters.");
    isValid = false;
  } else {
    clearFieldError(nameField);
  }

  if (!validateEmail(emailField.value)) {
    setFieldError(emailField, "Please enter a valid email address.");
    isValid = false;
  } else {
    clearFieldError(emailField);
  }

  if (messageField.value.trim().length < 10) {
    setFieldError(messageField, "Please enter at least 10 characters.");
    isValid = false;
  } else {
    clearFieldError(messageField);
  }

  return isValid;
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
    rootMargin: "0px 0px -32px 0px"
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      skillProgressBars.forEach((fill) => {
        fill.style.width = `${fill.dataset.progress}%`;
      });
      progressObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.28
  }
);

if (skillsSection) {
  progressObserver.observe(skillsSection);
}

function resetTilt(card) {
  card.style.transform = "";
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
        const rotateX = ((y / rect.height) - 0.5) * -2.4;
        const rotateY = ((x / rect.width) - 0.5) * 2.4;

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

function syncTiltMode() {
  tiltEnabled = window.innerWidth > 1024;

  if (!tiltEnabled) {
    tiltCards.forEach((card) => {
      resetTilt(card);
    });
  }
}

function handleScroll() {
  updateActiveLink();

  if (window.scrollY > 420) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }

  ticking = false;
}

navToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleScroll);
    ticking = true;
  }
}, { passive: true });

window.addEventListener("resize", syncTiltMode, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";

    if (!validateForm()) {
      formStatus.style.color = "#fb7185";
      formStatus.textContent = "Please correct the highlighted fields and try again.";
      return;
    }

    formStatus.style.color = "#34d399";
    formStatus.textContent = "Message validated successfully. This form is ready for backend integration later.";
    contactForm.reset();
  });

  ["name", "email", "message"].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", () => clearFieldError(field));
    }
  });
}

skillProgressBars.forEach((fill) => {
  fill.style.width = "0%";
});

syncTiltMode();
updateActiveLink();
runTypingEffect();
initializeTiltEffects();
