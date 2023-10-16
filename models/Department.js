const { DataTypes, Model } = require('sequelize');
const db = require('../db/connection');
const Role = require('./Role');

class Department extends Model { }

Department.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dept_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    modelName: 'department',
    sequelize: db
});

module.exports = Department;