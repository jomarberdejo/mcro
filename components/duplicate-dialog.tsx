

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

interface DuplicateRecord {
  id: string;
  [key: string]: any;
}

interface DuplicateDialogProps {
  open: boolean;
  duplicates: DuplicateRecord[];
  onProceed: () => void;
  onViewExisting: (id: string) => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  renderRecord: (duplicate: DuplicateRecord) => ReactNode;
}

export function DuplicateDialog({
  open,
  duplicates,
  onProceed,
  onViewExisting,
  onCancel,
  title = "Potential Duplicate Record Found",
  description,
  renderRecord,
}: DuplicateDialogProps) {
  const defaultDescription = `We found ${duplicates.length} existing record${
    duplicates.length > 1 ? "s" : ""
  } with matching details. Please review before proceeding.`;

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="max-h-[300px] overflow-y-auto space-y-3">
          {duplicates.map((duplicate) => (
            <div
              key={duplicate.id}
              className="p-4 border rounded-lg bg-muted/50 space-y-2"
            >
              {renderRecord(duplicate)}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewExisting(duplicate.id)}
                className="mt-2"
              >
                View Existing Record
              </Button>
            </div>
          ))}
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onProceed}>Proceed Anyway</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}