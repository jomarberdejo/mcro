import { useState } from "react";
import { toast } from "sonner";

interface DuplicateCheckConfig {
  apiEndpoint: string;
  redirectBasePath: string;
  recordId?: string;
}

export interface DuplicateRecord {
  id: string;
  [key: string]: unknown;
}

interface DuplicateCheckResult {
  hasDuplicates: boolean;
  duplicates: DuplicateRecord[];
}

export function useDuplicateCheck<TFormData = Record<string, unknown>, TCheckData = Record<string, unknown>>({
  apiEndpoint,
  redirectBasePath,
  recordId,
}: DuplicateCheckConfig) {
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateRecords, setDuplicateRecords] = useState<DuplicateRecord[]>([]);
  const [pendingFormData, setPendingFormData] = useState<TFormData | null>(null);

  const checkForDuplicates = async (checkData: TCheckData): Promise<DuplicateCheckResult> => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...checkData,
          excludeId: recordId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check for duplicates");
      }

      const result = await response.json() as DuplicateCheckResult;
      return result;
    } catch (error) {
      console.error("Error checking duplicates:", error);
      toast.error("Failed to check for duplicates");
      return { hasDuplicates: false, duplicates: [] };
    }
  };

  const handleDuplicateCheck = async (
    checkData: TCheckData,  
    fullData: TFormData,                    
    onSave: (data: TFormData) => Promise<void>
  ): Promise<boolean> => {
    const duplicateCheck = await checkForDuplicates(checkData);

    if (duplicateCheck.hasDuplicates) {
      setDuplicateRecords(duplicateCheck.duplicates);
      setPendingFormData(fullData);  
      setShowDuplicateDialog(true);
      return false;
    } else {
      await onSave(fullData);  
      return true;
    }
  };

  const handleProceedWithSave = async (onSave: (data: TFormData) => Promise<void>): Promise<void> => {
    if (pendingFormData) {
      setShowDuplicateDialog(false);
      await onSave(pendingFormData);  
      setPendingFormData(null);
      setDuplicateRecords([]);
    }
  };

  const handleViewExisting = (duplicateId: string): void => {
    window.open(`${redirectBasePath}/${duplicateId}`, '_blank', 'noopener,noreferrer');
  };

  const getDuplicateUrl = (duplicateId: string): string => {
    return `${redirectBasePath}/${duplicateId}`;
  };

  const handleCancelDuplicate = (): void => {
    setShowDuplicateDialog(false);
    setPendingFormData(null);
    setDuplicateRecords([]);
  };

  return {
    showDuplicateDialog,
    duplicateRecords,
    handleDuplicateCheck,
    handleProceedWithSave,
    handleViewExisting,
    getDuplicateUrl,
    handleCancelDuplicate,
    redirectBasePath,
  };
}