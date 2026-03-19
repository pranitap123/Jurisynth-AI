import React, { useState } from "react";
import { FaUpload, FaMicrophoneAlt, FaDownload, FaRedo } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import "./TranscribeAudio.css";

function TranscribeAudio() {

  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const startTranscription = () => {
    if (!audioFile) {
      alert("Upload audio first");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("AI transcription simulation completed");
    }, 3000);
  };

  const resetFile = () => {
    setAudioFile(null);
  };

  return (
    <div className="transcribe-container">

      <h1 className="transcribe-title">
        🎙 AI Legal Audio Transcription
      </h1>

      <p className="transcribe-subtitle">
        Upload courtroom recordings and generate transcripts instantly
      </p>

      {/* Upload Box */}

      <div className="upload-box">

        <FaUpload className="upload-icon"/>

        <h3>Upload Legal Audio</h3>

        <input
          type="file"
          accept="audio/*"
          onChange={handleFile}
        />

        {audioFile && (
          <div className="file-info">

            <p>{audioFile.name}</p>

            <audio controls src={URL.createObjectURL(audioFile)} />

          </div>
        )}

      </div>

      {/* Action Buttons */}

      <div className="action-buttons">

        <button
          className="btn primary"
          onClick={startTranscription}
        >
          <FaMicrophoneAlt/> Start AI Transcription
        </button>

        <button
          className="btn secondary"
          onClick={resetFile}
        >
          <FaRedo/> Reset
        </button>

        <button className="btn outline">
          <FaDownload/> Download Transcript
        </button>

      </div>

      {/* Loader */}

      {loading && (
        <div className="processing">
          <div className="loader"></div>
          <p>AI analyzing audio...</p>
        </div>
      )}

      {/* Feature Cards */}

      <div className="features">

        <div className="feature-card">
          <MdOutlineAnalytics size={28}/>
          <h4>Speaker Detection</h4>
          <p>Identify judge, lawyer and witness speech.</p>
        </div>

        <div className="feature-card">
          <MdOutlineAnalytics size={28}/>
          <h4>Legal Keyword Extraction</h4>
          <p>Automatically highlight important legal terms.</p>
        </div>

        <div className="feature-card">
          <MdOutlineAnalytics size={28}/>
          <h4>AI Case Insights</h4>
          <p>Generate summaries and contradictions.</p>
        </div>

      </div>

    </div>
  );
}

export default TranscribeAudio;