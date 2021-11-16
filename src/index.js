require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 100;
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const routes = require('./routes');
const mongoDB = require("./config/mongoDB");


const app = express();

const PORT = process.env.PORT || 1368;

// Parse JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Connect to FE
app.use(cors());
mongoDB.connect();

routes(app);

app.listen(PORT, () => console.log('Server is running in ', PORT));