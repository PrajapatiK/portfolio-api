const mongoose = require('mongoose');

const SeqSchema = new mongoose.Schema({
  seqName: String,
  nextSeq: { type: Number, default: 5000 }
});

module.exports = {
  Sequence: mongoose.model('sequence', SeqSchema),
};