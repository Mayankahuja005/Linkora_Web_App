import express from  "express"
import protect from "../middlewares/authMiddlewares.js"
import { acceptRequest, getPending, myConnections, myFeed, rejectRequest, sendRequest } from '../controllers/connectionController.js'
const router=express.Router()

router.get("/feed",protect,myFeed)
router.get("/pending",protect,getPending)
router.get("/my-connection",protect,myConnections)
router.post("/send/:receiverId",protect,sendRequest)
router.put("/accept/:requestId",protect,acceptRequest)
router.put("/reject/:requestId",protect,rejectRequest)
export default router 
