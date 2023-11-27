import express from "express";
import { getUsers,postUser,getAgentConnected,getUserConnected ,putUserStatus,getAllUserConnected,getUserById,getClient,createAgent,agentAvailable, crashServer} from "../services/userRequests.js";
const router =express.Router()

router.get('/',getUsers)
router.post('/',postUser)
router.get('/connected',getUserConnected)
router.get('/all/connected/:id',getAllUserConnected)
router.put('/status/:id',putUserStatus)

router.get('/:id',getUserById)
router.get('/agent/:id',getAgentConnected)
router.get('/client/:id',getClient)
router.post('/create_agent',createAgent)
router.get('/crash/server',crashServer)
router.get('/availableAgent/:accountId',async(req,res)=> {
const agent=await  agentAvailable(req.params.accountId)
res.status(200).json({
    agent    
})

}) 
export default router  