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

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTypingEffect() {
  const currentRole = roles[roleIndex];
  typingText.textContent = currentRole.slice(0, charIndex);

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex += 1;
    setTimeout(runTypingEffect, 110);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(runTypingEffect, 60);
    return;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    setTimeout(runTypingEffect, 1300);
    return;
  }

  isDeleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(runTypingEffect, 250);
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

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (position >= top && position < top + height) {
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      if (link) {
        link.classList.add("active");
      }
    }
  });
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
    threshold: 0.15
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

function initializeTiltEffects() {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth <= 768) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      const rotateY = ((x / rect.width) - 0.5) * 10;

      card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initializeParticles() {
  if (!window.particlesJS) {
    return;
  }

  window.particlesJS("particles-js", {
    particles: {
      number: {
        value: 55,
        density: {
          enable: true,
          value_area: 900
        }
      },
      color: {
        value: ["#60a5fa", "#8b5cf6", "#22d3ee"]
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.35,
        random: true
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 140,
        color: "#60a5fa",
        opacity: 0.18,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out"
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 160,
          line_linked: {
            opacity: 0.35
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  });
}

navToggle.addEventListener("click", toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  updateActiveLink();

  if (window.scrollY > 450) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

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
  field.addEventListener("input", () => clearFieldError(field));
});

updateActiveLink();
runTypingEffect();
initializeTiltEffects();
initializeParticles();
