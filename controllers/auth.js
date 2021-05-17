
const Joi = require('joi');
const _ = require('underscore');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//middleware
const asyncMiddleware = require("./../middleware/async");

//models
const Operator = require('./../models/operator');


exports.operatorLoginCtrl = [asyncMiddleware(async (req, res, next) => {

    //check Entered req body is valid
    const {error} =  operatorLoginValidateError(req.body);
    if(error)  return res.status(400).send(error.details[0].message);
    
    const received = _.pick(req.body, ["email", "password"]);
    console.log(received);
    let operator = await Operator.findOne({
        where: {
            email: received.email
        }
    });
    if(!operator) return res.status(400).send("Invalid Username");

    const validPassword = await bcrypt.compare(received.password, operator.password);
    if(!validPassword) return res.status(400).send("Invalid Password");

    const token = jwt.sign({ id: operator.id, email: operator.email}, "travitime_sql");
    const expiresIn =  '3600'
//    
    res.status(200).json({
        token: token,        
        id: operator.id,
        name: operator.name,
        username: operator.username,
        email: operator.email,
        company: operator.company,
        phone: operator.phone,
        address: operator.address,
        country: operator.country,
        provider: operator.provider,
        website: operator.website,
        isActive:operator.isActive,
        expiresIn: expiresIn
        
    });
        //res.send( _.pick(operator, ['email', 'password']));
    


})];

function operatorLoginValidateError(message) {

    let Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6)
    });

    return Schema.validate(message);
    
}