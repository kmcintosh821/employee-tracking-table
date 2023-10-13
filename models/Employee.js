const { DataTypes, Model } = require('sequelize');
const db = require('../db/connection');

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
        references: {
            model: Role,
            key: 'job_title'
        }
    },
    manager_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'id'
        }
    },
    manager_name: {
        type: DataTypes.STRING,
        references: {
            model: Employee,
            key: 'last_name'
        }
    }
}, {
    modelName: 'employee',
    sequelize: db
});

Role.hasMany(Employee);
Employee.belongsTo(Role);

module.exports = Employee;