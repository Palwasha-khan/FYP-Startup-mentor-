import User from '../models/user.js';
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js"
import bcrypt from 'bcryptjs';
import ErrorHandler from "../utils/errorHandler.js"
import jwt from 'jsonwebtoken';
import {getResetPasswordTemplate} from "../utils/emailTemplates.js"
import sendToken from "../utils/sendToken.js"
import sendEmail from "../utils/sendEmail.js"
import crypto from 'crypto'
import { upload_file } from '../utils/cloudinary.js';


// Register a new user
export const registerUser = catchAsyncErrors(async(req, res,next) => {

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
   
    const { name, email, password } = req.body;
   // console.log("Request Body:", req.body);

    if (!name || !email || !password) {
        return next(new ErrorHandler('All fields are required',400))

    }
    if (!validateEmail(email)) {
        return next(new ErrorHandler('Enter a valid email',400))

    }

    const userExists = await User.findOne({ email });
    if (userExists) { return next(new ErrorHandler('User already exists',400))}

    const user = await User.create({name,email,password });
    sendToken(user,201,res) 
  })


// Login user
export const loginUser =catchAsyncErrors(async (req, res,next) => {
        const { email, password } = req.body;

        if (!email || !password) {return next(new ErrorHandler('please enter email and password',400))}

        const user = await User.findOne({ email }).select("+password");

        if (!user) {return next(new ErrorHandler('Invalid email or password',401))}

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
             return next(new ErrorHandler('Invalid email and password',400))
       }

         sendToken(user,201,res)
        })

//log out 
export const logoutUser =catchAsyncErrors(async (req, res,next) => {
    // If token is in cookie, clear it
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

//forgot password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => { 
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Email is required", 400));

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("User not found with this email", 404));

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save();

  // Reset password URL
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = getResetPasswordTemplate(user.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Startup Mentor Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password
export const resetPassword = catchAsyncErrors(async (req, res, next) => { 
 
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {$gt: Date.now()}
    })

    if (!user) return next(new ErrorHandler(
      "Password reset token is invalid or has been expired", 404));
 
    if(req.body.password !== req.body.confirmPassword){
      return next(new ErrorHandler(
      "Password does not match ", 404));
    }

    //set the new password
    user.password = req.body.password

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user,201,res)
})

// Get user profile  
export const getUserProfile =catchAsyncErrors( async (req, res,next) => {
     
        const user = await User.findById(req?.user?._id);
        if (!user)return next(new ErrorHandler("user not found ", 404));
    
        res.status(200).json({ success: true, user: user });
   
});

// Update user profile  
export const updateUserProfile = catchAsyncErrors(async (req, res) => {
     
        const newUserData = {
         name: req.body.name, 
         email: req.body.email}

        if(req.body.avatar) {
        const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");
        newUserData.avatar = avatarResponse;
    }


        const user = await User.findByIdAndUpdate(req.user._id,newUserData,{new:true});
     
        res.status(200).json({ user,});
    
});

//upload avatar  => api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async(req,res,next)=>{
     const avatarResponse = await upload_file(req.body.avatar, "startup-mentor/avatars")

     const user = await User.findByIdAndUpdate(req?.user?._id,{
        avatar: avatarResponse,
     })
     
    res.status(200).json({
        user,
    })
})


// Update Password  
export const updatePassword =catchAsyncErrors( async (req, res,next) => {
     
        const user = await User.findById(req?.user?._id).select("+password");

        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

        if (!isPasswordMatched) return next(new ErrorHandler("old Password is incorrect", 404));
    
        user.password = req.body.password;
        user.save();

        res.status(200).json({ success: true  });
   
});

