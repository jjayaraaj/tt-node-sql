const Operator = require("./../models/operator");

module.exports = async (req, res, next) => {
  console.log("middle", req.operatorId);
  next();
};
