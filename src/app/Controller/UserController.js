const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const SECRET_JWT = process.env.SECRET_JWT;
const fs = require("fs");
const path = require("path");
const { promisify } = require('util')

const responseSuccess = async (res, user, accessToken) => {
    res.json({
        success: true,
        user: {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            playlist: user.playlist,
            liked: user.liked,
        },
        accessToken
    })
}
class UserController {

    // [POST] /api/user/post
    async register(req, res, next) {
        try {
            const { username, password, email } = req.body;

            const isExistUser = await User.findOne({ username });
            if (!isExistUser) {
                const isExistEmail = await User.findOne({ email });
                if (isExistEmail) {
                    res.json({ success: false, message: "Email already exists" });
                    return;
                }
            }
            else {
                res.json({ success: false, message: "Username already exists" });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                password: hashPassword,
                email,
                avatar: "",
                playlist: [],
                liked: []
            });

            const user = await newUser.save();
            const accessToken = await jwt.sign({ userId: user._id }, SECRET_JWT);

            return responseSuccess(res, user, accessToken);
        } catch (error) {
            res.status(404).json({ success: false, message: error.message })
        }
    }

    // [POST] /api/user/login
    async login(req, res, next) {
        try {
            const { loginName, password } = req.body;

            let user = null;
            if (loginName.includes("@")) {
                user = await User.findOne({ email: loginName });
                // console.log("email");
            }
            else {
                user = await User.findOne({ username: loginName });
                // console.log("username");
            }

            if (!user) return res.json({ success: false, message: "User does not exists" });

            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) return res.json({ success: false, message: "Username/Email or password is incorrect" });

            const accessToken = await jwt.sign({ userId: user._id }, SECRET_JWT);

            return responseSuccess(res, user, accessToken);

        } catch (error) {
            res.status(404).json({ success: false, message: error.message })
        }
    }

    // [PATCH] /api/user/update/avatar
    async updateAvatar(req, res, next) {
        const match = ["image/png", "image/jpeg"];

        try {
            if (req.file === undefined) return res.send("you must select a file.");
            // console.log(req.file)

            if (match.indexOf(req.file.mimetype) === -1) {
                return res.json({ success: false, message: "Please choose the png or jpeg file" });
            }
            const newAvatar = {
                data: fs.readFileSync(path.join(process.cwd() + '/src/images/' + req.file.filename)),
                contentType: req.file.mimetype,
            }
            // console.log(newAvatar)
            const unlinkAsync = promisify(fs.unlink)

            await unlinkAsync(req.file.path)

            const checkAndUpdate = await User.findByIdAndUpdate(req.userId, { avatar: newAvatar });
            if (!checkAndUpdate)
                return res.json({ success: false, message: "Incorrect token" });
            const user = await User.findById(req.userId);
            const accessToken = await jwt.sign({ userId: user._id }, SECRET_JWT);


            return responseSuccess(res, user, accessToken);

        } catch (error) {
            res.status(501).json({ success: false, message: error.message })
        }
    }
    // [PATCH] /api/user/update/playlist/:id
    async updatePlaylist(req, res, next) {
        try {
            const { id: encodeId } = req.params;
            const { title, action, items } = req.body;
            const user = await User.findById(req.userId);
            // console.log(req.body)
            if (user) {
                if (action === "ADD") {
                    const playlistId = await uniqid.process(`${title}-`);
                    const newPlaylist = { title, encodeId: playlistId, items: [], thumbnail: "", link: `/my-playlist/${playlistId}` }
                    user.playlist.unshift(newPlaylist);
                }
                else if (action === "DELETE") {
                    const deleteIndex = user.playlist.findIndex(ele => ele.encodeId === encodeId);
                    user.playlist.splice(deleteIndex, 1);
                } else if (action === "UPDATE") {
                    const updateIndex = user.playlist.findIndex(ele => ele.encodeId === encodeId);
                    const oldItem = user.playlist[updateIndex];
                    if (items) {
                        user.playlist.set(updateIndex, { ...oldItem, items: [...items] });
                    }
                    if (title) {
                        user.playlist.set(updateIndex, { ...oldItem, title });
                    }
                }
            }
            const resUser = await user.save();

            const accessToken = await jwt.sign({ userId: resUser._id }, SECRET_JWT);

            return responseSuccess(res, resUser, accessToken);

        } catch (error) {
            res.status(501).json({ success: false, message: error.message })
        }
    }
    // [POST] /api/user/update/song
    async updateLiked(req, res, next) {
        try {
            const { song, action, index } = req.body;
            const user = await User.findById(req.userId);
            if (action === "ADD") {
                user.liked.push(song);
            }
            else if (action === "DELETE") {
                if (index) user.liked.splice(index, 1);
                else {
                    const deleteIndex = user.liked.findIndex(item => item.encodeId === song.encodeId);
                    user.liked.splice(deleteIndex, 1);
                }
            }

            const resUser = await user.save();

            const accessToken = await jwt.sign({ userId: resUser._id }, SECRET_JWT);

            return responseSuccess(res, resUser, accessToken);

        } catch (error) {
            res.status(505).json({ success: false, message: error.message });
        }
    }

};

module.exports = new UserController;