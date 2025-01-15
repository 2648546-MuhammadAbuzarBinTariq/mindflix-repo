import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = ({ username }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8004/profile/${username}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Unable to fetch profile details. Please try again later.");
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (!username) {
    return <p>Please log in to view your profile.</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
      
    </div>
  );
};

export default Profile;
