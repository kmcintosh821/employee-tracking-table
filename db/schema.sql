
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(100) NOT NULL,
    role_dept VARCHAR(100) NOT NULL,
    salary INT NOT NULL
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_name VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    employee_role VARCHAR(100) NOT NULL,
    manager_id INT NOT NULL,
    manager_name VARCHAR(30) NOT NULL
);

INSERT INTO departments (dept_name) VALUES 
    ("Upper Management");
INSERT INTO departments (dept_name) VALUES 
    ("Middle Management");
INSERT INTO departments (dept_name) VALUES 
    ("Basic Employment");

INSERT INTO roles (job_title, role_dept, salary) VALUES ("CEO", "Upper Management", 1000000);
INSERT INTO roles (job_title, role_dept, salary) VALUES ("Director", "Upper Management", 1000000);
INSERT INTO roles (job_title, role_dept, salary) VALUES ("Assistant", "Middle Management", 500000);
INSERT INTO roles (job_title, role_dept, salary) VALUES ("Store Manager", "Middle Management", 500000);
INSERT INTO roles (job_title, role_dept, salary) VALUES ("Clerk", "Basic Employment", 20000);
INSERT INTO roles (job_title, role_dept, salary) VALUES ("Host", "Basic Employment", 20000);


INSERT INTO employees (last_name, first_name, employee_role, manager_id, manager_name) VALUES ("Dugnutt", "Bobson", "CEO", 0, "N/A");
INSERT INTO employees (last_name, first_name, employee_role, manager_id, manager_name) VALUES ("McDichael", "Sleve", "Director", 0, "Dugnutt");
INSERT INTO employees (last_name, first_name, employee_role, manager_id, manager_name) VALUES ("Sweemey", "Onson", "Assistant", 1, "Dugnutt");
INSERT INTO employees (last_name, first_name, employee_role, manager_id, manager_name) VALUES ("Nogilny", "Kevin", "Store Manager", 2, "McDichael");
INSERT INTO employees (last_name, first_name, employee_role, manager_id, manager_name) VALUES ("Dandleton", "Karl", "Clerk", 3, "Sweemey");
INSERT INTO employees (last_name, first_name, employee_role, manager_id, manager_name) VALUES ("Gride", "Jeromy", "Host", 4, "Nogilny");
