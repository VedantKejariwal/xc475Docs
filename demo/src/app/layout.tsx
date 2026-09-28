import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABUJA | A clearer way to explore Boston",
  description: "A map-first rental discovery prototype for newcomer renters.",
};

// Every page shares this HTML shell. The interactive demo lives in page.tsx.
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
