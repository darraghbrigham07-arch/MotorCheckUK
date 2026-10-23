import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer, CookieNotice } from "@/components/SiteChrome";
export const metadata: Metadata = {
  title: { default: "MotorCheck UK | Vehicle checks, made clearer", template: "%s | MotorCheck UK" },
  description: "Understand a used car before you buy. Clear vehicle information, MOT history and enhanced history checks from MotorCheck UK.",
  applicationName: "MotorCheck UK",
  icons: { icon: [{ url: "/motorcheck-shield.jpg", type: "image/jpeg", sizes: "512x512" }], shortcut: ["/motorcheck-shield.jpg"], apple: [{ url: "/motorcheck-shield.jpg", sizes: "512x512", type: "image/jpeg" }] },
  openGraph: { title: "MotorCheck UK", description: "Look beyond the paintwork. Get a clearer picture before you buy.", siteName: "MotorCheck UK", type: "website" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en-GB"><body><Header />{children}<Footer /><CookieNotice /></body></html>; }
