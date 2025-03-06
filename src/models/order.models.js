import mongoose, { mongo } from "mongoose";
import { Product } from "./product.models";
import { User } from "./user.models";

const orderSchema = new mongoose.Schema({

    orderProduct:{
        type:[
            {
                productId:{
                    type:mongoose.Types.ObjectId,
                    ref:Product
                },
                price:{
                    type:Number,
                    required:true

                },
                title:{
                    type:String,
                    required:true,

                },
                status:{
                    type:String,
                    enum:["completed","pending","rejected"],
                    required:true,
                    default:pending
                },
                quantity:{
                    type:Number,
                    required:true
                }

            }
        ],
        created_by:{
            type:mongoose.Types.ObjectId,
            ref:User
        }
    }

},{
    timestamps:true
})


            orderSchema.post("save",async(Order)=>{
                for(let product of Order.product){
                    await Product.findById(product.productId,{
                        $inc:{
                            in_stocks:-(product.quantity)
                        }
                    },
                {
                    new:true
                })
                }
            })

export const Order = mongoose.model("Order",orderSchema)