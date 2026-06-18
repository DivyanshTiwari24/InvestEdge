const {Schema} = require ("mongoose")

const HoldingSH = new Schema( {
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
    user: String
})

module.exports={HoldingSH}
