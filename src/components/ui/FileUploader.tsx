import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios, {
  AxiosProgressEvent,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import ProgressBar from "./Progressbar";
import FolderUploadIcon from "./FolderUploadIcon";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";

interface FileProgress {
  id: string;
  file: File;
  progress: number;
  error?: string;
  cancelToken?: CancelTokenSource;
  paused?: boolean;
}

interface FileUploaderProps {
  url: string;
  allowedTypes: string[];
  autoCloseDelay?: number;
  onUploadStart?: () => void;
  onSuccess: (response: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  url,
  allowedTypes,
  onSuccess,
  onUploadStart,
  autoCloseDelay = 3000,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [files, setFiles] = useState<FileProgress[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [allUploadsComplete, setAllUploadsComplete] = useState(false);

  const checkCompletion = useCallback(() => {
    const complete = files.every((file) => file.progress === 100 || file.error);
    setAllUploadsComplete(complete);
    return complete;
  }, [files]);

  useEffect(() => {
    if (allUploadsComplete) {
      timeoutRef.current = setTimeout(() => {
        setShowProgress(false);
      }, autoCloseDelay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [allUploadsComplete, autoCloseDelay]);

  const uploadFile = useCallback(
    async (fileProgress: FileProgress) => {
      const formData = new FormData();
      formData.append("payrolls", fileProgress.file);

      const cancelToken = axios.CancelToken.source();
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileProgress.id ? { ...f, cancelToken, paused: false } : f
        )
      );

      const config: AxiosRequestConfig<FormData> = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileProgress.id ? { ...f, progress: percent } : f
              )
            );
          }
        },
        cancelToken: cancelToken.token,
      };

      try {
        const response = await axios.post(url, formData, config);
        return { fileId: fileProgress.id, response: response.data };
      } catch (error: any) {
        if (axios.isCancel(error)) {
          return { fileId: fileProgress.id, paused: true };
        }
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileProgress.id ? { ...f, error: error.message } : f
          )
        );
        return { fileId: fileProgress.id, error: error.message };
      }
    },
    [url]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setAllUploadsComplete(false);
      setShowProgress(true);
      onUploadStart?.();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const newFiles: FileProgress[] = acceptedFiles.map((file) => ({
        // id: crypto.randomUUID(),
        id: uuidv4(),
        file,
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      const uploadPromises = newFiles.map((fileProgress) =>
        uploadFile(fileProgress)
      );
      const results = await Promise.all(uploadPromises);

      const allSuccessful = results.every(
        (result) => !result.error && result.response
      );

      if (allSuccessful) {
        const combinedResponse = {
          success: true,
          processed: results.length,
          results: results.map((r) => r.response.results).flat(),
          errors: results.map((r) => r.response.errors).flat(),
        };
        onSuccess(combinedResponse);
      } else {
        const combinedResponse = {
          success: false,
          processed: results.filter((r) => !r.error).length,
          results: results.map((r) => r.response?.results || []).flat(),
          errors: results
            .map((r) => r.response?.errors || r.error || [])
            .flat(),
        };
        onSuccess(combinedResponse);
      }
    },
    [onSuccess, onUploadStart, uploadFile]
  );

  const pauseAllUploads = () => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.cancelToken && !f.paused && f.progress < 100) {
          f.cancelToken.cancel("Upload paused");
          return { ...f, paused: true };
        }
        return f;
      })
    );
  };

  const resumeAllUploads = async () => {
    const pausedFiles = files.filter((f) => f.paused);
    const uploadPromises = pausedFiles.map((file) => uploadFile(file));
    const results = await Promise.all(uploadPromises);
    results.forEach((result) => {
      if (result.response && !result.error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === result.fileId ? { ...f, paused: false, progress: 100 } : f
          )
        );
      }
    });
  };

  const cancelAllUploads = () => {
    setFiles((prev) => {
      const count = prev.length;
      prev.forEach((f) => {
        if (f.cancelToken && f.progress < 100) {
          f.cancelToken.cancel("Upload canceled");
        }
      });
      if (count > 0) {
        toast.info(
          t("fileUploader.cancelMessage", {
            count,
            plural: count !== 1 ? "s" : "",
          })
        );
      }
      return [];
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: true,
  });

  const globalProgress =
    files.length > 0
      ? Math.round(
          files.reduce((acc, file) => acc + file.progress, 0) / files.length
        )
      : 0;

  const hasPausedFiles = files.some((f) => f.paused);

  useEffect(() => {
    checkCompletion();
  }, [files, checkCompletion]);

  return (
    <div
      className={clsx("pb-4 space-y-6", isRtl ? "font-arabic" : "Inter")}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <header>
        <h1 className="text-xl mb-1 font-semibold text-gray-900">
          {t("fileUploader.title")}
        </h1>
        <p className="text-gray-400 font-light text-sm">
          {t("fileUploader.subtitle")}
        </p>
      </header>
      <div
        {...getRootProps()}
        className={clsx(
          "border-dashed border-2 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition",
          isDragActive
            ? "bg-blue-50 border-blue-500"
            : "bg-gray-50 border-gray-300"
        )}
        aria-label={t("fileUploader.dropzoneAriaLabel")}
      >
        <FolderUploadIcon className="h-20 w-20" />
        <p className="mt-2 font-semibold text-gray-700">
          {t("fileUploader.uploadPrompt")}
        </p>
        <input {...getInputProps()} />
        <p className="font-light text-sm text-gray-600 mt-1">
          {t("fileUploader.dropPrompt")}{" "}
          <span className="text-blue-500">{t("fileUploader.chooseFile")}</span>
        </p>
      </div>

      {showProgress && files.length > 0 && (
        <ProgressBar
          progress={globalProgress}
          hasPausedFiles={hasPausedFiles}
          fileCount={files.length}
          onPause={pauseAllUploads}
          onResume={resumeAllUploads}
          onCancel={cancelAllUploads}
          onClose={() => {
            setShowProgress(false);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }}
        />
      )}
    </div>
  );
};

export default FileUploader;
