    /*********************************************************************  ELEMENT : 1 ****************************************************************************************************/


    import app from '../models/app/appModel.js'
    import {
        debug,
        Joi,
        validator
    } from '../dependencies.js'
    import logs from '../models/logs/logsMethods.js'
    const log = new logs()

    const logger = debug('namespace')

    const element = 1
    /**
     *  Get all apps 
     * @route /apps
     * @method Get 
     *
     */
    export const getApps = async (req, res) => {
        try {
            const result = await app.find();
            if (result.length > 0) {
                res.status(200).json({
                    message: "success",
                    data: result
                })

            } else {
                res.status(200).json({
                    message: "success",
                    data: "there are no apps"
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
     *  ADD NEW APP
     * @route /apps
     * @method post
     * @body  app_name: , api_token: ,  plan: , message_retention_hours:  ,  max_message_length: 
     */

    export const postApps = async (req, res) => {
        const data = {
            app_name: req.body.app_name,
            api_token: req.body.api_token,
            plan: req.body.plan
        }
        const check = Joi.object({
            app_name: Joi.string().required().min(4).max(256),
            api_token: Joi.string().required(),
            plan: Joi.string().required().min(4).max(256),
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
                const result = await app.create(req.body);
                if (result) {
                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id":"req.body.socket_id",
                        "action": "Create application ",
                        "element": element,
                        "element_id": "1",
                        "ip_address": "192.168.1.1"
                    }
                    log.addLog(dataLog)
                    res.status(201).json({
                        message: "success",
                        data: result
                    })
                } else {
                    res.status(400).json({
                        "error": 'failed to create new app. Try again'
                    })
                }
            } catch (err) {
                res.status(400).json({
                    "error": 'some error occurred.try again'
                })
                logger(err)

            }
        }
    }
    /**
     * GET APP BY id
     * @route /apps/:id/
     * @method get
     * 
     */
    export const getAppById = async (req, res) => {
        try {
            const res = await app.findById(req)
            if (res) {
                return res
            } else {
                return false
            }
        } catch (err) {
            logger(err)

        }
    }

    /**
     * UPDATE APP BY ID
     * @route /apps/:id/
     * @method put
     */
    export const putApp = async (req, res) => {
        const id = req.params.id
        if (!validator.isMongoId(id)) {
            res.status(400).send({
                'error': 'there is no such app(wrong id)'
            })
        } else {
            const data = {
                app_name: req.body.app_name,
                api_token: req.body.api_token,
                plan: req.body.plan,
                message_retention_hours: req.body.message_retention_hours,
                max_message_length: req.body.max_message_length,

            }
            const check = Joi.object({
                app_name: Joi.string().min(4).max(256),
                api_token: Joi.string().required(),
                plan: Joi.string().required(),
                message_retention_hours: Joi.number(),
                max_message_length: Joi.number()
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
                    const result = await app.findByIdAndUpdate(
                        id, {
                            $set: req.body
                        })
                    if (result) {
                        let dataLog = {
                            "app_id": "63ce8575037d76527a59a655",
                            "user_id": "6390b2efdfb49a27e7e3c0b9",
                            "socket_id":"req.body.socket_id",
                            "action": "Create application ",
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
     * DELETE APP
     *  @route /apps/:id/
     *  @method put
     */
    export const deleteAPP = async (req, res) => {
        const id = req.params.id
        if (!validator.isMongoId(id)) {
            res.status(400).send({
                'error': 'there is no such app(wrong id) '
            })
        } else {
            try {

                const result = await app.findByIdAndDelete(id)
                if (result) {
                    res.status(202).json({
                        message: "success",
                    })
                    let dataLog = {
                        "app_id": "63ce8575037d76527a59a655",
                        "user_id": "6390b2efdfb49a27e7e3c0b9",
                        "socket_id":"req.body.socket_id",
                        "action": "Create application ",
                        "element": element,
                        "element_id": "1",
                        "ip_address": "192.168.1.1"
                    }
                    log.addLog(dataLog)
                } else {
                    res.status(400).send({
                        'error': 'there is no such app'
                    })
                }
            } catch (err) {
                res.status(400).send({
                    'error': 'some error. Try again '
                })
            }
        }

    }