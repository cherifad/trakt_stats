"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Film, Tv, Ghost } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

      {/* Floating Icons Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Film className="absolute top-1/4 left-1/4 w-12 h-12 animate-bounce duration-[3000ms]" />
        <Tv className="absolute bottom-1/3 right-1/4 w-16 h-16 animate-bounce duration-[4000ms]" />
        <Ghost className="absolute top-1/3 right-1/3 w-10 h-10 animate-pulse duration-[2000ms]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-in fade-in zoom-in duration-1000">
          404
        </h1>

        <div className="space-y-6 mt-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white/90">
            {t("notFound.title")}
          </h2>
          <p className="text-xl text-white/60 max-w-md mx-auto">
            {t("notFound.description")}
          </p>

          <div className="pt-8">
            <Link href="/">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
              >
                <Home className="mr-2 w-5 h-5" />
                {t("notFound.backToDashboard")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-white/30 text-sm">
        {t("notFound.errorCode")}
      </div>
    </div>
  );
}
