# TheChatApp 💬

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.IO.

## 🎯 Features

- ✅ **Real-time Messaging** - Instant chat with WebSocket support via Socket.IO
- ✅ **User Authentication** - Secure login and registration with JWT tokens
- ✅ **Server & Channel System** - Create servers and channels like Discord
- ✅ **User Profiles** - Upload profile pictures via Cloudinary
- ✅ **Redis Caching** - Fast data retrieval with Redis
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Message History** - Load previous messages with pagination

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time WebSocket
- **Redis** - Caching layer
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage

---

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Redis Cloud account
- Cloudinary account
- Git

### Clone Repository
```bash
git clone <repository-url>
cd TheChatApp
```

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required variables:
```env
SERVER_PORT=8080
dbUsername=<mongodb-username>
dbPassword=<mongodb-password>
saltCount=14
privateKey=<your-jwt-secret-min-32-chars>
FRONTEND_URL=http://localhost:5173
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
redisCloudPassword=<your-redis-password>
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
VITE_SERVERURL=http://localhost:8080
VITE_VERSION_LIVE=/api/v2
```

4. Start development server:
```bash
npm run dev
```

App will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
TheChatApp/
├── backend/
│   ├── database/
│   │   ├── database.js          # MongoDB connection
│   │   ├── managedata.js        # Database queries
│   │   ├── schema/              # Mongoose schemas
│   │   ├── managedata/          # Data management
│   │   └── default/             # Default data setup
│   ├── routes/
│   │   ├── v2/
│   │   │   ├── auth.js          # Authentication routes
│   │   │   ├── user.js          # User routes
│   │   │   ├── server.js        # Server routes
│   │   │   └── other.js         # Other routes
│   │   └── manageroutes.js      # Route management
│   ├── sockets/
│   │   └── managesocket.js      # Socket.IO handlers
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env                     # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── authComponents/  # Login, Register
│   │   │   ├── chatPageComponents/  # Chat UI
│   │   │   ├── homePageComponents/  # Home page
│   │   │   ├── userComponents/  # User profile/settings
│   │   │   └── otherComponents/ # Error, Loading pages
│   │   ├── main.jsx             # App entry point
│   │   └── index.css            # Global styles
│   ├── vite.config.js           # Vite configuration
│   ├── package.json
│   ├── index.html
│   └── .env.local               # Environment variables
│
├── THINGSWRONGWITHIT.md         # Code audit report
└── aireadme.md                  # This file
```

---

## 🚀 Getting Started

### 1. First Time Setup

```bash
# Backend
cd backend
npm install
# Update .env with your credentials
npm start

# In another terminal - Frontend
cd frontend
npm install
npm run dev
```

### 2. Create Your Account

1. Go to `http://localhost:5173`
2. Click "Register"
3. Create username and password
4. You'll be automatically logged in

### 3. Use the App

- Click the **+** button to create a new server
- Click on a server to see channels
- Select a channel to start chatting
- Click your profile icon to upload a profile picture

---

## 📝 API Endpoints

### Authentication
- `POST /api/v2/register` - Register new user
- `POST /api/v2/login` - Login user
- `GET /api/v2/@me` - Get current user info

### User
- `GET /api/v2/@me/serverList` - Get user's servers
- `POST /api/v2/@me/updateUsername` - Update username
- `POST /api/v2/@me/updateProfilePicture` - Update profile pic

### Server
- `POST /api/v2/s/createServer` - Create new server
- `POST /api/v2/s/joinServer` - Join server with invite code
- `GET /api/v2/s/getserverdata/:serverId` - Get server data
- `GET /api/v2/s/getmessage/:serverId/:channelId` - Get messages

### Channels
- `POST /api/v2/s/:serverId/createChannel` - Create channel
- `DELETE /api/v2/s/:serverId/:channelId` - Delete channel

---

## 🔌 Socket.IO Events

### Client → Server
- `joinServer` - Join a server/channel
- `joinUserUpdates` - Listen for user updates
- `{serverId}/{channelId}` - Send message to channel

### Server → Client
- `{userId}` - User update event
- `{serverId}/{channelId}` - Receive message from channel

---

## 🔐 Security Considerations

⚠️ **Important**: This project has several security issues documented in `THINGSWRONGWITHIT.md`:

### Critical Issues to Fix:
1. **Weak JWT Secret** - Change `privateKey` to a strong 32+ character string
2. **No Rate Limiting** - Add protection against brute-force attacks
3. **Missing Input Validation** - Sanitize all user inputs
4. **No HTTPS** - Use HTTPS in production with secure cookies
5. **Missing Error Handling** - Some API calls don't have try-catch

See `THINGSWRONGWITHIT.md` for detailed security audit and fixes.

---

## 🐛 Known Issues

### Frontend
- Multiple `useState` hooks causing unnecessary re-renders
- No error boundaries - app crashes on component errors
- Hardcoded API endpoints scattered throughout
- Missing input sanitization (XSS vulnerability)
- No pagination for messages (memory leak with large convos)

### Backend
- No rate limiting on auth endpoints
- Weak JWT implementation
- Missing request validation middleware
- Console.log statements in production code
- No error handling middleware

### See Full Audit
Check `THINGSWRONGWITHIT.md` for comprehensive list of 50+ issues and recommended fixes.

---

## 📋 Environment Variables

### Backend (.env)
```env
SERVER_PORT              # Express server port (default: 8080)
dbUsername              # MongoDB username
dbPassword              # MongoDB password
saltCount               # Bcrypt salt rounds (default: 14)
privateKey              # JWT secret key (min 32 characters)
FRONTEND_URL            # Frontend URL for CORS
CLOUDINARY_API_SECRET   # Cloudinary API secret key
redisCloudPassword      # Redis Cloud password
```

### Frontend (.env.local)
```env
VITE_SERVERURL          # Backend server URL
VITE_VERSION_LIVE       # API version path (default: /api/v2)
```

---

## 🧪 Testing

### Manual Testing
1. Create 2 accounts
2. Create a server
3. Share invite code with another user
4. Send messages between accounts
5. Upload profile picture
6. Create multiple channels

### Load Testing
- Use tools like Apache JMeter for stress testing
- Monitor Redis and MongoDB performance

---

## 📊 Database Schema

### User Schema
```javascript
{
  _id: String,
  username: String,
  password: String (hashed),
  userprofileurl: String,
  userid: String,
  servers: [String],
  createdDate: String,
  lastUpdated: Number
}
```

### Server Schema
```javascript
{
  _id: String,
  serverId: String,
  name: String,
  ownerId: String,
  members: [String],
  admins: [String],
  channels: [String],
  createdDate: String,
  isDeleted: Boolean
}
```

### Channel Schema
```javascript
{
  _id: String,
  channelId: String,
  serverId: String,
  name: String,
  members: [String],
  createdDate: String,
  isDeleted: Boolean
}
```

### Message Schema
```javascript
{
  _id: String,
  messageId: String,
  serverId: String,
  channelId: String,
  userId: String,
  message: String,
  date: String,
  displayDate: String,
  userprofileurl: String,
  username: String
}
```

---

## 🚀 Deployment

### Heroku / Railway / Render

1. **Backend Deployment**
   - Create account on hosting platform
   - Connect GitHub repository
   - Set environment variables
   - Deploy

2. **Frontend Deployment**
   - Build: `npm run build`
   - Deploy to Vercel/Netlify
   - Update `VITE_SERVERURL` to production backend URL

3. **Database**
   - Use MongoDB Atlas for cloud database
   - Use Redis Cloud for caching

---

## 📚 Useful Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## ⚡ Performance Optimization Roadmap

- [ ] Implement pagination for messages
- [ ] Add virtual scrolling with react-window
- [ ] Migrate user data to React Context
- [ ] Add useCallback to event handlers
- [ ] Implement useMemo for expensive operations
- [ ] Add message caching with React Query
- [ ] Optimize images with Cloudinary transformations
- [ ] Add service worker for offline support

---

## 🔄 Improvement Priority

### Immediate (Critical)
1. Fix JWT secret strength
2. Add rate limiting
3. Add input validation/sanitization
4. Add error handling

### Soon (High)
1. Add pagination for messages
2. Migrate to Context API
3. Add error boundaries
4. Add logging system

### Later (Medium)
1. Add TypeScript
2. Add testing
3. Improve folder structure
4. Add API documentation

---

## 📞 Support

For issues or questions:
1. Check `THINGSWRONGWITHIT.md` for known issues
2. Review error messages in browser console
3. Check backend logs: `npm start` output

---

## 📄 License

This project is for educational purposes.

---

## ✍️ Author

Built with ❤️ by Aryan

**Last Updated**: March 2026

---

## 📖 Additional Documentation

- **Code Audit Report**: See `THINGSWRONGWITHIT.md` for detailed security and performance analysis
- **React Hooks Guide**: Best practices for hooks used in this project
- **API Documentation**: Detailed endpoint specifications

