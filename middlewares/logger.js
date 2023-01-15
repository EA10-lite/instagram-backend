
const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
require("winston-daily-rotate-file");
require("winston-mongodb");

// Label
const CATEGORY = "winston custom format";

//DailyRotateFile func()
const fileRotateTransport = new transports.DailyRotateFile({
    filename: "logs/rotate-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
});

const logger = createLogger({
    level:'debug',
    format: combine(
        label({ label: CATEGORY }),
        timestamp({
          format: "MMM-DD-YYYY HH:mm:ss",
        }),
        prettyPrint()
    ),
    transports: [
        fileRotateTransport,
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/info.log', level: 'info' }),
        new transports.MongoDB({ db: 'mongodb://localhost/instagram', level: 'error' }),
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' })
    ],
    exitOnError: false
})

module.exports = logger;