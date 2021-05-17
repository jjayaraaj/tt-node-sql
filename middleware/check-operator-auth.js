const jwt = require('jsonwebtoken');
const Operator = require('./../models/operator');

module.exports = async(req, res, next) => {
  
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "travitime_sql");

        const userData = await Operator.findOne({
            where: {
                id: decodedToken.id
            }
        });
        req.operatorData = userData;
        //req.userData = { email: decodedToken.email, operatorId: decodedToken.id}

    next();
    }catch(error){
        res.status(401).send({message: "Auth failed!"});
    }
}