const { DataTypes, Model } = require('sequelize');
const db = require('../db/connection');
const Employee = require('./Employee');

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
        references: {
            model: Department,
            key: 'dept_name'
        }
    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    modelName: 'role',
    sequelize: db
});

// Department.hasMany(Role);
// Role.belongsTo(Department);

module.exports = Role;