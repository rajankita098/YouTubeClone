"use strict";
import multer from "multer";

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "uploads"); // Store videos in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        // Generate a unique filename based on the current timestamp
        cb(null, new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname);
    },
});

// File filter to ensure only mp4 video files are uploaded
const filefilter = (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
        cb(null, true); // Allow mp4 videos
    } else {
        cb(null, false); // Reject non-mp4 files
    }
};

// Set up multer with the storage and file filter configurations
const upload = multer({ storage: storage, fileFilter: filefilter });

export default upload;
