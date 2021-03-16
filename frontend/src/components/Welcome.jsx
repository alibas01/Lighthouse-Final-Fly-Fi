import React from "react";
import { Link } from "react-router-dom";
import welcome from "../styles/scss/welcome.scss"
import VideoLooper from "react-video-looper";

import Button from "./Button";  

export default function Welcome(props) {  
  return(
    <div>
      <Link to='/home'>
        <Button text="Home" disabled={false} />
      </Link>
      <div className="video-container">
        <VideoLooper 
          source='https://github.com/defsax/fly-fi/blob/master/frontend/public/videos/flyfi.mp4?raw=true' 
          start={0} 
          end={10.0} 
          isDebugMode={false}
          autoPlay={true}
        />
      </div>
    </div>
  )
}