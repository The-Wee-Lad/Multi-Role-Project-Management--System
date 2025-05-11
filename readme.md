# Multi-Role Project Management System

A robust, secure, and scalable REST API for managing projects, tasks, and users within companies using strict role-based access control and multi-tenancy.

## 🚀 Features

- 🔒 JWT-based Authentication (with Refresh Token support)
- 🛂 Role-based Authorization (Admin, Manager, Member)
- 🏢 Multi-Tenancy (Data isolation per company)
- 📁 CRUD for Users, Projects, and Tasks
- 🔍 Task Filtering & Pagination
- 🚧 Centralized Error Handling
- 🛡️ Rate Limiting per IP
- 📋 Modular code structure

---

## 🛠️ Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (access + refresh)
- Joi for validation
- express-rate-limit

---

## 📚 API Endpoints Overview

### 🏢 Company Routes (`/users/company`)

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/users/company` | Register a company |

---

### 👤 Auth & User Routes (`/users`)

| Method | Endpoint                      | Description                   |
| ------ | ----------------------------- | ----------------------------- |
| POST   | `/users/login`                | Login and receive tokens      |
| POST   | `/users/refresh-access-token` | Refresh access token          |
| POST   | `/users/logout`               | Logout user                   |
| POST   | `/users/`                     | Create new user (Admin only)  |
| PATCH  | `/users/`                     | Update current user           |
| GET    | `/users/`                     | Get current user info         |
| DELETE | `/users/`                     | Delete current user           |
| GET    | `/users/list`                 | List users in company (Admin) |
| POST   | `/users/updateTask/:taskId`   | Update task assigned to user  |
| GET    | `/users/get-user-tasks`       | Get user’s assigned tasks     |

---

### 📁 Project Routes (`/projects/:id`)

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| POST   | `/projects/:id` | Create a new project |
| GET    | `/projects/:id` | Get all projects     |
| PATCH  | `/projects/:id` | Update a project     |
| DELETE | `/projects/:id` | Delete a project     |

---

### ✅ Task Routes (`/tasks`)

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| POST   | `/tasks/create`           | Create a new task        |
| PATCH  | `/tasks/:taskId`          | Update an existing task  |
| DELETE | `/tasks/:taskId`          | Delete a task            |
| POST   | `/tasks/assign/:taskId`   | Assign user to task      |
| POST   | `/tasks/unassign/:taskId` | Unassign user from task  |
| POST   | `/tasks/getAllTasks`      | Get tasks (with filters) |

---

## 🔐 Roles & Permissions

| Role    | Users       | Projects    | Tasks             |
| ------- | ----------- | ----------- | ----------------- |
| Admin   | Full access | Full access | Full access       |
| Manager | View only   | Full access | Full access       |
| Member  | No access   | No access   | View & update own |

---

## 🔍 Task Filters

Pass filters in body of `POST /tasks/getAllTasks`:

```json
{
  "status": "In Progress",
  "assignedTo": "user_id"
}
```

---

## 📂 Project Structure

```
src/
├── controllers/
├── routes/
├── models/
├── services/
├── middlewares/
├── validators/
├── utils/
└── app.js
```

---

## 📦 Setup Instructions

1. **Clone the repo:**

   ```bash
   git clone https://github.com/The-Wee-Lad/Multi-Role-Project-Management-System
   cd multi-role-project-mgmt
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` from `.env.example` and configure**

4. **Run the server:**

   ```bash
   npm run dev
   ```

---

## 📬 Postman Collection

[Postman link for 15+ endpoints <img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://www.postman.com/payload-participant-73420966/workspace/the-wee-lad-public-workspace/collection/40788084-a02e4e27-3d7f-4645-8a55-59b06a1acdeb?action=share&creator=40788084&active-environment=40788084-e4e66640-3fbc-43f6-a930-3b861f6afc56)
