// js/cart.js

// Intenta cargar el carrito desde localStorage, o inicializa como un array vacío si no existe.
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/**
 * Guarda el estado actual del carrito en el localStorage.
 */
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Actualiza la burbuja del contador de ítems en el ícono del carrito.
 */
function actualizarContadorCarrito() {
    const contador = document.getElementById("cart-count");
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? "flex" : "none";
    }
}

/**
 * Renderiza el contenido del panel del carrito (usado en cart.html).
 */
function renderizarCarrito() {
    // Aquí puedes colocar la lógica que tenías para mostrar los productos
    // en el panel del carrito en la página cart.html
    const cartPanel = document.getElementById("cartPanel"); 
    if (!cartPanel) return;

    // ... Tu lógica para llenar el panel ...
}

// Evento principal que se ejecuta cuando el HTML está listo.
document.addEventListener('DOMContentLoaded', () => {

    // 1. ACTIVAMOS LOS BOTONES "AGREGAR AL CARRITO" DE TODA LA PÁGINA
    // Ahora esta lógica vive aquí, donde tiene acceso seguro a `productos` y `carrito`.
    document.querySelectorAll(".agregar-carrito").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            // La variable `productos` debe estar disponible globalmente (lo está gracias a products.js)
            const producto = productos.find(p => p.id === id);
            if (!producto) return;

            const itemEnCarrito = carrito.find(p => p.id === id);

            if (itemEnCarrito) {
                itemEnCarrito.cantidad += 1;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }

            guardarCarritoEnStorage();
            actualizarContadorCarrito();
            
            // Notificación simple para el usuario
            // alert(`"${producto.nombre}" fue agregado al carrito.`);
        });
    });

    // 2. ACTUALIZAMOS EL CONTADOR AL CARGAR LA PÁGINA
    actualizarContadorCarrito();
    
    // 3. RENDERIZAMOS EL PANEL DEL CARRITO (si estamos en la página del carrito)
    renderizarCarrito();
});
