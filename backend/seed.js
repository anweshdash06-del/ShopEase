require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");

const run = async () => {
  await connectDB();

  console.log("Seeding database...");

  // Admin user
  const adminEmail = "admin@shopease.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: "admin123",
      role: "admin",
    });
    console.log("Created admin user:", adminEmail, "/ password: admin123");
  } else {
    console.log("Admin user already exists");
  }

  // Categories
  const categoryNames = [
    { name: "Electronics", description: "Gadgets, devices and accessories" },
    { name: "Fashion", description: "Clothing, footwear and accessories" },
    { name: "Home & Kitchen", description: "Furniture, decor and kitchenware" },
    { name: "Books", description: "Fiction, non-fiction and educational books" },
  ];

  const categories = {};
  for (const c of categoryNames) {
    let cat = await Category.findOne({ name: c.name });
    if (!cat) {
      cat = await Category.create(c);
      console.log("Created category:", c.name);
    }
    categories[c.name] = cat;
  }

  // Sample products
  const existingProducts = await Product.countDocuments();
  if (existingProducts === 0) {
    const sampleProducts = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "Over-ear wireless headphones with noise cancellation and 30-hour battery life.",
        price: 2999,
        discountPrice: 2499,
        category: categories["Electronics"]._id,
        stock: 25,
        brand: "SoundMax",
        images: [],
        isFeatured: true,
      },
      {
        name: "Smart Fitness Watch",
        description: "Track your steps, heart rate, and sleep with this waterproof smart watch.",
        price: 4499,
        discountPrice: 3999,
        category: categories["Electronics"]._id,
        stock: 15,
        brand: "FitTrack",
        images: [],
        isFeatured: true,
      },
      {
        name: "Men's Casual Cotton Shirt",
        description: "Breathable, comfortable cotton shirt suitable for everyday wear.",
        price: 899,
        discountPrice: 0,
        category: categories["Fashion"]._id,
        stock: 40,
        brand: "UrbanFit",
        images: [],
        isFeatured: false,
      },
      {
        name: "Women's Running Shoes",
        description: "Lightweight running shoes with cushioned soles for all-day comfort.",
        price: 2199,
        discountPrice: 1799,
        category: categories["Fashion"]._id,
        stock: 30,
        brand: "StrideOn",
        images: [],
        isFeatured: true,
      },
      {
        name: "Non-Stick Cookware Set (5 Pieces)",
        description: "Durable non-stick cookware set including pans and pots for everyday cooking.",
        price: 3299,
        discountPrice: 2899,
        category: categories["Home & Kitchen"]._id,
        stock: 12,
        brand: "HomeChef",
        images: [],
        isFeatured: false,
      },
      {
        name: "LED Table Lamp",
        description: "Adjustable brightness LED table lamp with USB charging port.",
        price: 1099,
        discountPrice: 0,
        category: categories["Home & Kitchen"]._id,
        stock: 20,
        brand: "BrightLite",
        images: [],
        isFeatured: false,
      },
      {
        name: "The Art of Clean Code",
        description: "A practical guide to writing maintainable and readable code.",
        price: 599,
        discountPrice: 499,
        category: categories["Books"]._id,
        stock: 50,
        brand: "TechPress",
        images: [],
        isFeatured: true,
      },
      {
        name: "Mystery Island - A Novel",
        description: "A gripping mystery novel that will keep you hooked until the last page.",
        price: 349,
        discountPrice: 0,
        category: categories["Books"]._id,
        stock: 35,
        brand: "PageTurner",
        images: [],
        isFeatured: false,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log(`Created ${sampleProducts.length} sample products`);
  } else {
    console.log("Products already exist, skipping sample product creation");
  }

  console.log("Seeding complete!");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
