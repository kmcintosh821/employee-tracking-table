const inquirer = require('inquirer');

module.exports = () => {
    return {
        

        //Start of prompt tree
        mainMenu : () => {
            const question = [{
                name: 'root',
                message: 'Choose what to view:',
                type: 'list',
                options: [
                    'View Departments',
                    'View Roles',
                    'View Employees',
                    'Add Department',
                    'Add Role',
                    'Add Employee',
                    'Update Employee',
                    'Exit'
                ]
            }]
            return inquirer.prompt(question)
        },
        // Add item (parameter is a string of either 'department', 'role', or 'employee')
        newItemName: (item) => {
            const question = [{
                name: item + 'Name',
                message: ('Input name for new ' + item + '.'),
                type: 'input'
            }]
            return inquirer.prompt(question);
        },
        
        //Add Role specific questions
        addRole: {
            chooseDept: (deptList) => {
                const question = [{
                    name: 'chosenDept',
                    message: 'Choose department for new role.',
                    type: 'list',
                    choices: deptList
                }]
            },
            chooseSalary: () => {
                const question = [{
                    name: 'salary',
                    message: 'Input a salary for this role.',
                    type: 'input'
                }]
            }
        },

        //Error messages
        alreadyExistsError: {
            onlyRetry: (item) => {
                const question = [{
                    name: ('retry' + item),
                    message: (item, 'with that name exists already.'),
                    type: 'list',
                    choices: [
                        'Retry',
                        'Cancel'
                    ]
                }]
            },

            retryOrUpdate: (item) => {
                const question = [{
                    name: ('retryOrUpdate' + item),
                    message: (item, 'with that name exists already.'),
                    type: 'list',
                    choices: [
                        'Retry',
                        'Update',
                        'Cancel'
                    ]
                }]
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
            }
        }
    }
}

