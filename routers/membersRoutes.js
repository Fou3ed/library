import express from "express";
import {  getMembersConversation } from "../services/convMembersRequests.js";
const router =express.Router()

router.get('/:id',getMembersConversation)
export default router 