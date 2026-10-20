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

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");
const Customer = require("./models/customer");
const app = express();
app.use(express.static(__dirname));

app.use(cors());
app.use(express.json());
app.use(cookieParser());



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

app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetching orders failed:", error.message);
        res.status(500).json({
            message: "Unable to fetch orders."
        });
    }
});

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


app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({
        message: "Name, mobile and password are required."
      });
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        message: "Enter a valid 10-digit Indian mobile number."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters."
      });
    }

    console.log("Registration mobile:", JSON.stringify(mobile));
    const existingCustomer = await Customer.findOne({ mobile });

    if (existingCustomer) {
      return res.status(409).json({
        message: "This mobile number is already registered."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const customer = await Customer.create({
      name: name.trim(),
      mobile,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Registration successful!",
      customer: {
        id: customer._id,
        name: customer.name,
        mobile: customer.mobile
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({
      message: "Registration failed. Please try again."
    });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        message: "Mobile number and password are required."
      });
    }

    const customer = await Customer.findOne({ mobile });

    if (!customer) {
      return res.status(401).json({
        message: "Invalid mobile number or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      customer.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid mobile number or password."
      });
    }

    const token = jwt.sign(
    { customerId: customer._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);
    return res.status(200).json({
      message: "Login successful!",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        mobile: customer.mobile
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      message: "Login failed. Please try again."
    });
  }
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({
      success: true,
      message: "Admin login successful"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid admin username or password"
  });
});


app.listen(process.env.PORT || 5000, () => {
    console.log(`Nagai Dry Fish API running at http://localhost:${process.env.PORT || 5000}`);
});
