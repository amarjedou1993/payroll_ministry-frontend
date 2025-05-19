import * as pdfjs from "pdfjs-dist/build/pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.entry.js",
  import.meta.url
).toString();

// const previewCache = new Map<string, string>();

export const generatePdfPreview = async (
  pdfUrl: string
): Promise<string | null> => {
  //   if (previewCache.has(pdfUrl)) {
  //     return previewCache.get(pdfUrl)!;
  //   }
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
      return canvas.toDataURL("image/png");
    }
  } catch (error) {
    console.error("Error generating PDF preview:", error);
    return null;
  }

  return null;
};
