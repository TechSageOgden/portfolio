const appRoot = require("app-root-path");
const winston = require("winston");
const dotenv = require("dotenv");
dotenv.config();


// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: "verbose",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 25,
    colorize: false,
  },
  errFile: {
    level: "warn",
    filename: `${appRoot}/logs/err.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 25,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.errFile),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  // eslint-disable-next-line no-unused-vars
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.verbose(message);
  },
};

module.exports = { logger };
