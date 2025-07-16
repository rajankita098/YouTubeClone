# YourTube Frontend

This is the frontend application for YourTube, built with React.js and modern web technologies.

## Features

- Video Upload & Management
- User Channels & Subscriptions
- Video Playback with Multiple Qualities
- Real-time Video Calls
- Download System with Premium Integration
- Like/Dislike & Save Videos
- Watch History
- Watch Later
- Responsive Design

## Tech Stack

### Core Technologies

- React.js
- Redux for State Management
- React Router for Navigation
- Socket.IO for Real-time Communication
- Styled Components for Styling
- WebRTC for Video Calls

### Key Dependencies

- @fortawesome/react-fontawesome
- socket.io-client
- fluent-ffmpeg (for video processing)
- axios (for API calls)
- react-redux
- react-router-dom

## Project Structure

```
client/
├── src/
│ ├── Component/ # Reusable React Components 
│ │ ├── Comment/ # Comment components 
│ │ ├── GoPremiumButton.jsx # Premium subscription 
│ │ ├── Leftsidebar/ # Sidebar components 
│ │ ├── Navbar/ # Navigation components 
│ │ ├── Showvideo/ # Video display 
│ │ ├── Showvideogrid/ # Video grid 
│ │ ├── Video/ # Video player 
│ │ └── WHL/ # Watch History/Later 
│ │ │ ├── Pages/ # Page Components 
│ │ ├── Auth/ # Authentication 
│ │ ├── CallRoom/ # Video Call 
│ │ ├── Channel/ # Channel pages 
│ │ ├── Home/ # Home page 
│ │ ├── Library/ # Library page 
│ │ ├── Likedvideo/ # Liked videos 
│ │ ├── Search/ # Search page 
│ │ ├── Videopage/ # Video page 
│ │ ├── Videoupload/ # Video upload 
│ │ └── Yourvideo/ # User's videos 
│ │ │ ├── Reducers/ # Redux Reducers 
│ │ ├── authReducer.js 
│ │ ├── videoReducer.js 
│ │ └── ... 
│ │ │ ├── action/ # Redux Actions 
│ │ ├── authActions.js 
│ │ ├── videoActions.js 
│ │ └── ... 
│ │ │ ├── Api/ # API Service Layer 
│ │ └── index.js 
│ │ │ ├── Allroutes.jsx # Route Configuration 
│ ├── App.js # Main App Component 
│ ├── index.js # Client Entry Point 
│ └── styles/ # Global Styles
```


## Key Features Implementation

### Video Player
- Supports multiple qualities (1080p, 720p, 480p, 320p)
- Real-time quality switching
- Progress bar with time controls
- Volume control
- Fullscreen support

### VoIP Feature
- Real-time video calls using WebRTC
- Screen sharing capability
- Call recording functionality
- Audio/video controls
- Multiple user support

### Download System
- Premium and non-premium download limits
- Quality selection (720p only for downloads)
- Download progress tracking
- File streaming implementation

### Authentication
- User login/register system
- JWT token management
- Protected routes
- Session management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
```bash
git clone [https://github.com/Vashu2003/Your-Tube.git](https://github.com/Vashu2003/Your-Tube.git)
cd Your-Tube/client
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```bash
# Create a .env file in the client directory
REACT_APP_API_URL=http://localhost:5000
```
4. Start the development server:
```bash
npm start
```

### Contributing
1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

### License
This project is licensed under the MIT License - see the LICENSE file for details

### Acknowledgments
1. React Router for routing
2. Socket.IO for real-time features
3. FFmpeg for video processing
