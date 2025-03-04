import { User } from "../models/user.models"
import uploadOnCloudinary from "../utils/cloudinary.utils"
import fs from 'fs'
import { v2 as cloudinary } from "cloudinary"
import jwt from 'jwt'


const generateAccessToken = async (userId)=>{
     const user = await User.findById(userId)
     const accessToken = await user.accesstokengenerate()
     return accessToken
}
const generateRefreshToken =async(userId)=>{
    const user = await User.findById(userId)
    const refreshToken = await user.refreshtokengenerate()
    user.refresh_token = refreshToken
    await user.save({validateBeforeSave:false})
    return refreshToken
}




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

const userLogin = async (req,res)=>{
    try {
        const{username,password} = req.body
        
        const user = await User.findOne({username:username}).select("-password -refresh_token")
        if(!user){
            return res.status(401).json({
                message:"Unauthorized Access"
            })
        }
        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            return res.status(400).json({
                message:"Invalid Password"
            })
        }
        const accessToken = await generateAccessToken(user._id)
        const refreshToken = await generateRefreshToken(user._id)
    
        if (!accessToken || !refreshToken){
            return res.status(500).json({
                message:"Token Not Generated"
            })
        }
        const options ={
            httpOnly:true,
            secure:true
        }
        res.cookie("accessToken",accessToken,options)
        res.cookie("refreshToken",refreshToken,options)
        return res.status(200).json({
            message:"Successfully Logged In",
            data:user
        })
    } catch (error) {
        return res.status(500).json({
            message:"Server Error In Logging In "
        })
    }
}

const userLogout = async(req,res)=>{
    try {
        const user = await User.findByIdAndUpdate(req.user._id,{
            $set:{
                refresh_token:undefined

            }},
            {
                new:true
            },
        ).select("-password -refresh_token")
        if(!user){
            return res.status(403).json({
                message:"Could not find user"
            })
        }
        const options ={
            httpOnly:true,
            secure:true
        }
        return res.status(200).json({
            message:"Successfully Logged out"
        })
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)


    } catch (error) {
        return res.status(500).json({
            message:"Server Error In Logout"
        })
    }
}

const updateUser = async(req,res)=>{
    try {
        const{email,username,contact,address}=req.body
    
        const user = await User.findByIdAndUpdate(req.user._id,{
            $set:{
                username,
                email,
                contact,
                address,
                
            }
        },
                {
                        new:true
    
                    }).select("-password -refresh_token")
                    if(!user){
                                return res.status(403).json({
                                    message:"User Not Found"
                                })
                            }
                    const updatedUser = await User.findById(user._id)
                    if(!updatedUser){
                        return res.status(400).json({
                            message:"User Not Updated something wrong"
                        })
                    }
    
    
        return res.status(200).json({
            message:"User Details Updated"
        })
    } catch (error) {
        return res.staus(500).json({
            message:"User Not Updated Server"
        })
    }
}

const updatePassword = async(req,res)=>{
    try {
        const{oldPassword ,newPassword} =req.body
        const user = await User.findById(req.user._id).select("-password -refresh_token")
        if(!user){
            return res.status(403).json({
                message:"Couldnot Find User"
            })
        }
        const isPasswordValid = await user.isPasswordCorrect(oldPassword)
        if(!isPasswordValid){
            return res.status(404).json({
                message:"Error Password details"
            })
        }
        user.password = newPassword
        await user.save({validateBeforeSave:false})

        return res.status(200).json({
            message:"Password Successfully Updated"
        })
    } catch (error) {
        return res.status(500).json({
            message:"server error in update password"
        })
    }
}

const updateAvatar = async (req,res)=>{
    try {
        const {oldPublicId} = req.body
       if(oldPublicId){
        await cloudinary.uploader.destroy(oldPublicId)
       }

       const newAvatar = `public/avatar${req.file.filename}`
       const upload = await uploadOnCloudinary(newAvatar)

       const user = await User.findByIdAndUpdate(req.user._id,{
        $set:{
            avatar:upload.secure_url,
        }
       },
        {
            new:true
        }
        ).select("-password -refresh_token")

        if(!user){
            return res.status(403).json({
                message:"Error In Fetching User"
            })
        }

        res.status(200).json({
            message:"Successfully Updated "
        })
    } catch (error) {
        return res.status(500).json({
            message:"Server Error In Updating User"
        })
    }
}

const currentUser = async(req,res)=>{
   try {
     const user = await User.findById(req.user._id).select("-password -refresh_token")
     if(!user){
         return res.status(403).json({
             message:"Error In Fetching User"
         })
     }
     res.status(200).json({
         message:"Current User Fetched",
         data:user
     })
   } catch (error) {
    res.status(500).json({
        message:"server Error in getting current user controller"
    })
   }
}

const newAccessToken = async(req,res)=>{
    try {
        const token = req.cookies?.refresh_token
        if(!token){
            return res.status(400).json({
                message:"Token Not Found"
            })
        }
        const decodedToken = jwt.verify(token,process.env.RFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id)
        if(!user){
            return res.status(400).json({
                message:"User Not Found"
            })
        }
        const accessTokenNew = await generateAccessToken(user._id)
        if(!accessTokenNew){
            return res.status(500).json({
                message:"New Token Not Generated"
            })
        }
        const options = {
            httpOnly:true,
            secure:true
        }
        res.cookie("accessToken",accessTokenNew,options)
        res.status(200).json({
            message:"New AccessToken Generated"
        })
    } catch (error) {
        return res.status(500).json({
            message:"Server Error In New Access Token Generate"
        })
    }
}

const deleteUser = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id)
        if(!user){
            return res.status(403).json({
                message:"User Not Found"
            })
        }
        const deleteUser = await User.deleteOne({_id:user._id})
        if(!deleteUser){
            return res.status(500).json({
                message:"Error in DELETING USER"
            })
        }
        res.status(200).json({
            message:"user deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message:"Server Error In Deleting User"
        })
    }
}
export {createUser,userLogin,userLogout,updateUser,updatePassword,updateAvatar,currentUser,newAccessToken,deleteUser}