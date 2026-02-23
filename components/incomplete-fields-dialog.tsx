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

interface IncompleteFieldsDialogProps {
  open: boolean;
  emptyFields: string[];
  onProceed: () => void;
  onCancel: () => void;
}

export function IncompleteFieldsDialog({
  open,
  emptyFields,
  onProceed,
  onCancel,
}: IncompleteFieldsDialogProps) {
  const emptyFieldsCount = emptyFields.length;

  console.log("Empty fields:", emptyFields); 

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertDialogTitle>Incomplete Form Detected</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Some field{emptyFieldsCount > 1 ? "s are" : " is"} not filled. Are
            you sure you want to proceed? This may result in an incomplete birth
            certificate record.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Go Back and Fill Fields
          </Button>
          <Button onClick={onProceed}>Proceed Anyway</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
