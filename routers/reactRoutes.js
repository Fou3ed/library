import express from "express";
import { getReact } from "../services/reactRequests.js";
const router =express.Router()

router.get('/:id/',getReact)
export default router 