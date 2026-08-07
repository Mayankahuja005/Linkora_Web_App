# Linkora Web App

## Overview
Linkora is a MERN Stack based social networking web application that allows users to connect with others in a simple and secure way. Users can create an account, manage their profile, send connection requests, and communicate through real-time audio and video calls. The application provides a clean, responsive, and user-friendly interface for a smooth social networking experience.

---

## Features
- User Registration & Login
- Secure JWT Authentication
- Create and Update Profile
- Send, Accept, and Reject Connection Requests
- View My Connections
- Real-time Audio Calling
- Real-time Video Calling
- Responsive User Interface
- Secure Backend APIs

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- Bcrypt

---

## Project Structure

```
Linkora/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── Backend/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── socket/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Installation

### Step 1
Clone the repository.

```bash
git clone <repository-link>
```

### Step 2
Move to the backend folder.

```bash
cd Backend
```

### Step 3
Install backend dependencies.

```bash
npm install
```

### Step 4
Create a `.env` file.

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

### Step 5
Start the backend server.

```bash
npm run dev
```

### Step 6
Open a new terminal and move to the frontend folder.

```bash
cd Frontend
```

### Step 7
Install frontend dependencies.

```bash
npm install
```

### Step 8
Start the frontend.

```bash
npm run dev
```

---

## Working

1. User creates an account or logs in.
2. JWT authenticates every protected request.
3. Users can update their profile.
4. Connection requests can be sent and accepted.
5. Connected users appear in **My Connections**.
6. Users can start real-time audio or video calls.
7. Socket.IO handles live communication between users.

---

## Future Improvements
- Chat Messaging
- Screen Sharing
- Call History
- Group Calling
- Notifications

---

## Author

**Mayank Ahuja**
- B.Tech CSE (AI & ML)
- MERN Stack Developer
