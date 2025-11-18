const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middleware/validationMiddleware');
const authenticateToken = require('../middleware/userMiddleware');
const { registerShema, loginShema } = require('../schemas/authSchema');

router.get('/users', authenticateToken ,userController.getUsers);
router.post('/register', validate(registerShema) ,userController.register);
router.post('/login', validate(loginShema) ,userController.login);

module.exports = router;