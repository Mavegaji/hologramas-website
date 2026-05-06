const TILOPAY_LOGIN_URL = "https://app.tilopay.com/api/v1/loginSite";
const TILOPAY_INIT_URL  = "https://app.tilopay.com/api/v1/initialize";

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
    const siteUrl = process.env.URL || "https://hologramas-website.netlify.app";

    try {
        // --- Step 1: Authenticate with TiloPay ---
        const loginRes = await fetch(TILOPAY_LOGIN_URL, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                apiuser:  process.env.TILOPAY_API_USER,
                password: process.env.TILOPAY_API_PASSWORD,
                key:      process.env.TILOPAY_API_KEY,
            }),
        });

        const loginData = await loginRes.json();
        const token = loginData.access_token;

        if (!token) {
            console.error("TiloPay login failed:", JSON.stringify(loginData));
            return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: "Payment provider auth failed" }) };
        }

        // --- Step 2: Create payment order ---
        const initRes = await fetch(TILOPAY_INIT_URL, {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                amount:      amount.toFixed(2),
                currency:    "USD",
                orderid:     orderId,
                redirect:    `${siteUrl}/cart.html?pago=exitoso&orden=${orderId}`,
                callbackUrl: `${siteUrl}/.netlify/functions/tilopay-webhook`,
            }),
        });

        const initData = await initRes.json();
        console.log("TiloPay init response:", JSON.stringify(initData));

        // Defensively check common field names TiloPay may return
        const paymentUrl = initData?.url || initData?.paymentUrl || initData?.link || initData?.payment_url;

        if (!paymentUrl) {
            console.error("No payment URL in TiloPay response:", JSON.stringify(initData));
            return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: "No payment URL returned" }) };
        }

        return {
            statusCode: 200,
            headers: CORS,
            body: JSON.stringify({ paymentUrl, orderId }),
        };

    } catch (err) {
        console.error("Serverless function error:", err.message);
        return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: "Internal error" }) };
    }
};
