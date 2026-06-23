import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TabNav from "@/components/TabNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Network+ Prep · N10-009",
  description:
    "Interactive CompTIA Network+ (N10-009) study site — visual demos, open-recall questions, and performance-based practice across all five domains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <TabNav />
        <main className="flex-1 py-8 sm:py-10">{children}</main>
        <footer className="border-t border-line-soft py-6 text-center text-xs text-faint">
          Network+ Prep · CompTIA N10-009 · built for Tim&apos;s retake
        </footer>
      </body>
    </html>
  );
}
