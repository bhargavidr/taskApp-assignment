import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function FileUpload({taskId}){

    const [selectedFile, setSelectedFile] = useState(null);
    const{dispathAuth, PORT} = useAuth()

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post(`http://localhost:${PORT}/api/tasks/${taskId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('token')
                }
            });

            if (response.data) {
                console.log('File uploaded successfully:', response.data);
                // dispatchAuth(type:'TASKS',payload:{...tasks, response.data})
            } else {
                console.log('Error uploading file');
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return(
        <div style={{ textAlign: 'right', margin: '0 auto', maxWidth: '500px'  }}>
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleFileUpload}>Upload File</button>
        </div>
            )
}