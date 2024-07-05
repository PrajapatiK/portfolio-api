const mongoose = require('mongoose');

const introSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  welcomeText: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
})

const aboutSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  description1: {
    type: String,
    required: true,
  },
  description2: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
    default: [],
  }
})

const experienceSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  experiences: [{
    title: String,
    period: String,
    company: String,
    description: String,
  }],
/*   title: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  dexcription: {
    type: String,
    required: true
  } */
})

const projectSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  projects: [{
    title: String,
    description: String,
    detailDescription: String,
    image: String,
    link: String,
    technologies: Array,
  }],
/*   title: {
    type: String,
    required: true,
  },
  dexcription: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  technologies: {
    type: Array,
    required: true,
  }, */
})

const contactSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
  },
});

const socialSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  fbURL: {
    type: String,
    required: true,
  },
  mailURL: {
    type: String,
    required: true,
  },
  instaURL: {
    type: String,
    required: true,
  },
  linkedInURL: {
    type: String,
    required: true
  },
  githubURL: {
    type: String,
    required: true
  }
})


module.exports = {
  Intro: mongoose.model('intro', introSchema),
  About: mongoose.model('about', aboutSchema),
  Experience: mongoose.model('experience', experienceSchema),
  Project: mongoose.model('project', projectSchema),
  Contact: mongoose.model('contact', contactSchema),
  Social: mongoose.model('social', socialSchema),
}