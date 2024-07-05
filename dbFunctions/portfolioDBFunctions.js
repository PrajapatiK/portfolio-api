const { Sequence } = require('../models/sequenceModel')

module.exports.getNextSeq = (seqName) => {
  let query = { seqName: seqName }
  let update = { $inc: { nextSeq: 1 } }
  let options = { new: true, upsert: true, setDefaultsOnInsert: true }
  return Sequence.findOneAndUpdate(query, update, options)
    .then((doc) => {
      return doc.nextSeq;
    })

};