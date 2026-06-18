const fs = require('fs');
const file = 'c:/Users/DIvyansh Tiwari/Desktop/Development/Zerodha/backend/index.js';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf(pp.post('/newOrder');
if(startIdx !== -1) {
  content = content.substring(0, startIdx);
}

const newRoute = pp.post('/newOrder', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const mode = req.body.mode;
        const qty = Number(req.body.qty);
        const price = Number(req.body.price);

        let newOrder = new OrdersModel({
            name: req.body.name,
            qty: qty,
            price: price,
            mode: mode,
            user: userId
        });
        await newOrder.save();

        let position = await PositionsModel.findOne({ name: req.body.name, user: userId });
        if (position) {
            position.qty += (mode === "BUY" ? qty : -qty);
            await position.save();
        } else if (mode === "BUY") {
            await new PositionsModel({ product: "CNC", name: req.body.name, qty: qty, avg: price, price: price, net: "+0.0%", day: "+0.0%", isLoss: false, user: userId }).save();
        }

        let holding = await Holdingmodel.findOne({ name: req.body.name, user: userId });
        if (holding) {
            if (mode === "BUY") {
                const totalCost = (holding.avg * holding.qty) + (price * qty);
                holding.qty += qty;
                holding.avg = totalCost / holding.qty;
                holding.price = price;
            } else {
                holding.qty -= qty;
            }
            if (holding.qty <= 0) await Holdingmodel.deleteOne({ _id: holding._id });
            else await holding.save();
        } else if (mode === "BUY") {
            await new Holdingmodel({ name: req.body.name, qty: qty, avg: price, price: price, net: "+0.0%", day: "+0.0%", user: userId }).save();
        }

        res.send("Order saved!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving order");
    }
});
;

fs.writeFileSync(file, content + newRoute);
