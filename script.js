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

function runTypingEffect() {

  const currentRole = roles[roleIndex];
  typingText.textContent = currentRole.slice(0, charIndex);

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
    setTimeout(runTypingEffect, 140);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(runTypingEffect, 90);
    return;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    setTimeout(runTypingEffect, 1200);
    return;
  }

  isDeleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(runTypingEffect, 300);
}

function toggleMenu() {

  navToggle.classList.toggle("active");
  navMenu.classList.toggle("open");

}

function updateActiveLink() {

  const position = window.scrollY + 120;

  sections.forEach((section) => {

    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (position >= top && position < top + height) {

      navLinks.forEach(link => link.classList.remove("active"));

      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (activeLink) activeLink.classList.add("active");

    }

  });

}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateForm() {

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const messageField = document.getElementById("message");

  if (nameField.value.length < 3) return false;
  if (!validateEmail(emailField.value)) return false;
  if (messageField.value.length < 10) return false;

  return true;

}

const revealObserver = new IntersectionObserver(

  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

      }

    });

  },

  { threshold: 0.2 }

);

revealItems.forEach(item => revealObserver.observe(item));

const progressObserver = new IntersectionObserver(

  (entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        skillProgressBars.forEach(fill => {

          fill.style.width = fill.dataset.progress + "%";

        });

      }

    });

  },

  { threshold: 0.4 }

);

if (skillsSection) progressObserver.observe(skillsSection);

function initializeTiltEffects() {

  if (window.innerWidth < 900) return;

  tiltCards.forEach(card => {

    card.addEventListener("mousemove", e => {

      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * -3;
      const rotateY = ((x / rect.width) - 0.5) * 3;

      card.style.transform =
        `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform = "";

    });

  });

}

function initializeParticles() {

  if (!window.particlesJS) return;

  window.particlesJS("particles-js", {

    particles: {

      number: {
        value: 16
      },

      color: {
        value: ["#60a5fa", "#22d3ee"]
      },

      shape: {
        type: "circle"
      },

      opacity: {
        value: 0.15
      },

      size: {
        value: 2
      },

      line_linked: {
        enable: true,
        distance: 110,
        color: "#60a5fa",
        opacity: 0.08
      },

      move: {
        enable: true,
        speed: 0.4
      }

    },

    interactivity: {

      detect_on: "canvas",

      events: {

        onhover: {
          enable: false
        },

        onclick: {
          enable: false
        }

      }

    },

    retina_detect: false

  });

}

function handleScroll() {

  updateActiveLink();

  if (window.scrollY > 450) {

    backToTop.classList.add("visible");

  } else {

    backToTop.classList.remove("visible");

  }

  ticking = false;

}

navToggle.addEventListener("click", toggleMenu);

navLinks.forEach(link => {

  link.addEventListener("click", () => {

    navMenu.classList.remove("open");

  });

});

window.addEventListener("scroll", () => {

  if (!ticking) {

    window.requestAnimationFrame(handleScroll);
    ticking = true;

  }

}, { passive: true });

backToTop.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});

contactForm.addEventListener("submit", e => {

  e.preventDefault();

  if (!validateForm()) {

    formStatus.style.color = "#fb7185";
    formStatus.textContent = "Please fill the form correctly.";
    return;

  }

  formStatus.style.color = "#34d399";
  formStatus.textContent = "Message validated successfully.";

  contactForm.reset();

});

runTypingEffect();
initializeTiltEffects();
initializeParticles();
updateActiveLink();