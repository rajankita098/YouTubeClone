import axios from "axios";
// https://your-tube-4yf7.onrender.com/
// const API = axios.create({ baseURL: `http://localhost:5000/` });
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});


API.interceptors.request.use((req) => {
    if (localStorage.getItem("Profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token}`;
    }
    return req;
});

// Auth
export const login = (authdata) => API.post("/user/login", authdata);
export const updatechaneldata = (id, updatedata) => API.patch(`/user/update/${id}`, updatedata);
export const fetchallchannel = () => API.get("/user/getallchannel");

// Video Upload & Playback
export const uploadvideo = (filedata) =>
    API.post("/video/uploadvideo", filedata, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getvideos = () => API.get("/video/getvideos");
export const likevideo = (id, Like) => API.patch(`/video/like/${id}`, { Like });
export const viewsvideo = (id) => API.patch(`/video/view/${id}`);
export const downloadVideo = (videoId) =>
    API.get(`/video/download/${videoId}`, {
      responseType: "blob", // Required to receive binary data
    });

// Optionally: Fetch qualities for a video
export const getVideoQualities = (videoId) => API.get(`/video/qualities/${videoId}`);

// Comments
export const postcomment = (commentdata) => API.post("/comment/post", commentdata);
export const deletecomment = (id) => API.delete(`/comment/delete/${id}`);
export const editcomment = (id, commentbody) => API.patch(`/comment/edit/${id}`, { commentbody });
export const getallcomment = () => API.get("/comment/get");

// History
export const addtohistory = (historydata) => API.post("/video/history", historydata);
export const getallhistory = () => API.get("/video/getallhistory");
export const deletehistory = (userid) => API.delete(`/video/deletehistory/${userid}`);

// Liked Videos
export const addtolikevideo = (likedvideodata) => API.post("/video/likevideo", likedvideodata);
export const getalllikedvideo = () => API.get("/video/getalllikevide");
export const deletelikedvideo = (videoid, viewer) => API.delete(`/video/deletelikevideo/${videoid}/${viewer}`);

// Watch Later
export const addtowatchlater = (watchlaterdata) => API.post("/video/watchlater", watchlaterdata);
export const getallwatchlater = () => API.get("/video/getallwatchlater");
export const deletewatchlater = (videoid, viewer) => API.delete(`/video/deletewatchlater/${videoid}/${viewer}`);

// Video Deletion
export const deletevideo = (id) => API.delete(`/video/deletevideo/${id}`);
