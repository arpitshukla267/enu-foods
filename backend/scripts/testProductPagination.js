const base = "http://localhost:5000/api/v1/products";

const run = async () => {
  let cursor = null;
  const all = [];
  let pages = 0;

  while (pages < 20) {
    const url = cursor
      ? `${base}?limit=12&cursor=${encodeURIComponent(cursor)}`
      : `${base}?limit=12`;
    const response = await fetch(url);
    const data = await response.json();

    all.push(...data.data.products.map((product) => product.id));
    cursor = data.data.pagination.nextCursor;
    pages += 1;
    if (!cursor) break;
  }

  const unique = new Set(all);
  console.log("Cursor pagination test:");
  console.log(`  pages: ${pages}`);
  console.log(`  total fetched: ${all.length}`);
  console.log(`  unique IDs: ${unique.size}`);
  console.log(`  duplicates: ${all.length - unique.size}`);

  const search = await fetch(`${base}?search=masala&limit=12`).then((r) => r.json());
  console.log(`Search 'masala': ${search.data.products.length} results`);

  const best = await fetch(`${base}?isBestSeller=true&limit=12`).then((r) => r.json());
  console.log(`Best sellers first batch: ${best.data.products.length}`);

  const firstSlug = all.length ? (await fetch(`${base}?limit=1`).then((r) => r.json())).data.products[0].slug : null;
  if (firstSlug) {
    const detail = await fetch(`http://localhost:5000/api/v1/products/${firstSlug}`).then((r) => r.json());
    console.log(`Detail by slug (${firstSlug}): ${detail.success ? detail.data.product.name : "failed"}`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
