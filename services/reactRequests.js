import react from '../models/reactions/reactionModel.js'
import {
    debug,
   
} from '../dependencies.js'
import logs from '../models/logs/logsMethods.js'
const log = new logs()
const element= 7
const logger = debug('namespace')

/**
 * createRole: create role
 * @route /role
 * @method post
 * @body  name,role_type,permissions
 */
export const postReact = async (req, res) => {

        try {
            const result = await react.create(req);
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
               console.log("error unracting a message ")
            }
        } catch (err) {
            console.log(err)
        }
    }

