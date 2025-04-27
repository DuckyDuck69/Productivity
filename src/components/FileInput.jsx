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
        <div className="file-preview text-content h-full w-full p-4">
          <div className="h-full w-full overflow-auto bg-gray-50 rounded p-4">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm">
              {content}
            </pre>
          </div>
        </div>
      );
    } else if (file.type.includes("image")) {
      return (
        <div className="file-preview image-content h-full w-full flex items-center justify-center">
          <img src={content} alt="Preview" className="max-w-full max-h-full object-contain" />
        </div>
      );
    } else if (file.type === "application/pdf") {
      return (
        <div className="file-preview pdf-content h-full w-full">
          <iframe
            src={content}
            title="PDF Preview"
            className="w-full h-full"
            style={{ border: "1px solid #ccc" }}
          />
        </div>
      );
    } else if (file.type.includes("video")) {
      return (
        <div className="file-preview video-content h-full w-full flex items-center justify-center">
          <video src={content} controls className="max-w-full max-h-full">
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (file.type.includes("audio")) {
      return (
        <div className="file-preview audio-content h-full w-full flex items-center justify-center">
          <audio src={content} controls className="w-full">
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    return <p>This file type ({file.type}) cannot be previewed</p>;
  };

  return (
    <div className="flex flex-col w-full h-full p-4">
      <input
        type="file"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
        accept="text/*,image/*,application/pdf,video/*,audio/*,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      
      {uploadedFiles.length === 0 ? (
        <button 
          className="w-full flex-1 min-h-[400px] text-lg font-medium flex flex-col items-center justify-center gap-3 text-[#8A3FFC] bg-white rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:text-[#8a3ffc] hover:bg-white border-2 border-dashed" 
          onClick={onChooseFile}
        >
          <span className="w-12 h-12 text-xl text-[#8a3ffc] flex items-center justify-center rounded-full bg-[#f3ecff]">upload</span> Upload file 
        </button>
      ) : (
        <>
          <div className="w-full flex-1 min-h-[400px] bg-white rounded-2xl border-2 overflow-hidden">
            {renderFileContent(uploadedFiles[uploadedFiles.length - 1])}
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
            <p className="text-sm truncate max-w-lg">
              {uploadedFiles[uploadedFiles.length - 1].file.name} ({Math.round(uploadedFiles[uploadedFiles.length - 1].file.size / 1024)} KB)
            </p>
            <div className="flex gap-2">
              <button 
                className="px-3 py-1 text-sm bg-[#f3ecff] text-[#8A3FFC] rounded-lg hover:bg-[#e6d8ff]"
                onClick={onChooseFile}
              >
                Change file
              </button>
              <button 
                className="material-symbols-rounded p-1 bg-red-100 text-red-500 rounded-lg hover:bg-red-200"
                onClick={() => removeFile(uploadedFiles[uploadedFiles.length - 1].file)}
              >
                delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FileInput;

