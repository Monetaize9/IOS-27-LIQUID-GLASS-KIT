import type { Metadata } from "next";
import { Toaster } from "liquid-glass-kit";
import "liquid-glass-kit/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liquid Glass Kit",
  description: "iOS 27 Liquid Glass components, tokens and motion for React and Next.js.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
