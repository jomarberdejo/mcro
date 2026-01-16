import { toast } from "sonner";
import {
  FieldValues,
  Path,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export function useFileUpload() {
  const uploadFile = async (file: File, type: "signature" | "documents") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file");
      }

      // Return the data which includes:
      // { success: true, path: "/api/files/signature/123-abc.jpg", filename: "123-abc.jpg" }
      return data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      // Extract type and filename from the API path
      // filePath format: /api/files/signature/123-abc.jpg
      const pathParts = filePath.split("/");
      const type = pathParts[3]; // signature or documents
      const filename = pathParts[4]; // 123-abc.jpg

      const response = await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, filename }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete file");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile,
  };
}