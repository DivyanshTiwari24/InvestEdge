const express = require("express");
const app = express();
require("dotenv").config();

const mongoose = require("mongoose");
const { Holdingmodel } = require("../backend/models/Holdingmodel");
const { PositionsModel } = require("../backend/models/PositionsModel");
const { OrdersModel } = require("../backend/models/OrdersModel");
const UserModel = require("../backend/models/UserModel");

const bodyparser = require("body-parser");
app.use(bodyparser.json());
const cors = require("cors");
app.use(cors());

const passport = require("passport");
const jwt = require("jsonwebtoken");

app.use(passport.initialize());
passport.use(UserModel.createStrategy());

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL || "mongodb://localhost:27017/zerodha";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

app.listen(PORT, () => {
    console.log("App Started on port " + PORT);
    mongoose.connect(url);
    console.log("DB started");
});

// Auth Routes
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = new UserModel({ username: email, email });
        await UserModel.register(newUser, password);
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

        // 1. Create the Order Record
        let newOrder = new OrdersModel({
            name: req.body.name,
            qty: reqQty,
            price: reqPrice,
            mode: req.body.mode,
            user: userId
        });
        await newOrder.save();

        // 2. Handle Positions Logic
        let position = await PositionsModel.findOne({ name: req.body.name, user: userId });
        
        if (position) {
            if (isBuy) {
                // Calculate new weighted average cost
                let totalCost = (position.qty * position.avg) + (reqQty * reqPrice);
                position.qty += reqQty;
                position.avg = totalCost / position.qty;
            } else {
                // Prevent negative selling
                if (position.qty < reqQty) {
                    return res.status(400).send("Insufficient quantity to sell");
                }
                position.qty -= reqQty;
            }
            await position.save();
        } else {
            if (isBuy) {
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
            } else {
                return res.status(400).send("Cannot sell a stock you do not own.");
            }
        }

        // 3. Sync with Holdings (For MVP, we treat CNC positions as holdings)
        let holding = await Holdingmodel.findOne({ name: req.body.name, user: userId });
        if (holding) {
            if (isBuy) {
                let totalCost = (holding.qty * holding.avg) + (reqQty * reqPrice);
                holding.qty += reqQty;
                holding.avg = totalCost / holding.qty;
                await holding.save();
            } else {
                holding.qty -= reqQty;
                if (holding.qty <= 0) {
                    await Holdingmodel.deleteOne({ _id: holding._id }); // Remove if sold out
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

        res.status(200).send("Order saved successfully!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving order");
    }
});