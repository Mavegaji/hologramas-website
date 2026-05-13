// js/cart.js

// La variable `productos` viene de `products.js` y debe estar disponible globalmente.

// Intenta cargar el carrito desde localStorage, o inicializa como un array vacío si no existe.
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/**
 * Guarda el estado actual del carrito en el localStorage.
 */
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Actualiza la burbuja del contador de ítems en el ícono del header.
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
 * Renderiza la página completa del carrito, incluyendo la tabla y los totales.
 */
function renderizarPaginaCarrito() {
    const cartView = document.getElementById('cart-view');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTableBody = document.getElementById('cart-items-table');

    // Si no estamos en la página del carrito, no hacemos nada de esto.
    if (!cartView || !emptyCartMessage || !cartTableBody) return;

    if (carrito.length === 0) {
        cartView.classList.add('hidden');
        emptyCartMessage.classList.remove('hidden');
        return;
    }

    cartView.classList.remove('hidden');
    emptyCartMessage.classList.add('hidden');

    cartTableBody.innerHTML = ''; // Limpiar la tabla antes de re-renderizar

    let subtotal = 0;

    carrito.forEach(item => {
        const itemSubtotal = item.precio * item.cantidad;
        subtotal += itemSubtotal;

        const tr = document.createElement('tr');
        tr.className = 'cart-item';
        tr.innerHTML = `
            <td data-label="Producto">${item.nombre}</td>
            <td data-label="Precio">$${item.precio.toFixed(2)}</td>
            <td data-label="Cantidad" class="quantity-controls">
                <button class="btn-quantity" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-quantity" data-id="${item.id}" data-action="increase">+</button>
            </td>
            <td data-label="Subtotal">$${itemSubtotal.toFixed(2)}</td>
            <td data-label="">
                <button class="btn-remove" data-id="${item.id}">&times;</button>
            </td>
        `;
        cartTableBody.appendChild(tr);
    });

    // Calcular y mostrar totales
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

/**
 * Modifica la cantidad de un producto en el carrito.
 */
function modificarCantidad(productId, action) {
    const itemEnCarrito = carrito.find(p => p.id === productId);
    if (!itemEnCarrito) return;

    if (action === 'increase') {
        itemEnCarrito.cantidad++;
    } else if (action === 'decrease') {
        itemEnCarrito.cantidad--;
    }

    if (itemEnCarrito.cantidad <= 0) {
        // Si la cantidad es 0 o menos, eliminamos el producto
        carrito = carrito.filter(p => p.id !== productId);
    }
    
    guardarCarritoEnStorage();
    actualizarContadorCarrito();
    renderizarPaginaCarrito();
}

/**
 * Elimina un producto del carrito.
 */
function eliminarDelCarrito(productId) {
    carrito = carrito.filter(p => p.id !== productId);
    guardarCarritoEnStorage();
    actualizarContadorCarrito();
    renderizarPaginaCarrito();
}

// Evento principal que se ejecuta cuando el HTML está listo.
document.addEventListener('DOMContentLoaded', () => {

    // Activar los botones "Agregar al carrito" en cualquier página
    document.querySelectorAll(".agregar-carrito").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            const producto = productos.find(p => p.id === id);
            if (!producto) return;

            const itemEnCarrito = carrito.find(p => p.id === id);
            if (itemEnCarrito) {
                itemEnCarrito.cantidad++;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }
            guardarCarritoEnStorage();
            actualizarContadorCarrito();
        });
    });

    // Activar botones de control de cantidad y eliminación (solo en la página del carrito)
    // Usamos delegación de eventos para que funcione con elementos creados dinámicamente
    const cartContainer = document.querySelector('.cart-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', (event) => {
            const target = event.target;
            const productId = parseInt(target.dataset.id);

            if (target.classList.contains('btn-quantity')) {
                const action = target.dataset.action;
                modificarCantidad(productId, action);
            }
            if (target.classList.contains('btn-remove')) {
                eliminarDelCarrito(productId);
            }
        });
    }

    // Actualizar el contador del header al cargar cualquier página
    actualizarContadorCarrito();
    
    // Renderizar la tabla del carrito (solo si estamos en la página correcta)
    renderizarPaginaCarrito();
});
