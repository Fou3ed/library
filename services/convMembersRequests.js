import conversationMember from '../models/convMembersModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'

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
    const data = {
        conversation: req.body.conversation_id,
        name: req.body.conversation_name

    }
    const check = Joi.object({
        conversation: Joi.string().required(),
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
            const result = await conversationMember.create(req.body);
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