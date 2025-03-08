import Router from 'express'
import verifyToken from '../middlewares/auth.middlewares'
import { getAllUser } from '../controllers/admin.controllers'

const router = Router ()

router.route("/adminU").get(verifyToken,getAllUser)

export default router