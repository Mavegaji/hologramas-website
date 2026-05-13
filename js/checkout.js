// js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const btnCompletePurchase = document.getElementById('btn-complete-purchase');
    const checkoutError = document.getElementById('checkout-error');

    // Cargar carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    /**
     * Renderiza el resumen del pedido en la página de checkout.
     */
    function renderSummary() {
        checkoutItemsContainer.innerHTML = '';
        let subtotal = 0;

        carrito.forEach(item => {
            const itemSubtotal = item.precio * item.cantidad;
            subtotal += itemSubtotal;

            const div = document.createElement('div');
            div.className = 'checkout-item-row';
            div.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.nombre}</span>
                    <span class="item-qty">x${item.cantidad}</span>
                </div>
                <span class="item-price">$${itemSubtotal.toFixed(2)}</span>
            `;
            checkoutItemsContainer.appendChild(div);
        });

        const tax = subtotal * 0.13;
        const total = subtotal + tax;

        summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        summaryTax.textContent = `$${tax.toFixed(2)}`;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    renderSummary();

    // Manejar el envío del formulario
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        btnCompletePurchase.disabled = true;
        btnCompletePurchase.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
        checkoutError.classList.add('hidden');

        const formData = new FormData(checkoutForm);
        const customerData = {
            email: formData.get('email'),
            phone: formData.get('phone'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            city: formData.get('city'),
            zip: formData.get('zip'),
            country: formData.get('country')
        };

        const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const total = subtotal * 1.13;
        const orderId = `HCR-${Date.now()}`;

        // Prepare items string for the notification
        const itemsSummary = carrito.map(item => `${item.nombre} (x${item.cantidad})`).join(', ');

        try {
            // 1. Send data to Netlify Forms for Email Notification
            const netlifyData = new URLSearchParams();
            netlifyData.append("form-name", "checkout-notifications");
            netlifyData.append("email", customerData.email);
            netlifyData.append("phone", customerData.phone);
            netlifyData.append("firstName", customerData.firstName);
            netlifyData.append("lastName", customerData.lastName);
            netlifyData.append("address", customerData.address);
            netlifyData.append("city", customerData.city);
            netlifyData.append("zip", customerData.zip);
            netlifyData.append("country", customerData.country);
            netlifyData.append("items", itemsSummary);
            netlifyData.append("total", `$${total.toFixed(2)}`);
            netlifyData.append("orderId", orderId);

            await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: netlifyData.toString(),
            });

            // 2. Proceed to Create TiloPay Order
            const res = await fetch("/.netlify/functions/tilopay-crear-orden", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: total,
                    customer: customerData
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.paymentUrl) {
                throw new Error(data.error || "No se pudo iniciar el proceso de pago.");
            }

            // Redirigir a TiloPay
            window.location.href = data.paymentUrl;

        } catch (error) {
            console.error("Checkout error:", error);
            checkoutError.textContent = error.message;
            checkoutError.classList.remove('hidden');
            btnCompletePurchase.disabled = false;
            btnCompletePurchase.innerHTML = '<i class="fa-solid fa-lock"></i> Pagar Ahora';
        }
    });
});
