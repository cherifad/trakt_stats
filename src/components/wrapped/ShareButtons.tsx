"use client";

import { Button } from "@/components/ui/button";
import { Download, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

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
    topShow?: string;
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

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const shareText =
    `🎬 My ${year} Trakt Wrapped:\n\n` +
    `📺 ${stats.plays} titles watched\n` +
    `⏱️ ${stats.hours} hours of content\n` +
    `🎭 Favorite genre: ${stats.topGenre}\n\n` +
    `#TraktWrapped #YearInReview`;

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
    setGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Could not get canvas context");
        return null;
      }

      // Create gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "rgb(219, 39, 119)");
      gradient.addColorStop(0.5, "rgb(147, 51, 234)");
      gradient.addColorStop(1, "rgb(79, 70, 229)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      // Generate different content based on slideType
      if (slideType === "summary") {
        // Enhanced summary with more stats
        ctx.font = "bold 80px system-ui, -apple-system, sans-serif";
        ctx.fillText(t("wrapped.thatsAWrap"), canvas.width / 2, 180);

        ctx.font = "38px system-ui, -apple-system, sans-serif";
        ctx.globalAlpha = 0.9;
        ctx.fillText(
          `🎬 ${username}'s ${year} Trakt Wrapped`,
          canvas.width / 2,
          260
        );
        ctx.globalAlpha = 1;

        // Main stats in larger format
        const mainStats = [
          {
            emoji: "📺",
            value: formatNumber(stats.plays),
            label: t("wrapped.totalPlays"),
          },
          {
            emoji: "⏱️",
            value: formatNumber(stats.hours),
            label: t("wrapped.hoursWatched"),
          },
        ];

        let yPos = 400;
        mainStats.forEach((stat) => {
          ctx.font = "60px system-ui, -apple-system, sans-serif";
          ctx.globalAlpha = 0.9;
          ctx.fillText(stat.emoji, canvas.width / 2 - 250, yPos);
          ctx.globalAlpha = 1;

          ctx.font = "bold 110px system-ui, -apple-system, sans-serif";
          ctx.fillText(stat.value, canvas.width / 2 + 80, yPos);

          ctx.font = "32px system-ui, -apple-system, sans-serif";
          ctx.globalAlpha = 0.75;
          ctx.fillText(stat.label, canvas.width / 2 + 80, yPos + 50);
          ctx.globalAlpha = 1;

          yPos += 200;
        });

        // Secondary stats grid
        const secondaryStats = [
          { value: stats.topGenre, label: t("wrapped.topGenre"), emoji: "🎭" },
          {
            value: stats.actorsCount.toString(),
            label: t("wrapped.actorsSeen"),
            emoji: "⭐",
          },
          {
            value: stats.countriesCount.toString(),
            label: t("wrapped.countriesLabel"),
            emoji: "🌍",
          },
          {
            value: stats.busiestMonth,
            label: t("wrapped.busiestMonth"),
            emoji: "📅",
          },
        ];

        if (stats.tvEpisodes && stats.movies) {
          secondaryStats.push(
            {
              value: formatNumber(stats.tvEpisodes),
              label: t("wrapped.tvEpisodes"),
              emoji: "📺",
            },
            {
              value: formatNumber(stats.movies),
              label: t("wrapped.movies"),
              emoji: "🎬",
            }
          );
        }

        const gridStartY = 850;
        const gridSpacing = 180;
        const gridCols = 2;

        secondaryStats.forEach((stat, index) => {
          const row = Math.floor(index / gridCols);
          const col = index % gridCols;
          const x = col === 0 ? canvas.width / 3 : (canvas.width * 2) / 3;
          const y = gridStartY + row * gridSpacing;

          ctx.font = "40px system-ui, -apple-system, sans-serif";
          ctx.fillText(stat.emoji, x, y - 30);

          ctx.font = "bold 70px system-ui, -apple-system, sans-serif";
          ctx.fillStyle = "white";
          ctx.fillText(stat.value, x, y + 30);

          ctx.font = "26px system-ui, -apple-system, sans-serif";
          ctx.globalAlpha = 0.75;
          ctx.fillText(stat.label, x, y + 65);
          ctx.globalAlpha = 1;
        });

        // Footer
        ctx.font = "32px system-ui, -apple-system, sans-serif";
        ctx.globalAlpha = 0.8;
        ctx.fillText(
          "#TraktWrapped #YearInReview",
          canvas.width / 2,
          canvas.height - 80
        );
      } else if (
        slideType === "top-content" &&
        (stats.topMovie || stats.topShow)
      ) {
        // Top content slide
        ctx.font = "bold 72px system-ui, -apple-system, sans-serif";
        ctx.fillText(
          t("wrapped.topContent") || "Top Content",
          canvas.width / 2,
          180
        );

        ctx.font = "36px system-ui, -apple-system, sans-serif";
        ctx.globalAlpha = 0.9;
        ctx.fillText(`${username} • ${year}`, canvas.width / 2, 250);
        ctx.globalAlpha = 1;

        let contentYPos = 450;

        if (stats.topMovie) {
          ctx.font = "48px system-ui, -apple-system, sans-serif";
          ctx.fillText("🎬", canvas.width / 2, contentYPos);

          ctx.font = "42px system-ui, -apple-system, sans-serif";
          ctx.globalAlpha = 0.8;
          ctx.fillText(
            t("wrapped.topMovie") || "Top Movie",
            canvas.width / 2,
            contentYPos + 60
          );
          ctx.globalAlpha = 1;

          ctx.font = "bold 58px system-ui, -apple-system, sans-serif";
          const movieLines = wrapText(ctx, stats.topMovie, canvas.width - 200);
          movieLines.forEach((line, idx) => {
            ctx.fillText(line, canvas.width / 2, contentYPos + 140 + idx * 65);
          });

          contentYPos += 350;
        }

        if (stats.topShow) {
          ctx.font = "48px system-ui, -apple-system, sans-serif";
          ctx.fillText("📺", canvas.width / 2, contentYPos);

          ctx.font = "42px system-ui, -apple-system, sans-serif";
          ctx.globalAlpha = 0.8;
          ctx.fillText(
            t("wrapped.topShow") || "Top Show",
            canvas.width / 2,
            contentYPos + 60
          );
          ctx.globalAlpha = 1;

          ctx.font = "bold 58px system-ui, -apple-system, sans-serif";
          const showLines = wrapText(ctx, stats.topShow, canvas.width - 200);
          showLines.forEach((line, idx) => {
            ctx.fillText(line, canvas.width / 2, contentYPos + 140 + idx * 65);
          });
        }

        // Footer
        ctx.font = "32px system-ui, -apple-system, sans-serif";
        ctx.globalAlpha = 0.8;
        ctx.fillText("#TraktWrapped", canvas.width / 2, canvas.height - 80);
      } else {
        // Generic stats slide
        ctx.font = "bold 72px system-ui, -apple-system, sans-serif";
        ctx.fillText(title || t("wrapped.yourStats"), canvas.width / 2, 180);

        ctx.font = "36px system-ui, -apple-system, sans-serif";
        ctx.globalAlpha = 0.9;
        ctx.fillText(`${username} • ${year}`, canvas.width / 2, 250);
        ctx.globalAlpha = 1;

        // Display available stats
        const availableStats = [
          stats.plays && {
            emoji: "📺",
            value: formatNumber(stats.plays),
            label: t("wrapped.totalPlays"),
          },
          stats.hours && {
            emoji: "⏱️",
            value: formatNumber(stats.hours),
            label: t("wrapped.hoursWatched"),
          },
          stats.topGenre && {
            emoji: "🎭",
            value: stats.topGenre,
            label: t("wrapped.topGenre"),
          },
          stats.actorsCount && {
            emoji: "⭐",
            value: stats.actorsCount.toString(),
            label: t("wrapped.actorsSeen"),
          },
          stats.countriesCount && {
            emoji: "🌍",
            value: stats.countriesCount.toString(),
            label: t("wrapped.countriesLabel"),
          },
          stats.busiestMonth && {
            emoji: "📅",
            value: stats.busiestMonth,
            label: t("wrapped.busiestMonth"),
          },
        ].filter(Boolean);

        const startY = 450;
        const spacing = 240;

        availableStats.forEach((stat, index) => {
          if (!stat) return;
          const y = startY + index * spacing;

          ctx.font = "56px system-ui, -apple-system, sans-serif";
          ctx.fillText(stat.emoji, canvas.width / 2 - 280, y);

          ctx.font = "bold 90px system-ui, -apple-system, sans-serif";
          ctx.fillText(stat.value, canvas.width / 2 + 80, y);

          ctx.font = "32px system-ui, -apple-system, sans-serif";
          ctx.globalAlpha = 0.75;
          ctx.fillText(stat.label, canvas.width / 2 + 80, y + 50);
          ctx.globalAlpha = 1;
        });

        // Footer
        ctx.font = "32px system-ui, -apple-system, sans-serif";
        ctx.globalAlpha = 0.8;
        ctx.fillText("#TraktWrapped", canvas.width / 2, canvas.height - 80);
      }

      ctx.globalAlpha = 1;

      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/png");
      });
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
    // Translatable filename
    const fileName = t("share.filename")
      .replace("{username}", username)
      .replace("{year}", year.toString());
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
        .replace("{year}", year.toString());
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
        // Fallback to download if sharing is not supported
        await downloadImage();
      }
    } catch (err) {
      console.error("Error sharing image:", err);
      // Fallback to download on error
      await downloadImage();
    }
  };

  return (
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
  );
}
