"use client";
import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import { FaRotateRight } from "react-icons/fa6";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDFViewer = ({ file, onRemove }) => {
  const [numPages, setNumPages] = useState(null);
  const [rotations, setRotations] = useState({});
  const [scale, setScale] = useState(0.4);
  const [pageDimensions, setPageDimensions] = useState({});

  const getGridCols = () => {
    const isMobile = window.innerWidth <= 768; 
    if (isMobile) return "grid-cols-1"; 
  
    if (scale >= 1.2) return "grid-cols-1";
    if (scale >= 0.8) return "grid-cols-2";
    if (scale >= 0.6) return "grid-cols-3";
    if (scale >= 0.5) return "grid-cols-5";
  
    return "grid-cols-6";
  };
  const rotatePage = (pageIndex) => {
    setRotations((prev) => ({
      ...prev,
      [pageIndex]: (prev[pageIndex] || 0) + 90,
    }));
  };

  const rotateAll = () => {
    if (!numPages) return;
    setRotations((prev) =>
      Object.fromEntries([...Array(numPages).keys()].map((i) => [i, (prev[i] || 0) + 90]))
    );
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.2));

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 mb-4">
        <button onClick={rotateAll} className="px-4 py-2 bg-[#ef6035] text-white rounded">
          Rotate All
        </button>

        <button onClick={onRemove} className="px-4 py-2 bg-[#1d2430] text-white rounded">
          Remove PDF
        </button>

        <button onClick={zoomIn} className=" bg-white rounded-full w-10 h-10 flex justify-center items-center">
          <CiZoomIn size={24} color="black" />
        </button>

        <button onClick={zoomOut} className=" bg-white rounded-full w-10 h-10 flex justify-center items-center">
          <CiZoomOut size={24} color="black" />
        </button>
     
      </div>

      {file && (
        <div className="w-full max-w-6xl m-auto ">
          <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
          <div className={`grid ${getGridCols()} gap-4 justify-items-center items-center`}>
              {numPages &&
                [...Array(numPages)].map((_, index) => {
                  const rotation = rotations[index] || 0;
                  const isRotated = rotation % 180 !== 0;
                  const dimensions = pageDimensions[index] || { width: 0, height: 0 };
                  
                  const scaledWidth = isRotated 
                    ? dimensions.height * scale 
                    : dimensions.width * scale;
                  const scaledHeight = isRotated 
                    ? dimensions.width * scale 
                    : dimensions.height * scale;

                  return (
                    <div 
                    key={index} 
                    className="relative flex justify-center items-center"
                    style={{ 
                      width: `${scaledWidth}px`,
                      height: `${scaledHeight}px`,
                    }}
>
                      <button
                        onClick={() => rotatePage(index)}
                        className="absolute top-2 right-2 z-10 bg-[#ef6035] p-2 rounded-full shadow-md"
                      >
                        <FaRotateRight size={16} color="white"/>
                      </button>
                      <Page
                        pageNumber={index + 1}
                        rotate={rotation}
                        renderTextLayer={false}
                        scale={scale}
                        className="border border-gray-300 shadow-sm w-full h-full"
                        onRenderSuccess={(page) => {
                          const viewport = page.getViewport({ scale: 1 });
                          setPageDimensions(prev => ({
                            ...prev,
                            [index]: { 
                              width: viewport.width, 
                              height: viewport.height 
                            },
                          }));
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          </Document>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;