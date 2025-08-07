// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Cargar partículas de fondo
    if (typeof particlesJS !== 'undefined') {
        particlesJS.load('particles-js', 'js/particles-config.json');
    }

    // Resaltar el enlace activo en la barra de navegación
    const currentPage = window.location.pathname.split('/').pop();
    const navLinksList = document.querySelectorAll('.nav-links a');
    
    navLinksList.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // Manejador para el primer formulario de contacto (si existe)
    const contactForm1 = document.querySelector('form#contact-form');
    if (contactForm1) {
        contactForm1.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm1);
            alert('Gracias por tu mensaje, ' + formData.get('name') + '. Nos pondremos en contacto pronto.');
            contactForm1.reset();
        });
    }

    // Manejador para el segundo formulario de contacto (si existe)
    const contactForm2 = document.getElementById("form-contacto");
    const formMsg = document.getElementById("form-msg");
    if (contactForm2 && formMsg) {
        contactForm2.addEventListener("submit", function (e) {
            e.preventDefault();
            formMsg.textContent = "Mensaje enviado correctamente. ¡Gracias por contactarnos!";
            contactForm2.reset();

            setTimeout(() => {
                formMsg.textContent = "";
            }, 5000);
        });
    }

    // ======================================================
    // LÓGICA DEL MENÚ MÓVIL (INTEGRADA)
    // ======================================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            // Esta línea añade o quita la clase 'active' a la lista de enlaces.
            // El CSS se encargará de mostrar u ocultar el menú basado en esta clase.
            navLinks.classList.toggle('active');
        });
    }

});
