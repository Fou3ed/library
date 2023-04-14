import conversationMember from '../models/convMembers/convMembersModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'
const element=4
import logs from '../models/logs/logsMethods.js'
const log = new logs()
const logger = debug('namespace')


/**
 *  GetMembers :get members of conversation
 * @route /members
 * @method Get 
 */
export const GetMembers = async (req, res) => {
    try {
        const result = await conversationMember.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result,
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such conversation Member "
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data ",
        })
    }
}


export const getMembersByConversation = async (convId) => {
    try {
      const result = await conversationMember.find({ conversation_id: convId }).populate('user_id')
      if (result.length > 0) {
        console.log(`Found ${result.length} members for conversation with ID: ${convId}`);
        return result.map(member => member.user_id);
      } else {
        console.log(`No members found for conversation with ID: ${convId}`);
        return [];
      }
    } catch (err) {
      console.log(`Error while fetching conversation members: ${err}`);
      logger.error(`Error while fetching conversation members: ${err}`);
      return [];
    }
  };

  export const getMembersConversation = async (req,res) => {
    console.log(req.params.id)
    try {
      const result = await conversationMember.find({ conversation_id: req.params.id }).populate('user_id')
      if (result.length > 0) {
        console.log(`Found ${result.length} members for conversation with ID: ${req.params.id}`);
        res.status(200).json({
            message:"success",
            data:result
        })
      } else {
        res.status(200).json({
            message:"success",
            data:"no members found"
        })
      }
    } catch (err) {
      console.log(`Error while fetching conversation members: ${err}`);
      logger.error(`Error while fetching conversation members: ${err}`);
      res.status(400).send({
        message: "fail retrieving data"
    })
    }
  };
  
  



/**
 * getConversation : getMember : get member data
 * @route /conversation/:id
 * @method Get
 */
export const getMember = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such conversation member(wrong id) '
        })
    } else {
        try {
            const result = await conversationMember.findById(id);
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
/**
 * addMembers:add members to conversation
 * @route /member
 * @method post
 * @body 
 */
export const postMember = async (req, res) => {
       const data={
            user_id:req.user_id,
            conversation_id:req.conversation_id
        }
        try{

            const result = await conversationMember.create(data);
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "Add member",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                console.log("adding member")
                return result
            } else {
                console.log("error adding  conversation member ")
            }
        } catch (err) {
            console.log(err)
            logger(err)
        }
    }

/**
 * updateMember : update member
 * @route /member/:id
 * @method put
 */
export const putMember = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such member (wrong id)'
        })
    } else {
        const data = {
            name: req.body.conversation_name

        }
        const check = Joi.object({
            name: Joi.string().required().min(4).max(48),

        })
        const {
            error
        } = check.validate(data)
        if (error) {
            res.status(400).send({
                'error': error.details[0].message
            })
        } else {
            try {
                const result = await conversationMember.findByIdAndUpdate(
                    id, {
                        $set: req.body,
                        updated_at: Date.now()
                    })

                if (result) {
                    res.status(202).json({
                        message: "success",
                        data: result
                    })
                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id":"req.body.socket_id",
                        "action": "Update Member ",
                        "element": element,
                        "element_id": "1",
                        "ip_address": "192.168.1.1"
                    }
                    log.addLog(dataLog)
                } else {
                    res.status(400).send({
                        'error': ' wrong values'
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
}
/**
 * deleteMember : delete member
 * @route /member/:id
 * @method delete
 */
export const deleteMember = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such member(wrong id) '
        })
    } else {
        try {
            const result = await conversationMember.findByIdAndDelete(id)
            if (result) {
                res.status(202).json({
                    message: "success",
                    
                })
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "delete Member ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
            } else {
                res.status(400).send({
                    'error': 'there is no such conversation'
                })
            }
        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again '
            })
        }
    }
}