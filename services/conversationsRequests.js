import conversation from '../models/conversations/conversationModel.js'
import members from '../models/convMembers/convMembersModel.js'
import {
    mongoose
} from '../dependencies.js';
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'
import loggers from '../config/newLogger.js';
import logs from '../models/logs/logsMethods.js'
const log = new logs()
const element = 3
const logger = debug('namespace')


/**
 *  GetConversations :get conversations
 * @route /conversations
 * @method Get 
 */
export const getConversations = async (req, res) => {
    try {
        const result = await conversation.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no conversation"
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
 * get conversation between agent and client 
 */
export const getConv = async (req, res) => {
    
    const userId1 = req.query.user1
    const userId2 = req.query.user2

    try {
        const result = await conversation.aggregate([
            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'conversation_id',
                    as: 'members'
                }
            },
            {
                $match: {
                    'members.user_id': {
                        $all: [
                            mongoose.Types.ObjectId(userId1),
                            mongoose.Types.ObjectId(userId2)
                        ]
                    }
                }
            },
            {
                $project: {
                    'members': 0
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'conversation_id',
                    as: 'messages'
                }
            },
            {
                $match: {
                    'messages.read': ''
                }
            },
            {
                $count: 'total_unReadMessages'
            }
        ]);
        
        res.status(200).json({
            message: "success",
            data: result
        })
    } catch (err) {
        console.log(err)
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }

}


export const getConvBetweenUsers = async (userId1,userId2) => {

    try {
        const result = await conversation.aggregate([{
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'conversation_id',
                    as: 'members'
                }
            },
            {
                $match: {
                    'members.user_id': {
                        $all: [
                            mongoose.Types.ObjectId(userId1),
                            mongoose.Types.ObjectId(userId2)
                        ]
                    }
                }
            },
            {
                $project: {
                    'members': 0
                }
            },
        ]);
       
      return result 
    } catch (err) {
        console.log(err)
        logger(err)         
    }

}



export const getPrivateConvBetweenUsers = async (userId1,userId2) => {
        console.log("user 1 and user 2 ",userId1,userId2)
    try {
        const result = await conversation.aggregate([{
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'conversation_id',
                    as: 'members'
                }
            },
            {
                $match: {
                    'members.user_id': {
                        $all: [
                            mongoose.Types.ObjectId(userId1),
                            mongoose.Types.ObjectId(userId2)
                        ]
                    }
                }
            },
            // {
            //     $match: {
            //         conversation_type: 3
            //     }
            // },
            {
                $project: {
                    'members': 0
                }
            },
        ]);
        console.log("hedhy res",result)
      return result 
    } catch (err) {
        console.log(err)
        logger(err)         
    }

}


/**
 * update last message in conversation 
 */


/**
 * get all conversation user connected have 
 */
export const getUserConversations = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await conversation.aggregate([
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "conversation_id",
            as: "members",
          },
        },
        {
          $match: {
            "members.user_id": mongoose.Types.ObjectId(id),
          },
        },
        {
          $sort: {
            updated_at: -1,
          },
        },
      ]);
  
      res.status(200).json({
        message: "success",
        data: result,
      });
    } catch (err) {
      console.log(err);
      logger(err);
      res.status(400).send({
        message: "fail retrieving data",
      });
    }
  };
  



/**
 * getConversation : get conversation data
 * @route /conversation/:id
 * @method Get
 */
export const getConversation = async (req, res) => {
     
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such conversation(wrong id) '
        })
    } else {
        try {
            const result = await conversation.findById(id);
            res.status(200).json({
                message: "success",
                data: result
            })
        } catch (err) {
            console.log(err)
            logger(err)
            res.status(400).send({
                message: "fail retrieving data"
            })
        }
    }
}

export const getConversationById = async (id, res) => {
        try {
            const conversationData= await conversation.findById(id)
            const membersData=await members.find({conversation_id: id}) 

         
            return {...conversationData , members:membersData}

        } catch (err) {
            console.log(err)
            logger(err)
       
        }
    }



/**
 * createConversation: create conversation
 * @route /conversation
 * @method post
 * @body name:,channel_url: , conversation_type : , description:,members_count:,max_length_message:,operators:[],owner_id:,last_msg:,unread_messages_count:,permission:{key:value} ,metadata:{"key":"value"}
 */
export const postConversation = async (req, res) => {
    const data = {
        name: req.metaData.name,
        channel_url: req.metaData.channel_url,
        conversation_type: req.metaData.conversation_type,
        members_count: req.metaData.members_count,
        max_length_message: req.metaData.max_length_message,
        operators: req.metaData.operators,
        permission: req.metaData.permission
    }
    const check = Joi.object({
        name: Joi.string().required().min(4).max(48),
        channel_url: Joi.string().required(),
        conversation_type: Joi.string().required(),
        members_count: Joi.number().required().min(1).max(24),
        max_length_message: Joi.number().required().min(4).max(512),
        operators: Joi.array().required(),
        permission: Joi.object()
    })
    const {
        error
    } = check.validate(data)
    if (error) {
        console.log(error)

    } else {
        try {
            const result = await conversation.create(req.metaData);
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Create conversation",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                console.log("conversation added")
                return result
            } else {
                console.log("can't add new conversation")
            }
        } catch (err) {
            console.log(err)
            loggers.error(err)


        }
    }
}
/**
 * updateConversation : update conversation
 * @route /conversation/:id
 * @method put
 */
export const putConversationLastMessage = async (id, message, error) => {
    try {
        const result = await conversation.findByIdAndUpdate(
            id, {
                $set: {
                    last_message: message,
                    updated_at: Date.now(),
                }
            }, {
                new: true
            } // to return the updated document
        );

        if (result) {
            console.log("conversation updated successfully")
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
                "action": "Update conversation ",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)

            return result
        } else {
            console.log(" wrong values")
        }

    } catch (err) {
        console.log(err)
        logger.error(err)
    }
}



/**
 * deleteConversation : delete conversation
 * @route /conversation/:id
 * @method delete
 */
export const deleteConversation = async (req, res) => {
    try {
        const result = await conversation.findByIdAndDelete(req)
        if (result) {
            console.log("conversation deleted successfully")
            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "req.body.socket_id",
                "action": "Delete conversation ",
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)
            return result
        } else {
            console.log("couldn't delete conversation")
        }
    } catch (err) {
        loggers.error(err)

    }


}
export const getActiveCnvs = async (req, res) => {
   const userId=req.params.id
    try {
        const result = await conversation.aggregate([
            {
                $lookup: {
                    from: "members",
                    localField: "_id",
                    foreignField: "conversation_id",
                    as: "members"
                }
            },
            {
                $match: {
                    "members.user_id": mongoose.Types.ObjectId(userId),
                    status: 1 // Add this line to filter by status = 1
                }
            },
            {
                $sort: {
                    updated_at: -1
                }
            }
        ])
        if (result) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no active conversations"
            })
        }

    } catch (err) {
        res.status(400).send({
            message: "fail retrieving data"
        })
        console.log(err)
        loggers.err(err)
    }
}

export const putActiveCnvs = async (req, res) => {
    const id = req.params.id
    try {
        const result = await conversation.findByIdAndUpdate(
            id, {
                $set: {
                    status: 0,
                    updated_at: Date.now(),
                }
            }, {
                new: true
            } // to return the updated document
        );
        if (result) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no active conversations"
            })
        }

    } catch (err) {
        res.status(400).send({
            message: "fail retrieving data"
        })
        console.log(err)
        loggers.err(err)
    }
}

export const putConvType = async (id,status,type, res) => {
    
    try {
        const result = await conversation.findByIdAndUpdate(
            id, {
                $set: {
                    conversation_type: status,
                    updated_at: Date.now(),
                }
            },
        );
    
       return result
        
    } catch (err) {
        
        console.log(err)
        loggers.err(err)
    }
}