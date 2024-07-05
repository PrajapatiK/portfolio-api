require('dotenv').config({ path: "apis/config/config.env" });
const app = require("./app");
const { AppEventBus } = require('./lib/appEvents/appEventsEmitter');
const appEventsConst = require('./lib/appEvents/appEventsConst');
require('./helpers/initMongoDB');

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

AppEventBus.on(appEventsConst.EVENT_DB_CONNECTED, (data) => {
  console.log('===============================');
  console.log(data);
  console.log('===============================');
  console.log('My API server starting...');
  console.log('================================');
  launchAppAPIServer();
});

let server;

function launchAppAPIServer() {
  server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
