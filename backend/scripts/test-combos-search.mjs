import dotenv from "dotenv";

dotenv.config();

const API = "http://localhost:5000/api";
const results = [];

const log = (name, passed, detail = "") => {
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"} - ${name}${detail ? `: ${detail}` : ""}`);
};

const request = async (path, { method = "GET" } = {}) => {
  const response = await fetch(`${API}${path}`, { method });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data };
};

const run = async () => {
  const list = await request("/v1/combos");
  log("Public combos list returns 200", list.status === 200);
  log(
    "Combos list is array",
    Array.isArray(list.data?.data?.combos),
    `count ${list.data?.data?.combos?.length ?? 0}`,
  );

  const firstCombo = list.data?.data?.combos?.[0];
  if (firstCombo?.slug) {
    const detail = await request(`/v1/combos/${firstCombo.slug}`);
    log("Combo detail by slug returns 200", detail.status === 200);
    log(
      "Combo detail has embedded products",
      Array.isArray(detail.data?.data?.combo?.items) &&
        detail.data.data.combo.items.every((item) => item.product),
    );
    log(
      "Combo detail items capped reasonably",
      detail.data.data.combo.items.length <= 20,
      `items ${detail.data.data.combo.items.length}`,
    );
  } else {
    log("Combo detail by slug returns 200", true, "skipped - no combos in DB");
    log("Combo detail has embedded products", true, "skipped");
    log("Combo detail items capped reasonably", true, "skipped");
  }

  const notFound = await request("/v1/combos/non-existent-combo-slug-xyz");
  log("Invalid combo slug returns 404", notFound.status === 404);

  const search = await request("/v1/products?search=masala&limit=5");
  log("Product search returns 200", search.status === 200);
  log(
    "Product search returns total count",
    typeof search.data?.data?.pagination?.total === "number",
    `total ${search.data?.data?.pagination?.total}`,
  );

  const multiWord = await request("/v1/products?search=red chilli&limit=5");
  log("Multi-word search returns 200", multiWord.status === 200);

  const filtered = await request(
    "/v1/products?search=masala&category=ground-spices&sort=price-asc&limit=5",
  );
  log("Search with filters returns 200", filtered.status === 200);

  const failed = results.filter((item) => !item.passed);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exit(1);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
