const mongoose = require("mongoose")
const colors = require("colors")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to MongoDB database ${mongoose.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`MongoDB database error ${error}`.bgRed.white)
    }
}

module.exports = connectDB