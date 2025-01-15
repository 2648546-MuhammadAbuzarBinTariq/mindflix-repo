import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest loaded, starting playback");
      });

      return () => {
        hls.destroy(); // Cleanup HLS instance
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For browsers with native HLS support (e.g., Safari)
      videoRef.current.src = videoUrl;
    } else {
      console.error("This browser does not support HLS.");
    }
  }, [videoUrl]);

  return (
    <div>
      <video
        ref={videoRef}
        controls
        style={{ width: "100%", maxHeight: "500px" }}
      />
    </div>
  );
};

export default VideoPlayer;
