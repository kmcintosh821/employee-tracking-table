
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

INSERT INTO roles (job_title, role_dept, salary) VALUES ("CEO", "Upper Management", 1000000);

INSERT INTO employees (last_name, first_name, employee_role, manager_id, manager_name) VALUES ("Smith", "John", "CEO", 1, "Smith");