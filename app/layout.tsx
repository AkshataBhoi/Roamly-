import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roamly — Make the most of your time",
  description: "Lightweight local place recommendation app. Tell us how much time you have and what you're in the mood for.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-[#D4E8CF] selection:text-primary">
        {children}
      </body>
    </html>
  );
}
