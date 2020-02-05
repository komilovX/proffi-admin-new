const Remainder = require('../models/remainder.model');
async function findOne() {
  const remainder = await Remainder.findOne({where: {id:1}, raw: true})
  console.log(remainder)
}
const result = findOne()
