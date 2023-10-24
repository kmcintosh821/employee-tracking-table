const { DataTypes, Model } = require('sequelize');
const db = require('../db/connection');
const Role = require('./Role')
const Department = require('./Department')

class Employee extends Model { }

Employee.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    employee_role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    manager_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'id'
        },
        defaultValue: 0
    },
    manager_name: {
        type: DataTypes.STRING,
        references: {
            model: Employee,
            key: 'last_name'
        },
        defaultValue: 'N/A'
    }
}, {
    modelName: 'employee',
    sequelize: db
});

module.exports = Employee;