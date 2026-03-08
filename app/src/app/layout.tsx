import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider/ThemeProvider";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  title: "SafePulse Academy",
  description: "Evidence-based courses on performance science, harm reduction, and longevity.",
  keywords: ["SafePulse", "performance science", "harm reduction", "longevity", "courses", "education"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
