import express from "express";
import { GetLastMessage, getMessagesUsers,getPinnedMessage,getMessagesUsersTransferred,getConversationMessages } from "../services/messageRequests.js";
const router =express.Router()

router.get('/:id',getMessagesUsers)
router.get('/conv/:id',getConversationMessages)
router.get('/pin/:id',getPinnedMessage)
router.get('/lastMsg/:id',GetLastMessage)
router.get('/msgTransf/:id',getMessagesUsersTransferred)
export default router 