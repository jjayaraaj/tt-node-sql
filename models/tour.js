const {Sequelize} = require('sequelize');
const sequelize = require('./../util/database');
const TouringCountrie = require('./touring-contries');

const Tour = sequelize.define('tour', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        validate: {
            isInt: true
        }
    },
    tour_name: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    from_date: {
        type: Sequelize.DATE,
        validate: {
            notEmpty:true
        }
    },
    to_date: {
        type: Sequelize.DATE,
        validate: {
            notEmpty:true
        }
    },
    country: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: true
        }            
    },
    multicity_travel: {
        type: Sequelize.BOOLEAN,
        allowNull: false, defaultValue: true
    },
    nature_of_travel: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    },
    isActive: { type: Sequelize.INTEGER, defaultValue: 1}
}); 
TouringCountrie.belongsTo(Tour, {constraints: true, onDelete: 'CASCADE'});
Tour.hasMany(TouringCountrie);





module.exports = Tour