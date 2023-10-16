const { DataTypes, Model } = require('sequelize');
const db = require('../db/connection');
const Employee = require('./Employee');
const Department = require('./Department');

class Role extends Model { }

Role.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    job_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role_dept: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: 'role',
    sequelize: db
});

module.exports = Role;