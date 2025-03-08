import { User } from "../models/user.models"


const getAllUser = async (req,res)=>{

    try {
        const user = await User.findById(req.user._id)
        if(user.role !== "admin"){
            return res.status(403).json({
                message:"Access Denied"
            })
        }
        let page = parseInt(req.query.page) || 1
        let perPage = parseInt(req.query.page) || 4

        const allUser = await User.find().select("-password -refresh_token").limit(perPage).skip((page-1)*perPage)
        if(!allUser){
            return res.status(404).json({
                message:"No User Found"
            })
        }
        res.status(200).json({
            message:"User Fetched Successfully",
            data:allUser
        })
    } catch (error) {
        res.status(500).json({
            message:"Server Error in Fetching All User"
        })
    }
}


export {getAllUser}