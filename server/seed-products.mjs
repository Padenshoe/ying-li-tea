import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products } from "../drizzle/schema.ts";

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split("@")[1]?.split(":")[0] || "localhost",
  user: process.env.DATABASE_URL?.split("://")[1]?.split(":")[0] || "root",
  password: process.env.DATABASE_URL?.split(":")[1]?.split("@")[0] || "",
  database: process.env.DATABASE_URL?.split("/")[3]?.split("?")[0] || "ying_li_tea",
});

const db = drizzle(connection);

const teaProducts = [
  {
    name: "Premium Gift Box",
    description: "Luxury gift set featuring our finest oolong selection from multiple high-altitude regions",
    price: "89.99",
    stripeProductId: "prod_premium_gift",
    stripePriceId: "price_premium_gift",
    imageUrl: "https://cdn.example.com/premium-gift.jpg",
  },
  {
    name: "Cold Brew Oolong",
    description: "Ready-to-drink cold brew oolong tea, perfect for warm days",
    price: "49.99",
    stripeProductId: "prod_cold_brew",
    stripePriceId: "price_cold_brew",
    imageUrl: "https://cdn.example.com/cold-brew.jpg",
  },
  {
    name: "Entry Level Selection",
    description: "Perfect starter set for oolong tea enthusiasts",
    price: "29.99",
    stripeProductId: "prod_entry_level",
    stripePriceId: "price_entry_level",
    imageUrl: "https://cdn.example.com/entry-level.jpg",
  },
  {
    name: "Deluxe Gift Box",
    description: "Premium collection with tea ceremony accessories",
    price: "199.99",
    stripeProductId: "prod_deluxe_gift",
    stripePriceId: "price_deluxe_gift",
    imageUrl: "https://cdn.example.com/deluxe-gift.jpg",
  },
  {
    name: "Specialty Blend",
    description: "Limited edition specialty blend from our rarest high-altitude gardens",
    price: "129.99",
    stripeProductId: "prod_specialty",
    stripePriceId: "price_specialty",
    imageUrl: "https://cdn.example.com/specialty.jpg",
  },
  {
    name: "Loose Leaf Selection",
    description: "Premium loose leaf oolong for the discerning tea lover",
    price: "39.99",
    stripeProductId: "prod_loose_leaf",
    stripePriceId: "price_loose_leaf",
    imageUrl: "https://cdn.example.com/loose-leaf.jpg",
  },
];

console.log("Seeding products...");

try {
  // Clear existing products
  // await db.delete(products).execute();

  // Insert new products
  for (const product of teaProducts) {
    await db.insert(products).values({
      name: product.name,
      description: product.description,
      price: product.price,
      stripeProductId: product.stripeProductId,
      stripePriceId: product.stripePriceId,
      imageUrl: product.imageUrl,
      isActive: true,
    });
    console.log(`✓ Seeded: ${product.name}`);
  }

  console.log("✓ All products seeded successfully!");
} catch (error) {
  console.error("Error seeding products:", error);
  process.exit(1);
} finally {
  await connection.end();
}
