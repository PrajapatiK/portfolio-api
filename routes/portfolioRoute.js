const express = require("express");
const router = express.Router();

const { getAllPortfolio,
  updateIntro, updateAbout, addUpdateExperience, removeExperience, addUpdateProject, removeProject, updateContact,
  login, signup, updateSocial, forgotPassword, resetPassword, changePassword,
  getAllUsers, getUser, updateUser, removeUser, verifySignup, resendVerificationLink,
} = require("../controllers/portfolioController");
const { verifyAccessToken } = require("../helpers/jwtHelper");

router.get("/getAllPortfolio", getAllPortfolio);

router.post("/updateIntro", verifyAccessToken, updateIntro);
router.post("/updateAbout", verifyAccessToken, updateAbout);
router.post("/addUpdateExperience", verifyAccessToken, addUpdateExperience);
router.post("/removeExperience", verifyAccessToken, removeExperience);
router.post("/addUpdateProject", verifyAccessToken, addUpdateProject);
router.post("/removeProject", verifyAccessToken, removeProject);
router.post("/updateContact", verifyAccessToken, updateContact);
router.post("/updateSocial", verifyAccessToken, updateSocial);
router.post("/changePassword", verifyAccessToken, changePassword);

router.post("/login", login);
router.post("/signup", signup);

router.get("/verifySignup/:verifySignupToken", verifySignup);
router.get("/resendVerificationLink", verifyAccessToken, resendVerificationLink);


router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:resetToken", resetPassword);

router.get("/getAllUsers", verifyAccessToken, getAllUsers);
router.get("/getUser/:username", verifyAccessToken, getUser);
router.post("/updateUser", verifyAccessToken, updateUser);
router.post("/removeUser/:username", verifyAccessToken, removeUser);



module.exports = router;