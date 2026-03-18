import React, { useState } from "react";
import "../styles/resumecard.css";

export default function ResumeCard({
  resumeUrl,
  resumeFile,
  setResumeFile,
  handleUpload,
  loading, 
}) {
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, DOC, and DOCX files are allowed");
        e.target.value = ""; 
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        return;
      }
    }
    
    setResumeFile(file);
    setSelectedFileName(file ? file.name : "");
  };

  const handleViewResume = (e) => {
    if (!resumeUrl) {
      e.preventDefault();
      alert("No resume URL available");
      return;
    }
  
    console.log("Opening resume URL:", resumeUrl);
  };

  return (
    <div className="resume-card">
      <h3>Resume</h3>

      {resumeUrl ? (
        <div className="resume-link mb-3">
          <a 
            href={resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleViewResume}
            className="resume-view-link"
          >
            📄 View Uploaded Resume
          </a>
          
        </div>
      ) : (
        <p className="no-resume">No resume uploaded yet.</p>
      )}

      <form
        className="resume-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload(e); 
        }}
      >
        <input 
          type="file" 
          accept=".pdf,.doc,.docx" 
          onChange={handleFileChange}
          disabled={loading} 
        />

        {selectedFileName && (
          <p className="selected-file">Selected file: {selectedFileName}</p>
        )}

        <button
          type="submit" 
          disabled={loading || !resumeFile} 
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </>
          ) : (
            "Upload Resume"
          )}
        </button>
      </form>
    </div>
  );
}