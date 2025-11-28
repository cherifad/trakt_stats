'use client';

import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { RequireUpload } from "@/components/RequireUpload";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isWrappedPage = pathname === '/wrapped';
  const isUploadPage = pathname === '/upload';

  return (
    <html lang="en" suppressHydrationWarning>
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
          </RequireUpload>
        </ThemeProvider>
      </body>
    </html>
  );
}
