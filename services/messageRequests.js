import message from '../models/messages/messageModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'
import logs from '../models/logs/logsMethods.js'
const log = new logs()
const element=6
const logger = debug('namespace')
/**
 *  GetMessages :get get messages
 * @route /messages
 * @method Get 
 */
export const GetMessages = async (req, res) => {
    try {
        const result = await message.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such message "
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data ",
        })
    }
}

/**
 * getMessage:get message data
 * @route /message/:id
 * @method Get
 */
export const getMessage = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such message(wrong id) '
        })
    } else {
        try {
            const result = await message.findById(id);
            res.status(200).json({
                message: "success",
                data: result
            })
        } catch (err) {
            logger(err)
            res.status(400).send({
                message: "fail retrieving data"
            })
        }
    }
}

export const getMessagesUsers = async (req, res) => {
    const conversationId = req.params.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
  
    try {
      const totalMessages = await message.countDocuments({ conversation_id: conversationId })
      const messages = await message.find({ conversation_id: conversationId })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip)
  
      if (messages.length > 0) {
        res.status(200).json({
          message: "success",
          data: {
            messages,
            totalPages: Math.ceil(totalMessages / limit),
            currentPage: page
          }
        })
      } else {
        res.status(200).json({
          message: "success",
          data: "there are no conversation "
        })
      }
  
    } catch (err) {
      logger(err)
      console.log(err)
      res.status(400).send({
        message: "fail retrieving data "
      })
    }
  }
  
  





/**
 * createMessage : create message
 * @route /message
 * @method post
 * @body  type,conversation_id,user,mentioned_users,readBy,is_removed,message,data,attachments,parent_message_id,parent_message_info,location,origin
 */
export const postMessage = async (req, res) => {
    try {
        const result = await message.create(req.metaData);
        if (result) {
            console.log("message created in db")
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id":"req.body.socket_id",
                "action": "Create message ",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)
          return result

        } else {
           console.log("error adding msg")
        }
    } catch (err) {
            console.log(err)
        logger(err)
    }
}

/**
 * updateMessage : update message data
 * @route /message/:id
 * @method put
 */
export const putMessage = async (req, res) => {
    if (!validator.isMongoId(req)) {
        res.status(400).send({
            'error': 'there is no such member (wrong id)'
        })
    } {
            try {
                const result = await message.findByIdAndUpdate(
                    req, {
                        $set: {
                            ...req.metaData,
                            updated_at: Date.now()
                        }
                    })
                if (result) {
                    console.log("message updated")
                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id":"req.body.socket_id",
                        "action": "update message  ",
                        "element": element,
                        "element_id": "1",
                        "ip_address": "192.168.1.1"
                    }
                    log.addLog(dataLog)
                  return result
                } else {
                   console.log("error updating message")
                }
            } catch (err) {
    
                logger(err)
            }
        }
    }


/**
 * MarkMessageAsRead : mark a message as read
 * @route /message/read/:id
 * @method put
 */
export const MarkMessageAsRead = async (data, res) => {
    const id=(data.metaData.message)
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such member (wrong id)'
        })
    } else {
        try {
            const result = await message.findByIdAndUpdate(
                id, {
                    $set: {
                        read: Date.now()
                    }
                })
            if (result) {
       
               return result
            } else {
                console.log("error")
            }

        } catch (err) {
            logger(err)
        }
    }
}

/**
 * MarkMessageAsPinned : mark a message as pinned
 * @route /message/pin/:id
 * @method put
 */
export const MarkMessageAsPinned = async (data, res) => {
    const id = data.metaData.message_id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such member (wrong id)'
        })
    } else {
        try {
            const result = await message.findByIdAndUpdate(
                id, {
                    $set: {
                        pinned: 1
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "Mark message as pinned ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
               return result
            } else {
                console.log("error")
            }

        } catch (err) {
            
            logger(err)
        }
    }
}



/**
 * MarkMessageAsUnPinned : mark a message as pinned
 * @route /message/pin/:id
 * @method put
 */
export const MarkMessageAsUnPinned = async (data, res) => {
    const id = data.metaData.message
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such member (wrong id)'
        })
    } else {
        try {
            const result = await message.findByIdAndUpdate(
                id, {
                    $set: {
                        pinned: 0
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "Mark message as unPinned",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
               return result
            } else {
                console.log("error")
            }

        } catch (err) {
            
            logger(err)
        }
    }
}


/**
 *  GetUnreadMessagesCount :get unread messages count 
 * @route /message
 * @method Get 
 */
export const GetUnreadMessagesCount = async (req, res) => {
    try {
        const result = await message.find({
            read: null
        });
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result.length
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no  unread messages"
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data ",
        })
    }
}

/**
 * markMessageAsDelivered : mark a message as delivered
 * @route /message/delivered/:id
 * @method put
 */
export const markMessageAsDelivered = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such member (wrong id)'
        })
    } else {
        try {
            const result = await message.findByIdAndUpdate(
                id, {
                    $set: {
                        delivered: Date.now()
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "mark message as delivered",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
               return result 

            } else {
                res.status(400).send({
                    'error': 'wrong values'
                })
            }

        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again (verify your params values ) '
            })
            logger(err)
        }
    }
}
/**
 *  GetUnreadMessages :get unread messages
 * @route /message
 * @method Get 
 */
export const GetUnreadMessages = async (req, res) => {
    try {
        const result = await message.find({
            read: null
        });
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such message "
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data ",
        })
    }
}
/**
 * deleteMessage : delete message
 * @route /message/:id
 * @method delete
 */
export const deleteMessage = async (req, res) => {
        try {
            const result = await message.findByIdAndDelete(req.metaData.message)
            if (result) {
             console.log("deleted")

             let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id":"req.body.socket_id",
                "action": "delete message  ",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)
             return result 
            } else {
               console.log("deleting message went wrong ")
            }
        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again '
            })
        }
    }
