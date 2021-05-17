const {Sequelize} = require('sequelize');
const sequelize = require('./../util/database');

const OperatorOtp = require('../models/operator-otp');
const Tour = require('./tour');


const Operator = sequelize.define('operator', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            isInt: true
        }
    },
    name: {
        type: Sequelize.STRING,
        validate: {
            is: ["^[a-z]+$",'i'],
        }
    },
   
    username: {
        type: Sequelize.STRING, allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },

    email: {
        type: Sequelize.STRING, allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    company: {
        type: Sequelize.STRING, 
        validate: {
            notEmpty: true,
        }
    },
    phone: {
        type: Sequelize.INTEGER, 
        validate: {
            isNumeric: true
        }
    },
    address: {
        type: Sequelize.INTEGER, 
        validate: {
            notEmpty: true,
        }
    },
    country: {
        type: Sequelize.INTEGER, 
        validate: {
            notEmpty: true,
        }
    },
    provider: {
        type:   Sequelize.ENUM,
        values: ['travitime', 'google', 'facebook'],
        allowNull: false,
        defaultValue: 'travitime'

    },
    website: {
        type: Sequelize.STRING
    },
    // created_at:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    // updated_at:  { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    isActive: { type: Sequelize.INTEGER, defaultValue: 1}

}); 

OperatorOtp.belongsTo(Operator, {constraints: true, onDelete: 'CASCADE'});
Operator.hasOne(OperatorOtp);

Operator.hasMany(Tour);
Tour.belongsTo(Operator);






module.exports = Operator;