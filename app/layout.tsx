import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./utils/fontawesome";
import { AlertProvider } from "./context/AlertProvider";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Pempek & Resto 19",
   description: "Pempek & Resto 19",
   generator: "Next.js",
   manifest: "/app/manifest.json",
   icons: [
      { rel: "apple-touch-icon", url: "icons/icons-128.png" },
      { rel: "icon", url: "icons/icons-128.png" },
   ],
};

export const viewport = {
   content:
      "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
   themeColor: [
      { media: "(prefers-color-scheme: dark)", color: "#fff" },
      { media: "(prefers-color-scheme: light)", color: "#000" },
   ],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
            <AlertProvider>{children}</AlertProvider>
         </body>
      </html>
   );
}
