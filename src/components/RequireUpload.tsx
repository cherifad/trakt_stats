"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { hasUploadedData } from "@/lib/data";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export function RequireUpload({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Ne pas rediriger si on est déjà sur la page d'upload
    if (pathname === "/upload") {
      setIsChecking(false);
      setHasData(true);
      return;
    }

    // Vérifier si des données sont uploadées
    const dataExists = hasUploadedData();
    setHasData(dataExists);
    setIsChecking(false);

    // Rediriger vers /upload si pas de données
    if (!dataExists) {
      router.push("/upload");
    }
  }, [pathname, router]);

  // Afficher un loader pendant la vérification
  const t = useTranslations();

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-pulse" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </motion.div>
      </div>
    );
  }

  // Ne rien afficher si pas de données (redirection en cours)
  if (!hasData && pathname !== "/upload") {
    return null;
  }

  return <>{children}</>;
}
