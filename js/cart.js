// js/cart.js

// Usamos localStorage para que el carrito persista entre recargas de página.
// Intenta cargar el carrito desde localStorage, o inicializa como un array vacío si no existe.
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("productList");

    // Lógica para añadir productos a la página (si existe la lista de productos)
    // Nota: Esta sección estaba comentada en tu archivo original. La mantengo así.
    if (productList) {
        /*
        productos.forEach(prod => {
            const article = document.createElement("article");
            article.className = "product-card glass-inner";
            article.innerHTML = `
                <h2>${prod.nombre}</h2>
                <img src="images/${prod.imagen}" alt="${prod.nombre}" />
                <p>${prod.stock} unidades, ${prod.diametro} cm de diámetro. Precio: $${prod.precio}</p>
                <button class="btn-primary agregar-carrito" data-id="${prod.id}">Agregar al carrito</button>
            `;
            productList.appendChild(article);
        });
        */

        // Asignar eventos a los botones "Agregar al carrito"
        document.querySelectorAll(".agregar-carrito").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id);
                // Asegúrate de que la variable "productos" esté disponible globalmente o importada
                const producto = productos.find(p => p.id === id);
                const itemEnCarrito = carrito.find(p => p.id === id);

                if (itemEnCarrito) {
                    itemEnCarrito.cantidad += 1;
                } else {
                    carrito.push({ ...producto, cantidad: 1 });
                }
                
                guardarCarritoEnStorage();
                renderizarCarrito();
                // La llamada a actualizarContadorCarrito() aquí ya no es estrictamente necesaria
                // porque renderizarCarrito() ahora se encarga de ello, pero no hace daño dejarla.
                actualizarContadorCarrito(); 
            });
        });
    }

    // Renderizar y actualizar todo al cargar cualquier página
    renderizarCarrito();
    actualizarContadorCarrito();
});

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function renderizarCarrito() {
    const cartPanel = document.getElementById("cartPanel");
    if (!cartPanel) return;

    cartPanel.innerHTML = "<h3>Carrito</h3>";

    if (carrito.length === 0) {
        cartPanel.innerHTML += "<p>Tu carrito está vacío.</p>";
        // Si existe un contenedor de PayPal, lo removemos
        document.getElementById("paypal-button-container")?.remove();
    } else {
        const ul = document.createElement("ul");
        ul.id = "cartItems"; // Asignamos un ID por si lo necesitamos
        let total = 0;

        carrito.forEach(item => {
            const li = document.createElement("li");
            li.innerText = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
            ul.appendChild(li);
            total += item.precio * item.cantidad;
        });

        cartPanel.appendChild(ul);
        cartPanel.innerHTML += `<p><strong>Total: $${total.toFixed(2)}</strong></p>`;

        // Contenedor para el botón de PayPal
        let paypalDiv = document.getElementById("paypal-button-container");
        if (!paypalDiv) {
            paypalDiv = document.createElement("div");
            paypalDiv.id = "paypal-button-container";
            cartPanel.appendChild(paypalDiv);
        }
        renderizarPaypal(total);
    }
    
    // LLAMADA INTEGRADA: Actualizamos el contador cada vez que se renderiza el carrito
    actualizarContadorCarrito();
}

function renderizarPaypal(total) {
    const container = document.getElementById("paypal-button-container");
    if (!container) return;
    container.innerHTML = ""; // Limpia antes de renderizar

    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2)
                    }
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
                alert("Pago completado por " + details.payer.name.given_name);
                carrito = []; // Vaciar el carrito
                guardarCarritoEnStorage(); // Limpiar también el storage
                renderizarCarrito(); // Volver a renderizar para mostrar el carrito vacío
            });
        }
    }).render("#paypal-button-container");
}

/**
 * FUNCIÓN ACTUALIZADA
 * Actualiza la burbuja del contador de ítems en el ícono del carrito.
 * Oculta la burbuja si el carrito está vacío.
 */
function actualizarContadorCarrito() {
    // Corregido el ID a "cart-count" para que coincida con tu HTML y CSS
    const contador = document.getElementById("cart-count");
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
        // Muestra el contador solo si hay más de 0 ítems
        contador.style.display = totalItems > 0 ? "flex" : "none";
    }
}
