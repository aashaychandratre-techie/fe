import type { Metadata } from "next";
import ThemeProviderWrapper from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServiceSphere",
  description: "Book trusted local services and manage customer, vendor, and admin workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  );
}