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

      return data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      // Parse the new path structure: /api/files/documents/images/123-abc.jpg
      const pathParts = filePath.split("/");
      const type = pathParts[3]; // "signature" or "documents"
      const subfolder = pathParts[4]; // "images" or "pdfs"
      const filename = pathParts[5]; // "123-abc.jpg"

      console.log("DELETE FILE PATH PARTS:", { pathParts, type, subfolder, filename });

      const response = await fetch("/api/upload/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, subfolder, filename }),
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