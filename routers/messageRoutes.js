import express from "express";
import { GetLastMessage, getMessagesUsers,getPinnedMessage,getMessagesUsersTransferred } from "../services/messageRequests.js";
const router =express.Router()

router.get('/:id',getMessagesUsers)
router.get('/pin/:id',getPinnedMessage)
router.get('/lastMsg/:id',GetLastMessage)
router.get('/msgTransf/:id',getMessagesUsersTransferred)
export default router 