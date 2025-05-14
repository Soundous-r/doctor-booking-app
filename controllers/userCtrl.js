const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');
//register callback

const registerController =async(req,res)=>{
    try{
const existingUser =await User.findOne({email:req.body.email});
if(existingUser){
    return res.status(200).send({success:false,message:'User already exists'});
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    console.log(newUser);
    res.status(201).send({success:true,message:'User registered successfully'});
    }
    catch(error){
        console.log(error);
        res.status(500).send({success:false,message:`Server error ${error.message}`});
    }
}


//login callback
const loginController =async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(200).send({success:false,message:'User not found'});
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        
        if(!isMatch){
            return res.status(200).send({success:false,message:'Invalid email or passsword'});
        }
        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.status(200).send({success:true,message:'Login successful',token});
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,message:`error in login ${error.message}`});
    }
}

const  authController = async (req, res) => {
    try {
      const user = await User.findById({ _id: req.body.userId });
      user.password = undefined; // remove password from user object
      if (!user) {
        return res.status(200).send({
          message: "user not found",
          success: false,
        });
      } else {
        res.status(200).send({
          success: true,
          data:user
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "auth error",
        success: false,
        error,
      });
    }
  };
//apply doctor callback
  const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });
    const notification= adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });
    await User.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Doctor",
    });
  }
};
 

//notification controller
const getAllNotificationController = async (req,res)=>{
  try {
    const user= await User.findOne({_id:req.body.userId});
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification= notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting notifications",
    });
  }
}


//delete all notification controller
const deleteAllNotificationController= async(req,res)=>{
  try {
    const user =await User.findOne({_id:req.body.userId});
    user.seenNotification = [];
    user.notification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While deleting notifications",
    });
    
  }
}
//get all doctors
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({Status: "approved"});
    res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting doctors",
    });
    
  }
}
module.exports = {loginController, registerController,authController,applyDoctorController, getAllNotificationController,deleteAllNotificationController,getAllDoctorsController}