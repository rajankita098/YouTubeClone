import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./CallRoom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDisplay,
  faStop,
  faRecordVinyl,
  faCircleStop,
  faVolumeMute,
  faVideoSlash,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons";

const socket = io("https://your-tube-4yf7.onrender.com/");

const CallRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const screenShareRef = useRef(null);

  const ICE_SERVERS = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    if (!joined) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", roomId, event.candidate);
      }
    };

    socket.on("user-joined", async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", roomId, offer);
    });

    socket.on("offer", async (offer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", roomId, answer);
    });

    socket.on("answer", async (answer) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding received ice candidate", err);
      }
    });

    return () => {
      pc.close();
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [joined, roomId]);

  useEffect(() => {
    if (isScreenSharing && screenShareRef.current && screenStreamRef.current) {
      screenShareRef.current.srcObject = screenStreamRef.current;
    }
  }, [isScreenSharing]);

  const joinRoom = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Store the local stream in the ref
      localStreamRef.current = localStream;

      // Ensure the localVideoRef is set and then assign the stream to it
      if (localVideoRef.current) {
        // Use requestAnimationFrame to ensure that the video is rendered before we set the srcObject
        requestAnimationFrame(() => {
          localVideoRef.current.srcObject = localStream;
        });
      } else {
        // console.error("localVideoRef is not set correctly");
      }

      // Get the video track from the local stream
      cameraTrackRef.current = localStream.getVideoTracks()[0];

      // Emit the event to join the room
      socket.emit("join-room", roomId);

      // Set the joined state
      setJoined(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  useEffect(() => {
    // Ensure that the local video element is ready before trying to set the srcObject
    if (localVideoRef.current && localStreamRef.current) {
      requestAnimationFrame(() => {
        localVideoRef.current.srcObject = localStreamRef.current;
      });
    }
  }, [localStreamRef.current]); // The effect depends on the localStreamRef

  const startScreenSharing = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = screenStream;

      const screenTrack = screenStream.getVideoTracks()[0];

      // Replace the track in peer connection
      const sender = peerConnectionRef.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender) {
        sender.replaceTrack(screenTrack);
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      setIsScreenSharing(true);

      // Delay setting the video stream to let JSX render
      setTimeout(() => {
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
      }, 0);

      screenTrack.onended = stopScreenSharing;
    } catch (err) {
      console.error("Error starting screen sharing:", err);
    }
  };

  const stopScreenSharing = () => {
    const screenTrack = screenStreamRef.current?.getVideoTracks()[0];
    if (screenTrack) {
      screenTrack.stop();
      localStreamRef.current.removeTrack(screenTrack);
    }

    if (cameraTrackRef.current) {
      localStreamRef.current.addTrack(cameraTrackRef.current);
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    setIsScreenSharing(false);
  };

  const startTabRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recording.webm";
        a.click();
        URL.revokeObjectURL(url);
        recordedChunksRef.current = [];
      };

      mediaRecorderRef.current.start();

      stream.getVideoTracks()[0].addEventListener("ended", stopTabRecording);
      console.log("Tab recording started");
    } catch (err) {
      console.error("Failed to start tab recording:", err);
    }
  };

  const stopTabRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      console.log("Tab recording stopped");
    }
  };

  // Toggle handler
  const handleToggleRecording = () => {
    if (isRecording) {
      stopTabRecording();
    } else {
      startTabRecording();
    }
    setIsRecording(!isRecording);
  };

  const muteAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (cameraTrackRef.current) {
      cameraTrackRef.current.enabled = !cameraTrackRef.current.enabled;
      setIsCameraOff(!isCameraOff);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    socket.emit("end-call", roomId);
    setJoined(false);
  };

  return (
    <div className="call-room-container">
      {!joined ? (
        <div className="join-container">
          <input
            type="text"
            className="room-input"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room Code"
          />
          <button className="join-button" onClick={joinRoom}>
            Join Room
          </button>
        </div>
      ) : (
        <>
          <div className="video-container">
            <video
              ref={remoteVideoRef}
              className="remote-video"
              autoPlay
              playsInline
            />
            <video
              ref={localVideoRef}
              className="local-video"
              autoPlay
              muted
              playsInline
            />
          </div>

          <div className="button-group">
            <button className="icon-button" onClick={toggleCamera}>
              <FontAwesomeIcon icon={faVideoSlash} />
            </button>
            <button className="icon-button" onClick={muteAudio}>
              <FontAwesomeIcon icon={faVolumeMute} />
            </button>

            <button
              className="icon-button"
              onClick={isScreenSharing ? stopScreenSharing : startScreenSharing}
            >
              <FontAwesomeIcon icon={isScreenSharing ? faStop : faDisplay} />
            </button>
            <button className="icon-button" onClick={handleToggleRecording}>
              <FontAwesomeIcon
                icon={isRecording ? faCircleStop : faRecordVinyl}
              />
            </button> 
            <button className="icon-button" onClick={endCall}>
              <FontAwesomeIcon icon={faPhoneSlash} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CallRoom;
