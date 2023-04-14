import message from '../models/messages/messageModel.js'

import {
    debug,
    validator
} from '../dependencies.js'
import logs from '../models/logs/logsMethods.js'
const log = new logs()
const element = 6
const logger = debug('namespace')
import mongoose from 'mongoose'
/**
 *  GetMessages :get get messages
 * @route /messages
 * @method Get 
 */
export const GetLastMessage = async (req, res) => {
    const conversationId = req.params.id

    try {
        const lastMessage = await message.find({
                conversation_id: conversationId
            })
            .sort({
                created_at: -1
            }) // Sort by created_at in descending order
            .limit(1)
        if (lastMessage.length > 0) {

            res.status(200).json({
                message: "success",
                data: lastMessage[0]
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no conversation"
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
    const conversationId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {  
        // Get the 10 other typed messages
        const messages = await message
            .find({
                conversation_id: conversationId,
                type: {
                    $ne: "log"
                }
            })
            .sort({
                created_at: -1
            })
            .skip(skip)
            .limit(limit)
            .exec();

        // Get the timestamps of the first and last message in the set
        const firstMessageTimestamp = messages.length > 0 ? messages[messages.length - 1].created_at : new Date();
        const lastMessageTimestamp = messages.length > 0 ? messages[0].created_at : new Date();

        // Get the log messages that were created between the timestamps
        const logMessages = await message
            .find({
                conversation_id: conversationId,
                type: "log",
                created_at: {
                    $gte: firstMessageTimestamp,
                    $lte: lastMessageTimestamp
                }
            })
            .sort({
                created_at: -1
            })
            .exec();

        // Merge the two sets of messages and sort them by timestamp
        const allMessages = [...logMessages, ...messages];
        allMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const totalMessages = await message.countDocuments({
            conversation_id: conversationId,
            type: {
                $ne: "log"
            }
        });
        
        const totalPages = Math.ceil(totalMessages / limit);
        const currentPage = page;
        
        res.status(200).json({
            message: "success",
            data: {
                messages: allMessages,
                totalPages,
                currentPage,
            },
        });
        
    } catch (err) {
        logger(err);
        console.log(err);
        res.status(400).send({
            message: "fail retrieving data ",
        });
    }
};

/**
 * createMessage : create message
 * @route /message
 * @method post
 * @body  type,conversation_id,user,mentioned_users,readBy,is_removed,message,data,attachments,parent_message_id,parent_message_info,location,origin
 */
export const postMessage = async (req, res) => {
    console.log(req)
    try {
        const result = await message.create(req.metaData);
        if (result) {
            console.log("message created in db")
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
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
        console.log("error adding a message into data base", err)
        logger(err)
    }
}

/**
 * updateMessage : update message data
 * @route /message/:id
 * @method put
 */

export const putMessage = async (req, res) => {
    const id = req.metaData.message
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such member (wrong id)'
        })
    } {
        try {
            const result = await message.findByIdAndUpdate(
                id, {
                    $set: {
                        message: req.metaData.fields.content,
                        updated_at: Date.now(),
                        status: 2
                    }
                }, {
                    new: true
                } // set new to true to return the updated document
            )
            if (result) {
                console.log("message updated")
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
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
                        read: Date.now()
                    }
                })
            if (result) {
                return result
            } else {
                console.log(" error updating message to read")
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
export const MarkMessageAsPinned = async (id, user) => {
    console.log("pined :: ", id)
    try {
        const result = await message.findByIdAndUpdate(
            id, {
                pinned: 1
            }, {
                new: true
            }
        )
        if (result) {
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
                "action": "Mark message as pinned ",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)
            console.log("resulted pinned", result)
            return result
        } else {
            console.log("error")
        }

    } catch (err) {

        logger(err)
    }
}




/**
 * MarkMessageAsUnPinned : mark a message as pinned
 * @route /message/pin/:id
 * @method put
 */
export const MarkMessageAsUnPinned = async (data, res) => {

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
                        pinned: 0
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Mark message as unPinned",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                return result
            } else {
                console.log(" 2 error")
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
                    "socket_id": "req.body.socket_id",
                    "action": "mark message as delivered",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                return result

            } else {
                res.status(400).send({
                    'error': '  wrong values'
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
 * get pinned messages : with user details (user:sender )
 */
export const getPinnedMessage = async (req, res) => {

    try {

        let conversationId = req.params.id
        const result = await message.find({
                conversation_id: conversationId,
                pinned: 1,

            }).sort({
                created_at: -1
            })
            .populate('user')
            .exec();
        if (result) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).send({
                message: "there are no pinned messages"
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
 * MarkMessageAsPinned : mark a message as pinned
 * @route /message/pin/:id
 * @method put
 */
export const MarkMessageAsForwarded = async (id, user) => {
    console.log("forwarded :  ", id)
    try {
        const result = await message.findByIdAndUpdate(
            id, {
                status: 3
            }, {
                new: true
            }
        )
        if (result) {
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
                "action": "Mark message as forwarded ",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)
            console.log("message forwarded result :", result)
            return result
        } else {
            console.log("error")
        }

    } catch (err) {

        logger(err)
    }
}

/**
 * deleteMessage : delete message
 * @route /message/:id
 * @method delete
 */

export const deleteMessage = async (req, res) => {
    const id = req.metaData.message
    try {
        const result = await message.findByIdAndUpdate(id, {
            $set: {
                status: 0
            }
        })
        console.log(result)
        if (result) {
            console.log("deleted / status updated to 0")
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
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
export const getMessagesUsersTransferred = async (req, res) => {
    const conversationId = req.params.id;
    const messageId = req.query.message;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const logMessages = await message
        .find({
          conversation_id: conversationId,
          type: "log"
        })
        .sort({ created_at: -1 })
        .exec();
  
      const totalMessages = await message.countDocuments({
        conversation_id: conversationId,
        type: { $ne: "log" }
      });
  
      const startMessage = await message.findById(messageId);
  
      const messages = await message
        .aggregate([
          {
            $match: {
              conversation_id: mongoose.Types.ObjectId(conversationId),
              type: { $ne: "log" },
              created_at: { $gte: startMessage.created_at }
            },
          },
          {
            $sort: {
              created_at: -1
            },
          },
          {
            $lookup: {
              from: "reacts",
              localField: "_id",
              foreignField: "message_id",
              as: "reacts",
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ])
        .exec();
  
      if (messages.length > 0 || logMessages.length > 0) {
        const totalPages = Math.ceil(totalMessages / limit);
        const currentPage = page;
        const allMessages = [...logMessages, ...messages];
        allMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        res.status(200).json({
          message: "success",
          data: {
            messages: allMessages,
            totalPages,
            currentPage,
          },
        });
      } else {
        res.status(200).json({
          message: "success",
          data: "there are no conversation ",
        });
      }
  
    } catch (err) {
      logger(err);
      console.log(err);
      res.status(400).send({
        message: "fail retrieving data ",
      });
    }
  };
  