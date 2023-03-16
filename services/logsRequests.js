import logs from '../models/logs/logsModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'

const logger = debug('namespace')

/**
 *  GetLogs:get logs
 * @route /logs
 * @method Get 
 */
export const GetLogs = async (req, res) => {
    try {
        const result = await logs.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result,
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such logs "
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
 * getConversation : getLog : get Log data
 * @route /logs/:id
 * @method Get
 */
export const getLog = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such Log(wrong id) '
        })
    } else {
        try {
            const result = await logs.findById(id);
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
 * addLogs:add Logs to conversation
 * @route /Log
 * @method post
 * @body 
 */
export const postLog = async (req, res) => {
        try {
            const result = await logs.create(req);
            if (result) {
            console.log("added to log",req.action)
            } else {
             console.log("failed to save in logs")
            }
        } catch (err) {
            logger(err)
        }
    }

export const getUserConnection = async (req, res) => {
    try {
        const result = await logs.findOne({ user_id: req }).sort({ created_at: -1 }).select('socket_id')
        if (result) {
            return result.socket_id 

        } else {
           console.log("there is no connection")
        }
    } catch (err) {
        logger(err)
      console.log(err)
    }
}