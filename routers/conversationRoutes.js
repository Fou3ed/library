import express from "express";
import { getConversationUsers } from "../services/conversationsRequests.js";
const router =express.Router()

router.get('/:id',getConversationUsers)
export default router 