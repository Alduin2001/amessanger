const express = require("express");
const { insertCar, getUsers, Register, Login, Logout, UpdateProfile  } = require("../controllers/UserController.js");
const { sendMessage, getMessage } = require('../controllers/ChatController.js')
const { verifyToken } = require("../middleware/VerifyToken.js");
const { refreshToken } = require("../controllers/RefreshToken.js");

const router = express.Router();


router.get('/sendMessage', sendMessage);
router.get('/getMessage', getMessage);

router.get('/cars',insertCar);
router.get('/users', verifyToken, getUsers);
router.post('/register_user', Register);
router.post('/login_user', Login);
router.post('/update_profile',UpdateProfile);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
 
module.exports = router;