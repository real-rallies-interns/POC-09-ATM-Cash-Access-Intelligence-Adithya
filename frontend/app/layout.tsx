import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATM Access Intelligence",
  description: "PoC 09 Cash Access Intelligence System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}