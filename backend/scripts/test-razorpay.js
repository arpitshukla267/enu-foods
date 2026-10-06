/**
 * Test script — verifies Razorpay test-mode order creation and inspects
 * which payment methods the Razorpay API reports for the account.
 *
 * Run: node scripts/test-razorpay.js
 */
import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("=== Razorpay Test-Mode Verification ===\n");
console.log(`  Key ID       : ${keyId}`);
console.log(`  Key prefix   : ${keyId?.slice(0, 8)}...`);
console.log(`  Secret set   : ${Boolean(keySecret)}`);
console.log();

if (!keyId || !keySecret) {
  console.error("ERROR: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set in .env");
  process.exit(1);
}

const rz = new Razorpay({ key_id: keyId, key_secret: keySecret });

// 1. Create a test order (₹100 = 10000 paise)
console.log("--- Step 1: Creating test order (₹100) ---");
try {
  const order = await rz.orders.create({
    amount: 10000,
    currency: "INR",
    receipt: "test_receipt_001",
    notes: { test: "true" },
  });

  console.log("✅ Order created successfully!");
  console.log(`  Order ID     : ${order.id}`);
  console.log(`  Amount       : ${order.amount} paise (₹${order.amount / 100})`);
  console.log(`  Currency     : ${order.currency}`);
  console.log(`  Status       : ${order.status}`);
  console.log(`  Receipt      : ${order.receipt}`);
  console.log();

  // 2. Fetch the order back to double-check
  console.log("--- Step 2: Fetching order back ---");
  const fetched = await rz.orders.fetch(order.id);
  console.log(`  Fetched ID   : ${fetched.id}`);
  console.log(`  Status       : ${fetched.status}`);
  console.log();

} catch (err) {
  console.error("❌ Order creation FAILED:");
  console.error(`  Status : ${err.statusCode}`);
  console.error(`  Error  : ${err.error?.description || err.message}`);
  console.error(err);
  process.exit(1);
}

// 3. Fetch payment methods for this key
console.log("--- Step 3: Checking available payment methods via GET /payments ---");
try {
  // Use the undocumented but functional methods endpoint
  const https = await import("https");
  const url = `https://${keyId}:${keySecret}@api.razorpay.com/v1/methods?key_id=${keyId}`;
  
  const data = await new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
      res.on("error", reject);
    }).on("error", reject);
  });

  if (typeof data === "object" && data !== null) {
    console.log("✅ Payment methods response received:");
    
    // Check UPI
    if (data.upi !== undefined) {
      console.log(`  UPI          : ${data.upi ? "ENABLED ✅" : "DISABLED ❌"}`);
    } else {
      console.log("  UPI          : not in response (check Razorpay dashboard)");
    }
    
    // Check Card
    if (data.card !== undefined) {
      console.log(`  Card         : ${data.card ? "ENABLED ✅" : "DISABLED ❌"}`);
    }
    
    // Check Netbanking
    if (data.netbanking !== undefined) {
      const nbEnabled = typeof data.netbanking === "object"
        ? Object.keys(data.netbanking).length > 0
        : Boolean(data.netbanking);
      console.log(`  Netbanking   : ${nbEnabled ? "ENABLED ✅" : "DISABLED ❌"}`);
    }
    
    // Check Wallet
    if (data.wallet !== undefined) {
      const walletEnabled = typeof data.wallet === "object"
        ? Object.values(data.wallet).some(Boolean)
        : Boolean(data.wallet);
      console.log(`  Wallet       : ${walletEnabled ? "ENABLED ✅" : "DISABLED ❌"}`);
    }

    // Check EMI
    if (data.emi !== undefined) {
      console.log(`  EMI          : ${data.emi ? "ENABLED ✅" : "DISABLED ❌"}`);
    }
    
    console.log();
    console.log("  Full methods response (JSON):");
    // Print top-level keys and their types/values
    for (const [key, val] of Object.entries(data)) {
      if (typeof val === "object" && val !== null) {
        const summary = Array.isArray(val)
          ? `[${val.length} items]`
          : `{${Object.keys(val).slice(0, 5).join(", ")}${Object.keys(val).length > 5 ? "..." : ""}}`;
        console.log(`    ${key}: ${summary}`);
      } else {
        console.log(`    ${key}: ${val}`);
      }
    }
  } else {
    console.log("  Raw response:", data);
  }
} catch (err) {
  console.warn("⚠️  Could not fetch methods (non-critical):", err.message);
}

console.log();
console.log("=== Verification Complete ===");
