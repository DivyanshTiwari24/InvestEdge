const {model} = require("mongoose")

const {HoldingSH}=require("../schema/HoldingSH")

const Holdingmodel= new model("holding",HoldingSH);
module.exports={Holdingmodel}