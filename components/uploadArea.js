import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa6";

const UploadArea = ({ onFilesSelect }) => { 
  const onDrop = useCallback((acceptedFiles) => {
    const fileURLs = acceptedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    onFilesSelect(fileURLs);
  }, [onFilesSelect]);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop, 
    accept: { "application/pdf": [] },
    multiple: true 
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed h-[260px] bg-white  p-10 flex flex-col justify-center items-center gap-3 cursor-pointer">
      <input {...getInputProps()} />
     <FaUpload/>
      <p>Click to upload or drag and drop</p>
    </div>
  );
};

export default UploadArea;
