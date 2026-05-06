// js/products.js

const productos = [
    {
        id: 1,
        nombre: "V20",
        stock: 7,
        diametro: 18,
        precio: 108,
        imagen: "V20.png",
        descripcion: "Display holográfico compacto ideal para escaparates, puntos de venta y presentaciones de escritorio.",
        tiloPayUrl: "https://tp.cr/l/MjEwNDQ4"
    },
    {
        id: 2,
        nombre: "V42",
        stock: 6,
        diametro: 43,
        precio: 143,
        imagen: "V42.png",
        descripcion: "Display holográfico de tamaño mediano, perfecto para kioscos interactivos y exhibiciones comerciales.",
        tiloPayUrl: "https://tp.cr/l/MjEwNDUw"
    },
    {
        id: 3,
        nombre: "P65",
        stock: 15,
        diametro: 65,
        precio: 704,
        imagen: "P65.png",
        descripcion: "Sistema profesional de alto impacto para presentaciones corporativas, ferias y eventos empresariales.",
        tiloPayUrl: "https://tp.cr/l/MjEwNDUy"
    },
    {
        id: 4,
        nombre: "P80",
        stock: 10,
        diametro: 80,
        precio: 759,
        imagen: "P80.png",
        descripcion: "Sistema profesional de gran formato ideal para audiencias amplias, lobbies y salones de exposición.",
        tiloPayUrl: "https://tp.cr/l/MjEwNDUz"
    },
    {
        id: 5,
        nombre: "A80 - Exterior",
        stock: 8,
        diametro: 77,
        precio: 1628,
        imagen: "A80.png",
        descripcion: "Sistema robusto para uso exterior, resistente a condiciones ambientales adversas. Ideal para espacios públicos y fachadas.",
        tiloPayUrl: "https://tp.cr/l/MjEwNDU0"
    }
];

// Su única responsabilidad es renderizar la lista de productos en el DOM.
document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("productList");

    // Si el contenedor de productos no existe en esta página, no hacemos nada.
    if (!productList) return;

    productos.forEach((prod) => {
        const article = document.createElement("article");
        article.className = "product-card glass-inner";

        article.innerHTML = `
            <h2>${prod.nombre}</h2>
            <img src="images/${prod.imagen}" alt="${prod.nombre} Equipo Holográfico" loading="lazy" />
            <div class="product-info">
                <p class="product-desc">${prod.descripcion}</p>
                <ul class="product-specs">
                    <li><i class="fa-solid fa-circle-dot"></i> Diámetro: <strong>${prod.diametro} cm</strong></li>
                    <li><i class="fa-solid fa-boxes-stacked"></i> Stock: <strong>${prod.stock} unidades</strong></li>
                    <li><i class="fa-solid fa-tag"></i> Precio: <strong>$${prod.precio.toFixed(2)}</strong></li>
                </ul>
            </div>
            <div class="product-actions">
                <button class="btn-primary agregar-carrito" data-id="${prod.id}">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
                </button>
                <a class="btn-primary" href="${prod.tiloPayUrl}" target="_blank">Pagar con Tilopay</a>
            </div>
        `;

        productList.appendChild(article);
    });

});
