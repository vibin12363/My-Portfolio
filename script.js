/* ─────────────────────────────────────────────────────
   VIBIN PORTFOLIO  ·  script.js
───────────────────────────────────────────────────── */

/* ── TYPING ANIMATION ─────────────────────────────── */
const roles = ['Generative AI Engineer', 'Web Developer', 'LLM Enthusiast', 'B.E. CSE Student'];
const roleEl = document.getElementById('role-text');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeRole() {
  const current = roles[roleIdx];
  if (!deleting) {
    roleEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 1800);   // pause before deleting
      return;
    }
    setTimeout(typeRole, 90);
  } else {
    roleEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(typeRole, 400);
      return;
    }
    setTimeout(typeRole, 50);
  }
}
typeRole();


/* ── MOBILE MENU ──────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', open);
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});


/* ── SCROLL SPY — active nav link ─────────────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function onScroll() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });

  navItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();   // run once on load


/* ── CONTACT FORM  —  Formsphere ──────────────────── */
/*
  HOW TO SET UP FORMSPHERE:
  1. Create a free account at https://formsphere.app
  2. Click "New Form" and name it (e.g. "Portfolio Contact")
  3. Copy the Form Endpoint URL shown in your dashboard
  4. Paste it below as the value of FORMSPHERE_ENDPOINT
*/
const FORMSPHERE_ENDPOINT = 'https://formspree.io/f/xwvwnbdy';
//                                                            ^^^^^^^^^^^
//                                          Replace with your actual Form ID

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation
  const company = document.getElementById('company').value.trim();
  const contact = document.getElementById('contact_detail').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!company || !contact || !message) {
    setStatus('Please fill in all fields.', 'error');
    return;
  }

  // Disable button while submitting
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  setStatus('', '');

  try {
    const res = await fetch(FORMSPHERE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, contact, message })
    });

    if (res.ok) {
      setStatus('✓ Message sent! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    } else {
      // Try to parse error from Formsphere
      let errText = 'Something went wrong. Please try again.';
      try { const d = await res.json(); errText = d.message || errText; } catch (_) { }
      setStatus(errText, 'error');
    }
  } catch (err) {
    setStatus('Network error — please check your connection.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});

function setStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-status ' + type;
}


/* ── FADE-IN ON SCROLL ───────────────────────────── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

// Add fade-in class & observe key elements
const fadeEls = document.querySelectorAll(
  '.project-card, .skill-group, .cert-item, .timeline-card, .stat-card, .about-text-block p'
);

fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
  observer.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.visible, [style*="opacity: 1"]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
});

// Intersection helper: add visible class
const styleSheet = document.createElement('style');
styleSheet.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(styleSheet);