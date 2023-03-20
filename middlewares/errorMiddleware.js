const errorResponse = require("../utils/errorResponse");

//middleware errorHandler
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    //mongoose cast error: error that occurs when you try to save or update a document in Mongoose
    // with a value that cannot be cast to the expected schema type.
    // eg: CastError: Cast to Number failed for value "abc" at path "age"
    if (err.name === 'castError') {
        const message = "Resource not found";
        error = new errorResponse(message, 404);
    }

    //duplicate key error: 
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new errorResponse(message, 400);
    }

    //mongoose validation
    //upar ki sari errors ki array pass krwa ke map krenge
    //fir errorResponse mei pass kwa ke message pr status code show krwayenge
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        error = new errorResponse(message, 400);
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error",
        });
    }
};

module.exports = errorHandler;