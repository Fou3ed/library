import express from "express";
import { getMessagesUsers } from "../services/messageRequests.js";
const router =express.Router()

router.get('/:id',getMessagesUsers)
export default router 