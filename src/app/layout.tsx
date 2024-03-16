import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { MenuBar } from "@/components/menuBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Extensio extension repository",
  description: "all extensions for the extensio code editor",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <html lang="en">
      <head>
        <SpeedInsights />
      </head>
      <body className={inter.className}>
      <main className="flex min-h-screen flex-col justify-start space-y-10 p-5">
        <MenuBar />
        <div id="mainContent">
          {children}
        </div>
      </main>
      </body>
    </html>
  );
}
