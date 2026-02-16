import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DermaTrack AI — Acne Progression Tracker",
  description:
    "AI-powered dermatological analytics platform for tracking and improving your skin health.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
