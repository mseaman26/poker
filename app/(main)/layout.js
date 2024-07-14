import { AuthProvider } from "../Providers";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import NavBar from "@/components/nav/NavBar";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mike's Friendly Poker",
  description: "The friendliest of poker games",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta http-equiv="Accept-CH" content="DPR"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <link
        rel="icon"
        href="/assets/icons/twoCards.png"
        type="image/<generated>"
        sizes="<generated>"
        />
      </Head>
      <body className={inter.className}>
        <AuthProvider>
          <NavBar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
