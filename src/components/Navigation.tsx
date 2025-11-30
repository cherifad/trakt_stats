"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Tv,
  Film,
  Users,
  Clapperboard,
  Sparkles,
  Upload,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "@/hooks/useTranslations";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("nav.dashboard"), href: "/", icon: Home },
    { name: t("nav.wrapped"), href: "/wrapped", icon: Sparkles },
    { name: t("nav.tvShows"), href: "/tv", icon: Tv },
    { name: t("nav.movies"), href: "/movies", icon: Film },
    { name: t("nav.actors"), href: "/actors", icon: Users },
    { name: t("nav.directors"), href: "/directors", icon: Clapperboard },
    { name: t("nav.upload"), href: "/upload", icon: Upload },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass sticky top-0 z-50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Film className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
              </motion.div>
              <span className="ml-2 text-base sm:text-lg md:text-xl font-bold bg-linear-to-r from-purple-700 via-purple-500 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                {t("nav.brandName")}
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-baseline space-x-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "relative px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all flex items-center gap-1.5 xl:gap-2 group",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <Icon className="h-3.5 w-3.5 xl:h-4 xl:w-4 relative z-10 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/10 dark:border-white/5 overflow-hidden bg-background/95 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "relative px-3 py-2 rounded-md text-base font-medium transition-all flex items-center gap-2",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
