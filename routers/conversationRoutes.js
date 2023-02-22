import express from "express";
import { getUserConversations } from "../services/conversationsRequests.js";
const router =express.Router()

router.get('/:id',getUserConversations)
export default router 