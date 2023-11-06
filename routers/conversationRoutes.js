import express from "express";
import { getConv, getUserConversations,getActiveCnvs, putActiveCnvs,getConversations,getAllActiveCnvs,getAccountConversations,getUserConversationsCount,getConversationStatus } from "../services/conversationsRequests.js";
const router =express.Router()
//user Id
router.get('/all/:id',getConversations)
router.get('/account/:id',getAccountConversations)
router.get('/:id',getUserConversations)
router.get('/count/:id',getUserConversationsCount)
router.get('/',getConv)
router.get('/active/:id',getActiveCnvs)
router.get('/all/active/:id',getAllActiveCnvs)
router.put('/status/:id',putActiveCnvs)
router.get('/status/:id',getConversationStatus)
export default router 