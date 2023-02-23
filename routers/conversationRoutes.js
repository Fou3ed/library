import express from "express";
import { getConv, getUserConversations } from "../services/conversationsRequests.js";
const router =express.Router()

router.get('/:id',getUserConversations)
router.get('/',getConv)
export default router 