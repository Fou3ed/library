import {
    createLogger,
    transports,
    format
} from "winston";
import  'winston-mongodb';
const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'info.log',
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.MongoDB({
            level: 'error',
            db:"mongodb+srv://fou3ed:HJz1hkPtuQdWaMnu@cluster0.tbocpnt.mongodb.net/messaging?retryWrites=true ",
            options: {
                useUnifiedTopology: true
            },
            collection: 'messaging',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

export default logger 