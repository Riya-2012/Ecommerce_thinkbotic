import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Layouts/Navbar";
import Footer from "./components/Layouts/Footer";
import CatNavbar from "./components/Layouts/CatNavbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import 'animate.css';
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WhishlistContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Thinkbotic - Best E-commerce Products",
  description: "Shop the latest products at Thinkbotic. Great deals, fast shipping, and quality service.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>

        <AuthProvider>
           <CartProvider>

    <WishlistProvider>  
          <Navbar />
        <CatNavbar />
        <Toaster position="top-right" />
        {children}
        <Footer />
        </WishlistProvider>
        </CartProvider>
        </AuthProvider>
        </body>
    </html>
  );
}
