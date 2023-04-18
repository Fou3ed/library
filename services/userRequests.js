import user from '../models/user/userModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'

import logs from '../models/logs/logsMethods.js'
const log = new logs()
const element = 9
const logger = debug('namespace')


/**
 *  GetUsers :get users data
 * @route /users
 * @method Get 
 */
export const getUsers = async (req, res) => {
    try {
        const result = await user.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such user "
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
 * get users connected 
 */
export const getUserConnected = async (req, res) => {
    try {
        const result = await user.find({is_active:true});
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(204).json({
                message: "success",
                data: "there are no users connected"
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}
/**
 * get user by socket.id
 */
export const getUserBySocket = async (req, res) => {
    console.log("req ::: ", req)
    try {
        const result = await user.findOne({
            socket_id: req
        })
        return result
    } catch (err) {
        console.log(err, "error getting user by socket id ")
    }
}
/**
 *getUserName : get user by y name 
 @route /userName/:name
 *  */
export const getUserName = async (id, res) => {
    
    try {
        const result = await user.findById(id)
     return result.full_name
    } catch (err) {
        console.log(err)
        logger(err)
        res.status(400).end({
            message: "fail retrieving data"
        })
    }
}


/**
 * getUser : get user data
 * @route /user/:id
 * @method Get
 */
export const getUser = async (id, res) => {
    try {
        const result = await user.findById(id);
        return result
    } catch (err) {
        console.log(err)
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}

/**
 * createUser: create user
 * @route /user
 * @method post
 * @body  nickname,full_name,profile_url,access_token,role,is_active,is_online,locale,last_seen_at,metadata
 */
export const postUser = async (req, res) => {

    const data = {
        nickname: req.body.nickname,
        full_name: req.body.full_name,
        profile_url: req.body.profile_url,
        access_token: req.body.access_token,
        role: req.body.role,
        is_active: req.body.is_active,
        is_online: req.body.is_online,
        locale: req.body.locale,
        last_seen_at: req.body.last_seen_at,
        metadata: req.body.metadata,
    }
    const check = Joi.object({
        nickname: Joi.string().required().min(4).max(48),
        full_name: Joi.string().required().min(4).max(68),
        profile_url: Joi.string(),
        access_token: Joi.string().required(),
        role: Joi.string().required(),
        is_active: Joi.boolean().required(),
        is_online: Joi.boolean().required(),
        locale: Joi.string().required().min(2).max(3),
        last_seen_at: Joi.number().required().default(0),
        metadata: Joi.object(),
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

            const result = await user.create(req.body);
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Create user ",
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
                    "error": 'failed to create new user'
                })
            }
        } catch (err) {
            console.log("err", err)

            res.status(400).json({
                'error': 'some error occurred.try again'
            })
            logger(err)
        }
    }
}
/**
 * updateUser : update user data
 * @route /user/:id
 * @method put
 */
export const putUser = async (req, res) => {

    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        const data = {
            nickname: req.body.nickname,
            full_name: req.body.full_name,
            profile_url: req.body.profile_url,
            access_token: req.body.access_token,
            role: req.body.role,
            is_active: req.body.is_active,
            is_online: req.body.is_online,
            locale: req.body.locale,
            last_seen_at: req.body.last_seen_at,
            metadata: req.body.metadata,

        }
        const check = Joi.object({
            nickname: Joi.string().required().min(4).max(48),
            full_name: Joi.string().required().min(4).max(68),
            profile_url: Joi.string(),
            access_token: Joi.string().required(),
            role: Joi.string().required(),
            is_active: Joi.boolean().required(),
            is_online: Joi.boolean().required(),
            locale: Joi.string().required().min(2).max(3),
            last_seen_at: Joi.number().required().default(0),
            metadata: Joi.object(),
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
                const result = await user.findByIdAndUpdate(
                    id, {
                        $set: req.body
                    })
                if (result) {
                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id": "req.body.socket_id",
                        "action": "update user",
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
 * update socket _id 
 */
export const putUserSocket = async (id, socket_id, res) => {

    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        try {
            const result = await user.findByIdAndUpdate(
                id, {
                    $set: {
                        socket_id: socket_id
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": socket_id,
                    "action": "update user socket id ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
                return result
            } else {
                console.log("3 error")
            }
        } catch (err) {
            console.log(err)
            logger(err)
        }
    }
}


/**
 * update socket _id 
 */
export const putUserActivity = async (id, status) => {
    try {
        const result = await user.findOneAndUpdate({
                socket_id: id
            }, // find user by socket_id
            {
                $set: {
                    is_active: status
                }
            }, // update is_active field
            {
                new: true
            } // return the updated document
        );
        if (result) {

            let dataLog = {
                "app_id": "63ce8575037d76527a59a655",
                "user_id": "6390b2efdfb49a27e7e3c0b9",
                "socket_id": "123123",
                "action": `update user activity ${status} `,
                "element": element,
                "element_id": "1",
                "ip_address": "192.168.1.1"
            }
            log.addLog(dataLog)
            return result
        } else {
            console.log("  failed updating user activity ")
        }
    } catch (err) {
        console.log(err)
        logger(err)
    }
}


/**
 * getUserStatus : get user status
 * @route /users/status/:id
 * @method Get
 */
export const getUserStatus = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user(wrong id) '
        })
    } else {
        try {
            const result = await user.find({
                _id: req.params.id,
                status: req.query.status
            });
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
/**
 * getUsersOnline : get online users
 * @route /users/online/:id
 * @method Get
 */
export const getUsersOnline = async (req, res) => {
    try {
        const result = await user.find({
            is_online: true
        });
        res.status(200).json({
            message: "success",
            total: result.length,
            data: result
        })
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data"
        })
    }
}
/**
 * registerUser : log in a user
 * @route /user/login/:id
 * @method put
 */
export const registerUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        const data = {
            access_token: req.access_token,
        }
        const check = Joi.object({
            access_token: Joi.string().required(),
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
                const result = await user.findByIdAndUpdate(
                    id, {
                        $set: req.body
                    })
                if (result) {
                    res.status(202).json({
                        message: "success",
                        data: result
                    })

                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id": "req.body.socket_id",
                        "action": "register user ",
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
 * banUser : ban a user
 * @route /user/ban/:id
 * @method put
 */
export const banUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        try {
            const result = await user.findByIdAndUpdate(
                id, {
                    $set: {
                        access_token: null
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "ban user ",
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

/**
 * unBanUser : unBan a user
 * @route /user/unban/:id
 * @method put
 */
export const unBanUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        try {
            const result = await user.findByIdAndUpdate(
                id, {
                    $set: {
                        access_token: "token"
                    }
                })
            if (result) {
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "unBan user ",
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


/**
 * deleteUser : delete user
 * @route /user/:id
 * @method delete
 */
export const deleteUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user(wrong id) '
        })
    } else {
        try {
            const result = await user.findByIdAndDelete(id)
            if (result) {
                res.status(202).json({
                    message: "success",
                })
                let dataLog = {
                    "app_id": "63ce8575037d76527a59a655",
                    "user_id": "6390b2efdfb49a27e7e3c0b9",
                    "socket_id": "req.body.socket_id",
                    "action": "Delete user ",
                    "element": element,
                    "element_id": "1",
                    "ip_address": "192.168.1.1"
                }
                log.addLog(dataLog)
            } else {
                res.status(400).send({
                    'error': 'there is no such user'
                })
            }
        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again '
            })
        }
    }
}