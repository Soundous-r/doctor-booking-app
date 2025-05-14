const doctorModel = require("../models/doctorModel");


const getDoctorController = async (req,res)=>{
    try {
        const doctor =await doctorModel.findOne({userId:req.body.userId});
        res.status(200).send({
            success:true,
            message:"Doctor details fetched successfully",
            data:doctor
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting doctor details",
            error:error.message
        })
        
    }
}


//update doctor profile
const updateProfileController=async (req,res)=>{
try {
    const doctor = await doctorModel.findOneAndUpdate({userId:req.body.userId},
        req.body,
        {new:true}
    );
    res.status(200).send({
        success:true,
        message:"Doctor profile updated successfully",
        data:doctor
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error in updating doctor profile",
        error:error.message
    })
    
}








}

//get doctor by id
const getDoctorByIdController = async (req,res)=>{
    try {
        const doctor = await doctorModel.findOne({_id:req.body.doctorId});
        res.status(200).send({
            success:true,
            message:"Doctor details fetched successfully",
            data:doctor
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting doctor by id",
            error:error.message
        })
        
    }
}
module.exports = {
    getDoctorController,
    updateProfileController,
    getDoctorByIdController
}