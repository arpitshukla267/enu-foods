import dotenv from "dotenv";
dotenv.config();

import connectDB from "../src/config/db.js";
import Product from "../src/services/product/product.model.js";
import Category from "../src/services/category/category.model.js";

const SPICE_NAMES = [
  "Sambhar Masala",
  "Garam Masala",
  "Kitchen King",
  "Turmeric Powder",
  "Red Chilli Powder",
  "Coriander Powder",
  "Biryani Masala",
  "Pav Bhaji Masala",
  "Kasuri Methi",
  "Paneer Masala",
  "Rasam Powder",
  "Chaat Masala",
  "Meat Masala",
  "Fish Masala",
  "Tandoori Masala",
  "Pulao Masala",
  "Dal Tadka Masala",
  "Shahi Biryani Mix",
  "Madras Curry Powder",
  "Malabar Pepper Mix",
];

const IMAGES = [
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1509358217973-883fe8a1e808?auto=format&fit=crop&w=600&q=80",
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const run = async () => {
  await connectDB();

  const categories = await Category.find({ status: "active" }).lean();
  if (!categories.length) {
    console.error("No active categories found. Seed categories first.");
    process.exit(1);
  }

  const existingCount = await Product.countDocuments();
  if (existingCount >= 100) {
    console.log(`Products already seeded (${existingCount}).`);
    process.exit(0);
  }

  const productsToCreate = [];
  const targetCount = 100;

  for (let index = 0; index < targetCount; index += 1) {
    const category = categories[index % categories.length];
    const subcategory = category.subcategories?.[index % (category.subcategories.length || 1)];
    const baseName = SPICE_NAMES[index % SPICE_NAMES.length];
    const suffix = index >= SPICE_NAMES.length ? ` ${Math.floor(index / SPICE_NAMES.length) + 1}` : "";
    const name = `ENU ${baseName}${suffix}`;
    const slug = `${slugify(name)}-${index + 1}`;
    const price = 120 + (index % 15) * 25;
    const compareAtPrice = price + 30 + (index % 5) * 10;
    const stock = 10 + (index % 20) * 3;
    const sku = `ENU-${String(index + 1).padStart(4, "0")}`;

    productsToCreate.push({
      name,
      slug,
      shortDescription: `${name} crafted with premium whole spices and cold-ground below 38°C.`,
      description: `${name} is slow-roasted in small batches to preserve volatile oils and authentic aroma.`,
      images: [{ url: IMAGES[index % IMAGES.length], publicId: "" }],
      price,
      compareAtPrice,
      stock,
      sku,
      category: category._id,
      categorySlug: category.slug,
      subcategory: subcategory?._id || null,
      subcategorySlug: subcategory?.slug || "",
      weightVariants: [
        {
          weight: "100g",
          price,
          compareAtPrice,
          stock: Math.max(5, Math.floor(stock / 2)),
          sku: `${sku}-100`,
          isDefault: true,
        },
        {
          weight: "200g",
          price: price + 120,
          compareAtPrice: compareAtPrice + 150,
          stock: Math.max(3, Math.floor(stock / 3)),
          sku: `${sku}-200`,
          isDefault: false,
        },
      ],
      defaultWeight: "100g",
      ingredients: ["Coriander", "Cumin", "Red Chilli", "Turmeric"],
      benefits: ["Cold-ground freshness", "No artificial colours"],
      bestFor: ["Curries", "Daily cooking"],
      storageInstructions: "Store in an airtight container away from sunlight.",
      aromaProfile: "Warm, earthy, and balanced spice notes.",
      spicinessLevel: (index % 5) + 1,
      isFeatured: index % 7 === 0,
      isBestSeller: index % 9 === 0,
      isNewArrival: index % 11 === 0,
      isActive: true,
      status: "active",
    });
  }

  await Product.insertMany(productsToCreate, { ordered: false });

  for (const category of categories) {
    const count = await Product.countDocuments({
      category: category._id,
      isActive: true,
      status: "active",
    });
    await Category.findByIdAndUpdate(category._id, { productCount: count });
  }

  console.log(`Seeded ${productsToCreate.length} products.`);
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
