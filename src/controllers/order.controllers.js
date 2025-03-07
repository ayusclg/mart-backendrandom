import { HostAddress } from "mongodb"
import { Order } from "../models/order.models"
import { Product } from "../models/product.models"


const createOrder = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password -refresh_token")
        if(user.role != "customer"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }

        const order_create = []
        for (let product of req.body.orderProduct){
            const dbproduct = await Product.findById(product.productId)
            if(!dbproduct){
                return res.status(400).json({
                    message:"Product Not Found"
                })
            }
            order_create.push({
                productId:dbproduct._id,
                price:dbproduct.price,
                title:dbproduct.title,
                quantity:product.quantity,
                
            })}
            const create = await Order.create({
                orderProduct:order_create,
                created_by:req.user._id
            })
            if(!create){
                return res.status(400).json({
                    message:"Order Not Created"
                })
            }
            res.status(201).json({
                message:"Order Successfully Created",
                data:create
            })
    } catch (error) {
        res.status(500).json({
            message:"Creating Order Server Failed"
        })
    }
}

const fetchSingleUserOrder = async(req,res)=>{
    try {
        const order = await Order.findOne({created_by:req.user._id}).populate("created_by","username address")
        if(!order){
            return res.status(404).json({
                message:"No Order Found"
            })
        }
        res.status(200).json({
            message:"Order Successfully Fetched",
            data:order
        })
    } catch (error) {
        res.status(500).json({
            message:"Server Error in Fetching Single User Order"
        })
    }
}

const fetchAllOrder = async(req,res)=>{
    try {
        const order = await Order.find().populate("created_by","username address contact")
        if(!order){
            return res.status(400).json({
                message:"No Order Found"
            })
        }
        const total = await Order.countDocuments()
        res.status(200).json({
            message:"Fetched All Order",
            data:order,
            total:total
        })
    } catch (error) {
        res.status(500).json({
            message:"Server Error in Fetching all order"
        })
    }
}
export  {createOrder,fetchSingleUserOrder,fetchAllOrder}