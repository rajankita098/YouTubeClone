import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";
import Videopage from "./Pages/Videopage/Videopage";
import Channel from "./Pages/Channel/Channel";
import Library from "./Pages/Library/Library";
import Likedvideo from "./Pages/Likedvideo/Likedvideo";
import Watchhistory from "./Pages/Watchhistory/Watchhistory";
import Watchlater from "./Pages/Watchlater/Watchlater";
import Yourvideo from "./Pages/Yourvideo/Yourvideo";
import CallRoom from "./Pages/CallRoom/CallRoom";

const Allroutes = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />

      <Route exact path="/search/:query" element={<Search />} />
      <Route exact path="/videopage/:videoId" element={<Videopage />} />
      <Route
        exact
        path="/channel/:channelId"
        element={
          <Channel
            seteditcreatechanelbtn={seteditcreatechanelbtn}
            setvideouploadpage={setvideouploadpage}
          />
        }
      />

      <Route exact path="/library" element={<Library />} />
      <Route exact path="/liked-videos" element={<Likedvideo />} />
      <Route exact path="/watch-history" element={<Watchhistory />} />
      <Route exact path="/watch-later" element={<Watchlater />} />
      <Route exact path="/your-videos" element={<Yourvideo />} />
      <Route path="/call" element={<CallRoom />} />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default Allroutes;
