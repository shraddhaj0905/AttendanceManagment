import React, { useState } from 'react';
import axios from 'axios';

const OcrUploadImage = () => {
  const [image, setImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState('');
  const [rollNumbers, setRollNumbers] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:4000/api/ocr/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadedImage(response.data.fileName);
      setRollNumbers(response.data.rollNumbers);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>

      {uploadedImage && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={`http://localhost:4000/uploads/${uploadedImage}`} alt="Uploaded" />
        </div>
      )}

      {rollNumbers.length > 0 && (
        <div>
          <h3>Extracted Roll Numbers:</h3>
          <ul>
            {rollNumbers.map((roll, index) => (
              <li key={index}>{roll}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OcrUploadImage;
  