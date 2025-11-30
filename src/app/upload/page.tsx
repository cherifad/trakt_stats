"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileJson,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trash2,
  Loader2,
  Download,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { hasUploadedData } from "@/lib/data";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "@/hooks/useTranslations";
import { useLocale } from "@/hooks/useLocale";

type UploadStep =
  | "idle"
  | "uploading"
  | "validating"
  | "processing"
  | "success"
  | "error";

export default function UploadPage() {
  const t = useTranslations();
  const { locale, setLocale } = useLocale();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<UploadStep>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasExistingData, setHasExistingData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasExistingData(hasUploadedData());
  }, []);

  const handleClearData = () => {
    if (confirm(t("upload.confirmDelete"))) {
      localStorage.removeItem("trakt_stats_data");
      setHasExistingData(false);
      setFile(null);
      setUploadStep("idle");
      setProgress(0);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    // Vérifier l'extension
    if (!file.name.endsWith(".json")) {
      setErrorMessage(t("upload.errorJsonFormat"));
      setUploadStep("error");
      return false;
    }

    // Vérifier la taille (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage(t("upload.errorFileSize"));
      setUploadStep("error");
      return false;
    }

    return true;
  };

  const validateJsonStructure = (data: any): boolean => {
    // Vérifier les champs essentiels
    const requiredFields = [
      "username",
      "pfp",
      "all_time_stats",
      "movies",
      "tv",
      "trakt",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        setErrorMessage(t("upload.errorMissingField", { field }));
        return false;
      }
    }

    // Vérifier la structure de all_time_stats
    const statsFields = [
      "plays",
      "hours",
      "collected",
      "ratings",
      "lists",
      "comments",
    ];
    for (const field of statsFields) {
      if (typeof data.all_time_stats[field] !== "number") {
        setErrorMessage(t("upload.errorInvalidStats", { field }));
        return false;
      }
    }

    // Vérifier que movies et tv ont les bonnes structures
    if (!data.movies.users_top_10 || !data.tv.users_top_10) {
      setErrorMessage(t("upload.errorInvalidStructure"));
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile && validateFile(selectedFile)) {
        setFile(selectedFile);
        processFile(selectedFile);
      }
    },
    []
  );

  const processFile = async (file: File) => {
    try {
      // Étape 1: Upload (simulation)
      setUploadStep("uploading");
      setProgress(0);
      await simulateProgress(0, 33, 500);

      // Étape 2: Validation
      setUploadStep("validating");
      const text = await file.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        setErrorMessage(t("upload.errorInvalidJson"));
        setUploadStep("error");
        setFile(null);
        return;
      }

      await simulateProgress(33, 66, 500);

      // Vérifier la structure
      if (!validateJsonStructure(data)) {
        setUploadStep("error");
        setFile(null);
        return;
      }

      // Étape 3: Processing
      setUploadStep("processing");
      await simulateProgress(66, 100, 500);

      // Stocker dans localStorage
      localStorage.setItem("trakt_stats_data", text);

      setUploadStep("success");

      // Rediriger vers le wrapped avec la langue
      setTimeout(() => {
        router.push(`/wrapped?lang=${locale}`);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors du traitement:", error);
      setErrorMessage(t("upload.errorProcessing"));
      setUploadStep("error");
      setFile(null);
    }
  };

  const handleLoadDemo = async () => {
    try {
      setUploadStep("processing");
      setProgress(0);
      await simulateProgress(0, 50, 300);

      const response = await fetch("/demo-stats.json");
      const data = await response.text();

      await simulateProgress(50, 100, 300);

      localStorage.setItem("trakt_stats_data", data);
      setUploadStep("success");

      setTimeout(() => {
        router.push(`/wrapped?lang=${locale}`);
      }, 1500);
    } catch (error) {
      console.error("Error loading demo data:", error);
      setErrorMessage(t("upload.errorProcessing"));
      setUploadStep("error");
    }
  };

  const simulateProgress = (
    start: number,
    end: number,
    duration: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      const steps = 20;
      const increment = (end - start) / steps;
      const interval = duration / steps;
      let current = start;

      const timer = setInterval(() => {
        current += increment;
        setProgress(Math.min(current, end));

        if (current >= end) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 animate-gradient opacity-20" />

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher currentLocale={locale} onLocaleChange={setLocale} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <Sparkles className="w-16 h-16 text-purple-500 animate-pulse" />
              <div className="absolute inset-0 blur-2xl bg-purple-500/30 animate-pulse" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("upload.title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("upload.subtitle")}
          </p>
          {hasExistingData && (
            <div className="mt-4">
              <Link
                href="/"
                className="text-purple-500 hover:underline font-medium"
              >
                {t("upload.backToDashboard")}
              </Link>
            </div>
          )}
        </div>

        {hasExistingData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="glass border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">
                    {t("upload.dataAlreadyUploaded")}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearData}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("upload.deleteAndUploadNew")}
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card className="glass border-white/10 overflow-hidden">
          <CardContent className="p-8">
            {/* Zone de drop - seulement visible en mode idle */}
            {uploadStep === "idle" && (
              <>
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                    isDragging
                      ? "border-purple-500 bg-purple-500/10 scale-105"
                      : "border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5"
                  }`}
                >
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                  />

                  <motion.div
                    animate={{ y: isDragging ? -10 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-center"
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                    <h3 className="text-xl font-semibold mb-2">
                      {isDragging
                        ? t("upload.dropFileHere")
                        : t("upload.uploadFile")}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t("upload.dragOrClick")}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-lg">
                      <FileJson className="w-4 h-4" />
                      {t("upload.acceptedFormat")}
                    </div>
                  </motion.div>
                </div>

                {/* Demo Data Section */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    {t("upload.demoData")}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLoadDemo}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 transition-colors"
                    >
                      <PlayCircle className="w-5 h-5" />
                      {t("upload.loadDemo")}
                    </motion.button>
                    <a
                      href="/demo-stats.json"
                      download="demo-stats.json"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      {t("upload.downloadDemo")}
                    </a>
                  </div>
                </div>
              </>
            )}

            {/* Progress UI - visible pendant upload/validation/processing/success */}
            {(uploadStep === "uploading" ||
              uploadStep === "validating" ||
              uploadStep === "processing" ||
              uploadStep === "success") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="mb-6">
                  {uploadStep === "success" ? (
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                  ) : (
                    <Loader2 className="w-16 h-16 mx-auto text-purple-500 animate-spin" />
                  )}
                </div>

                <h3 className="text-2xl font-semibold mb-4">
                  {uploadStep === "uploading" && t("upload.uploading")}
                  {uploadStep === "validating" && t("upload.validating")}
                  {uploadStep === "processing" && t("upload.processing")}
                  {uploadStep === "success" && t("upload.success")}
                </h3>

                {/* Progress bar */}
                <div className="max-w-md mx-auto mb-4">
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round(progress)}%
                  </p>
                </div>

                {uploadStep === "success" && (
                  <p className="text-muted-foreground">
                    {t("upload.redirecting")}
                  </p>
                )}
              </motion.div>
            )}

            {/* Error UI */}
            {uploadStep === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2 text-red-500">
                  {t("upload.error")}
                </h3>
                <p className="text-muted-foreground mb-6">{errorMessage}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFile(null);
                    setUploadStep("idle");
                    setErrorMessage("");
                    setProgress(0);
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {t("upload.tryAgain")}
                </motion.button>
              </motion.div>
            )}

            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p className="mb-4 text-base font-semibold text-foreground">
                {t("upload.howToGetFile")}
              </p>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 mb-6 border border-purple-500/20">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <FileJson className="w-5 h-5 text-purple-500" />
                  <p className="font-semibold text-foreground">
                    {t("upload.usePythonScript")}
                  </p>
                </div>

                <ol className="text-left max-w-xl mx-auto space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        {t("upload.step1Title")}
                      </p>
                      <a
                        href="https://github.com/cherifad/trakt_stats/tree/develop/trakt_vip_stats"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:underline font-mono text-xs break-all"
                      >
                        github.com/cherifad/trakt_stats/trakt_vip_stats
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        {t("upload.step2Title")}
                      </p>
                      <p className="text-xs opacity-75">
                        {t("upload.step2Details")}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        {t("upload.step3Title")}
                      </p>
                      <code className="text-xs bg-black/30 px-2 py-1 rounded font-mono">
                        python main.py run --save
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        {t("upload.step4Title")}
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs opacity-75">{t("upload.infoNote")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
