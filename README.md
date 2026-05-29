# 💬 ChatApp — React Native Chat Application

A real-time chat application built with **React Native (Expo)**, **Node.js**, **Socket.io**, and **MongoDB Atlas**.

> Built as part of a React Native Developer assignment.

---

## 📱 Screenshots

> *(Add screenshots here after running the app)*

---

## ✨ Features

- 🔐 **User Authentication** — Register & login with JWT. Session persists across app restarts.
- ⚡ **Real-time Messaging** — WebSocket-based chat using Socket.io
- 🗄️ **Chat History** — Messages stored in MongoDB Atlas, loaded on every open
- 💬 **Message Bubbles** — Own messages (right, indigo) vs others (left, dark) with sender name + timestamp
- 🟢 **Connection Indicator** — Live status bar showing socket connection state
- 🚪 **Logout** — Clears session; next user starts fresh
- 📱 **Dark Theme UI** — Clean, modern dark interface throughout

---

## 🛠️ Tech Stack

### Mobile App
| Technology | Purpose |
|---|---|
| React Native (Expo SDK 56) | Mobile app framework |
| React Navigation (Stack) | Screen navigation |
| Socket.io-client | Real-time WebSocket communication |
| AsyncStorage | JWT token persistence |
| Axios | REST API calls |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| Socket.io | WebSocket server |
| MongoDB Atlas | Users + message history storage |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Render.com | Cloud hosting |

---

## 📁 Project Structure

```
react-native-chat/
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # Register & login logic
│   │   └── messageController.js  # Fetch chat history
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema (bcrypt hashed password)
│   │   └── Message.js            # Message schema
│   ├── routes/
│   │   ├── auth.js               # POST /api/auth/register, /login
│   │   └── messages.js           # GET /api/messages
│   ├── services/
│   │   └── socketService.js      # Socket.io events & JWT auth
│   └── server.js                 # Express + Socket.io entry point
│
└── mobile/
    ├── src/
    │   ├── screens/
    │   │   ├── LoginScreen.js     # Login with inline validation
    │   │   ├── RegisterScreen.js  # Register with inline validation
    │   │   └── ChatScreen.js      # Real-time chat UI
    │   ├── components/
    │   │   ├── MessageBubble.js   # Chat bubble (own/other styling)
    │   │   └── ConnectionStatus.js # Socket status indicator
    │   ├── hooks/
    │   │   ├── useSocket.js       # Socket connection lifecycle
    │   │   └── useMessages.js     # Message state + history loading
    │   ├── services/
    │   │   ├── api.js             # Axios REST client
    │   │   └── socket.js          # Socket.io client setup
    │   ├── utils/
    │   │   └── storage.js         # AsyncStorage helpers
    │   ├── navigation/
    │   │   └── AppNavigator.js    # Stack navigator + auth check
    │   └── theme.js               # Shared dark theme color tokens
    └── App.js
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- Expo Go app on your Android phone (or Android emulator)
- MongoDB Atlas account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/amrita-de/Chat-application.git
cd Chat-application
```

### 2. Set up the backend
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/chatapp?retryWrites=true&w=majority
JWT_SECRET=your-long-random-secret
PORT=3000
```

```bash
npm install
npm run dev
```

You should see:
```
Server running on port 3000
MongoDB connected
```

### 3. Set up the mobile app

Find your local IP (`ipconfig` on Windows, `ifconfig` on Mac/Linux).

Edit `mobile/src/services/api.js`:
```js
export const BASE_URL = 'http://YOUR_LOCAL_IP:3000';
```

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone.

> ⚠️ Your phone and PC must be on the same WiFi network.

---

## ☁️ Deployment

### Backend → Render.com
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, set **Root Directory** to `backend`
4. Add environment variables: `MONGO_URI` and `JWT_SECRET`
5. Build: `npm install` | Start: `npm start`
6. Copy your Render URL → update `BASE_URL` in `mobile/src/services/api.js`

**Live backend:** `https://YOUR_RENDER_URL.onrender.com` *(update after deploy)*

---

## 📹 Screen Recording

> 🎬 **Demo video:** [Watch on Loom](https://www.loom.com/share/e869bff493664463ba3b08147401d759)

The recording shows two users logged in simultaneously on separate devices, sending and receiving messages in real time.

---

## 📦 APK Download

> 📲 **Download APK:** [Download latest build](https://expo.dev/artifacts/eas/s9oJFHeLaPqQ9n56mhCKkb.apk)

Built with EAS Build (Expo). Install directly on any Android device.

### Build it yourself:
```bash
cd mobile
npm install -g eas-cli
eas login      # requires free expo.dev account
eas build --platform android --profile preview
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Create new user |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/messages` | Bearer JWT | Get last 100 messages |
| WS | `/` (Socket.io) | JWT via handshake | Real-time messaging |

### Socket Events
| Event | Direction | Description |
|---|---|---|
| `send_message` | Client → Server | Send a message `{ content }` |
| `receive_message` | Server → Client | Broadcast to all users |

---

## 👩‍💻 Author

**Amrita De**
- GitHub: [@amrita-de](https://github.com/amrita-de)
- LinkedIn: [amrita-de-67162a30b](https://linkedin.com/in/amrita-de-67162a30b)
