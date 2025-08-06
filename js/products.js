const productos = [
  { id: 1, nombre: "A80", stock: 8, diametro: 77, precio: 1628, imagen: "a80.jpg" },
  { id: 2, nombre: "V20", stock: 7, diametro: 18, precio: 108, imagen: "v20.jpg" },
  { id: 3, nombre: "V42", stock: 6, diametro: 43, precio: 143, imagen: "v42.jpg" },
  { id: 4, nombre: "P65", stock: 15, diametro: 65, precio: 704, imagen: "p65.jpg" },
  { id: 5, nombre: "P80", stock: 10, diametro: 80, precio: 759, imagen: "p80.jpg" }
];

// Renderizado dinámico
document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");

  productos.forEach(prod => {
    const article = document.createElement("article");
    article.className = "product-card glass-inner";

    article.innerHTML = `
      <h2>${prod.nombre}</h2>
      <img src="images/${prod.imagen}" alt="${prod.nombre} Equipo Holográfico" />
      <p>${prod.stock} unidades disponibles, ${prod.diametro} cm de diámetro. Precio: $${prod.precio}</p>
      <button class="btn-add-cart" data-id="${prod.id}">Agregar al carrito</button>
    `;

    productList.appendChild(article);
  });
});
