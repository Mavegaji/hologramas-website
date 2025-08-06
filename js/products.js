const productos = [
  { nombre: "A80", stock: 8, diametro: 77, precio: 1628, imagen: "a80.jpg" },
  { nombre: "V20", stock: 7, diametro: 18, precio: 108, imagen: "v20.jpg" },
  { nombre: "V42", stock: 6, diametro: 43, precio: 143, imagen: "v42.jpg" },
  { nombre: "P65", stock: 15, diametro: 65, precio: 704, imagen: "p65.jpg" },
  { nombre: "P80", stock: 10, diametro: 80, precio: 759, imagen: "p80.jpg" }
];

document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("productList");

  productos.forEach(prod => {
    const article = document.createElement("article");
    article.className = "product-card glass-inner";
    article.innerHTML = `
      <h2>${prod.nombre}</h2>
      <img src="images/${prod.imagen}" alt="${prod.nombre} Equipo Holográfico" />
      <p>${prod.stock} unidades disponibles, ${prod.diametro} cm de diámetro. Precio: $${prod.precio}</p>
    `;
    productList.appendChild(article);
  });
});
