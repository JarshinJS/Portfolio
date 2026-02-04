AOS.init({ once: true, duration: 700, easing: 'ease-out-quart', offset: 60 });

// Typing Effect
const typedText = document.getElementById("typed-text");
const texts = ["Full-Stack Developer", "Django Specialist", "JavaScript Enthusiast", "IoT Innovator"];
let textIndex = 0, charIndex = 0, isDeleting = false;
function typeEffect() {
  const current = texts[textIndex];
  typedText.textContent = isDeleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);
  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) { speed = 900; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; speed = 300; }
  setTimeout(typeEffect, speed);
}
typeEffect();

// Animate Skill Bars
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".skill-counter");
  const progressBars = document.querySelectorAll(".skill-progress");
  counters.forEach((counter, i) => {
    const target = +counter.dataset.target;
    let count = 0;
    function update() {
      if (count < target) { count++; counter.textContent = count; requestAnimationFrame(update); }
      else counter.textContent = target;
    }
    update();
    setTimeout(() => progressBars[i].style.width = progressBars[i].dataset.progress, 300);
  });
});

// Dark Mode
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggle.innerHTML = document.body.classList.contains('dark-mode')
    ? '<i class="bi bi-sun"></i>'
    : '<i class="bi bi-moon-stars"></i>';
});

// Close Navbar on Click (Mobile)
const navLinks = document.querySelectorAll('.nav-link');
const navbarCollapse = document.getElementById('navbarNav');
const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navbarCollapse.classList.contains('show')) {
      bsCollapse.hide();
    }
  });
});
