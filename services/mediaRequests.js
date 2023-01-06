import media from '../models/mediaModel.js'
import {
    debug,
    Joi,
    validator
} from '../dependencies.js'

const logger = debug('namespace')


/**
 *  GetMedia :get media
 * @route /media
 * @method Get 
 */
export const getMedias = async (req, res) => {
    try {
        const result = await media.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no media yet"
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
 * getMedia : get media data By id
 * @route /media/:id
 * @method Get
 */
export const getMedia = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such conversation(wrong id) '
        })
    } else {
        try {
            const result = await media.findById(id);
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
 * createMedia: create media
 * @route /media
 * @method post
 * @body  content_type,name,size,public
 */
export const postMedia = async (req, res) => {
    const data = {
        content_type: req.body.content_type,
        name: req.body.name,
        size: req.body.size,
        public: req.body.public
    }
    const check = Joi.object({
        content_type: Joi.string().required(),
        name: Joi.string().required(),
        size: Joi.number().required(),
        public: Joi.boolean()

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
            const result = await media.create(req.body);
            if (result) {
                res.status(201).json({
                    message: "success",
                    date: result
                })
            } else {
                res.status(400).json({
                    "error": 'failed to create new media'
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
 * updateMedia : update media
 * @route /media/:id
 * @method put
 */
export const putMedia = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such media (wrong id)'
        })
    } else {
        const data = {
            content_type: req.body.content_type,
            name: req.body.name,
            size: req.body.size,
            public: req.body.public
        }
        const check = Joi.object({
            content_type: Joi.string().required(),
            name: Joi.string().required(),
            size: Joi.number().required(),
            public: Joi.boolean()

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
                const result = await media.findByIdAndUpdate(
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
 * deleteMedia: delete media
 * @route /media/:id
 * @method delete
 */
export const deleteMedia = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such media(wrong id) '
        })
    } else {
        try {
            const result = await media.findByIdAndDelete(id)
            if (result) {
                res.status(202).json({
                    message: "success",
                })
            } else {
                res.status(400).send({
                    'error': 'there is no such media'
                })
            }
        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again '
            })
        }
    }
}