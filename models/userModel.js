const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/jwtHelper');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'User',
    enum: ["User", "Admin"],
  },
  status: {
    type: String,
    required: true,
    default: 'Inactive',
    enum: ["Inactive", "Active"],
  },
  verifySignupToken: String,
  resetPasswordToken: String,
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  try {
    // Here first checking if the document is new by using a helper of mongoose.isNew, 
    // therefore, this.isNew is true if document is new else false, 
    // and we only want to hash the password if its a new document, 
    // else it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
    }
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (password) {
  try {
    console.log('Password: ', password);
    console.log(this.password);
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    console.log('Error in isValidPassword: ', error);
    throw error
  }
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = async function (user) {
  // Generating Token
  const resetToken = await generateToken(user)
  // const resetToken = crypto.randomBytes(20).toString("hex");
  // // Hashing and adding resetPasswordToken to userSchema
  // this.resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(resetToken)
  //   .digest("hex");
  // this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  this.resetPasswordToken = resetToken;
  return resetToken;
};

module.exports = {
  User: mongoose.model('user', userSchema),
};