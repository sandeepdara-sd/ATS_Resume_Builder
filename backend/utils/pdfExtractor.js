import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

export const extractTextFromPDF = async (buffer) => {
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(' ') + '\n';
  }

  return fullText;
};




// export const extractTextFromPDF = async (buffer) => {
//   try {
//     // For now, return a placeholder since pdfjs-dist has canvas dependency issues
//     // This prevents the server from crashing when PDF extraction is attempted
//     console.log('⚠️ PDF extraction temporarily disabled due to canvas dependency issues');
//     return 'PDF text extraction temporarily unavailable. Please manually enter your resume content.';
//   } catch (error) {
//     console.error('PDF extraction error:', error);
//     throw new Error('Failed to extract text from PDF');
//   }
// };

// // Alternative implementation without canvas dependency
// export const extractTextFromPDFSimple = async (buffer) => {
//   try {
//     // Convert buffer to string and attempt basic text extraction
//     const text = buffer.toString('utf8');
//     // Basic cleanup - remove non-printable characters
//     const cleanText = text.replace(/[^\x20-\x7E\n\r]/g, ' ').trim();
//     return cleanText || 'Unable to extract readable text from PDF';
//   } catch (error) {
//     console.error('Simple PDF extraction error:', error);
//     return 'PDF processing failed. Please manually enter your resume content.';
//   }
// };