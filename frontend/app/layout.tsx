import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OptimLinéaire',
  description: 'Application d\'optimisation linéaire avec méthodes Simplexe et Big M',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

