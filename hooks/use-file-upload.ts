import { toast } from "sonner";
import {
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export function useFileUpload() {
  const uploadFile = async (file: File, type: "signature" | "documents") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload file");
    }

    return await response.json();
  };

  const deleteFile = async (filePath: string) => {
    try {
      await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath }),
      });
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return {
    uploadFile,
    deleteFile,
  };
}
