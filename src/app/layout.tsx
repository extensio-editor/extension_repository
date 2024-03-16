import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Image from "next/image";
import { getServerSession } from "next-auth/next"
import authOptions from "@/../lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Extensio extension repository",
  description: "all extensions for the extensio code editor",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const signedIn = !session as boolean;

  return (
    <html lang="en">
      <head>
        <SpeedInsights />
      </head>
      <body className={inter.className}>
      <main className="flex min-h-screen flex-col justify-start space-y-10 p-5">
        <div className="flex flex-row content-center items-center space-x-5">
          <a href="/">
            <Image
              src="/extensio+repo+dark.svg"
              alt="Extension repository"
              width={75}
              height={24}
              priority
            />
          </a>
          <nav className="flex space-x-10 flex-grow">
            <a href="/browse" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Browse extensions</a>
            <a href="/new" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Register new extension</a>
            <a href="https://docs.extensio.xyz/extensions" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Documentation</a>
          </nav>
          <form action="/search" method="get">
            <input type="text" name="q" placeholder="Search" className="p-1 pl-2 rounded-xl opacity-70 self-end dark:bg-slate-700" autoComplete="off" autoCorrect="off" autoCapitalize="off"/>
          </form>
          {
            signedIn ?
              <a href="/api/auth/signin" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Sign in</a>
            : <a href="/api/auth/signout" className="text-lg ease-linear duration-75 hover:text-xl hover:underline">Sign out</a>
          }
        </div>
        <div id="mainContent">
          {children}
        </div>
      </main>
      </body>
    </html>
  );
}
