import jwt from 'jwt'

const verifyToken = async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken
        if(!token){
            return res.status(400).json({
                message:"Couldnot find Token"
            })
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id)
        if(!user){
            return res.status(403).json({
                message:"Couldnot find the user from token"
            })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({
            message:"something went wrong in verify token"
        })
    }
}
export default verifyToken