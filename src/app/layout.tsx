"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { RequireUpload } from "@/components/RequireUpload";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isWrappedPage = pathname === "/wrapped";
  const isUploadPage = pathname === "/upload";

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Trakt Stats" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Trakt Stats" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RequireUpload>
            {!isWrappedPage && !isUploadPage && <Navigation />}
            <main>{children}</main>
            {!isWrappedPage && <Footer />}
          </RequireUpload>
        </ThemeProvider>
      </body>
    </html>
  );
}
