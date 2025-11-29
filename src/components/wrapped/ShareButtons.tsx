"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, Copy, Check } from "lucide-react";
import { useState, useRef } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { toPng } from "html-to-image";

interface ShareButtonsProps {
  title: string;
  username: string;
  year: number;
  stats: {
    plays: number;
    hours: number;
    topGenre: string;
    actorsCount: number;
    countriesCount: number;
    busiestMonth: string;
    tvEpisodes?: number;
    movies?: number;
    topMovie?: string;
    topMoviePoster?: string;
    topMovieRuntime?: string;
    topShow?: string;
    topShowPoster?: string;
    topShowRuntime?: string;
  };
  slideType?: "summary" | "stats" | "top-content";
}

export function ShareButtons({
  title,
  username,
  year,
  stats,
  slideType = "summary",
}: ShareButtonsProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatRuntime = (runtime: string) => {
    if (!runtime) return "";
    if (runtime.toLowerCase().includes("m")) return runtime;
    return `${runtime} min`;
  };

  const shareText = t("share.shareText")
    .replace("{year}", year.toString())
    .replace("{plays}", stats.plays.toString())
    .replace("{hours}", stats.hours.toString())
    .replace("{genre}", stats.topGenre);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const generateImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    setGenerating(true);
    try {
      // Wait for fonts to load
      await document.fonts.ready;

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 1, // We are already sizing the div at 1080x1920
        backgroundColor: "#020617", // Ensure background is set
        fontEmbedCSS: "", // Disable font embedding to prevent "font is undefined" error
      });

      // Convert dataURL to Blob
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (err) {
      console.error("Failed to generate image:", err);
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fileName = t("share.filename")
      .replace("{username}", username)
      .replace("{year}", year.toString())
      .concat(`-${slideType}`);
    a.download = `${fileName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareImage = async () => {
    const blob = await generateImage();
    if (!blob) return;

    try {
      const fileName = t("share.filename")
        .replace("{username}", username)
        .replace("{year}", year.toString())
        .concat(`-${slideType}`);
      const file = new File([blob], `${fileName}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: shareText,
        });
      } else {
        alert(t("wrapped.shareNotSupported"));
      }
    } catch (err) {
      console.error("Error sharing image:", err);
      alert(t("wrapped.shareNotSupported"));
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          disabled={generating}
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? t("share.copied") : t("share.copyStats")}
        </Button>

        <Button
          onClick={downloadImage}
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          disabled={generating}
        >
          <Download className="w-4 h-4 mr-2" />
          {generating ? t("share.generating") : t("share.downloadImage")}
        </Button>

        <Button
          onClick={shareImage}
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          disabled={generating}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t("share.shareImage")}
        </Button>
      </div>

      {/* Hidden container for image generation */}
      <div className="fixed left-[-9999px] top-0 overflow-hidden">
        <div
          ref={cardRef}
          className="w-[1080px] h-[1920px] relative flex flex-col items-center justify-center p-16"
          style={{
            background: "linear-gradient(to bottom right, #0f172a, #020617)",
            color: "#ffffff",
          }}
        >
          {/* Background Blobs */}
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3"
            style={{ backgroundColor: "rgba(124, 58, 237, 0.2)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"
            style={{ backgroundColor: "rgba(219, 39, 119, 0.2)" }}
          />

          {/* Card Content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-20">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-[140px] font-bold leading-none tracking-tighter">
                {year}
              </h1>
              <div
                className="text-[50px] font-extrabold tracking-[0.2em]"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                WRAPPED
              </div>
              <div
                className="w-32 h-1 mx-auto my-8"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              />
              <div
                className="text-[40px] font-medium"
                style={{ color: "#a78bfa" }}
              >
                @{username}
              </div>
            </div>

            {/* Main Content based on slideType */}
            <div className="flex-1 flex flex-col justify-center w-full max-w-[880px]">
              {slideType === "summary" && (
                <div className="grid grid-cols-2 gap-x-12 gap-y-20">
                  <StatItem
                    label={t("wrapped.totalPlays")}
                    value={formatNumber(stats.plays)}
                  />
                  <StatItem
                    label={t("wrapped.hoursWatched")}
                    value={formatNumber(stats.hours)}
                    accent
                  />
                  <StatItem
                    label={t("wrapped.topGenre")}
                    value={stats.topGenre}
                  />
                  <StatItem
                    label={t("wrapped.busiestMonth")}
                    value={stats.busiestMonth}
                  />
                  <StatItem
                    label={t("wrapped.actorsSeen")}
                    value={stats.actorsCount.toString()}
                  />
                  <StatItem
                    label={t("wrapped.countriesLabel")}
                    value={stats.countriesCount.toString()}
                  />
                </div>
              )}

              {slideType === "top-content" && (
                <div className="flex justify-center items-start gap-12 w-full px-8">
                  {stats.topMovie && (
                    <div className="flex flex-col items-center space-y-6 w-1/2">
                      <div
                        className="text-[32px] font-semibold uppercase tracking-wider"
                        style={{ color: "#f472b6" }}
                      >
                        {t("wrapped.topMovie")}
                      </div>
                      {stats.topMoviePoster ? (
                        <div className="relative w-64 h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={stats.topMoviePoster}
                            alt={stats.topMovie}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="text-[36px] font-bold leading-tight text-center line-clamp-2">
                        {stats.topMovie}
                      </div>
                      {stats.topMovieRuntime && (
                        <div className="text-[24px] font-medium opacity-75">
                          {t("wrapped.runtime")}:{" "}
                          {formatRuntime(stats.topMovieRuntime)}
                        </div>
                      )}
                    </div>
                  )}
                  {stats.topShow && (
                    <div className="flex flex-col items-center space-y-6 w-1/2">
                      <div
                        className="text-[32px] font-semibold uppercase tracking-wider"
                        style={{ color: "#a78bfa" }}
                      >
                        {t("wrapped.topShow")}
                      </div>
                      {stats.topShowPoster ? (
                        <div className="relative w-64 h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={stats.topShowPoster}
                            alt={stats.topShow}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="text-[36px] font-bold leading-tight text-center line-clamp-2">
                        {stats.topShow}
                      </div>
                      {stats.topShowRuntime && (
                        <div className="text-[24px] font-medium opacity-75">
                          {t("wrapped.runtime")}:{" "}
                          {formatRuntime(stats.topShowRuntime)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {slideType === "stats" && (
                <div className="space-y-16">
                  <StatRow
                    label={t("wrapped.totalPlays")}
                    value={formatNumber(stats.plays)}
                  />
                  <StatRow
                    label={t("wrapped.hoursWatched")}
                    value={formatNumber(stats.hours)}
                    accent
                  />
                  <StatRow
                    label={t("wrapped.topGenre")}
                    value={stats.topGenre}
                  />
                  <StatRow
                    label={t("wrapped.actorsSeen")}
                    value={stats.actorsCount.toString()}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="text-[28px] font-semibold tracking-widest uppercase"
              style={{ color: "rgba(255, 255, 255, 0.3)" }}
            >
              Trakt Stats
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-[32px] font-semibold uppercase tracking-wide"
        style={{ color: "rgba(255, 255, 255, 0.5)" }}
      >
        {label}
      </div>
      <div
        className="text-[72px] font-bold leading-none"
        style={{ color: accent ? "#f472b6" : "#ffffff" }}
      >
        {value}
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between pb-8"
      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
    >
      <div
        className="text-[40px] font-semibold uppercase tracking-wide"
        style={{ color: "rgba(255, 255, 255, 0.5)" }}
      >
        {label}
      </div>
      <div
        className="text-[80px] font-bold leading-none"
        style={{ color: accent ? "#f472b6" : "#ffffff" }}
      >
        {value}
      </div>
    </div>
  );
}
