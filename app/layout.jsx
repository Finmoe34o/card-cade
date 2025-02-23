import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Card Cade",
  description: "Card Cade brings a sleek look to the classic game of poker",

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} w-[100vw] h-[100vh] overflow-hidden bg-black antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
