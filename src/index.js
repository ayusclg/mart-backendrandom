import express from 'express'
import dbConnect from './database/index.js'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'

dotenv.config()


const app = express ()

const port = process.env.PORT || 3000

const host = '127.0.0.1'


app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(express.static("public"))


dbConnect()
.then(()=>{
app.listen(port,()=>{
    console.log(`you are running on : http://${host}:${port}`)
})
}).catch((err)=>{
    console.log("Error In Connection",err)
})



app.get("/",(req,res)=>{
    res.send("Hello Aayush")   
})