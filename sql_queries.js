const db = require('connection');

// Retrieves entirety of the designated table
function getTable(input) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`SELECT * FROM ${input};`, (err, result) => {
          if (err) throw err;
          return result;
        });
      });
};

// Retrieves all of a particular property for the designated table, as well as associated ID
function getColumn(table, column) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`SELECT ${column}, id FROM ${table};`, (err, result) => {
            if (err) throw err;
            return result;
        });
    });
};

// TODO: Simplify comparative checks into one function

// Check new department name against existing ones

function checkNewDept(input) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`SELECT * FROM departments WHERE dept_name = ${input};`)
    });
    if (Object.keys(table) >= 1)
        return table;
    else return false;
};

//------------
// Check new role name against existing ones
function checkNewRole(input) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`SELECT * FROM roles WHERE job_title = ${input};`)
    });
    if (Object.keys(table) >= 1)
        return table;
    else return false;
};

//------------
// Check employee's names against existing ones
function checkEmployeeLastName(input) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`SELECT id, last_name, first_name FROM employees WHERE last_name = ${input};`)
    });
    if (Object.keys(table) >= 1)
        return table;
    else return false;
};

function checkEmployeeFullName(last, first) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`SELECT * FROM employees WHERE last_name = ${last} AND first_name = ${first};`)
    });
    if (Object.keys(table) >= 1)
        return table;
    else return false;
}

//------------
// Write new department to database
function writeNewDept(input) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`INSERT INTO departments (dept_name) VALUES ${input}`);
        console.log('Added', input, 'to departments')
    })

};

//------------
// Write new role to database
function writeNewRole(job_title, role_dept, salary) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`INSERT INTO roles (job_title, role_dept, salary) VALUES ${job_title}, ${role_dept}, ${salary}`);
        console.log('Added', job_title, 'to roles')
    })

};

//------------
// Write new employee to database
function writeNewEmployee(last_name, first_name, employee_role, manager_id, manager_name) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`INSERT INTO employees (last_name, first_name, employee_role, manager_id, manager_name) VALUES ${last_name}, ${first_name}, ${employee_role}, ${manager_id}, ${manager_name}`)
    })
    console.log('Added', first_name, last_name, 'to employees');
};

//------------
// Write updated employee to database
function writeEmployeeUpdate(id, newRole, managerId) {
    const table = db.connect((err) => {
        if (err) throw err;
        db.query(`UPDATE employees SET employee_role = ${newRole}, manager_id = ${managerId}, WHERE id = ${id};`)
    })
    console.log('Updated employee', id, 'role to', newRole, 'and manager to', managerId)
};