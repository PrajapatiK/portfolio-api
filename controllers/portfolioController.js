const crypto = require('crypto');
const bcrypt = require('bcrypt');
// const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const jwtHelper = require('../helpers/jwtHelper');
/* const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
}); */

const { okRes, errorRes } = require("../util");
const asyncHandler = require("../middleware/asyncHandler");
const { User } = require("../models/userModel");
const { Intro, About, Project, Contact, Experience, Social } = require("../models/portfolioModel");
// const util = require('../util');
const constants = require('../common/constants');
const DBFunction = require('../dbFunctions/portfolioDBFunctions');
const { request } = require('express');
const { registrationTemplate } = require('../view');

// Get All getAllPortfolio
exports.getAllPortfolio = asyncHandler(async (req, res, next) => {
  try {
    const { username } = req.query;
    console.log('username: ', username);
    const user = await User.findOne({ username });
    let portfolioData = null;
    if (user) {
      const { userId } = user;
      const intro = await Intro.findOne({ userId: userId });
      const about = await About.findOne({ userId: userId });
      const project = await Project.findOne({ userId: userId });
      const experience = await Experience.findOne({ userId: userId });
      const contact = await Contact.findOne({ userId: userId }).select('-_id -userId -__v');
      const social = await Social.findOne({ userId: userId }).select('-_id -userId -__v');
      console.log(intro, about, project, contact, experience);
      if (intro) portfolioData = { ...portfolioData, intro };
      if (about) portfolioData = { ...portfolioData, about };
      if (contact) portfolioData = { ...portfolioData, contact };
      if (social) portfolioData = { ...portfolioData, social };
      if (project) portfolioData = { ...portfolioData, projects: project.projects };
      if (experience) portfolioData = { ...portfolioData, experiences: experience.experiences };
    }
    console.log('portfolioData: ', portfolioData);
    res.status(200).json(okRes(portfolioData));
  } catch (err) {
    console.log('getAllPortfolio Error: ', err);
    const errMessage = err.meesage || 'Get portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.updateIntro = asyncHandler(async (req, res, next) => {
  console.log('updateIntro called');
  try {
    const { userId } = req.body;
    console.log('req.body: ');
    console.log(req.body, req.user);
    const intro = await Intro.findOneAndUpdate({ userId: userId }, req.body, { new: true, upsert: true });
    console.log('intro: ');
    console.log(intro);
    res.status(200).json(okRes({ data: intro, message: 'Intro updated successfully.' }));
  } catch (err) {
    const errMessage = err.meesage || 'Update portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.updateAbout = asyncHandler(async (req, res, next) => {
  console.log('updateAbout called');
  try {
    const { userId } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    const about = await About.findOneAndUpdate({ userId: userId }, req.body, { new: true, upsert: true });
    console.log('about: ');
    console.log(about);
    res.status(200).json(okRes({ data: about, message: 'About updated successfully.' }));
  } catch (err) {
    const errMessage = err.meesage || 'Update portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.addUpdateExperience = asyncHandler(async (req, res, next) => {
  console.log('addUpdateExperience called');
  try {
    const { userId } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    let experience;
    const experienceRecord = await Experience.findOne({ userId: userId });
    console.log('experienceRecord: ');
    console.log(experienceRecord);
    if (experienceRecord) {
      const experienceRecordIndex = experienceRecord.experiences.findIndex(experience => experience.period === req.body.period);
      console.log('experienceRecordIndex: ');
      console.log(experienceRecordIndex);
      if (experienceRecordIndex === -1) experience = await Experience.findOneAndUpdate({ userId: userId }, { $push: { experiences: req.body } }, { new: true });
      else {
        experienceRecord.experiences[experienceRecordIndex] = req.body;
        experience = await Experience.updateOne({ userId: userId }, { experiences: experienceRecord.experiences }, { new: true });
      }
    } else {
      experience = new Experience({ userId: req.body.userId, experiences: [req.body] });
      await experience.save();
    }
    // const experience = await Experience.findOneAndUpdate({ userId: userId }, req.body, { new: true });
    console.log('experience: ');
    console.log(experience);
    res.status(200).json(okRes({ data: experience, message: 'Experience updated successfully.' }));
  } catch (err) {
    console.log(err);
    const errMessage = err.meesage || 'Update portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.removeExperience = asyncHandler(async (req, res, next) => {
  console.log('deleteExperience called');
  try {
    const { userId } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    let experience;
    const experienceRecord = await Experience.findOne({ userId: userId });
    console.log('experienceRecord: ');
    console.log(experienceRecord);
    if (experienceRecord) {
      experience = await Experience.updateOne({ userId: userId }, { $pull: { experiences: { period: req.body.period } } });
    }
    console.log('experience: ');
    console.log(experience);
    res.status(200).json(okRes({ data: experience, message: 'Experience removed successfully.' }));
  } catch (err) {
    const errMessage = err.meesage || 'Remove portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.addUpdateProject = asyncHandler(async (req, res, next) => {
  console.log('addUpdateProject called');
  try {
    const { userId } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    let project;
    const projectRecord = await Project.findOne({ userId: userId });
    console.log('projectRecord: ');
    console.log(projectRecord);
    if (projectRecord) {
      const projectRecordIndex = projectRecord.projects.findIndex(project => project.title === req.body.title);
      console.log('projectRecordIndex: ');
      console.log(projectRecordIndex);
      if (projectRecordIndex === -1) project = await Project.findOneAndUpdate({ userId: userId }, { $push: { projects: req.body } }, { new: true });
      else {
        projectRecord.projects[projectRecordIndex] = req.body;
        project = await Project.updateOne({ userId: userId }, { projects: projectRecord.projects }, { new: true });
      }
    } else {
      project = new Project({ userId: req.body.userId, projects: [req.body] });
      await project.save();
    }

    console.log('project: ');
    console.log(project);
    res.status(200).json(okRes({ data: project, message: 'Project updated successfully.' }));
  } catch (err) {
    console.log(err);
    const errMessage = err.meesage || 'Update portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.removeProject = asyncHandler(async (req, res, next) => {
  console.log('removeProject called');
  try {
    const { userId } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    let project;
    const projectRecord = await Project.findOne({ userId: userId });
    console.log('projectRecord: ');
    console.log(projectRecord);
    if (projectRecord) {
      project = await Project.updateOne({ userId: userId }, { $pull: { projects: { title: req.body.title } } });
    }
    console.log('project: ');
    console.log(project);
    res.status(200).json(okRes({ data: project, message: 'Project removed successfully.' }));
  } catch (err) {
    const errMessage = err.meesage || 'Remove portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.updateContact = asyncHandler(async (req, res, next) => {
  console.log('updateContact called');
  try {
    const { userId } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    const contact = await Contact.findOneAndUpdate({ userId: userId }, req.body, { new: true, upsert: true });
    console.log('contact: ');
    console.log(contact);
    res.status(200).json(okRes({ data: contact, message: 'Contact updated successfully.' }));
  } catch (err) {
    const errMessage = err.meesage || 'Update portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.updateSocial = asyncHandler(async (req, res, next) => {
  console.log('updateSocial called');
  try {
    const { userId } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    const social = await Social.findOneAndUpdate({ userId: userId }, req.body, { new: true, upsert: true });
    console.log('social: ');
    console.log(social);
    res.status(200).json(okRes({ data: social, message: 'Social updated successfully.' }));
  } catch (err) {
    const errMessage = err.meesage || 'Update portfolio data failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  console.log('login called');
  try {
    const { username, password } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    const message = [];
    if (!username) message.push('Username can\'t be empty');
    if (!password) message.push('Password can\'t be empty');
    if (!username || !password) throw new Error(message.join(' and '));

    const user = await User.findOne({ username }).select('-_id');
    console.log('user: ');
    console.log(user);
    if (!user) throw new Error('Invalid username or password');
    console.log(user.isValidPassword);
    const isMatch = await user.isValidPassword(password);
    console.log('isMatch: ', isMatch);
    if (!isMatch) throw new Error('Invalid Username or Password.');
    const accessToken = await jwtHelper.signAccessToken(user)
    console.log('accessToken: ', accessToken);
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
    })
    res.status(200).json(okRes({ data: { userId: user.userId, username: user.username, email: user.email, role: user.role, status: user.status }, message: 'User loggedIn successfully.' }));
  } catch (err) {
    console.log('Login Error: ');
    console.log(err);
    console.log('err.message: ', err.message);
    const errMessage = err.message || 'Login failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.signup = asyncHandler(async (req, res, next) => {
  console.log('signup called');
  try {
    const { username, email, password, confirmPassword } = req.body;
    console.log('req.body: ');
    console.log(req.body);
    const message = [];
    if (!username) message.push('Username can\'t be empty');
    if (!email) message.push('Email can\'t be empty');
    if (!password) message.push('Password can\'t be empty');
    if (!confirmPassword) message.push('Confirm Password can\'t be empty');
    if (!username || !email || !password || !confirmPassword) throw new Error(message.join(', '));
    if (email === process.env.APP_EMAIL) req.body.role = 'Admin';
    let user = await User.findOne({ username });
    console.log('user with username: ');
    console.log(user);
    if (user) throw new Error('User already registered with username');
    user = await User.findOne({ email });
    console.log('user with email: ');
    console.log(user);
    if (user) throw new Error('User already registered with email');
    if (password !== confirmPassword) throw new Error('Password and Confirm Password didn\'t match');
    const userId = await this.generateNewUserId({})
    console.log('userID: ', userId);
    const signupToken = crypto.randomBytes(20).toString("hex");
    // Hashing and adding resetPasswordToken to userSchema
    const verifySignupToken = crypto.createHash("sha256").update(signupToken).digest("hex");
    console.log('verifySignupToken: ', verifySignupToken);
    user = new User({ ...req.body, userId, verifySignupToken });
    const signupUserData = await user.save();
    console.log('signupUserData: ', signupUserData);
    sendMailUsingNodeMailer({
      to: email, text: 'Thanks for connecting to My Portfolio App.', subject: 'Portfolio App Registration', html: registrationTemplate({ username: signupUserData.username, url: `${process.env.WEBAPP_BASEURL}/verify/${signupUserData.verifySignupToken}` }),
    });
    res.status(200).json(okRes({ data: user, message: 'User signedup successfully.' }));
  } catch (err) {
    console.log('Signup Error: ');
    console.log(err);
    console.log('Signup Error Message: ');
    console.log(err.message);
    const errMessage = err.message || 'Signup failed';
    res.status(400).json(errorRes(err, errMessage));
  }
});

exports.verifySignup = asyncHandler(async (req, res, next) => {
  console.log('verifySignup called');
  try {
    const { verifySignupToken } = req.params;
    console.log('req.params: ');
    console.log(req.params);
    if (!verifySignupToken) throw new Error('Valid signup token is required');
    const user = await User.findOne({ verifySignupToken });
    if (!user) throw new Error('Not a valid user or already verified');
    const updatedUser = await User.findOneAndUpdate({ verifySignupToken }, { verifySignupToken: null, status: 'Active' }, { new: true });
    res.status(200).json(okRes({ data: updatedUser, message: `Signup verified successfully.` }));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    const errMessage = err.message || 'Signup verification failed.';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.resendVerificationLink = asyncHandler(async (req, res, next) => {
  console.log('resendVerificationLink called');
  try {
    const { loggedInUserID } = req.user;
    console.log('req.user: ');
    console.log(req.user);
    if (!loggedInUserID) throw new Error('Not a valid loggedin user');
    const user = await User.findOne({ userId: loggedInUserID });
    if (!user) throw new Error('Not a valid user requested');
    await sendMailUsingNodeMailer({
      to: user.email, text: 'Resend verification link.', subject: 'Portfolio App Registration', html: registrationTemplate({ username: user.username, url: `${process.env.WEBAPP_BASEURL}/verify/${user.verifySignupToken}` }),
    });
    // const updatedUser = await User.findOneAndUpdate({ userId: loggedInUserID }, { verifySignupToken: null, status: 'Active' }, { new: true });
    // console.log('updatedUser', updatedUser);
    res.status(200).json(okRes({ /* data: { userId: updatedUser.userId, username: updatedUser.username, email: updatedUser.email, role: updatedUser.role, status: updatedUser.status }, */ message: `Verification link sent successfully.` }));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    const errMessage = err.message || 'Signup verification failed.';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  console.log('forgotPassword called');
  try {
    const { email } = req.body;
    const message = [];
    if (!email) throw new Error('Email can\'t be empty');
    console.log('req.body: ');
    console.log(req.body);
    const user = await User.findOne({ email });
    console.log('user: ');
    console.log(user);
    if (!user) throw new Error('No user account associated with this email address. Please check the email or try again.');
    // Get ResetPassword Token
    const resetToken = await user.getResetPasswordToken(user);
    const userData = await user.save({ validateBeforeSave: false });
    console.log('userData: ');
    console.log(userData);
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/resetPassword/${resetToken}`;
    const resetPasswordUrl = `${process.env.WEBAPP_BASEURL}/resetPassword/${resetToken}`
    const mailMessage = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    sendMailUsingNodeMailer({ to: email, text: mailMessage, subject: 'Portfolio App Password Recovery' });

    res.status(200).json(okRes({ data: user, message: `Email sent to [${user.email}] successfully` }));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    const errMessage = err.message || 'Reset password portfolio app failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  console.log('resetPassword called');
  try {
    const { resetToken } = req.params;
    const { password, confirmPassword } = req.body;
    // const resetPasswordToken = crypto
    // .createHash("sha256")
    // .update(req.params.token)
    // .digest("hex");
    const message = [];
    if (!password) message.push('Password can\'t be empty');
    if (!confirmPassword) message.push('Confirm Password can\'t be empty');
    if (!password || !confirmPassword) throw new Error(message.join(' and '));
    const user = await User.findOne({ resetPasswordToken: resetToken });
    console.log('User with token: ');
    console.log(user);
    if (!user) {
      throw new Error('Reset Password Token is invalid.');
    }

    const payload = await jwtHelper.verifyToken(resetToken, user.password);

    console.log('Verify payload: ');
    console.log(payload);

    if (password !== confirmPassword) {
      throw new Error('Password and Confirm Password didn\'t match');
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user.password = hashedPassword;
    user.resetPasswordToken = null;

    const userData = await user.save();
    console.log('userData: ');
    console.log(userData);

    /* const accessToken = await jwtHelper.signAccessToken(user)
    console.log('accessToken: ', accessToken);
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
    }) */
    res.status(200).json(okRes({ data: user, message: 'Password reset successfully.' }));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    console.log(err.status);
    console.log(err.message);
    let errMessage = err.message || 'Reset password portfolio app failed';
    if (err.status === 401) errMessage = 'Reset password token has been expired';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  console.log('changePassword called');
  try {
    const { oldPassword, password, confirmPassword } = req.body;
    const message = [];
    if (!oldPassword) message.push('Old password can\'t be empty');
    if (!password) message.push('New password can\'t be empty');
    if (!confirmPassword) message.push('Confirm new password can\'t be empty');
    if (!oldPassword || !password || !confirmPassword) throw new Error(message.join('|'));
    console.log('req.body: ');
    console.log(req.body);
    const user = await User.findOne({ userId: req.user.loggedInUserID });
    console.log('user: ');
    console.log(user);
    if (!user) throw new Error('Invalid user.');

    const isMatch = await user.isValidPassword(oldPassword);
    console.log('isMatch: ', isMatch);
    if (!isMatch) throw new Error('Invalid old password.');

    if (req.body.password !== req.body.confirmPassword) {
      throw new Error('Password and Confirm Password didn\'t match');
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = await User.findOneAndUpdate({ userId: req.user.loggedInUserID }, { password: hashedPassword }, { new: true });

    res.status(200).json(okRes({ data: user, message: `Password change successfully` }));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    const errMessage = err.message || 'Reset password portfolio app failed';
    res.status(400).json(errorRes({}, errMessage));
  }
});

exports.getAllUsers = async (req, res) => {
  console.log('getAllUsers called');
  try {
    const users = await User.find({ role: { $ne: 'Admin' } });
    console.log(users);
    res.status(200).json(okRes({ data: users }));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    const errMessage = err.message || 'Get users failed';
    res.status(400).json(errorRes({}, errMessage));
  }
};

exports.getUser = async (req, res) => {
  console.log('getUser called', req.params);
  try {
    const user = await User.findOne({ username: req.params.username });
    console.log(user);
    res.status(200).json(okRes(user));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    const errMessage = err.message || 'Get users failed';
    res.status(400).json(errorRes({}, errMessage));
  }
};

exports.updateUser = async (req, res) => {
  console.log('updateUser called', req.body);
  try {
    let user = await User.findOne({ userId: req.body.userId });
    console.log('User found with userId: ', user);
    if (!user) throw new Error('User not found.');
    if (user.email !== req.body.email) {
      user = await User.findOne({ email: req.body.email });
      console.log('User found with email: ', user);
      if (user) throw new Error('User email already registered.');
    }
    const updatedUser = await User.findOneAndUpdate({ userId: req.body.userId }, { ...req.body }, { new: true });
    console.log('updatedUser: ', updatedUser);
    res.status(200).json(okRes(updatedUser));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    const errMessage = err.message || 'Get users failed';
    res.status(400).json(errorRes({}, errMessage));
  }
};

exports.removeUser = async (req, res) => {
  console.log('removeUser called', req.params);
  try {
    const user = await User.findOne({ username: req.params.username });
    console.log(user);
    if (!user) throw new Error('User not found.');
    const updatedUser = await User.deleteOne({ username: req.params.username });
    res.status(200).json(okRes(updatedUser));
  } catch (err) {
    console.log('Error: ');
    console.log(err);
    const errMessage = err.message || 'Get users failed';
    res.status(400).json(errorRes({}, errMessage));
  }
};

exports.generateNewUserId = async (req, res) => {
  let FuncName = 'generateNewUserId'
  console.log(FuncName, ' >>> Started ...')
  let newIdSeq = await DBFunction.getNextSeq(constants.SeqNames.USERID_SEQ)
  newUserId = `${constants.USERID_PREFIX}${constants.USERID_START_NUMBER + newIdSeq}`
  return newUserId
}

/* const extractAuthUserParam = (req) => {
  console.log('extractAuthUserParam started');
  let selectFields = ['userId', 'email', 'username', 'password', 'name', 'dob', 'accessToken', 'newUser']
  let fieldValues = {}
  fieldValues = Object.assign({}, util.getFieldsfromDataIfPresent(selectFields, req.body))
  console.log(fieldValues);
  return fieldValues;
} */

const sendMailUsingNodeMailer = async (user) => {
  sendMail(user).then(result => console.log('Mail sent successfully.', result)).catch(err => console.log(err));
};

async function sendMail(user) {
  try {
    // const { GOOGLE_CLOUD_CLIENT_ID, GOOGLE_CLOUD_CLIENT_SECRET, GOOGLE_CLOUD_REDIRECT_URI, GOOGLE_CLOUD_REFRESH_TOKEN, } = process.env

    // console.log(GOOGLE_CLOUD_CLIENT_ID, GOOGLE_CLOUD_CLIENT_SECRET, GOOGLE_CLOUD_REDIRECT_URI, GOOGLE_CLOUD_REFRESH_TOKEN);

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL, // Your Gmail address
        pass: process.env.APP_PASSWORD // Your Gmail password or application-specific password
      }
    })

    const mailOptions = {
      from: 'Portfolio App 📧<portfolioapp18@gmail.com>',
      to: user.to,
      subject: user.subject,
      text: user.text,
      html: user.html,
    }

    const result = await transport.sendMail(mailOptions)
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}