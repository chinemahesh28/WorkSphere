# 🚀 WorkSphere: Enterprise Workforce Management System

WorkSphere is a high-performance, role-based workforce and training management system designed to streamline organizational operations. It bridges the gap between administrators, analysts, trainers, and counsellors, providing a unified platform for managing students, batches, and professional development.

---

## 🌟 Key Features

### 🔐 Secure Multi-Role Authentication
- Robust JWT-based authentication system.
- Permission-based routing ensuring data integrity and security.
- Comprehensive user registration and login workflows.

### 👥 Role-Based Functionalities

#### 👑 **Administrator** (Full System Control)
- **Insightful Dashboards**: Interactive cards displaying total staff, active users, and financial overviews.
- **Dynamic Staff Management**: Comprehensive CRUD operations for Analysts, Counsellors, and Trainers with built-in search and status filtering.
- **Resource Distribution**: Visual feedback on staff specializations and expertise levels.

#### 📊 **Analyst** (Planning & Operations)
- **Batch Lifecycle Management**: Full control over batch creation, status tracking, and curriculum mapping.
- **Operational Analytics**: Monitor batch health metrics and delivery timelines.
- **Smart Search**: Quickly locate specific batches or timelines using advanced filtering.

#### 🤝 **Counsellor** (Student Success & Relationship)
- **Student Lifecycle Management**: Manage students from registration to graduation with detailed profile tracking.
- **Flexible Assignments**: Real-time assignment of students to batches and trainers to squads.
- **Status Monitoring**: Visual indicators for student progress and engagement levels.

#### 🎓 **Trainer** (Education & Delivery)
- **Daily Progress Logs**: Streamlined interface for reporting daily topics, attendance, and assessment results.
- **Digital Gradebook**: Centralized management of student performance records.
- **Engagement Insights**: Personal dashboards to track batch performance trends over time.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, Lucide Icons, Headless UI |
| **Backend** | Java 11/17, Spring Boot 3.4.3, Spring Security (JWT), Spring Data JPA |
| **Database** | MySQL 8.0+ |
| **Build Tools** | Maven, NPM/Yarn |

---

## 📁 Project Structure

```bash
WorkSphere/
├── Backend/                 # Spring Boot API Application
│   ├── src/main/java       # Source code (Controllers, Services, Models)
│   ├── src/main/resources  # Config (application.properties, SQL)
│   └── pom.xml             # Maven dependencies
├── Frontend/                # React Vite Application
│   ├── src/pages           # Role-based page structures (Admin, Trainer, etc.)
│   ├── src/components      # Reusable UI components
│   ├── src/context         # State management (AuthContext)
│   └── package.json        # Frontend dependencies
└── README.md                # Project documentation
```

---

## ⚙️ Installation & Setup

### Backend (Spring Boot)
1. **Database Setup**:
   - Create a MySQL database: `CREATE DATABASE worksphere;`.
2. **Environment Configuration**:
   - Update `Backend/src/main/resources/application.properties` with your database credentials.
   - Recommended: Use environment variables `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET`.
3. **Execution**:
   ```bash
   cd Backend
   mvn spring-boot:run
   ```

### Frontend (React + Vite)
1. **Dependency Installation**:
   ```bash
   cd Frontend
   npm install
   ```
2. **Launch Development Server**:
   ```bash
   npm run dev
   ```
3. **Access Application**:
   - The UI will be available at `http://localhost:5173` (default Vite port).

---

## 🛡 Security & Best Practices
- **Data Isolation**: Multi-tenant architecture that scopes data to the relevant parent administrator.
- **JWT Security**: All API requests are protected via Bearer tokens.
- **Input Validation**: Robust validation on both client and server sides to ensure data quality.
- **Git Safety**: Extensive `.gitignore` to prevent leakage of IDE settings, local logs, and sensitive credentials.

---

## 🗺 API Roadmap
- [x] JWT Authentication & Role-Based Access.
- [x] Batch & Student CRUD operations.
- [x] Trainer-Batch assignment logic.
- [ ] Automated Email Notifications for students.
- [ ] Exportable PDF Reports for batch performance.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by [chinemahesh28](https://github.com/chinemahesh28)
