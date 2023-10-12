const inquirer = require('inquirer');

questions = () => {
    return {
        
        //Start of prompt tree
        menuRoot: () => {
            const question = [{
                name: 'root',
                message: 'Choose what to view:',
                type: 'list',
                choices: [
                    'View Departments',
                    'View Roles',
                    'View Employees',
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    'Update Employee',
                    'Exit'
                ]
            }];
            return inquirer.prompt(question)
        },
        // List of choices to display upon viewing department table
        departmentOptions: () => {
            const question = [{
                name: 'deptOptions',
                type: 'list',
                choices: [
                    'Add Department',
                    'Back'
                ]
            }];
        },
        // List of choices to display upon viewing role table
        roleOptions: () => {
            const question = [{
                name: 'roleOptions',
                type: 'list',
                choices: [
                    'Add Role',
                    'Back'
                ]
            }];
        },
        // List of choices to display upon viewing employee table
        empOptions: () => {
            const question = [{
                name: 'empOptions',
                type: 'list',
                choices: [
                    'Add Employee',
                    'Update Employee',
                    'Back'
                ]
            }];
        },
        // Add item (parameter is a string of either 'department', 'role', or 'employee')
        newItemName: (item) => {
            const question = [{
                name: 'name',
                message: ('Input name for new ' + item + '.'),
                type: 'input'
            }];
            return inquirer.prompt(question);
        },
        
        //Add Role specific questions
        newRole: {
            chooseDept: (deptList) => {
                const question = [{
                    name: 'chosenDept',
                    message: 'Choose department for new role.',
                    type: 'list',
                    choices: deptList
                }];
                return inquirer.prompt(question)
            },
            chooseSalary: () => {
                const question = [{
                    name: 'salary',
                    message: 'Input a salary for this role.',
                    type: 'input'
                }];
                return inquirer.prompt(question)
            }
        },

        //Add Employee specific questions
        newEmp: {
            assignToDept: (deptList) => {
                const question = [{
                    name: 'assignedDept',
                    message: 'Assign this employee to a department.',
                    type: 'list',
                    choices: deptList
                }];
                return inquirer.prompt(question)
            },
            assignRole: (roleList) => {
                const question = [{
                    name: 'assignedRole',
                    message: 'Assign a role to this employee.',
                    type: 'list',
                    choices: roleList
                }];
                return inquirer.prompt(question)
            },
            assignManager: () => {
                const question = [{
                    name: 'assignedManager',
                    message: "Input last name or employee ID of this employee's direct manager.",
                    type: input
                }]
            }
        },

        //Error messages
        alreadyExistsError: {
            onlyRetry: (item) => {
                const question = [{
                    name: ('retryAnswer'),
                    message: (item, 'with that name exists already.'),
                    type: 'list',
                    choices: [
                        'Retry',
                        'Cancel'
                    ]
                }]
                return inquirer.prompt(question)
            },

            retryOrUpdate: (item) => {
                const question = [{
                    name: ('retryOrUpdate'),
                    message: (item, 'with that name exists already.'),
                    type: 'list',
                    choices: [
                        'Retry',
                        'Update',
                        'Cancel'
                    ]
                }]
                return inquirer.prompt(question)
            },

            chooseEmployeeOrMakeNew: (name, possibleChoices) => {
                const question = [{
                    name: ('chooseOrNew'),
                    message: `Employees with last name "${name}" exist, are you referring to:`,
                    type: 'list',
                    choices: [
                        possibleChoices,
                        'New',
                        'Cancel'
                    ]
                }]
                return inquirer.prompt(question)
            }
        }
    }
}

module.exports = { questions };