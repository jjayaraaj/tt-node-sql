const nodemailer = require("nodemailer");
const Operator = require("./../models/operator");
const asyncMiddleware = require("./../middleware/async");
const otpGenerator = require("otp-generator");
const OperatorOtp = require("./../models/operator-otp");
const operatorMiddle = require("./../middleware/operator");
const sequelize = require("../util/database");

exports.register = [
  operatorMiddle,
  asyncMiddleware(async (req, res, next) => {
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

    const operatorInsert = await Operator.create({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      company: req.body.company,
      address: req.body.address,
      country: req.body.country,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
    });

    req.session.operatorId = operatorInsert.id;

    console.log(req.operatorId);

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
        console.log(info);
        sendMsg = info;
        res.send(sendMsg);
      }
    });
  }),
];

exports.activate = [
  asyncMiddleware(async (req, res, next) => {
    const otp = req.body.otp;
    console.log("acti ", req.session.operatorId);

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
