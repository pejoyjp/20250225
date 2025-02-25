"use client";
import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useCallback, memo } from "react";
import { FaRotateRight } from "react-icons/fa6";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import { PDFDocument,degrees } from "pdf-lib";
import { saveAs } from "file-saver";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PageWrapper = memo(({ pageNumber, scale, rotation, onRenderSuccess }) => (
  <div
    style={{
      transition: "transform 0.3s ease-in-out",
      transform: `rotate(${rotation}deg)`,
      width: "100%",
      height: "100%",
      position: "relative",
      zIndex: 1,
    }}
  >
    <Page
      pageNumber={pageNumber}
      renderTextLayer={false}
      scale={scale}
      rotate={0}
      className="w-full h-full flex justify-center items-center"
      onRenderSuccess={onRenderSuccess}
      customStyle={{ background: "transparent" }}
    />
  </div>
));
PageWrapper.displayName = "PageWrapper";

const PDFViewer = ({ file, onRemove }) => {
  const [numPages, setNumPages] = useState(null);
  const [rotations, setRotations] = useState({});
  const [scale, setScale] = useState(0.4);
  const [pageDimensions, setPageDimensions] = useState({});
  const [pendingScale, setPendingScale] = useState(null);

  const getGridCols = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return "grid-cols-1";
    if (scale >= 0.6) return "grid-cols-1";
    if (scale >= 0.5) return "grid-cols-2";
    if (scale >= 0.45) return "grid-cols-3";
    if (scale >= 0.4) return "grid-cols-4";
    if (scale >= 0.35) return "grid-cols-5";
    if (scale >= 0.3) return "grid-cols-6";
    if (scale >= 0.25) return "grid-cols-8";
    if (scale >= 0.2) return "grid-cols-10";
    return "grid-cols-6";
  }, [scale]);

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

  const zoomIn = () => setPendingScale((prev) => Math.min((prev || scale) + 0.05, 1));
  const zoomOut = () => setPendingScale((prev) => Math.max((prev || scale) - 0.1, 0.2));

  useEffect(() => {
    if (pendingScale === null) return;
    const timeout = setTimeout(() => {
      setScale(pendingScale);
      setPendingScale(null);
    }, 200);
    return () => clearTimeout(timeout);
  }, [pendingScale]);

  const handlePageRenderSuccess = useCallback(
    (page, index) => {
      const viewport = page.getViewport({ scale: 1 });
      setPageDimensions((prev) => ({
        ...prev,
        [index]: { width: viewport.width, height: viewport.height },
      }));
    },
    []
  );

  
  const downloadAll = async () => {
    if (!file || !file.url) {
      console.error("Invalid file object", file);
      return;
    }
  
    try {
      console.log("Downloading PDF:", file);
      const fileUrl = file.url;
      console.log("File URL:", fileUrl);
  
      let existingPdfBytes;
      
      if (fileUrl.startsWith("blob:")) {
        const response = await fetch(fileUrl);
        existingPdfBytes = await response.arrayBuffer();
      } else {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        existingPdfBytes = await response.arrayBuffer();
      }
  
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
  
      pages.forEach((page, index) => {
        const rotation = rotations[index] || 0;
        page.setRotation(degrees(rotation % 360));
      });
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
  
      // 取原文件名，确保以 .pdf 结尾
      const originalFileName = file.name?.endsWith(".pdf") ? file.name : `${file.name || "modified"}.pdf`;
  
      saveAs(blob, originalFileName);
    } catch (error) {
      console.error("Error generating rotated PDF:", error);
    }
  };
  
  

  return (
    <div className="flex flex-col gap-5 items-center w-full justify-center">
      <div className="flex gap-2 mb-4">
        <button onClick={rotateAll} className="px-4 py-2 bg-[#ef6035] text-white rounded">
          Rotate All
        </button>
        <button onClick={onRemove} className="px-4 py-2 bg-[#1d2430] text-white rounded">
          Remove PDF
        </button>
        <button onClick={zoomIn} className="bg-white rounded-full w-10 h-10 flex justify-center items-center">
          <CiZoomIn size={24} color="black" />
        </button>
        <button onClick={zoomOut} className="bg-white rounded-full w-10 h-10 flex justify-center items-center">
          <CiZoomOut size={24} color="black" />
        </button>
      </div>

      {file && (
        <div className="w-full max-w-6xl m-auto">
          <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            <div className={`grid ${getGridCols()} gap-4 justify-items-center items-center`}>
              {numPages &&
                [...Array(numPages)].map((_, index) => {
                  const rotation = rotations[index] || 0;
                  const dimensions = pageDimensions[index] || { width: 500, height: 700 };

                  return (
                    <div className="bg-white p-3 relative hover:bg-gray-100 cursor-pointer" key={index}>
                      <div
                        className="flex justify-center items-center bg-white"
                        style={{
                          width: `${dimensions.width * scale}px`,
                          height: `${dimensions.height * scale}px`,
                          overflow: "hidden",
                        }}
                      >
                        <div>
                          <button
                            onClick={() => rotatePage(index)}
                            className="absolute top-2 right-2 z-10 bg-[#ef6035] p-1 rounded-full shadow-md"
                          >
                            <FaRotateRight size={10} color="white" />
                          </button>
                          <div className="flex flex-col gap-5 m-5">
                            <PageWrapper
                              pageNumber={index + 1}
                              scale={scale}
                              rotation={rotation}
                              onRenderSuccess={(page) => handlePageRenderSuccess(page, index)}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-center italic">{index + 1}</p>
                    </div>
                  );
                })}
            </div>
          </Document>
        </div>
      )}

      <button onClick={downloadAll} className="px-4 py-2 bg-[#ef6035] text-white rounded">
        Download All
      </button>
    </div>
  );
};

export default PDFViewer;
