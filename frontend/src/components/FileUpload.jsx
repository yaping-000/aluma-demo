import React from "react"

const FileUpload = ({
  file,
  handleFileChange,
  handleUpload,
  isUploading,
  uploadProgress,
  onBack,
}) => {
  return (
    <div className="demo-step">
      <h2>Upload your content</h2>
      <div className="upload-area">
        <input
          type="file"
          accept="image/*,audio/*,video/*,.txt,.pdf,.doc,.docx"
          onChange={handleFileChange}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="file-label">
          {file
            ? file.name
            : "Choose a file (image, audio, video, or document)"}
        </label>
        <p className="upload-hint">
          Supports images, audio, video, and document files (PDF, DOC, DOCX,
          TXT)
        </p>
      </div>

      {file && (
        <div className="file-info">
          <p>
            <strong>Selected:</strong> {file.name}
          </p>
          <p>
            <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <p>
            <strong>Type:</strong> {file.type}
          </p>
        </div>
      )}

      <div className="button-group">
        <button onClick={onBack}>Back</button>
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="primary"
        >
          {isUploading ? `Uploading... ${uploadProgress}%` : "Upload & Process"}
        </button>
      </div>

      {isUploading && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
