import React, { useState } from 'react';
import axios from 'axios';

function AdminUpload({ username }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file || !title || !category || !description) {
            setStatus('All fields are required!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('username', username); // Include the username in the form data

        try {
            const response = await axios.post('http://localhost:8002/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setStatus(`Upload successful! Video ID: ${response.data.video_id}`);
        } catch (error) {
            console.error("Error uploading video:", error);
            setStatus('Error uploading video. Please try again.');
        }
    };

    if (!username) {
        return <p>You must be logged in as an admin to upload videos.</p>;
    }

    return (
        <div>
            <h2>Admin Upload</h2>
            <form onSubmit={handleUpload}>
                <div>
                    <label>Video File:</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Upload</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}

export default AdminUpload;
