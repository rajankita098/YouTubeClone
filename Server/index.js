import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import videoroutes from './Routes/video.js';
import userroutes from "./Routes/User.js";
import commentroutes from './Routes/comment.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';
import { Server } from 'socket.io';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ Allow both localhost and production frontend
const allowedOrigins = [
    "http://localhost:3000",
    "https://your-tube-01.netlify.app"
];

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// Socket.IO signaling handlers
io.on('connection', socket => {
    console.log('New user connected:', socket.id);

    socket.on('join-room', roomId => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('offer', (roomId, offer) => {
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', (roomId, answer) => {
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('ice-candidate', (roomId, candidate) => {
        socket.to(roomId).emit('ice-candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// ✅ Updated CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json());

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send("YourTube is working");
});
app.use('/user', userroutes);
app.use('/video', videoroutes);
app.use('/comment', commentroutes);

// Optional: for screen sharing support
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    next();
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});

// DB connection
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL)
    .then(() => {
        console.log("MongoDB Database connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
