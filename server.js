require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Please provide MONGODB_URI in the .env file");
  process.exit(1);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas");
    const db = client.db("chance_db");
    const usersCollection = db.collection("users");

    // Sign Up Endpoint
    app.post('/api/signup', async (req, res) => {
      const { name, email, pass } = req.body;
      
      if (!name || !email || !pass) {
        return res.status(400).json({ success: false, message: "Please provide all required fields." });
      }

      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already in use!" });
      }

      // In a real production app, passwords should be hashed using bcrypt before storing.
      const result = await usersCollection.insertOne({ name, email, pass, createdAt: new Date() });
      
      res.json({ success: true, message: "Account created successfully!", userId: result.insertedId });
    });

    // Login Endpoint
    app.post('/api/login', async (req, res) => {
      const { email, pass } = req.body;

      if (!email || !pass) {
        return res.status(400).json({ success: false, message: "Please provide both email and password." });
      }

      const user = await usersCollection.findOne({ email, pass });
      
      if (user) {
        res.json({ success: true, message: "Login successful!", user: { name: user.name, email: user.email } });
      } else {
        res.status(401).json({ success: false, message: "Invalid email or password." });
      }
    });

    // ---- CART ENDPOINTS ----
    const cartsCollection = db.collection("carts");

    // Get cart for a user
    app.get('/api/cart/:email', async (req, res) => {
      try {
        const email = decodeURIComponent(req.params.email);
        const cartDoc = await cartsCollection.findOne({ email });
        res.json({ success: true, items: cartDoc ? cartDoc.items : [] });
      } catch (err) {
        console.error("Error fetching cart:", err);
        res.status(500).json({ success: false, message: "Failed to fetch cart." });
      }
    });

    // Save/update cart for a user (replaces entire cart)
    app.post('/api/cart', async (req, res) => {
      const { email, items } = req.body;

      if (!email || !Array.isArray(items)) {
        return res.status(400).json({ success: false, message: "Please provide email and items array." });
      }

      try {
        await cartsCollection.updateOne(
          { email },
          { $set: { email, items, updatedAt: new Date() } },
          { upsert: true }
        );
        res.json({ success: true, message: "Cart saved." });
      } catch (err) {
        console.error("Error saving cart:", err);
        res.status(500).json({ success: false, message: "Failed to save cart." });
      }
    });

    // Remove a single item from cart by index
    app.delete('/api/cart/:email/:index', async (req, res) => {
      try {
        const email = decodeURIComponent(req.params.email);
        const index = parseInt(req.params.index);
        const cartDoc = await cartsCollection.findOne({ email });

        if (!cartDoc || !cartDoc.items || index < 0 || index >= cartDoc.items.length) {
          return res.status(400).json({ success: false, message: "Invalid cart item." });
        }

        cartDoc.items.splice(index, 1);
        await cartsCollection.updateOne(
          { email },
          { $set: { items: cartDoc.items, updatedAt: new Date() } }
        );
        res.json({ success: true, items: cartDoc.items, message: "Item removed." });
      } catch (err) {
        console.error("Error removing cart item:", err);
        res.status(500).json({ success: false, message: "Failed to remove item." });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

startServer();
