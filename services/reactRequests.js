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
 * check react with msg id and user
 *  
 */
export const getMsgReact=async(message,user,res)=>{
    try{
        const result = await react.find({message_id:message ,user_id:user
        })
        return result
    }catch(err){
        console.log(err)
    }
}

/**
 * createRole: create role
 * @route /role
 * @method post
 * @body  name,role_type,permissions
 */
export const postReact = async (req, res) => {

        try {
            const result = await react.create(req.metaData);
           
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
export const putReact = async (id,data) => {
    const reactId =id.toString()

            try {
                const result = await react.findByIdAndUpdate(
                    reactId, {
                        path:data.metaData.path,
                        updated_at: Date.now()
                    },
                    {new:true}
                    )
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
                 return  result 
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
export const unReactMsg = async (id) => {
   
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

