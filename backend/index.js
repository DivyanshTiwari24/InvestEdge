const express = require("express");
const app = express();
require("dotenv").config();

const mongoose = require("mongoose");
const { Holdingmodel } = require("./models/Holdingmodel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");
const UserModel = require("./models/UserModel");

const bodyparser = require("body-parser");
app.use(bodyparser.json());
const cors = require("cors");
app.use(cors());

const passport = require("passport");
const jwt = require("jsonwebtoken");

app.use(passport.initialize());
passport.use(UserModel.createStrategy());

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL ;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

// Connect to MongoDB globally for serverless compatibility
mongoose.connect(url)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.error("DB connection error:", err));

app.listen(PORT, () => {
    console.log("App Started on port " + PORT);
});

app.get("/health", (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({
        status: "ok",
        database: states[dbState] || "unknown"
    });
});

// Auth Routes
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = new UserModel({ username: email, email });
        await UserModel.register(newUser, password);

        const userId = newUser._id;

        // Seed default holdings for a richer initial experience
        const defaultHoldings = [
            { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%", user: userId },
            { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%", user: userId },
            { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%", user: userId },
            { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", user: userId },
            { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%", user: userId },
            { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%", user: userId },
            { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%", isLoss: true, user: userId },
            { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%", user: userId },
            { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true, user: userId },
            { name: "SGBMAY29", qty: 2, avg: 4727.0, price: 4719.0, net: "-0.17%", day: "+0.15%", user: userId },
            { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%", isLoss: true, user: userId },
            { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true, user: userId },
            { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%", user: userId }
        ];

        // Seed default positions
        const defaultPositions = [
            { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true, user: userId },
            { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true, user: userId }
        ];

        await Holdingmodel.insertMany(defaultHoldings);
        await PositionsModel.insertMany(defaultPositions);

        res.status(200).json({ message: "Signup successful" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/login', passport.authenticate("local", { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, message: "Login successful" });
});

// Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected Routes
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).send("User not found");
        res.json({ email: user.email, margin: user.margin || 100000 });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching profile");
    }
});

app.get('/allHoldings', authenticateToken, async (req, res) => {
    let allHoldings = await Holdingmodel.find({ user: req.user.id });
    res.json(allHoldings);
});

app.get('/allPositions', authenticateToken, async (req, res) => {
    let allPositions = await PositionsModel.find({ user: req.user.id });
    res.json(allPositions);
});

app.get('/allOrders', authenticateToken, async (req, res) => {
    let allOrders = await OrdersModel.find({ user: req.user.id });
    res.json(allOrders);
});

app.post('/newOrder', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const reqQty = Number(req.body.qty);
        const reqPrice = Number(req.body.price);
        const isBuy = req.body.mode === "BUY";

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).send("User not found");

        const orderValue = reqQty * reqPrice;

        let position = await PositionsModel.findOne({ name: req.body.name, user: userId });
        let holding = await Holdingmodel.findOne({ name: req.body.name, user: userId });

        if (isBuy) {
            if (user.margin < orderValue) {
                return res.status(400).send(`Insufficient margin. Required: ₹${orderValue.toFixed(2)}, Available: ₹${user.margin.toFixed(2)}`);
            }
            user.margin -= orderValue;
        } else {
            // Sell logic correction: available quantity is the maximum of holding or position
            const availableQty = Math.max(holding ? holding.qty : 0, position ? position.qty : 0);
            if (availableQty < reqQty) {
                return res.status(400).send("Insufficient quantity to sell.");
            }
            user.margin += orderValue;
        }

        await user.save();

        // 2. Handle Positions Logic
        if (position) {
            if (isBuy) {
                let totalCost = (position.qty * position.avg) + (reqQty * reqPrice);
                position.qty += reqQty;
                position.avg = totalCost / position.qty;
            } else {
                position.qty -= reqQty;
            }
            
            if (position.qty <= 0) {
                await PositionsModel.deleteOne({ _id: position._id });
            } else {
                await position.save();
            }
        } else if (isBuy) {
            let newPosition = new PositionsModel({
                product: "CNC",
                name: req.body.name,
                qty: reqQty,
                avg: reqPrice,
                price: reqPrice,
                net: "+0.0%",
                day: "+0.0%",
                isLoss: false,
                user: userId
            });
            await newPosition.save();
        }

        // 3. Sync with Holdings
        if (holding) {
            if (isBuy) {
                let totalCost = (holding.qty * holding.avg) + (reqQty * reqPrice);
                holding.qty += reqQty;
                holding.avg = totalCost / holding.qty;
                await holding.save();
            } else {
                holding.qty -= reqQty;
                if (holding.qty <= 0) {
                    await Holdingmodel.deleteOne({ _id: holding._id });
                } else {
                    await holding.save();
                }
            }
        } else if (isBuy) {
            let newHolding = new Holdingmodel({
                name: req.body.name,
                qty: reqQty,
                avg: reqPrice,
                price: reqPrice,
                net: "+0.0%",
                day: "+0.0%",
                user: userId
            });
            await newHolding.save();
        }

        // 4. Create the Order Record LAST
        let newOrder = new OrdersModel({
            name: req.body.name,
            qty: reqQty,
            price: reqPrice,
            mode: req.body.mode,
            user: userId
        });
        await newOrder.save();

        res.status(200).send("Order saved successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving order");
    }
});

module.exports = app;