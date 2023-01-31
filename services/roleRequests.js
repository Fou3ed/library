import role from '../models/roleModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'
import logs from '../models/logs/logsMethods.js'
const log = new logs()
const element =8
const logger = debug('namespace')


/**
 *  GetRoles :get all roles data
 * @route /role
 * @method Get 
 */
export const getRoles = async (req, res) => {
    try {
        const result = await role.find();
        if (result.length > 0) {
            res.json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such roles yet "
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
 * getRole : get role data
 * @route /role/:id
 * @method Get
 */
export const getRole = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such role(wrong id) '
        })
    } else {
        try {
            const result = await role.findById(id);
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
 * createRole: create role
 * @route /role
 * @method post
 * @body  name,role_type,permissions
 */
export const postRole = async (req, res) => {
    const data = {
        name: req.body.name,
        role_type: req.body.role_type,
        permissions: req.body.permissions

    }
    const check = Joi.object({
        name: Joi.string().required(),
        role_type: Joi.string().required(),
        permissions: Joi.array().required,
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
            const result = await role.create(req.body);
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "Create new role  ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                res.status(201).json({
                    message: "success",
                    date: result
                })
            } else {
                res.status(400).json({
                    "error": 'failed to create new role'
                })
            }
        } catch (err) {
            res.status(400).json({
                'error': 'some error occurred.Try again'
            })
            logger(err)
            console.log(err)
        }
    }
}
/**
 * updateRole : update role data
 * @route /role/:id
 * @method put
 */
export const putRole = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such role (wrong id)'
        })
    } else {
        const data = {
            name: req.body.name,
            role_type: req.body.role_type,
            permissions: req.body.permissions

        }
        const check = Joi.object({
            name: Joi.string().required(),
            role_type: Joi.string().required(),
            permissions: Joi.array().required,
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
                const result = await role.findByIdAndUpdate(
                    id, {
                        $set: req.body
                    })
                if (result) {
                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id":"req.body.socket_id",
                        "action": "update role",
                        "element": element,
                        "element_id": "1",
                        "ip_address": "192.168.1.1"
                    }
                    log.addLog(dataLog)
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
 * deleteRole : delete role
 * @route /role/:id
 * @method delete
 */
export const deleteRole = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such role(wrong id) '
        })
    } else {
        try {
            const result = await role.findByIdAndDelete(id)
            if (result) {
                res.status(202).json({
                    message: "success",
                })
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id":"req.body.socket_id",
                    "action": "Delete role",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
            } else {
                res.status(400).send({
                    'error': 'there is no such role'
                })
            }
        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again '
            })
        }
    }
}