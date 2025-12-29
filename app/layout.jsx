import { Inter, IBM_Plex_Mono } from "next/font/google"
import { Source_Serif_4 as Source_Serif_Pro } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const sourceSerifPro = Source_Serif_Pro({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  display: "swap",
})

export const metadata = {
  title: "Image Management System",
  description: "Professional social media image management dashboard",
  generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerifPro.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      {/* Removed isolation: isolate, position: relative, zIndex: 0 from body style
          These were creating stacking context conflicts that prevented Dialog from displaying in production */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
