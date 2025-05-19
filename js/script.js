// js/scripts.js

document.addEventListener('DOMContentLoaded', () => {
  particlesJS.load('particles-js', 'js/particles-config.json');
});

document.addEventListener('DOMContentLoaded', () => {
  // Navbar active link highlighting
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Contact form handling (if exists)
  const contactForm = document.querySelector('form#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      alert('Gracias por tu mensaje, ' + formData.get('name') + '. Nos pondremos en contacto pronto.');
      contactForm.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
  particlesJS.load('particles-js', 'js/particles-config.json');
   });

});
