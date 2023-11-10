import connection from '../models/connection/connectionModel.js'
import debug from "debug"
const logger = debug('namespace')
import logDb from '../models/logs/logsMethods.js'
const log = new logDb()


const element=2
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


export const postConnection = async (req,socket_id, res) => {
    try {
        const result = await connection.create(req)
        if (result) {
            const logDB = {
                app_id:req.app_id,
                user_id:req.user_id,
                socket_id:socket_id,
                action: "add connection",
                element: "1",
                element_id: "1",
                ip_address: "192.168.1.1"
            }

            log.addLog(logDB)
            return result
        } else {
            console.log("failed to add connection")
        }
    } catch (err) {
        console.log(err)
        logger(err)

    }
}


export default getConnection