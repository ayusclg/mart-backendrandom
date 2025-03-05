i
import mongoose from "mongoose";

const ProSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    in_stocks:{
        type:Number,
        default:0,
    },
    price:{
        type:Number,
        required:true,
    },
    brand:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["Male","female","Children"],
        required:true
    },
    photo:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Product = mongoose.model("Product",ProSchema)

