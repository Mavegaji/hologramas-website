// js/script.js

document.addEventListener('DOMContentLoaded', () => {
  // Cargar partículas
  particlesJS.load('particles-js', 'js/particles-config.json');

  // Navbar active link highlighting
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Contact form 1
  const contactForm = document.querySelector('form#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      alert('Gracias por tu mensaje, ' + formData.get('name') + '. Nos pondremos en contacto pronto.');
      contactForm.reset();
    });
  }

  // Contact form 2
  const form = document.getElementById("form-contacto");
  const msg = document.getElementById("form-msg");
  if (form && msg) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.textContent = "Mensaje enviado correctamente. ¡Gracias por contactarnos!";
      form.reset();

      setTimeout(() => {
        msg.textContent = "";
      }, 5000);
    });
  }

  // ======= NUEVO: Menú móvil =========
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
});
