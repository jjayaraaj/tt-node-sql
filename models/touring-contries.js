const {Sequelize} = require('sequelize');
const sequelize = require('../util/database');

const TouringCountrie = sequelize.define('touringCountrie', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            isInt: true
        }
    },
    countryCode: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = TouringCountrie;