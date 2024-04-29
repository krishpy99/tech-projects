import React, { useState } from 'react';
import AWS from 'aws-sdk';
import 'tailwindcss/tailwind.css';
import { nanoid } from 'nanoid'
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [textError, setTextError] = useState('');
  const [fileError, setFileError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileError('');
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    setTextError('');
  };

  const handleS3Upload = async () => {
    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_SECRET_KEY,
      region: process.env.REACT_APP_REGION,
    });

    const params = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      Key: file.name,
      Body: file,
    };

    try {
      let res = await s3.upload(params).promise();
      console.log('File uploaded successfully.', res);
      return res.Location;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Text input validation
    if (!text.trim()) {
      setTextError('Please enter your name.');
      return;
    }

    // File input validation
    if (!file) {
      setFileError('Please choose a file.');
      return;
    }

    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setFileError('File must be a PDF, image, or MP4.');
      return;
    }

    // If all validations pass, upload the file to S3
    var res = await handleS3Upload();

    var dynamoObject = {
      id: nanoid(),
      input_text: text,
      input_file_path: res
    };
    console.log(dynamoObject);

    res = await dynamoDBInsert(dynamoObject);
  };

  const dynamoDBInsert = async (record) => {
    const url = 'https://lilarvf1sf.execute-api.us-west-1.amazonaws.com/prod'; // Replace with your API endpoint

    try {
      const response = await axios.post(url, record, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.data.statusCode !== 200) {
        throw new Error('Failed to insert record');
      }

      const data = response.data;
      console.log('API response:', data);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <header>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-6">
            <label htmlFor="textInput" className="block text-gray-700 text-sm font-bold mb-2">Enter your name:</label>
            <input
              type="text"
              id="textInput"
              value={text}
              onChange={handleTextChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {textError && <p className="text-red-500">{textError}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="fileInput" className="block text-gray-700 text-sm font-bold mb-2">Choose a file:</label>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {fileError && <p className="text-red-500">{fileError}</p>}
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;
