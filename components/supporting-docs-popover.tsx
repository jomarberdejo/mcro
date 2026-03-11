import { SupportingDocument } from "@/lib/generated/prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { FileText, ImageIcon, X } from "lucide-react";

export const SupportingDocsPopover: React.FC<{
  documents: SupportingDocument[];
}> = ({ documents }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isPDF = (mimeType: string) => mimeType === "application/pdf";

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : (process.env.NEXT_PUBLIC_APP_URL ?? "");

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        className="text-blue-600 border-blue-300 hover:bg-blue-50"
        title="View supporting documents"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FileText className="w-4 h-4" />
        {documents.length > 0 && (
          <span className="ml-1 text-xs font-semibold">{documents.length}</span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-lg border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-semibold text-gray-800">
              Supporting Documents
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <ul className="max-h-64 overflow-y-auto divide-y">
            {documents.length === 0 ? (
              <li className="px-3 py-4 text-center text-sm text-gray-400">
                No documents attached.
              </li>
            ) : (
              documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                >
                  {isPDF(doc.mimeType!) ? (
                    <FileText className="w-4 h-4 shrink-0 text-red-500" />
                  ) : (
                    <ImageIcon className="w-4 h-4 shrink-0 text-blue-400" />
                  )}
                  <a
                    href={`${baseUrl}${doc.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 truncate text-sm text-blue-600 hover:underline"
                    title={doc.fileName}
                  >
                    {doc.fileName}
                  </a>
                  <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 uppercase">
                    {isPDF(doc.mimeType!) ? "PDF" : "IMG"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
