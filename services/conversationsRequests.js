import conversation from '../models/conversationModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'

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

/**
 * createConversation: create conversation
 * @route /conversation
 * @method post
 * @body name:,channel_url: , conversation_type : , description:,members_count:,max_length_message:,operators:[],owner_id:,last_msg:,unread_messages_count:,permission:{key:value} ,metadata:{"key":"value"}
 */
export const postConversation = async (req, res) => {
    const data = {
        name: req.body.name,
        channel_url: req.body.channel_url,
        conversation_type: req.body.conversation_type,
        members_count: req.body.members_count,
        max_length_message: req.body.max_length_message,
        operators: req.body.operators,
        permission: req.body.permission
    }
    const check = Joi.object({
        name: Joi.string().required().min(4).max(48),
        channel_url: Joi.string().required(),
        conversation_type: Joi.string().required(),
        members_count: Joi.number().required().min(1).max(24),
        max_length_message: Joi.number().required().min(4).max(512),
        operators: Joi.array().required(),
        permission: Joi.object().required()
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
            const result = await conversation.create(req.body);
            if (result) {
                res.status(201).json({
                    message: "success",
                    date: result
                })
            } else {
                res.status(400).json({
                    "error": 'failed to create new conversation'
                })
            }
        } catch (err) {
            res.status(400).json({
                'error': 'some error occurred.try again'
            })
            logger(err)
        }
    }
}
/**
 * updateConversation : update conversation
 * @route /conversation/:id
 * @method put
 */
export const putConversation = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such conversation (wrong id)'
        })
    } else {
        const data = {
            name: req.body.name,
            channel_url: req.body.channel_url,
            conversation_type: req.body.conversation_type,
            members_count: req.body.members_count,
            max_length_message: req.body.max_length_message,
            operators: req.body.operators,
            permission: req.body.permission

        }
        const check = Joi.object({
            name: Joi.string().required().min(4).max(48),
            channel_url: Joi.string().required(),
            conversation_type: Joi.string().required(),
            members_count: Joi.number().required().min(1).max(24),
            max_length_message: Joi.number().required().min(4).max(512),
            operators: Joi.array().required(),
            permission: Joi.object().required()

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
                const result = await conversation.findByIdAndUpdate(
                    id, {
                        $set: req.body
                    })
                if (result) {
                    res.status(202).json({
                        message: "success",
                        data: result
                    })
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

}
/**
 * deleteConversation : delete conversation
 * @route /conversation/:id
 * @method delete
 */
export const deleteConversation = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such conversation(wrong id) '
        })
    } else {
        try {
            const result = await conversation.findByIdAndDelete(id)
            if (result) {
                res.status(202).json({
                    message: "success",
                })
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