const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Avatar = new Schema({
    name: { type: String },
    user: { type: Schema.Types.ObjectId,  ref: "users"},
    img: {
        data: Buffer,
        contentType: String
    }
})
module.exports = mongoose.model("avatars", Avatar);