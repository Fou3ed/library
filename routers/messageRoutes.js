import express from "express";
import { GetLastMessage, getMessagesUsers } from "../services/messageRequests.js";
const router =express.Router()

router.get('/:id',getMessagesUsers)
router.get('/lastMsg/:id',GetLastMessage)
export default router 