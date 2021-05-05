const {Sequelize} = require('sequelize');
const sequelize = require('./../util/database');

const OperatorOtp = sequelize.define('operatorOtp', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            isInt: true
        }
    },
    otp: {
        type: Sequelize.STRING, allowNull: false,
        allowNull: false,
    }
});

module.exports = OperatorOtp; 