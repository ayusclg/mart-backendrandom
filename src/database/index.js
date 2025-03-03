import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config()


const dbConnect = async function (){
    
    try {
        const mongoInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDb Connected :`,mongoInstance.connection.host)
    } catch (error) {
        console.log("Error In DB connection",error)
        process.exit(1)
        
    }
}

export default dbConnect 