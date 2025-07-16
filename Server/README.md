# YourTube Backend

This is the backend server for YourTube, built with Node.js and Express.js, providing RESTful APIs for video management, user authentication, and real-time features.

## Features

- Video Upload & Management
- User Authentication & Authorization
- Real-time Video Calls
- Video Quality Processing
- Download System with Premium Integration
- Like/Dislike & Save Videos
- Watch History
- Watch Later
- User Channels & Subscriptions

## Tech Stack

### Core Technologies
- Node.js
- Express.js
- MongoDB
- Socket.IO
- FFmpeg (for video processing)

### Key Dependencies
- express
- mongoose
- bcryptjs
- jsonwebtoken
- socket.io
- fluent-ffmpeg
- multer (for file uploads)

## Project Structure
```
Server/ 
├── Controllers/ # API Controllers 
│ ├── Auth.js # Authentication 
│ ├── Comment.js # Comment management 
│ ├── History.js # View history 
│ ├── channel.js # Channel management 
│ ├── like.js # Like management 
│ ├── likedvideo.js # Liked videos 
│ ├── paymentController.js # Payment processing 
│ ├── video.js # Video management 
│ └── views.js # View tracking 
│ ├── Helper/ # Helper Functions 
│ └── filehelper.js # File handling utilities 
│ ├── Models/ # Database Models 
│ ├── Auth.js # User authentication 
│ ├── comment.js # Comment schema 
│ ├── history.js # View history 
│ ├── likevideo.js # Like tracking 
│ ├── videofile.js # Video storage 
│ └── watchlater.js # Watch later list 
│ ├── Routes/ # API Routes 
│ ├── User.js # User routes 
│ ├── comment.js # Comment routes 
│ └── video.js # Video routes 
│ ├── middleware/ # Express Middleware 
│ └── auth.js # Authentication middleware 
│ ├── uploads/ # Video Upload Directory 
│ └── qualities/ # Different quality versions 
│ ├── index.js # Server Entry Point 
├── package.json # Dependencies 
└── .env # Environment Variables    
```

## Key Features Implementation

### Video Processing
- FFmpeg integration for video quality conversion
- Multiple quality versions (1080p, 720p, 480p, 320p)
- Video metadata storage
- File size optimization

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Session management
- Role-based access control

### Real-time Features
- Socket.IO implementation
- Video call signaling
- Screen sharing management
- Call recording functionality

### Download System
- Premium and non-premium download limits
- File streaming implementation
- Download progress tracking
- Quality selection (720p only for downloads)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- FFmpeg
- npm

### Installation
1. Clone the repository:
```bash
git clone [https://github.com/Vashu2003/Your-Tube.git](https://github.com/Vashu2003/Your-Tube.git)
cd Your-Tube/Server
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```bash
# Create a .env file in the root directory
# Add the following variables:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=your_port_number
```
4. Start the server:
```bash
npm start
```
### Available Scripts
- `npm start` - Start the server
- `npm run dev` - Start in development mode with nodemon
- `npm test` - Run tests

### Security Features
- JWT authentication
- Password hashing
- Rate limiting
- Input validation
- File upload security
- CORS configuration

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### License
This project is licensed under the MIT License - see the LICENSE file for details

### Acknowledgments
1. Express.js for web framework
2. MongoDB for database
3. Socket.IO for real-time features
4. FFmpeg for video processing


