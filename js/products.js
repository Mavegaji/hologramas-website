// js/products.js

const productos = [
    { id: 1, nombre: "V20", stock: 7, diametro: 18, precio: 108, imagen: "v20.png" },
    { id: 2, nombre: "V42", stock: 6, diametro: 43, precio: 143, imagen: "v42.png" },
    { id: 3, nombre: "P65", stock: 15, diametro: 65, precio: 704, imagen: "p65.png" },
    { id: 4, nombre: "P80", stock: 10, diametro: 80, precio: 759, imagen: "p80.png" },
    { id: 5, nombre: "A80 - Exterior", stock: 8, diametro: 77, precio: 1628, imagen: "a80.png" }
];

// Su única responsabilidad es renderizar la lista de productos en el DOM.
document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("productList");

    // Si el contenedor de productos no existe en esta página, no hacemos nada.
    if (!productList) return;

    productos.forEach(prod => {
        const article = document.createElement("article");
        article.className = "product-card glass-inner";

        article.innerHTML = `
            <h2>${prod.nombre}</h2>
            <img src="images/${prod.imagen}" alt="${prod.nombre} Equipo Holográfico" />
            <p>${prod.stock} unidades disponibles, ${prod.diametro} cm de diámetro. Precio: $${prod.precio}</p>
            <button class="btn-primary agregar-carrito" data-id="${prod.id}">Agregar al carrito</button>
        `;

        productList.appendChild(article);
    });
});
