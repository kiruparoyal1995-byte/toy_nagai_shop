require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



const products = [
    { id: 1, tamil: "பால் சுறா", english: "MILK SHARK", price: 800, image: "fish images/Premium Nagai Dry Fish Pouch.png" },
    { id: 2, tamil: "நெத்திலி", english: "NETHILI", price: 400, image: "fish images/NETHILI.png" },
    { id: 3, tamil: "திருக்கை", english: "THIRUKKAI", price: 500 },
    { id: 4, tamil: "கூனி இறால்", english: "KOONI IRAAL", price: 500 },
    { id: 5, tamil: "முள்ளு வாளை", english: "MULLU VAALAI", price: 500 },
    { id: 6, tamil: "வாளை", english: "VAALAI", price: 500 },
    { id: 7, tamil: "பெரிய நெத்திலி", english: "BIG NETHILI", price: 600 },
    { id: 8, tamil: "பட்டறை வஞ்சிரம்", english: "PATTARAI VANCHIRAM", price: 900 },
    { id: 9, tamil: "பட்டறை வஞ்சிரம்", english: "PATTARAI VANCHIRAM BIG", price: 1100 },
    { id: 10, tamil: "பட்டறை பாறை", english: "PATTARAI PAARAI", price: 700 },
    { id: 11, tamil: "பண்ணா", english: "PANNA", price: 400 }
];

app.get("/api/products", (req, res) => {
    res.json(products);
});



// Save customer orders to MongoDB
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      id: Number,
      tamil: String,
      english: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, phone, address, items, total } = req.body;

    if (!customerName || !phone || !address ||
        !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Please provide customer details and order items."
      });
    }

    const order = await Order.create({
      customerName,
      phone,
      address,
      items,
      total
    });

    res.status(201).json({
      message: "Order saved successfully!",
      orderId: order._id
    });
  } catch (error) {
    console.error("Order saving failed:", error.message);
    res.status(500).json({
      message: "Unable to save order."
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Nagai Dry Fish API running at http://localhost:${process.env.PORT || 5000}`);
});
