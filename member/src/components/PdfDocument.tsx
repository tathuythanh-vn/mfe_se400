import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import ClipLoader from 'react-spinners/ClipLoader';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfDocumentProps {
  file: string | File;
  width?: number;
}

const PdfDocument = ({ file, width = 400 }: PdfDocumentProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError('');
  };

  const onDocumentLoadError = () => {
    setError('Không thể tải file PDF');
  };

  return (
    <div className="w-full">
      {error && (
        <div className="text-center py-5 text-red-500">
          <p>{error}</p>
        </div>
      )}

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex flex-col items-center justify-center py-10">
            <ClipLoader color="#36d7b7" size={40} />
            <p className="text-white mt-4">Đang tải PDF...</p>
          </div>
        }
      >
        {numPages &&
          Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={width}
              loading={
                <div className="flex items-center justify-center py-5">
                  <ClipLoader color="#36d7b7" size={30} />
                </div>
              }
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          ))}
      </Document>
    </div>
  );
};

export default PdfDocument;
