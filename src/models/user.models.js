import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    password:{
        type:string,
        required:true
    },
    avatar:{
        type:string,
        required:true
    },
    refresh_token:{
        type:string
    }
},
    
    
    
    {timestamps:true}

)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()

})
userSchema.method.isPaswwordCorrect = async(password)=>{
return await bcrypt.compare(password,this.password)
}



userSchema.method.accesstokengenerate = async function (){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY},
)}

userSchema.method.refreshtokengenerate =async function (){
    return jwt.sign({
        _id:this._id
    },
process.env.REFRESH_TOKEN_SECRET,
{expiresIn:process.env.REFRESH_TOKEN_EXPIRY},
)}

export const User = mongoose.model('User',userSchema)