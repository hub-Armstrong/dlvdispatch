import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DLVdispatch – Fast Local Dispatch in Warri & Effurun",
  description:
    "Book reliable dispatch riders in Warri, Effurun and Delta State. Track your deliveries in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

