const errorHandler = require("../middlewares/errorMiddleware");
const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

// JWT Token
exports.sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken(res);
    res.status(statusCode).json({
        success: true,
        token,
    });
};

//Register
exports.registerController = async (req, res, next) => {
    try {
        const { username, email, password } = req.body; //model jo bnaya tha usme se exoect krenge jab user register krega
        //existing user
        const existingEmail = await userModel.findOne({ email });
        if (existingEmail) {
            return next(new errorResponse("Email is already registered", 500));
        }
        const user = await userModel.create({ username, email, password });
        this.sendToken(user, 201, res);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

//Login 
exports.loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return next(new errorResponse("Please provide email or password"));
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new errorResponse("Invalid credentialds", 401));
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new errorResponse("Invalid credentials", 401));
        }
        //res
        this.sendToken(user, 200, res);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

//Logout
exports.logoutController = async (req, res) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
