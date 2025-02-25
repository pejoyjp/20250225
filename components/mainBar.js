"use client";
import React, { useState } from "react";
import UploadArea from "./UploadArea";
import PDFViewer from "./PDFViewer";

const MainBar = () => {
  const [files, setFiles] = useState([]); 


  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="bg-[#f4f3ec]">
      <div className="max-w-screen-xl min-h-[1000px] h-auto flex flex-col justify-center items-center mx-auto py-16 px-4">
        <p className="text-4xl font-semibold">Rotate Multiple PDFs</p>
        <p className="text-center max-w-xl mt-4 text-gray-700 mb-10">
          Simply click on a page to rotate it. You can then download your modified PDFs.
        </p>

        {files.length > 0 ? (
          files.map((file, index) => (
            <PDFViewer 
              key={index} 
              file={file} 
              onRemove={() => removeFile(index)} 
            />
          ))
        ) : (
          <UploadArea onFilesSelect={setFiles} /> 
        )}
      </div>
    </div>
  );
};

export default MainBar;
