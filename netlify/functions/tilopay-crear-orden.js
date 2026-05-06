const TILOPAY_LOGIN_URL   = "https://app.tilopay.com/api/v1/login";
const TILOPAY_PAYMENT_URL = "https://app.tilopay.com/api/v1/processPayment";

const CORS = {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers: CORS, body: "" };
    }
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed" }) };
    }

    // --- Input validation ---
    let rawAmount;
    try {
        ({ amount: rawAmount } = JSON.parse(event.body));
    } catch {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid JSON" }) };
    }

    const amount = Math.round(parseFloat(rawAmount) * 100) / 100;
    if (!isFinite(amount) || amount <= 0) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: "Invalid amount" }) };
    }

    const orderId = `HCR-${Date.now()}`;
    const siteUrl = process.env.URL || "https://hologramas.cr";

    try {
        // --- Step 1: Authenticate ---
        // Login uses `email` (= API User) and `password` (= API Password)
        const loginRes = await fetch(TILOPAY_LOGIN_URL, {
            method:  "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                email:    process.env.TILOPAY_API_USER,
                password: process.env.TILOPAY_API_PASSWORD,
            }),
        });

        const loginData = await loginRes.json();
        const token = loginData.access_token;

        if (!token) {
            console.error("TiloPay login failed:", JSON.stringify(loginData));
            return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: "Payment provider auth failed" }) };
        }

        // --- Step 2: Create payment order ---
        // `key` = API Key, used in the payment body (not the login)
        const paymentRes = await fetch(TILOPAY_PAYMENT_URL, {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Accept":        "application/json",
                "Authorization": `bearer ${token}`,
            },
            body: JSON.stringify({
                key:         process.env.TILOPAY_API_KEY,
                amount:      amount,
                currency:    "USD",
                orderNumber: orderId,
                capture:     1,
                redirect:    `${siteUrl}/pago-exitoso.html`,
                billToEmail: "hologramascr506@gmail.com",
                hashVersion: "V2",
                platform:    "hologramas-cr",
                lang:        "es-CR",
            }),
        });

        const paymentData = await paymentRes.json();
        console.log("TiloPay processPayment response:", JSON.stringify(paymentData));

        // type 100 = redirect to hosted payment page, url contains the payment link
        if (String(paymentData.type) !== "100" || !paymentData.url) {
            console.error("Unexpected TiloPay response:", JSON.stringify(paymentData));
            return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: "No payment URL returned" }) };
        }

        return {
            statusCode: 200,
            headers: CORS,
            body: JSON.stringify({ paymentUrl: paymentData.url, orderId }),
        };

    } catch (err) {
        console.error("Serverless function error:", err.message);
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Internal error" }) };
    }
};
