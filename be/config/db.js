const mongoose = require("mongoose");
const config = require("config");
// const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin2020@connekt-g1xxz.mongodb.net/test?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true

        });
        console.log("MongoDB connected...");
    } catch (err) {
        console.error(err.message);
        // Exit process
        process.exit(1);
    }
};

module.exports = connectDB;