var appRoot = require('app-root-path');
var winston = require('winston');
let moment = require('moment');

var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/server.log`,
        handleExceptions: true,
        json: true,
        maxsize: 1024 * 1024 * 512, // 512MB
        maxFiles: 5,
        colorize: false,
    },
    errorFile: {
        level: 'error',
        name: 'file.error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        json: true,
        maxsize: 1024 * 1024 * 128, // 128MB
        maxFiles: 100,
        colorize: true,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: moment().format('YYYY-MM-DD HH:mm:ss')
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.File(options.errorFile),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});


// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        console.log(message);
        logger.info(message);
    },
};


module.exports = logger;