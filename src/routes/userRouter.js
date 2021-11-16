const express = require("express");
// const mongoose = require("mongoose");
const router = express.Router();
const multer = require('multer');
const Avatar = require('../app/Models/Avatar');
// const { GridFsStorage } = require("multer-gridfs-storage");
// const mongoDB = require('../config/mongoDB');
// const Grid = require("gridfs-stream");
const fs = require("fs");
const path = require("path");
const { promisify } = require('util')

const UserController = require("../app/Controller/UserController");
const verifyToken = require("../app/middlewares/auth");

// const storage = new GridFsStorage({
//     url: mongoDB.urlDb,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         const match = ["image/png", "image/jpeg"];

//         if (match.indexOf(file.mimetype) === -1) {
//             const filename = `${Date.now()}-megazord-${file.originalname}`;
//             return filename;
//         }

//         return {
//             bucketName: "avatars",
//             filename: `${Date.now()}-megazord-${file.originalname}`
//         };
//     }
// });

// let gfs;
// const conn = mongoose.connection;
// conn.once("open", function () {
//     gfs = new Grid(conn.db, mongoose.mongo);
//     gfs.collection("avatars");
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});


const upload = multer({ storage: storage });


router.post("/update/avatar", verifyToken, upload.single("file"), UserController.updateAvatar);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/update/song", verifyToken, UserController.updateLiked);
router.patch("/update/playlist/:id", verifyToken, UserController.updatePlaylist);
router.patch("/update/playlist", verifyToken, UserController.updatePlaylist);

module.exports = router;