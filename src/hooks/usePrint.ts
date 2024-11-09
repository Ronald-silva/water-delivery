import { useRef } from 'react';
import { createPortal } from 'react-dom';

export const usePrint = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const print = (content: React.ReactNode) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = document.createElement('div');
    document.body.appendChild(printContent);

    createPortal(content, printContent);

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Impressão</title>
          <link rel="stylesheet" href="/print.css">
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();

    document.body.removeChild(printContent);
  };

  return { print };
};