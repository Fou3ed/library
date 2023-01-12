import user from '../models/userModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'

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
 *getUserName : get user by y name 
 @route /userName/:name
 *  */
export const getUserName = async (req, res) => {
    const nickname = req.query.nickname
    try {
        const result = await user.findOne({
            nickname: nickname
        })
        res.status(200).json({
            message: "success",
            data: result
        })
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
export const getUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user(wrong id) '
        })
    } else {
        try {
            const result = await user.findById(id);
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
 * unBanUser : unBan a user
 * @route /user/unban/:id
 * @method put
 */
export const unbanUser = async (req, res) => {
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

