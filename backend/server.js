const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// T-shirt Schema
const tshirtSchema = new mongoose.Schema({
    front: {
        text: String,
        color: String,
        imageSrc: String
    },
    back: {
        text: String,
        color: String,
        imageSrc: String
    }
});

const TShirt = mongoose.model('TShirt', tshirtSchema);

// Routes
app.post('/api/tshirts', async (req, res) => {
    try {
        const tshirt = new TShirt(req.body);
        await tshirt.save();
        res.status(201).json(tshirt);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
