// src/index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Testing route
app.get('/', (req, res) => {
  res.send('Welcome to the User Service');
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Email or username already taken' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    console.log("User: ", user);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, id: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`User service running on http://0.0.0.0:${PORT}`);
});

