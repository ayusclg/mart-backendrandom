import { User } from "../models/user.models"
import uploadOnCloudinary from "../utils/cloudinary.utils"
import fs from 'fs'


const createUser = async (req,res)=>{
    try {
        const {username,email,password,address,contact} = req.body

        const user = await User.findOne({email:email})
        if(user){
            if(req.file){
                fs.unlink(req.file.path,(err)=>{
                    console.log("Error In ",err)
                })
            }
            return res.status(403).json({
                message:"User already Exist"
            })
        }
        
        const avatar = `public/avatar${req.file.filename}`
        if(!avatar){
            return res.status(403).json({
                message:"Please Provide Your Avatar"
            })
        }
        const  upload = await uploadOnCloudinary(avatar)
        const create = await User.create({
            username,
            email,
            password,
            address,
            contact,
            avatar: upload.secure_url
        }).select("-passsword -refresh_token")


        if(!create){
            if(req.file){
                fs.unlink(req.file.path,(err)=>{
                    console.log("Error In ",err)
                })
            }
            return res.status(500).json({
                message:"Please Provide All Details Sincerly"
            })
        }

        const createduser = await User.findById(create._id)

        res.status(200).json({
            message:"User Successfully Created",
            data:createduser
        })
    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                console.log("Error In ",err)
            })
        }
        res.status(500).json({
            message:"Error In Registering User"
        })
    }
}
export {createUser}