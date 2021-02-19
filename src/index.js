const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

let server;
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, config.mongoOptions).then((res) => {
  logger.info(`Connected to ${res.connections[0].name} Database`);
  server = app.listen(config.port, async () => {
    logger.info(
      `${config.serverName} server is running on port ${config.port}`
    );
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info(`${config.serverName} is closed`);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM recieved");
  if (server) {
    server.close;
  }
});
