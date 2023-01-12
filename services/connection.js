import connection from './connectionModel.js'
import debug from "debug"
const logger = debug('namespace')
/**
 *  Get all connections 
 * @route /connection
 * @method Get 
 *
 */
export const getConnection = async (req, res) => {
    try {
        const result = await connection.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })

        } else {
            res.status(200).json({
                message: "success",
                data: "there are no connections"
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data ",
        })
    }
}


export default getConnection