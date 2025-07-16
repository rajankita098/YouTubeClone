import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faExpand,
  faCompress,
  faCog,
  faTrashAlt,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "./VideoPlayer.css";
import { deletevideo, downloadVideo } from "../../Api";
import GoPremiumModal from "./GoPremiumModal";

const qualityOptions = ["1080p", "720p", "480p", "320p"];

const VideoPlayer = ({ videoId, user }) => {
  const videoRef = useRef(null);
  const [quality, setQuality] = useState("720p");
  const [videoSrc, setVideoSrc] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [downloadedToday, setDownloadedToday] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false); // State for premium popup visibility

  useEffect(() => {
    if (!user) return;
    const API_URL = process.env.REACT_APP_API_URL;
    const videoPath = `${API_URL}/uploads/qualities/${videoId}-${quality}.mp4`;
    setVideoSrc(videoPath);

    const today = new Date().toDateString();
    const lastDownload = localStorage.getItem("lastDownload");
    setDownloadedToday(lastDownload === today);
  }, [quality, videoId, user]);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleProgressBarChange = (e) => {
    const newTime = e.target.value;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleQualityChange = (selectedQuality) => {
    const wasPlaying = isPlaying;
    const time = videoRef.current.currentTime;

    setQuality(selectedQuality);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        if (wasPlaying) {
          videoRef.current.play();
        }
      }
    }, 200);

    setShowQualityMenu(false);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (confirmDelete) {
      try {
        await deletevideo(videoId);
        alert("Video deleted successfully.");
        // Optional: redirect or update UI
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete the video.");
      }
    }
  };

  const handleDownload = async () => {
    if (!user) {
      alert("You must be logged in to download.");
      return;
    }

    const today = new Date().toDateString();
    const lastDownload = localStorage.getItem("lastDownload");

    if (user.isPremium || lastDownload !== today) {
      try {
        const res = await downloadVideo(videoId);

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${videoId}-720p.mp4`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        if (!user.isPremium) {
          localStorage.setItem("lastDownload", today);
          setDownloadedToday(true);
        }
      } catch (err) {
        console.error("Download error:", err.response?.data || err.message);
        alert(err.response?.data?.message || "Download failed");
      }
    } else {
      // Show the premium modal if the user exceeds the download limit and isn't Premium
      setShowPremiumPopup(true);
    }
  };

  return (
    <div className="video-player-wrapper">
      <video
        ref={videoRef}
        src={videoSrc}
        controls={false}
        className="video-player"
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="custom-video-controls">
        <div className="controls-left">
          <div className="playback-controls">
            <button className="play-pause-btn" onClick={handlePlayPause}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <input
              type="range"
              value={currentTime}
              min="0"
              max={videoRef.current?.duration || 100}
              onChange={handleProgressBarChange}
              className="progress-bar"
            />
          </div>
        </div>

        <div className="controls-right">
          <div className="volume-controls">
            <button
              className="volume-btn"
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
            >
              <FontAwesomeIcon
                icon={volume === 0 ? faVolumeMute : faVolumeUp}
              />
            </button>
            <input
              type="range"
              value={volume}
              min="0"
              max="1"
              step="0.01"
              onChange={handleVolumeChange}
              className="volume-bar"
            />
          </div>

          <div className="download-btn">
            <button
              onClick={handleDownload}
              style={{ color: downloadedToday ? "red" : "white" }}
              title={
                downloadedToday
                  ? "Download limit reached for today"
                  : "Download video"
              }
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>

          <div className="quality-popup-wrapper">
            <button
              className="settings-btn"
              onClick={() => setShowQualityMenu(!showQualityMenu)}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>

            {showQualityMenu && (
              <div className="quality-popup">
                {qualityOptions.map((q) => (
                  <div
                    key={q}
                    className={`quality-option ${
                      q === quality ? "selected" : ""
                    }`}
                    onClick={() => handleQualityChange(q)}
                  >
                    {q}
                  </div>
                ))}
                <div className="dropdown-divider" />
                <div
                  className="quality-option delete-option"
                  onClick={handleDelete}
                >
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    style={{ marginRight: "8px" }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="fullscreen-btn">
            <button onClick={handleFullscreen}>
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            </button>
          </div>
        </div>
      </div>

      {/* Show the Premium Popup if needed */}
      {showPremiumPopup && (
        <GoPremiumModal onClose={() => setShowPremiumPopup(false)} userId={user.id} />
      )}
    </div>
  );
};

export default VideoPlayer;
