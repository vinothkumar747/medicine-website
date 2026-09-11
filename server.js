const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. இங்கே உங்களின் MongoDB Connection String-ஐ Paste செய்யவும்
const mongoURI = 'mongodb://vinothvinoth8187_db_user:vinoth123@ac-iszq5xc-shard-00-00.n80b29f.mongodb.net:27017,ac-iszq5xc-shard-00-01.n80b29f.mongodb.net:27017,ac-iszq5xc-shard-00-02.n80b29f.mongodb.net:27017/medicineApp?ssl=true&replicaSet=atlas-56hbho-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Database வெற்றிகரமாக இணைக்கப்பட்டது!'))
    .catch((err) => console.error('❌ Database Connection Error:', err));

// 2. Database-ல் ஆர்டர் எப்படி சேவ் ஆக வேண்டும் என்பதற்கான கட்டமைப்பு (Schema)
const orderSchema = new mongoose.Schema({
    id: String,
    customerDetails: String,
    medicineStr: String,
    totalAmount: Number,
    deliveryTime: String,
    status: { type: String, default: 'Active' },
    cancelReason: String,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 3. Frontend-லிருந்து வரும் ஆர்டரை Database-ல் Save செய்வதற்கான API
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save(); // டேட்டாபேஸில் சேமிக்கிறது
        res.status(200).json({ success: true, message: 'Order placed in Database!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. Admin மற்றும் Customer பேனலுக்கு Database-லிருந்து ஆர்டர்களை எடுத்துக் கொடுக்கும் API
app.get('/api/orders', async (req, res) => {
    try {
        // கடைசியாக வந்த ஆர்டர் முதலில் வர sort(-1) செய்கிறோம்
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// சர்வரை ஸ்டார்ட் செய்ய
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend Server is running on http://localhost:${PORT}`);
});