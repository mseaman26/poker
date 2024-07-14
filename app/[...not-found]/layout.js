export const metadata = {
  title: 'Next.js',
  description: 'The friendliest of poker games',
}
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
