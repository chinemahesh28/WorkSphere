# WorkSphere

WorkSphere is a comprehensive project management and administrative dashboard designed to streamline operations for organizations managing students, trainers, and counsellors. It provides role-base access to manage batches, assignments, student records, and more.

## Features

- **Role-Based Dashboards**: Tailored experiences for Admins, Trainers, and Counsellors.
- **Data Isolation**: Multi-tenant architecture ensuring safe data boundaries.
- **Student Management**: Track attendance, performance, and assignments.
- **Batch Coordination**: Efficiently manage training cohorts and schedules.
- **Secure Authentication**: Robust JWT-based security for backend and frontend.

## Architecture

The project consists of two main components:

- **Frontend**: A modern, responsive React application built with Vite and Tailwind CSS.
- **Backend**: A scalable Java Spring Boot application with MySQL and RESTful APIs.

## Tech Stack

- **Frontend**: React, Vite, JavaScript/TypeScript, Tailwind CSS
- **Backend**: Java, Spring Boot, Spring Security (JWT), Spring Data JPA
- **Database**: MySQL

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
- [Maven](https://maven.apache.org/download.cgi)
- [MySQL](https://www.mysql.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/chinemahesh28/WorkSphere.git
    cd WorkSphere
    ```

2.  **Frontend Setup:**
    ```bash
    cd Frontend
    npm install
    npm run dev
    ```

3.  **Backend Setup:**
    - Create a database named `worksphere` in MySQL.
    - Configure DB credentials in `Backend/src/main/resources/application.properties`.
    ```bash
    cd ../Backend
    mvn spring-boot:run
    ```

## Security Tip

Avoid hardcoding sensitive information like database passwords and JWT secrets. Use environment variables instead:

- **MySQL Password**: Set `DB_PASSWORD` as an environment variable and reference it in `Backend/src/main/resources/application.properties` as `${DB_PASSWORD}`.
- **JWT Secret**: Use a secure, environment-defined `JWT_SECRET`.

## Development Guidelines

- Use `.gitignore` to protect sensitive information like API keys and database credentials.
- Ensure all new features are implemented with proper role-based checks.
- Maintain consistent coding standards across both frontend and backend modules.

## License

This project is licensed under the MIT License.
