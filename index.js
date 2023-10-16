const db = require('./db/connection');
const inquirerPrompts = require('./questions.js').questions();
const sqlQueries = require('./sql_queries.js');
const Employee = require('./models/Employee.js');
const Role = require('./models/Role.js');
const Department = require('./models/Department.js')


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
    console.log('')
    let { root } = await inquirerPrompts.menuRoot();
    switch (root) {
        case 'View Departments':
            viewDepts();
            break;
        case 'View Roles':
            viewRoles();
            break;
        case 'View Employees':
            viewEmps();
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
            break;
        case 'Exit':
            exitMenu();
            break;
    };
};

//-----------------

//[VIEW_DEPTS]      "View all departments":
//  Show table with department names and IDs
//  Options [ADD_DEPT], [MAIN_MENU]

async function viewDepts() {
    const depts = await Department.findAll();
    console.log('');
    console.log('Viewing departments:') 
    console.log('________________________')
    console.log('| ID | Department Name')
    depts.forEach((item) => {
        let row = JSON.parse(JSON.stringify(item));
        console.log('|----|------------------')
        console.log('| ', row.id, '|', row.dept_name);
    });
    console.log('|____|__________________')
    console.log('');

    const { deptOptions } = await inquirerPrompts.departmentOptions();
    switch (deptOptions) {
        case 'Add Department':
            addDept(true);
            break;
        case 'Back':
            mainMenu();
            break;
    };
};

//-----------------

//[VIEW_ROLES]      "View all roles":
//  Show table with job titles, role IDs, associated department, and role salary
//  Options [ADD_ROLE], [MAIN_MENU]

async function viewRoles() {
    const roles = await Role.findAll();
    console.log('');
    console.log('Viewing roles:') 
    console.log('______________________________________________')
    console.log('| ID | Title ~~~~~ Department ~~~~~ Salary')
    roles.forEach((item) => {
        let row = JSON.parse(JSON.stringify(item));
        console.log('|----|----------------------------------------')
        console.log('| ', row.id, '|', row.job_title, '~~~~~', row.role_dept, '~~~~~', row.salary);
    });
    console.log('|____|________________________________________')
    console.log('');

    const { roleOptions } = await inquirerPrompts.roleOptions();
    switch (roleOptions) {
        case 'Add Role':
            addRole(true);
            break;
        case 'Back':
            mainMenu();
            break;
    };
};

//-----------------

//[VIEW_EMPS]       "View all employees":
//  Show table with employee ids, first names, last names, job titles, departments, salaries, and direct managers
//  Options [ADD_EMP], [UPDATE_EMP], [MAIN_MENU]

async function viewEmps() {
    const emps = await Employee.findAll();
    console.log('');
    console.log('Viewing employees:') 
    console.log('__________________________________________________________________')
    console.log('| ID | Name (last, first) ~~~~~ Role ~~~~~ Manager (ID, last name)')
    emps.forEach((item) => {
        let row = JSON.parse(JSON.stringify(item));
        console.log('|----|------------------------------------------------------------')
        console.log('| ', row.id, '|', row.last_name + ',', row.first_name, '~~~~~', row.employee_role, '~~~~~', row.manager_id, row.manager_name);
    });
    console.log('|____|____________________________________________________________')
    console.log('');

    const { empOptions } = await inquirerPrompts.empOptions();
    switch (empOptions) {
        case 'Add Employee':
            addEmp(true);
            break;
        case 'Update Employee':
            updateEmp(true);
            break;
        default:
            mainMenu();
            break;
    };
}

//-----------------

//[ADD_DEPT]        "Add a department":
//  Prompt input for name of department
//  Check to see if department already exists (Error prompt: Retry/Cancel)
//  [ADD_DEPT_CONF]     Show inputted department name and confirmation prompt (Confirm/Retry [GOTO: ADD_DEPT]/Cancel)
//  Potential later addition: Generate random 3-digit deptID and show, rather than incremental IDs

async function addDept(returnToMain) {
    const newDept= await inquirerPrompts.newItemName('department');
    console.log('');
    console.log('Added', newDept.name, 'to Departments!');
    console.log('');
    //TODO: Sequelize check to avoid duplicates
    //TODO: Sequelize writes new data to dept table
    if (returnToMain) mainMenu();
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
    const roleName = await inquirerPrompts.newItemName('role');
    //TODO: Sequelize check to avoid duplicates
    const linkedDept = await inquirerPrompts.newRole.chooseDept(['Bigwig', 'Bottom Feeder']);
    const roleSalary = await inquirerPrompts.newRole.chooseSalary();
    const newRole = {
        ...roleName,
        ...linkedDept,
        ...roleSalary
    };
    console.log('');
    //TODO: Insert list of departments into chooseDept()
    console.log('Added', newRole.name, 'to Roles, in the', newRole.dept, 'department, and a salary of $' + newRole.salary + '!');
    console.log('');
    //TODO: Sequelize writes new data to dept table
    if (returnToMain) mainMenu();
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
    const lastName = await inquirerPrompts.newEmp.lastName();
    //TODO: Sequelize check to see if it matches an existing employee
    const firstName = await inquirerPrompts.newEmp.firstName();
    const assignedDept = await inquirerPrompts.newEmp.assignToDept(['Bigwig', 'Bottom Feeder']);
    //TODO: Insert list of departments into assignedDept()
    const assignedRole = await inquirerPrompts.newEmp.assignRole(['CEO', 'Peon']);
    const assignedManager = await inquirerPrompts.newEmp.assignManager();
    //TODO: Sequelize check for both manager ID and last name
    const newEmp = {
        ...lastName,
        ...firstName,
        ...assignedDept,
        ...assignedRole,
        ...assignedManager
    };
    console.log('');
    console.log('Added', newEmp.lastName + ',', newEmp.firstName, 'to Employees, in the', newEmp.assignedDept, 'department, with the role of', newEmp.assignedRole + '! Their direct manager is', newEmp.assignedManager + '.');
    console.log('');
    //TODO: Sequelize writes new data to dept table
    if (returnToMain) mainMenu();
}

//-----------------

//"Update an employee":
//  Prompt for employee last name or empID [TARGET: UPDATE_EMP_INPUT]
//  Check to see if employee exists in database (Error options: Add [GOTO: ADD_EMP_FIRST]/Retry/Cancel)
//  If multiple, prompt with list of employees with this last name (+ Cancel)
//  Confirm employee name and empID (Retry [GOTO: UPDATE_EMP_INPUT]/Cancel) [TARGET: UPDATE_EMP_CONF]
//  Prompt what to update (Role/Manager/Cancel)

async function updateEmp(returnToMain) {
    const target = await inquirerPrompts.updateTarget();
    //TODO: Sequelize check to avoid duplicates
    const { option } = await inquirerPrompts.updateOptions();
    
    switch (option) {
        case 'Reassign Role': 
            updateEmpRole(target, returnToMain);
            break;
        case 'Change Manager': 
            updateManager(target, returnToMain);
            break;
    }
}

//-----------------

//"Update employee role": [TARGET: UPDATE_EMP_ROLE]
//  Prompt for role name ID to change to
//  Check to see if role exists in database (Error options: Add [GOTO: ADD_ROLE_CONF]/Retry/Cancel)
//  Confirm role name and ID to update to (Retry [GOTO: UPDATE_EMP_ROLE]/Cancel) [TARGET: UPDATE_EMP_CONF]
//  Prompt what to update (Role/Manager/Cancel)

async function updateEmpRole(empID, returnToMain) {
    const reassignedDept = await inquirerPrompts.newEmp.assignToDept(['Bigwig', 'Bottom Feeder']);
    //TODO: Insert list of departments into reassignedDept()
    const reassignedRole = await inquirerPrompts.newEmp.assignRole(['CEO', 'Peon']);
    const updatedEmp = {
        ...empID,
        ...reassignedDept,
        ...reassignedRole
    };

    console.log('');
    //TODO: Insert list of departments into chooseDept()
    console.log('Updated', updatedEmp.name + "'s department and role!");
    console.log('');
    //TODO: Sequelize writes new data to dept table
    if (returnToMain) mainMenu();
}

//-----------------

//"Reassign manager": [TARGET: UPDATE_MANAGER]
//  [UPDATE_MANAGER_INPUT]  Check to see if employee exists in database (Error options: Add [GOTO: ADD_EMP_FIRST]/Retry/Cancel)
//  If multiple, prompt with list of employees with this last name (+ Cancel)
//  Confirm manager name and empID (Retry [GOTO: UPDATE_MANAGER_INPUT]/Cancel) [TARGET: UPDATE_EMP_CONF]

async function updateManager(empID, returnToMain) {
    const reassignedManager = await inquirerPrompts.newEmp.assignManager();
    const updatedEmp = {
        ...empID,
        ...reassignedManager
    };

    console.log('');
    //TODO: Insert list of departments into chooseDept()
    console.log('Updated', updatedEmp.name + "'s manager!");
    console.log('');
    //TODO: Sequelize writes new data to dept table
    if (returnToMain) mainMenu();
};

async function exitMenu() {
    console.log('');
    console.log('Goodbye!');
}

async function appInit() {
    await db.sync().then(() => {
        console.log('')
        console.log('Welcome to the Employee Tracker!')
    });
    
    mainMenu();
}

appInit()