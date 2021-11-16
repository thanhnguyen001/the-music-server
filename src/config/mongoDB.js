const mongoose = require("mongoose");

const urlDb = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.h0o6c.mongodb.net/mern-music?retryWrites=true&w=majority`;
const connect = async () => {
    try {
        await mongoose.connect(
            urlDb,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = { connect, urlDb };