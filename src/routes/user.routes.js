import { Router } from "express";
import { Upload } from "../middlewares/multer.middlewares.js";
import { createUser, currentUser, deleteUser, newAccessToken, updatePassword, updateUser, userLogin, userLogout } from "../controllers/user.controller.js";
import joi from 'joi'
import verifyToken from "../middlewares/auth.middlewares.js";



const router = Router()

const validateCreateSchema = joi.object({
    username:joi.string().required().min(4).max(5),
    email:joi.string().email().required(),
    password:joi.string().required().pattern(new RegExp("^(?=.*[^a-zA-Z0-9])(?=.*[A-Z])(?=.*\\d).{8,}$")).message({
        "string.pattern.base":"Please Provide atleast one character and number and lowercase",
    })
}).unknown(true)

router.route("/create").post(Upload.single("avatar"),async(req,res,next)=>{
    try {
        await validateCreateSchema.validateAsync(req.body)
        next()
    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path,(err)=>{
                console.log(err)
            })
        }
        return res.status(500).json({
            messsage:"Error In Validation"
        })
    }

},createUser)


router.route("/login").get(userLogin)
router.route("/logout").get(verifyToken,userLogout)
router.route("/upass").patch(verifyToken,updatePassword)
router.route("/uUser").patch(verifyToken,updateUser)
router.route("/getuser").get(verifyToken,currentUser)
router.route("/newaccess").post(verifyToken,newAccessToken)
router.route("/delete").delete(verifyToken,deleteUser)
export default router