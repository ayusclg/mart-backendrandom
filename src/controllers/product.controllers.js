import { Product } from "../models/product.models"
import { User } from "../models/user.models"
import uploadOnCloudinary from "../utils/cloudinary.utils"
import { v2 as cloudinary } from "cloudinary"


const productCreate = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(user.role !== "admin"){
            return res.status(403).json({
                message:"Only Admins Are Allowed"
            })
        }
        const {title,description,price,in_stocks,brand,category} = req.body

            const photo = `public/product/${req.file.filename}`

            const Upload = await uploadOnCloudinary(photo)
            if(!photo){
                return res.status(400).json({
                    message:"Photo Not Found"
                })
            }

            const createPro = await Product.create({
                title,
                description,
                price,
                in_stocks,
                brand,
                category,
                photo:Upload.secure_url
            })

            const createdProduct = await Product.findById(createPro._id)
            if(!createdProduct){
                return res.status(500).json({
                    message:"Product not created"
                })
            }

            res.status(200).json({
                message:"Product Successfully Created",
                data:createdProduct
            })

    } catch (error) {
        res.status(500).json({
            message:"Server Error In Product Creating"
        })
    }
}

const productFetch = async (req,res)=>{
    try {
        let page = parseInt(req.query.page) ||1
        let perPage = parseInt(req.query.perPage) || 3
        let category = req.query.category
        let brand = req.query.brand

        const productFilter = {}
        if(category){
            productFilter.categories = category
        }
        else if (brand){
            productFilter.brands = brand
        }

        const product = await Product.find(productFilter)
        .skip((page-1)*perPage)
        .limit(perPage)

        const totalProduct = await Product.countDocuments(productFilter)
        res.status(200).json({
            message:"Product Fetched",
            data:product,
            total:totalProduct
        })
    } catch (error) {
        res.status(500).json({
            message:"Server Error In Product Fetching"
        })
    }
}

const fetchSingleProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params._id)
        if(!product){
            return res.status(404).json({
                message:"Product Not Found"
            })
        }
        res.status(200).json({
            message:"Fetched Product",
            data:product
        })
    } catch (error) {
        res.status(500).json({
            message:"Server Error In Fetching Single Product"
        })
    }
}

const updateProduct = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(user.role !=="admin"){
            return res.status(404).json({
                message:"User Not Found"
            })
        }
        const {title,description,in_stocks,price,category,brand} = req.body

        const product = await Product.findByIdAndUpdate(req.params._id,{
            $set:{
                title,
                description,
                brand,
                price,
                category,
                in_stocks,
            }
        },{
            new:true
        })
        if(!product){
            return res.status(500).json({
                message:"Error In Updating Product"
            })
        }

        res.status(200).json({
            message:"Product Updated Successfully"
        })
        


    } catch (error) {
        res.status(500).json({
            message:"Server Error In Updating product"
        })
    }
}
const updatePhotoProduct = async(req,res)=>{
    try {
        const {oldPublicId} = req.body
        if(oldPublicId){
            await cloudinary.uploader.destroy(oldPublicId)

        }
        const newPhoto = `public/product/${req.file.filename}`
        const upload = await uploadOnCloudinary(newPhoto)
        if(!newPhoto){
            return res.status(404).json({
                message:"Photo Not Found"
            })
        }

        const update = await Product.findByIdAndUpdate(req.params._id,{
            $set:{
                photo:upload.secure_url
            }
        },
                {
                    new:true
                })
                if(!update){
                    return res.status(500).json({
                        message:"Product Update Failed"
                    })
                }
                res.status(200).json({
                    message:"Product Photo Updated",
                    data: upload.secure_url
                })
    } catch (error) {
        res.status(500).json({
            message:"Server Error In Updating Product Photo"
        })
    }
}

export {productCreate,productFetch,fetchSingleProduct,updateProduct,updatePhotoProduct}