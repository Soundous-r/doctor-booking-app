const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require('../controllers/adminCtrl');
const router = express.Router();

//get all users
router.get('/getAllUsers',authMiddleware,getAllUsersController);
//get all doctors
router.get('/getAllDoctors',authMiddleware,getAllDoctorsController);


//Post accounst status
router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController);


module.exports = router;