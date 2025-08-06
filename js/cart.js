let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  const cartToggleBtn = document.getElementById("cartToggle");
  const cartPanel = document.getElementById("cartPanel");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Mostrar/ocultar carrito
  cartToggleBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("hidden");
  });

  // Escuchar clicks de "Agregar al carrito"
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add-cart")) {
      const id = parseInt(e.target.dataset.id);
      agregarAlCarrito(id);
      renderizarCarrito();
    }
  });

  function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    const enCarrito = carrito.find(item => item.id === idProducto);

    if (producto && producto.stock > 0) {
      if (enCarrito) {
        if (enCarrito.cantidad < producto.stock) {
          enCarrito.cantidad++;
        } else {
          alert("No hay más stock disponible.");
        }
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }
    }
  }

  function renderizarCarrito() {
    cartItems.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
      cartItems.innerHTML = "<li>Tu carrito está vacío.</li>";
    } else {
      carrito.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`;
        cartItems.appendChild(li);
        total += item.precio * item.cantidad;
      });
    }

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

  // Simula paso a checkout
  checkoutBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
    } else {
      alert("Aquí iría la pasarela de pago (PayPal, etc).");
      // Aquí se puede integrar PayPal o Stripe
    }
  });
});
