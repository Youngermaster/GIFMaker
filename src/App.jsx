import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true })

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])


  // This method converts the MP4 to GIF
  const convertToGif = async () => {
    // write the file to memory
    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'video.mp4', '-t', '4.0', '-ss', '0.5', '-f', 'gif', 'out.gif');

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer]), { type: 'image/gif' });
    setGif(url);
  }

  // Return the App component.
  return ready ? (
    <div className="App">

      <h1>MP4 to GIF Converter</h1>

      <h3>MP4 video</h3>
      {
        video &&

        <video
          controls
          width="350"
          src={URL.createObjectURL(video)}
        ></video>
      }

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <h3>GIF</h3>

      <button onClick={convertToGif}>Convert</button>

      {gif && <img src={gif} width="350" />}

    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
