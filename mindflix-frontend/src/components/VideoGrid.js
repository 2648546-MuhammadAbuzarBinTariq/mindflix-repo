import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";

const VideoGrid = ({ username }) => {
  const [videos, setVideos] = useState({});
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoResponse = await axios.get("http://localhost:8002/metadata/all-videos");
        setVideos(videoResponse.data);

        if (username) {
          const favResponse = await axios.get(`http://localhost:8001/auth/favourites/${username}`);
          setFavourites(favResponse.data.favourites);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [username]);

  const handleAddToFavourites = async (video) => {
    if (!username) {
      alert("Please log in to add videos to MyCollection.");
      return;
    }
    try {
      await axios.post("http://localhost:8001/auth/add-to-favourites", {
        username,
        video,
      });
      alert("Added to MyCollection!");
      // Refresh favourites after successful addition
      const favResponse = await axios.get(`http://localhost:8001/auth/favourites/${username}`);
      setFavourites(favResponse.data.favourites);
    } catch (error) {
      console.error("Error adding to favourites:", error);
      alert("Failed to add to MyCollection.");
    }
  };

  return (
    <div>
      {/* MyCollection Section */}
      {favourites.length > 0 && (
        <div>
          <h2>My Collection</h2>
          <div className="video-grid">
            {favourites.map((video) => (
              <div key={video.video_id}>
                <h3>{video.title}</h3>
                <VideoPlayer videoUrl={`https://d2ovbhychdxdcx.cloudfront.net/${video.video_id}.m3u8`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos by Categories */}
      {Object.keys(videos).map((category) => (
        <div key={category}>
          <h2>{category}</h2>
          <div className="video-grid">
            {videos[category].map((video) => (
              <div key={video.video_id}>
                <h3>{video.title}</h3>
                <VideoPlayer videoUrl={`https://d2ovbhychdxdcx.cloudfront.net/${video.video_id}.m3u8`} />
                {username && (
                  <button onClick={() => handleAddToFavourites(video)}>
                    Add to MyCollection
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
