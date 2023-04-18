import express from "express";
import { getConv, getUserConversations,getActiveCnvs, putActiveCnvs } from "../services/conversationsRequests.js";
const router =express.Router()

router.get('/:id',getUserConversations)
router.get('/',getConv)
router.get('/active/:id',getActiveCnvs)
router.put('/status/:id',putActiveCnvs)
export default router 