// js/cart.js

let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");

  if (productList) {
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

    document.querySelectorAll(".agregar-carrito").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.id);
        const producto = productos.find(p => p.id === id);
        const itemEnCarrito = carrito.find(p => p.id === id);

        if (itemEnCarrito) {
          itemEnCarrito.cantidad += 1;
        } else {
          carrito.push({ ...producto, cantidad: 1 });
        }

        renderizarCarrito();
      });
    });
  }

  renderizarCarrito(); // Llamar al cargar en cualquier página
});

function renderizarCarrito() {
  const cartPanel = document.getElementById("cartPanel");
  if (!cartPanel) return;

  cartPanel.innerHTML = "<h3>Carrito</h3>";

  if (carrito.length === 0) {
    cartPanel.innerHTML += "<p>Tu carrito está vacío.</p>";
    document.getElementById("paypal-button-container")?.remove();
    return;
  }

  const ul = document.createElement("ul");
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

function renderizarPaypal(total) {
  const container = document.getElementById("paypal-button-container");
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
        carrito = [];
        renderizarCarrito();
      });
    }
  }).render("#paypal-button-container");
}
