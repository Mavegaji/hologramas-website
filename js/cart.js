let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("cart-count");
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? "flex" : "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito(); // Actualiza al cargar

    document.querySelectorAll(".agregar-carrito").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
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
        });
    });
});
