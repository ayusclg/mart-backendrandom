import Router from  'express'
import { createOrder, fetchAllOrder, fetchSingleUserOrder } from '../controllers/order.controllers'
import verifyToken from '../middlewares/auth.middlewares'

const router = Router()

router.route("/create").post(verifyToken,createOrder)
router.route("/single").get(verifyToken,fetchSingleUserOrder)
router.route("/all").get(fetchAllOrder)

export default router