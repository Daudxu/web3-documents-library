import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./PdfViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ pdf }) => {
  const [numPages, setNumPages] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(123123123)
    setNumPages(numPages);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  return (
    <div>
      <Document
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
        className="pdf-container"
        loading="loading..."
      >
        {new Array(numPages).fill('').map((cur, index) => (
            <Page
              key={index}
              width={windowSize.width-30}
              pageNumber={index + 1}
            />
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;
