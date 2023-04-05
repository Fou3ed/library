import express from "express";
import { GetLastMessage, getMessagesUsers,getPinnedMessage } from "../services/messageRequests.js";
const router =express.Router()

router.get('/:id',getMessagesUsers)
router.get('/pin/:id',getPinnedMessage)
router.get('/lastMsg/:id',GetLastMessage)
export default router 