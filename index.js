const express = require("express");
const session = require("express-session");

const sequelize = require("./util/database");
const Operator = require("./models/operator");
const OperatorOtp = require("./models/operator-otp");

const operatorMiddle = require("./middleware/operator");


//routes
const operatorRoute = require("./routes/operator");
const authRoute = require("./routes/auth");
const tourRouter = require("./routes/tour");


const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();

//to retrive all requset data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({ secret: "my secret", resave: false, saveUninitialized: false })
);

//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  req.testuse = "userTested";
  console.log(req.operatorId);
  next();
});

//middleware
app.use(operatorMiddle);

//routers
app.use("/api/operator", operatorRoute);

//auth routers
app.use("/api/auth", authRoute);

//tour Routers
app.use("/api/tour", tourRouter);

const port = process.env.PORT || 3000;

sequelize
  .sync()
  //.sync({force: true})
  .then((result) => {
    //console.log(result);
    app.listen(port, () => {
      // console.log(`Listening in ${port}...`)
    });
  })
  .catch((err) => {
    console.log(err);
  });
