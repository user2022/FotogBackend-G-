const express = require('express'); // NodeJS framework
const morgan = require('morgan'); // provides better debugging for API
const bodyParser = require('body-parser'); // Parse incoming requests
const mongoose = require('mongoose'); // library for working with mongoDB
const dotenv = require('dotenv').config(); // environment variables - keeps certain stuff safe such as mongodb password, secret keys etc.
const cors = require('cors'); // Enabling cors so API can be accessed from other web servers

const app = express(); // Initializing express server

// MongoDB connection
mongoose.connect(process.env.DB,
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false},
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to DB');
        }
});

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/photo'));
app.use('/api', require('./routes/comment'));
app.use('/api', require('./routes/account'));
app.use('/api', require('./routes/role'));
app.use('/api', require('./routes/forum'));
app.use('/api', require('./routes/admin'));

// Server
let port = process.env.PORT || 6000;

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Listening on port ' + port);
    }
});
