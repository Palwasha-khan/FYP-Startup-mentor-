import mongoose  from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
const userSchema = new mongoose.Schema({

  name: {
    type: String,
     required: [true,"Please enter your name"],
     maxLength:[50,"Your name must not ecxceed 50 characters"],
 
  },

  email: {
    type: String,
    required: [true,"Please enter your email"],
    unique: true
  },

  password: {
    type: String,
    required: [true,"Please enter your password"],
    minLength:[6,"Your password must be longer than 6 characters"],
    select:false,
   
  },
  avatar:{
    public_id:String,
    url: String,
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date,

}, { timestamps: true });
 
// Hash password before saving (only if modified)
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
      return ;
    }
    this.password = await bcrypt.hash(this.password, 10);
   
});


//Return JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

//compare user paswword
userSchema.methods.comparePassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}

//generate password reset token
userSchema.methods.getResetPasswordToken = function(){
  const resetToken = crypto.randomBytes(20).toString("hex")

  this.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  this.resetPasswordExpire = Date.now() + 30*60*1000;

  return resetToken;
}

export default mongoose.model("User", userSchema);
