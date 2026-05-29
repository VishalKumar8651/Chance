require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

const BCRYPT_ROUNDS = 12;

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function issueToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email, name: user.name },
    jwtSecret,
    { expiresIn: '2h' }
  );
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

const { SEED_PRODUCTS, formatProduct, toImageBuffer } = require('./data/products-seed');
const { prepareSeedProducts, loadImageForSeed } = require('./data/load-product-images');

const client = uri
  ? new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
  : null;

let initError = null;

async function seedProductsIfEmpty(productsCollection) {
  const count = await productsCollection.countDocuments();
  if (count === 0) {
    const now = new Date();
    const products = prepareSeedProducts(SEED_PRODUCTS).map((product) => ({
      ...product,
      createdAt: now,
    }));
    await productsCollection.insertMany(products);
    console.log(`Seeded ${products.length} products (with images) into MongoDB`);
  }
}

async function syncProductImages(productsCollection) {
  for (const seed of SEED_PRODUCTS) {
    const doc = await productsCollection.findOne({ sortOrder: seed.sortOrder });
    if (!doc || doc.imageData) continue;

    const withImage = loadImageForSeed(seed);
    if (!withImage.imageData) continue;

    await productsCollection.updateOne(
      { _id: doc._id },
      {
        $set: {
          imageFile: withImage.imageFile,
          imageData: withImage.imageData,
          imageContentType: withImage.imageContentType,
        },
        $unset: { image: '' },
      }
    );
  }
}

function registerRoutes(usersCollection, cartsCollection, productsCollection) {
  app.get('/api/products', async (req, res) => {
    try {
      const filter = {};
      const category = String(req.query.category || '').trim().toLowerCase();
      if (category && category !== 'all') {
        filter.category = category;
      }

      const docs = await productsCollection.find(filter).sort({ sortOrder: 1 }).toArray();
      res.json({ success: true, products: docs.map(formatProduct) });
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch products.' });
    }
  });

  app.get('/api/products/:id/image', async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid product id.' });
      }

      const doc = await productsCollection.findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { imageData: 1, imageContentType: 1 } }
      );

      if (!doc?.imageData) {
        return res.status(404).json({ success: false, message: 'Product image not found.' });
      }

      const buffer = toImageBuffer(doc.imageData);
      res.set('Content-Type', doc.imageContentType || 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      res.send(buffer);
    } catch (err) {
      console.error('Error fetching product image:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch product image.' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid product id.' });
      }
      const doc = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      res.json({ success: true, product: formatProduct(doc) });
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch product.' });
    }
  });

  app.post('/api/signup', async (req, res) => {
    const name = String(req.body?.name || '').trim();
    const email = normalizeEmail(req.body?.email);
    const pass = String(req.body?.pass || '');

    if (!name || !email || !pass) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email.' });
    }
    if (pass.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use!' });
    }

    const hashedPass = await bcrypt.hash(pass, BCRYPT_ROUNDS);
    const result = await usersCollection.insertOne({ name, email, pass: hashedPass, createdAt: new Date() });
    const user = { _id: result.insertedId, name, email };
    const token = issueToken(user);

    res.json({
      success: true,
      message: 'Account created successfully!',
      userId: result.insertedId,
      token,
      user: { name, email },
    });
  });

  app.post('/api/login', async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const pass = String(req.body?.pass || '');

    if (!email || !pass) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let isValidPassword = false;
    if (typeof user.pass === 'string' && user.pass.startsWith('$2')) {
      isValidPassword = await bcrypt.compare(pass, user.pass);
    } else {
      isValidPassword = user.pass === pass;
      if (isValidPassword) {
        const upgradedHash = await bcrypt.hash(pass, BCRYPT_ROUNDS);
        await usersCollection.updateOne({ _id: user._id }, { $set: { pass: upgradedHash } });
      }
    }

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = issueToken(user);
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: { name: user.name, email: user.email },
    });
  });

  app.get('/api/cart', authenticate, async (req, res) => {
    try {
      const email = req.user.email;
      const cartDoc = await cartsCollection.findOne({ email });
      res.json({ success: true, items: cartDoc ? cartDoc.items : [] });
    } catch (err) {
      console.error('Error fetching cart:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
    }
  });

  app.post('/api/cart', authenticate, async (req, res) => {
    const { items } = req.body;
    const email = req.user.email;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Please provide items array.' });
    }

    try {
      await cartsCollection.updateOne(
        { email },
        { $set: { email, items, updatedAt: new Date() } },
        { upsert: true }
      );
      res.json({ success: true, message: 'Cart saved.' });
    } catch (err) {
      console.error('Error saving cart:', err);
      res.status(500).json({ success: false, message: 'Failed to save cart.' });
    }
  });

  app.delete('/api/cart/:index', authenticate, async (req, res) => {
    try {
      const email = req.user.email;
      const index = parseInt(req.params.index, 10);
      const cartDoc = await cartsCollection.findOne({ email });

      if (!cartDoc || !cartDoc.items || index < 0 || index >= cartDoc.items.length) {
        return res.status(400).json({ success: false, message: 'Invalid cart item.' });
      }

      cartDoc.items.splice(index, 1);
      await cartsCollection.updateOne(
        { email },
        { $set: { items: cartDoc.items, updatedAt: new Date() } }
      );
      res.json({ success: true, items: cartDoc.items, message: 'Item removed.' });
    } catch (err) {
      console.error('Error removing cart item:', err);
      res.status(500).json({ success: false, message: 'Failed to remove item.' });
    }
  });
}

async function initialize() {
  if (!uri || !jwtSecret) {
    throw new Error('MONGODB_URI and JWT_SECRET must be set.');
  }
  if (!client) {
    throw new Error('MongoDB client is not configured.');
  }

  await client.connect();
  console.log('Connected successfully to MongoDB Atlas');
  const db = client.db('chance_db');
  const productsCollection = db.collection('products');
  await seedProductsIfEmpty(productsCollection);
  await syncProductImages(productsCollection);
  registerRoutes(db.collection('users'), db.collection('carts'), productsCollection);
}

const ready = initialize().catch((error) => {
  initError = error;
  console.error('Failed to initialize server:', error);
});

app.use('/api', async (req, res, next) => {
  if (!uri || !jwtSecret) {
    return res.status(500).json({ success: false, message: 'Server misconfigured. Missing environment variables.' });
  }
  try {
    await ready;
    if (initError) {
      return res.status(503).json({ success: false, message: 'Database unavailable. Try again shortly.' });
    }
    next();
  } catch (error) {
    console.error('API middleware error:', error);
    res.status(503).json({ success: false, message: 'Service temporarily unavailable.' });
  }
});

app.ready = ready;
app.getInitError = () => initError;
module.exports = app;
