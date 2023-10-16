const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('employee_tracker_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});

module.exports = sequelize;