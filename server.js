const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://admin:<db_password>@aceeboardz.4hc3p.mongodb.net/?retryWrites=true&w=majority&appName=aceeboardz'; // Replace with your MongoDB connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model for Subscribers
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Subscribe Route
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(200).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email already subscribed' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});