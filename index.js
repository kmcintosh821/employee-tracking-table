//Inquirer is required through questions.js

const questions = require('questions.js');
const sqlQueries = require('sql_queries');
const db = require('connection');

//selectedDepartment object: deptName, deptID properties
const selectedDepartment = {
    deptName: 'none',
    deptID: 0
};
//selectedRole object: jobTitle, roleID, deptID, salary
const selectedRole = {
    jobTitle: 'none',
    roleID: 0,
    deptID: 0,
    salary: 0
};
//selectedEmployee object: lastname, firstname, empID, roleID, deptID, managerID
const selectedEmployee = {
    lastName: 'none',
    firstName: 'none',
    empID: 0,
    roleID: 0,
    deptID: 0,
    managerID: 0
}

//selectedManager object: managerID, subordID
const selectedManager = {
    managerID: 0,
    subordID: 0
}



//[MAIN_MENU]       Initial query to start tree: View Depts, Add Dept, View Roles, Add Role, View Emp, Add Emp, Update Emp, Exit
async function mainMenu() {
    const { root } = await questions.mainMenu();
    switch (root) {
        case 'View Departments':
            viewDepts(true);
            break;
        case 'View Roles':
            viewRoles(true);
            break;
        case 'View Employees':
            viewEmps(true);
            break;
        case 'Add Department':
            addDept(true);
            break;
        case 'Add Role':
            addRole(true);
            break;
        case 'Add Employee':
            addEmp(true);
            break;
        case 'Update Employee':
            updateEmp(true);
        default:
            exitMenu();
    }
}

//-----------------

//[VIEW_DEPTS]      "View all departments":
//  Show table with department names and IDs
//  Options [ADD_DEPT], [MAIN_MENU]

async function viewDepts(returnToMain) {

}

//-----------------

//[VIEW_ROLES]      "View all roles":
//  Show table with job titles, role IDs, associated department, and role salary
//  Options [ADD_ROLE], [MAIN_MENU]

async function viewRoles(returnToMain) {

}

//-----------------

//[VIEW_EMPS]       "View all employees":
//  Show table with employee ids, first names, last names, job titles, departments, salaries, and direct managers
//  Options [ADD_EMP], [UPDATE_EMP], [MAIN_MENU]

async function viewEmps(returnToMain) {

}

//-----------------

//[ADD_DEPT]        "Add a department":
//  Prompt input for name of department
//  Check to see if department already exists (Error prompt: Retry/Cancel)
//  [ADD_DEPT_CONF]     Show inputted department name and confirmation prompt (Confirm/Retry [GOTO: ADD_DEPT]/Cancel)
//  Potential later addition: Generate random 3-digit deptID and show, rather than incremental IDs

async function addDept(returnToMain) {
    const { departmentName } = await questions.newItemName('department');
    

}

//-----------------

//"Add a role":
//  Prompt with list of departments to associate with
//  Prompt input for role name
//  Check to see if role already exists in department (Error options: Retry/Cancel)
//  Show inputted role name and confirmation prompt (Confirm/Retry/Cancel)
//  Prompt for salary
//  Show role name + salary and confirmation prompt (Confirm/Rename Role/Change Salary/Cancel)
//  Potential later addition: Generate random 4-digit roleID and show, rather than incremental IDs

async function addRole(returnToMain) {

    const deptList = db.connect((err) => {
        if (err) throw err;
        db.query("SELECT dept_id, dept_name FROM departments", (err, result) => {
          if (err) throw err;
          return result;
        });
      });

    const roleData = await inquirer.prompt({
        name: 'deptName',
        message: 'Choose department for new role',
        type: 'list',
        choices: deptList
    },
    {
        name: 'jobTitle',
        message: 'Input name for new role',
        type: 'input'
    });

    const roleNameCheck = await db.connect((err) => {
        if (err) throw err;
        db.query(`SELECT * FROM roles WHERE jobTitle = ${roleData.jobTitle}`, (err, result) => {
            if (err) throw err;
            if (result)
                return true;
        });
    });

    if (roleNameCheck === true) {
        const roleRetry = inquirer.prompt({
            name: 'retryPrompt',
            message: 'Role with same name already exists in database. Retry?',
            type: 'confirm'

        }).then((response) => {
            if (response)
                addRole(returnToMain);
            else mainMenu();
        })
    }

    const roleSalary = await 

}

//-----------------

//"Add an employee":
//  Prompt with list of departments to associate with
//  Prompt with list of roles to associate with
//  Prompt to input employee last name
//  Prompt to input employee first name [TARGET: ADD_EMP_FIRST]
//  Check to see if employee already exists in database (Error options: Update [GOTO: UPDATE_EMP_CONF]/Retry/Cancel)
//  Double check with identical first or last names, and confirm to avoid accidental duplicates (Options: Update one of the above/Cancel)
//  Show inputted employee name and confirmation prompt (Confirm/Retry/Cancel)
//  Prompt for manager last name or employee ID
//  Check database for manager, and prompt to select if multiple share the same last name
//  Show employee name, department, role, and manager, and confirmation prompt (Confirm/Change Name/Change Department/Change Role/Change Manager/Cancel)
//  Potential later addition: Generate random 6-digit empID and show, rather than incremental ID

async function addEmp(returnToMain) {

}

//-----------------

//"Update an employee":
//  Prompt for employee last name or empID [TARGET: UPDATE_EMP_INPUT]
//  Check to see if employee exists in database (Error options: Add [GOTO: ADD_EMP_FIRST]/Retry/Cancel)
//  If multiple, prompt with list of employees with this last name (+ Cancel)
//  Confirm employee name and empID (Retry [GOTO: UPDATE_EMP_INPUT]/Cancel) [TARGET: UPDATE_EMP_CONF]
//  Prompt what to update (Role/Manager/Cancel)

async function updateEmp(returnToMain) {

}

//-----------------

//"Update employee role": [TARGET: UPDATE_EMP_ROLE]
//  Prompt for role name ID to change to
//  Check to see if role exists in database (Error options: Add [GOTO: ADD_ROLE_CONF]/Retry/Cancel)
//  Confirm role name and ID to update to (Retry [GOTO: UPDATE_EMP_ROLE]/Cancel) [TARGET: UPDATE_EMP_CONF]
//  Prompt what to update (Role/Manager/Cancel)

async function updateEmpRole(empID) {

}

//-----------------

//"Reassign manager": [TARGET: UPDATE_MANAGER]
//  [UPDATE_MANAGER_INPUT]  Check to see if employee exists in database (Error options: Add [GOTO: ADD_EMP_FIRST]/Retry/Cancel)
//  If multiple, prompt with list of employees with this last name (+ Cancel)
//  Confirm manager name and empID (Retry [GOTO: UPDATE_MANAGER_INPUT]/Cancel) [TARGET: UPDATE_EMP_CONF]

async function updateManager(empID) {

}

module.exports = index;