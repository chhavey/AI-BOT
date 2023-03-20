const express = require("express");
const { registerController, loginController, logoutController } = require("../controllers/authController");

//router object creation to perform routing
const router = express.Router()

//routes
router.get('/policy');
//register
router.post('/register', registerController);

//login
router.post('/login', loginController);

//logout
router.post('/logout', logoutController);

module.exports = router;