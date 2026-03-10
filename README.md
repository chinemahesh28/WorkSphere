# WorkSphere – Employee Management System

## 📌 Overview

**WorkSphere** is a backend-based **Employee Management System** designed to manage employees, administrators, and workplace operations efficiently.
The system allows administrators to manage employee records, track data, and maintain a structured workflow.

This project is built using **Spring Boot** and follows a **RESTful architecture**.

---

## 🚀 Features

* Admin authentication
* Employee management (Add, Update, Delete, View)
* Role-based access
* Secure password encryption
* REST APIs for frontend integration
* Database integration using JPA / Hibernate

---

## 🛠 Tech Stack

### Backend

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security
* Hibernate

### Database

* MySQL

### Tools

* Maven
* Git & GitHub
* Postman (API Testing)

---

## 📂 Project Structure

```
WorkSphere-Backend
│
├── src/main/java/com/example/worksphere
│
├── controller
│   ├── AdminController.java
│   ├── EmployeeController.java
│
├── service
│   ├── AdminService.java
│   ├── EmployeeService.java
│
├── repository
│   ├── AdminRepository.java
│   ├── EmployeeRepository.java
│
├── entity
│   ├── Admin.java
│   ├── Employee.java
│
├── security
│   ├── SecurityConfig.java
│
└── WorkSphereApplication.java
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/worksphere-backend.git
```

### 2️⃣ Navigate to the project

```bash
cd worksphere-backend
```

### 3️⃣ Configure MySQL

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/worksphere
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 4️⃣ Run the project

Using Maven:

```bash
mvn spring-boot:run
```

Or run the main class:

```
WorkSphereApplication.java
```

---

## 📡 API Endpoints

### Admin APIs

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| POST   | `/admin/register` | Register Admin |
| POST   | `/admin/login`    | Admin Login    |

### Employee APIs

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/employee`      | Add Employee       |
| GET    | `/employee`      | Get All Employees  |
| GET    | `/employee/{id}` | Get Employee by ID |
| PUT    | `/employee/{id}` | Update Employee    |
| DELETE | `/employee/{id}` | Delete Employee    |

---

## 🔐 Security

* Password encryption using **BCryptPasswordEncoder**
* Authentication with **Spring Security**
* Secure API access

---

## 🧪 API Testing

You can test APIs using:

* **Postman**
* **Thunder Client**
* **Swagger (if added)**

---

## 📈 Future Improvements

* JWT Authentication
* Role-based access (Admin / Employee)
* Attendance Management
* Leave Management
* Performance Tracking
* Frontend Integration (React)

---

## 👨‍💻 Author

**Mahesh Chine**
B.Tech Computer Science Student
Full Stack Developer (Learning Phase)
