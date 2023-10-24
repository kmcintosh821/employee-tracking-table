const db = require('./db/connection');
const inquirerPrompts = require('./questions.js').questions();
const sqlQueries = require('./sql_queries.js');
const Employee = require('./models/Employee.js');
const Role = require('./models/Role.js');
const Department = require('./models/Department.js')



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
            updateEmp(true, 0);
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

            updateEmp(true, 0);
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
    const newDept = await inquirerPrompts.newItemName('department');
    const deptCheck = await Department.findOne({ where: { dept_name: newDept.name } });

    if (deptCheck !== null) {
        const retryPrompt = await inquirerPrompts.alreadyExists.onlyRetry('Department');
        switch (retryPrompt.retryAnswer){
            case 'Retry':
                addDept(false)
                break;
            case 'Cancel':
                break;
        }
    } else {
        const addDept = await Department.create({ dept_name: newDept.name })
        console.log('');
        console.log('Added', newDept.name, 'to Departments, with an ID of', addDept.id + '!');
        console.log('');
    }

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
    const deptTable = await Department.findAll();
    let deptList = [];
    deptTable.forEach((item) => {
        let row = JSON.parse(JSON.stringify(item));
        deptList.push(row.dept_name);
    })
    const roleName = await inquirerPrompts.newItemName('role');
    const roleCheck = await Role.findOne({ where: { job_title: roleName.name } });

    if (roleCheck !== null) {
        const retryPrompt = await inquirerPrompts.alreadyExists.onlyRetry('Role');
        switch (retryPrompt.retryAnswer){
            case 'Retry':
                addRole(false)
                break;
            case 'Cancel':
                break;
        }
    } else {
        const linkedDept = await inquirerPrompts.newRole.chooseDept(deptList);
        const roleSalary = await inquirerPrompts.newRole.chooseSalary();

        const addRole = await Role.create({ job_title: roleName.name, role_dept: linkedDept.dept, salary: roleSalary.salary })
        console.log('');
        console.log('Added', roleName.name, 'to Roles, in the', linkedDept.dept, 'department, and a salary of $' + roleSalary.salary + '!');
        console.log('');
    }
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
    const input = await inquirerPrompts.newEmp.lastName();
    const lastNameCheckList = await Employee.findAll({ where: { last_name: input.lastName } });
    let sharedIds = [];
    let sharedNames = [];
    if (lastNameCheckList.length != 0) {
        lastNameCheckList.forEach((item) => {
            let row = JSON.parse(JSON.stringify(item));
            sharedIds.push(row.id);
            sharedNames.push(`${row.last_name}, ${row.first_name}`);
        });
        sharedNames.push('New', 'Cancel');
        const updateEmployee = await inquirerPrompts.alreadyExists.chooseEmployeeOrMakeNew(input.lastName, sharedNames)
        switch (updateEmployee.chooseOrNew) {
            case 'New':
                let firstName = await inquirerPrompts.newEmp.firstName();
                let assignedDept = await deptAssign();
                let assignedRole = await roleAssign(assignedDept);
                let assignedManager = await managerAssign();
                if (assignedManager == null) {
                    assignedManager = {id: 0, last_name: 'N/A'}
                }
                
                const newEmp = {
                    ...lastName,
                    ...firstName,
                    ...assignedDept,
                    ...assignedRole,
                    ...assignedManager
                };
                console.log('');
                console.log('Added', newEmp.lastName + ',', newEmp.firstName, 'to Employees, in the', newEmp.assignedDept, 'department, with the role of', newEmp.assignedRole + '! Their direct manager is', assignedManager.last_name + '.');
                console.log('');                       
                break;
            case 'Cancel':
                if (returnToMain) mainMenu();
                break;
            default: 
                const nameIndex = sharedNames.indexOf(updateEmployee.chooseOrNew)
                const target = sharedIds[nameIndex]
                updateEmp(returnToMain, target)       
                break;
        } 
    } else {
        let firstName = await inquirerPrompts.newEmp.firstName();
        let assignedDept = await deptAssign();
        let assignedRole = await roleAssign(assignedDept.assignedDept);
        let assignedManager = await managerAssign();
        if (assignedManager == null) {
            assignedManager = {id: 0, last_name: 'N/A'}
        }
        
        const newEmp = {
            ...input.lastName,
            ...firstName,
            ...assignedDept,
            ...assignedRole,
            ...assignedManager
        };

        const addEmployee = await Employee.create({ last_name: input.lastName, first_name: newEmp.firstName, employee_role: newEmp.assignedRole, manager_id: assignedManager.id })
        
        console.log('');
        console.log('Added', input.lastName + ',', newEmp.firstName, 'to Employees, in the', newEmp.assignedDept, 'department, with the role of', newEmp.assignedRole + '! Their direct manager is', assignedManager.last_name + '.');
        console.log('');           

        if (returnToMain) mainMenu();
    }
}

//-----------------

//Assignment sub-functions

async function deptAssign() {
    const deptTable = await Department.findAll();
    let deptList = [];
    deptTable.forEach((item) => {
        let row = JSON.parse(JSON.stringify(item));
        deptList.push(row.dept_name);
    });
    const assignedDept = await inquirerPrompts.newEmp.assignToDept(deptList);
    return assignedDept;
}

async function roleAssign(dept) {
    const roleTable = await Role.findAll({ where: {role_dept: dept}});
    let roleList = [];
    roleTable.forEach((item) => {
        let row = JSON.parse(JSON.stringify(item));
        roleList.push(row.job_title);
    });
    roleList.push('None')
    const assignedRole = await inquirerPrompts.newEmp.assignRole(roleList);
    return assignedRole;
}

async function managerAssign() {
    let assignedManager;
    const input = await inquirerPrompts.newEmp.assignManager();
    if (!input.identifier)
        targetId = null;
    else if (typeof input.identifier == "number") {
        targetId = input.identifier
    } else {
        let idList = [];
        let nameList = [];
        const nameTable = await Employee.findAll({ where: {last_name: input.identifier}});

        if (nameTable.length == 0) {
            console.log ('Sorry, no employee by that name seems to exist.')
            targetId = null;
        } else {
            nameTable.forEach((item) => {
                let row = JSON.parse(JSON.stringify(item));
                idList.push(row.id);
                nameList.push(`${input.lastName}, ${row.firstName}`);
            });
            const selection = await inquirerPrompts.alreadyExists.chooseEmployeeOrMakeNew(nameList);
            const nameIndex = nameList.indexOf(selection.chooseOrNew)
            targetId = idList[nameIndex]
        }
    }
    if (targetId !== null) {
        const managerJSON = await Employee.findOne({ where: {id: targetId}});
        assignedManager = JSON.parse(JSON.stringify(managerJSON));
    } else assignedManager = {id: 0, last_name: 'N/A'}
    return assignedManager;
}

//-----------------

//"Update an employee":
//  Prompt for employee last name or empID [TARGET: UPDATE_EMP_INPUT]
//  Check to see if employee exists in database (Error options: Add [GOTO: ADD_EMP_FIRST]/Retry/Cancel)
//  If multiple, prompt with list of employees with this last name (+ Cancel)
//  Confirm employee name and empID (Retry [GOTO: UPDATE_EMP_INPUT]/Cancel) [TARGET: UPDATE_EMP_CONF]
//  Prompt what to update (Role/Manager/Cancel)

async function updateEmp(returnToMain, id) {
    let targetId;
    let input;
    let selection;
    if (id == 0) {
        input = await inquirerPrompts.updateTarget();
        if (typeof input.identifier == "number") {
            targetId = input.identifier
        } else {
            let idList = [];
            let nameList = [];
            const nameTable = await Employee.findAll({ where: {last_name: input.identifier}});

            if (nameTable.length > 0) {
                nameTable.forEach((item) => {
                    let row = JSON.parse(JSON.stringify(item));
                    idList.push(row.id);
                    nameList.push(`${row.last_name}, ${row.first_name}`);
                });
            } else {
                console.log ('Sorry, no employee by that name seems to exist.')
                return;
            }
            selection = await inquirerPrompts.alreadyExists.chooseEmployeeOrMakeNew(input.identifier, nameList);
            const nameIndex = nameList.indexOf(selection.chooseOrNew)
            targetId = idList[nameIndex]
            }
    } else {
        targetId = id;
        
    }
    
    // const { updateOptions } = await inquirerPrompts.updateOptions();
    
    // switch (updateOptions.option) {
    //     case 'Reassign Role': 
            const deptTable = await Department.findAll();
            let deptList = [];
            deptTable.forEach((item) => {
                let row = JSON.parse(JSON.stringify(item));
                deptList.push(row.dept_name);
            });
            const dept = await inquirerPrompts.newEmp.assignToDept(deptList);
            
            const roleTable = await Role.findAll({ where: {role_dept: dept.assignedDept}});
            
            let roleList = [];
            roleTable.forEach((item) => {
                let row = JSON.parse(JSON.stringify(item));
                roleList.push(row.job_title);
            });
            const role = await inquirerPrompts.newEmp.assignRole(roleList);
            const updatedEmployeeRole = await Employee.update({employee_role: role.assignedRole}, {where: {id: targetId}});

            console.log('');
            console.log('Updated', selection.chooseOrNew + "'s department and role!");
            console.log('');
            // break;

        // case 'Change Manager': 
            let assignedManager;
            const managerInput = await inquirerPrompts.newEmp.assignManager();
            if (typeof managerInput.identifier == "number") {
                targetId = managerInput.identifier
            } else {
                let manIdList = [];
                let manNameList = [];
                const nameTable = await Employee.findAll({ where: {last_name: managerInput.identifier}});
        
                if (nameTable.length == 0) {
                    console.log ('Sorry, no employee by that name seems to exist.')
                    targetId = null;
                } else {
                    nameTable.forEach((item) => {
                        let row = JSON.parse(JSON.stringify(item));
                        manIdList.push(row.id);
                        manNameList.push(`${row.last_name}, ${row.first_name}`);
                    });
                    const selection = await inquirerPrompts.alreadyExists.chooseEmployeeOrMakeNew(managerInput.identifier, manNameList);
                    const manNameIndex = manNameList.indexOf(selection.chooseOrNew)
                    targetId = manIdList[manNameIndex]
                }
            }
            if (targetId !== null) {
                const managerJSON = await Employee.findOne({ where: {id: targetId}});
                assignedManager = JSON.parse(JSON.stringify(managerJSON));
            }

            const updatedEmployeeManager = await Employee.update({ manager: assignedManager.last_name}, {where: {id: targetId}})

            console.log('');
            console.log('Updated', selection.chooseOrNew + "'s manager!");
            console.log('');
            
    // }
    
    if (returnToMain) mainMenu();

}

//-----------------

//"Update employee role": [TARGET: UPDATE_EMP_ROLE]
//  Prompt for role name ID to change to
//  Check to see if role exists in database (Error options: Add [GOTO: ADD_ROLE_CONF]/Retry/Cancel)
//  Confirm role name and ID to update to (Retry [GOTO: UPDATE_EMP_ROLE]/Cancel) [TARGET: UPDATE_EMP_CONF]
//  Prompt what to update (Role/Manager/Cancel)

async function updateEmpRole(empID, returnToMain) {
    const reassignedDept = deptAssign();
    const reassignedRole = roleAssign(reassignedDept);
    const updatedEmp = {
        ...empID,
        ...reassignedDept,
        ...reassignedRole
    };

    console.log('');
    console.log('Updated', updatedEmp.name + "'s department and role!");
    console.log('');
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