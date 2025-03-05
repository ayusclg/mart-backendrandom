import { Product } from "../models/product.models"
import { User } from "../models/user.models"
import uploadOnCloudinary from "../utils/cloudinary.utils"


const productCreate = async (req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(user !== "admin"){
            return res.status(403).json({
                message:"Only Admins Are Allowed"
            })
        }
        const {title,description,price,in_stocks,brand,category} = req.body

            const photo = `public/product/${req.file.filename}`

            const Upload = await uploadOnCloudinary(photo)
            if(!Upload){
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
            if(!createProduct){
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
export {productCreate,productFetch}