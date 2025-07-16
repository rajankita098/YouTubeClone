import express from "express"
import { likevideocontroller } from "../Controllers/like.js";
import { viewscontroller } from "../Controllers/views.js";
import { uploadvideo, getallvideos, deleteVideoById, downloadVideo } from "../Controllers/video.js"; // ➕ downloadVideo
import { historycontroller, deletehistory, getallhistorycontroller } from "../Controllers/History.js";
import { watchlatercontroller, getallwatchlatervontroller, deletewatchlater } from "../Controllers/watchlater.js";
import { likedvideocontroller, getalllikedvideo, deletelikedvideo } from "../Controllers/likedvideo.js";
import upload from "../Helper/filehelper.js";
import auth from "../middleware/auth.js";

const routes = express.Router();

routes.post("/uploadvideo", auth, upload.single("file"), uploadvideo);
routes.get("/getvideos", getallvideos);
routes.patch('/like/:id', auth, likevideocontroller);
routes.patch('/view/:id', viewscontroller);
routes.delete("/deletevideo/:id", auth, deleteVideoById);

// 🔽 New download route

// Route for downloading a video
routes.get("/download/:id", auth, async (req, res) => {
    // console.log("Auth Token:", req.headers.authorization); // Log the token to check it's being passed correctly

    try {
        // Call the download function, no need to catch here as it's already handled in the function itself
        await downloadVideo(req, res);
    } catch (error) {
        console.error("Download failed:", error);
        res.status(500).json({ message: "Download failed", error: error.message });
    }
});

routes.post('/history', auth, historycontroller);
routes.get('/getallhistory', getallhistorycontroller);
routes.delete('/deletehistory/:userid', auth, deletehistory);

routes.post('/watchlater', auth, watchlatercontroller);
routes.get('/getallwatchlater', getallwatchlatervontroller);
routes.delete('/deletewatchlater/:videoid/:viewer', auth, deletewatchlater);

routes.post('/likevideo', auth, likedvideocontroller);
routes.get('/getalllikevide', getalllikedvideo);
routes.delete('/deletelikevideo/:videoid/:viewer', auth, deletelikedvideo);

export default routes;
