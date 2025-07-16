import React from 'react';
import Describechannel from './Describechannel';
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar';
import Showvideogrid from '../../Component/Showvideogrid/Showvideogrid';
import vid from "../../Component/Video/vid.mp4";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Channel = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  const { channelId } = useParams();
  const vids = useSelector(state => state.videoreducer)?.data
    ?.filter(q => q?.videochanel === channelId)
    .reverse();

  return (
    <div className="container_Pages_App">
      <Leftsidebar />
      <div className="container2_Pages_App">
        <Describechannel
          cid={channelId}
          setvideouploadpage={setvideouploadpage}
          seteditcreatechanelbtn={seteditcreatechanelbtn}
        />
        <Showvideogrid vids={vids} />
      </div>
    </div>
  );
};

export default Channel;
