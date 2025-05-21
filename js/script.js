// js/script.js

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Partículas
  particlesJS.load('particles-js', 'js/particles-config.json');

  // Resaltar el enlace actual del menú
  const links = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Lógica de menú hamburguesa
  const toggleBtn = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // Manejo del formulario de contacto con ID 'contact-form'
  const contactForm = document.querySelector('form#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      alert('Gracias por tu mensaje, ' + formData.get('name') + '. Nos pondremos en contacto pronto.');
      contactForm.reset();
    });
  }

  // Manejo del formulario con ID 'form-contacto' y mensaje
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
});
