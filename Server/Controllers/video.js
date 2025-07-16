import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import videofile from "../Models/videofile.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import User from "../Models/Auth.js"; // added

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export const uploadvideo = async (req, res) => {
  if (req.file === undefined) {
    return res
      .status(404)
      .json({ message: "Please upload a video file (mp4 only)." });
  }

  try {
    const originalVideoPath = req.file.path;
    const originalVideoSize = req.file.size;

    const file = new videofile({
      videotitle: req.body.title,
      filename: req.file.originalname,
      filepath: originalVideoPath,
      filetype: req.file.mimetype,
      filesize: originalVideoSize,
      videochanel: req.body.chanel,
      uploader: req.body.uploader,
      videoQualities: [],
    });

    await file.save();
    const videoId = file._id.toString();

    const videoQualitiesFolder = path.join(
      __dirname,
      "..",
      "uploads",
      "qualities"
    );
    if (!fs.existsSync(videoQualitiesFolder)) {
      fs.mkdirSync(videoQualitiesFolder, { recursive: true });
    }

    const qualities = [
      { quality: "1080p", bitRate: "1500k", size: "1920x1080" },
      { quality: "720p", bitRate: "1000k", size: "1280x720" },
      { quality: "480p", bitRate: "500k", size: "854x480" },
      { quality: "320p", bitRate: "300k", size: "640x360" },
    ];

    const generateVideoQuality = (quality, outputPath) => {
      return new Promise((resolve, reject) => {
        ffmpeg(originalVideoPath)
          .output(outputPath)
          .videoCodec("libx264")
          .audioCodec("aac")
          .videoBitrate(quality.bitRate)
          .size(quality.size)
          .on("end", () => resolve(outputPath))
          .on("error", reject)
          .run();
      });
    };

    const videoQualities = [];
    for (let q of qualities) {
      const outputPath = path.join(
        videoQualitiesFolder,
        `${videoId}-${q.quality}.mp4`
      );

      try {
        await generateVideoQuality(q, outputPath);
        videoQualities.push({
          quality: q.quality,
          path: `/uploads/qualities/${videoId}-${q.quality}.mp4`,
          filesize: fs.statSync(outputPath).size,
        });
      } catch (error) {
        console.error(`Error generating ${q.quality} video: `, error);
      }
    }

    file.videoQualities = videoQualities;
    await file.save();

    res.status(200).json({
      message: "Video uploaded and processed successfully.",
      videoId: videoId,
    });
  } catch (error) {
    console.error("Error processing video upload: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getallvideos = async (req, res) => {
  try {
    const files = await videofile.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const deleteVideoById = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await videofile.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    if (fs.existsSync(video.filepath)) {
      fs.unlinkSync(video.filepath);
    }

    if (video.videoQualities && Array.isArray(video.videoQualities)) {
      video.videoQualities.forEach((q) => {
        const absolutePath = path.join(__dirname, "..", q.path);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      });
    }

    await videofile.findByIdAndDelete(id);

    res.status(200).json({ message: "Video deleted successfully." });
  } catch (error) {
    console.error("Error deleting video:", error);
    res
      .status(500)
      .json({ message: "Failed to delete video.", error: error.message });
  }
};

export const downloadVideo = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);
    const video = await videofile.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found." });
    }

    const today = new Date().toDateString();
    // if(!user.isPremium) {
    //   const lastDownload = user.lastDownloadDate?.toDateString();
    //   if (lastDownload === today) {
    //     return res.status(403).json({
    //       message: "Download limit reached for today. Upgrade to premium.",
    //     });
    //   }
    //   user.lastDownloadDate = new Date();
    //   await user.save();
    // } 

    const quality = video.videoQualities.find((q) => q.quality === "720p");
    if (!quality) {
      return res.status(404).json({ message: "720p version not available." });
    }

    // Remove leading slash and resolve absolute path
    const relativePath = quality.path.replace(/^\/+/, ""); // remove leading slash
    const absolutePath = path.join(__dirname, "..", relativePath);


    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found on server." });
    }
    return res.download(absolutePath);
    console.log("Downloaded successfully.");
  } catch (error) {
    console.error("Download failed:", error);
    return res
      .status(500)
      .json({ message: "Download failed", error: error.message });
  }
};
