const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); //routes path
const errorHandler = require("./middlewares/errorMiddleware");
import path from 'path';
import { fileURLToPath } from 'url';
//dotenv
dotenv.config();

//mongo connection
connectDB();

//esmodule fix
const __filename = fileURLToPath(import.meta.url);
cont __dirname = path.dirname(__filename);

//rest object 
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(errorHandler);
app.use(bodyParser.urlencoded({ extended: false })); //allows only key value pair parsing when set to true also allows parsing of data including gsupport for nested objects and arrays
app.use(express.static(path.join(__dirname, './client/build')));

const PORT = process.env.PORT || 8080;

//API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/openai", require("./routes/openaiRoutes"));

//starting for deploying 
app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//listen server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
});
