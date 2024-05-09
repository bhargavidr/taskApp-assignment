import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function FileUpload({taskId}){

    const [title,setTitle] = useState("")
    const [file, setFile] = useState("");
    const [allImage, setAllImage] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);

    const{ PORT} = useAuth()

    useEffect(() => {
        const getPdf = async () => {
            const result = await axios.get(`http://localhost:${PORT}/api/tasks/files/${taskId}`,
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
            });
            // console.log(result);
            setAllImage(result.data);
          }
        getPdf();
      }, []);
      
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append('title', title)
        formData.append('file', file)
        // console.log(title, file)
        try {
             const response = await axios.post(`http://localhost:${PORT}/api/tasks/upload/${taskId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: localStorage.getItem('token')
                }
            });
            // console.log(response,'response')
            if (response.data) {
                alert('File uploaded successfully');
                setFile('')
                setTitle('')
            } else {
                console.log('Error uploading file');
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const showPdf = async (pdf) => {
        const url = `http://localhost:${PORT}/api/tasks/files/${pdf}`;
        try{
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
            });
            if(response){
                window.open(url, "_blank", "noreferrer");
                setPdfFile(url);
            }
        }catch(err){
            console.log('Something went wrong',err)
        }
        
      };

    return(
        <div style={{ textAlign: 'left', margin: '0 auto' }}>
            <br />
                <h2>Files</h2>
                <ul style={{ display: 'flex', listStyle: 'none', padding: 0}}>
                    {allImage && allImage.map((data) => {
                            return (
                          <li style={{ marginRight: '10px', marginLeft:'10px'}}>
                                <p><b>Title:</b> {data.title}</p>
                                <button                         
                                onClick={() => showPdf(data.file)} >Show Pdf </button>
                                
                            </li>
                            );
                        })}
                </ul>
            
                    <form onSubmit={handleSubmit}>
                        <input type = "text" 
                            placeholder='Enter title' 
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            required/>

                        <input type="file" 
                                accept="application/pdf" 
                                onChange={(e)=>setFile(e.target.files[0])}
                                 />

                        <input type='submit' />
                    </form>

        </div>
            )
}