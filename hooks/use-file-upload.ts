import { toast } from "sonner";
import { FieldValues, Path, UseFormSetValue, UseFormWatch } from "react-hook-form";

export function useFileUpload<TFormValues extends FieldValues>(
  setValue: UseFormSetValue<TFormValues>,
  watch: UseFormWatch<TFormValues>
) {
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

  const extractDataFromFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract data");
      }

      const extractedData = await response.json();

      Object.entries(extractedData).forEach(([key, value]) => {
        if (key === "birthOrder" && value) {
          if ("isTwin" in extractedData) {
            setValue("isTwin" as Path<TFormValues>, true as any);
          }
        }

        // Set any other extracted value
        if (value !== undefined && value !== null && value !== "") {
          setValue(key as unknown as Path<TFormValues>, value as any, {
            shouldValidate: false,
          });
        }
      });


      toast.success(
        "Data extracted successfully! Please review and correct any errors."
      );
    } catch (error) {
      console.error("Error extracting data:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to extract data from image. Please fill manually."
      );
    }
  };

  return {
    uploadFile,
    deleteFile,
    extractDataFromFile,
  };
}
