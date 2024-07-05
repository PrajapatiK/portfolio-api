const fs = require('fs');
const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');

// const cookieParser = require("cookie-parser");
const errorMiddleware = require('./middleware/error');

const portfolioRoute = require('./routes/portfolioRoute');

const app = express();

var allowedOrigins = ['http://localhost:3000'];
let corsOpts
if (process.env.NODE_ENV === 'DEVELOPMENT' || (process.env.NODE_ENV === undefined)) {
  corsOpts = {
    origin: true,
    credentials: true,
  }
} else {
  corsOpts = {
    origin: function (origin, callback) {
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      }
      return callback(null, true);
    }
  }
}

app.use(express.json());
// app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOpts))
app.use(morgan('dev'))
// log all requests to reqAccessLogs.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'reqAccessLogs.log'), { flags: 'a' })
}))

app.use('/api/v1/portfolio', portfolioRoute);

if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, 'webs/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'webs/build/index.html'));
  });
}

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;