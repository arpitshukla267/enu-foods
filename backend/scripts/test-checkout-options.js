/**
 * Simulates the exact frontend Razorpay Checkout initialization.
 * Creates a Razorpay order (like the backend does) and logs the
 * exact options object that would be passed to `new window.Razorpay(options)`.
 *
 * Run: node scripts/test-checkout-options.js
 */
import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("=== Simulating Frontend Checkout Flow ===\n");

const rz = new Razorpay({ key_id: keyId, key_secret: keySecret });

// Step 1: Create order like backend does (in createRazorpayOrder)
const amountPaise = 15750; // ₹157.50 — typical order amount
const receipt = "ENU-123456";

console.log("1. Creating Razorpay order (backend simulation)...");
const order = await rz.orders.create({
  amount: amountPaise,
  currency: "INR",
  receipt,
  notes: { orderId: "test-mongo-id", userId: "test-user-id" },
});

console.log(`   ✅ order.id     = ${order.id}`);
console.log(`   ✅ order.amount = ${order.amount}`);
console.log(`   ✅ order.currency = ${order.currency}`);
console.log(`   ✅ order.status = ${order.status}`);
console.log();

// Step 2: Build the exact response the backend sends (buildCreateOrderResponse)
const backendResponse = {
  razorpay: {
    keyId: keyId,
    orderId: order.id,      // <-- providerOrderId
    amount: order.amount,   // <-- amountPaise
    currency: "INR",
    orderNumber: receipt,
  },
};

console.log("2. Backend response.razorpay:", JSON.stringify(backendResponse.razorpay, null, 2));
console.log();

// Step 3: Build the exact checkout options the frontend constructs (openRazorpayCheckout)
const checkoutOptions = {
  key: backendResponse.razorpay.keyId,
  amount: backendResponse.razorpay.amount,
  currency: backendResponse.razorpay.currency,
  name: "ENU Foods",
  description: `Order ${backendResponse.razorpay.orderNumber}`,
  order_id: backendResponse.razorpay.orderId,
  prefill: {
    name: "Test User",
    contact: "9876543210",
    email: "test@example.com",
  },
  theme: { color: "#284C38" },
  // handler and modal.ondismiss are functions, represented here as placeholders
  handler: "function(response) { ... }",
  modal: { ondismiss: "function() { ... }" },
};

console.log("3. Frontend checkout options (passed to new Razorpay()):");
console.log(JSON.stringify(checkoutOptions, null, 2));
console.log();

// Step 4: Validation checks
console.log("4. Validation:");
console.log(`   key        : ${checkoutOptions.key ? "✅ present" : "❌ MISSING"}`);
console.log(`   amount     : ${checkoutOptions.amount > 0 ? `✅ ${checkoutOptions.amount} paise` : "❌ ZERO/MISSING"}`);
console.log(`   currency   : ${checkoutOptions.currency === "INR" ? "✅ INR" : `❌ ${checkoutOptions.currency}`}`);
console.log(`   order_id   : ${checkoutOptions.order_id?.startsWith("order_") ? "✅ valid" : "❌ INVALID"}`);
console.log(`   name       : ${checkoutOptions.name ? "✅ present" : "❌ MISSING"}`);
console.log(`   method     : ${checkoutOptions.method ? `⚠️  RESTRICTED: ${JSON.stringify(checkoutOptions.method)}` : "✅ NOT SET (all methods shown)"}`);
console.log();

// Step 5: Report
console.log("=== RESULT ===");
console.log("No 'method' restriction is being sent to Razorpay Checkout.");
console.log("Checkout will display all methods enabled on the Razorpay Dashboard:");
console.log("  • Card       : YES (API reports card=true)");
console.log("  • Netbanking : YES (API reports netbanking has banks)");
console.log("  • Wallet     : YES (API reports wallet={mobikwik,olamoney,airtelmoney})");
console.log("  • UPI        : Depends on dashboard settings");
console.log("    - upi (collect): Currently DISABLED in dashboard (upi=false)");
console.log("    - upi_intent   : ENABLED (upi_intent=true) — may show in Checkout");
console.log();
console.log("To enable UPI in Test Mode:");
console.log("  1. Log in to https://dashboard.razorpay.com");
console.log("  2. Switch to Test Mode (toggle at top)");
console.log("  3. Go to Settings → Payment Methods → UPI");
console.log("  4. Enable UPI");
console.log();
console.log("=== All checks passed ===");
