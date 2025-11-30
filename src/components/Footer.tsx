"use client";

import { Github, Heart } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-12 border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{t("footer.madeWithLove")}</span>
          <a
            href="https://github.com/cherifad"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline flex items-center gap-1"
          >
            Cherifad
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/cherifad/trakt_stats"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>{t("footer.viewOnGithub")}</span>
          </a>
          
          <div className="flex items-center gap-1">
            <span>{t("footer.poweredBy")}</span>
            <a
              href="https://trakt.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-red-500 transition-colors"
            >
              Trakt
            </a>
            <span>&</span>
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-blue-400 transition-colors"
            >
              TMDB
            </a>
          </div>
        </div>

        <div className="text-xs opacity-60">
          © {currentYear} Trakt Stats
        </div>
      </div>
    </footer>
  );
}
