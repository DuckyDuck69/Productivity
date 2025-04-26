import { useRef, useState } from "react";
import '../fileinput.css';
import mammoth from "mammoth";

export function FileInput() {
  const inputRef = useRef();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Handle file selection and processing
  const handleOnChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      let content = null;

      // Process file based on type
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          try {
            const result = await mammoth.extractRawText({ arrayBuffer });
            content = result.value;
            setUploadedFiles((prev) => [...prev, { file, content, url: URL.createObjectURL(file) }]);
          } catch (error) {
            console.error("Error parsing DOCX file:", error);
          }
        };
        reader.readAsArrayBuffer(file);
        return; // Exit early to avoid duplicate processing
      }

      // For text files and JSON
      if (file.type.includes("text") || file.type.includes("application/json")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          content = e.target.result;
          setUploadedFiles((prev) => [...prev, { file, content, url: URL.createObjectURL(file) }]);
        };
        reader.readAsText(file);
      }
      // For images
      else if (file.type.includes("image")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          content = e.target.result;
          setUploadedFiles((prev) => [...prev, { file, content, url: URL.createObjectURL(file) }]);
        };
        reader.readAsDataURL(file);
      }
      // For PDFs, videos, audio, and other files
      else {
        content = URL.createObjectURL(file);
        setUploadedFiles((prev) => [...prev, { file, content, url: content }]);
      }
    }
  };

  // Trigger file input click
  const onChooseFile = () => {
    inputRef.current.click();
  };

  // Remove a specific file and clean up its URL
  const removeFile = (fileToRemove) => {
    setUploadedFiles((prev) =>
      prev.filter((item) => {
        if (item.file === fileToRemove) {
          URL.revokeObjectURL(item.url); // Clean up object URL
          return false;
        }
        return true;
      })
    );
  };

  // Render file content based on file type
  const renderFileContent = (item) => {
    const { file, content } = item;

    if (file.type.includes("text") || file.type.includes("application/json") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return (
        <div className="file-preview text-content">
          <h3>Text Content:</h3>
          <pre
            style={{
              maxHeight: "300px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            {content}
          </pre>
        </div>
      );
    } else if (file.type.includes("image")) {
      return (
        <div className="file-preview image-content">
          <h3>Image Preview:</h3>
          <img src={content} alt="Preview" style={{ maxWidth: "100%", maxHeight: "300px" }} />
        </div>
      );
    } else if (file.type === "application/pdf") {
      return (
        <div className="file-preview pdf-content">
          <h3>PDF Preview:</h3>
          <iframe
            src={content}
            title="PDF Preview"
            width="100%"
            height="500px"
            style={{ border: "1px solid #ccc" }}
          />
        </div>
      );
    } else if (file.type.includes("video")) {
      return (
        <div className="file-preview video-content">
          <h3>Video Preview:</h3>
          <video src={content} controls style={{ maxWidth: "100%", maxHeight: "400px" }}>
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (file.type.includes("audio")) {
      return (
        <div className="file-preview audio-content">
          <h3>Audio Preview:</h3>
          <audio src={content} controls style={{ width: "100%" }}>
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    return <p>This file type ({file.type}) cannot be previewed</p>;
  };

  return (
    <div style={{ margin: "20px", maxWidth: "800px" }}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
        accept="text/*,image/*,application/pdf,video/*,audio/*,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      <button className="file-btn" onClick={onChooseFile}>
        <span className="material-symbols-rounded">upload</span> Upload file
      </button>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          {uploadedFiles.map((item, index) => (
            <div key={index} className="selected-file" style={{ marginBottom: "20px" }}>
              <p>
                {item.file.name} ({Math.round(item.file.size / 1024)} KB) - {item.file.type}
              </p>
              <button className="material-symbols-rounded" onClick={() => removeFile(item.file)}>
                delete
              </button>
              {renderFileContent(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileInput