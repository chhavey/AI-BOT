const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const cookie = require("cookie")

//models
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password length should be atleast 6 characters long']
    },
    customerId: {
        type: String,
        default: "",
    },
    subscription: {
        type: String,
        default: ""
    },
});

//hashed password
userSchema.pre("save", async function (next) {  //pre mltb save hone se pehle btana hai //next middle ware ki tarah kaam krega next jab call hoga tabhi humara schema save hoga
    //update pass kiya ho toh
    if (!this.isModified("password")) {
        next();
    }
    //hash password ke liye
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // hash( password recieve krwaya, salt kra uss pass ko)
    next();
});

//match password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
} //normal func use krenege kyuki arrow function support nhi krta

//SIGN TOKEN //cookie ki madad se token generate kiya hai
userSchema.methods.getSignedToken = function (res) {
    const accessToken = JWT.sign({ id: this._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIREIN });
    const refreshToken = JWT.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: process.env.JWT_REFRESH_EXPIREIN });
    res.cookie("refreshToken", `${refreshToken}`, { maxAge: 86400 * 7000, httpOnly: true, })
};

const User = mongoose.model('User', userSchema);

module.exports = User;