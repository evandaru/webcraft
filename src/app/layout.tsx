import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "WebCraft — AI Landing Page Builder",
    template: "%s | WebCraft",
  },
  description:
    "Describe it. Build it. Launch it. — AI-powered landing page builder. Ketik prompt, dapatkan landing page HTML lengkap dalam detik.",
  keywords: ["landing page", "AI builder", "website generator"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
