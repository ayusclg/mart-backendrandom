
import Router from 'express'
import { send } from "../services/nodemailer";
import Joi from 'joi';

const validateEmail = Joi.object({
    to:Joi.email().required().string(),
    subject:Joi.string().required(),
    text:Joi.string().required()

})

const router = Router()
router.route("/send").post(async(req,res)=>{
    const {to,subject,text,html} = req.body
    const validation = await validateEmail.validateAsync(req.body)
    if(!validation){
        return res.status(400).json({
            message :"Field Validation Error Occur"
        })
    }
    try {
        const email = await send(to,subject,text,html || "")
        res.status(200).json({
            message:"Email Sent Successfully",
            data: email
        })
    } catch (error) {
        res.status(500).json({
            message:"Error Server IN Mail"
        })
    } 
})

export default router