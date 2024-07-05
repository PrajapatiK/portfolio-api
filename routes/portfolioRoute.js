const express = require("express");
const router = express.Router();

const { getAllPortfolio, updateIntro, updateAbout, addUpdateExperience, removeExperience, addUpdateProject, removeProject, updateContact, login, signup, updateSocial, callback } = require("../controllers/portfolioController");

console.log('Route called');

router.get("/getAllPortfolio", getAllPortfolio);

router.post("/updateIntro", updateIntro);
router.post("/updateAbout", updateAbout);
router.post("/addUpdateExperience", addUpdateExperience);
router.post("/removeExperience", removeExperience);
router.post("/addUpdateProject", addUpdateProject);
router.post("/removeProject", removeProject);
router.post("/updateContact", updateContact);
router.post("/updateSocial", updateSocial);

router.post("/login", login);
router.post("/signup", signup);



module.exports = router;