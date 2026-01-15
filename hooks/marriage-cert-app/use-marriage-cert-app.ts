"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { MarriageCertificateApplication } from "@/lib/generated/prisma/client";
import { deleteMarriageCertificateApplication, fetchMarriageCertificateApplications } from "@/services/marriage-cert-app";

export function useMarriageCertificateApplications() {
  const [applications, setApplications] = useState<MarriageCertificateApplication[]>([]);
  const [loading, setLoading] = useState(false);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMarriageCertificateApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load marriage certificate applications");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await deleteMarriageCertificateApplication(id);
      toast.success("Application deleted successfully");
      await loadApplications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete application");
    }
  };

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return {
    applications,
    loading,
    reload: loadApplications,
    deleteApplication: removeApplication,
  };
}