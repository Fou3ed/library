import express from "express";
import { getUsers } from "../services/userRequests.js";
const router =express.Router()

router.get('/',getUsers)
export default router 