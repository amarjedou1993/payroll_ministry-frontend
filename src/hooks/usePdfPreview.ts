import { useState, useEffect } from "react";
import * as pdfjs from "pdfjs-dist/build/pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.entry.js",
  import.meta.url
).toString();

export const usePdfPreview = (pdfUrl: string | null) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfUrl) return;

    const renderThumbnail = async () => {
      try {
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          setThumbnail(canvas.toDataURL("image/png")); // Convert to Base64 image
        }
      } catch (error) {
        console.error("Error rendering PDF thumbnail:", error);
      }
    };

    renderThumbnail();
  }, [pdfUrl]);

  return thumbnail;
};
