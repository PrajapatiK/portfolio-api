// const { google } = require('googleapis');
const nodemailer = require('nodemailer');
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
    console.log(req.body);
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
    const user = await User.findOne({ username }).select('-_id');
    console.log('user: ');
    console.log(user);
    if (!user) throw new Error('Invalid username or password');
    console.log(user.isValidPassword);
    const isMatch = await user.isValidPassword(password);
    console.log('isMatch: ', isMatch);
    if (!isMatch) throw new Error('Invalid Username or Password.');
    // const accessToken = await jwtHelper.signAccessToken(user)
    // console.log('accessToken: ', accessToken);
    res.status(200).json(okRes({ data: user, message: 'User loggedIn successfully.' }));
  } catch (err) {
    console.log('Login Error: ');
    console.log(err);
    console.log('err.message: ', err.message);
    const errMessage = err.meesage || 'Login failed';
    res.status(400).json(errorRes({}, err.message));
  }
});

exports.signup = asyncHandler(async (req, res, next) => {
  console.log('signup called');
  try {
    const { username, email, password, confirmPassword } = req.body;
    console.log('req.body: ');
    console.log(req.body);
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
    user = new User({ ...req.body, userId });
    await user.save();
    sendMailUsingNodeMailer({ to: email, text: 'Thanks for connecting to My Portfolio App.' });
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
    const { GOOGLE_CLOUD_CLIENT_ID, GOOGLE_CLOUD_CLIENT_SECRET, GOOGLE_CLOUD_REDIRECT_URI, GOOGLE_CLOUD_REFRESH_TOKEN, } = process.env

    console.log(GOOGLE_CLOUD_CLIENT_ID, GOOGLE_CLOUD_CLIENT_SECRET, GOOGLE_CLOUD_REDIRECT_URI, GOOGLE_CLOUD_REFRESH_TOKEN);

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
      subject: 'Portfolio App',
      text: user.text,
      html: `<h3>${user.text}</h3>`,
    }

    const result = await transport.sendMail(mailOptions)
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}