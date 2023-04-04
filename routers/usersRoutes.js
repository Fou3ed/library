import express from "express";
import { getUsers,postUser,getUserConnected } from "../services/userRequests.js";
const router =express.Router()

router.get('/',getUsers)
router.post('/',postUser)
router.get('/connected',getUserConnected)
export default router 