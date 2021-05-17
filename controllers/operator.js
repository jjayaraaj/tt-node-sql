const nodemailer = require("nodemailer");
const Operator = require("./../models/operator");
const asyncMiddleware = require("./../middleware/async");
const otpGenerator = require("otp-generator");
const OperatorOtp = require("./../models/operator-otp");
const operatorMiddle = require("./../middleware/operator");
const sequelize = require("../util/database");
const Joi = require('joi');
const bcrypt = require('bcrypt');


exports.register = [
  operatorMiddle,
  asyncMiddleware(async (req, res, next) => {
   
    const {error} =  registerValidationError(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const email = req.body.email;

    const operator = await Operator.findOne({
      where: {
        email: email,
      },
    });

    if (operator) return res.status(400).send("Email has already taken");

    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
      digits: true,
    });

    const salt = await bcrypt.genSalt(10);
    const saltPass = await bcrypt.hash(req.body.password, salt);

    console.log(saltPass)

    const operatorInsert = await Operator.create({
      username: req.body.username,
      password: saltPass,
      name: req.body.name,
      company: req.body.company,
      address: req.body.address,
      country: req.body.country,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
    });



    req.session.operatorId = operatorInsert.id;


    const operatorOtpRes = await operatorInsert.createOperatorOtp({
      otp: otp,
    });

    if (!operatorOtpRes)
      return res.status(500).send("OTP Error Please try again");

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      //host: 'mail.travitime.com',
      service: "gmail",
      port: 25,
      auth: {
        user: "jjayaraaj@gmail.com",
        pass: "Aishwaryad@21",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const message = {
      from: "noreply@travitime.com", // Sender address
      to: email, // List of recipients
      subject: "OTP for your travitime sign-in", // Subject line
      text: `Please enter the otp in${otp}`, // Plain text body
    };
    let sendMsg;
    transporter.sendMail(message, function (err, info) {
      if (err) {
        console.log("error", err);
        sendMsg = err;
        res.send(sendMsg);
      } else {
        sendMsg = info;
        res.send(sendMsg);
      }
    });
  }),
];

exports.activate = [
  asyncMiddleware(async (req, res, next) => {

    const {error} =  otpValidataionError(req.body);
  if(error){
      return res.status(400).send(error.details[0].message);
  }

    const otp = req.body.otp;

    await sequelize.transaction(async(transaction)=> {
      const operatorOtp =  await OperatorOtp.findOne({
        where: {
          id: 26,
          otp: otp
        }
      }, {transaction});


      if (!otp) return res.status(401).send("invalid session");

      const operatorDtls = await Operator.findOne({
        where: {
          id: operatorOtp.id  
        }
      }, {transaction});

      if(!operatorDtls) return res.status(401).send("invalid otp");

      operatorDtls.isActive = 1;

      operatorDtls.save();
   
   
       res.status(200).send("Your Account is activated");


  });

 
    
   
  }),
];

function otpValidataionError(message) { 
  
  const Schema = Joi.object({
    otp: Joi.string().required().min(5)
   });

   return Schema.validate(message);

}

function registerValidationError(message) {
  const Schema = Joi.object({
    username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

    password: Joi.string()                
                  .min(3)                 
                  .required(),

    name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
    company: Joi.string(),
    address: Joi.string(),
    country: Joi.string(),
    phone: Joi.number(),
    email: Joi.string().email().required(),
    website: Joi.string()
        //repeat_password: Joi.ref('password'),

  });

  return Schema.validate(message);
}
