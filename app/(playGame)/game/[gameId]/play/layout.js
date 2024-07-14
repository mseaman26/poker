import { AuthProvider } from "@/app/Providers";

import "@/app/globals.css";
export const metadata = {
  title: `Mike's Friendly Poker`,
  description: 'The friendliest of poker games',
  'apple-mobile-web-app-capable': 'yes',
}
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
  )
}
