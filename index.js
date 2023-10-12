//Inquirer is required through questions.js

const inquirerPrompts = require('./questions.js');
const sqlQueries = require('./sql_queries.js');

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
    const { root } = await inquirerPrompts.questions().menuRoot();
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
    };
};

//-----------------

//[VIEW_DEPTS]      "View all departments":
//  Show table with department names and IDs
//  Options [ADD_DEPT], [MAIN_MENU]

async function viewDepts(returnToMain) {
    const deptTable = await sqlQueries.queries().getTable('departments');
    console.log(deptTable);
    let deptOptions = inquirerPrompts.questions().departmentOptions();
    // if (deptOptions = 'Add Department')
    //         addDept(true);
    // else mainMenu();
    
};

//-----------------

//[VIEW_ROLES]      "View all roles":
//  Show table with job titles, role IDs, associated department, and role salary
//  Options [ADD_ROLE], [MAIN_MENU]

async function viewRoles(returnToMain) {
    sqlQueries.queries().getTable('roles');
    let roleOptions = await inquirerPrompts.questions().roleOptions();
    switch (roleOptions) {
        case 'Add Role':
            addRole(true);
        default:
            mainMenu();
    };
};

//-----------------

//[VIEW_EMPS]       "View all employees":
//  Show table with employee ids, first names, last names, job titles, departments, salaries, and direct managers
//  Options [ADD_EMP], [UPDATE_EMP], [MAIN_MENU]

async function viewEmps(returnToMain) {
    sqlQueries.queries().getTable('employees');
    const { empOptions } = await inquirerPrompts.questions().empOptions();
    switch (empOptions) {
        case 'Add Employee':
            addEmp(true);
        case 'Update Employee':
            updateEmp(true);
        default:
            mainMenu();
    };
}

//-----------------

//[ADD_DEPT]        "Add a department":
//  Prompt input for name of department
//  Check to see if department already exists (Error prompt: Retry/Cancel)
//  [ADD_DEPT_CONF]     Show inputted department name and confirmation prompt (Confirm/Retry [GOTO: ADD_DEPT]/Cancel)
//  Potential later addition: Generate random 3-digit deptID and show, rather than incremental IDs

async function addDept(returnToMain) {
    const { newDept } = await inquirerPrompts.questions().newItemName('department');
    const deptCheck = await sqlQueries.queries().checkNewDept(newDept.name);
    if (!deptCheck) {
        const { retry } = await questions.alreadyExistsError.onlyRetry('department');
        if (retry.retryAnswer === 'Retry') {
            addDept(true);
        } else viewDepts(true);
    } else sqlQueries.queries().writeNewDept(newDept.name)
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
    const { newRole } = await questions.newItemName('role');
    const roleCheck = await sqlQueries.queries().checkNewDept(newRole.name);
    if (!roleCheck) {
        const { retry } = await questions.alreadyExistsError.onlyRetry('role');
        if (retry.retryAnswer === 'Retry') {
            addRole(true);
        } else viewRoles(true);
    } else sqlQueries.queries().writeNewRole(newRole.name)
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
    const { newRole } = await questions.newItemName('role');
    const roleCheck = await sqlQueries.queries().checkNewDept(newRole.name);
    if (!roleCheck) {
        const { retry } = await questions.alreadyExistsError.onlyRetry('role');
        if (retry.retryAnswer === 'Retry') {
            addRole(true);
        } else viewRoles(true);
    } else sqlQueries.queries().writeNewRole(newRole.name)
}

//-----------------

//"Update an employee":
//  Prompt for employee last name or empID [TARGET: UPDATE_EMP_INPUT]
//  Check to see if employee exists in database (Error options: Add [GOTO: ADD_EMP_FIRST]/Retry/Cancel)
//  If multiple, prompt with list of employees with this last name (+ Cancel)
//  Confirm employee name and empID (Retry [GOTO: UPDATE_EMP_INPUT]/Cancel) [TARGET: UPDATE_EMP_CONF]
//  Prompt what to update (Role/Manager/Cancel)

async function updateEmp(returnToMain) {
    mainMenu()
}

//-----------------

//"Update employee role": [TARGET: UPDATE_EMP_ROLE]
//  Prompt for role name ID to change to
//  Check to see if role exists in database (Error options: Add [GOTO: ADD_ROLE_CONF]/Retry/Cancel)
//  Confirm role name and ID to update to (Retry [GOTO: UPDATE_EMP_ROLE]/Cancel) [TARGET: UPDATE_EMP_CONF]
//  Prompt what to update (Role/Manager/Cancel)

async function updateEmpRole(empID) {
    mainMenu()
}

//-----------------

//"Reassign manager": [TARGET: UPDATE_MANAGER]
//  [UPDATE_MANAGER_INPUT]  Check to see if employee exists in database (Error options: Add [GOTO: ADD_EMP_FIRST]/Retry/Cancel)
//  If multiple, prompt with list of employees with this last name (+ Cancel)
//  Confirm manager name and empID (Retry [GOTO: UPDATE_MANAGER_INPUT]/Cancel) [TARGET: UPDATE_EMP_CONF]

async function updateManager(empID) {
    mainMenu()
}

mainMenu();