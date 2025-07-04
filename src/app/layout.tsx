import type { Metadata } from "next";
import { ThemeProvider } from "~/components/home/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StrictMode } from "react";
import { Toaster } from "~/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sphere",
  description: "Connect in your digital sphere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StrictMode>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} dark:antialiased subpixel-antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
          <Toaster/>
        </body>
      </html>
    </StrictMode>
  );
}
