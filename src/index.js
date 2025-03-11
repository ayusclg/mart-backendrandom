import express from 'express'
import dbConnect from './database/index.js'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import adminRoutes from './routes/admin.routes.js'
import emailRoutes from './routes/email.routes.js'

dotenv.config()


const app = express ()

const port = process.env.PORT || 3000

const host = '127.0.0.1'


app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(express.static("public"))
app.use(cors())
app.use(helmet())


dbConnect()
.then(()=>{
app.listen(port,()=>{
    console.log(`you are running on : http://${host}:${port}`)
})
}).catch((err)=>{
    console.log("Error In Connection",err)
})



app.use("/auth",userRoutes)
app.use("/product",productRoutes)
app.use("/order",orderRoutes)
app.use("/admin",adminRoutes)


app.use("/email",emailRoutes)

