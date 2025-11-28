import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trakt Stats",
  description: "GUI for Trakt VIP Stats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
