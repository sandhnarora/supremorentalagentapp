# Cars Rental Application

This repository contains a **Node.js backend** and a **React.js frontend** for a Cars Rental demo application.  
Follow the instructions below to set up the project on your local machine.

---

## 📦 Dependencies

### Install Node.js & npm
- **Windows/Mac**:  
  1. Download Node.js LTS from [https://nodejs.org](https://nodejs.org)  
  2. Follow the installation wizard.  
  3. Verify installation:
     ```bash
     node -v
     npm -v
     ```

### Install Visual Studio Code
- Download and install from [https://code.visualstudio.com](https://code.visualstudio.com).

---

## 🚀 Project Setup

### 1. Create a Local Directory
```bash
mkdir cars-rental-app
cd cars-rental-app
```

### 2. Open the Directory in VS Code
```bash
code .
```

### 3. Clone the Repository
From VS Code terminal (or system terminal):
```bash
git clone https://github.com/gitfoldername/cloningapp.git
```

---

## ⚙️ Backend Setup (Node.js)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   sudo npm install
   ```

3. Create a `.env` file in the **backend** folder:
   ```env
   CARSRENTAL_GETALL_HOST="<<hostname or ip>>"
   LISTALL_CARS_REDIS_API="/car-service-redis/cars"
   USER_CREATE_ORDER="/order-service/create-order"
   LOGINAUTH_USER="/user-service-redis/authn"
   LISTALL_USERS_REDIS_API="/user-service-redis/users"
   ```

4. Update **server.js**:
   - Find and replace the placeholder `<<config rest api host ip or name>>` with your actual API host/IP.

5. Start the backend server:
   ```bash
   npm run dev
   ```

6. Test API:
   Open in browser:
   ```
   http://CARSRENTAL_GETALL_HOST/LISTALL_CARS_REDIS_API
   ```
   If the response is successful, the backend is running correctly.

---

## 💻 Frontend Setup (React.js)

1. Open a **new terminal** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   sudo npm install
   ```

3. Create a `.env` file in the **frontend** folder:
   ```env
   # Update port if backend runs on a different port
   REACT_APP_BACKEND_SERVICE_IP=http://localhost:5050
   REACT_APP_CARLIST_URL=http://localhost:5050/car-service-redis/cars
   REACT_APP_CARAPP_LOGINAUTH_URL=http://localhost:5050/user-service-redis/authn
   REACT_APP_GET_USER_BY_ID=http://localhost:5050/user-service-redis/users/
   REACT_APP_CREATE_ORDER_API=http://localhost:5050/order-service/create-order
   ```

4. Start the frontend:
   ```bash
   npm start
   ```

5. Open browser at:
   ```
   http://localhost:3000
   ```

---

## ✅ Project Ready

- Backend: [http://localhost:5050](http://localhost:5050)  
- Frontend: [http://localhost:3000](http://localhost:3000)  

Your **Cars Rental Application** is now running locally 🚗💨

---
