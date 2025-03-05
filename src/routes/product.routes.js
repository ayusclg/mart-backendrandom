import Router from 'express'
import verifyToken from '../middlewares/auth.middlewares.js'
import { fetchSingleProduct, productCreate, productFetch, updatePhotoProduct, updateProduct } from '../controllers/product.controllers'

const router = Router ()

        router.route("/create").post(verifyToken,productCreate)
        router.route("/fetch").get(productFetch)
        router.route("/single/_id").get(fetchSingleProduct)
        router.route("/update/_id").patch(verifyToken,updateProduct)
        router.route("/uphoto/_id").patch(verifyToken,updatePhotoProduct)

export default router 