import react from '../models/reactions/reactionModel.js'
import {
    debug,
   
} from '../dependencies.js'
import logs from '../models/logs/logsMethods.js'
const log = new logs()
const element= 7
const logger = debug('namespace')


/**
 * find reacts in a message  
 */
export const getReact=async(req,res)=>{
    console.log(req.params.id)
    const idMessage=req.params.id
    try{
        const result =await react.find({ message_id: idMessage })
        if(result.length>0){
            res.json({
                message:"success",
                data:result
                
            })
        }else {
            res.status(200).json({
                message:"success",
                data:"there are no reacts on this message"
            })
        }
    }catch{
        logger(err)
        res.status(400).send({
            message:"fail retrieving reacts data"
        })
    }
}
/**
 * createRole: create role
 * @route /role
 * @method post
 * @body  name,role_type,permissions
 */
export const postReact = async (req, res) => {
console.log("aaaa",req)
        try {
            const result = await react.create(req.metaData);
            console.log(result)
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "add reaction to a message ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                return result
            } else {
                console.log("error adding react ")
            }
        } catch (err) {
            logger(err)
        }
    }

/**
 * updateReact : update react data
 * @route /react/:id
 * @method put
 */
export const putReact = async (req, res) => {
            try {
                const result = await react.findByIdAndUpdate(
                    id, {
                        $set: req.body,
                        updated_at: Date.now()
                    })
                if (result) {
                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id":"req.body.socket_id",
                        "action": " update react message  ",
                        "element": element,
                        "element_id": "1",
                        "ip_address": "192.168.1.1"
                    }
                    log.addLog(dataLog)
                 return result
                } else {
                  console.log("error updating reaction ")
                }
            } catch (err) {
                logger(err) 
            }
        }
/**
 * unReact msg  : delete react from a msg 
 * @route /role/:id
 * @method delete
 */
export const unReactMsg = async (req, res) => {
    const id=req.metaData.message_id
    console.log(id)
        try {
            const result = await react.findByIdAndDelete(id)
      
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "UnReact message ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                return result 

            } else {
               console.log("error unReacting a message ")
            }
        } catch (err) {
            console.log(err)
        }
    }

