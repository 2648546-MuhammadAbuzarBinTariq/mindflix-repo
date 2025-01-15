import React from "react";
import VideoGrid from "../components/VideoGrid";

const Home = ({ username }) => {
  return (
    <div className="welcome">
      Welcome To Mindflix
      <span>Explore educational videos on Maths, Science, and Geography.</span>
      <VideoGrid username={username} />
    </div>
  );
};

export default Home;
