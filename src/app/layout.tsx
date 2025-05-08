import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import CustomLayout from "@/custom-layout";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "TrackyFy",
  description: "Gym Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <CustomLayout>{children}</CustomLayout>
          <SpeedInsights />
          <Toaster position="top-center" reverseOrder={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
