const mongoose = require('mongoose');
const appEventsEmitter = require('../lib/appEvents/appEventsEmitter');
const appEventsConst = require('../lib/appEvents/appEventsConst');

console.log(process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log('MongoDB connected.');
    appEventsEmitter.AppEventBus.sendEvent(appEventsConst.EVENT_DB_CONNECTED, 'My App connected with DB.');
  })
  .catch((err) => console.log(err.message));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.');
});

// For nodemon restarts
process.once('SIGUSR2', async () => {
  await mongoose.connection.close();
  console.log(`Kill: Process_ID${process.pid}.`);
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});