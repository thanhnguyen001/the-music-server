const multer = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoDB = require('../../config/mongoDB');

const storage = new GridFsStorage({
    url: mongoDB.urlDb,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-megazord-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "avatars",
            filename: `${Date.now()}-megazord-${file.originalname}`
        };
    }
});

const upload = multer({ storage });
module.exports = upload;